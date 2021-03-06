'use strict';

/**
 * Module dependencies
 */
var passport = require('passport'),
    User = require('mongoose').model('User'),
    path = require('path'),
    utils = require(process.cwd() + '/config/lib/utils'),
    config = require(process.cwd() + '/config/env/default');

/**
 * Module init function
 */

module.exports = function (app) {
  // Serialize sessions
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // Deserialize sessions
  passport.deserializeUser(function (id, done) {
    User.findOne({
      _id: id
    }, '-salt -password', function (err, user) {
      done(err, user);
    });
  });

  // Initialize strategies
  utils.getGlobbedPaths(path.join(__dirname, './strategies/**/*.js')).forEach(function (strategy) {
    require(path.resolve(strategy))(config);
  });

  // Add passport's middleware
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(passport.authenticate('remember-me'));

};
