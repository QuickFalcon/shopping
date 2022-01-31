'use strict';

var config = require(process.cwd() + '/config'),
    prosperent = require(process.cwd() + '/server/lib/prosperent'),
    mongoose = require('mongoose'),
    objectId = mongoose.Types.ObjectId,
    Like = mongoose.model('Like'),
    Mail = mongoose.model('Mail'),
    Rate = mongoose.model('Rate'),
    // ProductProsperent = mongoose.model('ProductProsperent'),
    SocialPhoto = mongoose.model('SocialPhoto'),
    ProductProsperent = mongoose.model('ss_tap_Product'),
    ProductProsperentTwo = mongoose.model('ss_Productq'), // this is for cj
    CategoryProsperentSync = mongoose.model('CategoryProsperentSync'),
    async = require('async'),
    cheerio = require('cheerio'), // for html parsing loading
    fr = require('follow-redirects').http, // follow redirect
    request = require('request'),
    namer = require('color-namer'),
    fs = require('fs'),
    TimSort = require('timsort'),
    ObjId = require('mongoose').Types.ObjectId,
    sortJson = require('sort-json'),
    lowerCase = require('lower-case'),
    BrandProsperent = mongoose.model('BrandProsperent'),
    os = require('os');

    // getting color name from color code
//categories_arr.0

exports.productResult = function (req, res, next) {
  // var selected_str=req.params.search;
  var searchquery = {},
      recordsess = req.session,
      sortingorder;
  var colboolean = false;
    var colarr;
  var occ = '';
  var searchkey;
  var skey;
  if (req.body.keyword) {
    searchkey = req.body.keyword;
    skey = searchkey.replace(/-/g, ' ');  // replace '-' from search query otherwise keyword ignored

    searchquery = {
      $text: { $search: skey }   // pass text search query
    };
  }

  var catalogid_list;
 // for collective page
  if (req.body.collective) { // when click new arrival it will check last 7 days products
    if (req.body.collective == 'all') {

      if (req.body.keyword) {

        searchquery = {
          $text: { $search: skey },
          $or: [{ shareCount: { $gte: 1 } }, { ratedByUser: { $gte: 1 } }, { likeCount: { $gte: 1 } }]
        };
      } else
        searchquery = { $or: [{ shareCount: { $gte: 1 } }, { ratedByUser: { $gte: 1 } }, { likeCount: { $gte: 1 } }] };

    }

    else if (req.body.collective == 'mostrated') {
      searchquery.rateAvg = { $gte: 6 };

    }
    else if (req.body.collective == 'mostreviewed') {
      searchquery.ratedByUser = { $gte: 1 };

    }
    else if (req.body.collective == 'mostshared') {
      searchquery.shareCount = { $gte: 1 };

    }
    else if (req.body.collective == 'topten') {
      if (req.body.keyword && skey) {

        searchquery = {
          $text: { $search: skey },
          $or: [{ shareCount: { $gte: 1 } }, { ratedByUser: { $gte: 1 } }, { likeCount: { $gte: 1 } }]
        };
      }
      else
        searchquery = { $or: [{ shareCount: { $gte: 1 } }, { ratedByUser: { $gte: 1 } }, { likeCount: { $gte: 1 } }] };
    }
    else if (req.body.collective == 'myfav') {
      catalogid_list = req.body.multiId;
      searchquery.catalogId = { $in: catalogid_list };

    }
    else if (req.body.collective == 'myreview') {
      catalogid_list = req.body.multiId;
      searchquery.catalogId = { $in: catalogid_list };

    }

  }

  /*
  if (req.body.menuCategory) {

    var reqVar = req.body.menuCategory;
    var reqVar2 = new RegExp(reqVar, 'i');

    searchquery.category = reqVar2; // i deal case sensitive issues

  } */
  
  /*IF USER CHOOSE MERCHANT FROM MERCHANT LIST*/
  if (req.body.merchantList) {

    if (req.body.merchantList.length > 0) {
      searchquery.merchant = { $in: req.body.merchantList };
    }
  }
/*
  if (req.body.male && req.body.female) {
    searchquery.gender = { $in: [1, 2] };

  }
  else if (req.body.male) {

    searchquery.gender = 1;

  }
  else if (req.body.female) {

    searchquery.gender = 2;

  }
  */
  // search by brand list
/*
  if (req.body.brandList) {

    if (req.body.brandList.length > 0) {
      var brd = req.body.brandList;
      var brarr = [];
      for (var k = 0; k < req.body.brandList.length; k += 1) {
        // brarr[k] = new RegExp(brd[k], 'i');

        brarr[k] = new RegExp(['^', brd[k], '$'].join(''), 'i');
      }

      searchquery.brand = { $in: brarr };
    }

  }
  */
  
/* category list id was for mapping */ 
  if (req.body.brandList) {

    if (req.body.brandList.length > 0) {
      var brd = req.body.brandList;
      var brarr = [];
      for (var k = 0; k < req.body.brandList.length; k += 1) {
        // brarr[k] = new RegExp(brd[k], 'i');

        brarr[k] = new RegExp(brd[k],'i');
      }

      searchquery.brand = { $in: brarr };
    }

  }
  // following should be selected categories not mapped or getting from search string 
  /* 
  if (req.body.categoryList) {

    if (req.body.categoryList.length > 0) {
      
	  
	  var cat = req.body.categoryList;
      
	  var myarr = [];
      var j = 0;

      for (j = 0; j < cat.length; j += 1) {
        myarr[j] = new RegExp(cat[j], 'i');
      }
	  
	  
	  
      searchquery.all_categories = { $in: myarr }; // this is or logic
    }

  }
  */
  


  if (req.body.color) {
    if (req.body.color.length > 0) {
      colarr = req.body.color;
      var colarrCaseInsensetive = [];
      for (var p = 0; p < colarr.length; p += 1) {
        colarrCaseInsensetive[p] = new RegExp(colarr[p], 'i');
        // colarrCaseInsensetive[p] = colarr[p].toLowerCase();

      }
      searchquery.color = { $in: colarrCaseInsensetive };
      colboolean = true;

    }

  }

  if (req.body.sale_offer) {
    searchquery.price_sale = { $ne: -1.0 };
  }

  // //// occassion gola or hotey parey////////////////////
  if (req.body.occasion_casual) {
    occ = 'casual';
  }
  if (req.body.occasion_vacation) {

    if (occ !== '') {
      occ = occ + '|holiday';
    } else {
      occ = 'holiday';
    }
  }

  if (req.body.occasion_work) {
    if (occ !== '') {
      occ = occ + '|uniform';
    } else {
      occ = 'uniform';
    }
  }
  if (req.body.occasion_other) {
    if (occ !== '') {
      occ = occ + '|occasion';
    } else {
      occ = 'occasion';
    }

  }

  if (occ !== '') {
    var occVar2 = new RegExp(occ, 'i');
    searchquery.title = occVar2; // it will search those field inside title
  }
  // /////////////////////////////////////////////////////

  if (req.body.min_price) {
    if (req.body.max_price) {
      searchquery.current_price = { $gte: req.body.min_price, $lte: req.body.max_price };
    } else { // mean only min price set
      searchquery.current_price = { $gte: req.body.min_price };
    }
  } else if (req.body.max_price) { // only max price set
    searchquery.current_price = { $lte: req.body.max_price };
  }

  if (req.body.available) {
    searchquery.available = true;

  }

  if (req.body.select_new_arrival) { // when click new arrival it will check last 7 days products
    var calculate_current_time = Math.floor(new Date() / 1000);
    var calculate_7_days = 7 * 86400; // calculate 7 days, 1 day= 86400
    var consider_time = calculate_current_time - calculate_7_days;

    searchquery.crossed_at = { $gte: consider_time };
  }

  if (req.body.catalogId) {
    searchquery.catalogId = req.body.catalogId;

  }

  if (req.body.productId) {
    searchquery.productId = req.body.productId;

  }

  sortingorder = 'price';
  if (req.body.sortorder === 0) {
    sortingorder = '-likeCount';
  } else if (req.body.sortorder === 1) {
 //   sortingorder =  { price_sale:1, price: 1 }
    sortingorder = 'current_price'; // descending high to low

  } else if (req.body.sortorder === 2) {
   // sortingorder =  { price_sale:-1, price: -1 }

    sortingorder = '-current_price'; // descending high to low
  } else if (req.body.sortorder === 3) {
    sortingorder = '-downloadedAt'; // high to low
  } else if (req.body.sortorder === 4) {
    sortingorder = '-rateAvg'; // high to low
  } else if (req.body.sortorder === 5) {
    sortingorder = '-shareCount'; // high to low
  } else if (req.body.sortorder === 6) {
    sortingorder = '-popularPoint'; // high to low
  } else if (req.body.sortorder === 7) {
    sortingorder = '-purchaseCount'; // high to low
  } else if (req.body.sortorder === 8) {
    sortingorder = '-percentOff'; // descending
  } else if (req.body.sortorder === 9) {

    sortingorder = { score: { $meta: 'textScore' } };
  } else if (req.body.sortorder === 10) {

    sortingorder = '-ratedByUser'; // descending
  }

  var offset = req.body.offset;
  var start = offset * req.body.start;
  var lquery;
  console.log(searchquery);

  if (req.body.collective) {
    lquery = ProductProsperent
		.find(searchquery,
		{ score: { $meta: 'textScore' } })
		.populate('photos', 'catalogId photo primary')
		.skip(start)
		.limit(offset)
		 .sort(sortingorder)
		 .select({
   _id: 1,
   catalogId: 1,
   productId: 1,
   keyword: 1,
   category: 1,
   brand: 1,
   merchant: 1,
   price: 1,
   price_sale: 1,
   current_price: 1,
   image_url: 1,
   twoTapProductUrl: 1,
   twoTapAffiliateLink: 1,
   totalRate: 1,
   ratedByUser: 1,
   rateAvg: 1,
   likeCount: 1,
   shareCount: 1,
   purchaseCount: 1,
   reviewCount: 1,
   popularPoint: 1,
   color: 1,
   color_images: 1,
   site_id: 1,
   all_categories: 1
 });
  } else {

    lquery = ProductProsperent
		.find(searchquery,
		{ score: { $meta: 'textScore' } })
		.skip(start)
		.limit(offset)
		 .sort(sortingorder)
		 .select({
   _id: 1,
   catalogId: 1,
   productId: 1,
   keyword: 1,
   category: 1,
   brand: 1,
   merchant: 1,
   price: 1,
   price_sale: 1,
   current_price: 1,
   image_url: 1,
   twoTapProductUrl: 1,
   twoTapAffiliateLink: 1,
   totalRate: 1,
   ratedByUser: 1,
   rateAvg: 1,
   likeCount: 1,
   shareCount: 1,
   purchaseCount: 1,
   reviewCount: 1,
   popularPoint: 1,
   color: 1,
   color_images: 1,
   site_id: 1,
   all_categories: 1
 });

  }

 console.log("query begin for search product");

  lquery.exec(function (err, data) {   // run query to find data result
    if (err) {
      console.log(err);
      res.end();

      return next(err);
    }
    
     console.log("query end result ready");

    res.json({ product: data, count: 0 });

  });

};


