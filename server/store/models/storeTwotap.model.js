'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StoreSchemaTwotap = new Schema({
  merchant: String,
  merchantId: String
});

mongoose.model('StoreTwotap', StoreSchemaTwotap);
