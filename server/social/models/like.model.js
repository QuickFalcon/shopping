'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LikeSchema = new Schema({
  catalogId: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  } }, {
    timestamps: true
  });

LikeSchema.index({ catalogId: 1, user: 1 }, { unique: true });

mongoose.model('Like', LikeSchema);
