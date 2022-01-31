'use strict';

/**
 * Module dependencies
 */
var passport = require('passport'),
    InstagramStrategy = require('passport-instagram').Strategy,
    users = require(process.cwd() + '/server/user/controllers/user.controllers');

module.exports = function (config) {
  // Use instagram strategy
  passport.use(new InstagramStrategy({
    clientID: config.instagram.clientID,
    clientSecret: config.instagram.clientSecret,
    callbackURL: config.instagram.callbackURL,
    profileFields: ['id'],
    passReqToCallback: true
  },
  function (req, accessToken, refreshToken, profile, done) {
    // Set the provider data and include tokens
    var providerData = profile._json;
    providerData.accessToken = accessToken;
    providerData.refreshToken = refreshToken;

    // Create the user OAuth profile
    var providerUserProfile = {
      provider: 'instagram',
      providerIdentifierField: 'id',
      providerData: providerData
    };

    // Save the user OAuth profile
    users.saveOAuthUserProfile(req, providerUserProfile, done);
  }));
};
