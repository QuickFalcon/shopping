'use strict';

/**
 * Module dependencies
 */
var core = require('../controllers/core.controllers');

module.exports = function (app) {

  app.route('/')
    .get(core.view)
    .post(core.search);

  app.get('/r', core.viewRamadan);
  app.get('/camera', core.camera);
  app.get('/wp', core.wp);
  app.get('/coupon', core.coupon);

  app.route('/admin')
    .get(core.admin)
    .post(core.adminPost);

  app.get('/admin#', core.admin2);
  app.get('/register', core.register);
  app.get('/admindashboard', core.admindashboard);
  app.get('/blogData/:pgNumber', core.blogData);

  // add copy of index.html

  app.get('/copy', core.copy);
  app.get('/refactor', core.refactor);
  app.get('/refactor/*', core.refactor);

};
