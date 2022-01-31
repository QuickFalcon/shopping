'use strict';

var config = require(process.cwd() + '/config'),
    prosperent = require(process.cwd() + '/server/lib/prosperent'),
    mongoose = require('mongoose'),
    objectId = mongoose.Types.ObjectId,
    Product = mongoose.model('Product'),
    Like = mongoose.model('Like'),
    Mail = mongoose.model('Mail'),
    Rate = mongoose.model('Rate'),
    async = require('async'),
    cheerio = require('cheerio'), // for html parsing loading
    fr = require('follow-redirects').http, // follow redirect
    request = require('request'),
    rp = require('request-promise'),
    fs = require('fs'),
    os = require('os'),
    httpx = require('http');

    // getting color name from color code

exports.productApisearch = function (req, res, next) {

  var sendRes,
      sesid = req.user && req.user._id;

  prosperent
  .search(req.body.path) // get the search

  // get the ids
    .then(function(response) {

      var ids = [];
      sendRes = response;

      if (response.data === '') {
        console.log('response empty result');

      } else {
        response.data.forEach(function(prod) {
          ids.push(prod.catalogId);
        });
      }

      return ids;
    })

   .then(function (ids) {

     var fns = [
       Like.aggregate([
        { $match: { catalogId: { $in: ids } } },
        { $group: { _id: '$catalogId', total: { $sum: 1 } } }
       ]),
       Mail.aggregate([
        { $match: { catalogId: { $in: ids } } },
        { $group: { _id: '$catalogId', total: { $sum: 1 } } }
       ]),
       Rate.aggregate([
        { $match: { catalogId: { $in: ids } } },
        { $group: { _id: '$catalogId', total: { $sum: 1 } } }
       ])
     ];

    // user fns
     if (sesid) {
       fns.push(Like.aggregate([
        { $match: { catalogId: { $in: ids }, user: objectId(sesid) } },
        { $group: { _id: '$catalogId', total: { $sum: 1 } } }
       ]));
       fns.push(Mail.aggregate([
        { $match: { catalogId: { $in: ids }, user: objectId(sesid) } },
        { $group: { _id: '$catalogId', total: { $sum: 1 } } }
       ]));
       fns.push(Rate.aggregate([
        { $match: { catalogId: { $in: ids }, user: objectId(sesid) } },
        { $group: { _id: '$catalogId', total: { $sum: 1 } } }
       ]));
     }

     return fns;
   })
    .spread(function(likes, mails, collectives, userLikes, userMails, userCollectives) {

      var social = {
        likes: {},
        mails: {},
        collectives: {},
        userLikes: {},
        userMails: {},
        userCollectives: {}
      };
      if (likes && likes.length) {

        likes.forEach(function(like) {
          social.likes[like._id] = like.total;
        });

      }

      if (mails && mails.length) {
        mails.forEach(function(mail) {
          social.mails[mail._id] = mail.total;
        });
      }

      if (collectives && collectives.length) {

        collectives.forEach(function(collective) {
          social.collectives[collective._id] = collective.total;
        });
      }

      if (userLikes && userLikes.length) {

        userLikes.forEach(function(like) {
          social.userLikes[like._id] = like.total;
        });

      }

      if (userMails && userMails.length) {
        userMails.forEach(function(mail) {
          social.userMails[mail._id] = mail.total;
        });

      }

      if (userCollectives && userCollectives.length) {
        userCollectives.forEach(function(collective) {
          social.userCollectives[collective._id] = collective.total;
        });
      }

      if (sendRes.data === '') {

        console.log(sendRes);
      } else {

        sendRes.data.forEach(function(prod, k) {
          sendRes.data[k].social = {
            likes: social.likes[prod.catalogId],
            mails: social.mails[prod.catalogId],
            collectives: social.collectives[prod.catalogId]
          };

          sendRes.data[k].userSocial = {
            likes: social.userLikes[prod.catalogId],
            mails: social.userMails[prod.catalogId],
            collectives: social.userCollectives[prod.catalogId]
          };
        });
      }

      return res.send(sendRes);
    })
    .catch(next);
};