// exports.productResult = function (req, res, next) {
  // // var selected_str=req.params.search;
  // var searchquery = {},
      // recordsess = req.session,
      // sortingorder;
  // var colboolean = false;
    // var colarr;
  // var occ = '';
  // var searchkey;
  // var skey;
  // if (req.body.keyword) {
    // searchkey = req.body.keyword;
    // skey = searchkey.replace(/-/g, ' ');  // replace '-' from search query otherwise keyword ignored

    // searchquery = {
      // $text: { $search: skey }   // pass text search query
    // };
  // }

  // var catalogid_list;

  // if (req.body.collective) { // when click new arrival it will check last 7 days products
    // if (req.body.collective == 'all') {

      // if (req.body.keyword) {

        // searchquery = {
          // $text: { $search: skey },
          // $or: [{ shareCount: { $gte: 1 } }, { ratedByUser: { $gte: 1 } }, { likeCount: { $gte: 1 } }]
        // };
      // } else
        // searchquery = { $or: [{ shareCount: { $gte: 1 } }, { ratedByUser: { $gte: 1 } }, { likeCount: { $gte: 1 } }] };

    // }

    // else if (req.body.collective == 'mostrated') {
      // searchquery.rateAvg = { $gte: 6 };

    // }
    // else if (req.body.collective == 'mostreviewed') {
      // searchquery.ratedByUser = { $gte: 1 };

    // }
    // else if (req.body.collective == 'mostshared') {
      // searchquery.shareCount = { $gte: 1 };

    // }
    // else if (req.body.collective == 'topten') {
      // if (req.body.keyword && skey) {

        // searchquery = {
          // $text: { $search: skey },
          // $or: [{ shareCount: { $gte: 1 } }, { ratedByUser: { $gte: 1 } }, { likeCount: { $gte: 1 } }]
        // };
      // }
      // else
        // searchquery = { $or: [{ shareCount: { $gte: 1 } }, { ratedByUser: { $gte: 1 } }, { likeCount: { $gte: 1 } }] };
    // }
    // else if (req.body.collective == 'myfav') {
      // catalogid_list = req.body.multiId;
      // searchquery.catalogId = { $in: catalogid_list };

    // }
    // else if (req.body.collective == 'myreview') {
      // catalogid_list = req.body.multiId;
      // searchquery.catalogId = { $in: catalogid_list };

    // }

  // }

  // if (req.body.menuCategory) {

    // var reqVar = req.body.menuCategory;
    // var reqVar2 = new RegExp(reqVar, 'i');

    // // searchquery = { category: { $regex : /'+reqVar+'/, $options: 'i' } }; // i deal case sensitive issues
    // searchquery.category = reqVar2; // i deal case sensitive issues

  // }
  // if (req.body.merchantList) {

    // if (req.body.merchantList.length > 0) {
      // searchquery.merchant = { $in: req.body.merchantList };
    // }
  // }

  // if (req.body.male && req.body.female) {
    // searchquery.gender = { $in: [1, 2] };

  // }
  // else if (req.body.male) {

    // searchquery.gender = 1;

  // }
  // else if (req.body.female) {

    // searchquery.gender = 2;

  // }

  // // search by brand list

  // if (req.body.brandList) {

    // if (req.body.brandList.length > 0) {
      // var brd = req.body.brandList;
      // var brarr = [];
      // for (var k = 0; k < req.body.brandList.length; k += 1) {
        // // brarr[k] = new RegExp(brd[k], 'i');

        // brarr[k] = new RegExp(['^', brd[k], '$'].join(''), 'i');
      // }

      // searchquery.brand = { $in: brarr };
    // }

  // }

  // if (req.body.categoryList && req.body.categoryListId) {

    // if (req.body.categoryList.length > 0) {
      // var cat = req.body.categoryList;
      // var myarr = [];
      // var j = 0;

      // for (j = 0; j < cat.length; j += 1) {
        // myarr[j] = new RegExp(cat[j], 'i');
      // }

    // }

    // if (req.body.categoryListId.length > 0) {
      // var catArr = req.body.categoryListId;
    // }
     
    // searchquery.$or =
         // [{ all_categories: { $in: cat } }, { categoryId: { $in: catArr } }];
   


  // }
  // else if (req.body.categoryList) {

    // if (req.body.categoryList.length > 0) {
      
	  
	  // var cat = req.body.categoryList;
      
	  // var myarr = [];
      // var j = 0;

      // for (j = 0; j < cat.length; j += 1) {
        // myarr[j] = new RegExp(cat[j], 'i');
      // }
	  
	  
	  
      // searchquery.all_categories = { $in: myarr }; // this is or logic
    // }

  // }

  // else if (req.body.categoryListId) {

    // if (req.body.categoryListId.length > 0) {
      // var catArr = req.body.categoryListId;
      // searchquery.categoryId = { $in: catArr };
    // }

  // }


  // if (req.body.color) {
    // if (req.body.color.length > 0) {
      // colarr = req.body.color;
      // var colarrCaseInsensetive = [];
      // for (var p = 0; p < colarr.length; p += 1) {
        // colarrCaseInsensetive[p] = new RegExp(colarr[p], 'i');
        // // colarrCaseInsensetive[p] = colarr[p].toLowerCase();

      // }
      // searchquery.color = { $in: colarrCaseInsensetive };
      // colboolean = true;

    // }

  // }

  // if (req.body.sale_offer) {
    // searchquery.price_sale = { $ne: -1.0 };
  // }

  // // //// occassion gola or hotey parey////////////////////
  // if (req.body.occasion_casual) {
    // occ = 'casual';
  // }
  // if (req.body.occasion_vacation) {

    // if (occ !== '') {
      // occ = occ + '|holiday';
    // } else {
      // occ = 'holiday';
    // }
  // }

  // if (req.body.occasion_work) {
    // if (occ !== '') {
      // occ = occ + '|uniform';
    // } else {
      // occ = 'uniform';
    // }
  // }
  // if (req.body.occasion_other) {
    // if (occ !== '') {
      // occ = occ + '|occasion';
    // } else {
      // occ = 'occasion';
    // }

  // }

  // if (occ !== '') {
    // var occVar2 = new RegExp(occ, 'i');
    // searchquery.keyword = occVar2; // i deal case sensitive issues
  // }
  // // /////////////////////////////////////////////////////

  // if (req.body.min_price) {
    // if (req.body.max_price) {
      // searchquery.current_price = { $gte: req.body.min_price, $lte: req.body.max_price };
    // } else { // mean only min price set
      // searchquery.current_price = { $gte: req.body.min_price };
    // }
  // } else if (req.body.max_price) { // only max price set
    // searchquery.current_price = { $lte: req.body.max_price };
  // }

  // if (req.body.available) {
    // searchquery.available = true;

  // }

  // if (req.body.select_new_arrival) { // when click new arrival it will check last 7 days products
    // var calculate_current_time = Math.floor(new Date() / 1000);
    // var calculate_7_days = 7 * 86400; // calculate 7 days, 1 day= 86400
    // var consider_time = calculate_current_time - calculate_7_days;

    // searchquery.crossed_at = { $gte: consider_time };
  // }

  // if (req.body.catalogId) {
    // searchquery.catalogId = req.body.catalogId;

  // }

  // if (req.body.productId) {
    // searchquery.productId = req.body.productId;

  // }

  // sortingorder = 'price';
  // if (req.body.sortorder === 0) {
    // sortingorder = '-likeCount';
  // } else if (req.body.sortorder === 1) {
 // //   sortingorder =  { price_sale:1, price: 1 }
    // sortingorder = 'current_price'; // descending high to low

  // } else if (req.body.sortorder === 2) {
   // // sortingorder =  { price_sale:-1, price: -1 }

    // sortingorder = '-current_price'; // descending high to low
  // } else if (req.body.sortorder === 3) {
    // sortingorder = '-downloadedAt'; // high to low
  // } else if (req.body.sortorder === 4) {
    // sortingorder = '-rateAvg'; // high to low
  // } else if (req.body.sortorder === 5) {
    // sortingorder = '-shareCount'; // high to low
  // } else if (req.body.sortorder === 6) {
    // sortingorder = '-popularPoint'; // high to low
  // } else if (req.body.sortorder === 7) {
    // sortingorder = '-purchaseCount'; // high to low
  // } else if (req.body.sortorder === 8) {
    // sortingorder = '-percentOff'; // descending
  // } else if (req.body.sortorder === 9) {

    // sortingorder = { score: { $meta: 'textScore' } };
  // } else if (req.body.sortorder === 10) {

    // sortingorder = '-ratedByUser'; // descending
  // }

  // var offset = req.body.offset;
  // var start = offset * req.body.start;
  // var lquery;
  // console.log(searchquery);

  // if (req.body.collective) {
    // lquery = ProductProsperent
		// .find(searchquery,
		// { score: { $meta: 'textScore' } })
		// .populate('photos', 'catalogId photo primary')
		// .skip(start)
		// .limit(offset)
		 // .sort(sortingorder)
		 // .select({
   // _id: 1,
   // catalogId: 1,
   // productId: 1,
   // keyword: 1,
   // category: 1,
   // brand: 1,
   // merchant: 1,
   // price: 1,
   // price_sale: 1,
   // current_price: 1,
   // image_url: 1,
   // twoTapProductUrl: 1,
   // twoTapAffiliateLink: 1,
   // totalRate: 1,
   // ratedByUser: 1,
   // rateAvg: 1,
   // likeCount: 1,
   // shareCount: 1,
   // purchaseCount: 1,
   // reviewCount: 1,
   // popularPoint: 1,
   // color: 1,
   // color_images: 1,
   // site_id: 1,
   // all_categories: 1
 // });
  // } else {

    // lquery = ProductProsperent
		// .find(searchquery,
		// { score: { $meta: 'textScore' } })
		// .skip(start)
		// .limit(offset)
		 // .sort(sortingorder)
		 // .select({
   // _id: 1,
   // catalogId: 1,
   // productId: 1,
   // keyword: 1,
   // category: 1,
   // brand: 1,
   // merchant: 1,
   // price: 1,
   // price_sale: 1,
   // current_price: 1,
   // image_url: 1,
   // twoTapProductUrl: 1,
   // twoTapAffiliateLink: 1,
   // totalRate: 1,
   // ratedByUser: 1,
   // rateAvg: 1,
   // likeCount: 1,
   // shareCount: 1,
   // purchaseCount: 1,
   // reviewCount: 1,
   // popularPoint: 1,
   // color: 1,
   // color_images: 1,
   // site_id: 1,
   // all_categories: 1
 // });

  // }

  // lquery.exec(function (err, data) {   // run query to find data result
    // if (err) {
      // console.log(err);
      // res.end();

      // return next(err);
    // }
    // res.json({ product: data, count: 0 });

  // });

