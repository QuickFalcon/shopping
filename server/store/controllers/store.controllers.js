'use strict';

var config = require(process.cwd() + '/config'),
    mongoose = require('mongoose'),
    request = require('request'),
    async = require('async'),
    NodeCache = require('node-cache'),
    readline = require('readline'),
    fs = require('fs'),
    deepcopy = require('deepcopy'),
    Store = mongoose.model('Store'),
    StoreProsperentTwotapCmn = mongoose.model('StoreProsperentTwotapCmn'),
    StoreTwotap = mongoose.model('StoreTwotap'),
    StoreProsperent = mongoose.model('StoreProsperent'),
    ss_Supported_Site = mongoose.model('ss_Supported_Site'),
    IgnoredStoreProsperent = mongoose.model('IgnoredStoreProsperent'),
    FeatureStore = mongoose.model('FeatureStore'),
    MenuItem = mongoose.model('MenuItem'),
    hat = require('hat'),
    ssCache = new NodeCache();

var accessed = false;

exports.getSupportedMerchants = function (req, res, next) {
  var query = ss_Supported_Site.find({}).sort('merchant');

  query.exec(function (err, data) {
    if (err) { return next(err); }

    res.send({ merchants: data, count: data.length });
  });
};

exports.getTopStores = function (req, res, next) {
  MenuItem.findOne({}, function (err, topTenStoreData) {  // find data exist
    if (err) { return next(err); }

    res.json(topTenStoreData);
  });
};

// manual store list return from database
exports.storelistapidatabase = function (req, res, next) {
  StoreProsperent.find({}, function (err, data) {
    if (err) { return next(err); }
    res.send(data);
  });
};

// store list return from database number of product must be greater than 1

exports.getCmnMerchants = function (req, res, next) {
  var query = StoreProsperent.find({ numProducts: { $gte: 1 } }).sort('merchant');

  query.exec(function (err, data) {
    if (err) { return next(err); }

    res.send({ merchants: data, count: data.length });
  });
};

// //////////////////////////////////////////////////////////////

exports.storelistSyncImage = function (req, res, next) {
  StoreProsperent.find({}).sort({ domain: 1 }).exec(function (err, data) {
    if (err) { return next(err); }

    console.log(data);
    res.send(data);
  });

};
// store delete will delete all store
exports.storeDeleteAll = function (req, res, next) {
  StoreProsperent.remove({}, function (err) {
    if (err) { return next(err); }

    res.send(' success for delete');
  });
};
// store delete will delete all store

function store_del_all(next) {
  StoreProsperent.remove({}, function (err) {
    if (err) { return next(err); }

    console.log(' success for delete');
  });
}

// API RELATED PART >> a. PROSPERENT >> MERCHANT LIST
exports.merchantsApisearch = function (req, res, next) {
  request({
    url: 'http://api.prosperent.com/api/merchant?api_key=0da1ade1627ce72127d551d52d5b55e7&debugMode=true&limit=1000&sortBy=merchant',
    method: 'GET'
  }, function (err, reponse, body) {
    if (err) { return next(err); }

    if (body) {
      var dArray = JSON.parse(body);

      res.send(dArray);
    }
  });
};

// API RELATED PART >> a. PROSPERENT >> PRODUCT LIST using MERCHANT
exports.merchant = function (req, res, next) {
  var merchantname = req.params.merchant,
      url = 'http://api.prosperent.com/api/search?api_key=0da1ade1627ce72127d551d52d5b55e7&filterMerchant=' + req.params.merchant + '&limit=' + config.resultsLimit + '&page=1&sortBy=price';

  request({
    url: url,
    method: 'GET'
    //  url: 'http://api.prosperent.com/api/local/search?api_key=0da1ade1627ce72127d551d52d5b55e7&filterCategory=Apparel&limit=1000&page=1&sortBy=rank&filterRank=5',
  }, function (err, reponse, body) {
    if (err) { return next(err); }

    if (body) {
      var dObject = JSON.parse(body),
          D = dObject.data,
          totalrecordsavailable = dObject.totalRecordsAvailable,
          totalrecordfound = dObject.totalRecordsFound,
          uid = hat();

      if (totalrecordsavailable > 0) {
        res.render('testintegrate', {
          title: 'sociallyshoppablestyle.com:' + merchantname,
          searchkey: 'sociallyshoppablestyle ' + merchantname + ', sociallyshoppablestyle.com ' + merchantname + ',' + merchantname + ',' + merchantname + ' product',
          description: 'buy ' + merchantname + ' through sociallyshoppablestyle',
          totalrecordsavailable: totalrecordsavailable,  // total record available to me
          totalrecordfound: totalrecordfound,             // total record in prospernet data feed
          dx: D,
          twotap_public_token: config.twotap.publicToken,
          uid: uid
        });
      } else {
        console.log('merchant list can be generated');
      }
    }
  });
};

