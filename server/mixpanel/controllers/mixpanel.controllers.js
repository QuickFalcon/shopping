'use strict';

var request = require('request'),
    mongoose = require('mongoose'),
    MixPanelProsperent = mongoose.model('mixpanel_keyword'),
    KeywordSuggestion = mongoose.model('ss_keyword_suggestion'),
    async = require('async'),
    crypto = require('crypto');

exports.mixpanel = function (req, res) {
  var d = new Date();
  var n = d.getTime();
  var calculatedexpire = n / 1000;
  var expire = parseInt(calculatedexpire, 10);
  expire += 600; // expire time for request
  var expire2 = expire + 600;
  var expire3 = expire2 + 600;

  var dd = d.getDate();
  var mm = d.getMonth() + 1; // January is 0!
  var yyyy = d.getFullYear();

  if (dd < 10) {   // date less than 10 add 0 at front
    dd = '0' + dd;
  }

  if (mm < 10) {   // month less than 10 add 0 at front
    mm = '0' + mm;
  }

  var today = yyyy + '-' + mm + '-' + dd;
  var ap_key = '762d9805252a289b0bd20dfb16b40acc';
  var api_secret = '3afa788ebdba0365d8d52aa373b5a776';

  var signature_input = 'api_key=' + ap_key + 'event=click specific productexpire=' + expire + 'format=jsonfrom_date=2015-05-06to_date=' + today;
  var signature_ckoutinput = 'api_key=' + ap_key + 'event=click checkoutexpire=' + expire2 + 'format=jsonfrom_date=2015-05-06to_date=' + today;
  var sigProductLast30days = 'api_key=' + ap_key + 'event=["pageViewed","clickSpecificProduct","clickCheckout","BuyAttempt","SuccessfulBuy","search"]expire=' + expire3 + 'format=jsoninterval=7type=generalunit=day';

  var sig = signature_input.concat(api_secret);
  var sigckout = signature_ckoutinput.concat(api_secret);
  var sigPro30day = sigProductLast30days.concat(api_secret);

  var hash = crypto.createHash('md5').update(sig).digest('hex');
  var hashckout = crypto.createHash('md5').update(sigckout).digest('hex');
  var hashPro30day = crypto.createHash('md5').update(sigPro30day).digest('hex');

  var url = 'http://mixpanel.com/api/2.0/segmentation/?sig=' + hash + '&event=click+specific+product&from_date=2015-05-06&to_date=' + today + '&api_key=' + ap_key + '&format=json&expire=' + expire;

  var urlckout = 'http://mixpanel.com/api/2.0/segmentation/?sig=' + hashckout + '&event=click+checkout&from_date=2015-05-06&to_date=' + today + '&api_key=' + ap_key + '&format=json&expire=' + expire2;

  var urlLast30days = 'http://mixpanel.com/api/2.0/events/?sig=' + hashPro30day + '&event=["pageViewed","clickSpecificProduct","clickCheckout","BuyAttempt","SuccessfulBuy","search"]&expire=' + expire3 + '&format=json&interval=7&type=general&unit=day&api_key=' + ap_key;

  request({
    url: url,
    method: 'GET'
  }, function () {
    request({
      url: urlckout,
      method: 'GET'
    }, function () {

      request({
        url: urlLast30days,
        method: 'GET'
      }, function (err, reponse, alldata) {
        res.write(alldata);
        res.end();
      });
    });
  });
};

