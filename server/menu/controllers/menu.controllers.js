'use strict';

var async = require('async'),
    mongoose = require('mongoose'),
    MenuItem = mongoose.model('MenuItem'),
    User = mongoose.model('User');

exports.calculateTop = function (req, res, next) {
  async.parallel([
    function (callback) {
      User.aggregate([
        { $unwind: '$userWomenMerchant' },
        {
          $group: {
            _id: { userWomenMerchant: '$userWomenMerchant' },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1, _id: 1 } },
        { $limit: 10 }
      ], function (err, resultWomen) {

        if (err) { return next(err); }

        callback(null, resultWomen);
      });

    }, // function women end
    function (callback) { // here men function

      User.aggregate([
        { $unwind: '$usermenMerchant' },
        {
          $group: {
            _id: { usermenMerchant: '$usermenMerchant' },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1, _id: 1 } },
        { $limit: 10 }
      ], function (err, resultMen) {
        if (err) { return next(err); }

        callback(null, resultMen);
      });
    }, // to here
    function (callback) { // here
      User.aggregate([
        { $unwind: '$userShoesMerchant' },
        {
          $group: {
            _id: { userShoesMerchant: '$userShoesMerchant' },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1, _id: 1 } },
        { $limit: 10 }

      ], function (err, resultShoes) {
        if (err) { return next(err); }

        callback(null, resultShoes);
      });
    }, // to here
    function (callback) { // here
      User.aggregate([
        { $unwind: '$userAccessoriesMerchant' },
        {
          $group: {
            _id: { userAccessoriesMerchant: '$userAccessoriesMerchant' },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1, _id: 1 } },
        { $limit: 10 }
      ], function (err, resultAccessories) {
        if (err) { return next(err); }

        callback(null, resultAccessories);
      });
    }, // to here
    function (callback) { // here
      User.aggregate([
        { $unwind: '$userBeautyMerchant' },
        {
          $group: {
            _id: { userBeautyMerchant: '$userBeautyMerchant' },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1, _id: 1 } },
        { $limit: 10 }

      ], function (err, resultBeauty) {
        if (err) { return next(err); }

        callback(null, resultBeauty);
      });
    }, // to here
    function (callback) { // here
      User.aggregate([
        { $unwind: '$userKidsMerchant' },
        {
          $group: {
            _id: { userKidsMerchant: '$userKidsMerchant' },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1, _id: 1 } },
        { $limit: 10 }
      ], function (err, resultKids) {
        if (err) { return next(err); }

        callback(null, resultKids);
      });
    }, // to here
    function (callback) { // here
      User.aggregate([
        { $unwind: '$userHomeMerchant' },
        {
          $group: {
            _id: { userHomeMerchant: '$userHomeMerchant' },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1, _id: 1 } },
        { $limit: 10 }
      ], function (err, resultHome) {
        if (err) { return next(err); }

        callback(null, resultHome);
      });
    }, // to here
    function (callback) { // here
      User.aggregate([
        { $unwind: '$userGiftsMerchant' },
        {
          $group: {
            _id: { userGiftsMerchant: '$userGiftsMerchant' },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1, _id: 1 } },
        { $limit: 10 }
      ], function (err, resultGifts) {
        if (err) { return next(err); }

        console.log(resultGifts);
        callback(null, resultGifts);
      });
    },
    // to here
    function (callback) { // here
      User.aggregate([
        { $unwind: '$userLocalMerchant' },
        {
          $group: {
            _id: { userLocalMerchant: '$userLocalMerchant' },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1, _id: 1 } },
        { $limit: 10 }
      ], function (err, resultOthers) {

        if (err) { return next(err); }

        callback(null, resultOthers);
        console.log(resultOthers);
      });
    },
    function (callback) { // here
      User.aggregate([
        { $unwind: '$userDashboardMerchant' },
        {
          $group: {
            _id: { userDashboardMerchant: '$userDashboardMerchant' },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1, _id: 1 } },
        { $limit: 10 }
      ], function (err, resultDashboard) {
        if (err) { return next(err); }

        console.log(resultDashboard);
        callback(null, resultDashboard);
      });
    }
  ], function (err, results) {
    // the results array will equal ['one','two'] even though
    // the second function had a shorter timeout.
    if (err) {
      console.log('sync not possible');
    } else {
      var tempArrWomen = [];
      var tempArrMen = [];
      var tempArrShoes = [];
      var tempArrAccessories = [];
      var tempArrBeauty = [];
      var tempArrKids = [];
      var tempArrHome = [];
      var tempArrGifts = [];
      var tempArrOthers = [];
      var tempArrDashboard = [];

      for (var count = 0; count < results[0].length; count += 1) {
        tempArrWomen[count] = results[0][count]._id.userWomenMerchant;
      }

      for (var Mcount = 0; Mcount < results[1].length; Mcount += 1) {
        tempArrMen[Mcount] = results[1][Mcount]._id.usermenMerchant;
      }

      for (var Scount = 0; Scount < results[2].length; Scount += 1) {
        tempArrShoes[Scount] = results[2][Scount]._id.userShoesMerchant;
      }

      for (var Acount = 0; Acount < results[3].length; Acount += 1) {
        tempArrAccessories[Acount] = results[3][Acount]._id.userAccessoriesMerchant;
      }

      for (var Bcount = 0; Bcount < results[4].length; Bcount += 1) {
        tempArrBeauty[Bcount] = results[4][Bcount]._id.userBeautyMerchant;
      }

      for (var Kcount = 0; Kcount < results[5].length; Kcount += 1) {
        tempArrKids[Kcount] = results[5][Kcount]._id.userKidsMerchant;
      }

      for (var Hcount = 0; Hcount < results[6].length; Hcount += 1) {
        tempArrHome[Hcount] = results[6][Hcount]._id.userHomeMerchant;
      }

      for (var Gcount = 0; Gcount < results[7].length; Gcount += 1) {
        tempArrGifts[Gcount] = results[7][Gcount]._id.userGiftsMerchant;
      }

      for (var Ocount = 0; Ocount < results[8].length; Ocount += 1) {
        tempArrOthers[Ocount] = results[8][Ocount]._id.userLocalMerchant;
      }

      for (var Dcount = 0; Dcount < results[9].length; Dcount += 1) {
        tempArrDashboard[Dcount] = results[9][Dcount]._id.userDashboardMerchant;
      }

      MenuItem.remove({}).exec();
      MenuItem.create({
        userDashboardMerchant: tempArrDashboard,
        userWomenMerchant: tempArrWomen,
        usermenMerchant: tempArrMen,
        userShoesMerchant: tempArrShoes,
        userAccessoriesMerchant: tempArrAccessories,
        userBeautyMerchant: tempArrBeauty,
        userKidsMerchant: tempArrKids,
        userHomeMerchant: tempArrHome,
        userGiftsMerchant: tempArrGifts,
        userLocalMerchant: tempArrOthers
      }, function (err, data) {
        if (err) { return next(err); }

        res.send(data);
      });
    } // else end
  });
};

