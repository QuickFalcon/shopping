'use strict';

/**
 * Module dependencies
 */
var passport = require('passport'),
    TwitterStrategy = require('passport-twitter').Strategy,
    users = require(process.cwd() + '/server/user/controllers/user.controllers');

module.exports = function (config) {
  // Use twitter strategy
  passport.use(new TwitterStrategy({
    consumerKey: config.twitter.clientID,
    consumerSecret: config.twitter.clientSecret,
    callbackURL: config.twitter.callbackURL,
    passReqToCallback: true
  },
  function (req, accessToken, refreshToken, profile, done) {
    // Set the provider data and include tokens
    var providerData = profile._json;
    providerData.accessToken = accessToken;
    providerData.refreshToken = refreshToken;

    // Create the user OAuth profile
    var providerUserProfile = {
      provider: 'twitter',
      providerIdentifierField: 'id',
      providerData: providerData
    };

    // Save the user OAuth profile
    users.saveOAuthUserProfile(req, providerUserProfile, done);
  }));
};