// get all ingnored storelist
exports.getStoreSyncIgnorelist = function (req, res, next) {

  IgnoredStoreProsperent.find({}, function (err, data) {
    if (err) { return next(err); }

    console.log(data);
    res.send(data);
  });

};
// in admin panel define which store admin like to avoid for sync image
exports.addStoreSyncIgnorelist = function (req, res, next) {
  var slectedstore = req.body.store;
  IgnoredStoreProsperent.create({
    merchant: slectedstore.merchant,
    domain: slectedstore.domain

  }, function (err, nstore) {
    if (err) { return next(err); }

    res.send(nstore);
  });

};

// remove a store from Ignore list of sync
exports.delStoreSyncIgnorelist = function (req, res, next) {
  var slectedstore = req.body.store;

  IgnoredStoreProsperent.remove({
    domain: slectedstore.domain
  }, function (err) {
    if (err) { return next(err); }

    res.send(' success for update');
    // get and return all the todos after you create another

  });
};
// ///////////////////////////////////////////////////////////////////

exports.storelistCSV = function (req, res, next) {
  StoreProsperent.find({}, function (err, data) {
    if (err) { return next(err); }

    var i = 0;
    var totalrecords = data.length;
    var domain;
    var merchant;
    var stringsuccess;
    var formattedTime = '01:00:00';
    var storedata;
    async.whilst(
          function () {         // synchronous truth test to perform before each execution of fn
            if (i === totalrecords) {
              stringsuccess = '[' + formattedTime + '],Total ' + totalrecords + '\n';
              fs.appendFile(process.cwd() + '/storelist.csv', stringsuccess, function(appenderr) {
                if (appenderr) {
                  console.log('failed to append');
                }
                console.log('The final data was appended to file!');
              });
            }

            return i < totalrecords; // when this will not full fill exit
          },
          function (next) {
            domain = data[i].domain;
            merchant = data[i].merchant;
            storedata = '';

            storedata = '[' + formattedTime + '],' + domain + ',' + merchant + '\n';

            fs.appendFile(process.cwd() + '/storelist.csv', storedata, function(appenderr) {
              if (appenderr) {
                console.log('failed to append');
              }
              i += 1;
              next();

            });
          }, function () {      //  A callback which is called after the test function has failed and repeated execution of fn has stopped
            console.log('Store import done ');
            res.send(data);

          });

  });
};

exports.storelistSlider = function (req, res, next) {

  var storelist = req.body.stores;

  StoreProsperent.find({ merchant: { $in: storelist } }, function (err, data) {
    if (err) {
      return next(err);
    }
    // console.log(data);
    res.send(data);
  });
};
// getting from api
exports.getStoreListCache = function (req, res, next) {
  var url = 'http://api.prosperent.com/api/merchant?api_key=0da1ade1627ce72127d551d52d5b55e7&limit=1000&sortBy=merchant&page=1&filterTwoTapSupported=1';
  var obj = [];

  ssCache.get('storeKey', function (err, data) {
    if (!err) {
      if (data === undefined) {
        console.log('cached store key not found');
        request({
          url: url,
          method: 'GET'
        }, function (err, reponse, storeObj) {

          if (!err && reponse.statusCode === 200) {

            var objS = JSON.parse(storeObj);
            var count = 0;

            for (var j = 0; j < objS.data.length; j += 1) {
              if (objS.data[j].numProducts > 0) {          // checking number of product
                obj[count] = objS.data[j];
                obj[count].IsTrue = false;
                count += 1;
              }
            }
            res.json(obj);

            ssCache.set('storeKey', obj, function (err, success) {
              console.log(err || success);
            }); // set end
          } else {
            console.log(err);
            res.end();

            return next(err);
          }

        }); // call back end for api call
      } else {
        res.json(data);
      }   // when cache is there
    } else {
      request({
        url: url,
        method: 'GET'
      }, function (err, reponse, storeObj) {
        obj = storeObj.data;
        res.json(obj);
        ssCache.set('storeKey', obj, function (err, success) {

          console.log(err || success);
        }); // set end
      }); // call back end for api call
    }
  }); // cache get end
};
// use cache and group by to get store list only twotap supported stores are here
exports.getStoreListUsedGroupBy = function (req, res, next) {
  var url = 'http://api.prosperent.com/api/search?filterTwoTapSupported=1&limit=1000&page=1&sortBy=merchant&groupBy=merchantId&api_key=0da1ade1627ce72127d551d52d5b55e7';
  var obj;

  ssCache.get('storeKey', function (err, data) {
    if (!err) {
      if (data === undefined) {
        console.log('cached store key not found');
        request({
          url: url,
          method: 'GET'
        }, function (err, reponse, storeObj) {

          if (!err && reponse.statusCode === 200) {

            var objS = JSON.parse(storeObj);
            res.send(objS.data);

            obj = objS.data;

            ssCache.set('storeKey', obj, function (err, success) {
              console.log(err || success);
            }); // set end
          } else {
            console.log(err);
            res.end();

            return next(err);
          }

        }); // call back end for api call
      } else {
        res.send(data);
      }   // when cache is there
    } else {
      request({
        url: url,
        method: 'GET'
      }, function (err, reponse, storeObj) {
        var objS = JSON.parse(storeObj);

        obj = objS.data;
        res.send(objS.data);
        ssCache.set('storeKey', obj, function (err, success) {

          console.log(err || success);
        }); // set end
      }); // call back end for api call
    }
  }); // cache get end
};

