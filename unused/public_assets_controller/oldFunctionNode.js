exports.groupByCategory = function (req, res, next) {
  Product.aggregate(
    [{
      $group: {
        _id: { category: '$category' },
        count: { $sum: 1 }
      }
    }], function (err, result) {
    if (err) { return next(err); }

    res.send(result);
  });
};

exports.groupbyCategory2 = function (req, res, next) {
  Product.aggregate(
    [{
      $group: {
        _id: { category: '$category' },
        merchant: { $push: '$merchant' },
        // merchantId:{$push :"$merchantId"},
        count: { $sum: 1 }
      }
    }], function (err, result) {
    if (err) { return next(err); }

    res.send(result);
  });
};

exports.groupbyBrand = function (req, res, next) {
  Product.aggregate(
    [{
      $group: {
        _id: { brand: '$brand' },
        count: { $sum: 1 }
      }
    }], function (err, result) {
    if (err) { return next(err); }

    res.send(result);
  });
};


 // Following is old library
    // // (function(d){
    // // // load the Facebook javascript SDK
    // // var js,
    // // id = 'facebook-jssdk',
    // // ref = d.getElementsByTagName('script')[0];
    // // if (d.getElementById(id)) {
    // // return;
    // // }
    // // js = d.createElement('script');
    // // js.id = id;
    // // js.async = true;
    // // js.src = "//connect.facebook.net/en_US/all.js";
    // // ref.parentNode.insertBefore(js, ref);
    // // }(document));
    // // Get login status

    // //	https://developers.facebook.com/docs/javascript/howto/angularjs
    // // scope to improve
	
	
// get distinct stores from system
exports.distinctstores = function (req, res, next) {
  // distinct('merchant');
  Product
    .find({}, { merchant: 1, merchantId: 1 }, { 'group': 'merchantId' })
    .exec(function (err, data) {   // run query to find data result
      if (err) { return next(err); }
      res.send(data);

    });
};	