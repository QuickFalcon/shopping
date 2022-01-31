'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProductSchema = new Schema({
  catalogId: String,
  productId: String,
  keyword: String,
  // instock: Number, // number of item in stock
  availability: Boolean,
  prosper_availability: Boolean,
  keywords: String,
  celebrity: String,
  gender: Number,
  category: String,
  SScategory: String,
  designer: String,
  merchant: String,
  merchantId: Number,
  brand: String,
  price: Number,
  price_sale: Number,
  percentOff: Number,
  sale_offer: Boolean,
  sales: Number,
  affiliate_url: String,
  image_url: String,
  product_url: String,
  twoTapProductUrl: String,
  twoTapAffiliateLink: String,
  color: String,
  color_code: String,
  size: String,
  currency: String,
  description: String,
  upc: String,
  isbn: String,
  rate: Number,
  total_user_rated: Number,
  like: Number,
  share: Number,
  review: String,
  premium: Boolean,
  occasion_casual: Boolean,
  occasion_vacation: Boolean,
  occasion_work: Boolean,
  occasion_other: Boolean,
  created_at: Number,
  updated_at: Number,
  userActivities: [{ type: Schema.Types.ObjectId, ref: 'userActivity' }]
});

mongoose.model('Product', ProductSchema);
