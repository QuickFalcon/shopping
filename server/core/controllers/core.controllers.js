'use strict';

var config = require(process.cwd() + '/config'),
    request = require('request'),
    path = require('path'),
    mongoose = require('mongoose'),
    Admin = mongoose.model('Admin'),
    // validator = require('validator'),
    hat = require('hat');

exports.view = function (req, res) {
  // res.sendFile(process.cwd() + '/views/index.html');
  var safeUserObject = null;
  if (req.user) {
    safeUserObject = req.user;

  }

  res.render(process.cwd() + '/views/index.html', {
    user: JSON.stringify(safeUserObject)
  });

};

exports.copy = function(request, response){
  var safeUserObject = null;
  if (request.user) {
    safeUserObject = request.user;

  }

  response.render(process.cwd() + '/views/index_copy.html', {
    user: JSON.stringify(safeUserObject)
  });
};

exports.refactor = function(request, response){
  var safeUserObject = null;
  if (request.user) {
    safeUserObject = request.user;

  }

  response.render(process.cwd() + '/views/index_refactor.html', {
    user: JSON.stringify(safeUserObject)
  });
};

exports.viewRamadan = function (req, res) {
  var safeUserObject = null;
  if (req.user) {
    safeUserObject = req.user;
    // safeUserObject = {
    //   displayName: validator.escape(req.user.displayName),
    //   provider: validator.escape(req.user.provider),
    //   username: validator.escape(req.user.username),
    //   created: req.user.created.toString(),
    //   roles: req.user.roles,
    //   profileImageURL: req.user.profileImageURL,
    //   email: validator.escape(req.user.email),
    //   lastName: validator.escape(req.user.lastName),
    //   firstName: validator.escape(req.user.firstName),
    //   additionalProvidersData: req.user.additionalProvidersData
    // };
  }

  res.render(process.cwd() + '/views/index_ramadan.html', {
    user: JSON.stringify(safeUserObject)
  });

};

exports.camera = function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
};

// call Blog
exports.blogData = function (req, res) {
  var pgNumber = req.params.pgNumber;
  request({
    url: 'http://sociallyshoppable.com/style/linked-products.php?page_number=' + pgNumber,
    method: 'GET'
  }, function (err, response, body) {
    res.send(body);
  });
};

// call WP
exports.wp = function (req, res) {
  request({
    //  url: 'http://localhost/r_d/rsslib.php',
    //  url: 'http://45.55.138.4:8079/r_d/rsslib.php',
    url: 'http://sociallyshoppable.com/style/blog-slider.php',
    method: 'GET'
  }, function (err, response, body) {
    res.send(body);
  });
};

// get coupons from WP
exports.coupon = function (req, res) {
  request({
    url: 'http://localhost:8079/r&d/cj.php',
    method: 'GET'
  }, function (err, response, body) {
    res.send(body);
  });
};

// search
exports.search = function (req, res) {
  var search_key = req.body.search;

  request({
    url: 'http://api.prosperent.com/api/search?api_key=0da1ade1627ce72127d551d52d5b55e7&query="' + search_key + '"&limit=' + config.resultsLimit + '&page=1',
    method: 'GET'
  }, function (err, reponse, body) {

    var dataArray = JSON.parse(body),
        totalrecordsavailable = dataArray.totalRecordsAvailable,
        totalrecordfound = dataArray.totalRecordsFound,
        uid = hat();

    if (totalrecordsavailable > 0) {
      res.render('searchintegrate', {
        title: 'searched for:' + search_key,
        searchkey: search_key + ',' + search_key + ' sociallyshoppablestyle,buy ' + search_key,
        description: 'Online shopping from the earth\'s best selection of ' + search_key + ', easy checkout. No hidden cost. Socially Shoppable, is a  customized shop.Buy from 100\'s of brand store using one click',
        totalrecordsavailable: totalrecordsavailable,  // total record available to me
        totalrecordfound: totalrecordfound, // total record in prospernet data feed
        dx: dataArray.data,
        twotap_public_token: config.twotap.publicToken,
        uid: uid,
        skey: search_key
      });
    } else {
      res.end('no record found');
    }
  });
};
exports.admin = function (req, res) {
  res.sendFile(process.cwd() + '/views/STANDARD/login_signin.html');

};
// exports.admin = function (req, res) {
// res.sendFile(path.cwd() + '/views/STANDARD/login_signin.html');

// };
exports.admin2 = function (req, res) {
  res.sendFile(process.cwd() + '/views/STANDARD/login_signin.html');
};

exports.register = function (req, res) {
  res.sendFile(process.cwd() + '/views/STANDARD/login_registration.html');
};

exports.admindashboard = function (req, res) {
  // res.sendFile('index.html');
  res.sendFile(path.cwd() + '/views/STANDARD/index.html');
};

exports.adminPost = function (req, res) {
  var login = req.body.username;
  var pass = req.body.password;

  Admin.findOne({ username: login, password: pass }, function (err, admindata) {
    if (err) {
      res.sendFile(process.cwd() + '/views/STANDARD/login_signin.html');

      return;
    }

    if (admindata) {
      res.sendFile(process.cwd() + '/views/admin.html');
    } else {
      res.redirect('/admin'); // redirected to login page
    }
  });
};
