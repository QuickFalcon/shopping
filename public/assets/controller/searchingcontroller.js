// Controller For Search Page ======= and Search result shop page
//mongodb://localhost:27017/?3t.ssh=true&3t.sshAddress=104.236.166.98&3t.sshPort=22&3t.sshAuthMode=password&3t.sshUser=root&3t.sshPassword=allah1

SSApp.controller('searchapicontroller', ['$scope', '$http', '$routeParams', '$location','categoryNode',  function ($scope, $http, $routeParams, $location,categoryNode) {



    $scope.$parent.addTobagPossible = true;
	$scope.$parent.ck_all = true;
    
    // already loaded show static brands	
	if($scope.firsttime.loading == 1) {
	 
	 if($scope.brandGroupShow.C) {


                $scope.$parent.brandGroupShow.C = false;
                $scope.$parent.brandGroupShow.D = false;
                $scope.$parent.brandGroupShow.E = false;
                $scope.$parent.brandGroupShow.F = false;
                $scope.$parent.brandGroupShow.G = false;
                $scope.$parent.brandGroupShow.H = false;
                $scope.$parent.brandGroupShow.I = false;
                $scope.$parent.brandGroupShow.J = false;
                $scope.$parent.brandGroupShow.K = false;
                $scope.$parent.brandGroupShow.L = false;
                $scope.$parent.brandGroupShow.M = false;
                $scope.$parent.brandGroupShow.N = false;
                $scope.$parent.brandGroupShow.O = false;
                $scope.$parent.brandGroupShow.P = false;
                $scope.$parent.brandGroupShow.Q = false;
                $scope.$parent.brandGroupShow.R = false;
                $scope.$parent.brandGroupShow.S = false;
                $scope.$parent.brandGroupShow.T = false;
                $scope.$parent.brandGroupShow.U = false;
                $scope.$parent.brandGroupShow.V = false;
                $scope.$parent.brandGroupShow.W = false;
                $scope.$parent.brandGroupShow.X = false;
                $scope.$parent.brandGroupShow.Y = false;
                $scope.$parent.brandGroupShow.Z = false;



            }

     $scope.$parent.showstatic =false;
	} 
	  
	  
	$scope.$parent.currentpage = 1;
    var smerchant;
    var catal;
    $scope.$parent.filterBrandListEnable = false;
    $scope.$parent.filterMerchantListEnable = false;
    var temppath;
    var tempo;
    var pushtrue = true;
    var path = $location.path();
    var searchParams = {path: 'divine'};
    tempo = [];
    var url1;
    var url2;
    $scope.$parent.proLoading = true;
  /*
  if (angular.isDefined($scope.pathTorch)) {
        tempo = $scope.pathTorch;
    } */
    if ($scope.loggeding) {
        url1 = '#!/dashboard';
        temppath = {'poth': '#!/dashboard', 'label': 'Dashboard'};
        tempo.push(temppath);
    }
    else {
        url1 = '#!/';
        temppath = {'poth': '#!/', 'label': 'Home'};
        tempo.push(temppath);
    }



    if (angular.isDefined($routeParams.merchant) && $routeParams.merchant.trim() != "") {
        smerchant = $routeParams.merchant.trim(); // retrieve id

        $scope.$parent.products = [];
        $scope.$parent.selected_merchantlist = [];
        $scope.$parent.selected_merchantlistByclick = [];
        $scope.$parent.selected_merchantlistByclick.push(smerchant);
        $scope.$parent.selected_merchantlist.push(smerchant);
        $scope.$parent.pro = {};
        $scope.$parent.pro[smerchant] = true;
        $scope.$parent.prosearch = {};
        $scope.$parent.prosearch[smerchant] = true;
        angular.element('main-search').scope().vm.checkAllShop = false;
        $scope.$parent.queryobj.merchantList = $scope.selected_merchantlist;

        $scope.$parent.similiaritems = [];
        $scope.$parent.cartpopupsimiliaritems = [];
        $scope.$parent.merchantSetfromSearchBoxString = false; // not selected from search box
        $scope.$parent.categorySetfromSearchBoxString = false;
        $scope.$parent.brandSetfromSearchBoxString = false;
        $scope.$parent.saleSetfromSearchBoxString = false;
        $scope.$parent.colorSetfromSearchBoxString = false;
        $scope.$parent.searchforstring = "";
			$scope.$parent.metaxdescription = 'buy product through ecommerce';
			$scope.$parent.title = 'SS-Search';
			$scope.$parent.metax = 'buy product,ecommerce';
        var merchants = {stores: $scope.selected_merchantlistByclick};
        $http.post('/get_storelistSlider', merchants).then(function (stores) {

            console.log(merchants);
            $scope.currentstore = stores.data;

			$scope.$parent.og_image = 'http://104.236.166.98:900/'+$scope.currentstore[0].domain+'.jpg';

        }, function (err) {
            $scope.currentstore = [];
            console.log(err);
			$scope.$parent.og_image = 'http://104.236.166.98/images/logo.jpg';


        });
        // if already in storechosen path free last store
        var url = '#!/storechosen/' + smerchant;
        temppath = {'poth': url, 'label': smerchant};
        var slink;
        var merchantArr = [];
        merchantArr.push(smerchant);
        var sameMerchantObj = {merchantList: merchantArr, available: true, start: 0, offset: 100, sortorder: 6};


        $scope.$parent.getsimiliaritemfrommerchant(sameMerchantObj);

        url2 = '#!/store_chosen/' + smerchant;
        tempo.push(temppath);
        $scope.$parent.filterCatMerchantBrandList = true;
		$scope.$parent.loaddone = false;

        $scope.$parent.stopclickInterval();
        $scope.$parent.intervalgapGeneratelink(); // create link


        $scope.$parent.setlastmerchant(smerchant);

        $scope.$parent.metaxdescription = 'buy product of '+smerchant;
		$scope.$parent.title = 'SS-'+smerchant;
		$scope.$parent.metax =  smerchant;

    }
    else {
        url2 = '#!/search';
        temppath = {'poth': url, 'label': 'SEARCH'};
        tempo.push(temppath);
        if ($scope.firsttime.loading == 0) {// search result page first time load
            $scope.$parent.filterCatMerchantBrandList = false;
             $scope.$parent.loaddone = true;

            $scope.$parent.selected_merchantlist = [];
            $scope.$parent.selected_merchantlistByclick = [];
            $scope.$parent.queryobj = {};
			$scope.$parent.metaxdescription = 'SS-product-search';
			$scope.$parent.title = 'SS-Product-Search';
			$scope.$parent.metax = 'Product,buy,cheap';
        //    $scope.$parent.searchforstring ="please select something";


           $scope.$parent.intervalgapGeneratelink(); // create link
        }
        else
            $scope.$parent.filterCatMerchantBrandList = true;

        $scope.$parent.og_image = 'http://104.236.166.98/images/logo.jpg';

    }



    $scope.$parent.pathTorch = tempo;
    var arr = [];
    $("#brandz").scroll(function () {
       
	   console.log("hey scrolling working");
	   // $scope.load_more_brand();
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
    $scope.searching_within_page = function (keystring, $event) {
        $scope.$parent.loaddone = false;

        $scope.$parent.selected = "";
        $scope.$parent.filterCatMerchantBrandList = true;
        $scope.$parent.filterBrandListEnable = false;
        $scope.$parent.filterMerchantListEnable = false;
        $scope.$parent.selected_key = keystring;
        if (angular.isDefined(keystring) && keystring.trim() != "") {


            $scope.$parent.selectedKeyWord = angular.copy(keystring);
            $scope.$parent.searchforstring = angular.copy(keystring);


            $scope.$parent.searching_product($event, false);
            $scope.$parent.stopclickInterval();
			$scope.$parent.metaxdescription = 'buy product through ecommerce '+keystring;
			$scope.$parent.title = 'SS-Search-'+keystring;
			$scope.$parent.metax = 'buy product,ecommerce,'+keystring;


		}
    }
    // changing merchant
    $scope.setIsDiscount = function ($event, saletrue) {
        reset_search_string();
        $scope.$parent.showstatic = false;
        $scope.$parent.loaddone = false;
        $scope.$parent.filterCatMerchantBrandList = true;
        $scope.$parent.filterBrandListEnable = false;
        $scope.$parent.filterMerchantListEnable = false;
        $event.stopPropagation();
        $scope.$parent.globalSearch = false;
        $scope.$parent.proLoading = true;
        $scope.$parent.stopclickInterval();
        $scope.$parent.saleOffer = saletrue;
        if (saletrue)
            $scope.$parent.queryobj.sale_offer = saletrue;
        else {
            delete $scope.$parent.queryobj.sale_offer;
        }
        $scope.$parent.intervalgapGeneratelink();
    }
    var genderMArr = ['male', 'boy', 'gentleman','man','men'];
    var genderFArr = ['female', 'girl', 'lady','woman','women'];
    // choose product from male 
	$scope.setMale = function (val) {

        reset_search_string();
        $scope.$parent.loaddone = false;
       var tempcol;
        $scope.$parent.filterCatMerchantBrandList = true;
        $scope.$parent.filterBrandListEnable = false;
        $scope.$parent.filterMerchantListEnable = false;
        $scope.$parent.showstatic = false;

        $scope.$parent.globalSearch = false;
        if (val) {
            $scope.$parent.queryobj.male = true;
            $scope.$parent.stopclickInterval();
            $scope.$parent.intervalgapGeneratelink();
        }
        else {


            if($scope.genderFromString) {

                $scope.$parent.loaddone = true;
                return;


            } else {

                delete $scope.$parent.queryobj.male;
                $scope.$parent.stopclickInterval();

                $scope.$parent.intervalgapGeneratelink();
            }


        }




    }
    
	
	// choose product from female 
    $scope.setFemale = function (val) {

        reset_search_string();
        $scope.$parent.loaddone = false;
        $scope.$parent.filterCatMerchantBrandList = true;
        $scope.$parent.filterBrandListEnable = false;
        $scope.$parent.filterMerchantListEnable = false;
        $scope.$parent.showstatic = false;

        $scope.$parent.globalSearch = false;


        if (val) {
            $scope.$parent.queryobj.female = true;
            $scope.$parent.stopclickInterval();
            $scope.$parent.intervalgapGeneratelink();
        }
        else {

            if($scope.genderFromString) {

                $scope.$parent.loaddone = true;
                return;


            }

            else {

                delete $scope.$parent.queryobj.female;
                $scope.$parent.stopclickInterval();
                $scope.$parent.intervalgapGeneratelink();

            }
        }
    }
    ///////////////////////////////////////////////////////
    /*on click merchant change function */
    $scope.changeMerchantList = function (merchant, obj, retailerObj) {

        reset_search_string();
        $scope.$parent.loaddone = false;

        $scope.$parent.globalSearch = false;
        $scope.$parent.filterCatMerchantBrandList = false;
        $scope.$parent.filterMerchantListEnable = true;
        $scope.$parent.filterBrandListEnable = false;
        $scope.$parent.proLoading = true;
        $scope.$parent.showstatic = false;

        var indexMerchant = -1;
        indexMerchant = $scope.$parent.selected_merchantlistByclick.indexOf(merchant);
        var timegaping = 0;
        var IntervalMerchant;
        if (obj) {
            if (indexMerchant < 0) {
                $scope.$parent.stopclickInterval();
                $scope.$parent.selected_merchantlistByclick.push(merchant);
                $scope.$parent.ms["checkAllShop"] = false;
                angular.element('main-search').scope().vm.checkAllShop = false;
                $scope.$parent.pro[merchant] = true;  // make top as true
                $scope.$parent.queryobj.merchantList = $scope.selected_merchantlistByclick;
                $scope.$parent.intervalgapGeneratelink();
            } else {
                $scope.$parent.loaddone = true;
            }
        }
        else {
            if (indexMerchant > -1) {
                $scope.$parent.stopclickInterval();
                $scope.$parent.selected_merchantlistByclick.splice(indexMerchant, 1);
                angular.element('main-search').scope().vm.checkAllShop = false;
                $scope.$parent.pro[merchant] = false;  // make top as true
                console.log($scope.selected_merchantlistByclick.length);
                if ($scope.selected_merchantlistByclick.length == 0)
                    delete $scope.$parent.queryobj.merchantList;
                else
                    $scope.$parent.queryobj.merchantList = $scope.selected_merchantlistByclick;
                $scope.$parent.intervalgapGeneratelink();
            } else {
                $scope.$parent.loaddone = true;
            }
        }
    };

    function reset_search_string(){

        if($scope.searchforstring.trim()!=""){ // search string text is not empty

            if(!(angular.isDefined($scope.selected))) {         // selected text is undefined  which lead reuqires reset

                $scope.searchforstring ="";
                reset_value_associatedWithString();


            } else if($scope.selected.trim()=="") {             // selected text is undefined which lead reset

                $scope.searchforstring ="";
                reset_value_associatedWithString();
            }
        }

    }


    function reset_value_associatedWithString(){

        if($scope.queryobj.hasOwnProperty("keyword")){

            delete $scope.$parent.queryobj.keyword;

        }


        if($scope.genderFromString) {
           if ($scope.queryobj.hasOwnProperty('male'))
               delete $scope.$parent.queryobj.male;
           if ($scope.queryobj.hasOwnProperty('female'))
               delete $scope.$parent.queryobj.female;

           $scope.maleVal = false;
           $scope.femaleVal = false;
           $scope.$parent.genderFromString = false;


       }

       var t;
        var temp_colname;
       if($scope.colorFromString) {
           $scope.$parent.colorFromString = false;

           for(var ci=0;ci<$scope.colorFromStringArr.length;ci++) {
               temp_colname = $scope.colorFromStringArr[ci];
               t = $scope.color_arr.indexOf(temp_colname);
               $scope.color_arr.splice(t, 1);
               $scope.temcol[temp_colname] = false;

               if (ci + 1 == $scope.colorFromStringArr.length) {
                   $scope.$parent.colorFromStringArr = [];

                   if($scope.queryobj.color.length==0) {

                       delete $scope.$parent.queryobj.color;
                       $scope.$parent.color_arr =[];
                   }
                   else
                       $scope.queryobj.color = $scope.$parent.color_arr;




               }
           }

       }
      var tempcat;
        var indexOfCategory;
       if($scope.categoryFromString){

                for(var cati=0;cati<$scope.categoryFromStringArr.length;cati++ ) {

                    tempcat = $scope.categoryFromStringArr[cati];
                     console.log(tempcat);
                     indexOfCategory = $scope.selected_categorylist.indexOf(tempcat);

                    if(indexOfCategory>-1) {

                        $scope.selected_categorylist.splice(indexOfCategory,1);
                        $scope.$parent.catlocal[tempcat]= false;
                        $scope.$parent.catg[tempcat]= false;

                    }

                    if(cati+1==$scope.categoryFromStringArr.length ) {

                        $scope.$parent.categoryFromStringArr = [];

                    }
                }

           $scope.categoryFromString = false;
       }
       var tempbrand;
       var indexOfBrand;

        if($scope.brandFromString){


            for(var brandi=0;brandi<$scope.brandFromStringArr.length;brandi++ ) {

                tempbrand = $scope.brandFromStringArr[brandi];
                indexOfBrand =$scope.queryobj.brandList.indexOf(tempbrand);

                if(indexOfBrand>-1) {

                    $scope.queryobj.brandList.splice(indexOfBrand,1);

                    $scope.$parent.brdg[tempbrand]= false;

                    $scope.$parent.brdglocal[tempbrand]= false;

                }

                if(brandi+1==$scope.brandFromStringArr.length ) {

                    $scope.$parent.brandFromStringArr = [];

                }
            }



            $scope.brandFromString = false;
        }


    }

    /*Category search from on click */

   // old category selected

    $scope.catSearch = function (cate, booldata) {
        reset_search_string();
        $scope.$parent.loaddone = false;
        $scope.$parent.filterCatMerchantBrandList = true;
        $scope.$parent.filterMerchantListEnable = false;
        $scope.$parent.filterBrandListEnable = false;
        var index = $scope.selected_categorylist.indexOf(cate);
        $scope.$parent.shopcatset = false; //shop and cat set become different when user change category
        $scope.$parent.globalSearch = false;
        $scope.$parent.showstatic = false;
        if(booldata) {
            if (index < 0) {
                $scope.$parent.stopclickInterval();
                $scope.$parent.selected_categorylist.push(cate);
                $scope.$parent.catg[cate] = booldata;
                angular.element('main-search').scope().vm.checkAllCat = false;
                $scope.$parent.intervalgapGeneratelink();
            } else {
                $scope.$parent.loaddone = true;
            }
        }
        else {
            if (index > -1) {


                if($scope.categoryFromString) {
					

                   // if remove category is in string of search no impact
                    if($scope.categoryFromStringArr.indexOf(cate)>-1) {
                    $scope.$parent.loaddone = true;
                    $scope.$parent.catg[cate] = booldata;
                    angular.element('main-search').scope().vm.checkAllCat = false;
                    return;
                   }
                }

                $scope.$parent.stopclickInterval();
                $scope.$parent.selected_categorylist.splice(index, 1);
                $scope.$parent.catg[cate] = booldata;
                angular.element('main-search').scope().vm.checkAllCat = false;
                if ($scope.selected_categorylist.length == 0)
                    delete $scope.$parent.queryobj.categoryList;
                $scope.$parent.intervalgapGeneratelink();

            } else {
                $scope.$parent.loaddone = true;
            }
        }
    }
   
   
   function select_subcategory(val,fullLevelcategory,level){
       var temp;
       var main_category_name = fullLevelcategory.category;
       make_fulltree_value_set(level,fullLevelcategory.categoryList,val);
   }

   function make_parent_nodes_empty(level,fullLevelcategory){
       var temp;
       categoryNode.categoryNodeFromId(fullLevelcategory.parent,$scope.all_category,$scope.selected_categorylist).then(function (response) {
           catnode =response.fid;
           var category_name = catnode.category;  //level 4 category name
           $scope.$parent.catlocal[category_name] = false;
           level = catnode.level;       // level 4

           if(response.selected_categorylist.length!= $scope.selected_categorylist.length ){
               $scope.selected_categorylist = response.selected_categorylist;
               $scope.$parent.stopclickInterval();
               $scope.$parent.intervalgapGeneratelink();
           }


           if(level<2){
             return;
           }
           categoryNode.categoryNodeFromId(catnode.parent,$scope.all_category,$scope.selected_categorylist).then(function (response2) {
               var catnode_parent = response2.fid; // level 3

               var category_namex = catnode_parent.category;
               $scope.$parent.catlocal[category_namex] = false;


                var levelx = catnode_parent.level;       // level 3


               if(response2.selected_categorylist.length!= $scope.selected_categorylist.length ){
                   $scope.selected_categorylist = response2.selected_categorylist;
                   $scope.$parent.stopclickInterval();
                   $scope.$parent.intervalgapGeneratelink();
                  console.log("i am here");
               }



               if(levelx<2)
                   return;


               categoryNode.categoryNodeFromId(catnode_parent.parent,$scope.all_category,$scope.selected_categorylist).then(function (response3) {
                   var catnode_parent_grand = response3.fid; // level 3
                   var category_namey = catnode_parent_grand.category;

                   $scope.$parent.catlocal[category_namey] = false;


                   var levely = catnode_parent_grand.level;       // level 3

                   if(response3.selected_categorylist.length!= $scope.selected_categorylist.length ){
                       $scope.selected_categorylist = response3.selected_categorylist;
                       $scope.$parent.stopclickInterval();
                       $scope.$parent.intervalgapGeneratelink();
                   }


                   if(levely<2)
                       return;


                   categoryNode.categoryNodeFromId(catnode_parent_grand.parent,$scope.all_category,$scope.selected_categorylist).then(function (response4) {
                       var catnode_parent_great_grand = response4.fid; // level 3
                       var category_namez = catnode_parent_great_grand.category;

                       $scope.$parent.catlocal[category_namez] = false;


                       var levelz = catnode_parent_great_grand.level;       // level 3

                       if(response3.selected_categorylist.length!= $scope.selected_categorylist.length ){
                           $scope.selected_categorylist = response3.selected_categorylist;
                           $scope.$parent.stopclickInterval();
                           $scope.$parent.intervalgapGeneratelink();
                       }


                       if(levelz<2)
                           return;



                   })



               })



           })

       })
   }
   // getting category details from category id 
   function find_node(cid){
       var fid;
       var temp;
       var matched = false;

       for(var ind=0;ind<$scope.all_category.length;ind++){

           temp =$scope.all_category[ind].cid;
           if(temp ==cid ){
               fid = $scope.all_category[ind];
               matched = true;

           }

           if(ind+1==$scope.all_category.length || matched){

              if(matched){

                return fid;
                  ind = $scope.all_category.length;
              } else {

                  return fid;
                  ind = $scope.all_category.length;


              }


           }



       }

   }
   // it will set subcategory value set if user click on a category
   function make_fulltree_value_set(level,categorylist,val) {

       var temp_cat;
       var temp_cat2;
       var temp_cat4;
       var temp_cat5;

       var temp_cat4_catname;
       var temp_cat5_catname;

       var temp2;
       var level_current;
       var childlist;
       var childlist_level_3;
       var childlist_level_4;
       var childlist_level_5;


       for (var y = 0; y < categorylist.length; y++) {  // level 2

           temp_cat = categorylist[y];
           temp = temp_cat.category;
           childlist =[];
           if(temp_cat.hasOwnProperty("categoryList"))
           childlist = temp_cat.categoryList;

           $scope.$parent.catlocal[temp] = val;
           level_current = level +1;

           if(childlist.length>0){

               for (var z = 0; z < childlist.length; z++) {

                   temp_cat2 = childlist[z];
                   temp2 = temp_cat2.category;
                   childlist_level_3 =[]; // list of categories from level 3
                   if(temp_cat2.hasOwnProperty("categoryList"))
                       childlist_level_3 = temp_cat2.categoryList;

                   $scope.$parent.catlocal[temp2] = val;
                   level_current = level +1;

                   if(childlist_level_3.length>0){

                           for (var p = 0; p < childlist_level_3.length; p++) {

                               temp_cat4 = childlist_level_3[p];
                               temp_cat4_catname = temp_cat4.category;
                               childlist_level_4 =[];
                               if(temp_cat4.hasOwnProperty("categoryList"))
                                childlist_level_4 = temp_cat4.categoryList;

                               $scope.$parent.catlocal[temp_cat4_catname] = val;
                               level_current = level +1;

                               if(childlist_level_4.length>0){

                                    console.log("more to go");

                                   for (var q = 0; q < childlist_level_4.length; q++) {

                                       temp_cat5 = childlist_level_4[q];
                                       temp_cat5_catname = temp_cat5.category;
                                       childlist_level_5 =[];
                                       if(temp_cat5.hasOwnProperty("categoryList"))
                                           childlist_level_5 = temp_cat5.categoryList;

                                       $scope.$parent.catlocal[temp_cat5_catname] = val;
                                       level_current = level +1;

                                       if(childlist_level_5.length>0){

                                           console.log("more to go");

                                       }
                                   }
                               }
                           }
                   }



               }


           }



       }
   }
    $scope.catSearchWithSelectPower = function (cate, booldata, fullLevelcategory,level) {

        reset_search_string();

        $scope.$parent.loaddone = false;
        $scope.$parent.filterCatMerchantBrandList = true;
        $scope.$parent.filterMerchantListEnable = false;
        $scope.$parent.filterBrandListEnable = false;
        var index = $scope.selected_categorylist.indexOf(cate);
        $scope.$parent.shopcatset = false; //shop and cat set become different when user change category
        $scope.$parent.globalSearch = false;
        $scope.$parent.showstatic = false;
        if (booldata) {
            if (index < 0) {
                $scope.$parent.stopclickInterval();
                $scope.$parent.selected_categorylist.push(cate);
                $scope.$parent.catg[cate] = booldata;
                angular.element('main-search').scope().vm.checkAllCat = false;
                $scope.$parent.intervalgapGeneratelink();
                select_subcategory(booldata,fullLevelcategory,level);
            }
            else {
                $scope.$parent.loaddone = true;
                select_subcategory(booldata,fullLevelcategory,level);
            }
        }
        else {
            if (index > -1) {

                if($scope.selected.trim()!="" &&  $scope.selected.indexOf(cate)>-1 ) {

                    $scope.$parent.loaddone = true;
                    $scope.$parent.catg[cate] = booldata;
                    angular.element('main-search').scope().vm.checkAllCat = false;

                    return;
                }
                $scope.$parent.stopclickInterval();
                $scope.$parent.selected_categorylist.splice(index, 1);
                $scope.$parent.catg[cate] = booldata;
                angular.element('main-search').scope().vm.checkAllCat = false;
                if ($scope.selected_categorylist.length == 0)
                    delete $scope.$parent.queryobj.categoryList;




                select_subcategory(booldata,fullLevelcategory,level); // graphical view that subcategory become empty
                removeslectedcategorylist(fullLevelcategory.categoryList);

                $scope.$parent.intervalgapGeneratelink();

                   if(fullLevelcategory.level>1) // make parent nodes as false when level greater than 1
                    make_parent_nodes_empty(fullLevelcategory.level,fullLevelcategory)


            } else {
                $scope.$parent.loaddone = true;
                select_subcategory(booldata,fullLevelcategory,level);  // graphical view that subcategory become empty
                if(fullLevelcategory.level>1) // make parent nodes as false when level greater than 1
                    make_parent_nodes_empty(fullLevelcategory.level,fullLevelcategory)


            }
        }
    }
   // this will remove list of categories from selection
   function removeslectedcategorylist(categorylist){
       var temp;
       var iof;
       for(var p=0;p<categorylist.length;p++){

             temp = categorylist[p].category;



             iof=  $scope.selected_categorylist.indexOf(temp);
            if(iof>-1){

                $scope.$parent.selected_categorylist.splice(iof,1);

            }

       }


   }
    // adding brands
    $scope.changeBrandList = function (brand, obj, brdObj) {

        reset_search_string();
        $scope.$parent.loaddone = false;
        $scope.$parent.limit = 10000;
        $scope.$parent.filterCatMerchantBrandList = false;
        $scope.$parent.filterBrandListEnable = true;
        $scope.$parent.filterMerchantListEnable = false;
        var sarr = $scope.selected_brandlist;
        $scope.$parent.globalSearch = false;
        var index = -1;
        $scope.$parent.showstatic = false;
        index = sarr.indexOf(brand);
        if (obj) {
            if (index < 0) {
                $scope.$parent.stopclickInterval();
                sarr.push(brand);
                $scope.$parent.selected_brandlist = sarr;
                $scope.$parent.brdg[brand] = obj;
                angular.element('main-search').scope().vm.checkAllDegnr = false;
                $scope.$parent.queryobj.brandList = sarr;
                $scope.$parent.intervalgapGeneratelink();
            } else {
                $scope.$parent.loaddone = true;
            }
        }
        else {
            if (index > -1) {




                if($scope.brandFromString){

                   if($scope.brandFromStringArr.indexOf(brand)>-1) { // this brand come from string search

                       $scope.$parent.loaddone = true;
                       $scope.$parent.brdg[brand] = obj;
                       angular.element('main-search').scope().vm.checkAllDegnr = false;
                       return;
                   }


                }

                $scope.$parent.stopclickInterval();
                $scope.$parent.selected_brandlist.splice(index, 1);
                $scope.$parent.brdg[brand] = obj;
                angular.element('main-search').scope().vm.checkAllDegnr = false;

                if (sarr.length == 0) {
                    delete $scope.$parent.queryobj.brandList;
                } else {
                    $scope.$parent.queryobj.brandList = sarr;
                }
                $scope.$parent.intervalgapGeneratelink();
            } else {
                $scope.$parent.loaddone = true;
            }
        }
    };
    $scope.setColorWithThis = function (val, color) {

        $scope.$parent.proLoading = true;
        $scope.$parent.globalSearch = false;
        $scope.$parent.filterCatMerchantBrandList = true;
        $scope.$parent.filterMerchantListEnable = false;
        $scope.$parent.filterBrandListEnable = false;
        $scope.$parent.loaddone = false;
        $scope.$parent.showstatic = false;
        var colindex = $scope.color_arr.indexOf(color);
        if (val) {
            if (colindex < 0) {
                $scope.$parent.stopclickInterval();
                $scope.$parent.color_arr.push(color);
                $scope.$parent.queryobj.color = $scope.color_arr;
                $scope.$parent.intervalgapGeneratelink();
            } else {
                $scope.$parent.loaddone = true;
            }
        }
        else {
            if (colindex > -1) {


                if($scope.colorFromString) {

                    if($scope.colorFromStringArr.indexOf(color)>-1){ // since this color from string we will not delete this color

                        $scope.$parent.loaddone = true;
                        return;


                    } else {

                        $scope.$parent.color_arr.splice(colindex, 1); // remove the color from array
                        if ($scope.color_arr.length > 0)
                            $scope.$parent.queryobj.color = $scope.color_arr;
                        else {
                            delete $scope.$parent.queryobj.color;
                        }
                        $scope.$parent.stopclickInterval();
                        $scope.$parent.intervalgapGeneratelink();
                    }



                } else {

                    $scope.$parent.color_arr.splice(colindex, 1);
                    if ($scope.color_arr.length > 0)
                        $scope.$parent.queryobj.color = $scope.color_arr;
                    else {
                        delete $scope.$parent.queryobj.color;
                    }
                    $scope.$parent.stopclickInterval();
                    $scope.$parent.intervalgapGeneratelink();
                }

            } else {
                $scope.$parent.loaddone = true;
                console.log("no such color");

            }
        }


        reset_search_string();


    }
// ----------- Searching-----------------------
    /*on submit function*/
    //changing categories
    // change sort
    // change the sort order of returned data
    $scope.$parent.atleast_one = 0;
    $scope.minprice = 0;
    $scope.maxprice = 1000000;
    $scope.setminprice = function (minprice) {
        reset_search_string();
        $scope.$parent.globalSearch = false;
        $scope.$parent.showstatic = false;
        $scope.$parent.filterCatMerchantBrandList = true;
        $scope.$parent.filterMerchantListEnable = false;
        $scope.$parent.filterBrandListEnable = false;
        if ($scope.minprice > $scope.maxprice) {
            $scope.$parent.common_popup_header = "Price Range Error";
            $scope.$parent.common_popup_message = "minimum price can not be larger than maximum price ";
            $('#commonPopup').modal('show');
            return;
        }
        $scope.$parent.loaddone = false;
        $scope.$parent.stopclickInterval();
        if ($scope.minprice == 0) {
            delete $scope.$parent.queryobj.min_price;
        } else {
            $scope.$parent.queryobj.min_price = minprice;
        }
        $scope.$parent.intervalgapGeneratelink();
    }
    
	
	$scope.setmaxprice = function (maxprice) {
        reset_search_string();
        $scope.$parent.globalSearch = false;
        $scope.$parent.showstatic = false;
        $scope.$parent.filterCatMerchantBrandList = true;
        $scope.$parent.filterMerchantListEnable = false;
        $scope.$parent.filterBrandListEnable = false;
        if ($scope.minprice > $scope.maxprice) {
            $scope.$parent.common_popup_header = "Price Range Error";
            $scope.$parent.common_popup_message = "maximum price can not be smaller than minimum price ";
            $('#commonPopup').modal('show');
            return;
        }
        $scope.$parent.loaddone = false;
        $scope.$parent.stopclickInterval();
        if (maxprice == 1000000) {
            delete $scope.$parent.queryobj.max_price;
        } else {
            $scope.$parent.queryobj.max_price = maxprice;
        }
        $scope.$parent.intervalgapGeneratelink();
    }
    $scope.commonAction = function (oc_type, boolObj) {
        reset_search_string();

        $scope.$parent.stopclickInterval();
        $scope.$parent.loaddone = false;
        $scope.$parent.showstatic = false;
        $scope.$parent.proLoading = true;
        $scope.$parent.globalSearch = false;
        $scope.$parent.filterCatMerchantBrandList = true;
        $scope.$parent.filterMerchantListEnable = false;
        $scope.$parent.filterBrandListEnable = false;
        if (boolObj) {
            if (oc_type == 'casual') {
                $scope.$parent.oc_casual = true;
                $scope.$parent.queryobj.occasion_casual = true;
            }
            else if (oc_type == 'work') {
                $scope.$parent.oc_work = true;
                $scope.$parent.queryobj.occasion_work = true;
            }
            else if (oc_type == 'vacation') {
                $scope.$parent.oc_vacation = true;
                $scope.$parent.queryobj.occasion_vacation = true;
            }
            else if (oc_type == 'other') {
                $scope.$parent.oc_other = true;
                $scope.$parent.queryobj.occasion_other = true;
            }
        }
        else {
            if (oc_type == 'casual') {
                $scope.$parent.oc_casual = false;
                delete  $scope.$parent.queryobj.occasion_casual;
            }
            else if (oc_type == 'work') {
                $scope.$parent.oc_work = false;
                delete  $scope.$parent.queryobj.occasion_work;
            }
            else if (oc_type == 'vacation') {
                $scope.$parent.oc_vacation = false;
                delete  $scope.$parent.queryobj.occasion_vacation;
            }
            else if (oc_type == 'other') {
                $scope.$parent.oc_other = false;
                delete  $scope.$parent.queryobj.occasion_other;
            }
        }
        $scope.$parent.intervalgapGeneratelink();
    }//------------------- page change event-----------------------------
    $scope.clearFilter = function () {
        $scope.$parent.products =[];
        $scope.$parent.totalRecordsFound =0;
        $scope.$parent.numPages = 0;
        $scope.$parent.timeGap = 0;
        $scope.$parent.stopclickInterval();
        $scope.$parent.selected = "";
        $scope.$parent.searchforstring = "";
        $scope.$parent.filterCatMerchantBrandList = false;
        $scope.$parent.filterMerchantListEnable = false;
        $scope.$parent.filterBrandListEnable = false;
        $scope.minprice = 0;
        $scope.maxprice = 1000000;

        $scope.$parent.globalSearch = false;
        $scope.$parent.proLoading = true;
        $scope.$parent.selected_key = "";
        $scope.$parent.new_keyword_arr = [];
        $scope.selected_key = "";
        angular.element('main-search').scope().vm.checkAllShop = true;
        angular.element('main-search').scope().vm.checkAllCat = true;
        angular.element('main-search').scope().vm.checkAllDegnr = true;
        $scope.$parent.pro = {};
        $scope.$parent.catg = {};
        $scope.$parent.brdg = {};
        $scope.$parent.color_arr = [];
        $scope.$parent.prosearch = {};
        $scope.$parent.catlocal = {};
        $scope.$parent.brdglocal = {};
        $scope.temcol = {};
        $scope.$parent.cost = {
            range: [0.00, 1000000.00]
        };
        $scope.$parent.percent = {
            range: [0.00, 100.00]
        };
        $scope.$parent.CurrentPage = 1;
        $scope.$parent.selected_groupby = "";
        $scope.$parent.select_color = "";
        $scope.$parent.selected_merchantlist = [];
        $scope.$parent.selected_merchantlistByclick = [];
        $scope.$parent.selected_brandlist = [];
        $scope.$parent.select_brand = "";
        $scope.$parent.selected_categorylist = [];
        $scope.$parent.select_category = "";
        // check is there any sale offer running
        $scope.saleOffer = false;
        $scope.$parent.saleOffer = false;
        $scope.$parent.queryobj = {};
        $scope.ocassion_casual = false;
        $scope.ocassion_vacation = false;
        $scope.ocassion_work = false;
        $scope.ocassion_other = false;
        $scope.$parent.oc_casual = false;
        $scope.$parent.oc_work = false;
        $scope.$parent.oc_vacation = false;
        $scope.$parent.oc_other = false;
        $scope.$parent.merchantSetfromSearchBoxString = false;
        $scope.$parent.categorySetfromSearchBoxString = false;
        $scope.$parent.brandSetfromSearchBoxString = false;
        $scope.$parent.colorSetfromSearchBoxString = false;
        $scope.$parent.saleSetfromSearchBoxString = false;


        if (angular.isDefined(smerchant)) {
            $scope.$parent.loaddone = false;
            $scope.$parent.selected_merchantlistByclick[0] = smerchant;
            $scope.$parent.selected_merchantlist[0] = smerchant;
            $scope.$parent.queryobj.merchantList = $scope.selected_merchantlistByclick;
            $scope.$parent.pro[smerchant] = true;
            $scope.$parent.prosearch[smerchant] = true;
            $scope.$parent.ms["checkAllShop"] = false;
            angular.element('main-search').scope().vm.checkAllShop = false;
        	$scope.$parent.metaxdescription = 'buy product through ecommerce of '+smerchant;
			$scope.$parent.title = 'SS-'+smerchant;
			$scope.$parent.metax = 'buy product,ecommerce,'+smerchant;
            $scope.$parent.showstatic =false;
            $scope.$parent.intervalgapGeneratelink();


		} else {

			$scope.$parent.metaxdescription = 'buy product through ecommerce';
			$scope.$parent.title = 'SS-Search';
			$scope.$parent.metax = 'buy product,ecommerce';
            $scope.$parent.showstatic =true;
		}


        //$scope.$parent.brandList = angular.copy($scope.initialBrandList);
        $scope.$parent.retailerList = angular.copy($scope.initialRetailerList);
        $scope.$parent.totalMerchants = angular.copy($scope.fullMerchantListCount);
        $scope.$parent.totalBrands = angular.copy($scope.fullBrandListCount);
        //$scope.$parent.generateAllMerchants();
        //$scope.$parent.generateAllBrands();
    }
    // api price filter
    $scope.priceFilter = function (pro) {
        reset_search_string();

        $scope.$parent.showstatic =false;
        if (pro.price_sale == "") {
            return pro.price >= $scope.cost.range[0] && pro.price <= $scope.cost.range[1];
        }
        else {
            return pro.price_sale >= $scope.cost.range[0] && pro.price_sale <= $scope.cost.range[1];
        }
    }
    // api percent filter
    $scope.percentFilter = function (pro) {
        reset_search_string();

        $scope.$parent.showstatic =false;

        return pro.percentOff >= $scope.percent.range[0] && pro.percentOff <= $scope.percent.range[1];
    }
    // color channging reset also
    $scope.setPrice = function (min, max, val, whichOneCheck) {
        reset_search_string();

        $scope.$parent.showstatic =false;

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


    // on search those will be clear
    $scope.$on('colorNull', function (e) {
        $scope.temcol = {};
    });

    // on search those will be clear
    $scope.$on('searchboxNull', function (e) {
        $scope.selected_key = "";
    });

    // on search those will be clear
    $scope.$on('saleboxNull', function (e) {
        $scope.saleOffer = false;
    });

    // on search those will be clear
    $scope.$on('occasionFalse', function (e) {
        $scope.ocassion_casual = false;
        $scope.ocassion_vacation = false;
        $scope.ocassion_work = false;
        $scope.ocassion_other = false;
    });

    $scope.$parent.loadfull = true;
    $scope.$parent.firsttime.loading =1;

}]);