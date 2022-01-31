'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
require('../../product/models/ss_Product.model.js');

var MailSchema = new Schema({
  catalogId: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  to: { type: String, trim: true },
  from: { type: String, trim: true },
  subject: { type: String, trim: true },
  text: { type: String, trim: true },
  directMail: {
    type: Boolean,
    default: true
  }, sharetype: {
    type: String,
    default: 'individual'
  },
  del: Boolean,
  receiverdel: Boolean,
  mail_type: String,
  mail_object: Object,
  read: { type: Boolean, default: false }

}, {
  timestamps: true
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

MailSchema.virtual('mailproduct', {
  ref: 'ProductProsperent', // The model to use
  localField: 'catalogId', // Find people where `localField`
  foreignField: 'catalogId', // is equal to `foreignField`
  justOne: true
});

var Mail = mongoose.model('Mail', MailSchema);
