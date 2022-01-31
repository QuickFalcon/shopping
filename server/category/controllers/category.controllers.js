'use strict';

var config = require(process.cwd() + '/config'),
    hat = require('hat'),
    request = require('request'),
    readline = require('readline'),
    trim = require('trim'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    CategoryCustom = mongoose.model('CategoryCustom'),
    categorytwotapsparent = mongoose.model('categorytwotapsparent'), // twotap category
    CategoryCustomTap = mongoose.model('CategoryCustomTap'), // twotap category
    CategoryProsperentSync = mongoose.model('CategoryProsperentSync'),
    CategoryProsperent = mongoose.model('CategoryProsperent'),
    NodeCache = require('node-cache');
var ssCache = new NodeCache();

// PRODUCT LIST using CATEGORY(CAREFU
// obsolescent
exports.categoryApi = function (req, res, next) {
  var url = 'http://api.prosperent.com/api/search?api_key=0da1ade1627ce72127d551d52d5b55e7&filterCategory=' + req.params.cat + '&limit=' + config.resultsLimit + '&page=1&sortBy=price';

  request({
    url: url,
    method: 'GET'
    //  url: 'http://api.prosperent.com/api/local/search?api_key=0da1ade1627ce72127d551d52d5b55e7&filterCategory=Apparel&limit=1000&page=1&sortBy=rank&filterRank=5',
  }, function (err, reponse, body) {
    if (err) { return next(err); }

    if (body) {
      var category = req.params.cat,
          dataCategory = JSON.parse(body),
          D = dataCategory.data,
          totalrecordsavailable = dataCategory.totalRecordsAvailable,
          totalrecordfound = dataCategory.totalRecordsFound,
          uid = hat();

      if (totalrecordsavailable > 0) {
        res.render('testintegrate', {
          title: 'sociallyshoppablestyle.com:' + category,
          searchkey: 'sociallyshoppablestyle ' + category + ', sociallyshoppablestyle.com ' + category + ',' + category + ',buy ' + category + ',buy ' + category + ' online,best ' + category + ' buy',
          description: 'buy ' + category + ' in sociallyshoppablestyle. Your personalized shop',
          totalrecordsavailable: totalrecordsavailable,  // total record available to me
          totalrecordfound: totalrecordfound,             // total record in prospernet data feed
          dx: D,
          twotap_public_token: config.twotap.publicToken,
          uid: uid
        });
      } else {
        res.end('sorry,MP  no record found ' + url);
      }
    } // body exist end
  });
};

// API RELATED PART >> a. PROSPERENT >> Suggestion using Category
// changing dept change suggestion
exports.autosuggestion = function (req, res) {
  var selectedStr = req.params.cat;

  request({
    url: 'http://api.prosperent.com/api/search?api_key=0da1ade1627ce72127d551d52d5b55e7&filterCategory=' + selectedStr + config.merchantlist + '&limit=1000',
    method: 'GET'
  }, function (err, reponse, body) {

    res.send(JSON.parse(body).data);
  });
};

// get prosperent category from cache
exports.getCategoryListCache = function (req, res, next) {
  ssCache.get('categoryKey', function (err, data) {
    if (err) {
      console.log(err);

      return next(err);
    }

    var offset = req.body.limit;
    var start_data = offset * req.body.page;

    if (data === undefined) {
      var query_data = CategoryProsperentSync.find({}).skip(start_data).limit(offset).sort('category');
      // var query_data = CategoryProsperentSync.find({}).sort('category');

      query_data.exec(function (err2, catdataObj) {
        if (err2) {
          console.log(err2);

          return next(err2);
        }

        console.log(catdataObj.length);
        var catlength = Object.keys(catdataObj).length - 1;
        var catObjLength = catlength + 1;

        console.log(catlength);
        for (var cid = 0; cid < catObjLength; cid += 1) {
          catdataObj[cid].catid = cid;
            // need to use async
          if (cid === catlength) {
            // obj = { catlist: catdataObj };

            res.send(catdataObj);
            // ssCache.set('categoryKey', obj, function (err, success) {
              // if (err) {
                // console.log(err);

                // return next(err);
              // }
              // console.log('cache make success ' + success);
            // });

          // console.log(catdataObj);
          }

        }

      });

    } else {

      console.log('I am here 2');
      console.log(data);

      res.send(data.catlist);

    }
  }); // sscache end
};

// return main parent category for CategoryProsperent model
exports.getLevelOneCategory = function (req, res, next) {
  var query = CategoryProsperent.find({ level: 1 }).sort('-fullcategory');

  query.exec(function (err, data) {
    if (err) { return next(err); }

    res.send({ category: data, count: data.length });
  });
};

// return child category of a category

exports.getCategoryChild = function (req, res, next) {
  var query = CategoryProsperent.find({ parent: req.body.cid });

  query.exec(function (err, data) {
    if (err) { return next(err); }

    res.send({ category: data, count: data.length });
  });
};

// get category details
exports.getCategoryDet = function (req, res, next) {
  var query = CategoryProsperent.find({ cid: req.body.cid });

  query.exec(function (err, data) {
    if (err) { return next(err); }

    console.log(data);
    res.send(data);
  });
};

// returning built in prosperent saved categories, from database
exports.getCatagoryStraightForward = function (req, res, next) {
  var lmt = req.body.limit;
  var cat_query = CategoryProsperentSync.find({}).limit(lmt).sort('-category');

  cat_query.exec(function (err, data) {
    if (err) { return next(err); }
    console.log(data);
    res.json(data);
  });
};

exports.categoryDeleteAll = function (req, res, next) {
  CategoryProsperent.remove({}, function (err) {
    if (err) {
      console.log(err);

      return next(err);
    }
    console.log('success delete saved huge category list');
    res.send(' success for delete category');
  });
};

exports.categoryDeleteProsper = function (req, res, next) {
  CategoryProsperentSync.remove({}, function (err) {
    if (err) { return next(err); }

    res.send(' success for delete category');
  });
};

// create child parent category from csv file
exports.createCustomCategory = function (req, res, next) {

  var query = CategoryCustom.find({}).sort({ cid: -1 }).limit(1);
  var cd;
  var prt = -1;
  var level = 1;
  query.exec(function (cerr1, data) {
    if (cerr1) {

      console.log(cerr1);
      res.end();

      return next(cerr1);
    } else {

      console.log(data);

      if (data && data.length > 0) {
        cd = data[0].cid + 1;
        prt = req.body.parent;
        level = req.body.level;
      }
      else {

        cd = 1;

      }

      var categories_customz = new CategoryCustom({
        cid: cd,
        parent: prt,
        category: req.body.cat_title,
        level: level,
        prosperent_categories: req.body.prosper_categorylist,
        prosperent_categories_id: req.body.prosperent_categories_id

      });
      categories_customz.save(function (ccerr) {
        if (ccerr) {
          console.log(ccerr);
          res.end();

          return next(ccerr); }

        res.send('success');
      });

    }

  });

};

// get list of custom category related with level
exports.getAllCustomCategory = function (req, res, next) {

  var query = CategoryCustom.find({}).sort('position');

  query.exec(function (err, data) {
    if (err) {
      res.end();

      return next(err);

    }

    res.json(data);
  });
};


exports.getMappedWords  = function (req, res, next) {
	
	 var query = CategoryCustom.find({ level: 0 });
		query.exec(function (err, data) {
			if (err) {
			  res.end();

			  return next(err);

			}

			res.json(data);
		  });

	 

	 
	 }

exports.getCategoryTwotap = function (req, res, next) {
  
 var parentquery = categorytwotapsparent.find({});
 
  
parentquery.exec(function (perr, pdata) {

 var query = CategoryCustomTap.find({});
 
 query.exec(function (err, data) {
    if (err) {
      res.end();

      return next(err);
    }  


    res.json( {"parentcat":pdata,"allcat" :data});
  });



})


 

  


  
};


// get custom category by cid
exports.getCustomCategoryCid = function (req, res, next) {
  var query = CategoryCustom.find({ cid: req.body.cid });

  query.exec(function (err, result) {
    if (err) {
      res.end();
      return next(err); }

    if(result[0].prosperent_categories_id.length>0) {
      var query2 =   CategoryProsperentSync.find({categoryId : {  $in : result[0].prosperent_categories_id}  });
      query2.exec(function (err2, result2) {
        if (err2) {
          res.end();
          return next(err2);
        }
        var carr =[];
        var cidarr = [];

        for(var ty=0; ty<result2.length;ty++){

            carr.push(result2[ty].category);
            cidarr.push(result2[ty].categoryId);

        }


        res.json({currentCat : result,arrObj : result2,category:carr,categoryId:cidarr });
      })
    }
    else
    res.json({currentCat : result});
  });
};

exports.getCustomCategoryParent = function (req, res, next) {
  CategoryCustom.find({ parent: req.body.cid }, function (err, pdata) {
    if (err) { return next(err); }

    res.json(pdata);
  });
};

exports.deleteCustomCategory = function (req, res) {
  CategoryCustom.find({ parent: req.body.cid }, function (err, pdata) {
    if (pdata.length > 0) {
      res.json({ 'message': 'Delete Child category first' });
    } else {
      CategoryCustom.remove({
        cid: req.body.cid
      }, function (err) {
        if (err) {
          res.json({ 'message': 'failure' });
        } else {
          res.json({ 'message': 'success' });
        }
      });
    }
  });
};

exports.updateCustomCategory = function (req, res, next) {
  CategoryCustom.findOne({ cid: req.body.cid }, function (err, data) {
    if (err) { return next(err); }

    data.category = req.body.category;
    data.parent = req.body.parent;
    data.level = req.body.level;
    data.prosperent_categories = req.body.prosperent_categories;
    data.prosperent_categories_id = req.body.prosperent_categories_id;


    console.log(data);
    data.save(function (err) {
      if (err) { return next(err); }

      res.json({ 'message': 'success' });
    });
  });
};

exports.updateCustomCategoryParent = function (req, res, next) {
  CategoryCustom.findOne({ cid: req.body.cid }, function (err, data) {
    if (err) { return next(err); }

    data.parent = req.body.parent;
    data.level = req.body.level;



    data.save(function (err) {
      if (err) { return next(err); }

      res.json({ 'message': 'success' });
    });
  });
};

// this make a tree of prosperent categories outdated

exports.getAllCatagoriesFromCsv = function (req, res, next) {
  var arr = [];
  var only_arr = []; // holding the array
  var second_arr = [];
  var parent_childarr = [];
  var bulk = CategoryProsperent.collection.initializeOrderedBulkOp();
  var rl = readline.createInterface({
    input: fs.createReadStream('resourcefiles/categorySchema.csv')
  });
  var count = 0;
  var first_parent = 0;
  var highest_level = 0;
  var total_length = 0;
  var t;
  var level;
  var first_parent_str; // put first part inside variable
  var full_length_cat;
  var parent_count = 0;
  var temp = -1;
  var temp2 = -1;
  var cat_stringer;

  rl.on('line', function (line) {
    console.log('Line from file:', line);
    first_parent = -1;
    temp = -1;
    temp2 = -1;

    t = line.split(/[>"]+/);

    // console.log(t);
    level = 1;
    parent_count = -19;
    total_length = t.length;

    if (total_length > highest_level) {
      highest_level = total_length;
    }

    var fullcategory = trim(t[1]);

    first_parent_str = trim(t[1]); // triming

    var second_parent_str = trim(t[2]); // put first part inside variable
    var secondfullcategory = first_parent_str + ' > ' + second_parent_str;

    if (second_arr.length > 0) {  // first index second_arr.length > 0 no
      // temp  = only_arr.indexOf(first_parent_str);
      console.log(fullcategory);
      console.log(second_arr[0]);

      temp = second_arr.indexOf(fullcategory);  // only greater than 0 then chance to check
    }
    if (temp < 0) {
      bulk.insert({
        'cid': count,
        'fullcategory': fullcategory,
        'parent': first_parent,
        'category': first_parent_str,
        'level': level
      });
      only_arr.push(first_parent_str);

      arr[count] = {
        'cid': count,
        'fullcategory': fullcategory,
        'parent': first_parent,
        'category': first_parent_str,
        'level': level
      };
      parent_childarr[count] = count;   // holding id only of first parent

      parent_count = count; // required for next level
      count += 1;
      second_arr.push(fullcategory);

    } else if (temp > -1) {
      parent_count = arr[temp].cid;  // PARENT COUNT TRACKING CHILD
      // parent_count =  parent_childarr[temp];

    }
    var counter_length = 4;

    if (t.length >= counter_length) {
      level += 1;

      if (second_arr.length > 0) {
        temp2 = second_arr.indexOf(secondfullcategory);
        console.log('previously inserted inside' + temp2);
      }

      if (temp2 < 0) {
        bulk.insert({
          'cid': count,
          'fullcategory': secondfullcategory,
          'parent': parent_count,
          'category': second_parent_str,
          'level': level
        });

        arr[count] = {
          'cid': count,
          'fullcategory': secondfullcategory,
          'parent': parent_count,
          'category': second_parent_str,
          'level': level
        };

        parent_count = count;
        second_arr.push(secondfullcategory);
        count += 1;
      } else if (temp2 > -1) {
        parent_count = arr[temp2].cid;
      }

      counter_length += 1;
    }
    // running 5
    var current_highest_length = t.length;

    // 6
    for (counter_length = 5; counter_length <= current_highest_length; counter_length += 1) {
      var highest_for_loop = counter_length - 2; // 2 deducted from both side

      full_length_cat = '';
      for (var l = 1; l <= highest_for_loop; l += 1) {
        if (l === highest_for_loop) {
          full_length_cat += trim(t[l]);
        } else {
          full_length_cat += trim(t[l]) + ' > ';
        }
      }
      // full_length_cat =  trim(t[1])+" > "+trim(t[2])+" > "+trim(t[3]) ;

      // cat_stringer = trim(t[3]);
      cat_stringer = trim(t[highest_for_loop]);

      level += 1;

      if (second_arr.length > 0) {
        temp2 = second_arr.indexOf(full_length_cat);
      } else {
        temp2 = -1;
      }

      if (temp2 < 0) {
        bulk.insert({
          'cid': count,
          'fullcategory': full_length_cat,
          'parent': parent_count,
          'category': cat_stringer,
          'level': level
        });

        arr[count] = {
          'cid': count,
          'fullcategory': full_length_cat,
          'parent': parent_count,
          'category': cat_stringer,
          'level': level
        };

        parent_count = count;
        second_arr.push(full_length_cat);
        count += 1;
      } else if (temp2 > -1) {
        parent_count = arr[temp2].cid;
      }
    }
  }).on('close', function () {
    console.log('highest level ' + highest_level);
    bulk.execute(function (err, result) {
      if (err) { return next(err); }

      console.log(result);
      res.send('success');
    });
  });
};

// ////////////////// IMPORT ALL PROSPER CATEGORY FROM CSV also use cache /////////////////////
exports.catagoriesFromCsvStraightForward = function (req, res, next) {
  var catObj = [];
  var catid = 0;
  var scat;
  var bulk = CategoryProsperentSync.collection.initializeOrderedBulkOp();
  var rl = readline.createInterface({
    input: fs.createReadStream('resourcefiles/categorySchema.csv')
  });

  rl.on('line', function (line) {
    console.log('Line from file:', line);
    scat = line.replace(/"/g, '');  // replace to remove negative form mongodb
    catObj.push({ 'catid': catid, 'category': scat });  // make an array for caching
    catid += 1;
    bulk.insert({ 'category': scat });
  }).on('close', function () {
    var obj = { catlist: catObj };

    ssCache.set('categoryKey', obj, function (err, success) {
      if (err) { return next(err); }

      console.log(success);
    });

    bulk.execute(function (err) {
      if (err) { return next(err); }

      res.send('success');
    });
  });
};
