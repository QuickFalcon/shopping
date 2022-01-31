'use strict';
//https://developers.rakutenmarketing.com/subscribe/site/pages/subscriptions.jag#
// https://azurelogic.com/posts/web-scraping-with-nightmare-js/
// web service token from linkshare
// 70ddc990a2c75f91bf8372bf3c4171e829bca7c658ac28cef60175fd56e91014
//Site ID: 3046321
// https://api.rakutenmarketing.com/productsearch/1.0?keyword="Dog collar" &cat="Pets"&max=20&pagenumber=1&mid=2557

var mongoose = require('mongoose'),
    schedule = require('node-schedule'),
    StoreProsperent = mongoose.model('StoreProsperent'),
    IgnoredStoreProsperent = mongoose.model('IgnoredStoreProsperent'),
    BrandProsperent = mongoose.model('BrandProsperent'),
    Coupon = mongoose.model('Coupon'),
    Twotapsite = mongoose.model('Twotapsite'),
    CategoryProsperentSync = mongoose.model('CategoryProsperentSync'),
    webshot = require('webshot'),
    async = require('async'),
    fs = require('fs'),
    sendgrid = require(process.cwd() + '/lib/sendgrid'),
    menu = require('../../menu/controllers/menu.controllers'),
    urlencode = require('urlencode'),
    request = require('request'),
    User = mongoose.model('User'),
    ProductProsperent = mongoose.model('ss_tap_Product'),
    ProductProsperentTwo = mongoose.model('ss_Productq'),
    UnsignedUser = mongoose.model('UnsignedUser');

  // rp = require('request-promise');
    // httpx = require('http');
var parseString = require('xml2js').parseString;


var formattedTime,
    unix_timestamp,
    date,
    dat,
    month,
    year,
    hours,
    minutes,
    seconds,
    message;
exports.cornImage = function () {

  unix_timestamp = Math.round(Date.now() / 1000);
  date = new Date(unix_timestamp * 1000);
  year = date.getFullYear();
  month = date.getMonth();
  dat = date.getUTCDate();
  // Hours part from the timestamp
  hours = date.getHours();
// Minutes part from the timestamp
  minutes = '0' + date.getMinutes();
// Seconds part from the timestamp
  seconds = '0' + date.getSeconds();
// Will display time in 10:30:23 format
  formattedTime = year + '-' + month + '-' + dat + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

  console.log('Current Server time ' + formattedTime);
  schedule.scheduleJob({ hour: 16, minute: 13 }, function() {
    console.log('Cron running!');
   // getStoreList();
    var url = 'http://104.236.166.98:900/cron';
    // url = 'http://localhost:900/cron';
    request({
      url: url,
      method: 'GET'
    }, function (error, response, body) {

      if (!error && response.statusCode === 200) {
        console.log(body); // Show the HTML for the Google homepage.
      }
      if (formattedTime === '-1') {
        getStoreList();
      }

    });

  });



  schedule.scheduleJob({ hour: 7, minute: 18 }, function() {
    console.log('Cron running for getting top ten menu!');
    menu.calculateTopCron();

  });

};

schedule.scheduleJob({ hour: 15, minute: 2 }, function() {
  console.log('Cron running for getting store with count !');
  removeOldCartItem();
});

schedule.scheduleJob({ hour: 14, minute: 59 }, function() {
  removeOldWishItem();

});

schedule.scheduleJob({ hour: 7, minute: 21}, function() {
  console.log('Cron running for getting number of Category !');
  updateCategorylistWithNumber();

});


schedule.scheduleJob({ hour: 15, minute: 47}, function() {
 // importCJproduct();
 console.log("schedule job");
});



function removeOldCartItem() {

  User.update(
  { },
  { $pull: { cart: { timestamp: { $lte: (new Date((new Date()).getTime() - (30 * 24 * 60 * 60 * 1000))) } } } },
  { multi: true }, function(err, data) {

    if (err) {

      console.log('sorry');
    }

    console.log(data);

  });

  UnsignedUser.update(
  { },
  { $pull: { cart: { timestamp: { $lte: (new Date((new Date()).getTime() - (15 * 24 * 60 * 60 * 1000))) } } } },
  { multi: true }, function(err, data) {

    if (err) {

      console.log('sorry');
    }

    console.log(data);

  });

}

