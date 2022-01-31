'use strict';

// force it to load before Order
require('../../product/models/productQuantity.model.js');
require('../../user/models/user.model.js');

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    AddressSchema = mongoose.model('Address').schema,
    BillingSchema = mongoose.model('Billing').schema,
    ProductQuantitySchema = mongoose.model('ProductQuantity').schema;

var OrderSchema = new Schema({
  userid: String,
  items: [ProductQuantitySchema],
  shipping: [AddressSchema],
  billing: [BillingSchema],
  status: { type: String, default: 'Pending' },
  timestamp: { type: Date, default: Date.now },
  purchase_id: String,
  purchase_status: Boolean,
  final_message: Object
});

mongoose.model('Order', OrderSchema);
