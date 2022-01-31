'use strict';

/**
 * Module dependencies
 */
var admin = require('../controllers/admin.controllers');

module.exports = function (app) {

  app.route('/loginRegistration')
    .post(admin.adminRegistration);

};

