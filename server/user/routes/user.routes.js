'use strict';

/**
 * Module dependencies
 */
var user = require('../controllers/user.controllers'),
    userPolicies = require('../policies/user.policies');

module.exports = function (app) {
  app.route('/customers/get')
    .all(userPolicies.isAllowed)
    .get(user.getCustomer);

  app.route('/customers/update/subscribe_all')
    .all(userPolicies.isAllowed)
    .post(user.subscribeAll);  // update signed user's cart

  app.route('/customers/update/subscribe_stores_coupon')
    .all(userPolicies.isAllowed)
    .post(user.subscribeStoresCoupon);  // update signed user's cart

  app.route('/customers/update/subscribe_stores_event')
    .all(userPolicies.isAllowed)
    .post(user.subscribeStoresEvent);  // update signed user's cart

  app.route('/customers/update/unsubscribe_all')
    .all(userPolicies.isAllowed)
    .post(user.unsubscribeAll);  // update signed user's cart

  app.route('/customers/update/unsubscribe_stores_coupon')
    .all(userPolicies.isAllowed)
    .post(user.unsubscribeStoresCoupon);  // update signed user's cart

  app.route('/customers/update/unsubscribe_stores_event')
    .all(userPolicies.isAllowed)
    .post(user.unsubscribeStoresEvent);  // update signed user's cart

  app.route('/user/profile')
    .all(userPolicies.isAllowed)
    .get(user.userProfile)
    .post(user.updateUserProfileLimited);

  app.route('/user/gprofile/:userid')
    .all(userPolicies.isAllowed)
    .get(user.genuserProfile);

  app.route('/user/profilelimited')

      .all(userPolicies.isAllowed)
      .get(user.userProfile)
      .post(user.updateUserProfileLimited);

  app.route('/user_purchase/:user_id')
    .get(user.userPurchase);

  app.route('/user_cart')
    .get(user.userCart);

  app.route('/getUserInfoAfterPurchase')
    .get(user.getUserInfoAfterPurchase);

  app.route('/customers/update/cart')
    .post(user.updateCart);  // update signed user's cart

  app.route('/customers/update/wishlist')
    .post(user.updateWishList);  // update signed user's cart

  app.route('/delete_saved_item')
    .post(user.deleteSavedItem);

  app.route('/guest/update/cart')
    .post(user.updateCartUnsignedUser);  // update signed user's cart

  app.route('/move_to_Cart')
    .post(user.movetoCart);

  app.route('/move_to_SaveList')
    .post(user.movetoSaveList);

  app.route('/unsigned_user_cart/:unsignedId')
    .all(userPolicies.isAllowed)
    .get(user.unsignedUserCart);

  app.route('/user_stores')
    .all(userPolicies.isAllowed)
    .get(user.userSavedProducts);

  app.route('/user_saved_products')
    .all(userPolicies.isAllowed)
    .get(user.userSavedProducts);

  app.route('/getsession')
    .all(userPolicies.isAllowed)
    .get(user.getsession);

  app.route('/getsessionForPurchase')
    .all(userPolicies.isAllowed)
    .get(user.getsessionForPurchase);

  app.route('/user_activity_history')
    .all(userPolicies.isAllowed)
    .post(user.userActivityHistory);

  app.route('/user_activity_details') // for getting user activity
    .all(userPolicies.isAllowed)
    .get(user.userActivityDetails);

  app.route('/twitter_profile_picX')
    .all(userPolicies.isAllowed)
    .get(user.twitterProfilePicX);

  app.route('/twitter_verify')
    .all(userPolicies.isAllowed)
    .get(user.twitterVerify);

  app.route('/twitter_profile_image')
    .all(userPolicies.isAllowed)
    .get(user.twitterProfileImage);

  app.route('/twitter_profile')
    .all(userPolicies.isAllowed)
    .get(user.twitterProfile);

  app.route('/emailUser')
    .all(userPolicies.isAllowed)
    .get(user.emailUser);

  app.route('/usermodify')
    .all(userPolicies.isAllowed)
    .get(user.usermodify);

  app.route('/cj_coupon/:storeid')
    .all(userPolicies.isAllowed)
    .get(user.cjCoupon);

  app.route('/unsignedUserInfo')
    .all(userPolicies.isAllowed)
    .post(user.unsignedUserInfo);

  app.route('/unsigned_user_delete')
    .all(userPolicies.isAllowed)
    .post(user.unsignedUserDelete);

  app.route('/update_user_products')
    .all(userPolicies.isAllowed)
    .post(user.updateUserProducts);

  app.route('/update_user_store')
    .all(userPolicies.isAllowed)
    .post(user.updateUserStore);

  app.route('/remove_user_toptenstore')
    .all(userPolicies.isAllowed)
    .post(user.removeUserToptenstore);

  app.route('/user_activity_history_update')
    .all(userPolicies.isAllowed)
    .post(user.userActivityHistoryUpdate);

  app.route('/user_activity_history_delete')
    .all(userPolicies.isAllowed)
    .post(user.userActivityHistoryDelete);

  app.route('/remove_user_order_email')
    .all(userPolicies.isAllowed)
    .post(user.removeUserOrderEmail);

  app.route('/fb_profile_pic')
    .all(userPolicies.isAllowed)
    .post(user.fbProfilePic);

  app.route('/fb_user_details')
    .all(userPolicies.isAllowed)
    .post(user.fbUserDetails);
  // // uploading social image using image url
  // app.route('/social_img_upload')
  //   .all(userPolicies.isAllowed)
  //   .post(user.socialImgUpload);

  app.route('/api/photo')
    .all(userPolicies.isAllowed)
    .post(user.photo);

  app.route('/delete_user_pic')
    .all(userPolicies.isAllowed)
    .post(user.deleteUserPic);

  app.route('/api/checkLogin/:type')
    .all(userPolicies.isAllowed)
    .get(user.checkSocialLogin);

  app.route('/getUserCoupon')
    .post(user.getUserCoupon);

  app.route('/addAvoidedCoupon')
	    .post(user.addAvoidedCoupon);

  app.route('/getSite')
    .post(user.getSite);

};
