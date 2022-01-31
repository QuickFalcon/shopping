//////////// start searching_product

$scope.searching_product = function ($event, global) {

    $scope.brandsearch={brand:""};
    $scope.searchforstring = "";
// first check whether any search box filter has been slected
    if (($scope.selected_categorylist.length > 0 || $scope.selected_brandlist.length > 0 || $scope.selected_merchantlistByclick.length > 0)) {

        console.log("some thing has been selected ... so search will proceed");
    } else {

        if (global && $scope.selected.trim() == '') {

            console.log("we can not process empty");
            return;

        } else if (!global && $scope.selected_key.trim() == '') {
            console.log("we can not process empty from left");
            return;
        }
    }


    $scope.selectedKeyWord = undefined;
    var sloc = $location.path();
    $event.stopPropagation();
    $scope.vm.showsearch = false;
    $scope.globalSearch = global;
    $scope.products = [];
    $scope.loaddone = false;
    // if global search running from different page
if(global) {
        if (sloc != '/search') {
            $scope.loadfull = false;
            $location.path('/search');
            $route.reload();
        }

       $scope.selected_key = "";
          if(sloc.indexOf('/search')>-1)
            $scope.$broadcast('searchboxNull'); // make empty right search box
    }

    $scope.genderFromString = false;
    $scope.colorFromString = false;
    $scope.colorFromStringArr = [];
    $scope.categoryFromStringArr = [];
    $scope.categoryFromString = false;
    $scope.brandFromStringArr = []; // brands thats have been selected using searchbox
    $scope.brandFromString = false; // brands select from string false
    $scope.currentpage = 1;
    $scope.filterCatMerchantBrandList = true; // both left brand and merchant list will be changed
    $scope.filterBrandListEnable = false;
    $scope.filterMerchantListEnable = false;


    if ($scope.shopcatset && global) {
        $scope.shopcatset = false;     // shop carset variable define whether we will use query to list down shot
    }






    // if it come from same page make everything as false otherwuse use previous details


    // check is there any sale offer running

    if (angular.isDefined($scope.selected) && $scope.selected.trim() != '' && global) {
        $scope.searchforstring = angular.copy($scope.selected);

        $scope.selectedKeyWord = angular.copy($scope.selected);
        $scope.metaxdescription = $scope.searchforstring;
        $scope.title = 'SS-Search-' + $scope.searchforstring;
        $scope.metax = $scope.searchforstring;
        SSmixPanel.lookingFor($scope.selected);  // inform mixpanel about search key


    }
    else if (angular.isDefined($scope.selected_key) && $scope.selected_key.trim() != '' && !global) {
        $scope.searchforstring = angular.copy($scope.selected_key);

        $scope.selectedKeyWord = angular.copy($scope.selected_key);
        $scope.metaxdescription = $scope.searchforstring;
        $scope.title = 'SS-Search-' + $scope.searchforstring;
        $scope.metax = $scope.searchforstring;

        var smerchant = $routeParams.merchant; // getting merchant name from url
        if (angular.isDefined(smerchant)) { // smerchant is for search storee wise
            if (smerchant.trim() != '') {
                $scope.selected_merchantlist = []; // clear the merchantlist array
                $scope.selected_merchantlistByclick = [];
                $scope.selected_merchantlistByclick.push(smerchant);
                $scope.selected_merchantlist.push(smerchant);
                $scope.pro[smerchant] = true;
                $scope.filterCatMerchantBrandList = false;
                $scope.filterBrandListEnable = false;
                $scope.filterMerchantListEnable = true;
            }
        }

        SSmixPanel.lookingFor($scope.selected_key);  // inform mixpanel about search key


    }

    // when search box brand selected is empty reset slected brandlist


 // when search box brand selected category is empty reset slected brandlist




    // resetting search from inside
    if ((sloc.indexOf('/search')>-1) || (!global && sloc.indexOf('storechosen') > -1 )) {
        $scope.selectCategorySearchboxFromInside = false; // used for reset
        $scope.selectMerchantSearchboxFromInside = false; // used for reset
        $scope.selectBrandSearchboxFromInside = false;    // used for reset
    }

    $scope.catlocal = {};  // reset inside left category
    $scope.brdglocal = {};   // reset inside left brand
    $scope.prosearch = {}; // reset inside left shop
    $scope.color_arr = [];
    $scope.select_color = "";
    $scope.temcol = {};


    if(sloc.indexOf('/search')>-1) {

        $scope.$broadcast('colorNull');
        $scope.$broadcast('saleboxNull');
        $scope.$broadcast('occasionFalse');

    }



    $scope.percent = {
        range: [0.00, 100.00]
    };


    $scope.saleOffer = false;
    $scope.oc_casual = false;
    $scope.oc_work = false;
    $scope.oc_vacation = false;
    $scope.oc_other = false;
    var temCategory;
    $scope.foundMerchantInsideKeyword = false;
    var tempmerchant;
    var tempmerchantLower;
    var lowercaseSelectedKeyWord;

    $scope.queryobj = {};

    //first check any merchant is inside the
    $scope.justClickedMenu = false; // for top menu section clicked
    $scope.slidimageclick = false;
    $scope.searchFromLocation = sloc;  // tracking from where this search come from
    $scope.bigCurrentPage = 1;
    var temps;

    var tempcat;
    var tempbrand;

// when multiple category selected check box become true on lefr
if ($scope.selected_categorylist.length > 0){
        angular.element('main-search').scope().vm.checkAllCat = false;
        for (var c = 0; c < $scope.selected_categorylist.length; c++) {  // setting up the checkboxes
            tempcat = $scope.selected_categorylist[c];
            $scope.catlocal[tempcat] = true;
        }

    }
    else
        angular.element('main-search').scope().vm.checkAllCat = true;

    // when multiple merchant selected check box become true
if ($scope.selected_merchantlistByclick.length > 0) {
        angular.element('main-search').scope().vm.checkAllShop = false;
        $scope.queryobj.merchantList = $scope.selected_merchantlistByclick;
    }
    else
        angular.element('main-search').scope().vm.checkAllShop = true;


// when multiple brand selected check box become true

if ($scope.selected_brandlist.length > 0) {
        angular.element('main-search').scope().vm.checkAllDegnr = false;
        for (var b = 0; b < $scope.selected_brandlist.length; b++) {
            tempbrand = $scope.selected_brandlist[b];
            $scope.brdglocal[tempbrand] = true; // making it true
        }

    }
    else
        angular.element('main-search').scope().vm.checkAllDegnr = true;



// when multiple merchant selected check box become true
    for (var u = 0; u < $scope.selected_merchantlistByclick.length; u++) {
        temps = $scope.selected_merchantlistByclick[u];
        $scope.prosearch[temps] = true;
    }



    $scope.sortorder = 9;
    var searchkeyword = "";
    var inx = 0;
    $scope.showstatic = false;

    if (angular.isDefined($scope.selectedKeyWord)) {
        if ($scope.selectedKeyWord.trim() != '') {
            lowercaseSelectedKeyWord = angular.lowercase($scope.selectedKeyWord);

            var keyStringArr = lowercaseSelectedKeyWord.split(" ");
            var tempBrnad;

            var tempcol;
            var genderMArr = ['male', 'boy', 'gentleman','man','men'];
            var genderFArr = ['female', 'girl', 'lady','woman','women'];
            var totallength = angular.copy(keyStringArr.length);
            $scope.color_arr =[];
            var keyStringArrRest;
            var tempselectedword;
            var wildCatReplace="";

            for (var ind = 0; ind < totallength; ind++) {
                tempcol = keyStringArr[ind];

                if ($scope.color_array.indexOf(tempcol) > -1) {

                    $scope.color_arr.push(tempcol);
                    lowercaseSelectedKeyWord = lowercaseSelectedKeyWord.replace(tempcol, '').trim();
                    lowercaseSelectedKeyWord = lowercaseSelectedKeyWord.replace(/  +/g, ' ');

                } else {
                    if (genderFArr[0] == tempcol||genderFArr[1] == tempcol|| genderFArr[2] == tempcol || genderFArr[3] == tempcol || genderFArr[4] == tempcol) {
                        $scope.queryobj.female = true;
                        lowercaseSelectedKeyWord = lowercaseSelectedKeyWord.replace(tempcol, '').trim();
                        lowercaseSelectedKeyWord = lowercaseSelectedKeyWord.replace(/  +/g, ' ');
                        $scope.genderFromString = true;

                    }

                    else if (genderMArr[0] == tempcol || genderMArr[1] == tempcol || genderMArr[2] == tempcol || genderMArr[3] == tempcol  || genderMArr[4] == tempcol) {
                        $scope.queryobj.male = true;
                        lowercaseSelectedKeyWord = lowercaseSelectedKeyWord.replace(tempcol, '').trim();
                        lowercaseSelectedKeyWord = lowercaseSelectedKeyWord.replace(/  +/g, ' ');
                        $scope.genderFromString = true;
                    }

                }

                //console.log(keyStringArr);

                // when it is last cycle of rotation
                if (ind + 1 == totallength) {
                    // brand loop

                    if($scope.color_arr.length>0) {
                        $scope.queryobj.color = $scope.color_arr;

                        $scope.colorFromString = true; // it is indicating some of color selected from string
                        $scope.colorFromStringArr = angular.copy($scope.color_arr);

                    }


                    $scope.queryobj.keyword = lowercaseSelectedKeyWord;

                    searchdatabase();

                    /*
                    var tempCat;
                    if ($scope.all_category.length > 0) {


                        categorylistSelectFromString.categorylistFormation($scope.all_category,$scope.selected_categorylist,lowercaseSelectedKeyWord).then(function (response) {

                            $scope.selected_categorylist = response.selected_categorylist;
                            var string_keyword = response.lowercaseSelectedKeyWord;

                            if(response.stringCategoryArr.length>0) {
                                $scope.categoryFromStringArr = response.stringCategoryArr;
                                $scope.categoryFromString = true;



                            }
                            if (string_keyword.trim() == "" || string_keyword.trim().length<2 ) {

                                searchdatabase();
                                return;

                            }
                            else {
                            keyStringArrRest = string_keyword.split(" ");
                            brand_string_match(keyStringArrRest,string_keyword);
                            }



                        })




                    } else {

                        keyStringArrRest = lowercaseSelectedKeyWord.split(" ");

                        brand_string_match(keyStringArrRest,lowercaseSelectedKeyWord);

                    }
                  */


                }


            }


        }	// trime end
        else {
            searchdatabase();


        }

    } else {

        searchdatabase();
    }

    $scope.lastsearchobj = angular.copy($scope.queryobj);

    $cookies.put('lastquerysearch', $scope.queryobj);
    $scope.generateRelatedSearchArr();
}