function removeOldWishItem() {

  User.update(
  { },
  { $pull: { wishList: { timestamp: { $lte: (new Date((new Date()).getTime() - (90 * 24 * 60 * 60 * 1000))) } } } },
  { multi: true }, function(err, data) {

    if (err) {

      console.log('sorry');
    }

    console.log(data);

  });

}

function importCJproduct(){

  console.log("should be run under supervision of a developer");
  return;

  var cj_website_id = '7095303';

  // cj_authorization key is old
  //var cj_authorization_key = '00d9fb63e7cc3b9d1ca158074cb36009be6ecbb1251c703b229c1ac0a9fb98e08e27b2c1d49706565113db02afe9e4a4026eb0d204eabf439030685ff0be419b1f/00941c5e0bb817a16f3ca9c57bf63d812165c2fd808bcc2e421bf38989762cb016658dcba660f5c7d3bafa383ec6bca7f947c19983570cfb8754683086ac75c701';

  var developerKey = '008f29429713d9c8326f00c9cf09839d053879f820f3117e929f691e582526d79bb3e0d7d5ae61f273972c16450748d90f242a9b938183601996127ba57bdbaaeb/31e1ab7d1e828c79de298527a965fd691b438c4c56c52ab805e9479468e57ecc113fdb5781451fe9171137675bfd49b5bb6e6ad486f0e0d6a200f17ff1af4739';
 // var url = "https://product-search.api.cj.com/v2/product-search?website-id="+cj_website_id+"&advertiser-ids=joined&keywords=shoes&page-number=0&records-per-page=1000&sort-by=Price";
  var lastPage =0;
 var perpagerecord = 1000;
  var dataProductCount;
  var xml;
  var page = 1;
  var last_price ="";
  var lprice;
  var indix =0;
  var cj_retailer_arr =[3929100];

  //var cj_retailer_arr =[4018320,2423467,3793612,3929100];
 // express, revolve , tibi.com , urban outfitter
  var url;
  var tp;
  var numberofmerchant =  cj_retailer_arr.length;
  async.whilst(

      function () {

        if (indix >= numberofmerchant) {

          console.log("loop should be exit");
        }
        return indix < numberofmerchant; // when this will not full fill exit

      },
      function (next){

        var counturl = "https://product-search.api.cj.com/v2/product-search?website-id="+cj_website_id+"&advertiser-ids="+cj_retailer_arr[indix]+"&page-number=1&records-per-page=1&sort-by=Price";
        request({
          url: counturl,
          method: 'GET',
          'headers'   :     {
            'authorization'    : developerKey
          } }, function (error, response, body) {
          var xmlcount = body;
          var message ="";

          parseString(xmlcount, function (errx, resultcount) {

            dataProductCount = resultcount['cj-api'].products[0]['$']['total-matched'];

            console.log(dataProductCount);
            lastPage = Math.ceil(dataProductCount / perpagerecord);
            console.log(lastPage);

            async.whilst(
                function () {         // synchronous truth test to perform before each execution of fn
                  if (page > lastPage) {

                    message = message + '\n Sync operation happen on total ' + lastPage + ' \n Thanks ';
                  }

                  return page <= lastPage; // when this will not full fill exit
                },
                function (next) {


                  var cpage = page%10;
                  if(cpage==0){
                    cpage =10;

                  }


                  if(page<=10)
                    url = "https://product-search.api.cj.com/v2/product-search?website-id="+cj_website_id+"&advertiser-ids="+cj_retailer_arr[indix]+"&page-number="+page+"&records-per-page="+perpagerecord+"&sort-by=Price";
                  else if(cpage ==1) {

                    lprice = last_price;
                    url = "https://product-search.api.cj.com/v2/product-search?website-id="+cj_website_id+"&advertiser-ids="+cj_retailer_arr[indix]+"&page-number="+cpage+"&records-per-page="+perpagerecord+"&low-price="+lprice+"&sort-by=Price";


                  }
                  else
                    url = "https://product-search.api.cj.com/v2/product-search?website-id="+cj_website_id+"&advertiser-ids="+cj_retailer_arr[indix]+"&page-number="+cpage+"&records-per-page="+perpagerecord+"&low-price="+lprice+"&sort-by=Price";


                  console.log(page);
                  console.log(url);

                  //4018320

                  var product;
                  var restructured_data =[];
                  request({
                    url: url,
                    method: 'GET',
                    'headers'   :     {
                      'authorization'    : developerKey
                    } }, function (errordd, response, body) {

                    if (!errordd && response.statusCode === 200) {
                      // Show the HTML for the Google homepage.
                      xml = body;
                      parseString(xml, function (perr, result) {

                        if(perr) {
                          console.log(perr);
                          page += 1;
                          next();

                        }
                        else {

                          product = result['cj-api'].products[0]['product'];

                          if(typeof product == "undefined"){

                            page += 1;
                            next();

                          }

                          else if(product.length<1){

                            page += 1;
                            next();
                          }
                          else {
                            for (var ind = 0; ind < product.length; ind++) {
                              restructured_data[ind] = {};

                              if(typeof product[ind]['sku'][0]  == "undefined"){

                                console.log(product[ind]['upc'][0]);
                                console.log(product[ind]['manufacturer-sku'][0]);
                                console.log(product[ind]['name'][0]);

                              } else if(product[ind]['sku'][0] ==null){

                                console.log(product[ind]['upc'][0]);
                                console.log(product[ind]['manufacturer-sku'][0]);
                                console.log(product[ind]['name'][0]);

                              } else if(product[ind]['sku'][0] ==''){

                                console.log(product[ind]['upc'][0]);
                                console.log(product[ind]['manufacturer-sku'][0]);
                                console.log(product[ind]['name'][0]);

                              }

                              restructured_data[ind].catalogId = product[ind]['sku'][0];
                              //restructured_data[ind].catalogId = product[ind]['catalog-id'][0];
                              restructured_data[ind].current_price = parseFloat(product[ind]['price'][0]);

                              if (product[ind]['retail-price'][0] == '') {
                                restructured_data[ind].price = parseFloat(product[ind]['price'][0]);

                              } else {

                                restructured_data[ind].price = parseFloat(product[ind]['retail-price'][0]);

                              }


                              if (product[ind]['sale-price'][0] == '')
                                restructured_data[ind].price_sale = -1;
                              else
                                restructured_data[ind].price_sale = parseFloat(product[ind]['sale-price'][0]);
                              restructured_data[ind].affiliated_network = 1; // 1 means cj
                              restructured_data[ind].keyword = product[ind]['name'][0];
                              restructured_data[ind].upc = product[ind]['upc'][0];
                              restructured_data[ind].isbn = product[ind]['isbn'][0];
                              restructured_data[ind].brand = product[ind]['manufacturer-name'][0];
                              restructured_data[ind].merchant = product[ind]['advertiser-name'][0];
                              restructured_data[ind].twoTapProductUrl = product[ind]['buy-url'][0];
                              restructured_data[ind].twoTapAffiliateLink = product[ind]['buy-url'][0];

                              restructured_data[ind].image_url = product[ind]['image-url'][0];
                              restructured_data[ind].description = product[ind]['description'][0];
                              restructured_data[ind].currency = product[ind]['currency'][0];
                              restructured_data[ind].category = product[ind]['advertiser-category'][0];

                              if (product[ind]['in-stock'][0]) {

                                restructured_data[ind].available = true;
                              }
                              else {

                                restructured_data[ind].available = false;

                              }

                              //  restructured_data[ind].category = product[ind]['description'][0];

                              if (ind + 1 == product.length) {
                                console.log(product[ind]['price'][0]);

                                tp = parseFloat(product[ind]['price'][0]) + .01;
                                var wholenumbertp = Math.ceil(tp);
                                last_price = wholenumbertp + "";

                                insProd(restructured_data);
                                page += 1;
                                next();
                              }

                            }
                          }


                        }
                      });

                    }
                    else {

                      page += 1;
                      next();

                      console.log("status code error");
                      console.log(response.statusCode);
                    }


                  });

                },
                function () {      //  A callback which is called after the test function has failed and repeated execution of fn has stopped
                  console.log('cj product import done ');
                  indix += 1;
                  next(); // calling next retailer
                });


          })


        })





      },  function () {      //  A callback which is called after the test function has failed and repeated execution of fn has stopped
        console.log('All merchant import done ');

      });








}