exports.wpproductApisearch = function (req, res, next) {

  var searchString = req.params.path;
  var url = 'http://api.prosperent.com/api/search?api_key=' + config.prosperent.apiKey + '&filterTwoTapSupported=1' + searchString;

  request({
    url: url,
    method: 'GET'
  }, function (err, response, body) {
    if (err) {
      console.log(err);
      res.end();

      return next(err);
    }

    if (response.statusCode === 200 || response.statusCode === 304) {
      var dataArray = JSON.parse(body); // list of products by

      res.send(dataArray);
    } else {

      res.end();
    }
  });
};

exports.productApisearchMain = function (req, res, next) {

  var searchString = req.body.path;
 // var sort = req.body.sortAction;
  var url = '';

   // if(sort)
   // url ="http://api.prosperent.com/api/search?" + searchString + "&api_key=" + config.prosperent.apiKey+"&sortBy="+sort;
   // else
  url = 'http://api.prosperent.com/api/search?' + searchString + '&api_key=' + config.prosperent.apiKey;

  var options = {
    uri: url,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    timeout: 60000,
    simple: true,
    json: true // Automatically parses the JSON string in the response

  };

  var options2nd = {
    uri: url,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    simple: true,
    timeout: 90000,
    json: true // Automatically parses the JSON string in the response

  };

  var options3rd = {
    uri: url,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    timeout: 120000,
    simple: true,
    json: true // Automatically parses the JSON string in the response

  };

  var stringsuccess;

  rp(options)
  .then(function (repos) {
    stringsuccess = '[' + url + '],Result:' + repos + '\n';
    fs.appendFile(process.cwd() + '/searchoutputlog.csv', stringsuccess, function(appenderr) {
      if (appenderr) {
        console.log('Last failed to append');
      }
      console.log('The final data was appended to file!');
    });

    console.log(repos.totalRecordsFound);
    if (repos.totalRecordsFound && repos.totalRecordsFound > 0) {
      return res.send(repos);
    } else {

      rp(options2nd)
                .then(function (repos2) {
                  console.log(repos2.totalRecordsFound);
                  if (repos2.totalRecordsFound && repos2.totalRecordsFound > 0) {
                    return res.send(repos2);
                  } else {

                    return res.send({});

                  }

                });

    }

  }, function (reason) {

    stringsuccess = '[' + url + '],Result:' + reason + '\n';

    console.log('Problem 1 productApisearchMain');
    console.log(reason.code === 'ETIMEDOUT');
    console.log(reason.connect === true); // connect time out
    console.log(reason);
    if (reason.code === 'ETIMEDOUT' || reason.code === 'ECONNRESET' || reason.connect) {
      rp(options2nd)
             .then(function (repos2) {

               if (repos2) {
                 stringsuccess = stringsuccess + ' Result 2nd:' + repos2 + '\n';
                 fs.appendFile(process.cwd() + '/searchoutputlog.csv', stringsuccess, function(appenderr) {
                   if (appenderr) {
                     console.log('Last failed to append');
                   }
                   console.log('The final data was appended to file!');
                 });

                 return res.send(repos2);

               } else {

                 stringsuccess = stringsuccess + +',Problem 2 :' + repos2 + '\n';

                 rp(options3rd)
                                     .then(function (repos3) {

                                       stringsuccess = stringsuccess + +',OK :' + repos3 + '\n';
                                       fs.appendFile(process.cwd() + '/searchoutputlog.csv', stringsuccess, function(appenderr) {
                                         if (appenderr) {
                                           console.log('Last failed to append');
                                         }
                                         console.log('The final data was appended to file!');
                                       });

                                       return res.send(repos3);

                                     })
                                    .catch(function (repos3e) {

                                      stringsuccess = stringsuccess + +',Problem 3e:' + repos3e + '\n';
                                      fs.appendFile(process.cwd() + '/searchoutputlog.csv', stringsuccess, function(appenderr) {
                                        if (appenderr) {
                                          console.log('Last failed to append');
                                        }
                                        console.log('The final data was appended to file!');
                                      });

                                      console.log(repos3e.code === 'ETIMEDOUT');
                                      console.log(repos3e.connect === true); // connect time out
                                      console.log(repos3e.code);
                                   //   res.end();

                                      return res.send({});

                                    });
               }

             }, function (reposFailed) {
               stringsuccess = stringsuccess + +',Problem reposFailed:' + reposFailed + '\n';

               rp(options3rd)
                    .then(function (repos3d) {
                      stringsuccess = stringsuccess + +',Solved  repos3d:' + repos3d + '\n';

                      fs.appendFile(process.cwd() + '/searchoutputlog.csv', stringsuccess, function(appenderr) {
                        if (appenderr) {
                          console.log('Last failed to append');
                        }
                        console.log('The final data was appended to file!');
                      });

                      return res.send(repos3d);

                    })
                     .catch(function (repos3ee) {
                       stringsuccess = stringsuccess + +',Failed  repos3ee:' + repos3ee + '\n';

                       fs.appendFile(process.cwd() + '/searchoutputlog.csv', stringsuccess, function(appenderr) {
                         if (appenderr) {
                           console.log('Last failed to append');
                         }
                         console.log('The final data was appended to file!');
                       });

                       console.log(repos3ee.code === 'ETIMEDOUT');
                       console.log(repos3ee.connect === true); // connect time out
                       console.log(repos3ee.code);
                                   //   res.end();

                       return res.send({});

                     });

             });

    } else {  // timeout else

      stringsuccess = stringsuccess + ',Failed  ' + reason + '\n';

      fs.appendFile(process.cwd() + '/searchoutputlog.csv', stringsuccess, function(appenderr) {
        if (appenderr) {
          console.log('Last failed to append');
        }
        console.log('The final data was appended to file!');
      });

      console.log(reason.code);
      console.log('I know u are here exit');

      return res.send({});
    }
  }).catch(next);

};
// different api key for counting