//////////// end searching_product


///////////////////////////////////////////// start searchdatabse



function searchdatabase() {

    $scope.load_click = 0;   // initially befor
    $scope.viewall = 0;     //
    $scope.showup = 0;
    //$scope.loaddone =false;
    var search_location = $location.path();
    $scope.queryobj.start = 0;
    $scope.queryobj.offset = $scope.user_offset; // limit
    $scope.queryobj.sortorder = $scope.sortorder;
    $scope.queryobj.available = true;
    loadMoreReset();
    $scope.products = [];
    $scope.homeloaded = 1;
    $scope.totalRecordsFound = 0;
    $scope.numPages = 0;
    var pt;
    var cpt;

    var tobj;
    var mobj;

    $scope.totalBrands =undefined;
    //resetting query obj


   if ($scope.selected_brandlist.length > 0){

        $scope.queryobj.brandList =  angular.copy($scope.selected_brandlist);


    } else {
    if(angular.isDefined($scope.queryobj.brandList)) { // brand list now updated to null so delete it

     delete $scope.queryobj.brandList;

     }
}




    if(angular.isDefined($scope.queryobj.categoryList)) {
        if ($scope.queryobj.categoryList.length > 0)
            delete $scope.queryobj.categoryList;
    }

    if($scope.justClickedMenu) {  // coming from menu click so  do not delete the category list

        console.log("do not work with category list ")
    }





        pt = '/productResult';
        cpt ='/productResultCount';
            // make all of alphabet status as false





    if ($scope.selected_categorylist.length > 0) {


           $scope.queryobj.categoryList = angular.copy($scope.selected_categorylist);
           // this place different no mapped category

            $http.post(pt, $scope.queryobj)  //call to retrieve data
                .success(function (data) {
                    var data_count;
                    $scope.products = data.product;
                    $scope.loaddone = true;
                    $scope.loadfull = true;

                    $scope.firsttime.loading = 1;
                    //$scope.loadfull=true;
                }).error(function (err) {
                console.log("Search Productlist error : " + err);
                $scope.viewall = 1; //as there is nothing to show that means everything has been shown
                $scope.totalRecordsAvailable = 0;
                $scope.loaddone = true;

                $scope.loadfull = true;
                $scope.firsttime.loading = 1;
            });
            $http.post(cpt, $scope.queryobj).success(function (data) {
                $scope.totalRecordsFound = data.count;   // calculate only first time                             //calculated on first time
                $scope.numPages = Math.ceil(($scope.totalRecordsFound) / ($scope.user_offset));

                tobj = angular.copy($scope.queryobj);
                tobj.limit = 6;
                tobj.startindex =0;
                mobj = angular.copy($scope.queryobj);

                mobj.mlimit = 6;
                mobj.startmindex =0;



                if(!$scope.justClickedMenu) {

                    if($scope.totalRecordsFound>0) {
                        if ($scope.filterCatMerchantBrandList) {

                            $scope.already_showed_all_brand = false;
                            $scope.showbiggerBrandResult = false;
                            $http.post('/productResultGroupBrand', tobj).success(function (data) {


                                $scope.brandList = data.brands;
                                $scope.brandListAlphabet.A = angular.copy(data.a);
                                $scope.brandListAlphabet.B = angular.copy(data.b);
                                $scope.brandListAlphabet.C = angular.copy(data.c);
                                $scope.brandListAlphabet.D = angular.copy(data.d);
                                $scope.brandListAlphabet.E = angular.copy(data.e);
                                $scope.brandListAlphabet.F = angular.copy(data.f);
                                $scope.brandListAlphabet.G = angular.copy(data.g);
                                $scope.brandListAlphabet.H = angular.copy(data.h);
                                $scope.brandListAlphabet.I = angular.copy(data.i);
                                $scope.brandListAlphabet.J = angular.copy(data.j);
                                $scope.brandListAlphabet.K = angular.copy(data.k);
                                $scope.brandListAlphabet.L = angular.copy(data.l);
                                $scope.brandListAlphabet.M = angular.copy(data.m);
                                $scope.brandListAlphabet.N = angular.copy(data.n);
                                $scope.brandListAlphabet.O = angular.copy(data.o);
                                $scope.brandListAlphabet.P = angular.copy(data.p);
                                $scope.brandListAlphabet.Q = angular.copy(data.q);
                                $scope.brandListAlphabet.R = angular.copy(data.r);
                                $scope.brandListAlphabet.S = angular.copy(data.s);
                                $scope.brandListAlphabet.T = angular.copy(data.t);
                                $scope.brandListAlphabet.U = angular.copy(data.u);
                                $scope.brandListAlphabet.V = angular.copy(data.v);
                                $scope.brandListAlphabet.W = angular.copy(data.w);
                                $scope.brandListAlphabet.X = angular.copy(data.x);
                                $scope.brandListAlphabet.Y = angular.copy(data.y);
                                $scope.brandListAlphabet.Z = angular.copy(data.z);
                                $scope.brandListAlphabet.OTHER = angular.copy(data.other);

                                if($scope.brandList.length<6) {
                                    $scope.already_showed_all_brand = true;
                                    $scope.showbiggerBrandResult = true;
                                    $scope.totalBrands = $scope.brandList.length;
                                }


                                if (search_location.indexOf('storechosen') < 0) { // searching

                                    $scope.already_showed_all_merchant = false;
                                    $scope.showbiggerMerchantResult = false;
                                    $http.post('/productResultGroupMerchant',mobj).success(function (data) {
                                        $scope.retailerList = data;
                                        $scope.totalMerchants = $scope.retailerList.length;
                                        if($scope.retailerList.length<6) {
                                            $scope.already_showed_all_merchant = true;
                                            $scope.showbiggerMerchantResult = true;
                                            $scope.totalMerchants = $scope.retailerList.length;
                                        }

                                    }).error(function (cerr) {
                                        $scope.retailerList = [];
                                        $scope.totalMerchants = 0;
                                        console.log("Merchant Group error: " + cerr);
                                        $scope.already_showed_all_merchant = true;
                                        $scope.showbiggerMerchantResult = true;
                                    });
                                }

                            }).error(function (cerr) {
                                $scope.brandList = [];
                                $scope.totalBrands = 0;
                                console.log("Brand group error: " + cerr);
                                $scope.already_showed_all_merchant = true;
                                $scope.showbiggerMerchantResult = true;
                            });




                        }
                        else if ($scope.filterMerchantListEnable) {
                            $scope.already_showed_all_brand = false;
                            $scope.showbiggerBrandResult = false;

                            $http.post('/productResultGroupBrand', tobj).success(function (data) {



                                $scope.brandList = data.brands;
                                $scope.brandListAlphabet.A = angular.copy(data.a);
                                $scope.brandListAlphabet.B = angular.copy(data.b);
                                $scope.brandListAlphabet.C = angular.copy(data.c);
                                $scope.brandListAlphabet.D = angular.copy(data.d);
                                $scope.brandListAlphabet.E = angular.copy(data.e);
                                $scope.brandListAlphabet.F = angular.copy(data.f);
                                $scope.brandListAlphabet.G = angular.copy(data.g);
                                $scope.brandListAlphabet.H = angular.copy(data.h);
                                $scope.brandListAlphabet.I = angular.copy(data.i);
                                $scope.brandListAlphabet.J = angular.copy(data.j);
                                $scope.brandListAlphabet.K = angular.copy(data.k);
                                $scope.brandListAlphabet.L = angular.copy(data.l);
                                $scope.brandListAlphabet.M = angular.copy(data.m);
                                $scope.brandListAlphabet.N = angular.copy(data.n);
                                $scope.brandListAlphabet.O = angular.copy(data.o);
                                $scope.brandListAlphabet.P = angular.copy(data.p);
                                $scope.brandListAlphabet.Q = angular.copy(data.q);
                                $scope.brandListAlphabet.R = angular.copy(data.r);
                                $scope.brandListAlphabet.S = angular.copy(data.s);
                                $scope.brandListAlphabet.T = angular.copy(data.t);
                                $scope.brandListAlphabet.U = angular.copy(data.u);
                                $scope.brandListAlphabet.V = angular.copy(data.v);
                                $scope.brandListAlphabet.W = angular.copy(data.w);
                                $scope.brandListAlphabet.X = angular.copy(data.x);
                                $scope.brandListAlphabet.Y = angular.copy(data.y);
                                $scope.brandListAlphabet.Z = angular.copy(data.z);
                                $scope.brandListAlphabet.OTHER = angular.copy(data.other);






                                if($scope.brandList.length<6) {
                                    $scope.already_showed_all_brand = true;
                                    $scope.showbiggerBrandResult = true;
                                    $scope.totalBrands = $scope.brandList.length;
                                }


                            }).error(function (cerr) {
                                $scope.brandList = [];
                                $scope.totalBrands = 0;
                                $scope.already_showed_all_brand = true;
                                $scope.showbiggerBrandResult = true;
                                console.log("Brand  error: " + cerr)
                            });
                        }
                        else if ($scope.filterBrandListEnable) { // when searching and brandlist enable
                            if (search_location.indexOf('storechosen') < 0) { // searching
                                $scope.already_showed_all_merchant = false;
                                $scope.showbiggerMerchantResult = false;
                                $http.post('/productResultGroupMerchant', mobj).success(function (data) {
                                    $scope.retailerList = data;


                                    if($scope.retailerList.length<6) {
                                        $scope.totalMerchants = $scope.retailerList.length;
                                        $scope.already_showed_all_merchant = true;
                                        $scope.showbiggerMerchantResult = true;

                                    }
                                }).error(function (cerr) {
                                    $scope.retailerList = [];
                                    $scope.totalMerchants = 0;
                                    $scope.already_showed_all_merchant = true;
                                    $scope.showbiggerMerchantResult = true;
                                });
                            }
                        }

                    }  else {

                        $scope.retailerList = [];
                        $scope.totalMerchants = 0;
                        $scope.brandList = [];
                        $scope.totalBrands = 0;
                        $scope.already_showed_all_merchant = true;
                        $scope.showbiggerMerchantResult = true;

                        $scope.already_showed_all_merchant = true;
                        $scope.showbiggerMerchantResult = true;
                    }

                }
                else {
                    $scope.justClickedMenu = false;
                }

            }).error(function (cerr) {
                console.log("count error: " + cerr)

                tobj = angular.copy($scope.queryobj);
                tobj.limit = 6;
                tobj.startindex =0;
                mobj = angular.copy($scope.queryobj);

                mobj.mlimit = 6;
                mobj.startmindex =0;


                if(!$scope.justClickedMenu) {
                    if ($scope.filterCatMerchantBrandList) {
                        $scope.already_showed_all_brand = false;
                        $scope.showbiggerBrandResult = false;

                        $http.post('/productResultGroupBrand', tobj).success(function (data) {


                            $scope.brandList = data.brands;
                            $scope.brandListAlphabet.A = angular.copy(data.a);
                            $scope.brandListAlphabet.B = angular.copy(data.b);
                            $scope.brandListAlphabet.C = angular.copy(data.c);
                            $scope.brandListAlphabet.D = angular.copy(data.d);
                            $scope.brandListAlphabet.E = angular.copy(data.e);
                            $scope.brandListAlphabet.F = angular.copy(data.f);
                            $scope.brandListAlphabet.G = angular.copy(data.g);
                            $scope.brandListAlphabet.H = angular.copy(data.h);
                            $scope.brandListAlphabet.I = angular.copy(data.i);
                            $scope.brandListAlphabet.J = angular.copy(data.j);
                            $scope.brandListAlphabet.K = angular.copy(data.k);
                            $scope.brandListAlphabet.L = angular.copy(data.l);
                            $scope.brandListAlphabet.M = angular.copy(data.m);
                            $scope.brandListAlphabet.N = angular.copy(data.n);
                            $scope.brandListAlphabet.O = angular.copy(data.o);
                            $scope.brandListAlphabet.P = angular.copy(data.p);
                            $scope.brandListAlphabet.Q = angular.copy(data.q);
                            $scope.brandListAlphabet.R = angular.copy(data.r);
                            $scope.brandListAlphabet.S = angular.copy(data.s);
                            $scope.brandListAlphabet.T = angular.copy(data.t);
                            $scope.brandListAlphabet.U = angular.copy(data.u);
                            $scope.brandListAlphabet.V = angular.copy(data.v);
                            $scope.brandListAlphabet.W = angular.copy(data.w);
                            $scope.brandListAlphabet.X = angular.copy(data.x);
                            $scope.brandListAlphabet.Y = angular.copy(data.y);
                            $scope.brandListAlphabet.Z = angular.copy(data.z);
                            $scope.brandListAlphabet.OTHER = angular.copy(data.other);


                            if($scope.brandList.length<6) {
                                $scope.already_showed_all_brand = true;
                                $scope.showbiggerBrandResult = true;
                                $scope.totalBrands = $scope.brandList.length;
                            }
                            if (search_location.indexOf('storechosen') < 0) { // searching
                                $scope.already_showed_all_merchant = false;
                                $scope.showbiggerMerchantResult = false;
                                $http.post('/productResultGroupMerchant', mobj).success(function (data) {
                                    $scope.retailerList = data;

                                    if(data.length<6) {
                                        $scope.totalMerchants = $scope.retailerList.length;
                                        $scope.already_showed_all_merchant = true;
                                        $scope.showbiggerMerchantResult = true;

                                    }


                                }).error(function (cerr) {
                                    $scope.retailerList = [];
                                    $scope.totalMerchants = 0;
                                    $scope.already_showed_all_merchant = true;
                                    $scope.showbiggerMerchantResult = true;

                                    console.log("Merchant Group error: " + cerr);
                                });
                            }

                        }).error(function (cerr) {
                            $scope.brandList = [];
                            $scope.totalBrands = 0;
                            $scope.already_showed_all_brand = true;
                            $scope.showbiggerBrandResult = true;
                            console.log("Brand group error: " + cerr)
                        });

                    }
                    else if ($scope.filterMerchantListEnable) {
                        $scope.already_showed_all_brand = false;
                        $scope.showbiggerBrandResult = false;

                        $http.post('/productResultGroupBrand', tobj).success(function (data) {


                            $scope.brandList = data.brands;
                            $scope.brandListAlphabet.A = angular.copy(data.a);
                            $scope.brandListAlphabet.B = angular.copy(data.b);
                            $scope.brandListAlphabet.C = angular.copy(data.c);
                            $scope.brandListAlphabet.D = angular.copy(data.d);
                            $scope.brandListAlphabet.E = angular.copy(data.e);
                            $scope.brandListAlphabet.F = angular.copy(data.f);
                            $scope.brandListAlphabet.G = angular.copy(data.g);
                            $scope.brandListAlphabet.H = angular.copy(data.h);
                            $scope.brandListAlphabet.I = angular.copy(data.i);
                            $scope.brandListAlphabet.J = angular.copy(data.j);
                            $scope.brandListAlphabet.K = angular.copy(data.k);
                            $scope.brandListAlphabet.L = angular.copy(data.l);
                            $scope.brandListAlphabet.M = angular.copy(data.m);
                            $scope.brandListAlphabet.N = angular.copy(data.n);
                            $scope.brandListAlphabet.O = angular.copy(data.o);
                            $scope.brandListAlphabet.P = angular.copy(data.p);
                            $scope.brandListAlphabet.Q = angular.copy(data.q);
                            $scope.brandListAlphabet.R = angular.copy(data.r);
                            $scope.brandListAlphabet.S = angular.copy(data.s);
                            $scope.brandListAlphabet.T = angular.copy(data.t);
                            $scope.brandListAlphabet.U = angular.copy(data.u);
                            $scope.brandListAlphabet.V = angular.copy(data.v);
                            $scope.brandListAlphabet.W = angular.copy(data.w);
                            $scope.brandListAlphabet.X = angular.copy(data.x);
                            $scope.brandListAlphabet.Y = angular.copy(data.y);
                            $scope.brandListAlphabet.Z = angular.copy(data.z);
                            $scope.brandListAlphabet.OTHER = angular.copy(data.other);



                            if($scope.brandList.length<6) {
                                $scope.already_showed_all_brand = true;
                                $scope.showbiggerBrandResult = true;
                                $scope.totalBrands = $scope.brandList.length;
                            }

                        }).error(function (cerr) {
                            $scope.brandList = [];
                            $scope.totalBrands = 0;
                            console.log("Brand  error: " + cerr);
                            $scope.already_showed_all_brand = true;
                            $scope.showbiggerBrandResult = true;


                        });
                    }
                    else if ($scope.filterBrandListEnable) { // when searching and brandlist enable
                        if (search_location.indexOf('storechosen') < 0) { // searching

                            $scope.already_showed_all_merchant = false;
                            $scope.showbiggerMerchantResult = false;
                            $http.post('/productResultGroupMerchant', mobj).success(function (data) {
                                $scope.retailerList = data;

                                if(data.length<6) {
                                    $scope.totalMerchants = $scope.retailerList.length;
                                    $scope.already_showed_all_merchant = true;
                                    $scope.showbiggerMerchantResult = true;

                                }
                            }).error(function (cerr) {
                                $scope.retailerList = [];
                                $scope.totalMerchants = 0;
                                console.log("Merchant group error: " + cerr);
                                $scope.already_showed_all_merchant = true;
                                $scope.showbiggerMerchantResult = true;

                            });
                        }
                    }
                }
                else {
                    $scope.justClickedMenu = false;
                }



            });



    }

    else {
        $http.post(pt, $scope.queryobj)  //call to retrieve data
            .success(function (data) {
                var data_count;
                $scope.products = data.product;
                $scope.loaddone = true;
                $scope.firsttime.loading = 1;
                $scope.loadfull = true;


            }).error(function (err) {
            console.log("Search Productlist error : " + err);
            $scope.viewall = 1; //as there is nothing to show that means everything has been shown
            $scope.totalRecordsAvailable = 0;
            $scope.loaddone = true;
            $scope.loadfull = true;
            $scope.firsttime.loading = 1;
        });


        $http.post(cpt, $scope.queryobj).success(function (data) {
            $scope.totalRecordsFound = data.count;   // calculate only first time                             //calculated on first time
            $scope.numPages = Math.ceil(($scope.totalRecordsFound) / ($scope.user_offset));

            tobj = angular.copy($scope.queryobj);
            tobj.limit = 6;
            tobj.startindex =0;
            mobj = angular.copy($scope.queryobj);

            mobj.mlimit = 6;
            mobj.startmindex =0;
            if(!$scope.justClickedMenu) {

                if ($scope.totalRecordsFound>0) {
                    if ($scope.filterCatMerchantBrandList) {

                        $scope.already_showed_all_brand = false;
                        $scope.showbiggerBrandResult = false;
                        $http.post('/productResultGroupBrand', tobj).success(function (data) {


                            $scope.brandList = data.brands;
                            $scope.brandListAlphabet.A = angular.copy(data.a);
                            $scope.brandListAlphabet.B = angular.copy(data.b);
                            $scope.brandListAlphabet.C = angular.copy(data.c);
                            $scope.brandListAlphabet.D = angular.copy(data.d);
                            $scope.brandListAlphabet.E = angular.copy(data.e);
                            $scope.brandListAlphabet.F = angular.copy(data.f);
                            $scope.brandListAlphabet.G = angular.copy(data.g);
                            $scope.brandListAlphabet.H = angular.copy(data.h);
                            $scope.brandListAlphabet.I = angular.copy(data.i);
                            $scope.brandListAlphabet.J = angular.copy(data.j);
                            $scope.brandListAlphabet.K = angular.copy(data.k);
                            $scope.brandListAlphabet.L = angular.copy(data.l);
                            $scope.brandListAlphabet.M = angular.copy(data.m);
                            $scope.brandListAlphabet.N = angular.copy(data.n);
                            $scope.brandListAlphabet.O = angular.copy(data.o);
                            $scope.brandListAlphabet.P = angular.copy(data.p);
                            $scope.brandListAlphabet.Q = angular.copy(data.q);
                            $scope.brandListAlphabet.R = angular.copy(data.r);
                            $scope.brandListAlphabet.S = angular.copy(data.s);
                            $scope.brandListAlphabet.T = angular.copy(data.t);
                            $scope.brandListAlphabet.U = angular.copy(data.u);
                            $scope.brandListAlphabet.V = angular.copy(data.v);
                            $scope.brandListAlphabet.W = angular.copy(data.w);
                            $scope.brandListAlphabet.X = angular.copy(data.x);
                            $scope.brandListAlphabet.Y = angular.copy(data.y);
                            $scope.brandListAlphabet.Z = angular.copy(data.z);
                            $scope.brandListAlphabet.OTHER = angular.copy(data.other);



                            if($scope.brandList.length<6){

                                $scope.totalBrands = $scope.brandList.length;
                                $scope.already_showed_all_brand = true;
                                $scope.showbiggerBrandResult = true;

                            }
                            if (search_location.indexOf('storechosen') < 0) { // searching

                                $scope.already_showed_all_merchant = false;
                                $scope.showbiggerMerchantResult = false;
                                $http.post('/productResultGroupMerchant', mobj).success(function (data) {
                                    $scope.retailerList = data;

                                    if($scope.retailerList.length<6) {
                                        $scope.already_showed_all_merchant = true;
                                        $scope.showbiggerMerchantResult = true;
                                        $scope.totalMerchants = $scope.retailerList.length;
                                    }

                                }).error(function (cerr) {
                                    $scope.retailerList = [];
                                    $scope.totalMerchants = 0;
                                    $scope.already_showed_all_merchant = true;
                                    $scope.showbiggerMerchantResult = true;
                                    console.log("Merchant group error: " + cerr)
                                });
                            }
                        }).error(function (cerr) {
                            $scope.brandList = [];
                            $scope.totalBrands = 0;
                            console.log("count error: " + cerr);
                            $scope.already_showed_all_brand = true;
                            $scope.showbiggerBrandResult = true;
                        });
                    }
                    else if ($scope.filterMerchantListEnable) {

                        $scope.already_showed_all_brand = false;
                        $scope.showbiggerBrandResult = false;

                        $http.post('/productResultGroupBrand', tobj).success(function (data) {


                            $scope.brandList = data.brands;
                            $scope.brandListAlphabet.A = angular.copy(data.a);
                            $scope.brandListAlphabet.B = angular.copy(data.b);
                            $scope.brandListAlphabet.C = angular.copy(data.c);
                            $scope.brandListAlphabet.D = angular.copy(data.d);
                            $scope.brandListAlphabet.E = angular.copy(data.e);
                            $scope.brandListAlphabet.F = angular.copy(data.f);
                            $scope.brandListAlphabet.G = angular.copy(data.g);
                            $scope.brandListAlphabet.H = angular.copy(data.h);
                            $scope.brandListAlphabet.I = angular.copy(data.i);
                            $scope.brandListAlphabet.J = angular.copy(data.j);
                            $scope.brandListAlphabet.K = angular.copy(data.k);
                            $scope.brandListAlphabet.L = angular.copy(data.l);
                            $scope.brandListAlphabet.M = angular.copy(data.m);
                            $scope.brandListAlphabet.N = angular.copy(data.n);
                            $scope.brandListAlphabet.O = angular.copy(data.o);
                            $scope.brandListAlphabet.P = angular.copy(data.p);
                            $scope.brandListAlphabet.Q = angular.copy(data.q);
                            $scope.brandListAlphabet.R = angular.copy(data.r);
                            $scope.brandListAlphabet.S = angular.copy(data.s);
                            $scope.brandListAlphabet.T = angular.copy(data.t);
                            $scope.brandListAlphabet.U = angular.copy(data.u);
                            $scope.brandListAlphabet.V = angular.copy(data.v);
                            $scope.brandListAlphabet.W = angular.copy(data.w);
                            $scope.brandListAlphabet.X = angular.copy(data.x);
                            $scope.brandListAlphabet.Y = angular.copy(data.y);
                            $scope.brandListAlphabet.Z = angular.copy(data.z);
                            $scope.brandListAlphabet.OTHER = angular.copy(data.other);



                            if($scope.brandList.length<6){

                                $scope.totalBrands = $scope.brandList.length;
                                $scope.already_showed_all_brand = true;
                                $scope.showbiggerBrandResult = true;

                            }
                        }).error(function (cerr) {
                            $scope.brandList = [];
                            $scope.totalBrands = 0;
                            $scope.already_showed_all_brand = true;
                            $scope.showbiggerBrandResult = true;
                            console.log("Brand count error: " + cerr)
                        });
                    }
                    else if ($scope.filterBrandListEnable) { // when searching and brandlist enable
                        if (search_location.indexOf('storechosen') < 0) { // searching
                            $scope.already_showed_all_merchant = false;
                            $scope.showbiggerMerchantResult = false;
                            $http.post('/productResultGroupMerchant', mobj).success(function (data) {
                                $scope.retailerList = data;
                                if($scope.retailerList.length<6) {
                                    $scope.totalMerchants = $scope.retailerList.length;
                                    $scope.already_showed_all_merchant = true;
                                    $scope.showbiggerMerchantResult = true;

                                }


                            }).error(function (cerr) {
                                $scope.retailerList = [];
                                $scope.totalMerchants = 0;
                                $scope.already_showed_all_merchant = true;
                                $scope.showbiggerMerchantResult = true;
                                console.log("Merchant count error: " + cerr)
                            });
                        }
                    }
                } else {

                    $scope.retailerList = [];
                    $scope.totalMerchants = 0;
                    $scope.brandList = [];
                    $scope.totalBrands = 0;
                }



            } else {

                $scope.justClickedMenu = false; // top menu clicked false
            }

        }).error(function (cerr) {
            console.log("count error: " + cerr)

            if(!$scope.justClickedMenu) {

                    if($scope.totalRecordsFound>0) {
                        if ($scope.filterCatMerchantBrandList) {

                            $scope.already_showed_all_brand = false;
                            $scope.showbiggerBrandResult = false;

                            $http.post('/productResultGroupBrand', tobj).success(function (data) {


                                $scope.brandList = data.brands;
                                $scope.brandListAlphabet.A = angular.copy(data.a);
                                $scope.brandListAlphabet.B = angular.copy(data.b);
                                $scope.brandListAlphabet.C = angular.copy(data.c);
                                $scope.brandListAlphabet.D = angular.copy(data.d);
                                $scope.brandListAlphabet.E = angular.copy(data.e);
                                $scope.brandListAlphabet.F = angular.copy(data.f);
                                $scope.brandListAlphabet.G = angular.copy(data.g);
                                $scope.brandListAlphabet.H = angular.copy(data.h);
                                $scope.brandListAlphabet.I = angular.copy(data.i);
                                $scope.brandListAlphabet.J = angular.copy(data.j);
                                $scope.brandListAlphabet.K = angular.copy(data.k);
                                $scope.brandListAlphabet.L = angular.copy(data.l);
                                $scope.brandListAlphabet.M = angular.copy(data.m);
                                $scope.brandListAlphabet.N = angular.copy(data.n);
                                $scope.brandListAlphabet.O = angular.copy(data.o);
                                $scope.brandListAlphabet.P = angular.copy(data.p);
                                $scope.brandListAlphabet.Q = angular.copy(data.q);
                                $scope.brandListAlphabet.R = angular.copy(data.r);
                                $scope.brandListAlphabet.S = angular.copy(data.s);
                                $scope.brandListAlphabet.T = angular.copy(data.t);
                                $scope.brandListAlphabet.U = angular.copy(data.u);
                                $scope.brandListAlphabet.V = angular.copy(data.v);
                                $scope.brandListAlphabet.W = angular.copy(data.w);
                                $scope.brandListAlphabet.X = angular.copy(data.x);
                                $scope.brandListAlphabet.Y = angular.copy(data.y);
                                $scope.brandListAlphabet.Z = angular.copy(data.z);
                                $scope.brandListAlphabet.OTHER = angular.copy(data.other);


                                if($scope.brandList.length<6){

                                    $scope.totalBrands = $scope.brandList.length;
                                    $scope.already_showed_all_brand = true;
                                    $scope.showbiggerBrandResult = true;

                                }

                                if (search_location.indexOf('storechosen') < 0) { // searching
                                    $scope.already_showed_all_merchant = false;
                                    $scope.showbiggerMerchantResult = false;
                                    $http.post('/productResultGroupMerchant', mobj).success(function (data) {
                                        $scope.retailerList = data;
                                        if($scope.retailerList.length<6) {
                                            $scope.totalMerchants = $scope.retailerList.length;
                                            $scope.already_showed_all_merchant = true;
                                            $scope.showbiggerMerchantResult = true;

                                        }


                                    }).error(function (cerr) {
                                        $scope.retailerList = [];
                                        $scope.totalMerchants = 0;
                                        console.log("Merchant group error: " + cerr);
                                        $scope.already_showed_all_merchant = true;
                                        $scope.showbiggerMerchantResult = true;
                                    });
                                }
                            }).error(function (cerr) {
                                $scope.brandList = [];
                                $scope.totalBrands = 0;
                                $scope.already_showed_all_brand = true;
                                $scope.showbiggerBrandResult = true;
                                console.log("count error: " + cerr)
                            });
                        } // cat merchant brand
                        else if ($scope.filterMerchantListEnable) {
                            $scope.already_showed_all_brand = false;
                            $scope.showbiggerBrandResult = false;
                            $http.post('/productResultGroupBrand', tobj).success(function (data) {

                                $scope.brandList = data.brands;
                                $scope.brandListAlphabet.A = angular.copy(data.a);
                                $scope.brandListAlphabet.B = angular.copy(data.b);
                                $scope.brandListAlphabet.C = angular.copy(data.c);
                                $scope.brandListAlphabet.D = angular.copy(data.d);
                                $scope.brandListAlphabet.E = angular.copy(data.e);
                                $scope.brandListAlphabet.F = angular.copy(data.f);
                                $scope.brandListAlphabet.G = angular.copy(data.g);
                                $scope.brandListAlphabet.H = angular.copy(data.h);
                                $scope.brandListAlphabet.I = angular.copy(data.i);
                                $scope.brandListAlphabet.J = angular.copy(data.j);
                                $scope.brandListAlphabet.K = angular.copy(data.k);
                                $scope.brandListAlphabet.L = angular.copy(data.l);
                                $scope.brandListAlphabet.M = angular.copy(data.m);
                                $scope.brandListAlphabet.N = angular.copy(data.n);
                                $scope.brandListAlphabet.O = angular.copy(data.o);
                                $scope.brandListAlphabet.P = angular.copy(data.p);
                                $scope.brandListAlphabet.Q = angular.copy(data.q);
                                $scope.brandListAlphabet.R = angular.copy(data.r);
                                $scope.brandListAlphabet.S = angular.copy(data.s);
                                $scope.brandListAlphabet.T = angular.copy(data.t);
                                $scope.brandListAlphabet.U = angular.copy(data.u);
                                $scope.brandListAlphabet.V = angular.copy(data.v);
                                $scope.brandListAlphabet.W = angular.copy(data.w);
                                $scope.brandListAlphabet.X = angular.copy(data.x);
                                $scope.brandListAlphabet.Y = angular.copy(data.y);
                                $scope.brandListAlphabet.Z = angular.copy(data.z);
                                $scope.brandListAlphabet.OTHER = angular.copy(data.other);

                                if($scope.brandList.length<6){

                                    $scope.totalBrands = $scope.brandList.length;
                                    $scope.already_showed_all_brand = true;
                                    $scope.showbiggerBrandResult = true;

                                }
                            }).error(function (cerr) {
                                $scope.brandList = [];
                                $scope.totalBrands = 0;
                                $scope.already_showed_all_brand = true;
                                $scope.showbiggerBrandResult = true;

                                console.log("Brand count error: " + cerr)
                            });
                        }
                        else if ($scope.filterBrandListEnable) { // when searching and brandlist enable
                            if (search_location.indexOf('storechosen') < 0) { // searching

                                $scope.already_showed_all_merchant = false;
                                $scope.showbiggerMerchantResult = false;
                                $http.post('/productResultGroupMerchant', mobj).success(function (data) {
                                    $scope.retailerList = data;

                                    if($scope.retailerList.length<6) {
                                        $scope.totalMerchants = $scope.retailerList.length;
                                        $scope.already_showed_all_merchant = true;
                                        $scope.showbiggerMerchantResult = true;

                                    }

                                }).error(function (cerr) {
                                    $scope.retailerList = [];
                                    $scope.totalMerchants = 0;
                                    $scope.already_showed_all_merchant = true;
                                    $scope.showbiggerMerchantResult = true;
                                    console.log("Merchant count error: " + cerr)
                                });
                            }
                        }

                    }
                    else {

                    $scope.retailerList = [];
                    $scope.totalMerchants = 0;
                    $scope.already_showed_all_merchant = true;
                    $scope.showbiggerMerchantResult = true;
                    $scope.brandList = [];
                    $scope.totalBrands = 0;
                    $scope.already_showed_all_brand = true;
                    $scope.showbiggerBrandResult = true;

                   }

            } else {

                $scope.justClickedMenu = false; // top menu clicked false
            }

       });




    } // else end

    if (angular.isDefined($scope.selected) && $scope.selected.trim() != '') {

        $scope.searchforstring = angular.copy($scope.selected);
        $scope.metaxdescription = $scope.searchforstring;
        $scope.title = 'SS-Search-' + $scope.searchforstring;
        $scope.metax = $scope.searchforstring;
        SSmixPanel.lookingFor($scope.selected);  // inform mixpanel about search key

    }
    else if (angular.isDefined($scope.selected_key) && $scope.selected_key.trim() != '') {
        $scope.searchforstring = angular.copy($scope.selected_key);

        $scope.metaxdescription = $scope.searchforstring;
        $scope.title = 'SS-Search-' + $scope.searchforstring;
        $scope.metax = $scope.searchforstring;

        SSmixPanel.lookingFor($scope.selected_key);  // inform mixpanel about search key


    }

} // end of function



