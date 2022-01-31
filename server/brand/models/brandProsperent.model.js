'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BrandSchemaProsperent = new Schema({
  brand: String,
  logoUrl: String,
  numProducts: Number,
  pack: String
});

mongoose.model('BrandProsperent', BrandSchemaProsperent);