function insProd(data) {
var bulk = ProductProsperentTwo.collection.initializeUnorderedBulkOp();
var i = 0;

for (i = 0; i < data.length; i += 1) {
bulk.insert(data[i]);
}

bulk.execute(function (errx) {
if (errx) { return next(errx); }

console.log('Success');
});
}

exports.insertCjProducts = function (req, res, next) {
  importCJproduct();
  res.end();
 // twotap catalog : https://www.express.com/clothing/women/minus-the-leather-pencil-skirt/pro/07687141C/cat890004
 // cj same url format  http://www.kqzyfj.com/click-7095303-11378322-1496914621185?url=http%3A%2F%2Fwww.express.com%2Fclothing%2Fwomen%2Fminus-the-leather-pencil-skirt%2Fpro%2F07687141C%2Fcat890004&cjsku=10836132

};


exports.cartCornJob = function (req, res, next) {
  removeOldCartItem();
};

exports.wishCornJob = function (req, res, next) {
  removeOldWishItem();
};




exports.couponUpdated = function (req, res, next) {
  var totalRecordsFound;
  var pBody;
  var url = 'https://api.twotap.com/v1.0/coupons?private_token=0e3fbb72afd92529c4b521e5884d6857a1d05dd70cc9adbc24';

  request({
    url: url,
    method: 'GET'
  }, function (err, reponse, body) {

    if (err) { return next(err); }
    var parsedBody = JSON.parse(body);

    insertCoupon(parsedBody, next, res);

  });
};

