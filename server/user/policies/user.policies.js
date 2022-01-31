'use strict';

var policy = require(process.cwd() + '/config/lib/policy');

exports.isAllowed = policy.isAllowed;

exports.initPolicies = function () {
  policy.allow([{
    /**
     * roles can be:
     * - guest -> signed out
     * - user -> signed in
     * - admin
     **/
    roles: ['user'],
    allows: [{
      resources: '/user/profile',
      permissions: ['get', 'post']
    }, {
      resources: '/user/gprofile/:userid',
      permissions: ['get', 'post']
    },	{
      resources: '/customers/get',
      permissions: 'get'
    }, {
      resources: '/customers/update/subscribe_all',
      permissions: 'post'
    }, {
      resources: '/customers/update/subscribe_stores_coupon',
      permissions: 'post'
    }, {
      resources: '/customers/update/subscribe_stores_event',
      permissions: 'post'
    }, {
      resources: '/customers/update/unsubscribe_all',
      permissions: 'post'
    }, {
      resources: '/customers/update/unsubscribe_stores_coupon',
      permissions: 'post'
    }, {
      resources: '/customers/update/unsubscribe_stores_event',
      permissions: 'post'
    }, {
      resources: '/user_purchase/:user_id',
      permissions: 'get'
    }, {
      resources: '/user_cart',
      permissions: 'get'
    }, {
      resources: '/user_stores',
      permissions: 'get'
    }, {
      resources: '/user_saved_products',
      permissions: 'get'
    }, {
      resources: '/getsession',
      permissions: 'get'
    }, {
      resources: '/getsessionForPurchase',
      permissions: 'get'
    }, {
      resources: '/user_activity_history',
      permissions: 'get'
    }, {
      resources: '/user_activity_history_update',
      permissions: 'post'
    }, {
      resources: '/user_activity_history_delete',
      permissions: 'post'
    }, {
      resources: '/user_activity_details',
      permissions: 'get'
    }, {
      resources: '/twitter_profile_picX',
      permissions: 'get'
    }, {
      resources: '/twitter_verify',
      permissions: 'get'
    }, {
      resources: '/twitter_profile_image',
      permissions: 'get'
    }, {
      resources: '/twitter_profile',
      permissions: 'get'
    }, {
      resources: '/emailUser',
      permissions: 'get'
    }, {
      resources: '/usermodify',
      permissions: 'get'
    }, {
      resources: '/cj_coupon/:storeid',
      permissions: 'get'
    }, {
      resources: '/update_user_products',
      permissions: 'post'
    }, {
      resources: '/update_user_store',
      permissions: 'post'
    }, {
      resources: '/remove_user_toptenstore',
      permissions: 'post'
    }, {
      resources: '/remove_user_order_email',
      permissions: 'post'
    }, {
      resources: '/fb_profile_pic',
      permissions: 'post'
    }, {
      resources: '/fb_user_details',
      permissions: 'post'
    }, {
      resources: '/social_img_upload',
      permissions: 'post'
    }, {
      resources: '/api/photo',
      permissions: 'post'
    }, {
      resources: '/delete_user_pic',
      permissions: 'post'
    }, {
      resources: '/api/checkLogin/:type',
      permissions: 'get'
    }, {
      resources: '/getUserCoupon',
      permissions: 'post'
    }, {
      resources: '/addAvoidedCoupon',
      permissions: 'post'
    }, {
      resources: '/getSite',
      permissions: 'post'
    }

	]
  }]);
};
