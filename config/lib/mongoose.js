'use strict';

/**
 * Module dependencies.
 */
var config = require('../'),
    path = require('path'),
    mongoose = require('mongoose');

// Load the mongoose models
module.exports.loadModels = function (callback) {
  // Globbing model files
  config.files.server.models.forEach(function (modelPath) {
    require(path.resolve(modelPath));
  });

  if (callback) { callback(); }
};

// Initialize Mongoose
module.exports.connect = function (cb) {
  var db = mongoose.connect(config.db.uri, config.db.options, function (err) {
    db.connection = mongoose.connection;
    // Log Error
    if (err) {
      console.error(console.error('Could not connect to MongoDB!'));
      console.log(err);
    } else {
      // Enabling mongoose debug mode if required
      mongoose.set('debug', config.db.debug);
      mongoose.Promise = global.Promise;

      // Call callback FN
      if (cb) { cb(db); }
    }
  });
};

module.exports.disconnect = function (cb) {
  mongoose.disconnect(function (err) {
    console.info(console.warn('Disconnected from MongoDB.'));
    cb(err);
  });
};