// ///////////////////////////////////////////////////

/* From prosperent we are getting data  and saving inside our system running cron */
exports.syncStoresAdd = function (req, res, next) {
  var d = new Date();
  var dd = d.getDate();
  var mm = d.getMonth() + 1; // January is 0!
  var urlx;
  if (dd < 10) {   // date less than 10 add 0 at front
    dd = '0' + dd;
  }

  if (mm < 10) {   // month less than 10 add 0 at front
    mm = '0' + mm;
  }
  var bulk = StoreProsperent.collection.initializeOrderedBulkOp();
  var totalRecordsFound;
  var lmt = 10000;
  var pg;
    // first retrieve number of records
  var url = 'http://api.prosperent.com/api/merchant?api_key=0da1ade1627ce72127d551d52d5b55e7&limit=1&sortBy=merchant&filterTwoTapSupported=1&page=1';
  request({
    url: url,
    method: 'GET'
  }, function (err, reponse, body) {

    var parsedBody = JSON.parse(body);
    totalRecordsFound = parsedBody.totalRecordsFound;
    pg = totalRecordsFound / lmt;
        // calculate number of page
    var numberOfPg = parseInt(pg, 10);
    var numberModulus = (parseInt(totalRecordsFound, 10) % lmt);

    if (numberModulus > 0) {
      numberOfPg += 1;
    }

    var cpage = 0; // current page
    var url;

    async.waterfall([
      function (callback) {

        console.log(numberOfPg);
        store_del_all(next);
        callback(null, numberOfPg);

      },

      function (numberOfPg, callback) {

        cpage = 1;
        var arrJson;
        if (cpage <= numberOfPg) {
          urlx = 'http://api.prosperent.com/api/merchant?api_key=0da1ade1627ce72127d551d52d5b55e7&sortBy=merchant&filterTwoTapSupported=1&limit=' + lmt + '&page=' + cpage;
          request({
            url: urlx,
            method: 'GET'
          }, function (err, reponse, body) {

            var parsedBody = JSON.parse(body);

            if (err) {
              console.log(err);
            }

            var i = 0;

            for (i = 0; i < parsedBody.data.length; i += 1) {
              bulk.insert(parsedBody.data[i]);
            }

            arrJson = parsedBody.data;
            console.log('step 1');
            callback(null, i, cpage, bulk, numberOfPg, arrJson);

          });
        } else {
          callback(null, 0, cpage, bulk, numberOfPg, arrJson);

        }

      },
      function (i, cpage, bulk, numberOfPg, arrJson, callback) {

        cpage += 1;
        if (cpage <= numberOfPg) {
          url = 'http://api.prosperent.com/api/merchant?api_key=0da1ade1627ce72127d551d52d5b55e7&sortBy=merchant&filterTwoTapSupported=1&limit=' + lmt + '&page=' + cpage;
          request({
            url: url,
            method: 'GET'
          }, function (err, reponse, body) {

            var parsedBody = JSON.parse(body);
            var j = 0;
            console.log('step 2');

            for (j = 0; j < parsedBody.data.length; j += 1) {

              bulk.insert(parsedBody.data[j]);

            }

            arrJson.concat(parsedBody.data);

            callback(null, j, cpage, bulk, numberOfPg, arrJson);

          });
        } else {
          callback(null, 0, cpage, bulk, numberOfPg, arrJson);

        }

      },
      function (j, cpage, bulk, numberOfPg, arrJson, callback) {

        cpage += 1;

        if (cpage <= numberOfPg) {
          url = 'http://api.prosperent.com/api/merchant?api_key=0da1ade1627ce72127d551d52d5b55e7&sortBy=merchant&filterTwoTapSupported=1&limit=' + lmt + '&page=' + cpage;
          request({
            url: url,
            method: 'GET'
          }, function (err, reponse, body) {

            var k;
            var parsedBody = JSON.parse(body);

            console.log('step3');

            for (k = 0; k < parsedBody.data.length; k += 1) {
              bulk.insert(parsedBody.data[k]);

            }

            arrJson.concat(parsedBody.data);
            callback(null, k, cpage, bulk, numberOfPg, arrJson);
            console.log(k);

          });
        } else {
          callback(null, 0, cpage, bulk, numberOfPg, arrJson);

        }

      },
      function (k, cpage, bulk, numberOfPg, arrJson, callback) {

        cpage += 1;

        if (cpage <= numberOfPg) {
          url = 'http://api.prosperent.com/api/merchant?api_key=0da1ade1627ce72127d551d52d5b55e7&sortBy=merchant&filterTwoTapSupported=1&limit=' + lmt + '&page=' + cpage;

          request({
            url: url,
            method: 'GET'
          }, function (err, reponse, body) {

            var l = 0;
            var parsedBody = JSON.parse(body);
            console.log('step4');

            for (l = 0; l < parsedBody.data.length; l += 1) {
              bulk.insert(parsedBody.data[l]);
            }

            arrJson.concat(parsedBody.data);
            console.log(l);

            callback(null, l, cpage, bulk, numberOfPg, arrJson);

          });
        } else {
          callback(null, 0, cpage, bulk, numberOfPg, arrJson);

        }

      },
      function (l, cpage, bulk, numberOfPg, arrJson, callback) {

        cpage += 1;

        if (cpage <= numberOfPg) {
          url = 'http://api.prosperent.com/api/merchant?api_key=0da1ade1627ce72127d551d52d5b55e7&sortBy=merchant&filterTwoTapSupported=1&limit=' + lmt + '&page=' + cpage;
          request({
            url: url,
            method: 'GET'
          }, function (err, response, body) {

            var m = 0;
            var parsedBody = JSON.parse(body);
            console.log('step5');

            for (m = 0; m < parsedBody.data.length; m += 1) {
              bulk.insert(parsedBody.data[m]);
            }

            arrJson.concat(parsedBody.data);

            callback(null, bulk, 'done');

          });
        } else {

          callback(null, bulk, 'done');

        }

      }

    ], function (err, bulk) {
      console.log('Final');

      if (err) {
        console.log(err);
      }

      bulk.execute(function (errx) {

        if (errx) {
          console.log('INser error err ' + errx);
        } else {
          console.log('Success');
          res.send('success');
        }
      });

    });// waterfall end

  }); // request end that get the file length
};