// };
// this is for commission junction 




exports.productResultCount = function (req, res, next) {
  // var selected_str=req.params.search;
  var searchquery = {},
      recordsess = req.session,
      sortingorder;
  var occ = '';

  if (req.body.keyword) {
    var searchkey = req.body.keyword;
    var skey = searchkey.replace(/-/g, ' ');  // replace '-' from search query otherwise keyword ignored

    searchquery = {
      $text: { $search: skey }   // pass text search query
    };
  }
  var catalogid_list;

  if (req.body.collective) { // when click new arrival it will check last 7 days products
    if (req.body.collective == 'all') {

      if (req.body.keyword) {

        searchquery = {
          $text: { $search: skey },
          $or: [{ shareCount: { $gte: 1 } }, { ratedByUser: { $gte: 1 } }, { likeCount: { $gte: 1 } }]
        };
      } else
	    searchquery = { $or: [{ shareCount: { $gte: 1 } }, { ratedByUser: { $gte: 1 } }, { likeCount: { $gte: 1 } }] };

    }

    else if (req.body.collective == 'mostrated') {
      searchquery.rateAvg = { $gte: 6 };

    }
    else if (req.body.collective == 'mostreviewed') {
      searchquery.ratedByUser = { $gte: 1 };

    }
    else if (req.body.collective == 'mostshared') {
      searchquery.shareCount = { $gte: 1 };

    }
    else if (req.body.collective == 'topten') {
      if (req.body.keyword && skey) {

        searchquery = {
          $text: { $search: skey },
          $or: [{ shareCount: { $gte: 1 } }, { ratedByUser: { $gte: 1 } }, { likeCount: { $gte: 1 } }] };
      }
      else
			searchquery = { $or: [{ shareCount: { $gte: 1 } }, { ratedByUser: { $gte: 1 } }, { likeCount: { $gte: 1 } }] };
    }
    else if (req.body.collective == 'myfav') {
      catalogid_list = req.body.multiId;
      searchquery.catalogId = { $in: catalogid_list };

    }
    else if (req.body.collective == 'myreview') {
      catalogid_list = req.body.multiId;
      searchquery.catalogId = { $in: catalogid_list };

    }

  }
  if (req.body.male && req.body.female) {
    searchquery.gender = { $in: [1, 2] };

  } else if (req.body.male) {

    searchquery.gender = 1;

  } else if (req.body.female) {

    searchquery.gender = 2;

  }

  if (req.body.menuCategory) {

    var reqVar = req.body.menuCategory;
    var reqVar2 = new RegExp(reqVar, 'i');

    // searchquery = { category: { $regex : /'+reqVar+'/, $options: 'i' } }; // i deal case sensitive issues
    searchquery.category = reqVar2; // i deal case sensitive issues

  }
  if (req.body.merchantList) {

    if (req.body.merchantList.length > 0) {
      searchquery.merchant = { $in: req.body.merchantList };
    }
  }

  // search by brand list

  if (req.body.brandList) {

    if (req.body.brandList.length > 0) {
      var brd = req.body.brandList;
      var brarr = [];
      for (var k = 0; k < req.body.brandList.length; k += 1) {
        // brarr[k] = new RegExp(brd[k], 'i');

        brarr[k] = new RegExp(['^', brd[k], '$'].join(''), 'i');

      }
      searchquery.brand = { $in: brarr };
    }

  }

  if (req.body.categoryList && req.body.categoryListId) {

    if (req.body.categoryList.length > 0) {
      var cat = req.body.categoryList;
      var myarr = [];
      var j = 0;

      for (j = 0; j < cat.length; j += 1) {
        myarr[j] = new RegExp(cat[j], 'i');
      }

    }

    if (req.body.categoryListId.length > 0) {
      var catArr = req.body.categoryListId;
    }

    searchquery.$or =
        [{ all_categories: { $in: cat } }, { categoryId: { $in: catArr } }];

  }
  else if (req.body.categoryList) {

    if (req.body.categoryList.length > 0) {
      var cat = req.body.categoryList;
      var myarr = [];
      var j = 0;

      for (j = 0; j < cat.length; j += 1) {
        myarr[j] = new RegExp(cat[j], 'i');
      }
      searchquery.all_categories = { $in: myarr }; // this is or logic
    }

  }

  else if (req.body.categoryListId) {

    if (req.body.categoryListId.length > 0) {
      var catArr = req.body.categoryListId;
      searchquery.categoryId = { $in: catArr };
    }

  }

  if (req.body.color) {
    if (req.body.color.length > 0) {
      var colarr = req.body.color;
      var colarrCaseInsensetive = [];
      for (var p = 0; p < colarr.length; p += 1) {
        colarrCaseInsensetive[p] = new RegExp(colarr[p], 'i');
      }
      searchquery.color = { $in: colarrCaseInsensetive };
    }

  }

  if (req.body.sale_offer) {
    searchquery.price_sale = { $gte: 0 };
  }
  if (req.body.premium) {
    searchquery.premium = req.body.premium;
  }
  // //// occassion gola or hotey parey////////////////////

  if (req.body.occasion_casual) {
    occ = 'casual';
  }
  if (req.body.occasion_vacation) {

    if (occ !== '') {
      occ = occ + '|holiday';
    } else {
      occ = 'holiday';
    }
  }

  if (req.body.occasion_work) {
    if (occ !== '') {
      occ = occ + '|uniform';
    } else {
      occ = 'uniform';
    }
  }
  if (req.body.occasion_other) {
    if (occ !== '') {
      occ = occ + '|occasion';
    } else {
      occ = 'occasion';
    }

  }

  if (occ !== '') {
    var occVar2 = new RegExp(occ, 'i');
    searchquery.keyword = occVar2; // i deal case sensitive issues
  }

  // /////////////////////////////////////////////////////

  if (req.body.min_price) {
    if (req.body.max_price) {
      searchquery.current_price = { $gte: req.body.min_price, $lte: req.body.max_price };
    } else { // mean only min price set
      searchquery.current_price = { $gte: req.body.min_price };
    }
  } else if (req.body.max_price) { // only max price set
    searchquery.current_price = { $lte: req.body.max_price };
  }

  if (req.body.select_new_arrival) { // when click new arrival it will check last 7 days products
    var calculate_current_time = Math.floor(new Date() / 1000);
    var calculate_7_days = 7 * 86400; // calculate 7 days, 1 day= 86400
    var consider_time = calculate_current_time - calculate_7_days;

    searchquery.crossed_at = { $gte: consider_time };
  }

  if (req.body.available) {
    searchquery.available = true;

  }
    

  var query = ProductProsperent.find(searchquery, '_id').count();

  query.exec(function (err, result) {
    
	console.log(result);
	if (!err) {
      res.json({ 'count': result });
    } else {
      res.end();
    }

  });

};

