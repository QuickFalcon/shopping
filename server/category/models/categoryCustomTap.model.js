'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var categoriesSchemaCustomTap = new Schema({
   _id: Schema.Types.ObjectId,
  categoryId: Number,
  parent: Number,
  category: String,
  level: Number,
  prosperent_categories: [String],
  prosperent_categories_id: [Number],
  has_product: Boolean,
  position : Number,
  mother_details: { type: Schema.ObjectId, ref: 'CategoryCustomTap' }
});

mongoose.model('CategoryCustomTap', categoriesSchemaCustomTap);
