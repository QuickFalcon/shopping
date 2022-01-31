'use strict';

/**
 * Module dependencies
 */
var upload = require('../controllers/upload.controllers');

module.exports = function (app) {

  app.route('/upload/profile')
    .post(upload.processUpload, upload.saveProfilePhoto)
    .get(upload.processImport, upload.saveProfilePhoto);

  app.route('/upload/:catalogId/product')
    .post(upload.processUpload, upload.saveProductPhoto)
    .get(upload.processImport, upload.saveProductPhoto);
};
