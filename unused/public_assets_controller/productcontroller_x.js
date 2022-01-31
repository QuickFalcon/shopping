// Controller For Search Page ======= and Search result shop page
SSApp.controller('searchapicontroller', ['$scope', '$http', 'searchServiceM','$route', '$routeParams', '$location','$cookies','$interval', function ($scope, $http, searchServiceM, $route, $routeParams, $location,$cookies,$interval) {
    $scope.$parent.currentpage = 1;
    
	
	var smerchant;
    if(angular.isDefined($routeParams.merchant) &&  $routeParams.merchant.trim()!="")
    smerchant= $routeParams.merchant.trim(); // retrieve id
    
    var catal;
    if(angular.isDefined($scope.shopcatset) && $scope.shopcatset){
           
               
             //   $scope.$parent.selected_categorylist =[];
              //  $scope.$parent.selected_categorylist.push(smerchant);
                console.log("hi");
       }
     else
     {
        
       // $scope.$parent.stopclickInterval();
        //$scope.$parent.intervalgapGeneratelink(); // create link
         $scope.$parent.filterBrandListEnable = false;
         $scope.$parent.filterMerchantListEnable = false;  


        if(angular.isDefined(smerchant) && smerchant.trim()!="")
        {

        $scope.$parent.products = [];
        $scope.$parent.totalRecordsFound =0;

        $scope.$parent.selected_merchantlist =[];
        $scope.$parent.selected_merchantlistByclick =[];
        $scope.$parent.selected_merchantlistByclick.push(smerchant);
        $scope.$parent.selected_merchantlist.push(smerchant);

        $scope.$parent.pro ={};
        $scope.$parent.pro[smerchant] = true;
        $scope.$parent.prosearch ={};
        $scope.$parent.prosearch[smerchant] = true;
        angular.element('main-search').scope().vm.checkAllShop =false;



        }  
    }

    var tempo;
    var pushtrue = true;
    var path = $location.path();
     var searchParams ={path :'divine'}; 

    if(angular.isDefined($scope.pathTorch)) {
        tempo = $scope.pathTorch;
    }

    var tempo=[];
    var pushtrue = true;
    var url1;
    if($scope.loggeding) {
        url1 = '#!/dashboard';
        temppath = {'poth':'#!/dashboard','label':'Dashboard'};
        tempo.push(temppath);
    }
    else {
        url1 = '#!/';
        temppath = {'poth':'#!/','label':'Home'};
        tempo.push(temppath);

    }

    var url2;
    var temppath;
    $scope.$parent.proLoading = true;
 

    if(angular.isDefined(smerchant) && smerchant.trim()!="") {
       

        $scope.similiaritems = [];
        $scope.$parent.cartpopupsimiliaritems = [];

        $scope.$parent.merchantSetfromSearchBoxString =false; // not selected from search box
    	$scope.$parent.categorySetfromSearchBoxString =false;
    	$scope.$parent.brandSetfromSearchBoxString =false;
		$scope.$parent.saleSetfromSearchBoxString =false;
		$scope.$parent.colorSetfromSearchBoxString =false;
		
        $scope.$parent.searchforstring ="";

        var merchants = {stores: $scope.selected_merchantlistByclick};
  
 
        $http.post('/get_storelistSlider', merchants).then(function (stores) {
            $scope.currentstore = stores.data;
            console.log(stores.data);
        },function (err) {
			$scope.currentstore =[];
            console.log(err);

        });



        // if already in storechosen path free last store
        var url = '#!/storechosen/'+smerchant;
        var temppath = {'poth':url,'label':  smerchant};
         var slink;   
         
 

           relevancy ="filterTwoTapSupported=1&filterMerchant="+smerchant+"&relevancyThreshold=.9&limit=19&page=1&sortBy=relevance&groupBy=productId";
           slink = {'path': relevancy};
         
         searchServiceM.searchOperationProsperentMain(slink).then(function (similiarresponse) {
                $scope.similiaritems = similiarresponse.data;

            
            },function (error) {
                console.log(error);
            })
         

        url2 = '#!/store_chosen/'+smerchant;
        temppath = {'poth':url,'label':smerchant};
        tempo.push(temppath);
     
        $scope.$parent.filterCatMerchantBrandList = true;   

    }
    else {
        url2 = '#!/searchResult_notsign';
        temppath = {'poth':url,'label':  'SEARCH'};
        tempo.push(temppath);
 
		 if($scope.firsttime.loading == 0) // search result page first time load
         $scope.$parent.filterCatMerchantBrandList = false;
         else
          $scope.$parent.filterCatMerchantBrandList = true;   
		   
    }
    $scope.$parent.pathTorch =tempo;



    var arr = [];
    var tarry = ['accessories', 'bag', 'beauty', 'gap', 'gifts', 'home', 'jeans', 'kids', 'men', 'overstock', 'pant', 'shirt', 'shoe', 'women'];
    //  var countries = [];
    var tempname;
    var tempcode;
    var tempimg;
    var tempbrand;
    var tempcategory;
    var tempprice;
    var temppricesale;
    var tempcurrency;
    var tempmerchant;
    var tempaffiliate_url;
    var tempdiscount = false;
    var temppercentoff = 0;

    $("#brandz").scroll(function () {
        $scope.load_more_brand();
    });

    $scope.load_more_brand = function () {

        if ($scope.busy || $scope.brand_start > $scope.number_BrandPage)
            return;
        $scope.$parent.busy = true;
        $scope.$parent.generateAllBrands();

    }
    $scope.set_current_product = function (pro) {

        $scope.$parent.current_product = pro;
        $scope.$parent.set_product_scope(pro);
    }


    // ----------- Search Fucntion Within The page Not globar search ------
    $scope.searching_within_page = function (keystring,$event) {

            // $scope.$parent.merchantSetfromSearchBoxString =false;
            // $scope.$parent.categorySetfromSearchBoxString =false;
            // $scope.$parent.brandSetfromSearchBoxString =false;
            // $scope.$parent.colorSetfromSearchBoxString =false;
            // $scope.$parent.saleSetfromSearchBoxString =false;
        $scope.$parent.loaddone =false;
        $scope.ocassion_casual = false;
        $scope.ocassion_vacation = false;
        $scope.ocassion_work = false;
        $scope.ocassion_other = false;    
		$scope.$parent.selected = "";
        $scope.$parent.filterCatMerchantBrandList = true;
        $scope.$parent.filterBrandListEnable = false;
         $scope.$parent.filterMerchantListEnable = false;
         $scope.$parent.selected_key =keystring;

        if(angular.isDefined(keystring) && keystring.trim()!="") {
          	
	
            // in past u have select store from search key so changing will remove store
			$scope.$parent.selectedKeyWord = angular.copy(keystring);
			
			$scope.$parent.searchforstring =angular.copy(keystring);		
			$scope.$parent.proLoading = true;

            
            SSmixPanel.lookingFor(keystring);
          
              
			   var keywordarr = keystring.split(" ");
          
                
				 $scope.$parent.searching_product($event,false);
				
				for(var k=0;k<keywordarr.length;kk++) {
                  
                        if(keywordarr[k].trim()!="") {
                            $scope.$parent.new_keyword_arr.push(keywordarr[k]);
                        }

                }
          
		
		
		}

    }

    // changing merchant
 $scope.setIsDiscount = function ($event,saletrue) {
        $scope.$parent.loaddone =false;
        $scope.$parent.filterCatMerchantBrandList = true;
        $scope.$parent.filterBrandListEnable = false;
        $scope.$parent.filterMerchantListEnable = false;

        $event.stopPropagation();
        $scope.$parent.globalSearch = false;
        $scope.$parent.proLoading = true;

        $scope.$parent.stopclickInterval();

        $scope.$parent.saleOffer = saletrue;
        $scope.$parent.intervalgapGeneratelink();
        if(saletrue)
		$scope.$parent.queryobj.sale_offer = saletrue;
	    else {
			delete $scope.queryobj.sale_offer;
		}
		
		
    }


    ///////////////////////////////////////////////////////
	/*on click merchant change function */
	$scope.changeMerchantList = function (merchant, obj, retailerObj) {
        
        $scope.$parent.loaddone =false;
		

		//$scope.$parent.new_keyword_arr =[];

        $scope.$parent.globalSearch = false;
         
        $scope.$parent.filterCatMerchantBrandList = false;
        $scope.$parent.filterMerchantListEnable = true;
        $scope.$parent.filterBrandListEnable = false;
       
        $scope.$parent.stopclickInterval();
        $scope.$parent.proLoading = true;

        var index = -1;
        var index1 = -1;
        index1 = $scope.$parent.selected_merchantlistByclick.indexOf(merchant);
        var timegaping=0;
        var IntervalMerchant;
        if (obj) {

   

            if (index1 < 0) {
                $scope.$parent.selected_merchantlistByclick.push(merchant);

                $scope.$parent.ms["checkAllShop"] = false;
                angular.element('main-search').scope().vm.checkAllShop =false;


                $scope.$parent.pro[merchant] = true;  // make top as true

            }


            if(path.indexOf('storechosen')> -1) {

                IntervalMerchant = $interval(function () {
                    if (timegaping> 3000) {
                        if($scope.selected_merchantlistByclick.length>1 ) {

                            $location.path('/searchResult_notsign');
                            $route.reload();

                            $scope.$parent.intervalgapGeneratelink();

                        }
                        else if($scope.selected_merchantlistByclick.length==1 && smerchant!=merchant)
                        {
                            $location.path('/storechosen/'+merchant);
                            $route.reload();
                             
						   $scope.$parent.intervalgapGeneratelink();

                        }

                        $interval.cancel(IntervalMerchant);

                    }

                    timegaping = timegaping + 1001;

                }, 1001);


            }
            else
			{  

		        $scope.$parent.intervalgapGeneratelink();
         
			}
		}
        else {


            if (index1 > -1) {
                $scope.$parent.selected_merchantlistByclick.splice(index1, 1);
                angular.element('main-search').scope().vm.checkAllShop =false;

                $scope.$parent.pro[merchant] = false;  // make top as true

            }
            

            if(path.indexOf('storechosen')> -1) {

                IntervalMerchant = $interval(function () {
                    if (timegaping> 3500) {
                        if($scope.selected_merchantlistByclick.length==0) {

                            $location.path('/searchResult_notsign');
                            $route.reload();

							$scope.$parent.intervalgapGeneratelink();

                        }
                        else if($scope.selected_merchantlistByclick.length==1 && smerchant!=merchant)
                        {
                            $location.path('/storechosen/'+merchant);
                            $route.reload();
                            
							$scope.$parent.intervalgapGeneratelink();

                        }
                        $interval.cancel(IntervalMerchant);
                        console.log("I am in unselect checkbox");
                    }

                    timegaping = timegaping + 1201;

                }, 1201);


            }
            else
			{  

				$scope.$parent.intervalgapGeneratelink();
            
			} 

        }
    };

    /*Category search from on click */
    $scope.catSearch = function (cate,booldata) {
	   $scope.$parent.loaddone =false;
       $scope.$parent.filterCatMerchantBrandList = true;
   
        $scope.$parent.filterMerchantListEnable = false;

        $scope.$parent.filterBrandListEnable = false;
    
       var index = $scope.selected_categorylist.indexOf(cate);
        $scope.$parent.shopcatset =false; //shop and cat set become different when user change category

        $scope.$parent.globalSearch = false;
		/*
        if($scope.categorySetfromSearchBoxString){

            $scope.$parent.selected_categorylist =[];
			$scope.$parent.selected ="";
			$scope.$parent.searchforstring = "";
			$scope.$parent.keystringwordcount = 0;
			$scope.$parent.catg ={};
			$scope.$parent.catlocal ={};
		
		     if($scope.merchantSetfromSearchBoxString) {
         
				 $scope.$parent.selected_merchantlistByclick =[];
				 $scope.$parent.pro = {};
				 $scope.$parent.prosearch ={};
				 $scope.$parent.merchantSetfromSearchBoxString = false;
				
                }
		

 		       if($scope.brandSetfromSearchBoxString) { 
                $scope.$parent.selected_brandlist =[]; 
                $scope.$parent.brdg ={};
                $scope.$parent.brdglocal ={};
                $scope.$parent.brandSetfromSearchBoxString =false;

               }        
                 if($scope.saleSetfromSearchBoxString) {  
                    $scope.$parent.saleOffer =false;
                    $scope.$parent.saleSetfromSearchBoxString =false;
                }
				
				if($scope.colorSetfromSearchBoxString)
				{
				  $scope.$parent.color_arr=[];
                  $scope.$parent.temcol ={};
                  $scope.temcol ={};
                  $scope.$parent.colorSetfromSearchBoxString =false;


                }
       
		        $scope.$parent.categorySetfromSearchBoxString =false;


        }
		*/
		
        $scope.$parent.stopclickInterval();


        if(booldata) {


            if(index < 0) {
                $scope.$parent.selected_categorylist.push(cate);
                $scope.$parent.catg[cate] = booldata;
                angular.element('main-search').scope().vm.checkAllCat =false;

                $scope.$parent.intervalgapGeneratelink();

            }
            else
                {
                    $scope.$parent.intervalgapGeneratelink();
                } 
        }
        else {
            if (index > -1) {
                
				
				
				$scope.$parent.selected_categorylist.splice(index, 1);
                console.log($scope.selected_categorylist.length);
				$scope.$parent.catg[cate] = booldata;

                angular.element('main-search').scope().vm.checkAllCat =false;
                $scope.$parent.intervalgapGeneratelink();
            }
            else
               { 
                $scope.$parent.intervalgapGeneratelink();
               }

        }
    }


    // adding brands
    $scope.changeBrandList = function (brand, obj, brdObj) {
        $scope.$parent.loaddone =false;
        $scope.$parent.filterCatMerchantBrandList = false;
        $scope.$parent.filterBrandListEnable = true;
        $scope.$parent.filterMerchantListEnable = false;
       var sarr = $scope.selected_brandlist;


       $scope.$parent.globalSearch = false;

     
        var index =-1;
        index = sarr.indexOf(brand);
         
        $scope.$parent.stopclickInterval();
        $scope.$parent.proLoading = true;

        if (obj) {

            if(index < 0) {
                $scope.$parent.selected_brandlist.push(brand);
                $scope.$parent.brdg[brand] = obj;
                angular.element('main-search').scope().vm.checkAllDegnr=false;

                $scope.$parent.intervalgapGeneratelink();
            }
            else
                $scope.$parent.intervalgapGeneratelink();


        }
        else {

            if (index > -1) {

                sarr.splice(index, 1);
                $scope.$parent.brdg[brand] = obj;
                angular.element('main-search').scope().vm.checkAllDegnr=false;
                $scope.$parent.selected_brandlist =sarr;
                $scope.$parent.intervalgapGeneratelink();
            }
            else {
                $scope.$parent.intervalgapGeneratelink();

            }
        }


    };

    $scope.setColorWithThis = function (val,color) {
        $scope.$parent.stopclickInterval();
        $scope.$parent.proLoading = true;
        $scope.$parent.globalSearch = false;
        $scope.$parent.filterCatMerchantBrandList = true;
        $scope.$parent.filterMerchantListEnable = false;
        $scope.$parent.filterBrandListEnable = false;
     

       var colindex =$scope.color_arr.indexOf(color);

        if(val) {

            if(colindex<0) {
                $scope.$parent.color_arr.push(color);
            
                $scope.$parent.queryobj.color = $scope.color_arr;
            }


        } else {

            if(colindex>-1) {
                $scope.$parent.color_arr.splice(colindex,1);

                if(color_arr.length>0) {
                     $scope.$parent.queryobj.color = $scope.color_arr;

                } else {

                     delete $scope.$parent.queryobj.color;
                }


            }


        }
        $scope.$parent.intervalgapGeneratelink();
    }


// ----------- Searching-----------------------
    /*on submit function*/


    //changing categories
    // change sort

    // change the sort order of returned data


    $scope.$parent.atleast_one = 0;


   

    $scope.setminprice= function() {

        $scope.$parent.globalSearch = false;
        $scope.$parent.filterCatMerchantBrandList = true;
        $scope.$parent.filterMerchantListEnable = false;
        $scope.$parent.filterBrandListEnable = false;

        if($scope.cost.range[0]>$scope.cost.range[1])
        {

            $scope.$parent.common_popup_header = "Price Range Error";
            $scope.$parent.common_popup_message = "minimum price can not be larger than maximum price ";
            $('#commonPopup').modal('show');


            return;
        }
        
        $scope.$parent.stopclickInterval();
        $scope.$parent.intervalgapGeneratelink();
        $scope.$parent.loaddone =false;
    }

    $scope.setmaxprice= function() {

		$scope.$parent.globalSearch = false;
        $scope.$parent.filterCatMerchantBrandList = true;
        $scope.$parent.filterMerchantListEnable = false;
        $scope.$parent.filterBrandListEnable = false;
        if($scope.cost.range[0]>$scope.cost.range[1])
        {


            $scope.$parent.common_popup_header = "Price Range Error";
            $scope.$parent.common_popup_message = "maximum price can not be smaller than minimum price ";
            $('#commonPopup').modal('show');
            return;
        }

        $scope.$parent.stopclickInterval();

        $scope.$parent.intervalgapGeneratelink();
        $scope.$parent.loaddone =false;
    }




    $scope.commonAction = function (oc_type, boolObj) {
        $scope.$parent.stopclickInterval();
        $scope.$parent.loaddone =false;
		$scope.$parent.globalSearch = false;
        $scope.$parent.filterCatMerchantBrandList = true;
        $scope.$parent.filterMerchantListEnable = false;
        $scope.$parent.filterBrandListEnable = false;
        if (boolObj) {
            if (oc_type == 'casual')
                $scope.$parent.oc_casual = true;
            else if (oc_type == 'work')
                $scope.$parent.oc_work = true;

            else if (oc_type == 'vacation')
                $scope.$parent.oc_vacation = true;

            else if (oc_type == 'other')
                $scope.$parent.oc_other = true;

        }
        else {
            if (oc_type == 'casual')
                $scope.$parent.oc_casual = false;
            else if (oc_type == 'work')
                $scope.$parent.oc_work = false;

            else if (oc_type == 'vacation')
                $scope.$parent.oc_vacation = false;

            else if (oc_type == 'other')
                $scope.$parent.oc_other = false;

        }

        $scope.$parent.intervalgapGeneratelink();

    }//------------------- page change event-----------------------------


$scope.clearFilter = function () {
        $scope.$parent.loaddone =false;

        $scope.$parent.timeGap = 0;
        $scope.$parent.stopclickInterval();
        $scope.$parent.selected = "";
        $scope.$parent.searchforstring = "";
        $scope.$parent.filterCatMerchantBrandList = true;
        $scope.$parent.filterMerchantListEnable = false;
        $scope.$parent.filterBrandListEnable = false;

        $scope.$parent.globalSearch = false;

        $scope.$parent.proLoading = true;
        $scope.$parent.selected_key ="";
        $scope.$parent.new_keyword_arr=[];
        $scope.selected_key ="";

        $scope.$parent.ms.checkAllShop =true;
        angular.element('main-search').scope().vm.checkAllShop =true;

        $scope.$parent.ms.checkAllCat=true;
        angular.element('main-search').scope().vm.checkAllCat =true;

        $scope.$parent.ms.checkAllDegnr=true;
        angular.element('main-search').scope().vm.checkAllDegnr=true;


        $scope.$parent.pro ={};
        $scope.$parent.catg ={};
        $scope.$parent.brdg={};
        $scope.$parent.color_arr =[];
        $scope.$parent.prosearch = {}; 
        $scope.$parent.catlocal ={}; 
        $scope.$parent.brdglocal={};
        $scope.temcol={};
        
        $scope.$parent.cost = {
            range: [0.00, 1000000.00]
        };
       
        $scope.$parent.percent = {

            range: [0.00, 100.00]

        };

        $scope.$parent.CurrentPage = 1;
        $scope.$parent.extendedurl = "";
        $scope.$parent.selected_groupby = "";
        $scope.$parent.select_color = "";
        $scope.$parent.selected_merchantlist = [];
        $scope.$parent.select_merchant = "";

        $scope.$parent.selected_brandlist = [];
        $scope.$parent.select_brand = "";

        $scope.$parent.selected_categorylist = [];
        $scope.$parent.select_category = "";
        // check is there any sale offer running

        $scope.saleOffer = false;
        $scope.$parent.saleOffer = false;
        $scope.premiumMerchant = false;
        $scope.$parent.premiumMerchant = false;


        $scope.ocassion_casual = false;
        $scope.ocassion_vacation = false;
        $scope.ocassion_work = false;
        $scope.ocassion_other = false;
        $scope.$parent.oc_casual = false;
        $scope.$parent.oc_work = false;
        $scope.$parent.oc_vacation = false;
        $scope.$parent.oc_other = false;
        $scope.$parent.merchantSetfromSearchBoxString =false;
        $scope.$parent.categorySetfromSearchBoxString =false;
        $scope.$parent.brandSetfromSearchBoxString =false;
        $scope.$parent.colorSetfromSearchBoxString =false;
        $scope.$parent.saleSetfromSearchBoxString =false;
        $scope.$parent.searchforstring ="";
        $scope.$parent.selected_merchantlistByclick =[];
        $scope.$parent.intervalgapGeneratelink();

        if(angular.isDefined(smerchant)) {
            $scope.$parent.selected_merchantlistByclick[0] =smerchant;
            $scope.$parent.selected_merchantlist[0] =smerchant;

            $scope.$parent.pro[smerchant] = true;
            $scope.$parent.prosearch[smerchant] = true;
            $scope.$parent.ms["checkAllShop"] = false;
            angular.element('main-search').scope().vm.checkAllShop =false;

        }
    
    }


    // api price filter
    $scope.priceFilter = function (pro) {
        if (pro.price_sale == "") {
            return pro.price >= $scope.cost.range[0] && pro.price <= $scope.cost.range[1];
        }
        else {
            return pro.price_sale >= $scope.cost.range[0] && pro.price_sale <= $scope.cost.range[1];
        }
    }

    // api percent filter
    $scope.percentFilter = function (pro) {
        return pro.percentOff >= $scope.percent.range[0] && pro.percentOff <= $scope.percent.range[1];
    }

    // color channging reset also 
   


    

    $scope.setPrice = function (min, max, val, whichOneCheck) {

        $scope.$parent.stopclickInterval(); // cancel previous interval
        $scope.$parent.proLoading = true;
        $scope.$parent.filterCatMerchantBrandList = true;
        $scope.$parent.filterMerchantListEnable = false;
        $scope.$parent.filterBrandListEnable = false;

        if (val) {
            $scope.$parent.cost.range[0] = min;
            $scope.$parent.cost.range[1] = max;
            $scope.$parent.atleast_one = 1;

            $scope.$parent.priceRange0_100 = false;
            $scope.$parent.priceRange100_300 = false;
            $scope.$parent.priceRange300_500 = false;
            $scope.$parent.priceRange500_1000 = false;
            $scope.$parent.priceRange1000_2500 = false;
            $scope.$parent.priceRange2500_1000000 = false;


            if (whichOneCheck == 0) {
                $scope.priceRange0_100 = true;
                $scope.priceRange100_300 = false;
                $scope.priceRange300_500 = false;
                $scope.priceRange500_1000 = false;
                $scope.priceRange1000_2500 = false;
                $scope.priceRange2500_1000000 = false;
                $scope.$parent.priceRange0_100 = true;


            }
            else if (whichOneCheck == 1) {
                $scope.priceRange0_100 = false;
                $scope.priceRange100_300 = true;
                $scope.priceRange300_500 = false;
                $scope.priceRange500_1000 = false;
                $scope.priceRange1000_2500 = false;
                $scope.priceRange2500_1000000 = false;
                $scope.$parent.priceRange100_300 = true;


            }
            else if (whichOneCheck == 2) {
                $scope.priceRange0_100 = false;
                $scope.priceRange100_300 = false;
                $scope.priceRange300_500 = true;
                $scope.priceRange500_1000 = false;
                $scope.priceRange1000_2500 = false;
                $scope.priceRange2500_1000000 = false;

                $scope.$parent.priceRange300_500 = true;

            }
            else if (whichOneCheck == 3) {
                $scope.priceRange0_100 = false;
                $scope.priceRange100_300 = false;
                $scope.priceRange300_500 = false;
                $scope.priceRange500_1000 = true;
                $scope.priceRange1000_2500 = false;
                $scope.priceRange2500_1000000 = false;

                $scope.$parent.priceRange500_1000 = true;

            }
            else if (whichOneCheck == 4) {
                $scope.priceRange0_100 = false;
                $scope.priceRange100_300 = false;
                $scope.priceRange300_500 = false;
                $scope.priceRange500_1000 = false;
                $scope.priceRange1000_2500 = true;
                $scope.priceRange2500_1000000 = false;

                $scope.$parent.priceRange1000_2500 = true;
            }
            else if (whichOneCheck == 5) {
                $scope.priceRange0_100 = false;
                $scope.priceRange100_300 = false;
                $scope.priceRange300_500 = false;
                $scope.priceRange500_1000 = false;
                $scope.priceRange1000_2500 = false;
                $scope.priceRange2500_1000000 = true;

                $scope.$parent.priceRange2500_1000000 = true;
            }


        }
        else {



            $scope.$parent.cost = {
                range: [0.00, 1000000.00]
            };

            $scope.$parent.atleast_one = 0;
            $scope.$parent.priceRange0_100 = false;
            $scope.$parent.priceRange100_300 = false;
            $scope.$parent.priceRange300_500 = false;
            $scope.$parent.priceRange500_1000 = false;
            $scope.$parent.priceRange1000_2500 = false;
            $scope.$parent.priceRange2500_1000000 = false;

            if (whichOneCheck == 0) {
                $scope.priceRange0_100 = false;
            }
            else if (whichOneCheck == 1) {
                $scope.priceRange100_300 = false;
            }
            else if (whichOneCheck == 2) {

                $scope.priceRange300_500 = false;
            }
            else if (whichOneCheck == 3) {

                $scope.priceRange500_1000 = false;
            }
            else if (whichOneCheck == 4) {

                $scope.priceRange1000_2500 = false;
            }
            else if (whichOneCheck == 5) {

                $scope.priceRange2500_1000000 = false;
            }


        }

        $scope.$parent.intervalgapGeneratelink();
    }


    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };


    $scope.$on('colorNull', function (e) {
     $scope.temcol ={};
    });
    $scope.$on('searchboxNull', function (e) {
     $scope.selected_key ="";
    });
    $scope.$on('saleboxNull', function (e) {

       $scope.saleOffer =false;


    });

     $scope.$on('occasionFalse', function (e) {

        $scope.ocassion_casual = false;
        $scope.ocassion_vacation = false;
        $scope.ocassion_work = false;
        $scope.ocassion_other = false;

    });
    $scope.$parent.firsttime.loading =1;

}]);