exports.getCommonStoreCsv = function (req, res, next) {
  if (accessed) { return; }
  accessed = true;

  fs.writeFile(process.cwd() + '/public/resource/commonMerchant.csv', '', 'utf8', function(appenderr) {
    if (appenderr) {
      console.log('Last failed to Write');
    }
  });
  console.log('clicked');
  var common_ar = [];
  var urlx;
  var totalRecordsFound;
  var lmt = 6800;
  var pg;
    // first retrieve number of records
  var url = 'http://api.prosperent.com/api/merchant?api_key=0da1ade1627ce72127d551d52d5b55e7&limit=1&sortBy=merchant&page=1';
  request({
    url: url,
    method: 'GET'
  }, function (err, reponse, body) {

    if (err) {
      return next(err);

    }

    var parsedBody = JSON.parse(body);
    totalRecordsFound = parsedBody.totalRecordsFound;
    pg = totalRecordsFound / lmt;
        // calculate number of page
    var numberOfPg = parseInt(pg, 10);
    var numberModulus = (parseInt(totalRecordsFound, 10) % lmt);

    if (numberModulus > 0) {
      numberOfPg += 1;
    }
    var cpage = 0; // current page
    var url;

    async.waterfall([
      function (callback) {

        var url_twotap = 'https://api.twotap.com/v1.0/supported_sites';
        request({
          url: url_twotap,
          method: 'GET'
        }, function (err, reponse, twotapbody) {

          callback(null, numberOfPg, twotapbody);
        });
      },

      function (numberOfPg, twotapdatax, callback) {
        var twotapdata = JSON.parse(twotapdatax);
        var twotapfulldata = deepcopy(twotapdata);

        var count1 = 0;
        cpage = 1;
        var arrJson; // Full prosperent data
        var prosper_store_notintwotap;  // prosperent data who are not in twotap list
        if (cpage <= numberOfPg) {
          urlx = 'http://api.prosperent.com/api/merchant?api_key=0da1ade1627ce72127d551d52d5b55e7&sortBy=merchant&limit=' + lmt + '&page=' + cpage;
          request({
            url: urlx,
            method: 'GET'
          }, function (err, reponse, body) {

            var parsedBody1 = JSON.parse(body);
            prosper_store_notintwotap = deepcopy(parsedBody1.data);
            if (err) {
              console.log(err);
            }
            arrJson = deepcopy(parsedBody1.data);
            var i = 0;
            var temp;

            var lova1;
            for (i = 0; i < parsedBody1.data.length; i += 1) {
              temp = parsedBody1.data[i];
              for (var j = 0; j < twotapdata.length; j += 1) {
                if (temp.domain === twotapdata[j].url) {
                  lova1 = deepcopy(count1);

                  prosper_store_notintwotap.splice(lova1, 1);
                  common_ar.push(temp);
                  count1 -= 1;
                  twotapdata.splice(j, 1);
                  break;
                }
              }
              if ((i + 1) === parsedBody1.data.length) {
                console.log('I am step 1 inside i+1 ==parsedBody1.data.length ');
                callback(null, i, cpage, common_ar, numberOfPg, twotapdata, arrJson, twotapfulldata, prosper_store_notintwotap);

              }
              count1 += 1;

            }

          });
        } else {
          callback(null, 0, cpage, common_ar, numberOfPg, twotapdata, arrJson, twotapfulldata, prosper_store_notintwotap);

        }

      },
      function (i, cpage, common_ar, numberOfPg, twotapdata, arrJson, twotapfulldata, prosper_store_notintwotap, callback) {

        var temp_prosper_store_notintwotap;

        var count2 = 0;
        cpage += 1;
        if (cpage <= numberOfPg) {
          url = 'http://api.prosperent.com/api/merchant?api_key=0da1ade1627ce72127d551d52d5b55e7&sortBy=merchant&limit=' + lmt + '&page=' + cpage;
          request({
            url: url,
            method: 'GET'
          }, function (err, reponse, body) {

            var parsedBody2 = JSON.parse(body);
            temp_prosper_store_notintwotap = deepcopy(parsedBody2.data);

            console.log('step 2');

            var l = 0;
            var temp_2;
            var lova2;
            for (l = 0; l < parsedBody2.data.length; l += 1) {
              temp_2 = parsedBody2.data[l];
              arrJson.push(temp_2);

              for (var m = 0; m < twotapdata.length; m += 1) {

                if (temp_2.domain === twotapdata[m].url) {
                  lova2 = deepcopy(count2);

                  temp_prosper_store_notintwotap.splice(lova2, 1);
                  common_ar.push(temp_2);

                  count2 -= 1;
                  twotapdata.splice(m, 1);
                  break;
                }
              }
              if ((l + 1) === parsedBody2.data.length) {
                var ty;
                for (var xy = 0; xy < temp_prosper_store_notintwotap.length; xy += 1) {
                  ty = temp_prosper_store_notintwotap[xy];
                  prosper_store_notintwotap.push(ty);

                  if ((xy + 1) === temp_prosper_store_notintwotap.length) {

                    callback(null, l, cpage, common_ar, numberOfPg, twotapdata, arrJson, twotapfulldata, prosper_store_notintwotap);
                  }
                }

              }
              count2 += 1;

            }

          });
        } else {
          callback(null, 0, cpage, common_ar, numberOfPg, twotapdata, arrJson, twotapfulldata, prosper_store_notintwotap);

        }

      },

      function (j, cpage, common_ar, numberOfPg, twotapdata, arrJson, twotapfulldata, prosper_store_notintwotap, callback) {
        var count3 = 0;
        cpage += 1;
        var temp3_prosper_store_notintwotap;

        if (cpage <= numberOfPg) {
          url = 'http://api.prosperent.com/api/merchant?api_key=0da1ade1627ce72127d551d52d5b55e7&sortBy=merchant&limit=' + lmt + '&page=' + cpage;
          request({
            url: url,
            method: 'GET'
          }, function (err, reponse, body) {

            var temp_3;
            var lova3;
            var parsedBody3 = JSON.parse(body);
            temp3_prosper_store_notintwotap = deepcopy(parsedBody3.data);

            console.log('step3');
            for (var n = 0; n < parsedBody3.data.length; n += 1) {
              temp_3 = parsedBody3.data[n];
              arrJson.push(temp_3);
              for (var p = 0; p < twotapdata.length; p += 1) {

                if (temp_3.domain === twotapdata[p].url) {
                  lova3 = deepcopy(count3);

                  temp3_prosper_store_notintwotap.splice(lova3, 1);
                  count3 -= 1; // as one item become less for splice
                  common_ar.push(temp_3);
                  twotapdata.splice(p, 1);
                  break;
                }
              }
              if ((n + 1) === parsedBody3.data.length) {

                var tx;
                for (var xx = 0; xx < temp3_prosper_store_notintwotap.length; xx += 1) {
                  tx = temp3_prosper_store_notintwotap[xx];
                  prosper_store_notintwotap.push(tx);

                  if ((xx + 1) === temp3_prosper_store_notintwotap.length) {
                    callback(null, n, cpage, common_ar, numberOfPg, twotapdata, arrJson, twotapfulldata, prosper_store_notintwotap);
                  }
                }
              }
              count3 += 1;

            }

          });
        } else {

          callback(null, 0, cpage, common_ar, numberOfPg, twotapdata, arrJson, twotapfulldata, prosper_store_notintwotap);

        }

      },
      function (k, cpage, common_ar, numberOfPg, twotapdata, arrJson, twotapfulldata, prosper_store_notintwotap, callback) {

        cpage += 1;
        var count4 = 0;

        var temp4_prosper_store_notintwotap;
        if (cpage <= numberOfPg) {
          url = 'http://api.prosperent.com/api/merchant?api_key=0da1ade1627ce72127d551d52d5b55e7&sortBy=merchant&limit=' + lmt + '&page=' + cpage;

          request({
            url: url,
            method: 'GET'
          }, function (err, reponse, body) {

            var parsedBody4 = JSON.parse(body);
            temp4_prosper_store_notintwotap = deepcopy(parsedBody4.data);

            console.log('step4');
            var temp_4;
            var lova4;
            for (var q = 0; q < parsedBody4.data.length; q += 1) {
              temp_4 = parsedBody4.data[q];

              arrJson.push(temp_4);

              for (var r = 0; r < twotapdata.length; r += 1) {

                if (temp_4.domain === twotapdata[r].url) {
                  lova4 = deepcopy(count4);

                  temp4_prosper_store_notintwotap.splice(lova4, 1);
                  count4 -= 1;

                  common_ar.push(temp_4);
                  twotapdata.splice(r, 1);
                  break;
                }

              }
              if ((q + 1) === parsedBody4.data.length) {

                var tw;
                for (var xw = 0; xw < temp4_prosper_store_notintwotap.length; xw += 1) {
                  tw = temp4_prosper_store_notintwotap[xw];
                  prosper_store_notintwotap.push(tw);

                  if ((xw + 1) === temp4_prosper_store_notintwotap.length) {
                    callback(null, q, cpage, common_ar, numberOfPg, twotapdata, arrJson, twotapfulldata, prosper_store_notintwotap);

                  }
                }

              }
              count4 += 1;

            }

          });
        } else {

          callback(null, 0, cpage, common_ar, numberOfPg, twotapdata, arrJson, twotapfulldata, prosper_store_notintwotap);

        }

      },
      function (k, cpage, common_ar, numberOfPg, twotapdata, arrJson, twotapfulldata, prosper_store_notintwotap, callback) {
        var counter = 0;
        cpage += 1;
        var temp5_prosper_store_notintwotap;

        if (cpage <= numberOfPg) {
          url = 'http://api.prosperent.com/api/merchant?api_key=0da1ade1627ce72127d551d52d5b55e7&sortBy=merchant&limit=' + lmt + '&page=' + cpage;

          request({
            url: url,
            method: 'GET'
          }, function (err, reponse, body) {

            var parsedBody5 = JSON.parse(body);

            temp5_prosper_store_notintwotap = deepcopy(parsedBody5.data);

            console.log('step5');
            var temp_5;
            var lova5;
            for (var q = 0; q < parsedBody5.data.length; q += 1) {
              temp_5 = parsedBody5.data[q];
              arrJson.push(temp_5);

              for (var r = 0; r < twotapdata.length; r += 1) {

                if (temp_5.domain === twotapdata[r].url) {
                  lova5 = deepcopy(counter);

                  temp5_prosper_store_notintwotap.splice(lova5, 1);

                  common_ar.push(temp_5);
                  twotapdata.splice(r, 1);
                  counter -= 1;
                  break;
                }

              }
              if ((q + 1) >= parsedBody5.data.length) {

                var tv;
                for (var xv = 0; xv < temp5_prosper_store_notintwotap.length; xv += 1) {
                  tv = temp5_prosper_store_notintwotap[xv];
                  prosper_store_notintwotap.push(tv);

                  if ((xv + 1) === temp5_prosper_store_notintwotap.length) {
                    callback(null, q, cpage, common_ar, numberOfPg, twotapdata, arrJson, twotapfulldata, prosper_store_notintwotap);
                  }
                }

              }
              counter += 1;

            }

          });
        } else {
          callback(null, 0, cpage, common_ar, numberOfPg, twotapdata, arrJson, twotapfulldata, prosper_store_notintwotap);

        }

      },

      function (l, cpage, common_ar, numberOfPg, twotapdata, arrJson, twotapfulldata, prosper_store_notintwotap, callback) {

        cpage += 1;
        var temp6_prosper_store_notintwotap;
        var count6 = 0;
        var json_result = {};
        json_result.twotapfulldata = twotapfulldata;
        if (cpage <= numberOfPg) {
          url = 'http://api.prosperent.com/api/merchant?api_key=0da1ade1627ce72127d551d52d5b55e7&sortBy=merchant&limit=' + lmt + '&page=' + cpage;
          request({
            url: url,
            method: 'GET'
          }, function (err, response, body) {

            var parsedBody6 = JSON.parse(body);
            var temp_6;
            temp6_prosper_store_notintwotap = deepcopy(parsedBody6.data);
            var lova6;
            console.log('step6');
            for (var s = 0; s < parsedBody6.data.length; s += 1) {
              temp_6 = parsedBody6.data[s];
              arrJson.push(temp_6);

              for (var t = 0; t < twotapdata.length; t += 1) {

                if (temp_6.domain === twotapdata[t].url) {
                  lova6 = deepcopy(count6);
                  common_ar.push(temp_6);
                  twotapdata.splice(t, 1);
                  temp6_prosper_store_notintwotap.splice(lova6, 1);
                  count6 -= 1;
                  break;
                }
              }
              if ((s + 1) >= parsedBody6.data.length) {

                var ts;
                json_result.prosperent = arrJson;
                json_result.common = common_ar;
                json_result.twotapdata = twotapdata;

                for (var xs = 0; xs < temp6_prosper_store_notintwotap.length; xs += 1) {
                  ts = temp6_prosper_store_notintwotap[xs];
                  prosper_store_notintwotap.push(ts);

                  if ((xs + 1) === temp6_prosper_store_notintwotap.length) {
                    json_result.prosper_notintwotap = prosper_store_notintwotap;

                    callback(null, json_result, 'done');

                  }
                }

              }
            }

          });
        } else {
          console.log(arrJson.length);
          console.log('step6');
          json_result.twotapdata = twotapdata;
          json_result.prosperent = arrJson;
          json_result.prosper_notintwotap = prosper_store_notintwotap;

          json_result.common = common_ar;
          callback(null, json_result, 'done');

        }

      }

    ], function (err, json_result) {
      console.log('Final RESULT ');

      if (err) {
        console.log(err);
        res.send('failed');

        return;

      }
      var result = json_result.common;
      var prosper_list = json_result.prosperent;
      var twotapfulldata = json_result.twotapfulldata;
      var twotapuncommon = json_result.twotapdata;
      var prosper_notintwotap = json_result.prosper_notintwotap;

      console.log('Twotap store that prosperent do not offer');

      var temp_str = 'COMMON,TWOTAP,PROSPERENT,NOT IN PROSPERENT,NOT IN TWOTAP\n';

      fs.appendFile(process.cwd() + '/public/resource/commonMerchant.csv', temp_str, function(appenderr) {
        if (appenderr) {
          console.log(appenderr);
          console.log(temp_str);
        }
      });

      var length = prosper_list.length;
      var resultlength = result.length;
      var twotapfulldatalength = twotapfulldata.length;
      var twotapuncommonlength = twotapuncommon.length;
      var prosper_notintwotaplength = prosper_notintwotap.length;

      console.log('FINAL Common LENGTH');
      console.log(resultlength);
      console.log('twotapuncommonlength NOT in prosper');
      console.log(twotapuncommonlength);

      console.log('FINAL PROSPER LENGTH');
      console.log(length);
      console.log('prosper_notintwotaplength');
      console.log(prosper_notintwotaplength);

      temp_str = '';
      var p = '';
      for (var k = 0; k < length; k += 1) {

        if (k < resultlength) {
          temp_str = temp_str + '' + result[k].merchant;
        }

        if (k < twotapfulldatalength) {
          temp_str = temp_str + ',' + twotapfulldata[k].name;
        } else {
          temp_str = temp_str + p + ',';
        }

        temp_str = temp_str + ',' + prosper_list[k].merchant;

        if (k < twotapuncommonlength) {
          temp_str = temp_str + ',' + twotapuncommon[k].name;
        } else {
          temp_str = temp_str + p + ',';
        }

        if (k < prosper_notintwotaplength) {
          temp_str = temp_str + ',' + prosper_notintwotap[k].merchant + '\n';
        } else {
          temp_str = temp_str + ',' + p + '\n';
        }
        if (k + 1 === length) {

          writecsv(temp_str, req, res);
          accessed = false;

        }

      }

    });// waterfall end

  }); // request end that get the file length
};
function writecsv(temp_str, req, res) {
  fs.appendFile(process.cwd() + '/public/resource/commonMerchant.csv', temp_str, function(appenderr) {
    if (appenderr) {

      console.log(appenderr);
      console.log(temp_str);

    }
    res.send('success');

  });
}

