'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var couponAvoidByUserSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  site_id: String,
  code: String

}, {
  timestamps: true
});

mongoose.model('CouponAvoidByUser', couponAvoidByUserSchema);
