'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StoreSchemaProsperent = new Schema({
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
  dateActive: String
});

mongoose.model('StoreProsperent', StoreSchemaProsperent);