// all stores from api... not limited with twotap supported stores
exports.getAllProsperentStore = function (req, res, next) {
  accessed = false;
  var d = new Date();
  var dd = d.getDate();
  var mm = d.getMonth() + 1; // January is 0!
  var urlx;
  if (dd < 10) {   // date less than 10 add 0 at front
    dd = '0' + dd;
  }

  if (mm < 10) {   // month less than 10 add 0 at front
    mm = '0' + mm;
  }
  var bulkFire = [];
  var totalRecordsFound;
  var lmt = req.body.limit;

  var pg;
    // first retrieve number of records
  var url = 'http://api.prosperent.com/api/merchant?api_key=0da1ade1627ce72127d551d52d5b55e7&limit=1&sortBy=merchant&page=1';
  request({
    url: url,
    method: 'GET'
  }, function (err, reponse, body) {

    var parsedBody = JSON.parse(body);
    totalRecordsFound = parsedBody.totalRecordsFound;

    pg = totalRecordsFound / lmt;
        // calculate number of page
    var numberOfPg = parseInt(pg, 10);
    var numberModulus = (parseInt(totalRecordsFound, 10) % lmt);

    if (numberModulus > 0) {
      numberOfPg += 1;
    }
    console.log('hey mama hey');
    var cpage = 0; // current page
    async.waterfall([
      function (callback) {

        callback(null, numberOfPg);

      },

      function (numberOfPg, callback) {

        cpage = req.body.currentpage;
        var arrJson;
        if (cpage <= numberOfPg) {
          urlx = 'http://api.prosperent.com/api/merchant?api_key=0da1ade1627ce72127d551d52d5b55e7&sortBy=merchant&limit=' + lmt + '&page=' + cpage;
          request({
            url: urlx,
            method: 'GET'
          }, function (err, reponse, body) {

            var parsedBody = JSON.parse(body);

            if (err) {
              console.log(err);
            }

            arrJson = parsedBody.data;
            console.log(arrJson);
            callback(null, arrJson, 'done');
          });
        } else {
          callback(null, arrJson, 'done');

        }

      }

    ], function (err, arrJson) {
      console.log('Final DARA');

      if (err) {

        console.log(err);

        return next(err);
      }
      var fulldata = { totalRecordsFound: totalRecordsFound, storedata: arrJson };
      res.send(fulldata);

    });// waterfall end

  }); // request end that get the file length

  console.log(bulkFire);

};

