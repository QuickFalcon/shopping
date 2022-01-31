'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StoreSchema = new Schema({
  store_name: String,
  address: String,
  city: String,
  country: String,
  priority: Number,
  store_url: String,
  image_url: String,
  thumbnail_url: String,
  icon_url: String,
  contact_person: String,
  contact_designation: String,
  store_email: String,
  store_phone: String,
  store_rank: Number,
  store_review: Number,
  store_share: Number,
  featured: Boolean,
  store_category: [String],
  store_subcategory: String,
  title_img: String
});

mongoose.model('Store', StoreSchema);
