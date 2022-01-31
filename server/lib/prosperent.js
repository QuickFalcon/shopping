'use strict';

var config = require(process.cwd() + '/config'),
    Promise = require('bluebird'),
    mongoose = require('mongoose'),
    objectId = mongoose.Types.ObjectId,
    ProductProsperent = mongoose.model('ss_tap_Product'),
    request = Promise.promisify(require('request'));

   // request = Promise.promisify(require('request'));

var baseUrl = 'http://api.prosperent.com/api/'; // product search api

exports.search = search;
exports.getByCatalogId = getByCatalogId;
exports.getMerchantByCatalogId = getMerchantByCatalogId;

/**
 * Search for products given the filter parameters
 */
function search(params) {
  return requestPromiseSearch('get', 'search', params);
}

/**
 * Get one product by its ID
 */
function getByCatalogId(catalogId, cb) {

  var params = {
    filterCatalogId: catalogId
  };

  return requestPromise('get', 'search', params, cb)
    .then((result) => result.length && result[0]);
}

/**
 * Get one merchange by its ID
 */
function getMerchantByCatalogId(merchant, cb) {

  var params = {
   // filterMerchantId: merchantId
    filterMerchant: merchant

  };

  return requestPromiseMerchant('get', 'merchant', params, cb)
    // .then((result) => result.data.length && result.data[0]);
    .then((result) => (result.data && result.data.length) && result.data[0]);
}

function requestPromiseSearch(method, endpoint, params) {
  var result;

  return new Promise(function(resolve, reject) {
    console.log(baseUrl + endpoint + '?' + params + '&api_key=' + config.prosperent.apiKey);
    request({
      method: method,
      uri: baseUrl + endpoint + '?' + params + '&api_key=' + config.prosperent.apiKey,
      // url: baseUrl + endpoint,
      // qs: Object.assign({ api_key: config.prosperent.apiKey }, params),
      timeout: 60000,
      json: true
    }, function (err, response, body) {
      if (err) {
        console.log(err);
        console.log(err.code === 'ETIMEDOUT');
        console.log(err.connect === true);
        if (err.code === 'ETIMEDOUT' || err.connect || err.code === 'ECONNRESET') {

          request({
            method: method,
            uri: baseUrl + endpoint + '?' + params + '&api_key=' + config.prosperent.apiKey,
            timeout: 150000,
            json: true
          }, function (errTimeout, responseTOU, bodyTOU) {
            if (errTimeout) {
              console.log('Prosperent Lib file 2nd time error');
              console.log(errTimeout.code === 'ETIMEDOUT');
              console.log(errTimeout.connect === true);
              reject(errTimeout);
            } else if (responseTOU.statusCode > 304) {
              console.log('prosper product details error');
              reject(responseTOU.statusCode);
            } else {
              result = bodyTOU;
              if (bodyTOU.totalRecordsFound > 0) {
                result.statusCode = responseTOU.statusCode;
                resolve(result);
              } else {
                reject(result);
              }
            }

          });

        } else {
          reject(err); // straight error
        }
      } else if (response.statusCode > 304) { // different error
        console.log('prosper product details error');

        reject(response.statusCode);
      } else if (body.totalRecordsFound > 0) {
        result = body;
        result.statusCode = response.statusCode;
        resolve(result);

      } else {
        request({
          method: method,
          uri: baseUrl + endpoint + '?' + params + '&api_key=' + config.prosperent.apiKey,
          timeout: 150000,
          json: true
        }, function (errEmp, responseEmp, bodyEmp) {
          if (errEmp) {
            console.log('prosper product details error when empty data');

            console.log(errEmp.code === 'ETIMEDOUT');
            console.log(errEmp.connect === true);
            reject(errEmp);
          } else if (responseEmp.statusCode > 304) {
            console.log('prosper product details error');

            reject(responseEmp.statusCode);
          } else {
            result = bodyEmp;
            result.statusCode = responseEmp.statusCode;
            resolve(result);//  result = response.body || {};

          }
        });
      } // result = response.body || {};

    });
  });
  // If a callback is used, resolve it and don't return the promise

}

// private functions

function requestPromise(method, endpoint, params, cb) {

  if (typeof params === 'string') { // already sent encoded
    params = parseQuery(params);
  }

  var promise = new Promise(function(resolve, reject) {

   /*  request({
      method: method,
      url: baseUrl + endpoint,
      qs: Object.assign({ api_key: config.prosperent.apiKey }, params),
      timeout: 60000,
      json: true
    }, function (err, response, body) {
      if (err) {
        return reject(new Error(err));
      }

    //  if (response.statusCode < 200 || response.statusCode > 304 || response.body.errors.length) {
      if (response.statusCode < 200 || response.statusCode > 304) {

        return reject(response.statusCode);
      }

     // var result = response.body || {};
      var result = body || {};

      result.statusCode = response.statusCode;
      resolve(result);
    }); */

    var searchquery = {},
        sortingorder;

    if (params) {
      searchquery.catalogId = params.filterCatalogId;

    }
    console.log(searchquery);
    var lquery = ProductProsperent
    .find(searchquery);

    lquery.exec(function (err, result) {   // run query to find data result
      if (err) {
        console.log(err);

        return reject(400);
      }

      result.statusCode = 200;
      resolve(result);

    });

  });

  // If a callback is used, resolve it and don't return the promise
  if (cb) {
    promise
      .then(function (result) {
        cb(null, result);
      })
      .catch(function (err) {
        cb(err);
      });

    return null;
  }

  return promise;
}

function requestPromiseMerchant(method, endpoint, params, cb) {
  if (typeof params === 'string') { // already sent encoded
    params = parseQuery(params);
  }
  var promise = new Promise(function(resolve, reject) {
    request({
      method: method,
      url: baseUrl + endpoint,
      qs: Object.assign({ api_key: config.prosperent.apiKey }, params),
      timeout: 60000,
      json: true
    }, function (err, response, body) {
      if (err) {
        return reject(new Error(err));
      }
    //  if (response.statusCode < 200 || response.statusCode > 304 || response.body.errors.length) {
      if (response.statusCode < 200 || response.statusCode > 304) {
        return reject(response.statusCode);
      }
     // var result = response.body || {};
      var result = body || {};
      result.statusCode = response.statusCode;
      resolve(result);
    });
  });
  // If a callback is used, resolve it and don't return the promise
  if (cb) {
    promise
      .then(function (result) {
        cb(null, result);
      })
      .catch(function (err) {
        cb(err);
      });

    return null;
  }

  return promise;
}

function parseQuery (qstr) {
  var query = {},
      a = qstr.substr(1).split('&');

  for (var i = 0; i < a.length; i += 1) {
    var b = a[i].split('=');

    query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
  }
  console.log(query);

  return query;
}