// /////////////////////////////////////////////////////

// get twotap stores from database
exports.getAllTwotapStore = function (req, res, next) {

  StoreTwotap.find({}, function (err, data) {
    if (err) { return next(err); }

    console.log('hey twotap store');
    res.send(data);
  });

};

// //////////////////////////////////////////////////////
exports.importTwotapStoreCSV = function (req, res, next) {
  var bulk = StoreTwotap.collection.initializeOrderedBulkOp();
  var rl = readline.createInterface({
    input: fs.createReadStream('resourcefiles/twotapMerchant.csv')
  });

  rl.on('line', function (line) {
    console.log('Line from file:', line);
    bulk.insert({ 'merchant': line });
  }).on('close', function () {
    bulk.execute(function (err) {
      if (err) { return next(err); }
      res.send('success');
    });
  });
};

// This is for getting store list from csv
exports.syncStoresAddCommon = function (req, res, next) {
  var bulk = StoreProsperentTwotapCmn.collection.initializeOrderedBulkOp();
  var rl = readline.createInterface({
    input: fs.createReadStream('resourcefiles/commonMerchant.csv')
  });

  rl.on('line', function (line) {
    console.log('Line from file:', line);
    bulk.insert({ 'merchant': line });
  }).on('close', function () {
    bulk.execute(function (err) {
      if (err) { return next(err); }
      res.send('success');
    });
  });
};