exports.mixpanelsearch = function (req, res) {
  var d = new Date();
  var n = d.getTime();
  var calculatedexpire = n / 1000;
  var expire = parseInt(calculatedexpire, 10);
  expire += 600; // expire time for request
  var dd = d.getDate();
  var ld = dd - 1;
  var mm = d.getMonth() + 1; // January is 0!
  var yyyy = d.getFullYear();
  var lyyy = d.getFullYear() - 1;
  console.log(lyyy);
  if (dd < 10) {   // date less than 10 add 0 at front
    dd = '0' + dd;
  }
  if (ld < 10) {   // date less than 10 add 0 at front
    ld = '0' + ld;
  }

  if (mm < 10) {   // month less than 10 add 0 at front
    mm = '0' + mm;
  }

  var lastday = yyyy + '-' + mm + '-' + ld;
  var today = yyyy + '-' + mm + '-' + ld;

  var ap_key = '762d9805252a289b0bd20dfb16b40acc';
  var api_secret = '3afa788ebdba0365d8d52aa373b5a776';

  var search_keyword_limit = 1000; // return top search keywords in a day
  var sig_search = 'api_key=' + ap_key + 'event=searchexpire=' + expire + 'from_date=' + lastday + 'limit=' + search_keyword_limit + 'on=properties["search_keyword"]to_date=' + today;

  var sigSearchConcat = sig_search.concat(api_secret);               // concatenate to get search key

  var hash_search_top = crypto.createHash('md5').update(sigSearchConcat).digest('hex'); // get the signature for search

  var url_seg_search = 'http://mixpanel.com/api/2.0/segmentation/?sig=' + hash_search_top + '&api_key=' + ap_key + '&event=search&expire=' + expire + '&from_date=' + lastday + '&limit=' + search_keyword_limit + '&on=properties["search_keyword"]&to_date=' + today;
  console.log(url_seg_search);
  request({
    url: url_seg_search,
    method: 'GET'
  }, function (err, reponse, searchdata) {

    if (searchdata) {
      res.write(searchdata);
    }
    res.end();
  });

};
// hello
exports.mixpanelsearchDb = function (req, res, next) {
/*
  MixPanelProsperent.find({}, function (err, data) {  // find data exist
    if (err) { return next(err); }
    res.send(data);
  });*/

  var query = MixPanelProsperent.find({}).sort('-count');

  query.exec(function (err, data) {
    if (err) { return next(err); }
    res.send(data);

  });

};
exports.suggestionMixpanel = function (req, res, next) {

  var searchquery = {},
      sortingorder;

  if (req.body.keyword) {

    var reqVar = req.body.keyword;
    var reqVar2 = new RegExp(reqVar, 'i');

    searchquery.keyword = reqVar2; // i deal case sensitive issues

  }
  var offset = req.body.offset;
  var start = offset * req.body.start;

  var lquery = MixPanelProsperent.find(searchquery).skip(0)
      .limit(6)
      .sort('keyword')
      .select({
        keyword: 1,
        _id: -1

      }); // define query to find data result

  lquery.exec(function (err, data) {
    if (err) {

      res.end();

      return next(err); }

    async.waterfall([
      function(callback) {
        var ty = [];
        for (var t = 0; t < data.length; t += 1) {
          ty.push(data[t].keyword);
        }
        callback(null, ty);
      }
    ], function (err, result) {
      res.send(result);
    });

  });

};

exports.suggestionSS = function (req, res, next) {

  var searchquery = {},
      sortingorder;

  if (req.body.keyword) {

    var reqVar = req.body.keyword;
    var reqVar2 = new RegExp(reqVar, 'i');

    searchquery.keyword = reqVar2; // i deal case sensitive issues

  }
  var offset = req.body.offset;
  var start = offset * req.body.start;

  var lquery = KeywordSuggestion.find(searchquery).skip(0)
      .limit(6)
      .sort('keyword')
      .select({
        keyword: 1,
        _id: -1

      }); // define query to find data result

  lquery.exec(function (err, data) {
    if (err) {

      res.end();

      return next(err); }

    async.waterfall([
      function(callback) {
        var ty = [];
        for (var t = 0; t < data.length; t += 1) {
          ty.push(data[t].keyword);
        }
        callback(null, ty);
      }
    ], function (err, result) {
      res.send(result);
    });

  });

};
