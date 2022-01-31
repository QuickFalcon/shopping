'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RateSchema = new Schema({
  catalogId: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  rate: Number
}, {
  timestamps: true
});

RateSchema.index({ catalogId: 1, user: 1 }, { unique: true });

mongoose.model('Rate', RateSchema);
