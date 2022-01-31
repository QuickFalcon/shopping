'use strict';

/**
 * Module dependencies
 */
var prosperent = require('../controllers/prosperent.controllers');

module.exports = function (app) {
  app.route('/prosperent')
  .get(prosperent.prosperent);

  app.route('/prosperentcommission')
  .get(prosperent.prosperentcommission);

  app.route('/prosperentpayment')
  .get(prosperent.prosperentpayment);
};
