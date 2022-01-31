'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var suggestionSchema = new Schema({
  keyword: String

});

mongoose.model('ss_keyword_suggestion', suggestionSchema);