exports.commonMerDeleteAll = function (req, res, next) {
  StoreProsperentTwotapCmn.remove({}, function (err) {
    if (err) { return next(err); }

    res.send(' success for delete Store COmmon that come from csv');
  });
};

// ///////////////////// beLOW ARE OUT DATED   /////////////////////////////

// STore create Manually not required any more
exports.storeSave = function (req, res, next) {
  Store.create({
    store_name: req.body.store_name,
    address: req.body.address,
    city: req.body.city,
    country: req.body.country,
    priority: req.body.priority,
    store_url: req.body.store_url,
    image_url: req.body.image_url,
    thumbnail_url: req.body.thumbnail_url,
    icon_url: req.body.icon_url,
    contact_person: req.body.contact_person,
    contact_designation: req.body.contact_designation,
    store_email: req.body.store_email,
    store_phone: req.body.store_phone,
    store_category: ['men', 'women'],
    store_subcategory: 'sports',
    title_img: req.body.title_img

  }, function (err, stores) {
    if (err) { return next(err); }

    res.send(stores);
    console.log(stores);
  });
};

// STORE DATA UPDATE Manually not required any more
exports.storeUpdate = function (req, res, next) {
  Store.findById(req.body._id, function (err, store) {
    if (err) { return next(err); }

    // change the users location
    store.store_name = req.body.store_name;
    store.address = req.body.address;
    store.city = req.body.city;
    store.country = req.body.country;
    store.priority = req.body.priority;
    store.store_url = req.body.store_url;
    store.image_url = req.body.image_url;
    store.thumbnail_url = req.body.thumbnail_url;
    store.icon_url = req.body.icon_url;
    store.contact_person = req.body.contact_person;
    store.contact_designation = req.body.contact_designation;
    store.store_email = req.body.store_email;
    store.title_img = req.body.title_img;
    store.store_phone = req.body.store_phone;

    // store.title_img =req.body.title_img;
    store.save(function (err) {
      if (err) { return next(err); }

      res.send('success');
    });// save end
  }); // find by end
}; // route end