exports.productApisearchCorrect = function (req, res) {
  var searchString = req.body.path;
 // var sort = req.body.sortAction;
  var url = '';

   // if(sort)
   // url ="http://api.prosperent.com/api/search?" + searchString + "&api_key=" + config.prosperent.apiKey+"&sortBy="+sort;
   // else
  url = 'http://api.prosperent.com/api/search?' + searchString + '&api_key=' + config.prosperent.apiKey;

  // var url = 'http://api.prosperent.com/api/search?' + searchString + '&api_key=' + config.prosperent.apiKey;
  var options = {
    uri: url,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    timeout: 90000,
    simple: true,
    json: true // Automatically parses the JSON string in the response

  };

  var options2nd = {
    uri: url,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    simple: true,
    timeout: 120000,
    json: true // Automatically parses the JSON string in the response

  };

  var options3rd = {
    uri: url,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    timeout: 180000,
    simple: true,
    json: true // Automatically parses the JSON string in the response

  };

  rp(options)
  .then(function (repos) {

    if (repos.totalRecordsFound && repos.totalRecordsFound > 0) {
      return res.send(repos);
    } else {

      rp(options2nd)
                .then(function (repos2) {
                  if (repos2.totalRecordsFound && repos2.totalRecordsFound > 0) {
                    return res.send(repos2);
                  } else {

                    return res.send(repos2);

                  }

                }, function(reason) {

                  return res.send(reason);

                });

    }

  }, function (reason) {

    console.log('Problem Mer 1');
    console.log(reason.code === 'ETIMEDOUT');
    console.log(reason.connect === true); // connect time out

    if (reason.code === 'ETIMEDOUT' || reason.connect || reason.code === 'ECONNRESET') {
      rp(options2nd)
             .then(function (repos2) {

               if (repos2) {
                 return res.send(repos2);

               } else {

                 console.log('Problem mer 2');

                 rp(options3rd)
                                     .then(function (repos3) {
                                       return res.send(repos3);

                                     })
                                    .catch(function (repos3e) {

                                      console.log(repos3e.code === 'ETIMEDOUT');
                                      console.log(repos3e.connect === true); // connect time out
                                      console.log(repos3e.code);
                                   //   res.end();

                                      return res.send({});

                                    });
               }

             }, function (reposFailed) {
               console.log(reposFailed);
               rp(options3rd)
                    .then(function (repos3d) {
                      return res.send(repos3d);

                    })
                     .catch(function (repos3ee) {

                       console.log(repos3ee.code === 'ETIMEDOUT');
                       console.log(repos3ee.connect === true); // connect time out
                       console.log(repos3ee.code);
                                   //   res.end();

                       return res.send({});

                     });

             });

    } else {  // timeout else

      console.log(reason.code);
      console.log('I know u are here exit Mer ');

      return res.send(reason);
    }
  });
};

