'use strict';

var request = require('request'),
    readline = require('readline'),
    fs = require('fs'),
    async = require('async'),
    mongoose = require('mongoose'),
    BrandProsperent = mongoose.model('BrandProsperent'),
    NodeCache = require('node-cache'),
    ObjId = require('mongoose').Types.ObjectId,
    lowerCase = require('lower-case'),
    ssCache = new NodeCache();

// getting brand list from data base
exports.getCmnBrands = function (req, res, next) {
  var offset = req.body.offset;
  var start = offset * req.body.start;
  // var query = BrandProsperent.find({numProducts: { $gte: 1 }}).count(); //
  // var query_data = BrandProsperent.find({numProducts: { $gte: 1 }}).skip(start).limit(offset).sort('brand');
   // var query = BrandProsperent.find({}).count(); //
   // var query_data = BrandProsperent.find({}).skip(start).limit(offset).sort('brand');
  var query = BrandProsperent.find({}).count(); //
  var query_data = BrandProsperent.find({}).skip(start).limit(offset).sort('brand');
  // query.exec(function (err, count) {
   // if (err) { return next(err); }
  var count;
  query_data.exec(function (err, data) {
    if (err) { return next(err); }

    var firstalphabet;

    var a = [];
    var b = [];
    var c = [];
    var d = [];
    var e = [];
    var f = [];
    var g = [];
    var h = [];
    var i = [];
    var j = [];
    var k = [];
    var l = [];
    var m = [];
    var n = [];
    var o = [];
    var p = [];
    var q = [];
    var r = [];
    var s = [];
    var t = [];
    var u = [];
    var v = [];
    var w = [];
    var x = [];
    var y = [];
    var z = [];
    var other = [];
    count = data.length;
    if (data.length > 0) {
      for (var ta = 0; ta < data.length; ta++) {

        firstalphabet = data[ta].pack;
        if (firstalphabet == 'a') {
          a.push(data[ta]);
        } else if (firstalphabet == 'b') {
          b.push(data[ta]);
        }
        else if (firstalphabet == 'c') {
          c.push(data[ta]);
        } else if (firstalphabet == 'd') {
          d.push(data[ta]);
        }
        else if (firstalphabet == 'e') {
          e.push(data[ta]);
        } else if (firstalphabet == 'f') {
          f.push(data[ta]);
        }
        else if (firstalphabet == 'g') {
          g.push(data[ta]);
        } else if (firstalphabet == 'h') {
          h.push(data[ta]);
        }
        else if (firstalphabet == 'i') {
          i.push(data[ta]);
        } else if (firstalphabet == 'j') {
          j.push(data[ta]);
        }
        else if (firstalphabet == 'k') {
          k.push(data[ta]);
        } else if (firstalphabet == 'l') {
          l.push(data[ta]);
        }
        else if (firstalphabet == 'm') {
          m.push(data[ta]);
        } else if (firstalphabet == 'n') {
          n.push(data[ta]);
        }
        else if (firstalphabet == 'o') {
          o.push(data[ta]);
        } else if (firstalphabet == 'p') {
          p.push(data[ta]);
        } else if (firstalphabet == 'q') {
          q.push(data[ta]);
        }
        else if (firstalphabet == 'r') {
          r.push(data[ta]);
        } else if (firstalphabet == 's') {
          s.push(data[ta]);
        }
        else if (firstalphabet == 't') {
          t.push(data[ta]);
        } else if (firstalphabet == 'u') {
          u.push(data[ta]);
        }
        else if (firstalphabet == 'v') {
          v.push(data[ta]);
        }
        else if (firstalphabet == 'w') {
          w.push(data[ta]);
        } else if (firstalphabet == 'x') {
          x.push(data[ta]);
        }
        else if (firstalphabet == 'y') {
          y.push(data[ta]);
        } else if (firstalphabet == 'z') {
          z.push(data[ta]);
        } else {
          other.push(data[ta]);
        }

        if (ta + 1 == data.length) {
          console.log(data.length);
          res.send({ brands: data, count: count, a: a, b: b, c: c, d: d, e: e, f: f, g: g, h: h, i: i, j: j, k: k, l: l, m: m, n: n, o: o, p: p, q: q, r: r, s: s, t: t, u: u, v: v, w: w, x: x, y: y, z: z, other: other });

        }

      }

    } else {

      res.send({ brands: data, count: count });

    }

  });
  // });
};

exports.getBrandSearch = function (req, res, next) {
  var searchquery2 = { 'brand': { '$regex': req.body.searching, $options: 'i' } }; // i deal case sensitive issues
  var query_data = BrandProsperent.find(searchquery2).skip(0).limit(100).sort('brand');

  query_data.exec(function (err, data) {
    if (err) { return next(err); }

    res.send({ brands: data });
  });
};

exports.getBrandSearchSpecific = function (req, res, next) {
  var parameter = req.body.searching;
  var searchqueryBrand = { $text: { $search: parameter } };
  var query_data = BrandProsperent.find(searchqueryBrand).sort('brand');

  query_data.exec(function (err, data) {
    if (err) { return next(err); }
    console.log(data);
    res.send({ brands: data });
  });
};

