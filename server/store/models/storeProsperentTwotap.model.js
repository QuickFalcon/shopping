'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StoreSchemaProsperentTwotap = new Schema({
  merchant: String,
  merchantId: String
});

mongoose.model('StoreProsperentTwotapCmn', StoreSchemaProsperentTwotap);