function insertCoupon(data, next, res) {
  var bulk = Coupon.collection.initializeUnorderedBulkOp();
  var i = 0;

  for (i = 0; i < data.length; i += 1) {
    bulk.insert(data[i]);
  }

  bulk.execute(function (errx) {
    if (errx) { return next(errx); }
    res.end();
  });
}

exports.siteUpdated = function (req, res, next) {
  var totalRecordsFound;
  var pBody;
  var url = 'https://api.twotap.com/v1.0/supported_sites?private_token=0e3fbb72afd92529c4b521e5884d6857a1d05dd70cc9adbc24';

  request({
    url: url,
    method: 'GET'
  }, function (err, reponse, body) {

    if (err) { return next(err); }
    var parsedBody = JSON.parse(body);

    insertTwotapsite(parsedBody, next, res);

  });

};

function insertTwotapsite(data, next, res) {
  var bulk = Twotapsite.collection.initializeUnorderedBulkOp();
  var i = 0;

  for (i = 0; i < data.length; i += 1) {
    bulk.insert(data[i]);
  }

  bulk.execute(function (errx) {
    if (errx) { return next(errx); }
    res.end();
  });
}

function updateStorelistWithNumber() {

  var unix_timestamp = Math.round(Date.now() / 1000);
  var date = new Date(unix_timestamp * 1000);
  var year = date.getFullYear();
  var month = date.getMonth();
  var dat = date.getUTCDate();
  // Hours part from the timestamp
  var hours = date.getHours();
// Minutes part from the timestamp
  var minutes = '0' + date.getMinutes();
// Seconds part from the timestamp
  var seconds = '0' + date.getSeconds();
// Will display time in 10:30:23 format
  var formattedTime = year + '-' + month + '-' + dat + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);



  message = '';

  var page = 1;
  var lastPage;
  var stringsuccess = '';
  var totalsuccess = 0;
  var totalfailed = 0;
  var totalEmpty = 0;

  var url;
  var totalRecordsFound = 0;
  var dom;
  var data_dom;
  async.waterfall([
    function(callback) {
      // StoreProsperent.find({ 'numProducts': { $gt: 0 } }).sort({ merchant: -1 }).exec(function (ignoreerr, data) {
      StoreProsperent.find({}).sort({ merchant: -1 }).exec(function (ignoreerr, data) {
        if (ignoreerr) {
          console.log(ignoreerr);

        } else {

          StoreProsperent.update({}, { $set: { numProducts: -1 } }, { multi: true }
           ).exec(function (err, updated) {
             console.log('total record ' + updated.length);
             callback(null, data);

           });

        }
      });

    },
    function(data, callback) {

      data_dom = data;

      lastPage = data_dom.length;
      year = date.getFullYear();
      month = date.getMonth();

      async.whilst(
          function () {         // synchronous truth test to perform before each execution of fn
            if (page > lastPage) {
              stringsuccess = '[' + formattedTime + '],Total Success:' + totalsuccess + ',Total failed:' + totalfailed + ' Total Empty ' + totalEmpty + '\n';

              message = message + '\n' + stringsuccess;
              message = message + '\n Store wise product count operation happen on total ' + lastPage + ' Stores\n Thanks ';
              sendgrid.sendcronimagemail(message);

            }

            return page <= lastPage; // when this will not full fill exit
          },
          function (next) {

            dom = data_dom[page - 1].merchantId;
            unix_timestamp = Math.round(Date.now() / 1000);

            date = new Date(unix_timestamp * 1000);

            dat = date.getUTCDate();

            hours = date.getHours();
            minutes = '0' + date.getMinutes();
            seconds = '0' + date.getSeconds();

            formattedTime = year + '-' + month + '-' + dat + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

            url = 'http://api.prosperent.com/api/search?limit=1&page=1&filterMerchantId=' + dom + '&filterTwoTapSupported=1&api_key=0da1ade1627ce72127d551d52d5b55e7';

            var options = {
              uri: url,
              timeout: 180000,
              json: true // Automatically parses the JSON string in the response

            };

            request(options, function (err, repos, body) {
              if (!err) {

                var jsData = body;
                var gd = jsData.data[0];
                if (gd) {
                  totalRecordsFound = jsData.totalRecordsFound;

                  StoreProsperent.update({ merchantId: dom }, { $set: { numProducts: totalRecordsFound } }).exec(function (erru, resultx) {
                    if (erru) {
                      totalfailed += 1;

                      console.log('Merchant update err' + err + ' ' + resultx);
                    } else if (resultx < 1) {

                      console.log('Empty result' + err + ' ' + resultx);
                    } else {
                      totalsuccess += 1;

                    }
                    page += 1;
                    next();
                  });

                } else {
                  console.log(body);
                  console.log(data_dom[page - 1].merchant);
                  totalEmpty += 1;
                  page += 1;
                  next();
                }
              } else {

                console.log(err);
                console.log(data_dom[page - 1].merchant);
                totalfailed += 1;
                page += 1;
                next();

              }
            });

          }, function () {      //  A callback which is called after the test function has failed and repeated execution of fn has stopped
            console.log('All done ');

          });

      callback(null, totalsuccess);
    }
  ], function (err, result) {
    console.log(result);
    console.log('data update done');
  });  // async end

}

