'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// This schema hold activities and also with which product
// var ActivitySchema = new Schema(
//    {
//        activity_product: [ProductSchema], // with which product
//
//        // when does action take place
//
//    });

var UserActivitySchema = new Schema({
  userid: Schema.Types.ObjectId,   // id of user who involved in this activity
  // catalogId: { type: String, ref: 'product' },
  // activity:[ActivitySchema],
  catalogId: String,
  action_time: Number,
  activity_product_id: Schema.Types.ObjectId,
  uaction: String,
  like: Boolean,
  mail: Boolean,
  collective: Boolean
});

mongoose.model('UserActivity', UserActivitySchema);