// manual store list return not any more there
exports.storelist = function (req, res, next) {
  // query = Store.find(searchquery).sort(sortingorder).select({ catalogId: 1,keyword: 1,SScategory:1,designer:1,gender:1,merchant:1,merchantId:1,price:1,price_sale:1,image_url:1, currency:1,rate:1,like:1 });
  Store.find({}, function (err, data) {
    if (err) { return next(err); }
    res.send({ product: data, count: data.length });
  });
};

// ///////////////////// OLD MANUAL STORE   /////////////////////////////
exports.storeGet = function (req, res, next) {

  var storeid = req.params.storeid;
  var query = Store.findOne({ _id: storeid });

  query.exec(function (err, storedetails) {
    if (err) { return next(err); }

    res.send(storedetails);
  });
};
// ///////////// OLD DELETE MANUAL STORE /////////////////
exports.storeDelete = function (req, res, next) {
  Store.remove({
    _id: req.params.storeid
  }, function (err) {
    if (err) { return next(err); }

    res.send(req.params.storeid + ' success for delete');
    // get and return all the todos after you create another

  });
};

// bulk update example OLD STORE
// ///////////////////// A D M I N >> b. Store >> MAKE A STORE as featured STORE ID  /////////////////////////////
exports.featureStoreSave = function (req, res, next) {
  FeatureStore.create({
    store_name: req.body.store_name,
    menuItem: req.body.menuItem,
    store_id: req.body.store_id
  }, function (err, fstores) {
    if (err) { return next(err); }

    res.send(fstores);
  });
};

exports.getFeatureStore = function (req, res, next) {
  var menuItem = req.params.menuItem;
  var query = FeatureStore.find({ menuItem: menuItem });

  query.exec(function (err, fstorelist) {
    if (err) { return next(err); }

    res.send(fstorelist);
  });
};

