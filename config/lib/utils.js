'use strict';

var _ = require('lodash'),
    glob = require('glob');

/**
 * Get files by glob patterns
 */
module.exports.getGlobbedPaths = function (globPatterns, excludes) {
  // URL paths regex
  var urlRegex = /^(?:[a-z]+:)?\/\//i;

  // The output array
  var output = [];

  // If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
  if (_.isArray(globPatterns)) {
    globPatterns.forEach(function (globPattern) {
      output = _.union(output, module.exports.getGlobbedPaths(globPattern, excludes));
    });
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {
      var files = glob.sync(globPatterns);

      if (excludes) {
        files = files.map(function (file) {
          if (_.isArray(excludes)) {

            excludes.forEach(function(val) {
              file = file.replace(val, '');
            });
          } else {
            file = file.replace(excludes, '');
          }

          return file;
        });
      }
      output = _.union(output, files);
    }
  }

  return output;
};
