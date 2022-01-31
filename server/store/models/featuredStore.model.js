'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var featuredStoreSchema = new Schema({
  store_name: String,
  menuItem: String,
  store_id: String
});

mongoose.model('FeatureStore', featuredStoreSchema);
