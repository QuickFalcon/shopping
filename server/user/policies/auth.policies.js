'use strict';

var policy = require(process.cwd() + '/config/lib/policy');

exports.isAllowed = policy.isAllowed;

exports.initPolicies = function () {
  policy.allow([{
    roles: ['guest', 'user'],
    allows: [{
      resources: '/api/auth/forgot',
      permissions: 'post'
    }, {
      resources: '/api/auth/reset/:token',
      permissions: 'get'
    }, {
      resources: '/api/auth/reset/:token',
      permissions: 'post'
    }, {
      resources: '/api/auth/reset/:token/cancel',
      permissions: 'post'
    }, {
      resources: '/api/auth/signup',
      permissions: 'post'
    }, {
      resources: '/api/auth/signin',
      permissions: 'post'
    }, {
      resources: '/api/auth/signout',
      permissions: 'get'
    }, {
      resources: '/api/auth/facebook',
      permissions: 'get'
    }, {
      resources: '/api/auth/facebook/callback',
      permissions: 'get'
    }, {
      resources: '/api/auth/instagram',
      permissions: 'get'
    }, {
      resources: '/api/auth/instagram/callback',
      permissions: 'get'
    }, {
      resources: '/api/auth/twitter',
      permissions: 'get'
    }, {
      resources: '/api/auth/twitter/callback',
      permissions: 'get'
    }, {
      resources: '/unsignedUserInfo',
      permissions: 'post'
    }, {
      resources: '/unsigned_user_delete',
      permissions: 'post'
    }, {
      resources: '/unsigned_user_cart/:unsignedId',
      permissions: 'get'
    }]
  }]);
};
