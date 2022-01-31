'use strict';

var config = require(process.cwd() + '/config'),
    request = require('request');

exports.cartEstimate = function (req, res, next) {
  var availability,
      parsedfulldata,
      realurl = req.body.realurl, // getting product ur,
      objAva = false;

  // initialize a cart first
  request({
    url: 'https://api.twotap.com/v1.0/cart?public_token=' + config.twotap.publicToken,
    json: { 'products': [realurl] },
    method: 'POST'
  }, function (err, responsea, bodya) {
    // return err if initialization not possible
    if (err) {
      console.log('error' + err);

      return next(err);
    }

    // get cart id from response
    var cId = bodya.cart_id;
    var control = 0;
    // wait till cart item has been added
    var interval = setInterval(function () {
      request({
        url: 'https://api.twotap.com/v1.0/cart/status?public_token=' + config.twotap.publicToken + '&cart_id=' + cId,
        method: 'GET'// , product_attributes_format: "flat"
      }, function (errt, reponset, bodyt) {
        if (errt) {
          console.log('error' + errt);

          return next(errt);
        }

        parsedfulldata = JSON.parse(bodyt);
        if (control === 0) {
          if (parsedfulldata.message === 'still_processing') {
            console.log('estimation ');
          } else if (parsedfulldata.message === 'done') {
            control = 1;
            clearInterval(interval);
          }
        }// control 0 end

        if (control === 1) { // control 1 means done
          control = 3;
          availability = true;

          // if key exist check key value whether null
          objAva = availability;
          console.log(parsedfulldata);

          if (req.user) {
            console.log('\n/n\n/nwhy not work');
            request({
              url: 'https://api.twotap.com/v1.0/cart/estimates?public_token=' + config.twotap.publicToken,
              json: {
                'cart_id': cId,
                'fields_input': {
                  siteskey: {
                    'noauthCheckout': {
                      'shipping_zip': req.user.zip,
                      'shipping_city': req.user.city,
                      'shipping_state': req.user.state
                    },
                    'shipping_option': 'cheapest'
                  }
                }

              },
              method: 'POST'
            }, function (errt, reponset, estPriceData) {
              if (errt) { return next(errt); }

              estPriceData.availability = objAva;
              estPriceData.productCartDetails = parsedfulldata;

              console.log('cart_estimate using address information');
              console.log(estPriceData);
              res.send(estPriceData);
            });
          } else {
            request({
              url: 'https://api.twotap.com/v1.0/cart/estimates?public_token=' + config.twotap.publicToken,
              json: {
                'cart_id': cId
              },
              method: 'POST'
            }, function (errt, reponset, apiData) {
              if (errt) { return next(errt); }

              apiData.availability = objAva;
              apiData.productCartDetails = parsedfulldata; // passing full data
              console.log(apiData);

              res.send(apiData);
            });
          }
        }
      }); // function end which print current request message.
    }, 1000, 'wait');
  });
};

// API RELATED PART >> b. TWO TAP >> Make cart

exports.twotapCart = function (req, res) {
  var availability = false,
      parsedfulldata,
      control = 0,
      obj,
      realurl = req.body.product_urls;

  request({
    url: 'https://api.twotap.com/v1.0/cart?public_token=' + config.twotap.publicToken,
    json: {
      products: realurl
    },
    test_mode: 'fake_confirm',
    method: 'POST',
    cache_time: 10000
  }, function (erra, responsea, bodyx) {
    if (!erra && (responsea.statusCode === 304 || (responsea.statusCode >= 200 && responsea.statusCode <= 299))) {
      var cartId = bodyx.cart_id,
          exitTimer = 0;

      control = 0;

      var interval = setInterval(function () {
        if (exitTimer > 180000) {
          control = 1;
          clearInterval(interval);
          obj = { 'availability': availability, 'message': 'taking too much time' };
          console.log('taking too much time');
          res.send(obj);

          return;
        }
        request({
          url: 'https://api.twotap.com/v1.0/cart/status?public_token=' + config.twotap.publicToken + '&cart_id=' + cartId + '&test_mode=fake_confirm',
          method: 'GET'
        }, function (errt, reponset, bodyt) {
          if (errt) {
            console.log('cart status error' + errt);
            obj = { 'availability': availability, 'message': errt };
            console.log('error');

            return;
          }

          if (control === 0) {
            // fulldata=bodyt;
            // storing data for render purpose

            parsedfulldata = JSON.parse(bodyt);

            if (parsedfulldata.message === 'still_processing') {
              console.log(parsedfulldata.message);
            } else if (parsedfulldata.message === 'done' && control !== 1) { // availability false means fres
              availability = true;
              clearInterval(interval);
              control = 1; // exit from current loop
              obj = {
                'productCartDetails': parsedfulldata,
                'availability': availability,
                'message': parsedfulldata.message,
                'cart_id': cartId
              };
              console.log(parsedfulldata);
              res.send(obj);
            } else if (parsedfulldata.message === 'has_failures' && control !== 1) {  // has_error
              control = 1;
              clearInterval(interval);
              console.log('has failure');
              availability = false;
              obj = {
                'productCartDetails': parsedfulldata,
                'availability': availability,
                'message': parsedfulldata.message,
                'cart_id': cartId
              };
              res.send(obj);
              // when creating problem may be we need to use another algorithom
            }
          } // end of control === 1
        }); // function end which print current request message.
        exitTimer += 3000;
      }, 3000, 'wait');
    } else {
      console.log('cart adding failure');
      console.log(bodyx);

      obj = { 'availability': availability, 'message': erra };

      return res.send(obj);
    }
  }); // third request
};

