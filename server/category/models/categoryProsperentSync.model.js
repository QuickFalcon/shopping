'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var categoriesSchemaProsperentSync = new Schema({
  category: String,
  numProducts: Number,
  categoryId: Number,
  has_products: Boolean

});

mongoose.model('CategoryProsperentSync', categoriesSchemaProsperentSync);
