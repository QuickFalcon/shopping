'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var mixpanelSchema = new Schema({
  keyword: String,
  count: Number
});

mongoose.model('mixpanel_keyword', mixpanelSchema);