/*
exports.productResult2 = function (req, res, next) {
    // var selected_str=req.params.search;
      var searchquery = {},
      recordsess = req.session,
      sortingorder;
  var colboolean = false;

  var occ = '';
  var searchkey;
  var skey;
  if (req.body.keyword) {
    searchkey = req.body.keyword;
    skey = searchkey.replace(/-/g, ' ');  // replace '-' from search query otherwise keyword ignored

    searchquery = {
      $text: { $search: skey }   // pass text search query
    };
  }

  var catalogid_list;

  if (req.body.collective) { // when click new arrival it will check last 7 days products
    if (req.body.collective == 'all') {

      if (req.body.keyword) {

        searchquery = {
          $text: { $search: skey },
          $or: [{ shareCount: { $gte: 1 } }, { ratedByUser: { $gte: 1 } }, { likeCount: { $gte: 1 } }]
        };
      } else
                searchquery = { $or: [{ shareCount: { $gte: 1 } }, { ratedByUser: { $gte: 1 } }, { likeCount: { $gte: 1 } }] };

    }

    else if (req.body.collective == 'mostrated') {
      searchquery.rateAvg = { $gte: 6 };

    }
    else if (req.body.collective == 'mostreviewed') {
      searchquery.ratedByUser = { $gte: 1 };

    }
    else if (req.body.collective == 'mostshared') {
      searchquery.shareCount = { $gte: 1 };

    }
    else if (req.body.collective == 'topten') {
      if (req.body.keyword && skey) {

        searchquery = {
          $text: { $search: skey },
          $or: [{ shareCount: { $gte: 1 } }, { ratedByUser: { $gte: 1 } }, { likeCount: { $gte: 1 } }]
        };
      }
      else
                searchquery = { $or: [{ shareCount: { $gte: 1 } }, { ratedByUser: { $gte: 1 } }, { likeCount: { $gte: 1 } }] };
    }
    else if (req.body.collective == 'myfav') {
      catalogid_list = req.body.multiId;
      searchquery.catalogId = { $in: catalogid_list };

    }
    else if (req.body.collective == 'myreview') {
      catalogid_list = req.body.multiId;
      searchquery.catalogId = { $in: catalogid_list };

    }

  }

  if (req.body.menuCategory) {

    var reqVar = req.body.menuCategory;
    var reqVar2 = new RegExp(reqVar, 'i');

        // searchquery = { category: { $regex : /'+reqVar+'/, $options: 'i' } }; // i deal case sensitive issues
    searchquery.category = reqVar2; // i deal case sensitive issues

  }
  if (req.body.merchantList) {

    if (req.body.merchantList.length > 0) {
      searchquery.merchant = { $in: req.body.merchantList };
    }
  }

  if (req.body.male && req.body.female) {
    searchquery.gender = { $in: [1, 2] };

  } else if (req.body.male) {

    searchquery.gender = 1;

  } else if (req.body.female) {

    searchquery.gender = 2;

  }

    // search by brand list

  if (req.body.brandList) {

    if (req.body.brandList.length > 0) {
      var brd = req.body.brandList;
      var brarr = [];
      for (var k = 0; k < req.body.brandList.length; k += 1) {
                // brarr[k] = new RegExp(brd[k], 'i');

        brarr[k] = new RegExp(['^', brd[k], '$'].join(''), 'i');
      }

      searchquery.brand = { $in: brarr };
    }

  }

  if (req.body.categoryList && req.body.categoryListId) {

    if (req.body.categoryList.length > 0) {
      var cat = req.body.categoryList;
      var myarr = [];
      var j = 0;

      for (j = 0; j < cat.length; j += 1) {
        myarr[j] = new RegExp(cat[j], 'i');
      }

    }

    if (req.body.categoryListId.length > 0) {
      var catArr = req.body.categoryListId;
    }

    searchquery.$or =
            [{ category: { $in: myarr } }, { categoryId: { $in: catArr } }];
    console.log('printing category');
    console.log(myarr);
    console.log('printing category');

    console.log(catArr);

  }
  else if (req.body.categoryList) {

    if (req.body.categoryList.length > 0) {
      var cat = req.body.categoryList;
      var myarr = [];
      var j = 0;

      for (j = 0; j < cat.length; j += 1) {
        myarr[j] = new RegExp(cat[j], 'i');
      }
      searchquery.category = { $in: myarr }; // this is or logic
    }

  }

  else if (req.body.categoryListId) {

    if (req.body.categoryListId.length > 0) {
      var catArr = req.body.categoryListId;
      searchquery.categoryId = { $in: catArr };
    }

  }

  var colarr;
  if (req.body.color) {
    if (req.body.color.length > 0) {
      colarr = req.body.color;
      var colarrCaseInsensetive = [];
      for (var p = 0; p < colarr.length; p += 1) {
        colarrCaseInsensetive[p] = new RegExp(colarr[p], 'i');
                // colarrCaseInsensetive[p] = colarr[p].toLowerCase();

      }
      searchquery.color = { $in: colarrCaseInsensetive };
      colboolean = true;

    }

  }

  if (req.body.sale_offer) {
    searchquery.price_sale = { $ne: -1.0 };
  }

    // //// occassion gola or hotey parey////////////////////
  if (req.body.occasion_casual) {
    occ = 'casual';
  }
  if (req.body.occasion_vacation) {

    if (occ !== '') {
      occ = occ + '|holiday';
    } else {
      occ = 'holiday';
    }
  }

  if (req.body.occasion_work) {
    if (occ !== '') {
      occ = occ + '|uniform';
    } else {
      occ = 'uniform';
    }
  }
  if (req.body.occasion_other) {
    if (occ !== '') {
      occ = occ + '|occasion';
    } else {
      occ = 'occasion';
    }

  }

  if (occ !== '') {
    var occVar2 = new RegExp(occ, 'i');
    searchquery.keyword = occVar2; // i deal case sensitive issues
  }
    // /////////////////////////////////////////////////////

  if (req.body.min_price) {
    if (req.body.max_price) {
      searchquery.current_price = { $gte: req.body.min_price, $lte: req.body.max_price };
    } else { // mean only min price set
      searchquery.current_price = { $gte: req.body.min_price };
    }
  } else if (req.body.max_price) { // only max price set
    searchquery.current_price = { $lte: req.body.max_price };
  }

 if (req.body.available) {
    searchquery.available = true;

  }

  if (req.body.select_new_arrival) { // when click new arrival it will check last 7 days products
    var calculate_current_time = Math.floor(new Date() / 1000);
    var calculate_7_days = 7 * 86400; // calculate 7 days, 1 day= 86400
    var consider_time = calculate_current_time - calculate_7_days;

    searchquery.crossed_at = { $gte: consider_time };
  }

  if (req.body.catalogId) {
    searchquery.catalogId = req.body.catalogId;

  }

  if (req.body.productId) {
    searchquery.productId = req.body.productId;

  }

  sortingorder = 'price';
  if (req.body.sortorder === 0) {
    sortingorder = '-likeCount';
  } else if (req.body.sortorder === 1) {
        //   sortingorder =  { price_sale:1, price: 1 }
    sortingorder = 'current_price'; // descending high to low

  } else if (req.body.sortorder === 2) {
        // sortingorder =  { price_sale:-1, price: -1 }

    sortingorder = '-current_price'; // descending high to low
  } else if (req.body.sortorder === 3) {
    sortingorder = '-downloadedAt'; // high to low
  } else if (req.body.sortorder === 4) {
    sortingorder = '-rateAvg'; // high to low
  } else if (req.body.sortorder === 5) {
    sortingorder = '-shareCount'; // high to low
  } else if (req.body.sortorder === 6) {
    sortingorder = '-popularPoint'; // high to low
  } else if (req.body.sortorder === 7) {
    sortingorder = '-purchaseCount'; // high to low
  } else if (req.body.sortorder === 8) {
    sortingorder = '-percentOff'; // descending
  } else if (req.body.sortorder === 9) {

      sortingorder = { score: { $meta: 'textScore' } };
    } else if (req.body.sortorder === 10) {

      sortingorder = '-ratedByUser'; // descending
    }

  var offset = req.body.offset;
  var start = offset * req.body.start;
  var lquery;


  if (req.body.collective) {
    lquery = ProductProsperentTwo
            .find(searchquery,
                { score: { $meta: 'textScore' } })
            .populate('photos', 'catalogId photo primary')
            .skip(start)
            .limit(offset)
            .sort(sortingorder)
            .select({
              _id: 1,
              catalogId: 1,
              productId: 1,
              keyword: 1,
              category: 1,
              brand: 1,
              merchant: 1,
              price: 1,
              price_sale: 1,
              current_price: 1,
              image_url: 1,
              twoTapProductUrl: 1,
              twoTapAffiliateLink: 1,
              totalRate: 1,
              ratedByUser: 1,
              rateAvg: 1,
              likeCount: 1,
              shareCount: 1,
              purchaseCount: 1,
              reviewCount: 1,
              popularPoint: 1,
              color: 1,
              color_images: 1,
              site_id: 1,
              all_categories: 1
            });
  } else {

    lquery = ProductProsperentTwo
            .find(searchquery,
                { score: { $meta: 'textScore' } })
            .skip(start)
            .limit(offset)
            .sort(sortingorder)
            .select({
              _id: 1,
              catalogId: 1,
              productId: 1,
              keyword: 1,
              category: 1,
              brand: 1,
              merchant: 1,
              price: 1,
              price_sale: 1,
              current_price: 1,
              image_url: 1,
              twoTapProductUrl: 1,
              twoTapAffiliateLink: 1,
              totalRate: 1,
              ratedByUser: 1,
              rateAvg: 1,
              likeCount: 1,
              shareCount: 1,
              purchaseCount: 1,
              reviewCount: 1,
              popularPoint: 1,
              color: 1,
              color_images: 1,
              site_id: 1,
              all_categories: 1
            });

  }

    console.log(searchquery);
  console.log("searching cj catalog");

  lquery.exec(function (err, data) {   // run query to find data result
    if (err) {
      console.log(err);
      res.end();

      return next(err);
    }

    console.log(data);
    res.json({ product: data, count: 0 });

  });

};


// product count for cj products
exports.productResultCount2 = function (req, res, next) {
    // var selected_str=req.params.search;
  var searchquery = {},
      recordsess = req.session,
      sortingorder;
  var occ = '';

  if (req.body.keyword) {
    var searchkey = req.body.keyword;
    var skey = searchkey.replace(/-/g, ' ');  // replace '-' from search query otherwise keyword ignored

    searchquery = {
      $text: { $search: skey }   // pass text search query
    };
  }
  var catalogid_list;

  if (req.body.collective) { // when click new arrival it will check last 7 days products
    if (req.body.collective == 'all') {

      if (req.body.keyword) {

        searchquery = {
          $text: { $search: skey },
          $or: [{ shareCount: { $gte: 1 } }, { ratedByUser: { $gte: 1 } }, { likeCount: { $gte: 1 } }]
        };
      } else
                searchquery = { $or: [{ shareCount: { $gte: 1 } }, { ratedByUser: { $gte: 1 } }, { likeCount: { $gte: 1 } }] };

    }

    else if (req.body.collective == 'mostrated') {
      searchquery.rateAvg = { $gte: 6 };

    }
    else if (req.body.collective == 'mostreviewed') {
      searchquery.ratedByUser = { $gte: 1 };

    }
    else if (req.body.collective == 'mostshared') {
      searchquery.shareCount = { $gte: 1 };

    }
    else if (req.body.collective == 'topten') {
      if (req.body.keyword && skey) {

        searchquery = {
          $text: { $search: skey },
          $or: [{ shareCount: { $gte: 1 } }, { ratedByUser: { $gte: 1 } }, { likeCount: { $gte: 1 } }] };
      }
      else
                searchquery = { $or: [{ shareCount: { $gte: 1 } }, { ratedByUser: { $gte: 1 } }, { likeCount: { $gte: 1 } }] };
    }
    else if (req.body.collective == 'myfav') {
      catalogid_list = req.body.multiId;
      searchquery.catalogId = { $in: catalogid_list };

    }
    else if (req.body.collective == 'myreview') {
      catalogid_list = req.body.multiId;
      searchquery.catalogId = { $in: catalogid_list };

    }

  }
  if (req.body.male && req.body.female) {
    searchquery.gender = { $in: [1, 2] };

  } else if (req.body.male) {

    searchquery.gender = 1;

  } else if (req.body.female) {

    searchquery.gender = 2;

  }

  if (req.body.menuCategory) {

    var reqVar = req.body.menuCategory;
    var reqVar2 = new RegExp(reqVar, 'i');

        // searchquery = { category: { $regex : /'+reqVar+'/, $options: 'i' } }; // i deal case sensitive issues
    searchquery.category = reqVar2; // i deal case sensitive issues

  }
  if (req.body.merchantList) {

    if (req.body.merchantList.length > 0) {
      searchquery.merchant = { $in: req.body.merchantList };
    }
  }

    // search by brand list

  if (req.body.brandList) {

    if (req.body.brandList.length > 0) {
      var brd = req.body.brandList;
      var brarr = [];
      for (var k = 0; k < req.body.brandList.length; k += 1) {
                // brarr[k] = new RegExp(brd[k], 'i');

        brarr[k] = new RegExp(['^', brd[k], '$'].join(''), 'i');

      }
      searchquery.brand = { $in: brarr };
    }

  }

  if (req.body.categoryList && req.body.categoryListId) {

    if (req.body.categoryList.length > 0) {
      var cat = req.body.categoryList;
      var myarr = [];
      var j = 0;

      for (j = 0; j < cat.length; j += 1) {
        myarr[j] = new RegExp(cat[j], 'i');
      }

    }

    if (req.body.categoryListId.length > 0) {
      var catArr = req.body.categoryListId;
    }

    searchquery.$or =
            [{ category: { $in: myarr } }, { categoryId: { $in: catArr } }];

  }
  else if (req.body.categoryList) {

    if (req.body.categoryList.length > 0) {
      var cat = req.body.categoryList;
      var myarr = [];
      var j = 0;

      for (j = 0; j < cat.length; j += 1) {
        myarr[j] = new RegExp(cat[j], 'i');
      }
      searchquery.category = { $in: myarr }; // this is or logic
    }

  }

  else if (req.body.categoryListId) {

    if (req.body.categoryListId.length > 0) {
      var catArr = req.body.categoryListId;
      searchquery.categoryId = { $in: catArr };
    }

  }

  if (req.body.color) {
    if (req.body.color.length > 0) {
      var colarr = req.body.color;
      var colarrCaseInsensetive = [];
      for (var p = 0; p < colarr.length; p += 1) {
        colarrCaseInsensetive[p] = new RegExp(colarr[p], 'i');
      }
      searchquery.color = { $in: colarrCaseInsensetive };
    }

  }

  if (req.body.sale_offer) {
    searchquery.price_sale = { $gte: 0 };
  }
  if (req.body.premium) {
    searchquery.premium = req.body.premium;
  }
    // //// occassion gola or hotey parey////////////////////

  if (req.body.occasion_casual) {
    occ = 'casual';
  }
  if (req.body.occasion_vacation) {

    if (occ !== '') {
      occ = occ + '|holiday';
    } else {
      occ = 'holiday';
    }
  }

  if (req.body.occasion_work) {
    if (occ !== '') {
      occ = occ + '|uniform';
    } else {
      occ = 'uniform';
    }
  }
  if (req.body.occasion_other) {
    if (occ !== '') {
      occ = occ + '|occasion';
    } else {
      occ = 'occasion';
    }

  }

  if (occ !== '') {
    var occVar2 = new RegExp(occ, 'i');
    searchquery.keyword = occVar2; // i deal case sensitive issues
  }

    // /////////////////////////////////////////////////////

  if (req.body.min_price) {
    if (req.body.max_price) {
      searchquery.current_price = { $gte: req.body.min_price, $lte: req.body.max_price };
    } else { // mean only min price set
      searchquery.current_price = { $gte: req.body.min_price };
    }
  } else if (req.body.max_price) { // only max price set
    searchquery.current_price = { $lte: req.body.max_price };
  }

  if (req.body.select_new_arrival) { // when click new arrival it will check last 7 days products
    var calculate_current_time = Math.floor(new Date() / 1000);
    var calculate_7_days = 7 * 86400; // calculate 7 days, 1 day= 86400
    var consider_time = calculate_current_time - calculate_7_days;

    searchquery.crossed_at = { $gte: consider_time };
  }

  if (req.body.available) {
    searchquery.available = true;

  }
  var query = ProductProsperentTwo.find(searchquery, '_id').count();

  query.exec(function (err, result) {
    if (!err) {
      res.json({ 'count': result });
    } else {
      res.end();
    }

  });

};

exports.productResultCJByCatalogId = function (req, res, next) {
  // var selected_str=req.params.search;
  var searchquery = {},
      recordsess = req.session,
      sortingorder;

  var occ = '';
  if (req.body.catalogId) {
    searchquery.catalogId = req.body.catalogId;

  }

  var lquery = ProductProsperentTwo
      .find(searchquery);

  lquery.exec(function (err, data) {   // run query to find data result
    if (err) {
      console.log(err);

      return next(err);
    }
    res.json({ product: data });

  });

};

*/

