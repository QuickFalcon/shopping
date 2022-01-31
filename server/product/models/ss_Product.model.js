'use strict';
/*Main serching*/
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

	// require('../../social/models/socialPhoto.model.js');

	// var SocialPhoto = mongoose.model('SocialPhoto');
// main product for search 
var productsSchemaSS = new Schema({
  _id: Schema.Types.ObjectId,
  title: String,
  catalogId: String,
  productId: String,
  image_url: String,
  keyword: String,
  keywords: String,
  celebrity: [String],
  description: String,
  fine_category: String,
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
  affiliated_network : Number // 1 means CJ  affiliated_network 10
  // ref: 'SocialPhoto'

}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

var productsSchemaSS2 = new Schema({
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
  affiliatedNetwork: String,
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
    affiliated_network : Number // 1 means CJ

}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

productsSchemaSS.virtual('photos', {
  ref: 'SocialPhoto', // The model to use
  localField: 'catalogId', // Find people where `localField`
  foreignField: 'catalogId', // is equal to `foreignField`
  justOne: true
});
  // instock: Number, // number of item in stock

var SocialPhotoSchema = new Schema({
  catalogId: String,
  product: { type: String, ref: 'ProductProsperent' },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  photo: String,
  primary: Boolean
}, {
  timestamps: true
});
var SocialPhoto = mongoose.model('SocialPhoto', SocialPhotoSchema);
var ProductProsperent = mongoose.model('ss_tap_Product', productsSchemaSS);

//db.ss_tap_products.createIndex({title:"text",merchant:"text",brand:"text",fine_category:"text"})