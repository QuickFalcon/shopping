'use strict';
//the data source is cj 
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var productsSchemaSSq = new Schema({
  _id: Schema.Types.ObjectId,
  catalogId: String,
  productId: String,
  image_url: String,
  keyword: String,
  keywords: String,
  celebrity: [String],
  description: String,
  category: String,
  price: Number,
  price_sale: Number,
  current_price: Number,
  percentOff: Number,
  currency: String,
  merchant: String,
  merchantId: String,
  brand: String,
  upc: String,
  isbn: String,
  twoTapProductUrl: String,
  twoTapAffiliateLink: String,
  tapUrl: String,
  available: Boolean,
  SScategory: String,
  gender: Number,
  directUrl: String,
  totalRate: { type: Number, default: 0 },
  ratedByUser: { type: Number, default: 0 },
  rateAvg: { type: Number, default: 0 },
  likeCount: { type: Number, default: 0 },
  shareCount: { type: Number, default: 0 },
  purchaseCount: { type: Number, default: 0 },
  popularPoint: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  review: [String],
  color: [String],
  color_code: [String],
  userActivities: [{ type: Schema.Types.ObjectId, ref: 'userActivity' }],
  orderCount: Number,
  twotapObj: Object,
  downloadedAt: Date,
  lastChekced: Date,
  updated_at: { type: Date },
  required_field_names: [String],
  required_field_values: Object,
  site_id: String,
  site_name: String,
  md5: String,
  http_code: Number,
  affiliated_network : Number


}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

  // instock: Number, // number of item in stock

mongoose.model('ss_Productq', productsSchemaSSq);