// get brands from cache
exports.getBrandListCache = function (req, res, next) {
  ssCache.get('brandKey', function (err, data) {
    if (err) { return next(err); }

    if (data === undefined) {
      var query_data = BrandProsperent.find({}).sort('brand');

      query_data.exec(function (err, data) {
        if (err) { return next(err); }
        console.log(data);
        res.send({ 'brands': data, 'count': data.length });

        var arrObj = [];
        var bid = 0;

        arrObj.push({ 'bid': bid, 'brand': data[bid] });  // make an array for caching
        bid += 1;

        var obj = { brandlist: arrObj };

        ssCache.set('brandKey', obj, function (err, success) {
          if (err) { return next(err); }

          console.log(success);
        });
      }); // query end
    } else {
      res.send({ brands: data, count: data.length });
    }
  }); // sscache get end
}; // post end

exports.brandDeleteAll = function (req, res, next) {
  BrandProsperent.remove({}, function (err) {
    if (err) { return next(err); }

    res.send('success');
  });
};

exports.brandDeleteSpecific = function (req, res, next) {

   // var brandId =req.body._id;
   // console.log(brandName);
  var brandId = new ObjId(req.body._id);

  BrandProsperent.remove({ _id: brandId }, function (err) {
    if (err) { return next(err); }
    console.log('success');
    res.send('success');
  });
};

exports.brandUpdate = function (req, res, next) {

   // var brandId =req.body._id;
   // console.log(brandName);
  var brandId = new ObjId(req.body._id);

  BrandProsperent.update({ _id: brandId }, { $set: { brand: req.body.brand } })
  .exec(function (err, results) {
    if (err || results < 1) {
      res.json(404, { msg: 'Failed to update brand.' });
      console.log('brand err' + err + ' ' + results);

      return next(err);
    } else {
      res.send('success');
      console.log('brand updated' + results);
    }
  });

};


exports.getAllBrandFromText = function (req, res, next) {
  var bulk = BrandProsperent.collection.initializeOrderedBulkOp();
  var pathOfText = 'resourcefiles/' + req.body.path;
  console.log(pathOfText);
  var rl = readline.createInterface({
    input: fs.createReadStream(pathOfText)
  });
  var arrObj = [];
  var bid = 0;

  rl.on('line', function (line) {
   // console.log('Line from file:', line);
    bulk.insert({ 'brand': line });
    arrObj.push({ 'bid': bid, 'brand': line });  // make an array for caching
    bid += 1;
  }).on('close', function () {
    var obj = { brandlist: arrObj };

    ssCache.set('brandKey', obj, function (err, success) {
      if (err) { return next(err); }

      console.log(success);
    });
    bulk.execute(function (err) {
      if (err) { return next(err); }

      res.send('success');
    });
  });
};

exports.syncBrandsAdd = function (req, res, next) {
  var d = new Date();
  var dd = d.getDate();
  var mm = d.getMonth() + 1; // January is 0!

  if (dd < 10) {   // date less than 10 add 0 at front
    dd = '0' + dd;
  }

  if (mm < 10) {   // month less than 10 add 0 at front
    mm = '0' + mm;
  }

  var bulk = BrandProsperent.collection.initializeOrderedBulkOp();
  var totalRecordsFound;
  var lmt = 3000;
  var pg;
  // first retrieve number of records
  var url = 'http://api.prosperent.com/api/brand?api_key=0da1ade1627ce72127d551d52d5b55e7&limit=1&sortBy=brand+asc&page=1';

  request({
    url: url,
    method: 'GET'
  }, function (err, reponse, body) {
    var parsedBody = JSON.parse(body);
    var numberOfPg = parseInt(pg, 10);
    var numberModulus = (parseInt(totalRecordsFound, 10) % lmt);

    totalRecordsFound = parsedBody.totalRecordsFound;
    pg = totalRecordsFound / lmt;

    if (numberModulus > 0) {
      numberOfPg += 1;
    }

    var cpage = 0; // current page
    var url;

    async.waterfall([
      function (callback) {

        console.log(numberOfPg);
        callback(null, numberOfPg);

      },

      function (numberOfPg, callback) {
        cpage = 1;

        if (cpage <= numberOfPg) {
          var urlx = 'http://api.prosperent.com/api/brand?=0da1ade1627ce72127d551d52d5b55e7&sortBy=brand+asc&limit=' + lmt + '&page=1';

          request({
            url: urlx,
            method: 'GET'
          }, function (err, reponse, body) {

            var parsedBody = JSON.parse(body);

            if (err) { return next(err); }

            for (var i = 0; i < parsedBody.data.length; i += 1) {
              bulk.insert(parsedBody.data[i]);
            }

            var arrJson = parsedBody.data;

            callback(null, bulk, numberOfPg, arrJson);
          });
        }
      },

      function (bulk, numberOfPg, arrJson, callback) {
        if (cpage <= numberOfPg) {
          url = 'http://api.prosperent.com/api/brand?api_key=0da1ade1627ce72127d551d52d5b55e7&sortBy=brand+desc&limit=' + lmt + '&page=' + cpage;
          request({
            url: url,
            method: 'GET'
          }, function (err, response, body) {
            var m = 0;
            var parsedBody = JSON.parse(body);

            for (m = 0; m < parsedBody.data.length; m += 1) {
              bulk.insert(parsedBody.data[m]);
            }

            arrJson.concat(parsedBody.data);

            bulk.execute(function (err, result) {
              if (err) { return next(err); }

              console.log(result);
              callback(null, 'done');

            });
          });
        }
      }
    ], function (err) {
      if (err) { return next(err); }

      console.log('success');
    });// waterfall end
  }); // request end that get the file length
};
