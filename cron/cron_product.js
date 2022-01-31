'use strict';

var express = require('express'); // express module
var app = express();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schedule = require('node-schedule'),
async = require('async'),
fs = require('fs'),
request = require('request'),
rp = require('request-promise'),
urlencode = require('urlencode'),
sendgrid = require('./sendgrid');

 // StoreProsperent = mongoose.model('StoreProsperent');
app.use(express.static(__dirname));   //setting up directory for css etc

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
 
 
var productsSchemaProsperent = new Schema({
  catalogId: String,
  productId: String,
  affiliate_url: String,
  image_url: String,
  keyword: String,
  keywords: String,
  celebrity: [String],
  description: String,
  category: String,
  price: String,
  price_sale: String,
  percentOff: String,
  currency: String,
  merchant: String,
  merchantId: String,
  brand: String,
  upc: String,
  isbn: String,
  sales: Number,
  twoTapProductUrl: String,
  twoTapAffiliateLink: String,
  _id: Schema.Types.ObjectId,
  availability: Boolean,
  affiliatedNetwork : String,
  SScategory: String,
  gender: Number,
  directUrl: String,
  rate: Number,
  total_user_rated: Number,
  like: Number,
  share: Number,
  review: [String],
  color: [String],
  color_code: [String],
  premium: Boolean,
  occasion_casual: Boolean,
  occasion_vacation: Boolean,
  occasion_work: Boolean,
  occasion_other: Boolean,
  sale_offer: Boolean,
  userActivities: [{ type: Schema.Types.ObjectId, ref: 'userActivity' }],
  orderCount: Number,
  purchaseCount: Number,
  twotapObj: Object,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
   availability_updated_at: { type: Date }
  });



  // instock: Number, // number of item in stock
var categoriesSchemaProsperentSync = new Schema({
  category: String,  
  numProducts: Number

});

var BrandSchemaProsperent = new Schema({
  brand: String,
  logoUrl: String,
  numProducts: Number
});

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


var ProductProsperent = mongoose.model('ProductProsperent', productsSchemaProsperent);
var CategoryProsperentSync = mongoose.model('CategoryProsperentSync', categoriesSchemaProsperentSync);
 var BrandProsperent = mongoose.model('BrandProsperent',BrandSchemaProsperent);
 var StoreProsperent = mongoose.model('StoreProsperent',StoreSchemaProsperent);
 
var moptions = {
  server: { poolSize: 4, reconnectTries: 10, socketOptions: { keepAlive: 180000 } }, // keep alive keep connection for 3 minute
  replset: { socketOptions: { keepAlive: 180000 } }
};

mongoose.connect('mongodb://127.0.0.1/ss', moptions); // connect mongodb using mongoose
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));  // mongo error handler


var totalsuccess = 0;
var totalfailed = 0;
var page;
var lastPage; 
var busy = false; 



var productDeleteAll = function (callback) {
  ProductProsperent.remove({}, function (err) {
    callback(err);
  });
};
	var bulk;