function updateCategorylistWithNumber() {
  var unix_timestamp = Math.round(Date.now() / 1000);
  var date = new Date(unix_timestamp * 1000);
  var year = date.getFullYear();
  var month = date.getMonth();
  var dat = date.getUTCDate();
  // Hours part from the timestamp
  var hours = date.getHours();
// Minutes part from the timestamp
  var minutes = '0' + date.getMinutes();
// Seconds part from the timestamp
  var seconds = '0' + date.getSeconds();
// Will display time in 10:30:23 format
  var formattedTime = year + '-' + month + '-' + dat + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);


  message = '';

  var page = 1;
  var lastPage;
  var stringsuccess = '';
  var totalsuccess = 0;
  var totalfailed = 0;
  var url;
  var totalRecordsFound = 0;
  var cat_dom;
  var dom;
  var data_dom;
  var searchquery;
  async.waterfall([
    function(callback) {
      CategoryProsperentSync.find({}).sort('category').exec(function (ignoreerr, data) {
        if (ignoreerr) {
          console.log(ignoreerr);

        } else {

          CategoryProsperentSync.update({}, { $set: { numProducts: 0 } }, { multi: true }
           ).exec(function (err, updated) {
            console.log('set to 0');

             callback(null, data);

           });

        }
      });

    },
    function(data, callback) {

      data_dom = data;
      var tempcategoryId;
      lastPage = data_dom.length;
      year = date.getFullYear();
      month = date.getMonth();

      async.whilst(
          function () {         // synchronous truth test to perform before each execution of fn
            if (page > lastPage) {
              stringsuccess = '[' + formattedTime + '],Total Success:' + totalsuccess + ',Total failed:' + totalfailed + '\n';

              message = message + '\n' + stringsuccess;
              message = message + '\n Category wise product count operation happen on total ' + lastPage + ' Stores\n Thanks ';
              // sendgrid.sendcronimagemail(message);

            }

            return page <= lastPage; // when this will not full fill exit
          },
          function (next) {

            cat_dom = data_dom[page - 1].category;

            unix_timestamp = Math.round(Date.now() / 1000);

            date = new Date(unix_timestamp * 1000);

            dat = date.getUTCDate();

            hours = date.getHours();
            minutes = '0' + date.getMinutes();
            seconds = '0' + date.getSeconds();

            formattedTime = year + '-' + month + '-' + dat + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
            searchquery = {};

            tempcategoryId = data_dom[page - 1].categoryId;
            searchquery.categoryId =tempcategoryId;



            var query = ProductProsperent.find(searchquery, '_id').count();


            query.exec(function (err, result) {
            //request(options, function (err, repos, body) {
              if (!err) {

                var jsData = result;


                    totalRecordsFound = jsData;

                    CategoryProsperentSync.update({ categoryId: tempcategoryId }, { $set: { numProducts: totalRecordsFound } }).exec(function (err, resultx) {
                      if (err || resultx < 1) {
                        totalfailed += 1;

                        console.log('cart update err' + err + ' ' + resultx);
                      } else {
                        console.log(data_dom[page - 1]);

                        console.log(totalRecordsFound);

                        totalsuccess += 1;

                      }
                      page += 1;
                      next();
                    });





              } else {

                totalfailed += 1;
                page += 1;
                next();

              }
            });

          }, function () {      //  A callback which is called after the test function has failed and repeated execution of fn has stopped
            console.log('All done ');

          });

      callback(null, totalsuccess);
    }
  ], function (err, result) {
    console.log(result);
    console.log('data update done');
  });  // async end

}
function updateBrandlistWithNumber() {

  message = '';

  var page = 1;
  var lastPage;
  var stringsuccess = '';
  var totalsuccess = 0;
  var totalfailed = 0;
  var url;
  var totalRecordsFound = 0;
  var bdom;
  var dom;
  var data_dom;
  async.waterfall([
    function(callback) {
      BrandProsperent.find({}).sort({ merchant: -1 }).exec(function (ignoreerr, data) {
        if (ignoreerr) {
          console.log(ignoreerr);

        } else {

          BrandProsperent.update({}, { $set: { numProducts: -1 } }, { multi: true }
           ).exec(function (err, updated) {
             console.log(updated);
             callback(null, data);
           });

        }
      });

    },
    function(data, callback) {

      data_dom = data;

      lastPage = data_dom.length;
      year = date.getFullYear();
      month = date.getMonth();

      async.whilst(
          function () {         // synchronous truth test to perform before each execution of fn
            if (page > lastPage) {
              stringsuccess = '[' + formattedTime + '],Total Success:' + totalsuccess + ',Total failed:' + totalfailed + '\n';

              message = message + '\n' + stringsuccess;
              message = message + '\n Brand wise product count operation happen on total ' + lastPage + ' Stores\n Thanks ';
              // sendgrid.sendcronimagemail(message);

            }

            return page <= lastPage; // when this will not full fill exit
          },
          function (next) {
            bdom = data_dom[page - 1].brand;
            dom = urlencode(bdom);

            unix_timestamp = Math.round(Date.now() / 1000);

            date = new Date(unix_timestamp * 1000);

            dat = date.getUTCDate();

            hours = date.getHours();
            minutes = '0' + date.getMinutes();
            seconds = '0' + date.getSeconds();

            formattedTime = year + '-' + month + '-' + dat + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

            url = 'http://api.prosperent.com/api/search?limit=1&page=1&filterBrand=' + dom + '&filterTwoTapSupported=1&api_key=0da1ade1627ce72127d551d52d5b55e7';

            var options = {
              uri: url,
              timeout: 180000,
              json: true // Automatically parses the JSON string in the response

            };

            request(options, function (err, repos, body) {
              if (!err && body) {

                var jsData = body;
                if (jsData.data) {
                  var gd = jsData.data[0];

                  if (gd) {
                    totalRecordsFound = jsData.totalRecordsFound;

                    BrandProsperent.update({ brand: bdom }, { $set: { numProducts: totalRecordsFound } }).exec(function (err, resultx) {
                      if (err || resultx < 1) {
                        totalfailed += 1;

                        console.log('Brand update err' + err + ' ' + resultx);
                      } else {
                        totalsuccess += 1;

                      }
                      page += 1;
                      next();
                    });

                  } else {
                    totalfailed += 1;
                    page += 1;
                    next();
                  }
                } else {

                  totalfailed += 1;
                  page += 1;
                  next();

                }

              } else {

                totalfailed += 1;
                page += 1;
                next();

              }
            });

          }, function () {      //  A callback which is called after the test function has failed and repeated execution of fn has stopped
            console.log('All done ');

          });

      callback(null, totalsuccess);
    }
  ], function (err, result) {
    console.log(result);
    console.log('Brand data update done');
  });  // async end

}

