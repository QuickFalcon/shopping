'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MenuSchema = new Schema({
  userDashboardMerchant: [String],
  usermenMerchant: [String],
  usermenMerchantId: [Number],
  userWomenMerchant: [String],
  userShoesMerchant: [String],
  userAccessoriesMerchant: [String],
  userBeautyMerchant: [String],
  userKidsMerchant: [String],
  userHomeMerchant: [String],
  userGiftsMerchant: [String],
  userLocalMerchant: [String]

});

mongoose.model('MenuItem', MenuSchema);