/*
exports.productApisearchCorrect = function (req, res, next) {

  prosperent
  .search(req.body.path) // get the search
   .then(function(response) {
     res.send(response);

   }, function(err) {
     console.log('count err' + err);
     res.end();

     return next(err);

   }

   );
};
*/
exports.productApisearchInterval = function (req, res, next) {

  var searchString = req.body.path;
  var url = 'http://api.prosperent.com/api/search?' + searchString + '&api_key=0da1ade1627ce72127d551d52d5b55e7';
  var count = 0;
  request({
    uri: url,
    method: 'GET',
    timeout: 120000
  }, function (err, response, body) {

    var interval = setInterval(function () {

      count += 1;
      if (err) {
        console.log(err.code);
        clearInterval(interval);

        res.end();

        return next(err);
      } else if (response.statusCode >= 200 && response.statusCode <= 299) {

        clearInterval(interval);

        res.send(body);

      } else if (count > 120) {

        clearInterval(interval);
        res.end();
      }

    }, 1000, 'wait');

    // var dataArray;

  });
};

exports.productApisearchTrend = function (req, res, next) {

  var searchString = req.body.path;
  var url = 'http://api.prosperent.com/api/trends?filterCommissionDate=20151101%2C20161208&' + searchString + '&api_key=' + config.prosperent.apiKey;

  request({
    url: url,
    method: 'GET'
  }, function (err, response, body) {
    if (err) { return next(err); }

    if (response.statusCode === 200 || response.statusCode === 304) {
      var dataArray = JSON.parse(body); // list of products by

      res.send(dataArray);
    }
  });
};

exports.productApisearchProductcount = function (req, res, next) {
  var searchString = req.body.path;
  var url = 'http://api.prosperent.com/api/search?' + searchString + '&api_key=0da1ade1627ce72127d551d52d5b55e7';
  var dataArray;
  request({
    url: url,
    method: 'GET'
  }, function (err, response, body) {

    if (err.code === 'ETIMEDOUT' || err.connect || err.code === 'ECONNRESET') {
      request({
        url: url,
        method: 'GET',
        timeout: 40000
      }, function (err2, response2, body2nd) {

        if (err2) {

          console.log('productApisearchProductcount 2nd try');
          console.log(err2);

          res.send(err2);

          return next(err2);

        } else {
          var dataArray2 = JSON.parse(body2nd); // list of products by
          res.send(dataArray2);
        }
      });

    } else {

      dataArray = JSON.parse(body); // list of products by
      res.send(dataArray);
    }
  }); // request end
}; // export end

exports.catalogApisearch = function (req, res, next) {

  var url = 'http://api.prosperent.com/api/search?api_key=0da1ade1627ce72127d551d52d5b55e7&filterCatalogId=' + req.params.item + '&filterTwoTapSupported=1';

  request({
    url: url,
    method: 'GET'
  }, function (err, response, body) {
    if (err) { return next(err); }

    if (response.statusCode === 200 || response.statusCode === 304) {
      var dataArray = JSON.parse(body), // list of products by
          D = dataArray.data;
      res.send(D[0]);
    }
  });
};

// API RELATED PART >> a. PROSPERENT >> ITEMS using Product ID(*****)
// THIS METHOD NEEDS REFACTORING
exports.productItem = function (req, proRes, next) {
  var url = 'http://api.prosperent.com/api/search?api_key=' + config.prosperent.apiKey + '&filterProductId=' + req.params.item;

  request({
    url: url,
    method: 'GET'
  }, function (err, response, body) {
    var dataArray = JSON.parse(body), // list of products by
        D = dataArray.data,
        totalrecordsavailable = dataArray.totalRecordsAvailable,
        afUrl,
        c;

    var requestCallback = function (err1, res1, body1) {
      if (err1) { return next(err1); }

      var html1 = body1,
          $ = cheerio.load(html1),
          meta = $('meta'),
          keys = Object.keys(meta),
          ur,
          canAcess = 0,
          z = c - 1; // require to chec

      keys.forEach(function (value, key) {
        if (meta[key].name === 'meta' && meta[key].attribs['http-equiv'] === 'refresh') {
          canAcess = 1;

          ur = meta[key].attribs.content;
          ur = ur.replace('0;url=', ''); // replace to get original url

          // //again sending request
          request({ url: ur, followRedirect: false }, function (e, r, body2) {
            var html2 = body2,
                $ = cheerio.load(html2),  // load the returned file
                meta2 = $('meta'),
                keys2 = Object.keys(meta2),
                ur2;

            keys2.forEach(function (value, key) {
              if (meta2[key].name === 'meta' && meta2[key].attribs['http-equiv'] === 'refresh') {
                ur2 = meta2[key].attribs.content;
                ur2 = ur2.replace('0;url=', '');
                request.get(ur2, function () {    // final request to get it
                  // // Following reder files

                  // dataArray.data[c].url =mytaptapurl;
                  //
                  if (totalrecordsavailable === z) {
                    proRes.send(dataArray);
                    canAcess = 1; // blocking next part to execute
                  }
                });// last request
              }
            });
          });// 2nd request
        }
      }); // keys for each end

      if (canAcess === 0) { // can_access is 0 when html has no body meta equiv refresh value  is empty
        // fr means follow redirect
        fr.get(afUrl, function () {
          if (totalrecordsavailable === z) {
            proRes.send(dataArray);
          }
        }).on('error', function (err) {
          return next(err);
        });
      } // can access end
    };

    // THIS c VARIABLE WILL NEVER WORK AS EXPECTED
    for (c = 0; c < totalrecordsavailable; c += 1) {
      afUrl = D[c].affiliate_url;
      request({ url: afUrl, followRedirect: false }, requestCallback); // request end
    } // doe loop end
    proRes.send(dataArray);
  });
}; // routing end

