'use strict';

/**
 * Module dependencies.
 */
var config = require('../'),
    compression = require('compression'),
    express = require('express'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    policy = require('./policy'),
    path = require('path'),
    MongoStore = require('connect-mongo')(session),
    app;

require('follow-redirects').maxRedirects = 10;   // Has global affect (be careful!) number of maximum redirects

module.exports = app = express();

app.use(bodyParser.json({ limit: '100mb', type:'application/json' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true, type:'application/x-www-form-urlencoding' }));

// Load the express
module.exports.init = function (db, callback) {
    // process.env.UV_THREADPOOL_SIZE = 128;

    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret,
        cookie: {
            maxAge: config.sessionCookie.maxAge,
            httpOnly: config.sessionCookie.httpOnly,
            secure: config.sessionCookie.secure && config.secure.ssl
        },
        name: config.sessionKey,
        store: new MongoStore({
            mongooseConnection: db.connection, //db.connection
            collection: config.sessionCollection
        })
    }));

    app.use(compression({
        filter: function () {
            return true;
        }
    }));

    app.use(function (req, res, next) {
      /*  if (req.url.match(/^\/(css|js|s_js|s_css|scripts|vendor|img|font|assets|images)\/.+/)) {
           res.setHeader('Expires', new Date(Date.now() + 2592000000 * 30).toUTCString());
           res.setHeader('Cache-Control', 'public, max-age=86400000');
        }

        if (req.url.match(/\.(jpg|jpeg|png|gif|css|html|js)\b/)) {
           res.setHeader('Expires', new Date(Date.now() + 2592000000 * 30).toUTCString());
           res.setHeader('Cache-Control', 'public, max-age=86400000');
            // res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            // res.header('Expires', '-1');
            // res.header('Pragma', 'no-cache');
        }
        if (req.url.match(/^\/(get_all_custom_category|get_cmn_brands|get_cmn_merchants|get_storelistSlider|get_top_stores|productResult|productResultCount|get_supported_merchants|mixpanelsearchDb)\b/)) {
           res.setHeader("Expires", new Date(Date.now() + 2592000000 * 30).toUTCString());
           res.setHeader('Cache-Control', 'public, max-age=86400000');
        }  */
        next();
    });

    app.use(cookieParser());
    // for parsing application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    var exh = process.cwd() + '/public';

    // ejs template engine in express
    app.engine('.html', require('ejs').__express);
    // views files directory
    app.set('views', process.cwd() + '/views');
    app.set('view engine', 'html');
    // setting up directory for css etc
    app.use(express.static(process.cwd() + '/public'));

    // handle users
    require(process.cwd() + '/config/users.config')(app);

    // routes
    config.files.server.routes.forEach(function (routePath) {
        require(path.resolve(routePath))(app);
    });

    config.files.server.policies.forEach(function (routePath) {
        require(path.resolve(routePath)).initPolicies();
    });

    // error handling
    app.use(function (err, req, res, next) {
        console.error(err.stack);

        res.status(err.status || 500);
        res.send(err);

        if (typeof next === 'function') {
            next();
        }
    });

    if (callback) {
        callback();
    }

    return app;
};

module.exports.start = function () {

    // check acl
   // policy.checkPolicies(app);

    app.listen(config.express.port);
};
