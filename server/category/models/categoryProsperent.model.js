'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var categoriesSchemaProsperent = new Schema({
  cid: Number,
  fullcategory: String,
  parent: Number,
  category: String,
  level: Number
});

mongoose.model('CategoryProsperent', categoriesSchemaProsperent);
