'use strict';

var express = require('express'); // express module
var app = express();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schedule = require('node-schedule'),
webshot = require('webshot'),
async = require('async'),
fs = require('fs'),
request = require('request'),
rp = require('request-promise'),
urlencode = require('urlencode'),
sendgrid = require('./sendgrid');



  app.use(function (req, res, next) {
    if (req.url.match(/\.(jpg|jpeg|png|gif|css|html|js)\b/)) {
      res.setHeader('Expires', new Date(Date.now() + 86400000 ).toUTCString());
      res.setHeader('Cache-Control', 'public, max-age=86400000');
           
    }
    next();
  });

 // StoreProsperent = mongoose.model('StoreProsperent');
app.use(express.static(__dirname + '/images_webshot'));   //setting up directory for css etc

 var formattedTime,
    unix_timestamp,
    date,
    dat,
    month,
    year,
    hours,
    minutes,
    seconds,
    message;
 
 
var StoreSchemaProsperent = new Schema({

  merchant: String,
  merchantId: String,
  logoUrl: String,
  color1: String,
  color2: String,
  domain: String,
  category: String,
  description: String,
  productDatafeed: String,
  deepLinking: String,
  numProducts: Number,
  numProductsCA: Number,
  numProductsUK: Number,
  numCouponsUS: Number,
  numTravelOffersUS: Number,
  numLocalDealsUS: Number,
  minPaymentPercentage: String,
  maxPaymentPercentage: String,
  averagePaymentPercentage: String,
  conversionRate: Number,
  epc: Number,
  merchantWeight: Number,
  averageCommission: Number,
  dateActive: String
});

var IgnoredStoreSchemaProsperent = new Schema({
  merchant: String,
  domain: String
});

var StoreProsperent = mongoose.model('StoreProsperent', StoreSchemaProsperent);
var IgnoredStoreProsperent = mongoose.model('IgnoredStoreProsperent', IgnoredStoreSchemaProsperent);

var moptions = {
  server: {  reconnectTries: 10, socketOptions: { keepAlive: 180000 } }
  
};

mongoose.connect('mongodb://127.0.0.1/ss', moptions); // connect mongodb using mongoose
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));  // mongo error handler


