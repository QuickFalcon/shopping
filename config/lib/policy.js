'use strict';

var acl = require('acl'),
    _ = require('lodash'),
    allRules = [];

// Using the memory backend
acl = new acl(new acl.memoryBackend());

exports.allow = function(rules) {
  acl.allow(rules);

  allRules = allRules.concat(rules);
};

exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    }

    if (isAllowed) {
      // Access granted! Invoke next middleware
      return next();
    }

    return res.status(403).json({
      message: 'User is not authorized'
    });
  });
};

exports.checkPolicies = function(app) {

  console.log('** LIST OF MISSING POLICIES FOR ROUTES ** \x1b[31m');
  app._router.stack.forEach(function(r) {
    if (r.route && r.route.path) {

      for (var i = 0; i < allRules.length; i += 1) {
        for (var j = 0; j < allRules[i].allows.length; j += 1) {
          var rule = allRules[i].allows[j];
          var permissions = typeof rule.permissions === 'string' ? [rule.permissions] : rule.permissions;

          // make sure _all is there
          permissions.push('_all');

          if (rule.resources === r.route.path && (permissions[0] === '*' || _.isEqual(permissions.sort(), Object.keys(r.route.methods).sort()))) {
            return;
          }
        }
        console.log(r.route.path + ' - ' + Object.keys(r.route.methods));
      }
    }
  });

  console.log('\x1b[0m ** END OF LIST **');
};
