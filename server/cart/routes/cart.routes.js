'use strict';

/**
 * Module dependencies
 */
var cart = require('../controllers/cart.controllers');

module.exports = function (app) {
  app.route('/cart_estimate')
    .post(cart.cartEstimate);
  /*
  app.route('/customers/update/cart')
    .post(cart.updateCart);  // update signed user's cart

  app.route('/customers/update/wishlist')
    .post(cart.updateWishList);  // update signed user's cart

  app.route('/delete_saved_item')
    .post(cart.deleteSavedItem);

  app.route('/guest/update/cart')
    .post(cart.updateCartUnsignedUser);  // update signed user's cart

  app.route('/move_to_Cart')
    .post(cart.movetoCart);
  app.route('/move_to_SaveList')
    .post(cart.movetoSaveList);
*/
  app.route('/productavailability')
    .post(cart.productAvailability);

  app.route('/twotap_cart')
    .post(cart.twotapCart);

  app.route('/twotap_cart_single_product')
    .post(cart.twotapCartSingleProduct);

};
