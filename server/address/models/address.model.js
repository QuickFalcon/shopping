'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AddressSchema = new Schema({
  name: String,
  address: String,
  address_line1: String,
  address_line2: String,
  city: String,
  state: String,
  zip: String
}, { _id: false });

mongoose.model('Address', AddressSchema);
