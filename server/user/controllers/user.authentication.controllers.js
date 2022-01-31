'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
    passport = require('passport'),
    User = mongoose.model('User'),
    UserToken = mongoose.model('UserToken');

// URLs for which user can't be redirected on signin
var noReturnUrls = [
  '/authentication/signin',
  '/authentication/signup'
];

/**
 * Signup
 */

exports.mailunique = function (req, res, next) {
  var email = req.body.email;
  User.findOne({ 'email': email }, function (err, person) {
    if (err) return next({ status: 400, message: 'error  occur when find', code: 'mailRegistered' });
    // console.log(person);
    if (person !== null) {
      res.json({ 'exist': 'Yes' });
    } else {
      res.json({ 'exist': 'No' });
    }
  });
};

exports.signup = function (req, res, next) {
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  // Init user and add missing fields
  var user = new User(req.body);

  user.provider = 'local';

  // Then save the user
  user.save(function (err) {
    if (err) {
      if (err.code === 11000) {
        return next({ status: 400, message: 'The e-mail you tried to use is already registed.', code: 'mailRegistered' });
      }
    }
    // Remove sensitive data before login
    user.password = undefined;
    user.salt = undefined;

    req.login(user, function (err) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.json(user);
      }
    });
  });
};

/**
 * Signin after passport authentication
 */
exports.signin = function (req, res, next) {

  passport.authenticate('local', function (err, user, info) {
   // console.log(user);

    if (err || !user) {
      res.status(422).send(info);
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      req.login(user, function (err) {
        if (err) { return next(err); }

        if (!req.body.remember) {
          return res.json(user);
        }
        var token = randomString(64);

        UserToken.saveNew(token, user.id, function(err) {
          if (err) { return next(err); }
          res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 });

          console.log(user);

          return res.json(user);
        });
      });
    }
  })(req, res, next);
};

/**
 * Signout
 */
exports.signout = function (req, res) {
  req.logout();
  res.cookie('remember_me', '', { path: '/', httpOnly: true, maxAge: 604800000 });
  res.redirect('/');
};

/**
 * OAuth provider call
 */
exports.oauthCall = function (strategy, scope) {
  return function (req, res, next) {
    if (req.query && req.query.redirect_to) {
      req.session.redirect_to = req.query.redirect_to;
    }

    // Authenticate
    passport.authenticate(strategy, scope)(req, res, next);
  };
};

/**
 * OAuth callback
 */
exports.oauthCallback = function (strategy) {
  return function (req, res, next) {

    // info.redirect_to contains inteded redirect path
    passport.authenticate(strategy, function (err, user) {
      if (err) {
        return res.render(process.cwd() + '/views/socialSignupCallback.html', {
          err: JSON.stringify(err)
        });
      }
      if (!user) {
        return res.render(process.cwd() + '/views/socialSignupCallback.html', {
          err: JSON.stringify({ message: 'No user logged in' })
        });
      }

      return res.render(process.cwd() + '/views/socialSignupCallback.html', {
        err: JSON.stringify(err)
      });
    })(req, res, next);
  };
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function (req, providerUserProfile, done) {
  var info = {};

  // Set redirection path on session.
  // Do not redirect to a signin or signup page
  if (noReturnUrls.indexOf(req.session.redirect_to) === -1) {
    info.redirect_to = req.session.redirect_to;
  }

  if (!req.user) { return done({ message: 'User not signed in' }); }

  // User is already logged in, join the provider data to the existing user
  var user = req.user;

  // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
  if (!user.additionalProvidersData) {
    user.additionalProvidersData = {};
  }

  user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

  // Then tell mongoose that we've updated the additionalProvidersData field
  user.markModified('additionalProvidersData');

  // And save the user
  user.save(function (err) {
    return done(err, user, info);
  });
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function (req, res, next) {
  var user = req.user;
  var provider = req.query.provider;

  if (!user) {
    return res.status(401).json({
      message: 'User is not authenticated'
    });
  } else if (!provider) {
    return res.status(400).send();
  }

  // Delete the additional provider
  if (user.additionalProvidersData[provider]) {
    delete user.additionalProvidersData[provider];

    // Then tell mongoose that we've updated the additionalProvidersData field
    user.markModified('additionalProvidersData');
  }

  user.save(function (err) {
    if (err) {
      return next(err);
    }
    req.login(user, function (err) {
      if (err) {
        return res.status(400).send(err);
      } else {
        return res.json(user);
      }
    });
  });
};

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
