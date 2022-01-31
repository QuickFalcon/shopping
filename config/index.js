'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    _ = require('lodash'),
    utils = require(process.cwd() + '/config/lib/utils');

var initGlobalConfig = function () {

  // set the environment or use the default
  process.env.NODE_ENV = process.env.NODE_ENV || 'default';

  console.info('Using environment: ' + process.env.NODE_ENV);

  // Get the default config
  var defaultConfig = require(path.join(process.cwd(), 'config/env/default'));

  // get env config
  var environmentConfig = require(path.join(process.cwd(), 'config/env/', process.env.NODE_ENV)) || {};

  // Merge config files
  var config = _.merge(defaultConfig, environmentConfig);

  config.files.server.models = utils.getGlobbedPaths('server/*/models/**/*.js');
  config.files.server.routes = utils.getGlobbedPaths('server/*/routes/**/*.js');
  config.files.server.policies = utils.getGlobbedPaths('server/*/policies/**/*.js');

  return config;
};

/**
 * Set configuration object
 */
module.exports = initGlobalConfig();