function getStoreList() {
  message = '';
// var options = {
  // host: 'www.google.com',
  // port: 80,
  // path: '/upload',
  // method: 'POST'
// };

// var req = http.request(options, function(res) {
  // console.log('STATUS: ' + res.statusCode);
  // console.log('HEADERS: ' + JSON.stringify(res.headers));
  // res.setEncoding('utf8');
  // res.on('data', function (chunk) {
    // console.log('BODY: ' + chunk);
  // });
// });

// req.on('error', function(e) {
  // console.log('problem with request: ' + e.message);
// });

// // write data to request body
// req.write('data\n');
// req.write('data\n');
// req.end();
// --proxy=address:port specifies the proxy server to use (e.g. --proxy=192.168.1.42:8080).
  StoreProsperent.find({}).sort({ domain: -1 }).exec(function (err, data) {
    if (err) {
      console.log(err);

      return;
    }

    var dom;
    var options = {
      quality: 80,
      screenSize: {
        width: 1024,
        height: 768
      },
      shotSize: {
        width: 960,
        height: 537
      },
      siteType: 'url',
      phantomConfig: { 'ignore-ssl-errors': 'true', 'ssl-protocol': 'any', 'debug': 'true', 'web-security': 'false' },
      streamType: 'jpg',
      // errorIfStatusIsNot200: true,
      takeShotOnCallback: true,
      onLoadFinished: function() {
        window.callPhantom('takeShot');
      },

      renderDelay: 90000,
      timeout: 420000

    };

    var page = 1;
    // lastPage= 1;
    // screenshot('http://ghub.io/')
  // .width(800)
  // .height(600)
  // .capture(function(err, img) {
    // if (err) throw err;
    // fs.writeFileSync(process.cwd() + '/example.png', img);
    // console.log('open example.png');
  // });

    var lastPage = data.length;
  //  lastPage = ar.length;
    var webera,
        totalsuccess,
        totalfailed;

    var stringsuccess = '';
    totalsuccess = 0;
    totalfailed = 0;

    async.waterfall([
      function(callback) {
        IgnoredStoreProsperent.find({}, function (ignoreerr, ignoredata) {
          if (ignoreerr) {
            console.log(ignoreerr);
            callback(null, data);

            return;
          }

          for (var ig_index = 0; ig_index < ignoredata.length; ig_index += 1) {

            for (var data_index = 0; data_index < data.length; data_index += 1) {

              if (ignoredata[ig_index].domain === data[data_index].domain) {
                data.splice(data_index, 1);
                console.log(data_index);
                break;
              }

            }
            if ((ig_index + 1) === ignoredata.length) {
              callback(null, data);
            }
          }
          if (ignoredata.length === 0) {
            callback(null, data);
          }
        });

      },
      function(data, callback) {
        // arg1 now equals 'one' and arg2 now equals 'two'
        lastPage = data.length;
       // lastPage = ar.length;

        async.whilst(
          function () {         // synchronous truth test to perform before each execution of fn
            if (page > lastPage) {
              stringsuccess = '[' + formattedTime + '],Total Success:' + totalsuccess + ',Total failed:' + totalfailed + '\n';
              fs.appendFile(process.cwd() + '/public/images_webshot/successlog.csv', stringsuccess, function(appenderr) {
                if (appenderr) {
                  console.log('Last failed to append');
                }
                console.log('The final data was appended to file!');
              });
              message = message + '\n' + stringsuccess;
              message = message + '\n Sync operation happen on total ' + lastPage + ' Stores\n Thanks ';
             // sendgrid.sendcronimagemail(message);

            }

            return page <= lastPage; // when this will not full fill exit
          },
          function (next) {

            dom = data[page - 1].domain;
           // dom = ar[page - 1].domain;
            console.log(dom + '\n');
            unix_timestamp = Math.round(Date.now() / 1000);

            date = new Date(unix_timestamp * 1000);

            year = date.getFullYear();
            month = date.getMonth();
            dat = date.getUTCDate();

            hours = date.getHours();
            minutes = '0' + date.getMinutes();
            seconds = '0' + date.getSeconds();

            formattedTime = year + '-' + month + '-' + dat + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

            webshot(dom, process.cwd() + '/public/images_webshot/' + dom + '.jpg', options, function(err) {

              if (err) {

                webera = '';

                webera = '[' + formattedTime + '],' + dom + ',' + err + '\n';

                message = message + '' + webera;

                fs.appendFile(process.cwd() + '/public/images_webshot/errorlog.csv', webera, function(appenderr) {
                  if (appenderr) {
                    console.log('failed to append');
                  }
                  console.log('The "data to append" was appended to file!');
                });

                totalfailed += 1;
                page += 1;
                next();

              } else {

                webera = '';

                webera = '[' + formattedTime + '],' + dom + ',done\n';
                console.log(webera);
                fs.appendFile(process.cwd() + '/public/images_webshot/successlog.csv', webera, function(appenderr) {
                  if (appenderr) {
                    console.log('failed to append');
                  }
                  console.log('The "data to append" was appended to file!');
                });

                totalsuccess += 1;
                page += 1;
                next();

              }

            });

          }, function () {      //  A callback which is called after the test function has failed and repeated execution of fn has stopped
            console.log('Image import done ');

          });

        callback(null, totalsuccess);
      }
    ], function (err, result) {
      console.log(result);
      console.log('ignored data import done');
    });  // async end

  }); // store find end
} // function end

