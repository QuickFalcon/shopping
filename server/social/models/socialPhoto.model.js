/*
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SocialPhotoSchema = new Schema({
  catalogId: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  photo: String,
  primary: Boolean
}, {
  timestamps: true
});

mongoose.model('SocialPhoto', SocialPhotoSchema);
*/