// searching multiple products using multiple catalog id 

exports.productUserMulticatalogID = function (req, res) {

  var searchquery = {};

  var catalogid_list = req.body.mid;
  searchquery.catalogId = { $in: catalogid_list };

  var offset = 100;
  var start = 0;
  var lquery;

  lquery = ProductProsperent
    .find(searchquery)
    .skip(start)
    .limit(offset)
    // .sort(sortingorder)
     .select({
       _id: 1,
       catalogId: 1,
       productId: 1,
       keyword: 1,
       category: 1,
       brand: 1,
       merchant: 1,
       price: 1,
       price_sale: 1,
       current_price: 1,
       image_url: 1,
       twoTapProductUrl: 1,
       twoTapAffiliateLink: 1,
       totalRate: 1,
       ratedByUser: 1,
       rateAvg: 1,
       likeCount: 1,
       shareCount: 1,
       purchaseCount: 1,
       reviewCount: 1,
       color: 1,
       color_images: 1,
       site_id: 1
     });
  lquery.exec(function (err, data) {   // run query to find data result
    if (err) {
      console.log(err);
      res.end();

      return next(err);
    }
    res.json({ product: data });

  });

};
exports.productResultByCatalogId = function (req, res, next) {
  // var selected_str=req.params.search;
  var searchquery = {},
      recordsess = req.session,
      sortingorder;

  var occ = '';
  if (req.body.catalogId) {
    searchquery.catalogId = req.body.catalogId;

  }

  var lquery = ProductProsperent
    .find(searchquery);

  lquery.exec(function (err, data) {   // run query to find data result
    if (err) {
      console.log(err);

      return next(err);
    }
    res.json({ product: data });

  });

};




exports.ProductProsperentSocialUpdate = function (req, res, next) {
  var cid = req.body.catalogId;
  var update_fields = req.body.socialFields;

  ProductProsperent.update({ catalogId: cid },
  { $set: update_fields },
  { new: true })
    .exec(function (err, results) {
      if (err || results < 1) {
        res.end();
        console.log('product update err' + err + ' ' + results);
      } else {
        res.send('success');
      }
    });

};

