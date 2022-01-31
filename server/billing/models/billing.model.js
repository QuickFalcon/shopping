'use strict';

var mongoose = require('mongoose'),
    AddressSchema = mongoose.model('Address').schema,
    Schema = mongoose.Schema;

var BillingSchema = new Schema({
  cardtype: { type: String, enum: ['Visa', 'MasterCard', 'Amex'] },
  name: String,
  number: String,
  expiremonth: Number,
  expireyear: Number,
  address: [AddressSchema]
}, { _id: false });

mongoose.model('Billing', BillingSchema);
