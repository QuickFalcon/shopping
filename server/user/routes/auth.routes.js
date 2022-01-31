'use strict';

// User Routes
var users = require('../controllers/user.controllers');
var authPolicies = require('../policies/auth.policies');

/**
 * Module dependencies
 */
module.exports = function (app) {
  // Setting up the users password api
  app
    .route('/api/auth/forgot')
    .all(authPolicies.isAllowed)
    .post(users.forgot);
  app
    .route('/api/auth/reset/:token')
    .all(authPolicies.isAllowed)
    .get(users.validateResetToken);
  app
    .route('/api/auth/reset/:token')
    .all(authPolicies.isAllowed)
    .post(users.reset);
  app
    .route('/api/auth/reset/:token/cancel')
    .all(authPolicies.isAllowed)
    .post(users.cancelReset);

  // Setting up the users authentication api
  app
    .route('/api/auth/useremail')
    .post(users.mailunique);
  app
    .route('/api/auth/signup')
    .all(authPolicies.isAllowed)
    .post(users.signup);
  app
    .route('/api/auth/signin')
    .all(authPolicies.isAllowed)
    .post(users.signin);
  app
    .route('/api/auth/signout')
    .get(users.signout);
 // .all(authPolicies.isAllowed)
  // Setting the facebook oauth routes
  app
    .route('/api/auth/facebook')
    .all(authPolicies.isAllowed)
    .get(users.oauthCall('facebook', {
      scope: ['email', 'publish_actions']
    }));
  app
    .route('/api/auth/facebook/callback')
    .all(authPolicies.isAllowed)
    .get(users.oauthCallback('facebook'));

  // Setting the facebook oauth routes
  app
    .route('/api/auth/instagram')
    .all(authPolicies.isAllowed)
    .get(users.oauthCall('instagram', {
      scope: ['basic']
    }));
  app
    .route('/api/auth/instagram/callback')
    .all(authPolicies.isAllowed)
    .get(users.oauthCallback('instagram'));

  app
    .route('/api/auth/twitter')
    .all(authPolicies.isAllowed)
    .get(users.oauthCall('twitter'));
  app
    .route('/api/auth/twitter/callback')
    .all(authPolicies.isAllowed)
    .get(users.oauthCallback('twitter'));

  // Setting the twitter oauth routes
  // Setting the google oauth routes
  // app
  //   .route('/api/auth/google')
  //   .all(authPolicies.isAllowed)
  //   .get(users.oauthCall('google', {
  //     scope: [
  //       'https://www.googleapis.com/auth/userinfo.profile',
  //       'https://www.googleapis.com/auth/userinfo.email'
  //     ]
  //   }));
  // app
  //   .route('/api/auth/google/callback')
  //   .all(authPolicies.isAllowed)
  //   .get(users.oauthCallback('google'));
  //
  // // Setting the linkedin oauth routes
  // app
  //   .route('/api/auth/linkedin')
  //   .all(authPolicies.isAllowed)
  //   .get(users.oauthCall('linkedin', {
  //     scope: [
  //       'r_basicprofile',
  //       'r_emailaddress'
  //     ]
  //   }));
  // app
  //   .route('/api/auth/linkedin/callback')
  //   .all(authPolicies.isAllowed)
  //   .get(users.oauthCallback('linkedin'));
  //
  // // Setting the github oauth routes
  // app
  //   .route('/api/auth/github')
  //   .all(authPolicies.isAllowed)
  //   .get(users.oauthCall('github'));
  // app
  //   .route('/api/auth/github/callback')
  //   .all(authPolicies.isAllowed)
  //   .get(users.oauthCallback('github'));
  //
  // // Setting the paypal oauth routes
  // app
  //   .route('/api/auth/paypal')
  //   .all(authPolicies.isAllowed)
  //   .get(users.oauthCall('paypal'));
  // app
  //   .route('/api/auth/paypal/callback')
  //   .all(authPolicies.isAllowed)
  //   .get(users.oauthCallback('paypal'));
};
