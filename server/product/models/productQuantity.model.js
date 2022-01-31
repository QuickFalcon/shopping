'use strict';

require('../../product/models/ss_Product.model.js');

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ProductSchema = mongoose.model('ss_tap_Product').schema;
// this is every single entity for cart item
/* part of product and quantity inside cart*/
var ProductQuantitySchema = new Schema({
  quantity: Number,
  retailer: String,
  logo_url: String,
  url: String, // url within web site
  current_price: Number,
  chkout_url: String,
  twoTapAffiliateLink: String,
  site_key: String,
  productMD5: String,
  cartId: String,
  coupon_support: Boolean,
  gift_support: Boolean,
  checkout_support: Object,
  shipping_countries_support: Object,
  billing_countries_support: Object,
  shipping_options: Object,
  affiliated_network: String,
  catalogId: String,
  productId: String,
  keyword: String,
  prosperent_price: Number,
  prosperent_price_sale: Number,
  prosperent_percentOff: Number,
  required_field_values: Object,
  twotap_required: Object,
  timestamp: { type: Date, default: Date.now },
  product: [ProductSchema]
}, { _id: false });

mongoose.model('ProductQuantity', ProductQuantitySchema);
