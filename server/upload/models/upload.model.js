'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UploadSchema = new Schema({
  catalogId: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  image: { type: String },
  type: { type: String }
}, {
  timestamps: true
});

mongoose.model('Upload', UploadSchema);
