'use strict';

// force it to load before Order

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var purchaseSchema = new Schema({
  user_id: Schema.Types.ObjectId,
  email: String,
  status: { type: String, default: 'Pending' },
  timestamp: { type: Date, default: Date.now },
  purchase_id: Schema.Types.ObjectId,
  cart_id: Schema.Types.ObjectId,
  final_message: Object,
  global: { type: Boolean, default: false },
  extra_note: String,
  amount: Number,
  mac: String,
  firstname: String,
  lastname: String

});

mongoose.model('Purchase', purchaseSchema);