exports.calculateTopCron = function () {
  async.parallel([
    function (callback) {
      User.aggregate([
        { $unwind: '$userWomenMerchant' },
        {
          $group: {
            _id: { userWomenMerchant: '$userWomenMerchant' },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1, _id: 1 } },
        { $limit: 10 }
      ], function (err, resultWomen) {

        if (err) { console.log(err); }

        callback(null, resultWomen);
      });

    }, // function women end
    function (callback) { // here men function

      User.aggregate([
        { $unwind: '$usermenMerchant' },
        {
          $group: {
            _id: { usermenMerchant: '$usermenMerchant' },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1, _id: 1 } },
        { $limit: 10 }
      ], function (err, resultMen) {
        if (err) { console.log(err); }

        callback(null, resultMen);
      });
    }, // to here
    function (callback) { // here
      User.aggregate([
        { $unwind: '$userShoesMerchant' },
        {
          $group: {
            _id: { userShoesMerchant: '$userShoesMerchant' },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1, _id: 1 } },
        { $limit: 10 }

      ], function (err, resultShoes) {
        if (err) { console.log(err); }

        callback(null, resultShoes);
      });
    }, // to here
    function (callback) { // here
      User.aggregate([
        { $unwind: '$userAccessoriesMerchant' },
        {
          $group: {
            _id: { userAccessoriesMerchant: '$userAccessoriesMerchant' },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1, _id: 1 } },
        { $limit: 10 }
      ], function (err, resultAccessories) {
        if (err) { console.log(err); }

        callback(null, resultAccessories);
      });
    }, // to here
    function (callback) { // here
      User.aggregate([
        { $unwind: '$userBeautyMerchant' },
        {
          $group: {
            _id: { userBeautyMerchant: '$userBeautyMerchant' },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1, _id: 1 } },
        { $limit: 10 }

      ], function (err, resultBeauty) {
        if (err) { console.log(err); }

        callback(null, resultBeauty);
      });
    }, // to here
    function (callback) { // here
      User.aggregate([
        { $unwind: '$userKidsMerchant' },
        {
          $group: {
            _id: { userKidsMerchant: '$userKidsMerchant' },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1, _id: 1 } },
        { $limit: 10 }
      ], function (err, resultKids) {
        if (err) { console.log(err); }

        callback(null, resultKids);
      });
    }, // to here
    function (callback) { // here
      User.aggregate([
        { $unwind: '$userHomeMerchant' },
        {
          $group: {
            _id: { userHomeMerchant: '$userHomeMerchant' },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1, _id: 1 } },
        { $limit: 10 }
      ], function (err, resultHome) {
        if (err) { console.log(err); }

        callback(null, resultHome);
      });
    }, // to here
    function (callback) { // here
      User.aggregate([
        { $unwind: '$userGiftsMerchant' },
        {
          $group: {
            _id: { userGiftsMerchant: '$userGiftsMerchant' },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1, _id: 1 } },
        { $limit: 10 }
      ], function (err, resultGifts) {
        if (err) { console.log(err); }

        console.log(resultGifts);
        callback(null, resultGifts);
      });
    },
    // to here
    function (callback) { // here
      User.aggregate([
        { $unwind: '$userLocalMerchant' },
        {
          $group: {
            _id: { userLocalMerchant: '$userLocalMerchant' },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1, _id: 1 } },
        { $limit: 10 }
      ], function (err, resultOthers) {

        if (err) { console.log(err); }

        callback(null, resultOthers);
        console.log(resultOthers);
      });
    },
    function (callback) { // here
      User.aggregate([
        { $unwind: '$userDashboardMerchant' },
        {
          $group: {
            _id: { userDashboardMerchant: '$userDashboardMerchant' },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1, _id: 1 } },
        { $limit: 10 }
      ], function (err, resultDashboard) {
        if (err) { console.log(err); }

        console.log(resultDashboard);
        callback(null, resultDashboard);
      });
    }
  ], function (err, results) {
    // the results array will equal ['one','two'] even though
    // the second function had a shorter timeout.
    if (err) {
      console.log('sync not possible');
    } else {
      var tempArrWomen = [];
      var tempArrMen = [];
      var tempArrShoes = [];
      var tempArrAccessories = [];
      var tempArrBeauty = [];
      var tempArrKids = [];
      var tempArrHome = [];
      var tempArrGifts = [];
      var tempArrOthers = [];
      var tempArrDashboard = [];

      for (var count = 0; count < results[0].length; count += 1) {
        tempArrWomen[count] = results[0][count]._id.userWomenMerchant;
      }

      for (var Mcount = 0; Mcount < results[1].length; Mcount += 1) {
        tempArrMen[Mcount] = results[1][Mcount]._id.usermenMerchant;
      }

      for (var Scount = 0; Scount < results[2].length; Scount += 1) {
        tempArrShoes[Scount] = results[2][Scount]._id.userShoesMerchant;
      }

      for (var Acount = 0; Acount < results[3].length; Acount += 1) {
        tempArrAccessories[Acount] = results[3][Acount]._id.userAccessoriesMerchant;
      }

      for (var Bcount = 0; Bcount < results[4].length; Bcount += 1) {
        tempArrBeauty[Bcount] = results[4][Bcount]._id.userBeautyMerchant;
      }

      for (var Kcount = 0; Kcount < results[5].length; Kcount += 1) {
        tempArrKids[Kcount] = results[5][Kcount]._id.userKidsMerchant;
      }

      for (var Hcount = 0; Hcount < results[6].length; Hcount += 1) {
        tempArrHome[Hcount] = results[6][Hcount]._id.userHomeMerchant;
      }

      for (var Gcount = 0; Gcount < results[7].length; Gcount += 1) {
        tempArrGifts[Gcount] = results[7][Gcount]._id.userGiftsMerchant;
      }

      for (var Ocount = 0; Ocount < results[8].length; Ocount += 1) {
        tempArrOthers[Ocount] = results[8][Ocount]._id.userLocalMerchant;
      }

      for (var Dcount = 0; Dcount < results[9].length; Dcount += 1) {
        tempArrDashboard[Dcount] = results[9][Dcount]._id.userDashboardMerchant;
      }
      MenuItem.remove({}, function(err) {
        if (err) {
          console.log(err);

          return;
        }

        MenuItem.create({
          userDashboardMerchant: tempArrDashboard,
          userWomenMerchant: tempArrWomen,
          usermenMerchant: tempArrMen,
          userShoesMerchant: tempArrShoes,
          userAccessoriesMerchant: tempArrAccessories,
          userBeautyMerchant: tempArrBeauty,
          userKidsMerchant: tempArrKids,
          userHomeMerchant: tempArrHome,
          userGiftsMerchant: tempArrGifts,
          userLocalMerchant: tempArrOthers
        }, function (errCreate) {
          if (errCreate) {
            console.log('sorry cant make top ten' + errCreate);
          }
          console.log('success generating featured stores');

        });
      });

    } // else end
  });
};
