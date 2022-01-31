'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// admin schema
var AdminSchema = new Schema({
  username: String,
  password: String,
  fullname: String,
  address: String,
  address_line1: String,
  address_line2: String,
  city: String,
  phone: String,
  email: String,
  gender: Boolean
});

mongoose.model('Admin', AdminSchema);