// CART FOR SINGLE PRODUCT
exports.twotapCartSingleProduct = function (req, res) {

  var availability = false,
      parsedfulldata,
      realurl = req.body.product_urls;

  request({
    url: 'https://api.twotap.com/v1.0/cart?public_token=' + config.twotap.publicToken,
    json: {
      'products': realurl
    },
    test_mode: 'fake_confirm',
    method: 'POST',
    cache_time: 300

  }, function (erra, responsea, bodyx) {
    var obj;

    if (!erra && (responsea.statusCode === 304 || responsea.statusCode === 200)) {
      var cartId = bodyx.cart_id,
          control = 0,
          exitTimer = 0;

      var interval = setInterval(function () {
        if (exitTimer > 180000) { // 5 minutes try to retrieve
          control = 1;
          clearInterval(interval);
          obj = {
            'availability': availability,
            'message': 'taking too much time'
          };
          console.log(availability);

          console.log('taking too much time');
          res.send(obj);

          return;
        }
        // &product_attributes_format=flat
        request({
          url: 'https://api.twotap.com/v1.0/cart/status?public_token=' + config.twotap.publicToken + '&cart_id=' + cartId + '&test_mode=fake_confirm',
          method: 'GET'
        }, function (errt, reponset, bodyt) {
          if (errt) {
            console.log('cart status error');
            console.log(errt);
            obj = { 'availability': availability, 'message': errt };
            clearInterval(interval);
            res.send(obj);
            console.log(availability);

            return;
          }

          if (control === 0) {

            parsedfulldata = JSON.parse(bodyt);

            if (parsedfulldata.message === 'still_processing' && control !== 1) {
              console.log(parsedfulldata.message);
              console.log('Still processing');
            } else if (parsedfulldata.message === 'done' && control !== 1) { // availability false means fres

              availability = true;
              control = 1; // exit from current loop
              console.log(availability);

              obj = {
                'productCartDetails': parsedfulldata,
                'availability': availability,
                'message': parsedfulldata.message,
                'cart_id': cartId
              };

              // now try to get estimated price
              var siteskey,
                  siteIdArr = [],
                  userCart = parsedfulldata,
                  count,
                  soption,
                  cartBySite;

              Object.keys(userCart.sites).forEach(function(skey) {
                siteIdArr.push(skey);              // insert all sites inside an array
                siteskey = skey;

              });
              var paraJson = {
                'cart_id': cartId,
                'fields_input': {}

              };

              var setupinputfield = function(productKeyMd5) {
                paraJson.fields_input[siteskey].addToCart[productKeyMd5] = {};

                if ('quantity' in cartBySite[productKeyMd5]) {
                  paraJson.fields_input[siteskey].addToCart[productKeyMd5].quantity = userCart.sites[siteskey].add_to_cart[productKeyMd5].quantity;

                }
                if ('size' in cartBySite[productKeyMd5]) {
                  paraJson.fields_input[siteskey].addToCart[productKeyMd5].size = cartBySite[productKeyMd5].size;

                }
                if ('color' in cartBySite[productKeyMd5]) {
                  paraJson.fields_input[siteskey].addToCart[productKeyMd5].color = userCart.sites[siteskey].add_to_cart[productKeyMd5].color;
                }
                if ('option' in cartBySite[productKeyMd5]) {
                  paraJson.fields_input[siteskey].addToCart[productKeyMd5].option = userCart.sites[siteskey].add_to_cart[productKeyMd5].option;
                }
              };

              for (count = 0; count < siteIdArr.length; count += 1) {
                soption = 'cheapest';

                if (req.user) {

                  paraJson.fields_input[siteskey] = {
                    'noauthCheckout': {
                      'shipping_address': req.user.address,
                      'shipping_zip': req.user.zip,
                      'shipping_city': req.user.city,
                      'shipping_state': req.user.state,
                      'shipping_country': req.user.country
                    },
                    'addToCart': {
                        // product_md5 will be dynamic
                    },
                    'shipping_option': soption

                  };

                } else {
                  paraJson.fields_input[siteskey] = {
                    'noauthCheckout': {},
                    'addToCart': {
                      // product_md5 will be dynamic
                    },
                    'shipping_option': soption

                  };
                }
                cartBySite = userCart.sites[siteskey].add_to_cart;
                Object.keys(cartBySite).forEach(setupinputfield);

              }

              var objex;
              objex = {
                'productCartDetails': parsedfulldata,
                'availability': availability,
                'message': parsedfulldata.message,
                'cart_id': cartId
              };
              clearInterval(interval);
              res.send(objex);

              /*
              request({
                url: 'https://api.twotap.com/v1.0/cart/estimates?public_token=' + config.twotap.publicToken,
                json: paraJson,
                method: 'POST'
              }, function (errest, reponset, data) {
                objex = {
                  'productCartDetails': parsedfulldata,
                  'availability': availability,
                  'message': parsedfulldata.message,
                  'cart_id': cartId
                };

                if (errest) {
                  clearInterval(interval);
                  res.send(objex);
                } else {
                  clearInterval(interval);
                  objex.estimation = data;
                  res.send(objex);
                }

              }); */

            } else if (parsedfulldata.message === 'has_failures') {  // has_error
              control = 1;
              clearInterval(interval);
              console.log('cart add has failed');
              availability = false;

              console.log(availability);

              obj = {
                'productCartDetails': parsedfulldata,
                'availability': availability,
                'message': parsedfulldata.message,
                'cart_id': cartId
              };

              console.log('FAILED');
              res.send(obj);
              // when creating problem may be we need to use another algorithom
            } else {  // has_error
              control = 1;

              clearInterval(interval);
              console.log(parsedfulldata.message);
              availability = false;
              console.log(availability);
              obj = {
                'productCartDetails': parsedfulldata,
                'availability': availability,
                'message': parsedfulldata.message,
                'cart_id': cartId
              };

              res.send(obj);
            }

          } else {   // control 0 end
            control = 1;
            clearInterval(interval);

          }
        }); // function end which print current cart status.

        exitTimer += 2000;
      }, 2000, 'wait');

    } else {
      console.log('cart adding failure');
      var ava = false;
      var eobj = { 'availability': ava, 'message': 'cart adding failure' };
      console.log(ava);
      res.send(eobj);
    }

  });// third request
};