// exports.syncProductsAdd = function (req, res, next) {
  // var totalRecordsFound;
  // var pBody;
  // var url = 'http://api.prosperent.com/api/search?api_key=0da1ade1627ce72127d551d52d5b55e7&limit=1&page=1&filterTwoTapSupported=1';

  // productDeleteAll(function (err) {
    // if (err) { return next(err); }

    // request({
      // url: url,
      // method: 'GET'
    // }, function (err, reponse, body) {

      // if (err) { return next(err); }
      // var parsedBody = JSON.parse(body);

      // totalRecordsFound = parsedBody.totalRecordsFound;

      // CategoryProsperentSync.find({}, function (err, prodata) {  // find data exist
        // if (err) { return next(err); }

        // console.log(prodata);
        // console.log(prodata.length);
        // var j = 0;
        // var cata;

        // var page = 1;
        // var lastPage = prodata.length;    // @
        // var cat_err = [];

        // // async module maintain all asynchronous calls
        // async.whilst(
          // function () {         // synchronous truth test to perform before each execution of fn
            // return page <= lastPage;
          // },
          // function (next) {
            // // A function which is called each time last logic true
            // j = page - 1;
            // cata = prodata[j].category;
            // console.log(cata);

            // request({
              // url: 'http://api.prosperent.com/api/search?api_key=0da1ade1627ce72127d551d52d5b55e7&limit=100&page=1&filterTwoTapSupported=1&filterCategory=' + cata,
              // method: 'GET'
            // }, function (err, response, body) {

              // console.log(body);
              // if (!err && response.statusCode === 200) {
                // pBody = JSON.parse(body);
                // totalRecordsFound = pBody.totalRecordsFound;

                // if (totalRecordsFound > 0) {
                  // getProd(pBody.data, function(err) {
                    // if (err) { return next(err); }
                  // });
                // }

                // page += 1;
                // next();
              // } else {
                // console.log(err);
                // page += 1;
                // next();
                // cat_err.push({ 'category': cata, 'err': err });
              // }
            // });
          // }, function () {      //  A callback which is called after the test function has failed and repeated execution of fn has stopped
            // console.log('everything is done ');
            // console.log(cat_err);
          // });
      // });// categories sync find end
    // }); // api request end
  // }); // delete end
// };

// // insert a chunk of data
// function getProd(data, next) {
  // var bulk = ProductProsperent.collection.initializeUnorderedBulkOp();
  // var i = 0;

  // for (i = 0; i < data.length; i += 1) {
    // bulk.insert(data[i]);
  // }

  // bulk.execute(function (errx) {
    // if (errx) { return next(errx); }

    // console.log('Success');
  // });
// }
