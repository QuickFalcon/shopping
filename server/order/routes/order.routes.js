'use strict';

/**
 * Module dependencies
 */
var order = require('../controllers/order.controllers');

module.exports = function (app) {
  app.route('/purchase')
    .post(order.purchase);

  app.route('/confirm')
    .post(order.confirm);

  app.route('/finish')
    .post(order.finish);

  app.route('/updatecheck')
    .get(order.updatecheck);
};
