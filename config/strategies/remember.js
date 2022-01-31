'use strict';

/**
 * Module dependencies
 */
var passport = require('passport'),
    mongoose = require('mongoose'),
    UserToken = mongoose.model('UserToken'),
    RememberMeStrategy = require('passport-remember-me').Strategy;

module.exports = function () {
  passport.use(new RememberMeStrategy(
    function(token, done) {
      UserToken.consume(token, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }

        return done(null, user);
      });
    },
    function(user, done) {
      var token = randomString(64);
      UserToken.saveNew(token, user.id, function(err) {
        if (err) { return done(err); }

        return done(null, token);
      });
    }
  ));

  function randomString(len) {
    var buf = [],
        chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        charlen = chars.length;

    for (var i = 0; i < len; i += 1) {
      buf.push(chars[getRandomInt(0, charlen - 1)]);
    }

    return buf.join('');
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - (min + 1))) + min;
  }
};