exports.productAvailability = function (req, res, next) {
  var myObj,
      realurl = req.body.realurl;

  request({
    url: 'https://api.twotap.com/v1.0/cart?public_token=' + config.twotap.publicToken,
    json: { products: [realurl] },
    method: 'POST'
  }, function (erra, responsea, bodya) {
    if (erra) { return next(erra); }

    var cartId = bodya.cart_id;
    var control = 0;
    var interval = setInterval(function () {
      request({
        url: 'https://api.twotap.com/v1.0/cart/status?public_token=' + config.twotap.publicToken + '&cart_id=' + cartId,
        method: 'GET'// , product_attributes_format: "flat"
      }, function (errt, reponset, bodyt) {
        if (errt) { return next(errt); }

        var parsedfulldata = JSON.parse(bodyt);

        if (!control) {
          if (parsedfulldata.message === 'done' && parsedfulldata.message !== 'still_processing') {
            control = 1;
            clearInterval(interval);
          } else {
            control = 1;
            clearInterval(interval);
          }
        }

        if (control === 1) { // control 1 means done
          var siteskey,
              unknownUrls = parsedfulldata.unknown_urls;  // check whether it is form supported store

          // when unknown url length greater than 0 store /product is not supported

           // for not supported stores

          if (!unknownUrls.length) {
            parsedfulldata.sites.forEach(function (value, skey) {
              siteskey = skey;
            });

            myObj = parsedfulldata.sites[siteskey];
          }

          res.send(myObj);
          control = 2;
        }

      }); // function end which print current request message.

      request({
        url: 'https://api.twotap.com/v1.0/cart/estimates?public_token=' + config.twotap.publicToken,
        json: {
          cart_id: cartId
        },
        method: 'POST'
      }, function (errt) {
        if (errt) { return next(errt); }

      });
    }, 1000, 'wait');
  });// third request
};
