'use strict';

var request = require('request');

exports.prosperent = function (req, res) {
  var url = 'http://api.prosperent.com/api/clicks?accessKey=c862b222c3eee43c160855d49ed4e847';

  request({
    url: url,
    method: 'GET'
  }, function (err, reponse, body) {
    res.end(body);
  });
};

exports.prosperentcommission = function (req, res) {
  var d = new Date();
  var dd = d.getDate();
  var mm = d.getMonth() + 1; // January is 0!
  var yyyy = d.getFullYear();
  var yyyz = yyyy - 1;

  if (dd < 10) {   // date less than 10 add 0 at front
    dd = '0' + dd;
  }

  if (mm < 10) {   // month less than 10 add 0 at front
    mm = '0' + mm;
  }
  var lastyear = yyyz + '' + mm + '' + dd;
  var today = yyyy + '' + mm + '' + dd;
  var url = 'http://api.prosperent.com/api/commissions?accessKey=c862b222c3eee43c160855d49ed4e847&filterCommissionDate=' + lastyear + ',' + today;

  request({
    url: url,
    method: 'GET'
  }, function (err, reponse, body) {
    res.end(body);
  });
};

exports.prosperentpayment = function (req, res) {
  // http://api.prosperent.com/api/clicks
  var url = ' http://api.prosperent.com/api/payments?accessKey=c862b222c3eee43c160855d49ed4e847';

  request({
    url: url,
    method: 'GET'
  }, function (err, reponse, body) {
    res.end(body);
  });
};