// dump all prdouct inside our system
var syncProductsAdd=function() {
  var totalRecordsFound;
  var pBody;
  var url = 'http://api.prosperent.com/api/search?api_key=0da1ade1627ce72127d551d52d5b55e7&limit=1&page=1&filterTwoTapSupported=1';

 //productDeleteAll(function (errt) {
  // if (errt) { 
  // console.log("prod delete error");
   //   console.log(errt);

   // return; 
   //}
         var stringBig ="I am ok";
	     fs.appendFile(process.cwd() + '/bigdata.csv', stringBig, function(appenderr) {
				  if (appenderr) {
					console.log('failed to append ' + stringBig + ' ');
				  } 
			});
	  
	  var encd_merchant;
	  var merchantId;
	  var brndData;
	  var encodeBrndData;
	  var pbrdBody;
      var cata;
	  var encodeCata;
	  var pcatBody;
      async.waterfall([
    function(callback) {
         StoreProsperent.find({ "numProducts": { $gt: 0 } }).sort({ merchant: -1 }).exec(function (ignoreerr, strdata) {
        if (ignoreerr) {
          console.log(ignoreerr);

        } else {
		   callback(null, strdata, 'two');
		}     
	 })
	},
    function(strarg1, arg2, callback) {
        // arg1 now equals 'one' and arg2 now equals 'two'
     
          CategoryProsperentSync.find({ "numProducts": { $gt: 0 } }, function (cerr, catdata) {  // find data exist
							if (cerr) { 
							console.log(cerr);
							console.log("error for getting all category");
							} else {
								
								   callback(null, strarg1,catdata );
							}

		  })
	
	},
    function(storearg1,categorydata, callback) {
        // arg1 now equals 'three'
       
       BrandProsperent.find({ "numProducts": { $gt: 0 } }, function (berr, branddata) {  // find data exist
							if (berr) { 
							console.log(berr);
							console.log("error for getting all brand");
							} else {
								callback(null, storearg1,categorydata,branddata);
							}

		  })  
	   
    }
	], function (err, str, catdata,branddata) {
		// result now equals 'done'
		console.log(str.length);
		console.log(catdata.length);

		
        var totalStr = str.length;
		var total_category = catdata.length;
		var total_brand = branddata.length;
		//console.log(total_brand);

		var count = 0;
		async.whilst(
			function() { return count < totalStr; },
			function(callback) {
				   merchantId = str[count].merchantId;	
                 		console.log(merchantId);		
					if(str[count].numProducts<=1000) {
						
							request({ url: "http://api.prosperent.com/api/search?limit=1000&page=1&filterMerchantId="+merchantId+"&filterTwoTapSupported=1&api_key=0da1ade1627ce72127d551d52d5b55e7",
										  method: 'GET',
										  timeout:120000
										}, function (errc, responsec, bodyc) {
								  
									  		bulk = ProductProsperent.collection.initializeUnorderedBulkOp();
											if(bodyc)
											pBody = JSON.parse(bodyc);
										    else {
												var nxtt;
												pBody = nxtt;
												
											}  
											totalRecordsFound =0;
											
											if(errc) {
												
												count++;
												callback(null, count);
											}
												
											else if(pBody)  {
											
											if(pBody.totalRecordsFound)
											totalRecordsFound = pBody.totalRecordsFound;
											
											var counti =0;
											async.whilst(
													function() { return counti < totalRecordsFound; },
													function(callback) {
											         	
														if(pBody.data[counti]) {
														bulk.insert(pBody.data[counti]);
														}
														
														counti++;

														callback(null, counti);
													},
													function (errz, n) {
														// 5 seconds have passed, n = 5
													     console.log(bulk.length);
														 
														 if(bulk.length>0) {
															 bulk.execute(function (errx) { 
															   console.log(" merchant "+str[count].merchant+"  : "  + totalRecordsFound);

																count++;
																callback(null, count);
															 })
														} else {
																count++;
																callback(null, count);
														}
													}
												);
											
										
										  }// pbody end 
										  else {
											   count++;
											   callback(null, count);
											  
										  }
								      })
					} // end of less than 1000
					else {
						   
						   var brand_counter =0;
						
						    async.whilst(
								 function() { return brand_counter < total_brand; }, // this is looping the category
						   	     function(callback) {   // single merchant 
							     	   	brndData = branddata[brand_counter].brand;
							            encodeBrndData = urlencode(brndData);					
									request({
										  url: "http://api.prosperent.com/api/search?limit=1000&page=1&filterMerchantId="+merchantId+"&filterBrand="+encodeBrndData+"&filterTwoTapSupported=1&api_key=0da1ade1627ce72127d551d52d5b55e7",
										  method: 'GET',
										  timeout:120000
										}, function (errBrd, responsec, bodyBrd) {
								  
									  		bulk = ProductProsperent.collection.initializeUnorderedBulkOp();
											
											console.log(bodyBrd);
											if(bodyBrd)
											pbrdBody = JSON.parse(bodyBrd);
											else {
												var k;
												pbrdBody = k;
												
												
											}
												
											
											
											totalRecordsFound =0;
											
											if(errBrd) {
												
												brand_counter++;
												callback(null, brand_counter);
											}
												
											else if(pbrdBody)  {
											
											if(pbrdBody.totalRecordsFound) {
											totalRecordsFound = pbrdBody.totalRecordsFound;
										
											}
											var countIndBrd =0;
											
											if(totalRecordsFound>0 && totalRecordsFound<=1000) {
												
												console.log(str[count].merchant + " brand : "+brndData);

											async.whilst(                       // loop down to insert all product for specific brand
													function() { return countIndBrd < totalRecordsFound; },
													function(callback) {
											         	
														if(pbrdBody.data[countIndBrd]) {
														bulk.insert(pbrdBody.data[countIndBrd]);
														}
														
														countIndBrd++;

														callback(null, countIndBrd);
													},
													function (errzbrd, nzbrd) {
														// 5 seconds have passed, n = 5
														 
														 if(bulk.length>0) {
															 bulk.execute(function (errx) { 
																console.log(" brand : "+brndData);
																console.log(totalRecordsFound);
																brand_counter++;
																callback(null, brand_counter);         // move to next brand
															 })
														} else {
																brand_counter++;
																callback(null, brand_counter);         // move to next brand
															
														}
															
													}
												);
											}//less than 1000 but greater than 1 
										    else if(totalRecordsFound>=1000) {
												////// Mixing category ///////////////////
												var cat_count =0;
												 async.whilst(
													function() { return cat_count < total_category; }, // this is looping the category
															function(callback) {   // single merchant 
																				 
																cata = catdata[cat_count].category;
																encodeCata = urlencode(cata);
																					request({
																						  url: "http://api.prosperent.com/api/search?limit=1000&page=1&filterMerchantId="+merchantId+"&filterBrand="+encodeBrndData+"&filterCategory="+encodeCata+"&filterTwoTapSupported=1&api_key=0da1ade1627ce72127d551d52d5b55e7",
																						  method: 'GET',
																						  timeout:120000
																						}, function (errcat, responsec, bodycat) {
																				  
																							bulk = ProductProsperent.collection.initializeUnorderedBulkOp();
																							if(bodycat)
																							pcatBody = JSON.parse(bodycat);
																							else {
																								var yu;										
																							pcatBody =yu;
																								
																							}
																							
																							totalRecordsFound =0;
																							
																							if(errcat) { 																								
																								cat_count++;
																								callback(null, cat_count);
																							}
																								
																							else if(pcatBody)  {
																							totalRecordsFound = pcatBody.totalRecordsFound;
																							var countIndCat =0;
																							if(totalRecordsFound>1000) {
																								   stringBig =  'merchantid ' + merchantId + ' brand ' + brndData + ' Category '+ cata + '\n';

																								     fs.appendFile(process.cwd() + '/bigdata.csv', stringBig, function(appenderr) {
																											  if (appenderr) {
																												console.log('failed to append ' + stringBig + ' ');
																											  } 
																										});
																								
																							} // if loop end
																							
																							async.whilst(
																									function() { return countIndCat < totalRecordsFound; },
																									function(callback) {
																										
																										if(pcatBody.data[countIndCat]) {
																										bulk.insert(pcatBody.data[countIndCat]);
																										}
																										countIndCat++;
																										callback(null, countIndCat);
																									},
																									function (errCat, nCat) {
																										// 5 seconds have passed, n = 5
																									 
																										 if(bulk.length>0) {
																											 bulk.execute(function (errx) { 
																												cat_count++;
																												callback(null, cat_count);
																												console.log("Category "+ cata +" : "+ totalRecordsFound);
																											 })
																										} else {
																												cat_count++;
																												callback(null, cat_count);
																											
																										}
																											
																									}
																								);
																						
																						  }// pbody end 
																						  else {
																								cat_count++;
																								callback(null, cat_count);
																							  
																						  }
																					  }) // request end 
																				 }, function (errcat, nx) {  // category loop down end 
																					count++;
																					callback(null, count);
																				 
																				 })
												
												
												
												//////////////////////End Mix Category///////////////////////////////////
											}
											else {        
												
													brand_counter++;
													callback(null, brand_counter);         // move to next brand
											}
												
										  
										  }// pbody end 
										  else {
											    brand_counter++;
												callback(null, brand_counter);
											  
										  }
								      }) // request end 
								 }, function (errbr, nx) {  // brand loop down end move to next merchant
									count++;
									callback(null, count);
								 
								 })
						   
						   
						   
						 /////////////////////////// Category Count ///////////////////////////////////  
						   	/*
						    */
									  
						   
						   
						   
						
					
					}
			},
			function (err, n) {
				// 5 seconds have passed, n = 5
			}
		);
		
		
		
	});
/*
      var parsedBody;
      var str_arr =[];
	  var strM ="";
	   var mcount =0;
	  StoreProsperent.find({ "numProducts": { $gt: 0 } }).sort({ merchant: -1 }).exec(function (ignoreerr, strdata) {
        if (ignoreerr) {
          console.log(ignoreerr);

        } else {
              for(var spindex=0;spindex<strdata.length;spindex++) {
				  
				  strM ="&filterMerchantId="+strdata[spindex].merchantId;
				  str_arr.push(strM);
			      if(spindex+1 == strdata.length) {

   //////////////////////////////////////////////////////////////////////////
					  CategoryProsperentSync.find({ "numProducts": { $gt: 0 } }, function (cerr, prodata) {  // find data exist
							if (cerr) { 
							console.log(cerr);
							console.log("error for getting all category");
							return; 
							}

							var j = 0;
							var cata;
							var encodeCata;
							var page = 1;
							var lastPage = prodata.length;    // for each category we have a page last page is total category representing
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
								encodeCata = urlencode(cata);
								mcount = 0;
								console.log(cata);
								request({
								  url: "http://api.prosperent.com/api/search?limit=1&page=1&filterCategory=" + encodeCata+"&filterTwoTapSupported=1&api_key=0da1ade1627ce72127d551d52d5b55e7",
								  method: 'GET'
								}, function (errc, responsec, bodyc) {

								  if (!errc && responsec.statusCode === 200) {
									pBody = JSON.parse(bodyc);
									totalRecordsFound =0;
									if(pBody)
									totalRecordsFound = pBody.totalRecordsFound;
								
								    console.log(totalRecordsFound);
									if (totalRecordsFound > 1000) { // inthat case use store wise api call 
										   request({
											  url: "http://api.prosperent.com/api/search?limit=1000&page=1&filterCategory=" + encodeCata+str_arr[mcount]+"&filterTwoTapSupported=1&api_key=0da1ade1627ce72127d551d52d5b55e7",
											  method: 'GET'
											}, function (errg, responseg, bodyg) {

											  if (!errg && responseg.statusCode === 200) {
												pBody = JSON.parse(bodyg);
												totalRecordsFound = 0;
												if(pBody)
												totalRecordsFound = pBody.totalRecordsFound;
											       if (totalRecordsFound > 0) {
													
													bulk = ProductProsperent.collection.initializeUnorderedBulkOp();

														  for (var i = 0; i < totalRecordsFound; i += 1) {
															bulk.insert(pBody.data[i]);
														  }

														  bulk.execute(function (errx) {
															    mcount +=1;
																console.log(totalRecordsFound);
															    	request({
																			  url: "http://api.prosperent.com/api/search?limit=1000&page=1&filterCategory=" + encodeCata+str_arr[mcount]+"&filterTwoTapSupported=1&api_key=0da1ade1627ce72127d551d52d5b55e7",
																			  method: 'GET'
																			}, function (errg1, responseg1, bodyg1) {

																			  if (!errg1 && responseg1.statusCode === 200) {
																				pBody = JSON.parse(bodyg1);
																				totalRecordsFound =0;
																				if(pBody)
																				totalRecordsFound = pBody.totalRecordsFound;
																				   if (totalRecordsFound > 0) {
																					
																					bulk = ProductProsperent.collection.initializeUnorderedBulkOp();

																						  for (var i = 0; i < totalRecordsFound; i += 1) {
																							bulk.insert(pBody.data[i]);
																						  
																							if(i+1==totalRecordsFound) {
																								  bulk.execute(function (errx1) {
																									if(errx1){
																										
																										console.log(errx);
																										console.log(encodeCata);
																										console.log(str_arr[mcount]);
																									    mcount +=1;
																										
																										page += 1;
																										next();
																									}
																									else {	
																									    mcount +=1;
																										
																										page += 1;
																										next();
																									}
																								  });
																							}																			
																						
																						} // for end 
																				} else{
																					 page += 1;
																					 next();
																					
																				}

																			   
																			  } else {

																				page += 1;
																				next();
																				cat_err.push({ 'category': cata, 'err': err });
																			  }
																			})

														  });
											 
												} else{
													 page += 1;
													 next();
													
												}

											   
											  } else {

												page += 1;
												next();
												cat_err.push({ 'category': cata, 'err': err });
											  }
											})
									
									}
									else if (totalRecordsFound > 0) {
										
										// since it is within range of 1000 it should start insert 
										  request({
											  url: "http://api.prosperent.com/api/search?limit=1000&page=1&filterCategory=" + encodeCata +"&filterTwoTapSupported=1&api_key=0da1ade1627ce72127d551d52d5b55e7",
											  method: 'GET'
											}, function (errcat, responsecat, bodycat) {

											  if (!errcat && responsecat.statusCode === 200) {
												pBody = JSON.parse(bodycat);
												totalRecordsFound = pBody.totalRecordsFound;
										          if (totalRecordsFound > 0) {
													
													bulk = ProductProsperent.collection.initializeUnorderedBulkOp();

														  for (var i = 0; i < totalRecordsFound; i += 1) {
																if(pBody.data[i]!=null)
																bulk.insert(pBody.data[i]);
														  
															  if(i+1==totalRecordsFound) {
																   bulk.execute(function (errx) {
																	  page += 1;
																		next();
																  });
															  }
														  
														  }

														 
											 
												}
												else{
													 page += 1;
													 next();
													
												}

											   
											  } else {

												page += 1;
												next();
												cat_err.push({ 'category': cata, 'err': err });
											  }
											})
										
										}
									else{
										 page += 1;
										 next();
										
									}

								   
								  } else {

									page += 1;
									next();
									cat_err.push({ 'category': cata, 'err': err });
								  }
								});
							  }, function () {      //  A callback which is called after the test function has failed and repeated execution of fn has stopped
								  console.log("function end");
							  });
						  });// categories sync find end   
										  
									  
				  
	////////////////////////////////////////////////////////////////////////////			  
				  } // here store has been okay
			  
			  }
				  
        
        }
      });

    */
    
	
	

 // }); // delete end
};

// insert a chunk of data
function getProd(data, next) {
  var bulk = ProductProsperent.collection.initializeUnorderedBulkOp();
  var i = 0;

  for (i = 0; i < data.length; i += 1) {
    bulk.insert(data[i]);
  }

  bulk.execute(function (errx) {
    if (errx) { return; }

  });
}
/*
 schedule.scheduleJob({ hour: 10, minute: 1 }, function() {
	syncProductsAdd();

  }); */
	


app.get('/', function(req, res, next) {
	
	syncProductsAdd();

	res.send("new end");
	
})



app.listen(1900);
