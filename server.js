'use strict';

var mongoose = require('./config/lib/mongoose'),  // middlewear to connect database
    express = require('./config/lib/express');  // middlewear to connect database
// var strtotime = require('locutus/php/datetime/strtotime');
// var datetime = require('locutus/php/datetime'); datetime.strtotime('now');

// https://stackoverflow.com/questions/19917401/error-request-entity-too-large

// load the models
mongoose.loadModels();

// connect to mongoose
mongoose.connect(function (db) {
    // start express
    var app, bodyParser = require('body-parser');
    app = express.init(db);
    // start listening
    express.start();
    app.use(bodyParser.json({ limit: '100mb', type:'application/json' }));
    app.use(bodyParser.urlencoded({ limit: '100mb', extended: true, type:'application/x-www-form-urlencoding' }));
}, {
    autoReconnect: true
});

