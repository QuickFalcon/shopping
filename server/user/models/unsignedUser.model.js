'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ProductQuantitySchema = mongoose.model('ProductQuantity').schema;

/* tracking unsigned user s*/
var unsignedUserSchema = new Schema({
  cart: [ProductQuantitySchema],
  timestamp: { type: Date, default: Date.now }

});

mongoose.model('UnsignedUser', unsignedUserSchema);