var totalsuccess = 0;
var totalfailed = 0;
var page;
var lastPage; 
var busy = false; 
app.get('/cron', function(req, res, next) {
  if(busy) {
  console.log("already cron running");
  res.send("already cron running");
  return;
  }
  else
  busy =true;
  
  console.log("Scrapping started");
  message ='';
  StoreProsperent.find({}).sort({ domain: -1 }).exec(function (err, data) {
    if (err) { return next(err); }
    console.log(data);
    var dom;
    var options = {
      quality: 70,
      screenSize: {
        width: 1024,
        height: 768
      },
      shotSize: {
        width: 960,
        height: 537
      },
      siteType: 'url',
      phantomConfig: { 'ignore-ssl-errors': 'true', 'ssl-protocol': 'any', 'debug': 'true', 'web-security': 'false' },
      streamType: 'jpg',
      // errorIfStatusIsNot200: true,
      takeShotOnCallback: true,
      onLoadFinished: function() {
        window.callPhantom('takeShot');
      },

      renderDelay: 90000,
      timeout: 420000

    };

    page = 1;

   unix_timestamp = Math.round(Date.now() / 1000);
  date = new Date(unix_timestamp * 1000);
  year = date.getFullYear();
  month = date.getMonth();
  dat = date.getUTCDate();
  // Hours part from the timestamp
  hours = date.getHours();
// Minutes part from the timestamp
  minutes = '0' + date.getMinutes();
// Seconds part from the timestamp
  seconds = '0' + date.getSeconds();
// Will display time in 10:30:23 format
  formattedTime = year + '-' + month + '-' + dat + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);


    lastPage = data.length;
    var webera;

    var stringsuccess = '';
    totalsuccess = 0;
    totalfailed = 0;

    async.waterfall([
      function(callback) {
        IgnoredStoreProsperent.find({}, function (ignoreerr, ignoredata) {
          if (ignoreerr) { console.log(ignoreerr); }

          for (var ig_index = 0; ig_index < ignoredata.length; ig_index += 1) {

            for (var data_index = 0; data_index < data.length; data_index += 1) {

              if (ignoredata[ig_index].domain === data[data_index].domain) {
                data.splice(data_index, 1);
                console.log(data_index);
                break;
              }

            }
            if ((ig_index + 1) === ignoredata.length) {
              callback(null, data);
            }
          }
          if (ignoredata.length === 0) {
            callback(null, data);
          }
        });

      },
      function(data, callback) {
        // arg1 now equals 'one' and arg2 now equals 'two'
        lastPage = data.length;

        async.whilst(
          function () {         // synchronous truth test to perform before each execution of fn
            if (page > lastPage) {
              stringsuccess = '[' + formattedTime + '],Total Success:' + totalsuccess + ',Total failed:' + totalfailed + '\n';
              fs.appendFile(process.cwd() + '/images_webshot/successlog_hid.csv', stringsuccess, function(appenderr) {
                if (appenderr) {
                  console.log('Last failed to append');
                }
                console.log('The final data was appended to file!');
              });
			  message = message + '\n' + stringsuccess;
              message = message + '\n Sync operation happen on total ' + lastPage + ' Stores\n Thanks ';
              sendgrid.sendcronimagemail(message);
			  busy = false;
			}

            return page <= lastPage; // when this will not full fill exit
          },
          function (next) {

            dom = data[page - 1].domain;
            // dom = ar[page - 1].domain;
            console.log(dom + '\n');
			unix_timestamp = Math.round(Date.now() / 1000);
            date = new Date(unix_timestamp * 1000);
            year = date.getFullYear();
            month = date.getMonth();
            dat = date.getUTCDate();
            hours = date.getHours();
            minutes = '0' + date.getMinutes();
            seconds = '0' + date.getSeconds();

            formattedTime = year + '-' + month + '-' + dat + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

            webshot(dom, process.cwd() + '/images_webshot/' + dom + '.jpg', options, function(err) {

              if (err) {

                webera = '';

                webera = '[' + formattedTime + '],' + dom + ',Image generating error ' + err + '\n';
				message = message + '' + webera;
				
                fs.appendFile(process.cwd() + '/images_webshot/errorlog_hid.csv', webera, function(appenderr) {
                  if (appenderr) {
                    console.log('failed to import image & append csv ' + dom + ' ' + appenderr + '\n');
                  } else {
                    console.log('failed to import image ' + dom + ' \n');
                  }
                });

                totalfailed += 1;
                page += 1;
                next();

              } else {

                webera = '';

                webera = '[' + formattedTime + '],' + dom + ',done\n';
                fs.appendFile(process.cwd() + '/images_webshot/successlog_hid.csv', webera, function(appenderr) {
                  if (appenderr) {
                    console.log('failed to append ' + appenderr);
                  } else {
                    console.log('The image imported & write success ' + dom);
                  }
                });

                totalsuccess += 1;
                page += 1;
                next();

              }

            });

          }, function () {      //  A callback which is called after the test function has failed and repeated execution of fn has stopped
            console.log('Image import done ');

          });

        callback(null, totalsuccess);
      }
    ], function (err, result) {
      console.log(result);
      console.log('ignored data import done');
    });  // async end

  });

  res.send('hello');

});


app.get('/prosperent/:path', function(req, res, next) {
  console.log("HITS ME");
   var searchString = req.params.path;
  //var searchString =  req.body;
  //console.log(searchString);
 //return;
 
  var url = 'http://api.prosperent.com/api/search?' + searchString + '&api_key=0da1ade1627ce72127d551d52d5b55e7';

  var options = {
    uri: url,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    simple: false,
    json: true, // Automatically parses the JSON string in the response
    timeout: 60000

  };
  var options2 = {
    uri: url,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    simple: false,
    json: true, // Automatically parses the JSON string in the response
    timeout: 120000

  };
  
  
  rp(options)
  .then(function (repos) {
   
    if (repos) {
        return res.send(repos);
    }
	else
	{
	 request({
        uri: url,
        method: 'GET',
        timeout: 120000
      }, function (errSimple, response, body) {

        if (errSimple) {
          

          console.log("1");
          
          console.log(errSimple.code);
          res.end();
          return;
        } else if (response.statusCode >= 200 && response.statusCode <= 299) {
          return res.send(body);
        } else {
          console.log(response.statusCode);
          res.end();

          return;
        }
      });
    } 

  })
    .catch(function (reason) {
      
	   console.log(reason.code === 'ETIMEDOUT');
	   console.log(reason.connect === true); // connect time out 

	  res.end();

      return next(reason);

    });

});


app.listen(900);
