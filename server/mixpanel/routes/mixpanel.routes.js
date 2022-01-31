'use strict';

/**
 * Module dependencies
 */
var mixpanel = require('../controllers/mixpanel.controllers');

module.exports = function (app) {
  app.route('/mixpanel')
    .get(mixpanel.mixpanel);

  app.route('/mixpanelsearch')
    .get(mixpanel.mixpanelsearch);

  app.route('/mixpanelsearchDb')
    .post(mixpanel.mixpanelsearchDb);

  app.route('/suggestionMixpanel')
      .post(mixpanel.suggestionMixpanel);

  app.route('/suggestionSS')
      .post(mixpanel.suggestionSS);

};
