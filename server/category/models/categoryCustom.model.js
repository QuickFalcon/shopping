'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var categoriesSchemaCustom = new Schema({
  cid: Number,
  parent: Number,
  category: String,
  level: Number,
  prosperent_categories: [String],
  prosperent_categories_id: [Number],
  has_product: Boolean,
  position : Number,
  mother_details: { type: Schema.ObjectId, ref: 'CategoryCustom' }
});

mongoose.model('CategoryCustom', categoriesSchemaCustom);