exports.ProductProsperentUpdate = function (req, res, next) {
  var cid = req.body.catalogId;
  var update_fields = { available: req.body.available, last_checked: new Date() };
  if (req.body.price) {
    update_fields.price = req.body.price;

  }
  if (req.body.price_sale) {
    update_fields.price_sale = req.body.price_sale;
  }
  if (req.body.current_price) {
    update_fields.current_price = req.body.current_price;
  }

  ProductProsperent.update({ catalogId: cid },
  { $set: update_fields },
  { new: true })
    .exec(function (err, results) {
      if (err || results < 1) {
        res.end();
        console.log('product update err' + err + ' ' + results);
      } else {
        res.send('success');
      }
    });

};
exports.productSuggestion = function (req, res, next) {
  // var selected_str=req.params.search;
  var searchquery = {},
      sortingorder;

  if (req.body.keyword) {

    var reqVar = req.body.keyword;
    var reqVar2 = new RegExp(reqVar, 'i');

    searchquery.keyword = reqVar2; // i deal case sensitive issues

  }

  if (req.body.available) {
    searchquery.available = true;
  }
  if (req.body.sortorder === 10) {
    sortingorder = 'keyword'; // high to low
  } else if (req.body.sortorder === 0) {
    sortingorder = '-likeCount';
  } else if (req.body.sortorder === 4) {
    sortingorder = '-rateAvg'; // high to low
  } else if (req.body.sortorder === 5) {
    sortingorder = '-shareCount'; // high to low
  } else if (req.body.sortorder === 6) {
    sortingorder = '-popularPoint'; // high to low
  } else {

    sortingorder = { score: { $meta: 'textScore' } };
  }

  var offset = req.body.offset;
  var start = offset * req.body.start;
  var lquery = ProductProsperent
    .find(searchquery)
    .skip(start)
    .limit(offset)
     .sort(sortingorder)
     .select({
       keyword: 1

     }); // define query to find data result

  lquery.exec(function (err, data) {   // run query to find data result
    if (err) {
      console.log(err);
      res.end();

      return next(err);
    }
    async.waterfall([
      function(callback) {
        var ty = [];
        for (var t = 0; t < data.length; t += 1) {
          ty.push(data[t].keyword);
        }
        callback(null, ty);
      }
    ], function (err, result) {
      res.send(result);

    });
  });
};


