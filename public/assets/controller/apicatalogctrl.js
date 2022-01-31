////////////// Controller for product detail page//////////////////////
SSApp.controller('APIcatalogCtrl', ['$scope', '$http', '$routeParams', 'searchServiceCount', 'searchServiceCatalog', '$route', '$window', '$sce', '$interval', '$cookies', '$location', 'SocialProductService', function ($scope, $http, $routeParams, searchServiceCount, searchServiceCatalog, $route, $window, $sce, $interval, $cookies, $location, SocialProductService) {
	//$scope.$parent.collective_review = false;
	$scope.$parent.addTobagPossible = true;
    $scope.$parent.ck_all = true;
	$scope.$parent.backupimages ="";
	$scope.$parent.backupaltimages ="";
    var j;
    $scope.$parent.cleaning();
    $scope.similiaritems = [];
    $scope.$parent.cartpopupsimiliaritems = [];
    $scope.product = {};
    $scope.alt_images = j;
    $scope.twotapapicallfinish = false;

    $scope.searchpopulartag = function (keyword, $event) {
        $scope.$parent.searchbytag(keyword, $event);

    }
	
	$scope.seeCollectiveReview = function(user_id){
        console.log("I am here");		
		$scope.ss.activeTab=6;
         $scope.collective_review = true;
		 var count=0;
		 var photouserid;
		 var commentuserid;
		 var arr =[];
		     if($scope.product.productsocial.photos.length>0) {
					
					for(var k=0;k<$scope.product.productsocial.photos.length;k++){

						photouserid = $scope.product.productsocial.photos[k].user._id;
						console.log(user_id);
						console.log("buddhi");
						console.log(photouserid);
						
						if(photouserid==user_id){

							if(count==0){
								arr.push($scope.product.productsocial.photos[k].photo);

								
							} else {
							  	arr.push(responsep.product[0].alt_images[k]);	
							}
							count = count +1;
						}
						
						
						
			         if(k+1==$scope.product.productsocial.photos.length){

						$scope.product.merged_images = angular.copy(arr);	
						
					 }
			
				}
					
				
				
					for(var k=0;k<$scope.product.productsocial.comments.length;k++){

						commentuserid = $scope.product.productsocial.comments[k].user._id;
					
						
						if(commentuserid==user_id){

							        angular.element('#proSocial').removeAttr('class');

									 angular.element('#proSocial').addClass("rateis r" + $scope.product.productsocial.comments[k].rateVal);
									 angular.element('#mycommentid').text($scope.product.productsocial.comments[k].comment);
			
								
							
						}
					
					
					}
				
				
				}
		
	 }
	
    $scope.shipping_countries_support = j;
    $scope.billing_countries_support = j;
    $scope.single_shipping_options = j;
    $scope.return_options = j;

    $scope.required_field_values = {quantity: 1};
    $scope.quant = "1";

    var timeCurrent;
    var lp = $location.path();
    $cookies.put('lastitem', lp);

    //	$scope.$storage = $localStorage;
    $scope.CatId = $routeParams.CatalogId; // retrieve  catalog id
    $scope.producttitle = $routeParams.producttitle;


    var cp = 0;
    if ($scope.loggedin != 1) {
        $scope.eststring = "Estimated "
        eststring = "Estimated ";
    }
    else {
        $scope.eststring = "";
        eststring = "Estimated ";
    }


    $scope.twotapapidataready = 0;
    $scope.coloravnum = 0;
    $scope.msg = "";
    var indexcol;

    // colorArr full json 
    $scope.set_color = function (colorArr, itemByColor) {
        var i = 0;
        var num = -1;
        var tempname;
        for (i = 0; i < colorArr.length; i++) {

            if (colorArr[i].text == itemByColor.text) {
                num = i;
                $scope.colorText = colorArr[i].text;

                if (angular.isDefined(colorArr[num].image))
                    $scope.product.image_url = colorArr[num].image;


                if (colorArr[num].dep.size) {
                    $scope.sizejson = colorArr[num].dep.size;
                    $scope.required_field_values.size = null;

                }


                for (var j = 0; j < $scope.required_field_names.length; j++) {
                    tempname = $scope.required_field_names[j];
                    if (colorArr[num].dep.hasOwnProperty(tempname)) {


                        if (tempname != 'quantity' && tempname != 'color' && tempname != 'size') {

                            if (colorArr[num].dep[tempname]) {
                                $scope.requiredjsons[tempname] = colorArr[num].dep[tempname];

                                $scope.required_field_values[tempname] = null;
                            }

                        }

                    }
                }


                cp = colorArr[num].price.substring(1);


                $scope.product.image_url = colorArr[num].image;
                $scope.product.current_price = parseFloat(cp, 10);

                if ($scope.product.price_sale != '' && $scope.product.price_sale != null && $scope.product.price_sale != -1)
                    $scope.product.price_sale = angular.copy($scope.product.current_price);
                else
                    $scope.product.price = angular.copy($scope.product.current_price);

                if (angular.isDefined(colorArr[num].extra_info)) {
                    $scope.product.extra_info = colorArr[num].extra_info;
                }
            }
        }


        if (angular.isDefined(colorArr.extra_info)) {

            $scope.product.extra_info = colorArr.extra_info;
        }

    }


    $scope.get_related_color_list = function (completeSizeJson) {
        if (completeSizeJson.dep.color) {
            $scope.colorjson = completeSizeJson.dep.color;
        }
    }
    $scope.get_related_size_list = function (completeJson) {
        if (completeJson.dep.size) {
            $scope.sizejson = completeJson.dep.size;
        }
    }

    $scope.get_related_option_list = function (completeJson) {
        if (completeJson.dep.size) {
            $scope.optionjson = completeJson.dep.size;
        }
    }

    // size and price relation
    $scope.set_size = function (sizeArr, itemBySize) {

        var tempname;
        if (itemBySize.hasOwnProperty('dep')) {

            if (itemBySize.dep.hasOwnProperty('color')) {
                $scope.get_related_color_list(itemBySize);
                $scope.required_field_values.color = null;
                $scope.colorText = null;

            }


            for (var j = 0; j < $scope.required_field_names.length; j++) {
                tempname = $scope.required_field_names[j];
                if (itemBySize.dep.hasOwnProperty(tempname)) {


                    if (tempname != 'quantity' && tempname != 'color' && tempname != 'size') {

                        if (itemBySize.dep[tempname]) {
                            $scope.requiredjsons[tempname] = itemBySize.dep[tempname];

                            $scope.required_field_values[tempname] = null;

                        }

                    }

                }
            }
        }
        if (angular.isDefined(itemBySize.price)) {
            cp = itemBySize.price.substring(1);
            $scope.product.current_price = parseFloat(cp, 10);
            $scope.subtotal = eststring + "subtotal $ " + $scope.product.current_price;
        }

        if (angular.isDefined(itemBySize.image)) {
            $scope.product.image_url = itemBySize.image;
        }

        if (angular.isDefined(itemBySize.extra_info)) {
            $scope.product.extra_info = itemBySize.extra_info;
        }


    }

    $scope.set_option = function (optionjson, itemByOption) {


        if (angular.isDefined(itemByOption.extra_info)) {
            $scope.product.extra_info = itemByOption.extra_info;
        }

        if (angular.isDefined(itemByOption.price)) {
            cp = itemBySize.price.substring(1);

            $scope.product.current_price = parseFloat(cp, 10);
            $scope.subtotal = eststring + "subtotal $ " + $scope.product.current_price;
        }

        if (itemByOption.hasOwnProperty('dep')) {

            if (itemByOption.dep.hasOwnProperty('color')) {
                $scope.get_related_color_list(itemByOption);
                $scope.required_field_values.color = null;
                $scope.colorText = null;


            }
            if (itemByOption.dep.hasOwnProperty('size')) {
                $scope.get_related_size_list(itemByOption);
                $scope.required_field_values.size = null;

            }
        }

    }
    //https://linksearch.api.cj.com/v2/link-search?website-id=7095303&advertiser-ids=2609575&link-type=Text+Link&promotion-type=coupon&page-number=1&records-per-page=20
    var cat_arr = [];
    cat_arr.push('shoe');
    cat_arr.push('sandal');
    cat_arr.push('boots');
    cat_arr.push('sneakers');
    cat_arr.push('slippers');
    cat_arr.push('trainers');
    cat_arr.push('bra');

    cat_arr.push('kid');
    cat_arr.push('child');
    cat_arr.push('toddler');
    cat_arr.push('baby');
    cat_arr.push('shirt');
    cat_arr.push('pant');
    cat_arr.push('trouser');
    cat_arr.push('coat');
    cat_arr.push('jacket');
    cat_arr.push('blazer');
    cat_arr.push('blouse');
    cat_arr.push('sweater');
    cat_arr.push('dress');
    var tem;
    var pota;
    var tem2;
    var pota2;
    var pth;

    var link;

    $scope.cart_id = "";
    var cataId = "";
    cataId = $routeParams.CatalogId;
    $scope.twotap_builtin_cart_single = {};
    $scope.estimate = {};
    /*
     $scope.$on('$destroy', function () {
     // Make sure that the interval is destroyed too
     $scope.stoplefyInterval();

     });
     */
    $scope.set_json_field = function (requiredjsons, selectedjson) {

        // $scope.required_field_values.size = size;
        var tempname;
        var selectedfield;
        // $scope.required_field_values.size = size;
        var tempname;

        if (angular.isDefined(selectedjson.price)) {
            var cpx = selectedjson.price.substring(1);
            var pr = parseFloat(cpx, 10);
            $scope.product.current_price = pr;

            if ($scope.product.price_sale != '' && $scope.product.price_sale != null && $scope.product.price_sale != -1)
                $scope.product.price_sale = pr;
            else
                $scope.product.price = pr;

            $scope.subtotal = "" + "subtotal $ " + pr;
        }
        if (angular.isDefined(selectedjson.extra_info)) {
            $scope.product.extra_info = selectedjson.extra_info;
        }

        if (angular.isDefined(selectedjson.image)) {
            $scope.product.image_url = selectedjson.image;
        }


        if (selectedjson.hasOwnProperty('dep')) {
            for (var j = 0; j < $scope.required_field_names.length; j++) {
                tempname = $scope.required_field_names[j];
                if (selectedjson.dep.hasOwnProperty(tempname)) {

                    if (tempname == 'color') {
                        $scope.get_related_color_list(selectedjson);
                        $scope.required_field_values.color = null;
                        $scope.colorText = null;

                    }
                    else if (tempname == 'size') {
                        $scope.get_related_size_list(selectedjson);
                        $scope.required_field_values.size = null;


                    } else if (tempname != 'quantity') {

                        if (selectedjson.dep[tempname]) {
                            $scope.requiredjsons[tempname] = selectedjson.dep[tempname];
                            $scope.required_field_values[tempname] = null;


                        }
                    }

                }
            }
        }
    }

$scope.showMoreLikes = false;

      $scope.getAllLikesList  = function () {

          SocialProductService
            .getAllLikes({ catalogId: $scope.product.catalogId })
            .$promise
            .then(function(likes) {
              $scope.product.productsocial.likes = likes;
              $scope.product.productsocial.clickingdown= true; 
			   
			   $scope.showMoreLikes = true;

			
			});
        }
    function retrive_product_data(catalogId) {
        searchServiceCatalog.searchOperationProsperentProductByCatalog(catalogId).then(function (responsep) {

            $scope.product = responsep.product[0];
			$scope.$parent.backupimages = angular.copy(responsep.product[0].image_url);
            $scope.$parent.backupaltimages= angular.copy(responsep.product[0].alt_images);
			
			var arr =[];
			arr.push(responsep.product[0].image_url);
			
			if(angular.isDefined(responsep.product[0].alt_images) && responsep.product[0].alt_images!=null)
			{
				
				for(var t=0;t<responsep.product[0].alt_images.length;t++) {
					
					arr.push(responsep.product[0].alt_images[t]);
					
				}
				
			}
            $scope.product.merged_images = angular.copy(arr);
            $scope.ss.activeTab=2;
			//$scope.product.alt_images = responsep.product[0].alt_images;
            $scope.$parent.metaxdescription = responsep.product[0].description;
            $scope.$parent.title = 'SS-' + responsep.product[0].keyword;
            $scope.$parent.metax = responsep.product[0].keyword + ',' + responsep.product[0].category + ',' + responsep.product[0].merchant + ',' + responsep.product[0].brand;
            $scope.$parent.og_image = responsep.product[0].image_url;
            $cookies.put('lastcatalog', $routeParams.CatalogId);
            $cookies.put('lastcatalogtitle', $scope.product.keyword);

            $scope.$parent.jantuPakhi = $scope.product.twoTapProductUrl; // product url for checkout
            $scope.retrievebrand = $scope.product.brand;
            
			 SocialProductService
			.getProductSocials({catalogId: $routeParams.CatalogId})
			.$promise
			.then(function (socials) {

				var data = {};
				data.socials = socials;

				console.log(socials);

				data.hasAllLikes = data.socials.likes.length < 50;

				// put the primary first
				data.socials.photos.forEach(function (photo, i) {
					// TODO: check user?
					if (photo.primary) {
						// move to first
						data.socials.photos.splice(0, 0, data.socials.photos.splice(i, 1)[0]);
					}
				});

				$scope.productsocial = socials;
				$scope.product.productsocial = socials;
				$scope.product.productsocial.clickingdown= false; 
										var photouserid;
                if($scope.product.productsocial.photos.length>0) {
					
					for(var k=0;k<$scope.product.productsocial.photos.length;k++){

						photouserid = $scope.product.productsocial.photos[k].user._id;
						
						if($scope.product.productsocial.rateDetails!=null) {
							for(var j=0;j< $scope.product.productsocial.rateDetails.length;j++){
								
								if(photouserid ==$scope.product.productsocial.rateDetails[j].user._id){
									$scope.product.productsocial.photos[k].rate = $scope.product.productsocial.rateDetails[j].rate;
								}
							}
						}	
					
					
					}
					
				}    
				// Inject rating class in slider
				 angular.element('#proSocial').addClass("rateis r" + $scope.product.productsocial.rate);
             angular.element('#mycommentid').text($scope.product.productsocial.comment);
			
			if(angular.isDefined($scope.collectivepage) && angular.isDefined($scope.collectiveuserid)){
					if($scope.collectivepage)
					$scope.seeCollectiveReview($scope.collectiveuserid)
			  } 
			});
			
			
			var catArr = [];
            catArr.push($scope.product.category);

            var sale_offer = false;
            if ($scope.product.price_sale != -1) {
                sale_offer = true;
            }

            if (angular.isDefined($scope.product.current_price))
                $scope.current_price = $scope.product.current_price;
            else {

                if ($scope.product.price_sale > -1 && $scope.product.price_sale != null) {
                    $scope.product.current_price = $scope.product.price_sale;
                    $scope.current_price = $scope.product.price_sale;
                } else {
                    $scope.product.current_price = $scope.product.price_sale;
                    $scope.current_price = $scope.product.price;
                }

            }
            var affurl = {affiliate_url: $scope.product.twoTapAffiliateLink}

            var arrUrl = [];
            arrUrl[0] = $scope.product.twoTapProductUrl;

            var realurlx = {realurl: $scope.product.twoTapProductUrl};
            //****find out original url from affiliated url  ****//

            var pro_url = {product_urls: arrUrl};


            var tempmix;
            var count = 0;
            var splittempix;
            $scope.productpage_popularsearch = [];

            var keyword = angular.lowercase($scope.product.keyword);
            var category = angular.lowercase($scope.product.category);
            if (angular.isDefined($scope.searchtermarr) && $scope.searchtermarr.length > 0) {


                for (var mx = 0; mx < $scope.searchtermarr.length; mx++) {
                    tempmix = angular.lowercase($scope.searchtermarr[mx]);


                    splittempix = tempmix.split(" ");
                    for (var splitindex = 0; splitindex < tempmix.length; splitindex++) {
                        if (keyword.indexOf(splittempix[splitindex]) > 0) {
                            $scope.productpage_popularsearch.push(tempmix);
                            break;
                        }
                    }
                    if ($scope.productpage_popularsearch.length >= 5)
                        break;
                }

            }

            //$scope.$parent.sizeCategory = undefined;

            for (var jx = 0; jx < cat_arr.length; jx++) {
                if (category.indexOf(cat_arr[jx]) > 0) {
                    $scope.$parent.sizeCategory = cat_arr[jx];
                    break;
                }
            }
            sShoppable.zoomInOut(); // for zoom in zoom out


            var relevancy;
            var slink;
            var sameproductdata;


            slink = {'path': relevancy};
            //var sameprolink= {'path': pthSameProductDifferentStore,start:0,offset:30,sortorder:6};
            var sameProduct = {
                productId: $scope.product.productId,
                available: true,
                start: 0,
                offset: 30,
                sortorder: 6
            };
            var sameCategoryObj = {categoryList: catArr, available: true, start: 0, offset: 30, sortorder: 6};

            var tempobj;
            //$scope.$apply(); 

            searchServiceCount.searchOperationProsperent(sameCategoryObj).then(function (similiarresponse) {


                var t;

                if (similiarresponse.product.length > 0) {
                    tempobj = similiarresponse.product;
                }
                searchServiceCount.searchOperationProsperent(sameProduct).then(function (sameProductx) {
                    if (sameProductx.product.length > 0) {
                        sameproductdata = sameProductx.product;

                        if (similiarresponse.product.length > 0) {

                            var z = tempobj.concat(sameproductdata);
                            $scope.$parent.cartpopupsimiliaritems = z;
                            $scope.similiaritems = z;
                        }
                        else {
                            $scope.similiaritems = sameproductdata;
                            $scope.$parent.cartpopupsimiliaritems = $scope.similiaritems;

                        }
                    } else {
                        $scope.similiaritems = tempobj;
                        $scope.$parent.cartpopupsimiliaritems = $scope.similiaritems;
                    }


                })

            }, function (similiarresponse) {


                searchServiceCount.searchOperationProsperent(sameProduct).then(function (sameProduct) {

                    $scope.similiaritems = sameProduct.product;
                    $scope.$parent.cartpopupsimiliaritems = $scope.similiaritems;
                })


            }) // incase error
            if (angular.isDefined($scope.product.required_field_names)) {
                $scope.avail = $scope.product.available;
                $scope.cart_id = '';
                $scope.md5prokey = $scope.product.md5;
                $scope.required_field_names = $scope.product.required_field_names;

                if (angular.isDefined($scope.product.required_field_values)) {

                    $scope.requiredjsons = $scope.product.required_field_values;

                    if ($scope.product.required_field_names.indexOf('color') > -1) {
                        $scope.colorjson = $scope.product.required_field_values.color;
                    }
                    if ($scope.product.required_field_names.indexOf('size') > -1) {
                        $scope.sizejson = $scope.product.required_field_values.size;
                    }

                }
                $scope.twotapapidataready = 1;

            }


            var tem;
            var pota = [];
            var length = 0;
            var ret;
            if (!Date.now) {
                timeCurrent = function now() {
                    return new Date().getTime();
                }
            }
            else {
                timeCurrent = Date.now();
            }

            // $window.localStorage.removeItem("recentI");
            var obj = {"timestamp": {}};
            if (angular.isDefined($window.localStorage.getItem('recentI')) && $window.localStorage.getItem('recentI') != null) {
                tem = $window.localStorage.getItem('recentI');
                pota = JSON.parse(tem);
                length = Object.keys(pota).length;
                // we are gonna iterate for 20 times
                if (length >= 19) {
                    length = 19;

                }


                for (var p = 0; p < Object.keys(pota).length; p++) {
                    if (angular.isDefined(pota[p]) && pota[p] != null) {
                        var checkobj = pota[p].timestamp;
                        for (var single_recent in checkobj) {
                            if (checkobj[single_recent].catalogId == $scope.product.catalogId) {
                                pota.splice(p, 1);
                                p = p - 1;
                            }

                        }
                    }
                }
                obj["timestamp"] = {};
                obj["timestamp"][timeCurrent] = $scope.product;


                var temp;
                for (var i = Object.keys(pota).length; i >= 0; i--) {
                    if (i == 0)
                        pota[i] = obj;
                    else
                        pota[i] = pota[i - 1];

                    if (i + 1 == Object.keys(pota).length) {

                        $scope.recentItemsx = pota;
                    }
                }

            }
            else {

                // pota[length] =$scope.twotap_builtin_cart_single;
                obj.timestamp[timeCurrent] = $scope.product;
                pota[0] = obj;
                $scope.recentItemsx = pota;
            }


            ret = JSON.stringify(pota);
            $window.localStorage.setItem('recentI', ret);
            $scope.$parent.estimated_move_price_totals ={};

            $http.post('/twotap_cart_single_product', pro_url).then(function (response) {


                var avail = false;

                var pri = 0;
                var ori_pri = 0;
                if (response.data.productCartDetails.unknown_urls.length > 0) {
                    console.log('unknwon url for checkout');
                    $http.post('/ProductProsperentUpdate', {
                        available: false,
                        catalogId: $scope.product.catalogId,
                    }).then(function (response) {
                        console.log(response);

                    })
                    return;
                }

                if (response.data.message == 'done' || response.data.message == 'has_failures') {
                    $scope.twotap_single_product = response.data.productCartDetails;
                    console.log($scope.twotap_single_product);
                    $scope.tcart_id = response.data.productCartDetails.cart_id;

                    if (angular.isDefined(response.data.estimation))
                        $scope.$parent.estimated_move_price_totals = response.data.estimation.estimated_total_prices;
                    else {
                        
						$scope.$parent.estimated_move_price_totals = {subtotal: $scope.product.current_price};


                    }
                    if (response.data.message == 'has_failures') {

                        avail = false;
                        for (var si in response.data.productCartDetails.sites) {
                            for (var pmd5 in response.data.productCartDetails.sites[si].failed_to_add_to_cart) {

                                //$scope.md5prokey = pmd5;
                                $scope.twotap_single_product.sites[si].failed_to_add_to_cart[pmd5].catalogId = $scope.product.catalogId;

                            }
                            $scope.shipping_countries_support = response.data.productCartDetails.sites[si].shipping_countries_support;
                            $scope.billing_countries_support = response.data.productCartDetails.sites[si].billing_countries_support;
                            $scope.single_shipping_options = response.data.productCartDetails.sites[si].shipping_options;
                            $scope.return_options = response.data.productCartDetails.sites[si].returns;

                        }
                        $http.post('/ProductProsperentUpdate', {
                            available: false,
                            catalogId: $scope.product.catalogId
                        }).then(function (response) {

                            console.log("update twotap data ");
                        })
                    }
                    else if (response.data.message == 'done') {

                        avail = true;
                        for (var si in response.data.productCartDetails.sites) {
                            $scope.shipping_countries_support = response.data.productCartDetails.sites[si].shipping_countries_support;
                            $scope.billing_countries_support = response.data.productCartDetails.sites[si].billing_countries_support;
                            $scope.single_shipping_options = response.data.productCartDetails.sites[si].shipping_options;
                            $scope.return_options = response.data.productCartDetails.sites[si].returns;
                            for (var pmd5 in response.data.productCartDetails.sites[si].add_to_cart) {

                                //$scope.md5prokey = pmd5;

                                $scope.twotap_single_product.sites[si].add_to_cart[pmd5].catalogId = $scope.product.catalogId;
                                pri = $scope.twotap_single_product.sites[si].add_to_cart[pmd5].price.substring(1);

                                if ($scope.twotap_single_product.sites[si].add_to_cart[pmd5].hasOwnProperty('original_price')) {
                                    if ($scope.twotap_single_product.sites[si].add_to_cart[pmd5].original_price != null) {
                                        ori_pri = $scope.twotap_single_product.sites[si].add_to_cart[pmd5].original_price.substring(1);
                                        var original_price = parseFloat(ori_pri, 10);
                                        $scope.bonus = original_price - $scope.product.current_price;
                                    }

                                }

                            }
                        }

                        $http.post('/ProductProsperentUpdate', {
                            available: true,
                            catalogId: $scope.product.catalogId
                        }).then(function (response) {
                            console.log(response);

                        })
                    }


                }

                $scope.twotapapicallfinish = true;

            }, function (response) {
                console.log("api call error");
                $scope.twotapapicallfinish = true;


            });

            /*
             $http.post('/twotap_cart_single_product', pro_url).then(function (response) {
             $scope.avail = response.data.availability;
             $scope.msg = response.data.message;

             var avail = false;
             var obj = {"timestamp": {}};
             var pri = 0;
             var ori_pri =0;
             if(response.data.productCartDetails.unknown_urls.length>0) {
             console.log('unknwon url for checkout');
             $http.post('/ProductProsperentUpdate', {available:false,catalogId:$scope.product.catalogId,}).then(function (response) {
             console.log(response);

             })
             return;
             }

             if (response.data.message == 'done' || response.data.message == 'has_failures') {
             $scope.cartProductStatus = response.data.productCartDetails;
             $scope.twotap_builtin_cart_single = response.data.productCartDetails;
             $scope.cart_id = response.data.productCartDetails.cart_id;

             if(angular.isDefined(response.data.estimation))
             $scope.$parent.estimated_move_price_totals =response.data.estimation.estimated_total_prices;
             else
             {
             $scope.$parent.estimated_move_price_totals ={subtotal:$scope.product.current_price };


             }
             if (response.data.message == 'has_failures') {

             avail = false;
             for (var si in $scope.twotap_builtin_cart_single.sites) {
             for (var pmd5 in $scope.twotap_builtin_cart_single.sites[si].failed_to_add_to_cart) {

             $scope.md5prokey = pmd5;

             if (pmd5.image == "" || pmd5.image == null) {

             $scope.twotap_builtin_cart_single.sites[si].failed_to_add_to_cart[pmd5].image = $scope.product.image_url;

             }
             $scope.twotap_builtin_cart_single.sites[si].failed_to_add_to_cart[pmd5].catalogId = $scope.product.catalogId;


             if(angular.isDefined($scope.twotap_builtin_cart_single.sites[si].failed_to_add_to_cart[pmd5].price))
             {
             if($scope.twotap_builtin_cart_single.sites[si].failed_to_add_to_cart[pmd5].price!=null){

             pri = $scope.twotap_builtin_cart_single.sites[si].failed_to_add_to_cart[pmd5].price.substring(1);
             }
             //$scope.product.current_price = parseFloat(pri, 10);
             }
             $scope.alt_images = response.data.productCartDetails.sites[si].failed_to_add_to_cart[pmd5].alt_images;

             if(angular.isDefined(response.data.productCartDetails.sites[si].failed_to_add_to_cart[pmd5].required_field_values)) {

             if(response.data.productCartDetails.sites[si].failed_to_add_to_cart[pmd5].required_field_values.hasOwnProperty('color'))
             $scope.colorjson = response.data.productCartDetails.sites[si].failed_to_add_to_cart.required_field_values.color;

             if(response.data.productCartDetails.sites[si].failed_to_add_to_cart[pmd5].required_field_values.hasOwnProperty('size'))
             $scope.sizejson = response.data.productCartDetails.sites[si].failed_to_add_to_cart[pmd5].required_field_values.size;

             if(response.data.productCartDetails.sites[si].failed_to_add_to_cart[pmd5].required_field_values.hasOwnProperty('option'))
             $scope.optionjson = response.data.productCartDetails.sites[si].failed_to_add_to_cart[pmd5].required_field_values.option;
             }


             }
             $scope.shipping_countries_support = $scope.twotap_builtin_cart_single.sites[si].shipping_countries_support;
             $scope.billing_countries_support = $scope.twotap_builtin_cart_single.sites[si].billing_countries_support;


             }
             $scope.twotapapidataready = 1;
             $http.post('/ProductProsperentUpdate', {available:false,catalogId:$scope.product.catalogId}).then(function (response) {


             })
             }
             else if (response.data.message == 'done') {

             avail = true;
             for (var si in $scope.twotap_builtin_cart_single.sites) {
             $scope.shipping_countries_support = $scope.twotap_builtin_cart_single.sites[si].shipping_countries_support;
             $scope.billing_countries_support = $scope.twotap_builtin_cart_single.sites[si].billing_countries_support;

             for (var pmd5 in $scope.twotap_builtin_cart_single.sites[si].add_to_cart) {

             $scope.md5prokey = pmd5;
             if (pmd5.image == "" || pmd5.image == null) {
             $scope.twotap_builtin_cart_single.sites[si].add_to_cart[pmd5].image = $scope.product.image_url;
             }
             $scope.twotap_builtin_cart_single.sites[si].add_to_cart[pmd5].catalogId = $scope.product.catalogId;
             pri = $scope.twotap_builtin_cart_single.sites[si].add_to_cart[pmd5].price.substring(1);
             //  $scope.product.current_price = parseFloat(pri, 10);
             $scope.alt_images = $scope.twotap_builtin_cart_single.sites[si].add_to_cart[pmd5].alt_images;

             $scope.requiredjsons = $scope.cartProductStatus.sites[si].add_to_cart[pmd5].required_field_values;


             if($scope.cartProductStatus.sites[si].add_to_cart[pmd5].required_field_values.hasOwnProperty('color'))
             $scope.colorjson = $scope.cartProductStatus.sites[si].add_to_cart[pmd5].required_field_values.color;

             if($scope.cartProductStatus.sites[si].add_to_cart[pmd5].required_field_values.hasOwnProperty('size'))
             $scope.sizejson = $scope.cartProductStatus.sites[si].add_to_cart[pmd5].required_field_values.size;


             if($scope.cartProductStatus.sites[si].add_to_cart[pmd5].required_field_values.hasOwnProperty('option'))
             $scope.optionjson = $scope.cartProductStatus.sites[si].add_to_cart[pmd5].required_field_values.option;

             if($scope.twotap_builtin_cart_single.sites[si].add_to_cart[pmd5].hasOwnProperty('original_price'))
             {
             if($scope.twotap_builtin_cart_single.sites[si].add_to_cart[pmd5].original_price!=null) {
             ori_pri = $scope.twotap_builtin_cart_single.sites[si].add_to_cart[pmd5].original_price.substring(1);
             $scope.original_price = parseFloat(ori_pri, 10);
             $scope.bonus = $scope.original_price - $scope.product.current_price;
             }

             }
             $scope.required_field_names = angular.copy(response.data.productCartDetails.sites[si].add_to_cart[pmd5].required_field_names);

             }
             }
             $scope.twotapapidataready = 1;
             $http.post('/ProductProsperentUpdate', {available:true,catalogId:$scope.product.catalogId}).then(function (response) {
             console.log(response);

             })
             }
             else {
             $scope.twotapapidataready = 1;
             }

             var tem;
             var pota = [];
             var length = 0;
             var ret;
             if (!Date.now) {
             timeCurrent = function now() {
             return new Date().getTime();
             }
             }
             else {
             timeCurrent = Date.now();
             }

             // $window.localStorage.removeItem("recentI");

             if (angular.isDefined($window.localStorage.getItem('recentI')) && $window.localStorage.getItem('recentI') != null) {
             tem = $window.localStorage.getItem('recentI');
             pota = JSON.parse(tem);

             length = Object.keys(pota).length;
             console.log(length);
             // we are gonna iterate for 20 times
             if (length >= 19) {
             length = 19;

             }

             obj["timestamp"] = {};
             obj["timestamp"][timeCurrent] = $scope.twotap_builtin_cart_single;


             var temp;
             for (var i = length; i >= 0; i--) {
             if (i == 0)
             pota[i] = obj;
             else
             pota[i] = pota[i - 1];
             }

             }
             else {

             // pota[length] =$scope.twotap_builtin_cart_single;
             obj.timestamp[timeCurrent] = $scope.twotap_builtin_cart_single;
             pota[0] = obj;

             }


             ret = JSON.stringify(pota);
             $window.localStorage.setItem('recentI', ret);

             var keyid;
             var keys = [];
             var price;
             var eststring = "";


             var sites_arr = [];
             var skey;
             var md5prokey;
             var con_j = [];
             var site_arraysite_array = [];
             for (skey in response.data.productCartDetails.sites) {
             sites_arr.push(skey);
             $scope.skey = skey;
             site_arraysite_array.push(skey);
             }

             $scope.s_array = sites_arr;  //make an array of sites

             var para_json = {
             "cart_id": response.data.productCartDetails.cart_id,
             "fields_input": {}

             }
             var shoption = "cheapest";
             var cart_by_site;
             var product_key_md5;
             var j;
             var gcard;
             var gpin;
             for (var counter = 0; counter < site_arraysite_array.length; counter++) // for one site
             {
             siteskey = site_arraysite_array[counter]; // getting single site

             // set shipping option along price
             var found_ship = false;
             angular.forEach(response.data.productCartDetails.sites[siteskey].shipping_options, function (shipvalue, shipkey) {
             if (!found_ship) {
             response.data.productCartDetails.sites[siteskey].shipping_option = shipkey;
             shoption = response.data.productCartDetails.sites[siteskey].shipping_option;
             }
             if (shipvalue == 'cheapest') {
             found_ship = true;
             }
             else if (shipvalue == 'default') {
             found_ship = true;
             }
             });


             var address_user = {};

             if (angular.isDefined($scope.shipping_address))
             address_user = {
             "shipping_address": $scope.shipping_address.address,
             "shipping_city": $scope.shipping_address.city,
             "shipping_state": $scope.shipping_address.state,
             "shipping_country": $scope.shipping_address.country,
             "shipping_zip": $scope.shipping_address.zip
             };


             if (angular.isDefined(shoption)) {

             para_json.fields_input[siteskey] = {
             "noauthCheckout": address_user,
             "addToCart": {
             // product_md5 will be dynamic
             },
             "shipping_option": shoption
             }

             }
             else {
             para_json.fields_input[siteskey] = {
             "noauthCheckout": address_user,
             "addToCart": {
             // product_md5 will be dynamic
             }
             }
             }


             cart_by_site = response.data.productCartDetails.sites[siteskey].add_to_cart; // each site have single add to cart
             j = 0;
             for (product_key_md5 in cart_by_site) // each cart have multiple product key md5
             {
             para_json.fields_input[siteskey]["addToCart"][product_key_md5] = {};
             para_json.fields_input[siteskey]["addToCart"][product_key_md5]["quantity"] = 1;
             }
             }
             // console.log(para_json);
             $http.post("https://api.twotap.com/v1.0/cart/estimates?public_token=" + $scope.twotap_public_token, para_json).then(function (response3) {

             var n;
             var siter_id;
             var shipping_method;
             var pata = $location.path();
             //console.log(response3.data);
             $scope.estimate = response3.data.estimated_total_prices;
             if ($scope.loggedin != 1) {
             eststring = "Estimated ";
             }

             for (var p in $scope.estimate) {

             if (p == "subtotal") {

             var jk = $scope.estimate[p].substring(1);
             //$scope.product.current_price = parseFloat(jk, 10);



             }

             else if (p == "shipping_price") {
             $scope.shipping_price = parseFloat($scope.estimate[p].substring(1), 10);

             }
             else if (p == "sales_tax") {
             $scope.sales_tax = parseFloat($scope.estimate[p].substring(1), 10)

             }
             else if (p == "final_price") {

             $scope.final_price = parseFloat($scope.estimate[p].substring(1), 10);


             }


             }


             }, function (response3) {


             var temp = {"estimated_price_totals": {"final_price": "$0.0", "subtotal": "$0.0"}};

             });


             }



             }, function (response) {
             console.log("api call error");
             $scope.avail = false;
             $scope.msg = response.data.message;
             $scope.twotapapidataready = 1;


             });
             */

            var imgurl = {image_url: $scope.product.image_url}


        }, function (err) {
            $scope.$parent.common_popup_header = "Error Product Details ";
            $scope.$parent.common_popup_message = err;
            $('#commonPopup').modal('show');
        });// catalog wise product call end
    } // retrieve product data

    retrive_product_data($routeParams.CatalogId);


///////////////////////////////////////PRODUCT SAVING ///////////////////////////////////////////////////////////////////////////////////////////////////
    function add_product_into_cart(pro_url, index) {

        var CART_ID;
        var status_coming = false;

        $http.post("https://api.twotap.com/v1.0/cart?public_token=" + $scope.twotap_public_token, pro_url)
            .then(function (response) {
                $scope.details = response.data;
                CART_ID = response.data.cart_id;
                var stop;
                var timer = 0;
                // Don't start a new fight if we are already fighting
                if (angular.isDefined(stop)) return;
                var valid = false;

                stop = $interval(function () {

                    if (!valid) {
                        $http.get("https://api.twotap.com/v1.0/cart/status?public_token=" + $scope.twotap_public_token + "&cart_id=" + CART_ID).then(function (response2) {
                            //

                            if (response2.data.message != "still_processing" || timer > 300000) {
                                $scope.stopFight();
                                valid = true;
                                if (response2.data.message == "done") {
                                    $scope.estimateFunction(response2.data, index, $scope.considered_items); // product added to cart now call estimation function

                                }


                            }
                            console.log(response2.data);

                        })

                    }

                    timer = timer + 3000;


                }, 3000);


            });
    }

    $scope.stopFight = function () {
        if (angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;
        }
    };

    $scope.share = function (catalogId) {

        if ($scope.current_product.likeMe) {

            $scope.$parent.addlike(catalogId);

        }
        else {

            console.log("remove like");
        }

    }

    $scope.loadSlider = false;
    // adding product into cart
    $scope.addToCartSingle = function (product, twotap_builtin_cart_single) {
        $scope.loadSlider = true;
        var quant = parseInt($scope.required_field_values.quantity);
        $scope.required_field_values.quantity = quant;
        $scope.$parent.addToCart(product, quant, twotap_builtin_cart_single, $scope.required_field_values, $scope.product.current_price, $scope.skey, $scope.md5prokey, '');
        $scope.$parent.move_item.title = product.keyword;
        $scope.$parent.move_item.brand = product.brand;
        $scope.$parent.move_item.catalogId = product.catalogId;
        $scope.$parent.num_moved = quant;
        $scope.$parent.move_text = 'Cart';
        if (angular.isDefined($scope.colorText))
            $scope.$parent.move_item.colorText = angular.copy($scope.colorText);

    }
    // add item inside wish list
    $scope.addtoWishlistSingle = function (product, twotap_wish_cart, catalogId, retailer) {

        if ($scope.loggedin == 0 || $scope.loggedin === undefined) {
            var p = $location.path();
            $scope.after_login_location = p;
            $("#login-popup").modal("show");

            sShoppable.ssLogIn();
            return;
        }

        var s_product = {'catalogId': catalogId, 'retailer': retailer};

        var quant = parseInt($scope.required_field_values.quantity);
        $scope.required_field_values.quantity = quant;

        $scope.$parent.addToWishlistMod(product, quant, twotap_wish_cart, $scope.required_field_values, $scope.product.current_price, $scope.skey, $scope.md5prokey, twotap_wish_cart.cart_id, $scope.avail);
        $scope.$parent.move_item.title = product.keyword;
        $scope.$parent.move_item.brand = product.brand;
        $scope.$parent.move_item.catalogId = product.catalogId;
        $scope.$parent.num_moved = quant;
        $scope.$parent.move_text = 'Wishlist';
        if (angular.isDefined($scope.colorText))
            $scope.$parent.move_item.colorText = angular.copy($scope.colorText);

    }


    $scope.$parent.loadfull = true;
    $('#quick-popup').modal('hide');

    $scope.$parent.firsttime.loading = 1;

   

}]);
