'use strict';

var _ = require('lodash');

module.exports = _.extend(
  require('./user.authentication.controllers'),
  require('./user.password.controllers'),
  require('./user.profile.controllers'),
  require('./user.fns.controllers')
);
