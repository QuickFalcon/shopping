'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CommentSchema = new Schema({
  catalogId: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  rate: {
    type: Schema.Types.ObjectId,
    ref: 'Rate'
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  rateVal: Number

}, {
  timestamps: true
});

CommentSchema.index({ catalogId: 1, user: 1 }, { unique: true });

mongoose.model('Comment', CommentSchema);