//product search group by brand
exports.productResultGroupBrand = function (req, res, next) {

  // res.end();
  // return;
  // var selected_str=req.params.search;
  var searchquery = {},
      recordsess = req.session,
      sortingorder;
  var occ = '';

  if (req.body.keyword) {
    var searchkey = req.body.keyword;
    var skey = searchkey.replace(/-/g, ' ');  // replace '-' from search query otherwise keyword ignored

    searchquery = {
      $text: { $search: skey }   // pass text search query
    };
  }

  if (req.body.male && req.body.female) {
    searchquery.gender = { $in: [1, 2] };

  } else if (req.body.male) {

    searchquery.gender = 1;

  } else if (req.body.female) {

    searchquery.gender = 2;

  }

  if (req.body.menuCategory) {

    var reqVar = req.body.menuCategory;
    var reqVar2 = new RegExp(reqVar, 'i');

    // searchquery = { category: { $regex : /'+reqVar+'/, $options: 'i' } }; // i deal case sensitive issues
    searchquery.category = reqVar2; // i deal case sensitive issues

  }

  // search by merchant list
  if (req.body.merchantList) {

    if (req.body.merchantList.length > 0) {
      searchquery.merchant = { $in: req.body.merchantList };
    }
  }

  // search by brand list

  if (req.body.brandList) {

    if (req.body.brandList.length > 0) {
      var brd = req.body.brandList;
      var brarr = [];
      for (var k = 0; k < req.body.brandList.length; k += 1) {
        brarr[k] = new RegExp(brd[k], 'i');
      }
      searchquery.brand = { $in: brarr };
    }

  }

  if (req.body.categoryList && req.body.categoryListId) {

    if (req.body.categoryList.length > 0) {
      var cat = req.body.categoryList;
      var myarr = [];
      var j = 0;

      for (j = 0; j < cat.length; j += 1) {
        myarr[j] = new RegExp(cat[j], 'i');
      }

    }

    if (req.body.categoryListId.length > 0) {
      var catArr = req.body.categoryListId;
    }

    searchquery.$or =
        [{ category: { $in: myarr } }, { categoryId: { $in: catArr } }];

  }
  else if (req.body.categoryList) {

    if (req.body.categoryList.length > 0) {
      var cat = req.body.categoryList;
      var myarr = [];
      var j = 0;

      for (j = 0; j < cat.length; j += 1) {
        myarr[j] = new RegExp(cat[j], 'i');
      }
      searchquery.category = { $in: myarr }; // this is or logic
    }

  }

  else if (req.body.categoryListId) {

    if (req.body.categoryListId.length > 0) {
      var catArr = req.body.categoryListId;
      searchquery.categoryId = { $in: catArr };
    }

  }

  if (req.body.color) {
    if (req.body.color.length > 0) {
      var colarr = req.body.color;
      var colarrCaseInsensetive = [];
      for (var p = 0; p < colarr.length; p += 1) {
        colarrCaseInsensetive[p] = new RegExp(colarr[p], 'i');
      }
      searchquery.color = { $in: colarrCaseInsensetive };
    }

  }

  if (req.body.sale_offer) {
    searchquery.price_sale = { $gte: 0 };
  }

  // //// occassion gola or hotey parey////////////////////

  if (req.body.occasion_casual) {
    occ = 'casual';
  }
  if (req.body.occasion_vacation) {

    if (occ !== '') {
      occ = occ + '|holiday';
    } else {
      occ = 'holiday';
    }
  }

  if (req.body.occasion_work) {
    if (occ !== '') {
      occ = occ + '|uniform';
    } else {
      occ = 'uniform';
    }
  }
  if (req.body.occasion_other) {
    if (occ !== '') {
      occ = occ + '|occasion';
    } else {
      occ = 'occasion';
    }

  }

  if (occ !== '') {
    var occVar2 = new RegExp(occ, 'i');
    searchquery.keyword = occVar2; // i deal case sensitive issues
  }

  // /////////////////////////////////////////////////////

  if (req.body.min_price) {
    if (req.body.max_price) {
      searchquery.current_price = { $gte: req.body.min_price, $lte: req.body.max_price };
    } else { // mean only min price set
      searchquery.current_price = { $gte: req.body.min_price };
    }
  } else if (req.body.max_price) { // only max price set
    searchquery.current_price = { $lte: req.body.max_price };
  }

  if (req.body.select_new_arrival) { // when click new arrival it will check last 7 days products
    var calculate_current_time = Math.floor(new Date() / 1000);
    var calculate_7_days = 7 * 86400; // calculate 7 days, 1 day= 86400
    var consider_time = calculate_current_time - calculate_7_days;

    searchquery.crossed_at = { $gte: consider_time };
  }

  if (req.body.available) {
    searchquery.available = true;

  }

  var offsetBrd = req.body.limit;
  var startBrd = offsetBrd * req.body.startindex;
  var query;
  if (offsetBrd == 6) {
    query = ProductProsperent.aggregate([
      { $match: searchquery },
      { $group: { _id: { brand: '$brand' } } },
      { $sort: { _id: 1 } },
      { $limit: offsetBrd }
    ]);
  } else {

    query = ProductProsperent.aggregate([
      { $match: searchquery },
      { $group: { _id: { brand: '$brand' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

  }
  query.exec(function (err, result) {
    if (!err) {
      async.waterfall([

        function(callback) {
            // arg1 now equals 'three'
          var resultSet = [];
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

          if (result.length > 0) {
            for (var ta = 0; ta < result.length; ta += 1) {

                        // result[ta]._id.numProducts = result[ta].count;

              if (result[ta]._id.brand != null) {
                firstalphabet = lowerCase(result[ta]._id.brand.substring(0, 1));
              }
              else {

                firstalphabet = '#';
              }
              if (firstalphabet == 'a')
                a.push(result[ta]._id);
              else if (firstalphabet == 'b')
                b.push(result[ta]._id);
              else if (firstalphabet == 'c')
                c.push(result[ta]._id);
              else if (firstalphabet == 'd')
                d.push(result[ta]._id);

              else if (firstalphabet == 'e')
                e.push(result[ta]._id);
              else if (firstalphabet == 'f')
                f.push(result[ta]._id);
              else if (firstalphabet == 'g')
                g.push(result[ta]._id);
              else if (firstalphabet == 'h')
                h.push(result[ta]._id);
              else if (firstalphabet == 'i')
                i.push(result[ta]._id);
              else if (firstalphabet == 'j')
                j.push(result[ta]._id);
              else if (firstalphabet == 'k')
                k.push(result[ta]._id);
              else if (firstalphabet == 'l')
                l.push(result[ta]._id);
              else if (firstalphabet == 'm')
                m.push(result[ta]._id);
              else if (firstalphabet == 'n')
                n.push(result[ta]._id);
              else if (firstalphabet == 'o')
                o.push(result[ta]._id);
              else if (firstalphabet == 'p')
                p.push(result[ta]._id);
              else if (firstalphabet == 'q')
                q.push(result[ta]._id);
              else if (firstalphabet == 'r')
                r.push(result[ta]._id);
              else if (firstalphabet == 's')
                s.push(result[ta]._id);
              else if (firstalphabet == 't')
                t.push(result[ta]._id);
              else if (firstalphabet == 'u')
                u.push(result[ta]._id);
              else if (firstalphabet == 'v')
                v.push(result[ta]._id);
              else if (firstalphabet == 'w')
                w.push(result[ta]._id);
              else if (firstalphabet == 'x')
                x.push(result[ta]._id);
              else if (firstalphabet == 'y')
                y.push(result[ta]._id);
              else if (firstalphabet == 'z')
                z.push(result[ta]._id);
              else
                        other.push(result[ta]._id);

              resultSet.push(result[ta]._id);

              if (ta + 1 == result.length)
                callback(null, resultSet, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, other);
            }
          }
          else
           callback(null, resultSet, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, other);
        }
      ], function (err, result, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, other) {
        console.log('I am active');
        console.log(result);
        res.send({ brands: result, a: a, b: b, c: c, d: d, e: e, f: f, g: g, h: h, i: i, j: j, k: k, l: l, m: m, n: n, o: o, p: p, q: q, r: r, s: s, t: t, u: u, v: v, w: w, x: x, y: y, z: z, other: other });
      });

    } else {
      console.log(err);
      res.end();
    }
  });

};

exports.brandInsert = function (req, res, next) {

    // res.end();
    // return;
    // var selected_str=req.params.search;
  var searchquery = {},
      sortingorder;

  var query;

  query = ProductProsperent.aggregate([
            { $match: searchquery },
            { $group: { _id: { brand: '$brand' }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
  ]);

  query.exec(function (err, result) {
    if (!err) {

      async.waterfall([

        function(callback) {
                    // arg1 now equals 'three'
          var resultSet = [];

          if (result.length > 0) {
            var firstalphabet;

            for (var t = 0; t < result.length; t += 1) {

              if (result[t]._id.brand != null) {
                result[t]._id.numProducts = result[t].count;
                firstalphabet = lowerCase(result[t]._id.brand.substring(0, 1));

                if (firstalphabet == 'a' || firstalphabet == 'b' || firstalphabet == 'c' || firstalphabet == 'd' ||
                                    firstalphabet == 'e' || firstalphabet == 'f' || firstalphabet == 'g' || firstalphabet == 'h' || firstalphabet == 'i' || firstalphabet == 'j' || firstalphabet == 'k' || firstalphabet == 'l' || firstalphabet == 'm' || firstalphabet == 'n'
                                    || firstalphabet == 'o' || firstalphabet == 'p' || firstalphabet == 'q' || firstalphabet == 'r' || firstalphabet == 's'
                                    || firstalphabet == 't' || firstalphabet == 'u' || firstalphabet == 'v' || firstalphabet == 'w' || firstalphabet == 'x' ||
                                     firstalphabet == 'y' || firstalphabet == 'z')
                  result[t]._id.pack = firstalphabet;
                else {

                  result[t]._id.pack = '#';

                }

                resultSet.push(result[t]._id);
              }

              if (t + 1 == result.length)

                console.log(resultSet);

              callback(null, resultSet);
            }
          }
          else
                        callback(null, resultSet);
        }
      ], function (err, result) {

        insertBrand(result, next, res);

      });

    } else {
      console.log(err);
      res.end();
    }
  });

};

function insertBrand(data, next, res) {
  var bulk = BrandProsperent.collection.initializeUnorderedBulkOp();
  var i = 0;

  for (i = 0; i < data.length; i += 1) {
    bulk.insert(data[i]);
  }

  bulk.execute(function (errx) {
    if (errx) { return next(errx); }
    res.end();
  });
}

//search related merchants
exports.productResultGroupMerchant = function (req, res, next) {
  var searchquery = {},
      recordsess = req.session,
      sortingorder;
  var occ = '';

  if (req.body.keyword) {
    var searchkey = req.body.keyword;
    var skey = searchkey.replace(/-/g, ' ');  // replace '-' from search query otherwise keyword ignored

    searchquery = {
      $text: { $search: skey }   // pass text search query
    };
  }

  if (req.body.male && req.body.female) {
    searchquery.gender = { $in: [1, 2] };

  } else if (req.body.male) {

    searchquery.gender = 1;

  } else if (req.body.female) {
    searchquery.gender = 2;
  }

  if (req.body.menuCategory) {
    var reqVar = req.body.menuCategory;
    var reqVar2 = new RegExp(reqVar, 'i');

    // searchquery = { category: { $regex : /'+reqVar+'/, $options: 'i' } }; // i deal case sensitive issues
    searchquery.category = reqVar2; // i deal case sensitive issues
  }

  // search by merchant list
  if (req.body.merchantList) {

    if (req.body.merchantList.length > 0) {
      searchquery.merchant = { $in: req.body.merchantList };
    }
  }

  // search by brand list

  if (req.body.brandList) {

    if (req.body.brandList.length > 0) {
      var brd = req.body.brandList;
      var brarr = [];
      for (var k = 0; k < req.body.brandList.length; k += 1) {
        brarr[k] = new RegExp(brd[k], 'i');
      }
      searchquery.brand = { $in: brarr };
    }

  }

  if (req.body.categoryList && req.body.categoryListId) {

    if (req.body.categoryList.length > 0) {
      var cat = req.body.categoryList;
      var myarr = [];
      var j = 0;

      for (j = 0; j < cat.length; j += 1) {
        myarr[j] = new RegExp(cat[j], 'i');
      }

    }

    if (req.body.categoryListId.length > 0) {
      var catArr = req.body.categoryListId;
    }

    searchquery.$or =
        [{ category: { $in: myarr } }, { categoryId: { $in: catArr } }];

  }
  else if (req.body.categoryList) {

    if (req.body.categoryList.length > 0) {
      var cat = req.body.categoryList;
      var myarr = [];
      var j = 0;

      for (j = 0; j < cat.length; j += 1) {
        myarr[j] = new RegExp(cat[j], 'i');
      }
      searchquery.category = { $in: myarr }; // this is or logic
    }

  }

  else if (req.body.categoryListId) {

    if (req.body.categoryListId.length > 0) {
      var catArr = req.body.categoryListId;
      searchquery.categoryId = { $in: catArr };
    }

  }

  if (req.body.color) {
    if (req.body.color.length > 0) {
      var colarr = req.body.color;
      var colarrCaseInsensetive = [];
      for (var p = 0; p < colarr.length; p += 1) {
        colarrCaseInsensetive[p] = new RegExp(colarr[p], 'i');
      }
      searchquery.color = { $in: colarrCaseInsensetive };
    }
  }

  if (req.body.sale_offer) {
    searchquery.price_sale = { $gte: 0 };
  }

  // //// occassion gola or hotey parey////////////////////

  if (req.body.occasion_casual) {
    occ = 'casual';
  }
  if (req.body.occasion_vacation) {

    if (occ !== '') {
      occ = occ + '|holiday';
    } else {
      occ = 'holiday';
    }
  }

  if (req.body.occasion_work) {
    if (occ !== '') {
      occ = occ + '|uniform';
    } else {
      occ = 'uniform';
    }
  }
  if (req.body.occasion_other) {
    if (occ !== '') {
      occ = occ + '|occasion';
    } else {
      occ = 'occasion';
    }

  }

  if (occ !== '') {
    var occVar2 = new RegExp(occ, 'i');
    searchquery.keyword = occVar2; // i deal case sensitive issues
  }

  // /////////////////////////////////////////////////////

  if (req.body.min_price) {
    if (req.body.max_price) {
      searchquery.current_price = { $gte: req.body.min_price, $lte: req.body.max_price };
    } else { // mean only min price set
      searchquery.current_price = { $gte: req.body.min_price };
    }
  } else if (req.body.max_price) { // only max price set
    searchquery.current_price = { $lte: req.body.max_price };
  }

  if (req.body.select_new_arrival) { // when click new arrival it will check last 7 days products
    var calculate_current_time = Math.floor(new Date() / 1000);
    var calculate_7_days = 7 * 86400; // calculate 7 days, 1 day= 86400
    var consider_time = calculate_current_time - calculate_7_days;

    searchquery.crossed_at = { $gte: consider_time };
  }

  if (req.body.available) {
    searchquery.available = true;
  }

  var offsetMer = req.body.mlimit;

  var startMer = offsetMer * req.body.startmindex;
  if (offsetMer == 6) {
    var query = ProductProsperent.aggregate([
      { $match: searchquery },
      { $group: { _id: { merchant: '$merchant' } } },
      { $sort: { _id: 1 } },
      { $limit: offsetMer }

    ]);
  } else {

    var query = ProductProsperent.aggregate([
      { $match: searchquery },
      { $group: { _id: { merchant: '$merchant' } } },
      { $sort: { _id: 1 } }
    ]);

  }

  query.exec(function (err, result) {
    if (!err) {
      async.waterfall([

        function(callback) {
                // arg1 now equals 'three'

          var resultSet = [];
          for (var t = 0; t < result.length; t += 1) {

            resultSet.push(result[t]._id);
          }

          callback(null, resultSet);
        }
      ], function (err, result) {
        res.send(result);

      });

    } else {
      console.log(err);
      res.end();
    } //else end
  }); // query exec end 
};

// vvIP getting url of the original url from prosperent normal url to check out
/*
exports.productoriginalurl = function (req, res, next) {
  var afUrl = req.body.affiliate_url,  // affiliate url
      mytaptapurl,
      canAcess = 0;

  async.waterfall([
    function (callback) {
      fr.get(afUrl, function (fz) {
        mytaptapurl = fz.fetchedUrls[1];  // get fetch ur using module redirection
        var decodeurl = decodeURIComponent(mytaptapurl),
            myRegexp = /targetURL=(.*)/,  // get the url after targetURL
            match = myRegexp.exec(decodeurl),
            targeturl;

        canAcess = 1;

        if (match !== null) {
          targeturl = match[1];
        } else {
          targeturl = decodeurl;
        }

        callback(null, canAcess, targeturl, afUrl);
      }).on('error', function (err) {
        console.error(err);
        callback(null, canAcess, err, afUrl);
      });
    },
    function (canAcess, mytaptapurl, afUrl, callback) {
      // arg1 now equals 'one' and arg2 now equals 'two'

      if (canAcess === 0 || mytaptapurl === 'undefined') {
        request({
          url: afUrl,
          followRedirect: false
        }, function (err1, res1, body1) {
          if (err1) { return callback(err1); }

          // sent request to return html code
          if (!err1) {
            var html1 = body1,
                $ = cheerio.load(html1),    // use cheerio model to load page
                meta = $('meta'),
                keys = Object.keys(meta),   // read meta keys
                ur;

            // it will be 0 if it can not access
            keys.forEach(function (value, key) {     // check one by one for meta key
              if (meta[key].name === 'meta' && meta[key].attribs['http-equiv'] === 'refresh') {
                ur = meta[key].attribs.content;
                ur = ur.replace('0;url=', '');   // replace to get redirection url
                // again sending request
                request({ url: ur, followRedirect: false }, function (e, r, body2) {
                  if (e) {

                    canAcess = 0;
                    mytaptapurl = e;
                    callback(null, mytaptapurl);
                  } else {
                    var html2 = body2,
                        $ = cheerio.load(html2),  // load the returned file
                        meta2 = $('meta'),
                        keys2 = Object.keys(meta2),
                        ur2;

                    // breaking down 2nd step to get the result
                    keys2.forEach(function (value, key) {
                      if (meta2[key].name === 'meta' && meta2[key].attribs['http-equiv'] === 'refresh') {
                        ur2 = meta2[key].attribs.content;
                        ur2 = ur2.replace('0;url=', '');

                        request.get(ur2, function (exi, resi) {    // final request to get it
                          mytaptapurl = resi.request.uri.href;
                          canAcess = 1;

                          callback(null, mytaptapurl);
                        });// last request
                      }
                    });
                  }
                });// 2nd request follow redirect false
              } // meta key end
            });
          } else {

            mytaptapurl = err1;
            canAcess = 0;
            callback(null, mytaptapurl);
          }
        });
      } else {
        callback(null, mytaptapurl);
      }
    }], function (err, targeturl) {
    if (err) { return next(err); }

    res.send(targeturl);
  });
};
*/

// //////////////////////////////////////OLD  DATABASE PART WHEN SYNCING /////////////////////////////////////////
// //////////////////////////////////////////DATABASE BASIS SYSTEM ///////////////////////////////////////////////

// what is fullpath for?


/*
exports.productlistuser = function (req, res, next) {
  // var selected_str=req.params.search;
  var searchquery = {},
      recordsess = req.session,
      sortingorder;

  global.searchedObject = {};

  if (req.body.menuCategory) {
    searchquery = { 'category': { '$regex': req.body.menuCategory, $options: 'i' } }; // i deal case sensitive issues
  }

  if (req.body.keyword) {
    var searchkey = req.body.keyword;
    var skey = searchkey.replace(/-/g, ' ');  // replace '-' from search query otherwise keyword ignored

    searchquery = {
      $text: { $search: skey }   // pass text search query
    };
  }

  // search by merchant list
  if (req.body.merchantList) {
    searchquery.merchant = { $in: req.body.merchantList };
  }

  // search by brand list

  if (req.body.brandlist) {
    searchquery.brand = { $in: req.body.brandlist };
  }

  // we might need regex below
  if (req.body.categorylist) {
    // searchquery.category={ $in: req.body.categorylist};

    var cat = req.body.categorylist;
    var myarr = [];
    var j = 0;

    for (j = 0; j < cat.length; j += 1) {
      myarr[j] = new RegExp(cat[j]);
    }
    searchquery.category = { $in: myarr }; // this is or logic
  }

  if (req.body.color) {
    var t = req.body.color;

    searchquery.color = { $in: t };
  }
  if (req.body.gender && (req.body.gender === 1 || req.body.gender === 2)) {
    searchquery.gender = req.body.gender;
  }

  if (req.body.sale_offer) {
    searchquery.sale_offer = req.body.sale_offer;
  }
  if (req.body.premium) {
    searchquery.premium = req.body.premium;
  }
  // //// occassion gola or hotey parey////////////////////
  if (req.body.occasion) {
    searchquery.occasion = req.body.occasion;
  }

  if (req.body.occasion_casual) {
    searchquery.occasion_casual = req.body.occasion_casual;
  }
  if (req.body.occasion_vacation) {
    searchquery.occasion_vacation = req.body.occasion_vacation;
  }

  if (req.body.occasion_work) {
    searchquery.occasion_work = req.body.occasion_work;
  }
  if (req.body.occasion_other) {

    searchquery.occasion_other = req.body.occasion_other;
  }
  // /////////////////////////////////////////////////////

  if (req.body.min_price) {
    if (req.body.max_price) {
      searchquery.price = { $gte: req.body.min_price, $lte: req.body.max_price };
    } else { // mean only min price set
      searchquery.price = { $gte: req.body.min_price };
    }
  } else if (req.body.max_price) { // only max price set
    searchquery.price = { $lte: req.body.max_price };
  }

  // need to check price is within sale price if sale price not available check it
  // with respect to normal price ... that mean logical query is required
  if (req.body.select_new_arrival) { // when click new arrival it will check last 7 days products
    var calculate_current_time = Math.floor(new Date() / 1000);
    var calculate_7_days = 7 * 86400; // calculate 7 days, 1 day= 86400
    var consider_time = calculate_current_time - calculate_7_days;

    searchquery.crossed_at = { $gte: consider_time };
  }

  sortingorder = 'price';

  if (req.body.sortorder === 1) {
    sortingorder = 'price';
  } else if (req.body.sortorder === 2) {
    sortingorder = '-price'; // descending high to low
  } else if (req.body.sortorder === 3) {
    sortingorder = 'created_at'; // descending
  } else if (req.body.sortorder === 4) {
    sortingorder = '-created_at'; // high to low
  }

  global.searchedObject = searchquery;

  if (req.body.start === -1) {  // -1 means show all
    var query2 = Product
    .find(searchquery)
    .sort(sortingorder)
    .select({
      _id: 1,
      catalogId: 1,
      keyword: 1,
      category: 1,
      SScategory: 1,
      color: 1,
      brand: 1,
      designer: 1,
      gender: 1,
      merchant: 1,
      merchantId: 1,
      price: 1,
      price_sale: 1,
      product_url: 1,
      affiliate_url: 1,
      image_url: 1,
      currency: 1,
      rate: 1,
      like: 1
    });

    query2.exec(function (err, data) {
      if (err) { return next(err); }

      res.send({ product: data, count: recordsess.total_record });
    });
  } else {
    var offset = req.body.offset;
    var start = offset * req.body.start;

    var lquery = Product
    .find(searchquery)
    .skip(start)
    .limit(offset)
    .sort(sortingorder)
    .select({
      _id: 1,
      catalogId: 1,
      keyword: 1,
      category: 1,
      SScategory: 1,
      color: 1,
      brand: 1,
      merchant: 1,
      price: 1,
      price_sale: 1,
      image_url: 1,
      product_url: 1,
      affiliate_url: 1,
      currency: 1,
      rate: 1,
      like: 1
    }); // define query to find data result

    lquery.exec(function (err, data) {   // run query to find data result
      if (err) {
        return next(err);
      }
      res.json({ product: data, count: 0 });

    });
  }
};
*/


// SPECIFIC PRODUCT DATA FETCH FROM DATABASE


// PROBLEM: this does nothing

// retriving product color
// PROBLEM: this returns nothing
exports.productcolor = function (req, res, next) {
  var ua = req.headers['user-agent'];
  // var lnk = req.params.urllink;
  // get the url from
  var lnk = req.body.image_url;
  var opts = {
    url: lnk,
    userAgent: ua
  };

  request({
    url: opts.url,
    method: 'GET',
    headers: { 'user-agent': opts.userAgent },
    encoding: null
  }, function (error) {
    if (error) { return next(error); }
  });
};

exports.productcolorname = function (req, res) {
  var colorcode = req.body.col_name;
  var names = namer(colorcode);
  // var color_name =names.pantone[0].name;
  var color_name = names.basic[0].name; // use html color code

  res.send(color_name);

};

exports.productcolorname2 = function (req, res) {
  var colorcode = req.query.col_name;
  var names = namer(colorcode);
  var color_name = names.pantone[0].name;

  res.send(color_name);
};

exports.productcolornamecolcode = function (req, res) {
  var colorcode = req.params.colcode;
  var names = namer(colorcode);
  var color_name = names.pantone[0].name;

  res.send(color_name);

};

exports.productDeleteAll = function (req, res, next) {
  ProductProsperent.remove({}, function (err) {
    if (err) { return next(err); }

    res.send(' success for delete products');
  });
};

var productDeleteAll = function (callback) {
  ProductProsperent.remove({}, function (err) {
    callback(err);
  });
};

// dump all prdouct inside our system
exports.syncProductsAdd = function (req, res, next) {
  var totalRecordsFound;
  var pBody;
  var url = 'http://api.prosperent.com/api/search?api_key=0da1ade1627ce72127d551d52d5b55e7&limit=1&page=1&filterTwoTapSupported=1';

  productDeleteAll(function (err) {
    if (err) { return next(err); }

    request({
      url: url,
      method: 'GET'
    }, function (err, reponse, body) {

      if (err) { return next(err); }
      var parsedBody = JSON.parse(body);

      totalRecordsFound = parsedBody.totalRecordsFound;

      CategoryProsperentSync.find({}, function (err, prodata) {  // find data exist
        if (err) { return next(err); }

        var j = 0;
        var cata;

        var page = 1;
        var lastPage = prodata.length;    // @
        var cat_err = [];

        // async module maintain all asynchronous calls
        async.whilst(
          function () {         // synchronous truth test to perform before each execution of fn
            return page <= lastPage;
          },
          function (next) {
            // A function which is called each time last logic true
            j = page - 1;
            cata = prodata[j].category;

            request({
              url: 'http://api.prosperent.com/api/search?api_key=0da1ade1627ce72127d551d52d5b55e7&limit=100&page=1&filterTwoTapSupported=1&filterCategory=' + cata,
              method: 'GET'
            }, function (err, response, body) {

              if (!err && response.statusCode === 200) {
                pBody = JSON.parse(body);
                totalRecordsFound = pBody.totalRecordsFound;

                if (totalRecordsFound > 0) {
                  getProd(pBody.data, function(err) {
                    if (err) { return next(err); }
                  });
                }

                page += 1;
                next();
              } else {

                page += 1;
                next();
                cat_err.push({ 'category': cata, 'err': err });
              }
            });
          }, function () {      //  A callback which is called after the test function has failed and repeated execution of fn has stopped

          });
      });// categories sync find end
    }); // api request end
  }); // delete end
};

// insert a chunk of data
function getProd(data, next) {
  var bulk = ProductProsperent.collection.initializeUnorderedBulkOp();
  var i = 0;

  for (i = 0; i < data.length; i += 1) {
    bulk.insert(data[i]);
  }

  bulk.execute(function (errx) {
    if (errx) { return next(errx); }

  });
}



// ////////////////////// A  D M I N PRODUCT CRUD






