'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SupportedSiteSchema = new Schema({
  name: String,
  merchant: String,
  merchantId: String,
  logoUrl: String,
  color1: String,
  color2: String,
  domain: String,
  category: String,
  description: String,
  productDatafeed: String,
  deepLinking: String,
  numProducts: Number,
  numProductsCA: Number,
  numProductsUK: Number,
  numCouponsUS: Number,
  numTravelOffersUS: Number,
  numLocalDealsUS: Number,
  minPaymentPercentage: String,
  maxPaymentPercentage: String,
  averagePaymentPercentage: String,
  conversionRate: Number,
  epc: Number,
  merchantWeight: Number,
  averageCommission: Number,
  dateActive: String,
  id: String,  // id of merchant
  url: String, // url of merchant
  logo: String,
  contact: String,
  country: String,
  creates_stores_account: Boolean,
  coupon_support: Boolean,
  gift_card_support: Boolean,
  feed_support: Boolean,
  checkout_support: [String]

});

mongoose.model('ss_Supported_Site', SupportedSiteSchema);
