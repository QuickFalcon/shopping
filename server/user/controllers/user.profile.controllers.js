'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash'),
    config = require(process.cwd() + '/config/env/default'),
    validator = require('validator'),
    FB = require('fb'),
    Twitter = require('twitter'),
    Instagram = require('instagram-private-api').V1;

var whitelistedFields = ['firstName', 'lastName', 'email', 'username'];

/**
 * Update user details
 */
exports.update = function (req, res, next) {
  // Init Variables
  var user = req.user;

  if (user) {
    // Update whitelisted fields only
    user = _.extend(user, _.pick(req.body, whitelistedFields));

    user.updated = Date.now();
    user.displayName = user.firstName + ' ' + user.lastName;

    user.save(function (err) {
      console.log('exports.update', user.displayName);
      console.log(user);
      if (err) {
        return next(err);
      }
      req.login(user, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.json(user);
        }
      });
    });
  } else {
    res.status(401).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Send User
 */
exports.me = function (req, res) {
  // Sanitize the user - short term solution. Copied from core.server.controller.js
  // TODO create proper passport mock: See https://gist.github.com/mweibel/5219403
  var safeUserObject = null;

  if (req.user) {
    safeUserObject = {
      displayName: validator.escape(req.user.displayName),
      provider: validator.escape(req.user.provider),
      username: validator.escape(req.user.username),
      created: req.user.created.toString(),
      roles: req.user.roles,
      profileImageURL: req.user.profileImageURL,
      email: validator.escape(req.user.email),
      lastName: validator.escape(req.user.lastName),
      firstName: validator.escape(req.user.firstName),
      additionalProvidersData: req.user.additionalProvidersData
    };
  }

  res.json(safeUserObject || null);
};

exports.checkSocialLogin = function (req, res) {
  console.log(req.params.type);
  switch (req.params.type) {
    case 'facebook':
      _checkFacebookLogin();
      break;
    case 'twitter':
      _checkTwitterLogin();
      break;
    case 'instagram':
      _checkInstagramLogin(req);
      break;
  }

  // facebook
  function _checkFacebookLogin() {
    FB.options({
      appId: config.facebook.clientID,
      appSecret: config.facebook.clientSecret,
      accessToken: req.user.additionalProvidersData.facebook.accessToken
    });

    FB.api('me', 'get', function (response) {
      if (!response || response.error) {
        console.log('error', response);
        res.status(400);

        return res.send(response);
      }

      res.send({ status: 'ok' });
    });
  }

  // twitter
  function _checkTwitterLogin() {
    var client = new Twitter({
      consumer_key: config.twitter.clientID,
      consumer_secret: config.twitter.clientSecret,
      access_token_key: req.user.additionalProvidersData.twitter.accessToken,
      access_token_secret: req.user.additionalProvidersData.twitter.refreshToken
    });

    client.get('account/verify_credentials', function(error) {
      if (error) {
        console.log('error', error);
        res.status(400);

        return res.send(error);
      }

      res.send({ status: 'ok' });
    });
  }

  // instagram

  function _checkInstagramLogin() {
    if (!req.user.instagramEmail) {
      return res.status(400).send({ status: 'fail', message: 'No instagram information' });
    }
    var device = new Instagram.Device(req.user.instagramEmail);
    var storage = new Instagram.CookieFileStorage(process.cwd() + '/cookies/' + req.user.instagramEmail + '.json');

    return Instagram.Session.create(device, storage)
      .then(() => res.send({ status: 'ok' }))
      .catch((error) => res.status(400).send({ status: 'fail', message: error.message }));
  }

};
