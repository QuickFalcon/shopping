'use strict';

/**
 * Module dependencies
 */
var cron = require('../controllers/cron.controllers.js');

module.exports = function (app) {

  // main product search
  app.route('/siteUpdated')
    .get(cron.siteUpdated);
  app.route('/couponUpdated')
    .get(cron.couponUpdated);

  app.route('/cartCornJob')
	.get(cron.cartCornJob);

  app.route('/wishCornJob')
	.get(cron.wishCornJob);

    app.route('/cjProduct')
        .get(cron.insertCjProducts);


};
