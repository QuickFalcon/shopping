'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var twotapsiteSchema = new Schema({

  id: String,
  name: String,
  url: String,
  logo: String,
  country: String,
  creates_stores_account: Boolean,
  coupon_support: Boolean,
  gift_card_support: Boolean,
  feed_support: false,
  checkout_support: [String],
  downloadedAt: Date,
  lastChekced: Date,
  updated_at: { type: Date }
});

mongoose.model('Twotapsite', twotapsiteSchema);
