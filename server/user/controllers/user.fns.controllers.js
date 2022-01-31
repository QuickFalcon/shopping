'use strict';

var config = require(process.cwd() + '/config'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    UserActivity = mongoose.model('UserActivity'),
    UnsignedUser = mongoose.model('UnsignedUser'),
    Coupon = mongoose.model('Coupon'),
    CouponAvoidByUser = mongoose.model('CouponAvoidByUser'),
    request = require('request'),
    ObjId = require('mongoose').Types.ObjectId,
    async = require('async'),
    _ = require('lodash'),
    qs = require('querystring'),
    sendgrid = require(process.cwd() + '/lib/sendgrid'),
    mime = require('mime'),
    fs = require('fs'),
    Twotapsite = mongoose.model('Twotapsite'),
    auth_data; // File System

// making a row of unsigned user
exports.unsignedUserInfo = function (req, res, next) {
  // create a todo, information comes from AJAX request from Angular

  console.log(req.body.updatedCart);

  UnsignedUser.create({
    cart: req.body.updatedCart
  }, function (err, data) {
    if (err) { return next(err); }

    console.log(data);
    res.json(data);
  });
};

// GET USER COMPLETE PROFILE
exports.userProfile = function (req, res, next) {
  var sesid;

  if (req.user) {  // check session is set

    sesid = new ObjId(req.user._id);

    User.findOne({ _id: sesid }, function (err, profiledata) {  // find data exist
      if (err) { return next(err); }

      if (!profiledata) {
        return res.redirect('/'); // should be login check part( not logged in redirect )
      }

      res.send(profiledata);
    });
  } else {
    res.redirect('/');
    console.log('login to see');
  }
};

exports.genuserProfile = function (req, res, next) {
  var sesid;

  if (req.user) {  // check session is set

    sesid = new ObjId(req.params.userid);

    User.findOne({ _id: sesid }, function (err, profiledata) {  // find data exist
      if (err) {

        res.end();

        return next(err); }

      if (!profiledata) {
        res.end();

        return;
      }

      res.send(profiledata);
    });
  } else {
    res.end();
    console.log('login to see');
  }
};

// PROBLEM: this returns the whole profile
exports.userPurchase = function (req, res, next) {
  var user_id = req.params.user_id;
  var uid = new ObjId(user_id);  // making cookies id to object id

  User.find({ _id: uid })
   .select({
     orderObj: 1,
     purchaseObj: 1
   })
    .exec(function (err, results) {
      if (err) {
        res.json(404, { msg: 'Failed to update Cart.' });

      } else {
        console.log(results);

        res.send(results[0]);

      }
    });

};

// /////////////// GET CART DATA ////////////////////////////

exports.userCart = function (req, res, next) {

  var sesid;

  if (req.user) {   // check session is set
    sesid = req.user._id;
    sesid = new ObjId(req.user._id);

    // var id = mongoose.Types.ObjectId(sesid);

    User.find({ _id: sesid }, function (err, profiledata) {  // find data exist
      if (err) { return next(err); }

      res.send(profiledata[0].cart);
    });
  }
};

// get unsigned user cart
exports.unsignedUserCart = function (req, res, next) {
  var unsignedId = req.params.unsignedId;

  if (unsignedId) {   // check session is set
    var unsignedUserId = new ObjId(unsignedId);
    // var id = mongoose.Types.ObjectId(sesid);

    UnsignedUser.find({ _id: unsignedUserId }, function (err, profiledata) {  // find data exist
      if (err) { return next(err); }

      if (profiledata) {
        if (profiledata.length > 0) {
          res.send(profiledata[0]);
        }
      } else {
        res.end();
      }
    });
  }
};

exports.unsignedUserDelete = function (req, res, next) {
  var delid = new ObjId(req.body.unsignedId);

  UnsignedUser.remove({
    _id: delid
  }, function (err) {
    if (err) { return next(err); }

    res.send('delete successful');
  });
};

// /////////////// U S E R  >>  a.PROFILE >> UPDATE ////////////////////////////
exports.updateUserProfile = function (req, res, next) {
  var addrt = '';
  if (req.body.address1 && req.body.address1 !== '') {

    addrt = req.body.address1;
  }
  if (req.body.address2 && req.body.address2 !== '') {

    addrt = addrt + req.body.address2;
  }
  var full_address = addrt;

  var nDate = new Date(req.body.birthDay);
  var sesid;

  if (!req.user) {   // check session is set
    return next('no session');
  }

  sesid = new ObjId(req.user._id);

  var changedValues = _.pick(req.body, ['email', 'password', 'username', 'firstname', 'middlename', 'lastname', 'address1', 'address2', 'zip', 'city', 'country', 'state', 'phone', 'currency', 'gender', 'ss_subscribe', 'blog_subscribe']);

  if (!isNaN(nDate.getTime())) {
    changedValues.birthDay = nDate;
  }
  changedValues.address = full_address;

  User.update(
    { _id: sesid },
    { $set: changedValues },
    { new: true })
    .exec(function (err, results) {
      if (err || results < 1) {
        res.end();
        console.log('user update err' + err + ' ' + results);
      } else {
        res.send(results);
      }
    });
};

exports.updateUserProfileLimited = function (req, res, next) {
    console.log('exports.updateUserProfileLimited');
  if (!req.user) {   // check session is set
    return next('no session');
  }
  var addrt = '';

  var userfields = req.body.userfields;

  if (userfields.address1 && userfields.address1 !== '') {

    addrt = userfields.address1;
  }
  if (userfields.address2 && userfields.address2 !== '') {

    addrt = addrt + userfields.address2;
  }
  var full_address = addrt;

  var nDate = new Date(req.body.birthDay);
  var sesid = new ObjId(req.user._id);

  var changedValues = _.pick(req.body, ['email', 'password', 'username', 'firstname', 'middlename', 'lastname', 'address1', 'address2', 'zip', 'city', 'country', 'state', 'phone', 'currency', 'gender', 'ss_subscribe', 'blog_subscribe']);

  if (!isNaN(nDate.getTime())) {
    changedValues.birthDay = nDate;
    userfields.birthDay = nDate;
  }
  changedValues.address = full_address;
  userfields.address = full_address;

    /*
    User.update(
        { _id: sesid },
        { $set: req.body },
        { new: true })
        .exec(function (err, results) {
            if (err || results < 1) {
                res.end();
                console.log('user update err' + err + ' ' + results);
            } else {
                res.send(results);
            }
        }); */
  // console.log(userfields);
  // if (userfields.username) {
      // console.log('username is ' + userfields.username);
  // }
  User.find({ username: userfields.username }).exec(function (err, docs) {
      // console.log(err, docs);
      console.log(docs.length, docs.length && docs[0].email, req.user.email);
      // first condition is really more of a safety net
      if (err) {
          res.json({ error: 'An error occured when updating the username <' + err + '>' });
          return;
      }
      if (docs instanceof Array) {
          if (docs.length > 1 || (docs.length === 1 && docs[0].email !== req.user.email)) {
              // res.end();
              res.json({ error: 'User with a given username already exists!' });
              console.log('product update err: ' + err);
              return;
          }
      } else {
          // MONGODB WEIRDNESS -> notice the length property
          if (docs.length() > 1 || (docs.length() === 1 && docs[0].email !== req.user.email)) {
              // res.end();
              res.json({ error: 'User with a given username already exists!' });
              console.log('product update err: ' + err);
              return;
          }
      }
      User.update(
        { _id: sesid },
        { $set: userfields },
        { new: true }
      ).exec(function (err, results) {
          if (err || results < 1) {
            res.end();
            console.log('product update err' + err + ' ' + results);
          } else {
            console.log('User "' + req.user.email + '" info updated!');
            res.send(results);
          }
        });
  });
};

exports.getCustomer = function (req, res) {
  var sesid = new ObjId(req.user_id);

  User
    .find({ _id: sesid })
    .exec(function (err, customer) {
      if (!customer) {
        res.json(404, { msg: 'Customer Not Found.' });
      } else {
        res.json(customer);
      }
    });
};

exports.subscribeAll = function (req, res, next) {
  var sesid = new ObjId(req.user._id);
  var storename = req.body.storename;
 /*
  User.findOneAndUpdate(
    { _id: sesid }, // query
    { $addToSet: { 'subscribe_stores_coupon': storename, 'subscribe_stores_event': storename } },
    function (err, data) {                     // call back
      if (err) { return next(err); }

      res.send({
        'message': 'success',
        'subscribe_stores_coupon': data.subscribe_stores_coupon,
        'subscribe_stores_event': data.subscribe_stores_event
      });

    }); */

  User.findAndModify(          // please don t touch this code with out my consent
        { _id: sesid }, // query
        [],    // sort
        { $addToSet: { 'subscribe_stores_coupon': storename, 'subscribe_stores_event': storename } },
        { new: true },          // updated result returned
        function (err, data) { // call back
          if (err) { return next(err); }

          res.send({
            'message': 'success',
            'subscribe_stores_coupon': data.value.subscribe_stores_coupon,
            'subscribe_stores_event': data.value.subscribe_stores_event
          });

          // res.send(data.value);
        }
      );

};

exports.subscribeStoresCoupon = function (req, res, next) {
  var sesid = new ObjId(req.user._id);
  var storename = req.body.storename;

  User.findAndModify(
    { _id: sesid }, // query
     [],
    { $addToSet: { 'subscribe_stores_coupon': storename } },
     { new: true },
    function (err, data) { // call back
      if (err) { return next(err); }

      res.send({
        'message': 'success',
        'subscribe_stores_coupon': data.value.subscribe_stores_coupon,
        'subscribe_stores_event': data.value.subscribe_stores_event
      });

      console.log(data.value.subscribe_stores_coupon);
      console.log(data.value.subscribe_stores_event);
    });
};

exports.getUserCoupon = function (req, res, next) {
  var sesid = new ObjId(req.user._id);

  CouponAvoidByUser.find({ user: sesid })
      .exec(function (err, usercouponlist) {
        if (!usercouponlist) {
          Coupon.find({ site_id: { $in: req.body.subscribesiteid } })
			.exec(function (err, couponlist) {
  if (!couponlist) {
    res.json(404, { msg: 'couponlist Not Found.' });
  } else {
    res.send(couponlist);
  }
});
        }
        else {

          var arr = [];
          console.log(usercouponlist);
          var tempsite; var tempcoupon;
          Coupon.find({ site_id: { $in: req.body.subscribesiteid } })
			.exec(function (err, couponlist) {
  if (!couponlist) {
    res.json(404, { msg: 'couponlist Not Found.' });
  } else {

    if (usercouponlist.length > 0) {
      for (var j = 0; j < usercouponlist.length; j++) {
        tempsite = usercouponlist[j].site_id;
        tempcoupon = usercouponlist[j].code;

        for (var k = 0; k < couponlist.length; k++) {

          if (tempcoupon == couponlist[k].code && tempsite == couponlist[k].site_id) {

            couponlist.splice(k, 1);
          }

        }

        if (j + 1 == usercouponlist.length) {

          res.send(couponlist);

        }
      }

    } else {

      res.send(couponlist);
    }

  }
});

				 /* arr.push(usercouponlist[j].coupon);
			      if(j+1==usercouponlist.length) {

					  for(var timepass=0;timepass<100000; timepass++ ){

						  if(timepass==99999 ){

							        console.log(req.body.subscribesiteid);
							 		Coupon.find({site_id : { $in: req.body.subscribesiteid }, $and:[ {code:{$nin:arr}} ] })
									.exec(function (err, couponlist) {
									  if (!couponlist) {
										res.json(404, { msg: 'couponlist Not Found.' });
									  } else {
										res.send(couponlist);
									  }
									});

						  }
					  }

				 } */

        }
      });

};

exports.addAvoidedCoupon = function (req, res, next) {

// CouponAvoidByUser
  if (!req.user)
    return;
  var CouponAvoidByUserData = new CouponAvoidByUser({
    user: req.user._id,
    site_id: req.body.site_id,
    code: req.body.code

  });

  CouponAvoidByUserData.save(function (err) {
    if (err) {
      console.log('data save not possible');
      res.end();

      return next(err);
    }

    res.send('success');

  });
};

exports.subscribeStoresEvent = function (req, res, next) {

  var sesid = new ObjId(req.user._id);
  var storename = req.body.storename;

  User.findAndModify(
    { _id: sesid }, // query
    [],
    { $addToSet: { 'subscribe_stores_event': storename } },
     { new: true },
    function (err, data) {
      if (err) { return next(err); }

      res.send({
        'message': 'success',
        'subscribe_stores_coupon': data.subscribe_stores_coupon,
        'subscribe_stores_event': data.subscribe_stores_event
      });

      console.log(data);
    });
};

exports.unsubscribeAll = function (req, res, next) {

  var sesid = new ObjId(req.user._id);
  var storename = req.body.storename;

  User.findAndModify(
    { _id: sesid }, // query
     [],
    { $pull: { 'subscribe_stores_coupon': storename, 'subscribe_stores_event': storename } },
     { new: true },
    function (err, data) { // call back
      if (err) { return next(err); }

      res.send({
        'message': 'success',
        'subscribe_stores_coupon': data.value.subscribe_stores_coupon,
        'subscribe_stores_event': data.value.subscribe_stores_event
      });

      console.log(data.value.subscribe_stores_coupon);
      console.log(data.value.subscribe_stores_event);
    });

};

exports.unsubscribeStoresCoupon = function (req, res, next) {

  var sesid = new ObjId(req.user._id);
  var storename = req.body.storename;

  User.findAndModify(
    { _id: sesid }, // query
    [],
    { $pull: { 'subscribe_stores_coupon': storename } },
    { new: true },

    function (err, data) { // call back
      if (err) { return next(err); }

      res.send({
        'message': 'success',
        'subscribe_stores_coupon': data.value.subscribe_stores_coupon,
        'subscribe_stores_event': data.value.subscribe_stores_event
      });

      console.log(data.value.subscribe_stores_coupon);
      console.log(data.value.subscribe_stores_event);
    });
};

exports.unsubscribeStoresEvent = function (req, res, next) {

  var sesid = new ObjId(req.user._id);
  var storename = req.body.storename;

  User.findAndModify(
    { _id: sesid }, // query
    [],
    { $pull: { 'subscribe_stores_event': storename } },
    { new: true },
    function (err, data) { // call back
      if (err) { return next(err); }

      res.send({
        'message': 'success',
        'subscribe_stores_coupon': data.value.subscribe_stores_coupon,
        'subscribe_stores_event': data.value.subscribe_stores_event
      });

      console.log(data.value.subscribe_stores_coupon);
      console.log(data.value.subscribe_stores_event);
    });
};

exports.userStores = function (req, res, next) {

  if (req.user) {  // check session is set
    var sesid = new ObjId(req.user._id);

    User.find({ _id: sesid }, function (err, profiledata) {  // find data exist
      if (err) { return next(err); }

      // console.log(profiledata.users_stores);
      res.json(profiledata);
    });
  }
};

// user saved product for future buy
exports.userSavedProducts = function (req, res, next) {

  if (req.user) {  // check session is set
    var sesid = new ObjId(req.user._id);

    User.find({ _id: sesid }, function (err, profiledata) {  // find data exist
      if (err) { return next(err); }

      // console.log(profiledata.users_stores);
      res.json(profiledata.saved_item_id);
    });
  }
};

exports.updateUserProducts = function (req, res, next) {
  if (req.user) {   // check session is set
    var sesid = new ObjId(req.user._id);
    var catalogId = req.body.catalogId;

    User.findOneAndUpdate(
      { _id: sesid }, // query
      // { $addToSet: {"saved_item" : s_product_id}}, // saving string id
      { $addToSet: { 'saved_catalogId': catalogId } }, // saving object id
      function (err, data) { // call back
        if (err) { return next(err); }

        res.send(data.value.saved_catalogId); // send  updated id's
        console.log(data.value.saved_catalogId);
      }
    );
  }
};

// /////////////// U S E R  >>  b.STORE >> UPDATE ////////////////////////////
exports.updateUserStore = function (req, res, next) {

  if (req.user) {   // check session is set
    var sesid = new ObjId(req.user._id);
    var str = req.body.store_name;
    var menuitem = req.body.menuitem;
    if (menuitem === 'dashboard') {

      User.findAndModify(          // please don t touch this code with out my consent
        { _id: sesid }, // query
        [],    // sort
        { $addToSet: { 'userDashboardMerchant': str } },
        { new: true },          // updated result returned
        function (err, data) { // call back
          if (err) { return next(err); }

          console.log(data.value);
          res.send(data.value);
        }
      );

    } else if (menuitem === 'women') {
      User.findAndModify(
        { _id: sesid }, // query
        [],    // sort
        { $addToSet: { 'userWomenMerchant': str } }, // doc
         { new: true },
         function (err, data) { // call back
           if (err) { return next(err); }

           res.send(data.value);
           console.log(data.value);
         }
      );
    } else if (menuitem === 'men') {

      User.findAndModify(
        { _id: sesid },
        [],    // sort
        { $addToSet: { 'usermenMerchant': str } },
        { new: true },
        function (err, data) {
          if (err) { return next(err); }

          res.send(data.value);
          console.log(data.value);
          // res.send(model.usermenMerchant)
        }
      );
    } else if (menuitem === 'shoes') {
      User.findAndModify(
        { _id: sesid },
        [],    // sort
        { $addToSet: { 'userShoesMerchant': str } },
        { new: true },
        function (err, data) {
          if (err) { return next(err); }

          res.send(data.value);
          console.log(data.value);
        }
      );

    } else if (menuitem === 'accessories') {
      User.findAndModify(
        { _id: sesid },
        [],    // sort
        { $addToSet: { 'userAccessoriesMerchant': str } },
        { new: true },
        function (err, data) {
          if (err) { return next(err); }

          res.send(data.value);
          console.log('/update_user_store' + data.value);
        }
      );

    } else if (menuitem === 'beauty') {
      User.findAndModify(
        { _id: sesid },
        [],    // sort
        { $addToSet: { 'userBeautyMerchant': str } },
        { new: true },
        function (err, data) {
          if (err) { return next(err); }

          res.send(data.value);
          console.log('/update_user_store' + data.value);
        }
      );

    } else if (menuitem === 'kids') {
      User.findAndModify(
        { _id: sesid },
        [],    // sort
        { $addToSet: { 'userKidsMerchant': str } },
        { new: true },
        function (err, data) {
          if (err) { return next(err); }

          res.send(data.value);
          console.log(data.value);
        }
      );

    } else if (menuitem === 'home') {
      User.findAndModify(
        { _id: sesid },
        [],    // sort
        { $addToSet: { 'userHomeMerchant': str } },
        { new: true },
        function (err, data) {
          if (err) { return next(err); }

          res.send(data.value);
          console.log(data.value);
        }
      );

    } else if (menuitem === 'gift') {
      User.findAndModify(
        { _id: sesid },
        [],    // sort
        { $addToSet: { 'userGiftsMerchant': str } },
        { new: true },
        function (err, data) {
          if (err) { return next(err); }
          res.send(data.value);
          console.log(data.value);
        }
      );

    } else if (menuitem === 'others') {
      User.findAndModify(
        { _id: sesid },
        [],    // sort
        { $addToSet: { 'userLocalMerchant': str } },
        { new: true },
        function (err, data) {
          if (err) { return next(err); }

          res.send(data.value);
          console.log(data.value);
        }
      );
    }
  }// session end
};
exports.removeUserToptenstore = function (req, res, next) {

  if (req.user) {  // check session is set
    var sesid = new ObjId(req.user._id);
    var menuitem = req.body.menuitem;
    var menuMerchant;

    if (menuitem === 'dashboard') {
      menuMerchant = { 'userDashboardMerchant': req.body.storelist };
    } else if (menuitem === 'women') {
      menuMerchant = { userWomenMerchant: req.body.storelist };
    } else if (menuitem === 'men') {
      menuMerchant = { usermenMerchant: req.body.storelist };
    } else if (menuitem === 'shoes') {
      menuMerchant = { userShoesMerchant: req.body.storelist };
    } else if (menuitem === 'accessories') {
      menuMerchant = { userAccessoriesMerchant: req.body.storelist };
    } else if (menuitem === 'beauty') {
      menuMerchant = { userBeautyMerchant: req.body.storelist };
    } else if (menuitem === 'kids') {
      menuMerchant = { userKidsMerchant: req.body.storelist };
    } else if (menuitem === 'home') {
      menuMerchant = { userHomeMerchant: req.body.storelist };
    } else if (menuitem === 'gift') {
      menuMerchant = { userGiftsMerchant: req.body.storelist };
    } else if (menuitem === 'others') {
      menuMerchant = { userLocalMerchant: req.body.storelist };
    }

    User.findAndModify(
      { _id: sesid },
      [],
      { $set: menuMerchant },
      { new: true }, // updated result returned
         function (err, data) { // call back
           if (err) { return next(err); }

           console.log(data.value);
           res.send(data.value);
         });

  }
};

exports.removeUserOrderEmail = function (req, res, next) {
  if (req.user) {   // check session is set

	//  var mkey = req.body.mkey;
    var sesid = new ObjId(req.user._id);
    User.update(
		  { _id: sesid },
		  { $set: { mailbox: req.body.mailObj } }, function(err, data) {
    if (err)
      console.log(err);
    res.send('success');
  });
  } else {
    res.end();
  }
};

exports.getsession = function (req, res) {

  // res.json(req.user);
  if (req.user) {
    res.json(req.user);
  } else {
    res.end();
  }
};

exports.getsessionForPurchase = function (req, res) {
  if (req.user) {
    res.send({ 'd': req.user, 'd1': req.user });
  }
};

exports.userActivityHistoryUpdate = function (req, res, next) {
  var activityuid = new ObjId(req.user._id);
  var sharetypes = req.body.sharetypes;
  console.log(sharetypes);
  var uactivity = {
    userid: activityuid,
    catalogId: req.body.catalogId
     //   uaction: req.body.uaction
  };

  var update_fields = {};
  if (sharetypes.collective)
    update_fields.collective = true;
  else
	   update_fields.collective = false;

  if (sharetypes.mail)
    update_fields.mail = true;

  if (sharetypes.like)
    update_fields.like = true;
  else
		update_fields.like = false;

  UserActivity.update(uactivity,
  { $set: update_fields },
  { upsert: true, new: true })
    .exec(function (err, results) {
      if (err || results.length < 1) {
        res.end();
        console.log('activity update err' + err + ' ' + results);
      } else {
        res.send('success');
      }
    });

  // uactivity.save(function (err, data) {
    // if (err) { return next(err); }

    // res.send(data);
  // });

};
exports.userActivityHistoryDelete = function (req, res, next) {
  console.log('I am here to remove');
  var activityuid = new ObjId(req.user._id);

  var uactivity = { userid: activityuid,
    catalogId: req.body.catalogId
     //   uaction: req.body.uaction
  };

  UserActivity.find(uactivity).remove()
   .exec(function (err, result) {
     if (err) {
       res.send(err);
     }
     else {
       console.log(err);
       res.send('result');
     }

   });

};
exports.userActivityHistory = function (req, res) {
  var sesid = new ObjId(req.user._id);
/*
  UserActivity.find({ userid: sesid })
    .populate({ path: 'catalogId' })
    .exec(function (err, prodetails) {

	  res.send(prodetails);
    });
	*/
  UserActivity.find({ userid: sesid })
      .exec(function (err, prodetails) {

        if (err)
          console.log(err);
        console.log(prodetails);
        res.send(prodetails);
      });

};

exports.userActivityDetails = function (req, res) {
  var uid = new ObjId(req.user._id);

  UserActivity.find({ userid: uid }, function (err, activityHistory) {
    if (err)
      console.log(err);

    res.send(activityHistory);
  });
};

// call facebook api to show user image
// return facebook profile image if user is logged in
exports.fbProfilePic = function (req, res, next) {
  var id = req.body.id;
  var fbToken = req.body.token;

  request({
    url: 'https://graph.facebook.com/v2.5/' + id + '/picture?type=large&access_token=' + fbToken + '&redirect=0',
    // GET /v2.5/{user-id}/picture HTTP/1.1
    // Host: graph.facebook.com
    method: 'GET'
  }, function (err, response, imgData) {
    if (err) { return next(err); }

    res.json(JSON.parse(imgData).data);
  });
};

// call facebook api to show user details

exports.fbUserDetails = function (req, res, next) {
  var id2 = req.body.id;
  var fbToken2 = req.body.token;

  request({
    url: 'https://graph.facebook.com/v2.2/' + id2 + '&access_token=' + fbToken2,
    method: 'GET'
  }, function (err, response, userData) {

    if (err) { return next(err); }

    var parsedUserData = JSON.parse(userData);

    res.json(parsedUserData);
  });
};

// exports.socialImgUpload = function (req, res, next) {
//
//   if (!req.user) {
//     return next('login to upload');
//   }
//
//   var useremail = req.user.email;
//   var prev_image = req.body.prev_img;
//   var final_url = req.body.img_url;
//   var img_name = hat();
//
//   var ext = 'png';
//   var newPath2 = process.cwd() + '/public/images_upload/user/' + img_name + '.' + ext;
//   var wstream = fs.createWriteStream(newPath2);
//
//   request(final_url).pipe(wstream);
//   wstream.on('finish', function () {
//     console.log('file has been written');
//     User.findOneAndUpdate(
//       { email: useremail }, // query
//       { $set: { img_location: 'images_upload/user/' + img_name + '.' + ext } },
//       function (err, data) {
//         if (err) { return next(err); }
//
//         res.send(data.value);
//         console.log(data.value);
//         req.user.img_location = 'images_upload/user/' + img_name + '.' + ext; // update session image
//
//         /* when updating image*/
//         if (prev_image) {
//           if (prev_image !== '') {
//             fs.unlink('public/' + prev_image, function (err) {
//               if (err) { return next(err); }
//
//               console.log('successfully deleted /tmp/hello');
//             });
//           }
//         }
//       }
//     );
//   });
// };

// PROBLEM: does not return anything
exports.twitterProfilePicX = function () {
  // Application-only authentication SSL absolutely required

  // https://dev.twitter.com/oauth/overview/authorizing-requests

  // var id =req.body.id;
  // var fbToken=req.body.token;
  // Authorization:
  // OAuth oauth_consumer_key="7Sqt1HN55n9NGSZI3YPriUQwe",
  // oauth_nonce="kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg",   //  nonce is a unique key
  // oauth_signature="tnnArxj06cWHq44gCs1OSKk%2FjLY%3D",  // need to generate
  // oauth_signature_method="HMAC-SHA1",
  // oauth_timestamp= Math.floor(new Date() / 1000);
  // oauth_token="598003390-LjbIRJUpG60O5kTYDCsWXXhjbf911T6s7yoeqeIa",
  // oauth_version="1.0"

  // Oauth signature required first
  // curl --get 'https://api.twitter.com/1.1/users/show.json' --data 'screen_name=rajib2025' --header 'Authorization: OAuth oauth_consumer_key="7Sqt1HN55n9NGSZI3YPriUQwe", oauth_nonce="2c43215d144b0e7f456613f9865b9d18", oauth_signature="rWHXPqNy%2FQFgiCDS9Y2OSGSXWKo%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1448536674", oauth_token="598003390-LjbIRJUpG60O5kTYDCsWXXhjbf911T6s7yoeqeIa", oauth_version="1.0"' --verbose
  var options = {
    url: 'https://api.twitter.com/1.1/users/show.json'
  };

  request(options, function (error) {
    if (error) { console.log(error); }
  });
};

exports.twitterVerify = function (req, res) {
  var verifier = req.query.oauth_verifier;
  var o_token = req.query.oauth_token;

  // var oauth =
  // { consumer_key: '7Sqt1HN55n9NGSZI3YPriUQwe'
  // , consumer_secret: 'OVZxWPV6Rd2tgalk41Eec7qFqRBiwGPVhdkzJ6hZhctAyqWGKj'
  // , token: auth_data.oauth_token
  // // , token_secret: req_data.oauth_token_secret
  // , token_secret: auth_data.oauth_token_secret
  // , verifier: auth_data.oauth_verifier
  // }
  // , url = 'https://api.twitter.com/oauth/access_token'
  // ;

  var oauth = {
        consumer_key: '7Sqt1HN55n9NGSZI3YPriUQwe',
        consumer_secret: 'OVZxWPV6Rd2tgalk41Eec7qFqRBiwGPVhdkzJ6hZhctAyqWGKj',
        token: o_token,
        token_secret: auth_data.oauth_token_secret,
        verifier: verifier
      },
      url = 'https://api.twitter.com/oauth/access_token';

  request.post({ url: url, oauth: oauth }, function (e, r, body) {
    console.log(body);
    // ready to make signed requests on behalf of the user
    var perm_data = qs.parse(body),
        oauth = {
          consumer_key: '7Sqt1HN55n9NGSZI3YPriUQwe',
          consumer_secret: 'OVZxWPV6Rd2tgalk41Eec7qFqRBiwGPVhdkzJ6hZhctAyqWGKj',
          token: perm_data.oauth_token,
          token_secret: perm_data.oauth_token_secret
        },
        url = 'https://api.twitter.com/1.1/users/show.json',
        qstr = {
          screen_name: perm_data.screen_name,
          user_id: perm_data.user_id
        };

    request.get({ url: url, oauth: oauth, qs: qstr, json: true }, function (e, r, user) {
      console.log(user);
      // res.send(user.profile_image_url);
      // res.redirect("http://45.55.138.4/#/account?url="+user.profile_image_url);
      req.user.twitter_pic = user.profile_image_url;
      res.redirect('http://45.55.138.4/#!/account?uploadClass=3');
    });
  });
};

exports.twitterProfileImage = function (req, res) {
  res.send(req.user.twitter_pic);
};

// PROBLEM: auth_data is not shared between them
exports.twitterProfile = function (req, res) {
  var oauth = {
        callback: 'http://45.55.138.4/twitter_verify',
        consumer_key: '7Sqt1HN55n9NGSZI3YPriUQwe',
        consumer_secret: 'OVZxWPV6Rd2tgalk41Eec7qFqRBiwGPVhdkzJ6hZhctAyqWGKj'
      },
      url = 'https://api.twitter.com/oauth/request_token';

  request.post({ url: url, oauth: oauth }, function (e, r, body) {
    // Ideally, you would take the body in the response
    // and construct a URL that a user clicks on (like a sign in button).
    // The verifier is only available in the response after a user has
    // verified with twitter that they are authorizing your app.
    console.log(body);
    // step 2
    var req_data = qs.parse(body);
    var uri = 'https://api.twitter.com/oauth/authenticate?' + qs.stringify({ oauth_token: req_data.oauth_token });

    // redirect the user to the authorize uri
    auth_data = qs.parse(body);

    res.send(uri);
    // res.redirect(uri);
  });
};

// PROBLEM: this will never work
exports.photo = function (req, res, next) {
  var ext = mime.extension(req.files.file.mimetype);
  var prev_image = req.body.prev_img;

  /* when updating image*/
  if (prev_image) {
    if (prev_image !== '') {
      fs.exists('public/' + prev_image, function(exists) {
        if (exists) {
          fs.unlink('public/' + prev_image, function (err) {
            if (err) { return next(err); }

            console.log('successfully deleted /tmp/hello');
          });
        }
      });
    }
  }

  var pic_name = req.files.file.name;

  var sesid = new ObjId(req.user._id);

  User.findAndModify(          // please don t touch this code with out my consent
        { _id: sesid }, // query
        [],    // sort
    { $set: { img_location: 'images_upload/user/' + pic_name + '.' + ext } },
   { new: true },

	function (err, data) {
  if (err) { return next(err); }
  res.send(data.value.img_location);
  console.log(data.value);
});

  fs.exists('public/images_upload/user/' + pic_name, function(exists) {
    if (exists) {
      fs.renameSync('public/images_upload/user/' + pic_name, 'public/images_upload/user/' + pic_name + '.' + ext, function (err) {
        if (err) { return next(err); }

        req.user.img_location = 'public/images_upload/user/' + pic_name + '.' + ext; // update session image
      });
    }
  });
};

exports.deleteUserPic = function (req, res, next) {
  if (req.body.img_location) {
    fs.exists('public/images_upload/user/' + req.body.img_location, function(exists) {
      if (exists) {
        fs.unlink('public/' + req.body.img_location);
      }
    });
  }

  var sesid = new ObjId(req.user._id);

  req.user.img_location = null;

  User.findOneAndUpdate(
    { _id: sesid }, // query
    { $set: { img_location: '' } },
    function (err, data) {
      if (err) { return next(err); }
      req.user.img_location = null;
      res.send(data.value);
    }
  );
};

exports.emailUser = function () {
  sendgrid.send({
    to: 'rajib_2002bd@yahoo.com',
    from: 'webmaster@sociallyshoppable.com',
    subject: 'Sendgrid test case',
    text: 'Hello world'
  }, function (err, json) {
    if (err) {
      return console.error(err);
    }
    console.log(json);

  });
};

exports.usermodify = function (req, res, next) {
  // var purchaseId  = userDetails.purchase_id;
  var purchaseId = '57458cc5ba7529b357d55f45';
  var userDetails = { cart_id: '57458c8ce8a9c0d12413eb78', user_id: '57274362aa189af41b37a76b' };
  var site_Key = [];
  var parsedData;
  var user_cart;
  var cart_by_site;
  var successful_pmd5 = [];
  var unsuccessful_md5 = [];
  var final_cart = [];
  var tempMd5;

  // ask for purchase status to see any failed thing is there
  request({
    url: 'https://api.twotap.com/v1.0/purchase/status?public_token=' + config.twotap.publicToken + '&purchase_id=' + purchaseId + '&test_mode=fake_confirm',
    method: 'GET'
  }, function (err, reponse, body) {
    parsedData = JSON.parse(body);
    // get all site id's
    Object.keys(parsedData.sites).forEach(function(sk) {
      site_Key.push(sk);
    });

    var failMd5 = function(fail_md5) {
      unsuccessful_md5.push(parsedData.sites[site_Key].failed_to_add_to_cart[fail_md5]);
    };

    // find all failed productmd5 and collect inside unsuccessful_md5
    for (var n = 0; n < site_Key.length; n += 1) {
      var myObj = parsedData.sites[site_Key];

      if (myObj.failed_to_add_to_cart) {
        Object.keys(myObj.failed_to_add_to_cart).forEach(failMd5);
      }
    }

    // we will not remove unsuccessful md5
    // call cart status to get all relative cart products and considered as success
    request({
      url: 'https://api.twotap.com/v1.0/cart/status?public_token=' + config.twotap.publicToken + '&cart_id=' + userDetails.cart_id + '&test_mode=fake_confirm',
      method: 'GET'
    }, function (errst, reponset, cartResult) {
      if (errst) { return next(err); }

      user_cart = JSON.parse(cartResult);

      var pKeyMd5 = function(p_key_md5) { // each cart have multiple product key md5
        successful_pmd5.push(p_key_md5);
        console.log(p_key_md5);
      };

      for (var j = 0; j < site_Key.length; j += 1) {
        cart_by_site = user_cart.sites[site_Key].add_to_cart;
        Object.keys(cart_by_site).forEach(pKeyMd5);
      }

      // remove all unsuccessful items
      if (unsuccessful_md5.length > 0) {
        var uind = -1;
        var tempUnMd5;

        for (var us_index = 0; us_index < unsuccessful_md5.length; us_index += 1) {
          uind = -1;
          tempUnMd5 = unsuccessful_md5[us_index];
          uind = successful_pmd5.indexOf(tempUnMd5);
          if (uind > -1) {
            successful_pmd5.splice(uind, 1);  // remove unsuccessful list from
          }
        }
      }

      //  now find the user whom we like to update
      var userid = new ObjId(userDetails.user_id);

      User.find({ _id: userid }, function (err, profiledata) {

        if (err) { return next(err); }

        final_cart = profiledata[0].cart;

        async.waterfall([
          function (callback) {
            var success_pro = -1;

            for (var ix = 0; ix < successful_pmd5.length; ix += 1) {
              success_pro = successful_pmd5[ix];
              for (var j = 0; j < final_cart.length; j += 1) {
                tempMd5 = final_cart[j].productMD5;
                if (success_pro === tempMd5) {
                  final_cart.splice(j, 1);
                  console.log('spliced');
                  break;
                }
              }
            }
            callback(null, final_cart, 'two');
          }
        ], function (err, result) {
          User.update(
            { _id: userid },
            { $set: { cart: result } }
          )
            .exec(function (err, resultx) {
              if (err || resultx < 1) {
                // res.json(404, {msg: 'Failed to update Cart.'});
                console.log('cart update err' + err + ' ' + resultx);
              } else {
                // res.json({msg: "Customer Cart Updated"});
                console.log('cart updated');
                console.log(resultx);
              }
            });
        });
      }); // find the user having same details
    });
  });
};

exports.cjCoupon = function (req, res, next) {
  var link = 'https://linksearch.api.cj.com/v2/link-search?website-id=8087571&advertiser-ids=' + req.params.storeid + '&link-type=Text+Link&promotion-type=coupon&page-number=1&records-per-page=20';

  request({
    headers: {
      'authorization': '00d9fb63e7cc3b9d1ca158074cb36009be6ecbb1251c703b229c1ac0a9fb98e08e27b2c1d49706565113db02afe9e4a4026eb0d204eabf439030685ff0be419b1f/00941c5e0bb817a16f3ca9c57bf63d812165c2fd808bcc2e421bf38989762cb016658dcba660f5c7d3bafa383ec6bca7f947c19983570cfb8754683086ac75c701'
    },
    url: link,
    method: 'GET'
  }, function (err, response, body) {
    if (err) { return next(err); }

    res.send(body);
  });
};

exports.updateWishList = function (req, res) {
  var sesid = new ObjId(req.user._id);

  User
    .update({ _id: sesid }, { $set: { wishList: req.body.wishList } })
    .exec(function (err, results) {
      if (err || results < 1) {
        res.json(404, { msg: 'Failed to update wishlist.' });
        console.log('cart update err' + err + ' ' + results);
      } else {

        res.json({ msg: 'Customer wish-list Updated' });
        console.log('wish-list updated' + results);
        console.log(results);
      }

    });

};

/* Function for USer update  delete add products in cart*/

exports.getUserInfoAfterPurchase = function (req, res) {

  var sesid = new ObjId(req.user._id);

  User.find({ _id: sesid })
   .select({
     cart: 1,
     orderObj: 1,
     mailbox: 1
   })
    .exec(function (err, results) {
      if (err) {
        res.json(404, { msg: 'Failed to update Cart.' });

      } else {
        console.log(results);

        res.send(results[0]);

      }
    });
};

// update unsigned user's cart
exports.updateCartUnsignedUser = function (req, res) {

  var guestid = new ObjId(req.body.guestid);
  var ucart = req.body.updatedCart;
  var cartShop = JSON.stringify(req.body.updatedCart.required_field_values);

  ucart.required_field_values = cartShop;

  UnsignedUser.update({ _id: guestid }, { $set: { cart: ucart } })
    .exec(function (err, results) {
      if (err || results < 1) {

        res.json(404, { msg: 'Failed to update Cart.' });
        console.log('cart update err' + err + ' ' + results);
      } else {
        res.json({ msg: 'Customer Cart Updated' });
        console.log('cart updated' + results);
      }
    });

};

exports.updateCart = function (req, res) {

  var sesid = new ObjId(req.user._id);
  console.log(sesid);

  User.update({ _id: sesid }, { $set: { cart: req.body.updatedCart } })
    .exec(function (err, results) {
      if (err || results < 1) {
        res.json(404, { msg: 'Failed to update Cart.' });
        console.log('cart update err' + err + ' ' + results);
      } else {
        res.json({ msg: 'Customer Cart Updated' });
        console.log('cart updated' + results);
        console.log(results);
      }
    });
};

// Obsolcent function for delete saved item NOT WORKING *****
exports.deleteSavedItem = function (req, res) {
  var sesid = new ObjId(req.user._id);

  User.update({ _id: sesid }, { $set: { saved_item_id: req.body.del_pro_id } })
    .exec(function (err, results) {
      if (err || results < 1) {
        res.json(404, { msg: 'Failed to update Cart.' });
        console.log('cart update err' + err + ' ' + results);
      } else {
        res.json(results);
        console.log('save list updated' + results);
      }
    });
};

exports.movetoSaveList = function (req, res) {

  if (!req.user) {   // check session is set

    res.json(404, { stat: false });

    return next('no session');
  }
  var proMd5 = req.body.proMd5;
  var sesid = new ObjId(req.user._id);
  var valid = false;
  var index;

  User.find({ _id: sesid })
        .select({
          cart: 1,
          wishList: 1

        })
    .exec(function (err, profiledata) {
      if (err) {
        res.json(404, { stat: false });

        return;
      }

      if (!profiledata) {
        res.json(404, { stat: false });
      } else {
        var tx = profiledata[0];
        var final_cart = tx.cart; // hold data inside json
        var final_wishlist = [];
        index = 0;
        if (tx.wishList !== null) {
          final_wishlist = tx.wishList;
          index = final_wishlist.length;
        }

        for (var i = 0; i < final_cart.length; i += 1) {
          if (final_cart[i].chkout_url === proMd5.original_url) {

            var l = final_cart[i];
            final_wishlist[index] = final_cart[i];

            var temp_fieldname;
           /*   if (proMd5.required_field_names) {

                  for (var k = 0; k < proMd5.required_field_names.length; k++) {

                      temp_fieldname = required_field_names[k];

                      final_wishlist[index].required_field_values[temp_fieldname] = proMd5[temp_fieldname];

                  }
              }

            if (proMd5.size) {
              final_wishlist[index].required_field_values.size = proMd5.size;
            }

            if (proMd5.color) {
              final_wishlist[index].required_field_values.color = proMd5.color;
            }

            if (proMd5.option) {
              final_wishlist[index].required_field_values.option = proMd5.option;
            }
           */
            final_wishlist[index].quantity = parseInt(proMd5.quantity, 10);
            final_wishlist[index].required_field_values.quantity = final_wishlist[index].quantity;

            final_cart.splice(i, 1);
            valid = true;
            break;

            console.log('move to savelist valid');
          }
        }

        if (valid) {
          console.log('cart items ' + final_cart.length);
          console.log('saved items ' + final_wishlist.length);
          User.update(
          { _id: sesid },
          { $set: { wishList: final_wishlist, cart: final_cart } },
          { new: true }
        ).exec(function (err, results) {

          console.log(results);
          if (err || results < 1) {
            res.json({ msg: 'Failed to update wishlist.', stat: false });
          } else {
            res.json({
              msg: 'Customer wish-list Updated',
              stat: true,
              wishList: final_wishlist,
              cart: final_cart
            });
            console.log('cart item move to wish-list ');
          }
        });
        } else {
          res.json({ msg: 'Failed to update wishlist.', stat: false });

          console.log('not valid');
        }
      }
    });
};

exports.movetoCart = function (req, res) {
  var proMd5 = req.body.proMd5;
  var sesid = new ObjId(req.user._id);
  var valid = false;

  User.find({ _id: sesid })
        .select({
          cart: 1,
          wishList: 1

        })
    .exec(function (err, profiledata) {
      if (err) {
        res.json(404, { stat: false });

        return;
      }
      if (!profiledata) {
        res.json(404, { stat: false });
      } else {
        var final_cart = [];
        var tx = profiledata[0];
        var final_wishlist = tx.wishList;
        var index = 0;

        if (tx.cart !== null) {
          final_cart = tx.cart;
          index = final_cart.length; // insert inside there
        }
        var temp_fieldname;

        for (var i = 0; i < final_wishlist.length; i += 1) {
          if (final_wishlist[i].chkout_url === proMd5.original_url) {
            final_cart[index] = final_wishlist[i];

/*
              if (typeof proMd5.required_field_names !== undefined) {

                  for (var k = 0; k < proMd5.required_field_names.length; k++) {

                      temp_fieldname = required_field_names[k];

                      final_cart[index].required_field_values[temp_fieldname] = proMd5[temp_fieldname];

                  }
              }
*/
              /*
              if (typeof proMd5.size !== undefined) {
              final_cart[index].required_field_values.size = proMd5.size;
              final_cart[index].size = proMd5.size;
            }

            if (typeof proMd5.color !== undefined) {
              final_cart[index].required_field_values.color = proMd5.color;
              final_cart[index].color = proMd5.color;
            }

            if (typeof proMd5.option !== undefined) {
              final_cart[index].required_field_values.option = proMd5.option;
              final_cart[index].color = proMd5.option;
            } */
            final_cart[index].required_field_values.quantity = parseInt(proMd5.quantity, 10);
            final_cart[index].quantity = parseInt(proMd5.quantity, 10);
            final_wishlist.splice(i, 1);
            valid = true;
            break;
          }
        }

        if (valid) {
          console.log(final_wishlist.length);
          console.log(final_cart.length);

          User.update(
          { _id: sesid },
          { $set: { wishList: final_wishlist, cart: final_cart } },
          { new: true }
        ).exec(function (err, results) {
          if (err || results < 1) {
            res.json({ msg: 'Failed to update wishlist.', stat: false });
            console.log('update err' + err + ' ' + results);
          } else {
            res.json({
              msg: 'Customer wish-list Updated',
              stat: true,
              wishList: final_wishlist,
              cart: final_cart
            });
            console.log('cart item move to cart-list ');
            console.log(results);
          }
        });
        }
      }
    });
};

exports.getSite = function (req, res, next) {

  Twotapsite.find({ name: { $in: req.body.storenamearray } })
    .exec(function (err, storelist) {
      if (!storelist) {
        res.json(404, { msg: 'sitelist Not Found.' });
      } else {
        res.send(storelist);
      }
    });

};
