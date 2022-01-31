'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var productsSchemaProsperent = new Schema({
  catalogId: String,
  productId: String,
  affiliate_url: String,
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
  sales: Number,
  twoTapProductUrl: String,
  twoTapAffiliateLink: String,
  _id: Schema.Types.ObjectId,
  available: Boolean,
  affiliatedNetwork: String,
  gender: Number,
  directUrl: String,
  totalRate: { type: Number, default: 0 },
  ratedByUser: { type: Number, default: 0.000001 },
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
  availability_updated_at: { type: Date }

});

  // instock: Number, // number of item in stock

mongoose.model('ProductProsperent', productsSchemaProsperent);