exports.productmultiple = function (req, res) {
  var productId = req.params.pid;

  request({
    url: 'http://api.prosperent.com/api/search?api_key=' + config.prosperent.apiKey + '&limit=1000&filterProductId=' + productId,
    method: 'GET'
  }, function (err, reponse, body) {
    res.send(JSON.parse(body).data);
  });
};

// show all suggestion of products from api data
// suggestion do not have limit
exports.suggestions = function (req, res, next) {
  // var selectedStr=req.params.search;
  var sugpath = req.params.sugpath,
      link;

  if (sugpath.indexOf('filterMerchant') > -1) {
    link = 'http://api.prosperent.com/api/search?api_key=' + config.prosperent.apiKey + sugpath + '&debugMode=true';
  } else {
    link = 'http://api.prosperent.com/api/search?api_key=' + config.prosperent.apiKey + sugpath + '&debugMode=true';
  }

  request({
    url: link,
    method: 'GET'
  }, function (err, reponse, body) {
    if (err) { return next(err); }

    if (body) {
      var sugData = JSON.parse(body);

      res.send(sugData);
    }
  });
};

// Show list of datas
exports.autocomplete = function (req, res, next) {
  //
  request({
    url: 'http://api.prosperent.com/api/search?api_key=' + config.prosperent.apiKey + config.merchantlist + '&limit=12&page=1',
    method: 'GET'
  }, function (err, response, body) {
    if (err) { return next(err); }

    res.send(JSON.parse(body).data);
  });
};

exports.autosuggestion = function (req, res, next) {
  // var selectedStr=req.params.search;
  var selectedStr = req.query.query,
      selectedCat = req.query.filterCategory,
      currentPage = req.query.currentpage,
      str;

  if (selectedStr === 'null') {
    str = '&filterCategory=' + selectedCat;
  } else {
    str = '&query=' + selectedStr + '&filterCategory=' + selectedCat;
  }
  str += config.merchantlist;

  request({
    url: 'http://api.prosperent.com/api/search?api_key=' + config.prosperent.apiKey + str + '&limit=12&page=' + currentPage,
    method: 'GET'
  }, function (err, response, body) {
    if (err) { return next(err); }

    res.send(JSON.parse(body).data);
  });
};

// ///////////////////////// API RELATED PART >> a. PROSPERENT >> Suggestion using Category ---------///////

exports.catalogProSync = function (req, proRes, next) {
  request({
    url: 'http://api.prosperent.com/api/search?api_key=' + config.prosperent.apiKey + '&filterCatalogId=' + req.params.item,
    method: 'GET'
  }, function (err, response, body) {
    if (err) { return next(err); }

    var dataArray = JSON.parse(body),
        totalrecordfound = dataArray.totalRecordsFound;

    proRes.send({ 'data': dataArray.data[0], 'total': totalrecordfound }); // returning only single data

  });
};

// retriving product color
// PROBLEM: this returns nothing

// ////////////////////// A  D M I N PRODUCT CRUD

