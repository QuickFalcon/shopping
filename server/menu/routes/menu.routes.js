'use strict';

/**
 * Module dependencies
 */
var menu = require('../controllers/menu.controllers');

module.exports = function (app) {
  app.route('/calculate_top')
    .get(menu.calculateTop);
};