//////////////////////////////////// end searchdatabse

//////////// start productResult


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
     //searchquery is replaced
      if (req.body.keyword) {

        searchquery = {
          $text: { $search: skey },
          $or: [{ shareCount: { $gte: 1 } }, { ratedByUser: { $gte: 1 } }, { likeCount: { $gte: 1 } }]
        };
      } else
        searchquery = { $or: [{ shareCount: { $gte: 1 } }, { ratedByUser: { $gte: 1 } }, { likeCount: { $gte: 1 } }] };

    } else if (req.body.collective == 'mostrated') {
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

  } // req.body.collective end



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

  if (req.body.menuCategory) {

    var reqVar = req.body.menuCategory;
    var reqVar2 = new RegExp(reqVar, 'i');

    searchquery.fine_category = reqVar2; // i deal case sensitive issues

  } else if (req.body.categoryList) {
    var cat = req.body.categoryList;
    var myarr = [];
    var j = 0;
    if(req.body.categoryList.length==1){


      var query_category =new RegExp(cat[0], 'i');
      searchquery.fine_category = query_category;

    }

    else if (req.body.categoryList.length > 0) {

      for (j = 0; j < cat.length; j += 1) {
        myarr[j] = new RegExp(cat[j], 'i');
      }



      searchquery.all_categories = { $in: myarr }; // this is or logic
    }

  }  // req.body.menucategory end



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
  // occassion will be searched inside
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

    if (req.body.md5) {
    searchquery.md5 = req.body.md5;

  }
  /*
  if (req.body.catalogId) {
    searchquery.catalogId = req.body.catalogId;

  }

  if (req.body.productId) {
    searchquery.productId = req.body.productId;

  } */

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
       title:1,
       md5:1,
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
         //.sort(sortingorder)
         .select({
       _id: 1,
       catalogId: 1,
       //productId: 1,
       title:1,
        md5:1,
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
      // color: 1,
       //color_images: 1,
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

//////////// end productResult
