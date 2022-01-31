'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var IgnoredStoreSchemaProsperent = new Schema({
  merchant: String,
  domain: String
});

mongoose.model('IgnoredStoreProsperent', IgnoredStoreSchemaProsperent);
