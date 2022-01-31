'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var couponSchema = new Schema({
  site_id: String,
  code: String,
  label: String,
  rules: [Object],
  starts_at: Date,
  ends_at: Date

}, {
  timestamps: true
});

mongoose.model('Coupon', couponSchema);
