/* eslint-disable */
// Bismillah Hir rahmanir rahim
// In the name of Allah who is The One and only creator of Universe
//http://community.prosperent.com/announcement.php?f=&a=2
//user module define
var $ = jQuery.noConflict(); //avoiding jquery conflict
//ng santize for html
// ng cookies cookies


// save product list for later
///////////// define MAIN controller for the project//////////////////////////////
UserApp.controller("mainCtrl", function ($scope, getbrandlistfact,searchServiceCatalog, searchServiceCount, twoTapService, $q, setRequiredfieldCart, $window, $http, $cookies, $location, $routeParams, $route, $filter, $log, $timeout, Slug, $interval, $anchorScroll, $sce, $rootScope, Authentication) {
    //$scope.loaddone =false;
    $scope.showstatic = true;
    $scope.collective_review = false;
    $scope.openSocialPopup = function (product, tab, event) {
        $scope.socialPopupProduct = product;
        $scope.socialPopupTab = tab;

        if ($location.path().indexOf('/SOC') > -1) {

            if (angular.isDefined($scope.backupaltimages) && $scope.backupaltimages != '') {

                $scope.socialPopupProduct.image_url = angular.copy($scope.backupaltimages);


            }

        }


    };
    $scope.undread_mails = 0;
    $scope.undread_coupons = 0;


    $scope.loadfull = false;
    $scope.checkoutpossible = true;
    $scope.invalid_coupons = 0;
    $scope.failed_item_num = 0;
    $scope.og_image = 'http://104.236.166.98/images/logo.jpg';
    var pathMain = $location.path();
    $scope.addTobagPossible = true;
    var broadcastInterval;
    $scope.stopbroadcastInterval = function () {
        $interval.cancel(broadcastInterval);
        $scope.broadcastGap = 0;
    };
    //$scope.cartOptions = ["option 1", "option2","option 3","option 4", "style and size", "stone","size and width","custom quantity","top size","bottom size","flavor","frame","wattage","shade","fit","length",
    //"scent","frame color" ];
    $scope.step = 1; // required in check out page
    $scope.tap = 1; // required in check out page
    $scope.considered_items = [];
    $scope.required_field_values = {};
    $scope.catlocal = {};
    $scope.brdglocal = {};
    $scope.timeGapRequest = 0;
    //$scope.quantity_options.push(j);
    $scope.alphacat = {};
    //$scope.headerAlphabetShow ={ category :{}, shop:{}, brand:{}};
    $scope.pro = {}; // merchant select top
    $scope.color_arr = [];
    $scope.catg = {}; // category slection top
    $scope.brdg = {}; // brand selection top
    $scope.currentpage = 1;

    $scope.prosperentSearchUrl = "";
    $scope.tempgeneratedlink = "";
    $scope.prosearch = {};
    $scope.brand_string_arr = [];
    $scope.atleast_one = 0;// atleast one price range selected
    $scope.firsttime = {"loading": 0}; // whether first time loading
    $scope.mapped_cat = {};
    $scope.mapped_cat_id = {};

    $scope.homeloaded = 0;
    $scope.ms = {
        checkAllShop: true,
        checkAllCat: true,
        checkAllDegnr: true
    }
    $scope.products = [];
    angular.element('main-search').scope().vm = {checkAllShop: true, checkAllCat: true, checkAllDegnr: true};

    // angular.element('main-search').scope().vm.checkAllShop =true;
    //angular.element('main-search').scope().vm.checkAllCat = true;
    //angular.element('main-search').scope().vm.checkAllDegnr=true;
    $scope.ss = {activeTab: '1'};
    /*
     if(pathMain.indexOf('storechosen') < 0  && $scope.firsttime.loading == 0)
     $scope.filterCatMerchantBrandList= false; //
     else */
    $scope.filterCatMerchantBrandList = false; //
    $scope.filterBrandListEnable = false;
    $scope.filterMerchantListEnable = false;
    var cInterval;
    $scope.stopcInterval = function () {
        $interval.cancel(cInterval);
        $scope.tGap = 0;
    };
    //for wishlist  cart changed
    var sInterval;
    $scope.stopsInterval = function () {
        $interval.cancel(sInterval);
        $scope.sGap = 0;
    };
    var mInterval;
    var mgInterval;
    $scope.stopmInterval = function () {
        $interval.cancel(mInterval);
        $scope.mGap = 0;
    };
    $scope.stopmgInterval = function () {
        $interval.cancel(mgInterval);
        $scope.mgGap = 0;
    };


    $scope.bodyClick = function () {
        angular.element('main-search').scope().vm.showsearch = false;
        // $scope.showPopup = false;
        $scope.activePopup = -1;
        $scope.addClass = false;
        $scope.openFilter = false;
    }
    $scope.showThisGr = function (grIndex) {
        $scope.filterGr = grIndex;
        $scope.fSlideLeft = true;
    }
    // Small popup on click
    $scope.showPopupFn = function ($event, tracker) {
        $event.stopPropagation();
        $scope.activePopup = tracker;
        // Push scroll if popup cut off in bottom line
        if ($($event.target).parents('.defaultScroll').length) {
            var popUpHt = $($event.target).parent().find('.popUp').outerHeight();
            var elmTop = $($event.target).offset().top + popUpHt + 20;
            var scrollConTp = $($event.target).parents('.defaultScroll').offset().top + $($event.target).parents('.defaultScroll').outerHeight();
            var scrollRange = $($event.target).parents('.defaultScroll').scrollTop() + $($event.target).offset().top - $($event.target).parent().offset().top + popUpHt;
            if (elmTop > scrollConTp) {
                $('.defaultScroll').animate({scrollTop: scrollRange}, 500);
            }
        }
    }
    // Go to target position inside scroll on click
    $scope.ScrollToTarget = function ($event, ltrID) {
        $event.stopPropagation();
        var gothere = ltrID;
        $scope.activeIt = ltrID;
        //var contactTopPosition = $(gothere).offset().top;
        //console.log($(gothere).offset().top);
        var contactTopPosition = $(gothere).parents('.defaultScroll').scrollTop() + $(gothere).offset().top - $(gothere).parents('.defaultScroll').offset().top
        $('.defaultScroll').animate({scrollTop: contactTopPosition}, 1000);
        if (screen.width < 767) {
            console.log('enterrrrrrrr')
            // $('html, body').animate({scrollTop: $('.tab_content .search_result').offset().top  },500);
            console.log($('.s_result_right').offset().top)
            $('html, body').animate({scrollTop: $('.s_content_list').offset().top - 40}, 500);
        }
    }

    var array_alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O',
        'P','Q','R','S','T','U','V','W','X','Y','Z'];
    var tempalphabet="";


    $scope.ScrollToTargetStatic = function ($event, ltrID,alphabet,alphabetIndex) {
        $event.stopPropagation();
        var gothere = ltrID;
        $scope.activeIt = ltrID;

        $scope.brandGroupShow[alphabet] = true;

        for(var i=2;i<alphabetIndex;i++ ) {
            tempalphabet=array_alphabet[i];
            $scope.brandGroupShow[tempalphabet] = true;

        }


        $timeout(function () {

            var contactTopPosition = $(gothere).parents('.defaultScroll').scrollTop() + $(gothere).offset().top - $(gothere).parents('.defaultScroll').offset().top
            $('.defaultScroll').animate({scrollTop: contactTopPosition}, 1000);
            if (screen.width < 767) {
                console.log('time out function')
                // $('html, body').animate({scrollTop: $('.tab_content .search_result').offset().top  },500);
                console.log($('.s_result_right').offset().top)
                $('html, body').animate({scrollTop: $('.s_content_list').offset().top - 40}, 500);
            }

        }, 500)

    }


    $scope.setlastmerchant = function(smerchant) {

        $cookies.put('lastmerchant',smerchant);

    }


    // Go to target position in page on click
    $scope.goToTarget = function ($event, targetID) {
        var gothere = '#targetNo' + targetID;
        if ($(gothere).length)$('html, body').animate({scrollTop: $(gothere).offset().top}, 700);
    }
    // Add class toggle with any object by click
    $scope.addClass = false;
    $scope.addClassToggle = function ($event, withThis) {
        $event.stopPropagation();
        //$event.preventDefault();
        $scope.withThis = withThis;
        $scope.addClass = !$scope.addClass;
    }
    //   user scope
    $scope.user = {
        email: "",
        firstname: "",
        lastname: "",
        password: "",
        zip: "",
        ss_subscribe: true,
        gender: 1
    };
    $scope.keys = [];
    var searchParams = {path: 'divine'}; // search parameter currently empty
    $scope.selectCategorySearchboxFromInside = false; // are we search from search box
    $scope.selectMerchantSearchboxFromInside = false; // are we search from search box
    $scope.selectBrandSearchboxFromInside = false;// are we search from search box
    $scope.change_sorting = false;

    // on click sorting
    $scope.update_sorting = function (sort) {
        $scope.sortorder = sort;
        $scope.change_sorting = true;
        if (sort == 7) {
            $scope.tooltipShow = true;
            return;
        }
        // for showing red heart
        sort == 0 ? $scope.sFavorite = true : $scope.sFavorite = false;
        $scope.tooltipShow = false;
        $scope.loaddone = false;
        $scope.bigCurrentPage = 1;
        searchdatabase(); // call search function
    }
    $scope.twotap_public_token = 'bc35986ded29131f39f1e0b11250c3'; // gmail
    //$scope.twotap_public_token = '56842635c4b9b3fa82b222e29f24e8'; // yahoo
    //$scope.twotap_public_token = 'c6ba4e4b8728bf182c63a8ee4cb67e'; //gmail
    //$scope.twotap_public_token ='6d0e68bb519fbf83ca229a876463f2'; //desparado2010@yahoo.com
    //$scope.twotap_public_token ='e1f4d3811042d33b643677b3280f6c';
    // add an event after page load
    $scope.hideafterLoad = false;
    $timeout(function () {
        $scope.hideafterLoad = true;
    }, 5000)
    // flex slider
    // credit card debit card validation

    $scope.shipping_chrg = {};
    // following is used to show pop up

    // required in quick view
    $scope.current_product = {
        "catalogId": "",
        "productId": "",
        "image_url": "",
        "keyword": "",
        "keywords": null,
        "celebrity": [],
        "description": "",
        "category": "",
        "price": "",
        "price_sale": "",
        "percentOff": "",
        "currency": "USD",
        "merchant": "",
        "merchantId": "",
        "brand": "",
        "upc": "",
        "isbn": "",
        "sales": 0,
        "twoTapProductUrl": "",
        "twoTapAffiliateLink": ""
    }
    $scope.jantuPakhi = "";
    // common message box variables as follows
    $scope.common_popup_message = "";
    $scope.common_popup_header = "";
    $scope.common_popup_color_class = "popup";
    if (!Date.now) {
        $scope.current_date = function now() {
            return new Date().getTime();
        }
    }
    else {
        $scope.current_date = Date.now();
    }
    $scope.page = 1;
    $scope.items = [];
    $scope.fetching = false;
    var brand_offset = 7000;
    $scope.brand_start = 0;
    //$scope.number_BrandPage = 10;
    $scope.current_selection = 0;
    $scope.current_activity_selection = null;
    $scope.bloginfo = [];
    $scope.flag = "flag_us";
    $scope.select_gender = true;
    $scope.SearchVisible = false;
    $scope.StoreVisible = false;
    $scope.CategoryVisible = false;
    $scope.DesignerVisible = false;
    $scope.allProductActive = "active last";
    $scope.sArrawIconActiveAll = "icon-search-arrow-down";
    $scope.suggestions = [];
    $scope.products = [];
    $scope.userprofile2 = []; // array for cart items
    $scope.otherMenu = '';  // text box holding other menu
    $scope.ck_all = true;
    $scope.mcart = false;
    /////////// Cart Functions ///////////////////

    $scope.country_state = {
        'United States of America': ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'Armed Forces Americas',
            'Armed Forces Europe', 'Armed Forces Pacific', 'California', 'Colorado', 'Connecticut', 'Delaware',
            'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
            'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
            'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
            'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee',
            'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'District of Columbia'],
        'Canada': ['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland/Labrador',
            'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan',
            'Yukon'],
        'Australia': ['Australian Capital Territory', 'New South Wales', 'Northern Territory', 'Queensland',
            'South Australia', 'Tasmania', 'Victoria', 'Western Australia'],
        'Ireland': ['Carlow', 'Cavan', 'Clare', 'Cork', 'Donegal', 'Dublin', 'Galway', 'Kerry', 'Kildare',
            'Kilkenny', 'Laois', 'Leitrim', 'Limerick', 'Longford', 'Louth', 'Mayo', 'Meath', 'Monaghan', 'Offaly',
            'Roscommon', 'Sligo', 'Tipperary', 'Waterford', 'Westmeath', 'Wexford', 'Wicklow'],
        'United Kingdom': ['Aberdeenshire', 'Argyllshire', 'Anglesey', 'Armagh', 'Angus/Forfarshire',
            'Antrim', 'Ayrshire', 'Bedfordshire', 'Banffshire', 'Berkshire', 'Brecknockshire', 'Bath&NthEstSomerset',
            'Buteshire', 'Buckinghamshire', 'Berwickshire', 'Cambridgeshire', 'Carmarthenshire', 'Cardiganshire',
            'Caernarfonshire', 'Cheshire', 'Cromartyshire', 'Clackmannanshire', 'Cornwall', 'Caithness',
            'Cumberland', 'Derbyshire', 'Denbighshire', 'Dumfriesshire', 'Down', 'Dorset', 'Dunbartonshire',
            'Durham', 'Devon', 'East Lothian', 'Essex', 'Fife', 'Flintshire', 'Fermanagh', 'Gloucestershire',
            'Glamorgan', 'Hampshire', 'Hertfordshire', 'Huntingdonshire', 'Hereford and Worcs.', 'Isle of Islay',
            'Isle of Lewis', 'Isle of Man', 'Invernesshire', 'Isle of Skye', 'Isle of Wight', 'Isle of Scilly',
            'Kent', 'Kincardineshire', 'Kirkcudbrightshire', 'Kinross-shire', 'Lancashire', 'London, City of',
            'Leicestershire', 'Lincolnshire', 'Lanarkshire', 'London', 'Midlothian', 'Merioneth', 'Mid Glamorgan',
            'Monmouthshire', 'Morayshire', 'Montgomeryshire', 'Middlesex', 'Northamptonshire', 'Norfolk',
            'Nairnshire', 'Nottinghamshire', 'Northumberland', 'Orkney', 'Oxfordshire', 'Peeblesshire', 'Pembrokeshire',
            'Perthshire', 'Radnorshire', 'Renfrewshire', 'Ross-shire', 'Rutland', 'Roxburghshire', 'East Sussex',
            'Selkirkshire', 'South Glamorgan', 'Shropshire', 'Suffolk', 'Shetland', 'Somerset', 'Staffordshire',
            'Sutherland', 'Stirlingshire', 'West Sussex', 'Sussex', 'Surrey', 'Tyrone', 'Warwickshire', 'Worcestershire',
            'Westmorland', 'West Glamorgan', 'Wiltshire', 'West Lothian', 'Wigtownshire', 'North Yorkshire', 'Yorkshire',
            'South Yorkshire', 'West Yorkshire', 'West Midlands']
    };




    $scope.update_uinfo = function (data) {


        $http
            .post('/user/profile', {userfields: data})
            .success(function () {
                console.log('ok');
            }).error(function (err) {

            console.log('not okay');

        })
    }


    if (angular.isDefined($cookies.get('shoppingbag_cart_changed')) && angular.isDefined($cookies.get('shoppingbag_cart_id'))) {
        $scope.shoppingbag_cart_changed = $cookies.get('shoppingbag_cart_changed');
    }
    else {
        $cookies.put('shoppingbag_cart_changed', true);
        $scope.shoppingbag_cart_changed = true;
    }
    $scope.deleteFromCartCatIdTwoVal = function (catalogId, prokey, wsitekey, added_failed) {
        $scope.mcart = true;
        $scope.deleteFromCartCatalog(catalogId);
        $scope.deleteFromCartProMd5(prokey, wsitekey, added_failed);
    }
    $scope.deleteFromWishIdTwoVal = function (catalogId, prokey, wsitekey, added_failed) {
        $scope.deleteFromWishCatalog(catalogId);
        $scope.deleteFromWishProMd5(prokey, wsitekey, added_failed);
    }
    $scope.estimated_price_totals = {"final_price": "$0.0", "subtotal": "$0.0"};
    $scope.movetoSavelist = function (catalogId, prokey, wsitekey, added_failed, proMd5) {
        //$scope.deleteFromCartCatalog(catalogId);
        if ($scope.loggedin == 0 || $scope.loggedin == undefined) {
            //sShoppable.ssLogIn();
            $scope.common_popup_header = "Move to Save list Failure Notification";
            $scope.common_popup_message = "Product Failed to move to savelist. Please Logged in First to Save ";
            $('#commonPopup').modal('show');
            return;
        }
        $http.post('/move_to_SaveList', {proMD: prokey, proMd5: proMd5}).then(function (response) {
                $scope.num_moved = angular.copy(proMd5.quantity);
                $scope.move_text = "saved list";
                $scope.move_item = angular.copy(proMd5);

                $scope.move_item.lnk = angular.copy("#!/SOC/" + proMd5.catalogId + "/" + proMd5.title);
                $scope.move_item.image = angular.copy(proMd5.image);
                $scope.move_item.twoTapProductUrl = angular.copy(proMd5.original_url);

                $scope.wishbag_cart_changed = true;
                var required_field_data = {};
                var tempr;

                for (var ty = 0; ty < proMd5.required_field_names.length; ty++) {

                    tempr = proMd5.required_field_names[ty];
                    required_field_data[tempr] = angular.copy(proMd5[tempr]);

                }


                if (response.data.stat) {
                    //get_cart_details(proMd5.cartId, proMd5.quantity);
                    console.log(response.data);
                    $scope.mgGap = 0;
                    $scope.userprofile2 = response.data.cart;
                    $scope.saveprofile2 = response.data.wishList;

                    $scope.mcart = true; // move to cart true
                    $scope.cartDistinctStore = getcartUniqueRetailer($scope.userprofile2);
                    $scope.total_cart_distinct_store = $scope.cartDistinctStore.length;
                    $scope.cart_items_number = calculateItems($scope.userprofile2);

                    if ($scope.ck_all)
                        $scope.num_items = angular.copy($scope.cart_items_number);

                    $scope.cartTotal();

                    $scope.saved_item_number = calculateItems($scope.saveprofile2);
                    $scope.cartDistinctDreamStore = getcartUniqueRetailer($scope.saveprofile2);
                    $scope.total_cart_distinct_wishstore = $scope.cartDistinctDreamStore.length;
                    $scope.num_stores_wish = $scope.saved_item_number;
                    $scope.shoppingbag_cart_changed = true;
                    $cookies.put('shoppingbag_cart_changed', true);
                    $scope.deleteFromCartProMd5(prokey, wsitekey, added_failed);
                    $scope.est($scope.move_item, required_field_data);
                    $scope.$broadcast('cartChanged');


                    mgInterval = $interval(function () {
                        // careful to check purchase status use right purchase id
                        if ($scope.mgGap > 499) {
                            $scope.stopmgInterval();
                            $scope.$broadcast('wishChanged');

                            $('#addToBag').modal('show');

                            //   $location.hash('saved');
                            //   $anchorScroll();
                        }
                        $scope.mgGap = $scope.mgGap + 500;
                    }, 500);
                }
            }, function (response) {
                $scope.common_popup_header = "Move to Save list Failure Notification";
                $scope.common_popup_message = "Product Failed to move to savelist ";
                $('#commonPopup').modal('show');
                $scope.ss_wish_load = 0;
            }
        )
    }
    $scope.moveToCart = function (catalogId, prokey, wsitekey, added_failed, proMd5) {
        $scope.estimated_price_totals = {"final_price": "$0.0", "subtotal": "$0.0"};
        $http.post('/move_to_Cart', {proMD: prokey, proMd5: proMd5}).then(function (response) {


            $scope.num_moved = angular.copy(proMd5.quantity);
            $scope.move_text = "bag";
            $scope.move_item = angular.copy(proMd5);

            $scope.move_item.lnk = angular.copy("#!/SOC/" + proMd5.catalogId + "/" + proMd5.title);
            $scope.move_item.image = angular.copy(proMd5.image);
            $scope.move_item.twoTapProductUrl = angular.copy(proMd5.original_url);

            var required_field_data = {};
            var tempr;

            for (var ty = 0; ty < proMd5.required_field_names.length; ty++) {

                tempr = proMd5.required_field_names[ty];
                required_field_data[tempr] = angular.copy(proMd5[tempr]);

            }


            if (response.data.stat) {
                // get_cart_details(proMd5.cartId, proMd5.quantity);
                $scope.mGap = 0;

                $scope.shoppingbag_cart_changed = true;
                $cookies.put('shoppingbag_cart_changed', true);


                $scope.userprofile2 = response.data.cart;
                $scope.saveprofile2 = response.data.wishList;

                $scope.mcart = true; // move to cart true
                $scope.cartDistinctStore = getcartUniqueRetailer($scope.userprofile2);
                $scope.total_cart_distinct_store = $scope.cartDistinctStore.length;
                $scope.cart_items_number = calculateItems($scope.userprofile2);

                if ($scope.ck_all)
                    $scope.num_items = angular.copy($scope.cart_items_number);

                $scope.cartTotal();

                $scope.saved_item_number = calculateItems($scope.saveprofile2);
                $scope.cartDistinctDreamStore = getcartUniqueRetailer($scope.saveprofile2);
                $scope.total_cart_distinct_wishstore = $scope.cartDistinctDreamStore.length;
                $scope.num_stores_wish = $scope.saved_item_number;


                $scope.est($scope.move_item, required_field_data);


                $scope.deleteFromWishProMd5(prokey, wsitekey, added_failed); // delete an item from wish list

                $scope.$broadcast('wishChanged');


                mInterval = $interval(function () {
                    // careful to check purchase status use right purchase id
                    if ($scope.mGap > 499) {
                        $scope.stopmInterval();
                        $scope.$broadcast('cartChanged');

                        // $location.hash("s_bag_content cart");
                        // $anchorScroll();
                        $('#addToBag').modal('show');
                    }
                    $scope.mGap = $scope.mGap + 500;
                }, 500);
            }
        }, function (response) {
            $scope.common_popup_header = "Move to Cart Failure Notification";
            $scope.common_popup_message = "Product Failed to move to Cart ";
            $('#commonPopup').modal('show');
            $scope.ss_cart_load = 0;
        })
    }

    /////////////////////////////////////////////// CART END ////////////////////////////////////////////////////
    // get more brands
    // Quick view on click shop this item
    // clicking plus sign
    $scope.shopthisitem = function (current_product) {
        var slu = Slug.slugify(current_product.keyword);
        var str = "/SOC/" + current_product.catalogId + "/" + slu;
        //quick-popup
        $location.path(str);
        $route.reload();
    }


    ////// may be $remove after search result page don e ///
    //////// mix panel ////////////////////////
    $http.post('/mixpanelsearchDb').success(function (searchterm) {
        if (!angular.isDefined(searchterm)) {
            return;
        }
        $scope.searchtermarr = [];
        for (var i = 0; i < searchterm.length; i++) {
            $scope.searchtermarr.push(searchterm[i].keyword);
        }
        $scope.searchtermarrvalue = searchterm;
    }).error(function (searchterm, status, headers, config) {
        $scope.n = 'ERROR';
        $scope.searchtermarr = [];
    });
    //------------------------------------------------------------------- ROBIN ANGULAR -----------------------------------------------------------------------

    var arr = [];
    var tarry = [];
    var countries = [];
    var bloginfo = [];
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
    $scope.states = tarry;
    $scope.countries = []; // this holding the home page product list
    $scope.designers = [];
    $scope.select_dept = ""; // categories
    // $scope.selected={"catalogId":"","productId":"","affiliate_url":"","image_url":"","keyword":"","keywords":null,"celebrity":[],"description":"","category":"","price":"","price_sale":"","percentOff":null,"currency":"","merchant":"","merchantId":"","brand":"","upc":"","isbn":"","sales":0};
    $scope.queryobj = {};  // this is used for query
    $scope.selected = "";  // key word for search or title
    $scope.select_brand = "";
    $scope.select_merchant = "";
    $scope.select_designer = "";
    // following jsons are used for searching
    $scope.offer = {"select_offers": false};
    $scope.arrival = {"new_arrival": false};
    $scope.premium = {"designer": false};
    $scope.occassion = {"casual": false, "vacation": false, "work": false, "other": false};
    $scope.select_oc_casual = false;  // occassion casual
    $scope.select_oc_vacation = false;  // occassion vacation
    $scope.select_oc_work = false; // occassion work
    $scope.select_oc_other = false; // occassion other
    $scope.scroll_disabled = false; // that means load more should work
    //$scope.minprice = 0;
    // $scope.maxprice = 9999.00;
    //$scope.select_color = []; // old
    $scope.selected_merchantlist = [];
    $scope.selected_merchantlistByclick = [];
    $scope.selected_brandlist = [];
    $scope.selected_categorylist = [];
    $scope.selected_categorylist_apistring = [];
    $scope.mapped_categorylist = [];
    $scope.total_record = 0;
    $scope.totalRecordsAvailable = 0;
    $scope.bigCurrentPage = 1;
    $scope.adminitemsperpage = 5;//
    $scope.limit = 80;         // page limit
    $scope.maxSize = 64;      //  Limit number for pagination size.
    $scope.user_offset = $scope.limit;
    $scope.itemsperpage = $scope.user_offset;//
    $scope.urlextend = "";
    // $scope.selected_sorting = "percentOff desc";      // sorting order
    // $scope.selected_sorting = "relevance";      // sorting order
    $scope.cost = {"range": [0.00, 1000000.00]};
    $scope.percent = {"range": [0.00, 100.00]};
    $scope.select_color = "";
    $scope.extendedurl = "";   // for suggestion
    $scope.sortorder = 6;
    $scope.viewall = 0; // initially view limited
    $scope.showup = 0;
    //$scope.fullpath= $location.host()+$location.path();
    $scope.fullpath = $location.absUrl();
    $scope.pathing = "Search";
    $scope.load_click = 0;
    $scope.after_login_location = '/dashboard';
    $scope.customizeMenuItemName = 'dashboard';
    $scope.menuClicked = 'dashboard';
    $scope.SmartPathing = "DASHBOARD";
    $scope.genderclass = "";
    if (angular.isDefined($cookies.get('useridentity')))
        $scope.cook_signed = $cookies.get('useridentity');
    if (angular.isDefined($cookies.get('unsignedUseridentity')))
        $scope.cook_unsigned = $cookies.get('unsignedUseridentity');
    var arr = [];
    var tarry = ['accessory', 'bag', 'beauty', 'gap', 'gifts', 'jeans', 'kid', 'men', 'overstock', 'pant', 'shirt', 'shoe', 'women', 'toy', 'game', 'tool', 'home improvement', 'automotive', 'book', 'cds', 'vinyl',
        'clothing', 'accessories', 'car', 'computers & accessories', 'laptop', 'desktop', 'mobile',
        'electronics', 'telephone', 'furniture', 'grocery & gourmet food', 'health', 'personal care',
        'health & personal care', 'dress', 'home & kitchen', 'kitchen', 'industrial', 'scientific',
        'jewelry', 'movies', 'tv', 'musical instruments', 'office products', 'patio', 'lawn & garden',
        'pet supplies', 'pet food', 'shoe', 'software', 'sports', 'outdoors',
        'video games', 'arts', 'crafts', 'sewing', 'baby products'];
    $scope.color_array = ['red', 'black', 'white', 'green', 'blue', 'yellow', 'gold', 'orange', 'brown', 'pink', 'violet', 'fuchsia', 'magenta', 'purple', 'cyan', 'turquoise', 'teal', 'beige', 'gray', 'indigo'];
    //$scope.loading = true;
    $scope.brandLoading = false;
    $scope.globalSearch = false;
    $scope.slide_stores = []; // the store slider for home page
    $scope.justClickedMenu = false;
    $scope.shopcatset = false;
    $scope.slidimageclick = false;
    $scope.searchuser = {
        loginemail: "",
        password: ""
    }
    $scope.hide_acc_div_hide = function () {
        $('.acc_div_hide').fadeOut(400);
        $('.after_clk_noti').show();
    }
    $scope.remember = true;
    // use this used on home
    $scope.menuCategorySearch = function (category) {
        $scope.pathing = category;
        $scope.SmartPathing = category;
        $scope.viewall = 0;
        $scope.showup = 0;
        $scope.load_click = 0;
        $scope.bigCurrentPage = 1;
        $scope.slide_stores = [];
        $scope.globalSearch = false;
        $scope.selected = "";
        $scope.selected_key = "";



        $scope.selected_merchantlist = [];
        $scope.selected_merchantlistByclick = [];
        $scope.selected_brandlist = [];
        $scope.selected_categorylist = [];


        $scope.oc_casual = false;
        $scope.oc_work = false;
        $scope.oc_vacation = false;
        $scope.oc_other = false;
        $scope.color_arr = [];
        $scope.saleOffer = false;

        $scope.justClickedMenu = true;
        $scope.shopcatset = false;
        $scope.slidimageclick = false;

        $scope.usermenu = category; // under which menu he is there
        $scope.menuClicked = category; // which menu clicked






        if ($scope.sortorder > 0)
            $scope.queryobj.sortorder = $scope.sortorder;
        $scope.usermenu = "";
        $scope.menuClicked = category; // search within that zone
        var path = $location.path();
        if ($scope.loggedin == 1) {
            if (path == '/') {
                $location.path('/dashboard');
                $route.reload();
            }
            if (category == 'women') {
                //length not calculated yet
                if (angular.isDefined($scope.userstoptenWomen)) {
                    if ($scope.userstoptenWomen.length > 0) {
                        $scope.selected_merchantlist = angular.copy($scope.userstoptenWomen);
                        $scope.slide_stores = angular.copy($scope.userstoptenWomen);
                        define_slider($scope.userstoptenWomen, category);
                    }
                    else {
                        $scope.selected_merchantlist = angular.copy($scope.featuredShoplistWomen);
                        $scope.slide_stores = angular.copy($scope.featuredShoplistWomen);
                        define_slider($scope.featuredShoplistWomen, category);
                    }
                }
                else {
                    $scope.selected_merchantlist = angular.copy($scope.featuredShoplistWomen);
                    $scope.slide_stores = angular.copy($scope.featuredShoplistWomen);
                    define_slider($scope.featuredShoplistWomen, category);
                }
            }
            else if (category == 'men') {
                if (angular.isDefined($scope.userstoptenMen)) {
                    if ($scope.userstoptenMen.length > 0) {
                        $scope.selected_merchantlist = angular.copy($scope.userstoptenMen);
                        $scope.slide_stores = angular.copy($scope.userstoptenMen);
                        define_slider($scope.userstoptenMen, category);
                    }
                    else {
                        $scope.selected_merchantlist = angular.copy($scope.featuredShoplistMen);
                        $scope.slide_stores = angular.copy($scope.featuredShoplistMen);
                        define_slider($scope.featuredShoplistMen, category);
                    }
                }
                else {
                    $scope.selected_merchantlist = angular.copy($scope.featuredShoplistMen);
                    $scope.slide_stores = angular.copy($scope.featuredShoplistMen);
                    define_slider($scope.featuredShoplistMen, category);
                }
            }  // men end
            else if (category == 'shoe') {
                if (angular.isDefined($scope.userstoptenShoes)) {
                    if ($scope.userstoptenShoes.length > 0) {
                        $scope.selected_merchantlist = angular.copy($scope.userstoptenShoes);
                        $scope.slide_stores = angular.copy($scope.userstoptenShoes);
                        define_slider($scope.userstoptenShoes, category);
                    }
                    else {
                        $scope.selected_merchantlist = angular.copy($scope.featuredShoplistShoes);
                        $scope.slide_stores = angular.copy($scope.featuredShoplistShoes);
                        define_slider($scope.featuredShoplistShoes, category);
                    }
                }
                else {
                    $scope.selected_merchantlist = angular.copy($scope.featuredShoplistShoes);
                    $scope.slide_stores = angular.copy($scope.featuredShoplistShoes);
                    define_slider($scope.featuredShoplistShoes, category);
                }
            }
            else if (category == 'accessories') {
                if (angular.isDefined($scope.userstoptenAccessories)) {
                    if ($scope.userstoptenAccessories.length > 0) {
                        $scope.selected_merchantlist = angular.copy($scope.userstoptenAccessories);
                        $scope.slide_stores = angular.copy($scope.userstoptenAccessories);
                        define_slider($scope.userstoptenAccessories, category);
                    }
                    else {
                        $scope.selected_merchantlist = angular.copy($scope.featuredShoplistAccessories);
                        $scope.slide_stores = angular.copy($scope.featuredShoplistAccessories);
                        define_slider($scope.featuredShoplistAccessories, category);
                    }
                }
                else {
                    $scope.selected_merchantlist = angular.copy($scope.featuredShoplistAccessories);
                    $scope.slide_stores = angular.copy($scope.featuredShoplistAccessories);
                    define_slider($scope.featuredShoplistAccessories, category);
                }
            }
            else if (category == 'beauty') {
                if (angular.isDefined($scope.userstoptenBeauty)) {
                    if ($scope.userstoptenBeauty.length > 0) {
                        $scope.selected_merchantlist = angular.copy($scope.userstoptenBeauty);
                        $scope.slide_stores = angular.copy($scope.userstoptenBeauty);
                        define_slider($scope.userstoptenBeauty, category);
                    }
                    else {
                        $scope.selected_merchantlist = angular.copy($scope.featuredShoplistBeauty);
                        $scope.slide_stores = angular.copy($scope.featuredShoplistBeauty);
                        define_slider($scope.featuredShoplistBeauty, category);
                    }
                }
                else {
                    $scope.selected_merchantlist = angular.copy($scope.featuredShoplistBeauty);
                    $scope.slide_stores = angular.copy($scope.featuredShoplistBeauty);
                    define_slider($scope.featuredShoplistBeauty, category);
                }
            }  // BEAUTY end
            else if (category == 'kid') {
                if (angular.isDefined($scope.userstoptenKids)) {
                    if ($scope.userstoptenKids.length > 0) {
                        $scope.selected_merchantlist = angular.copy($scope.userstoptenKids);
                        $scope.slide_stores = angular.copy($scope.userstoptenKids);
                        define_slider($scope.userstoptenKids, category);
                    }
                    else {
                        $scope.selected_merchantlist = angular.copy($scope.featuredShoplistKids);
                        $scope.slide_stores = angular.copy($scope.featuredShoplistKids);
                        define_slider($scope.featuredShoplistKids, category);
                    }
                }
                else {
                    $scope.selected_merchantlist = angular.copy($scope.featuredShoplistKids);
                    $scope.slide_stores = angular.copy($scope.featuredShoplistKids);
                    define_slider($scope.featuredShoplistKids, category);
                }
            }
            else if (category == 'home') {
                if (angular.isDefined($scope.userstoptenHome)) {
                    if ($scope.userstoptenHome.length > 0) {
                        $scope.selected_merchantlist = angular.copy($scope.userstoptenHome);
                        $scope.slide_stores = angular.copy($scope.userstoptenHome);
                        define_slider($scope.userstoptenHome, category);
                    }
                    else {
                        $scope.selected_merchantlist = angular.copy($scope.featuredShoplistHome);
                        $scope.slide_stores = angular.copy($scope.featuredShoplistHome);
                        define_slider($scope.featuredShoplistHome, category);
                    }
                }
                else {
                    $scope.selected_merchantlist = angular.copy($scope.featuredShoplistHome);
                    $scope.slide_stores = angular.copy($scope.featuredShoplistHome);
                    define_slider($scope.featuredShoplistHome, category);
                }
            }
            else if (category == 'gift') {
                if (angular.isDefined($scope.userstoptenGifts)) {
                    if ($scope.userstoptenGifts.length > 0) {
                        $scope.selected_merchantlist = angular.copy($scope.userstoptenGifts);
                        $scope.slide_stores = angular.copy($scope.userstoptenGifts);
                        define_slider($scope.userstoptenGifts, category);
                    }
                    else {
                        $scope.selected_merchantlist = angular.copy($scope.featuredShoplistGifts);
                        $scope.slide_stores = angular.copy($scope.featuredShoplistGifts);
                        define_slider($scope.featuredShoplistGifts, category);
                    }
                }
                else {
                    $scope.selected_merchantlist = angular.copy($scope.featuredShoplistGifts);
                    $scope.slide_stores = angular.copy($scope.featuredShoplistGifts);
                    define_slider($scope.featuredShoplistGifts, category);
                }
            }
            else if (category.trim() == '' || category == 'others') {
                if (angular.isDefined($scope.userstoptenLocal)) {
                    if ($scope.userstoptenLocal.length > 0) {
                        $scope.selected_merchantlist = angular.copy($scope.userstoptenLocal);
                        $scope.slide_stores = angular.copy($scope.userstoptenLocal);
                        define_slider($scope.userstoptenLocal, category);
                    }
                    else {
                        $scope.selected_merchantlist = angular.copy($scope.featuredShoplistOthers);
                        $scope.slide_stores = angular.copy($scope.featuredShoplistOthers);
                        define_slider($scope.featuredShoplistOthers, '');
                    }
                }
                else {
                    $scope.selected_merchantlist = angular.copy($scope.featuredShoplistOthers);
                    $scope.slide_stores = angular.copy($scope.featuredShoplistOthers);
                    define_slider($scope.featuredShoplistOthers, '');
                }
            }
            else if (category == 'dashboard') {
                if (angular.isDefined($scope.userstoptenDashboard)) {
                    if ($scope.userstoptenDashboard.length > 0) {
                        $scope.selected_merchantlist = angular.copy($scope.userstoptenDashboard);
                        $scope.slide_stores = angular.copy($scope.userstoptenDashboard);
                        define_slider($scope.userstoptenDashboard, category);
                    }
                    else {
                        $scope.selected_merchantlist = angular.copy($scope.featuredShoplistDashboard);
                        $scope.slide_stores = angular.copy($scope.featuredShoplistDashboard);
                        define_slider($scope.featuredShoplistDashboard, category);
                    }
                }
                else {
                    $scope.selected_merchantlist = angular.copy($scope.featuredShoplistDashboard);
                    $scope.slide_stores = angular.copy($scope.featuredShoplistDashboard);
                    define_slider($scope.featuredShoplistDashboard, category);
                }
                if (path == '/search' && $scope.firsttime.loading == 0) {
                    $scope.selected_merchantlist = [];
                    $scope.timeGapRequest = 0;
                    $scope.intervalRequestlinkGenerate();
                }
            }
            else {
                if (angular.isDefined($scope.userstoptenLocal)) {
                    if ($scope.userstoptenLocal.length > 0) {
                        $scope.selected_merchantlist = angular.copy($scope.userstoptenLocal);
                        $scope.slide_stores = angular.copy($scope.userstoptenLocal);
                        define_slider($scope.userstoptenLocal, category);
                    }
                    else {
                        $scope.selected_merchantlist = angular.copy($scope.featuredShoplistOthers);
                        $scope.slide_stores = angular.copy($scope.featuredShoplistOthers);
                        define_slider($scope.featuredShoplistOthers, category);
                    }
                }
                else {
                    $scope.selected_merchantlist = angular.copy($scope.featuredShoplistOthers);
                    $scope.slide_stores = angular.copy($scope.featuredShoplistOthers);
                    define_slider($scope.featuredShoplistOthers, category);
                }
            }

            $scope.loaddone = false;
            if ($scope.firsttime.loading == 0) {
                if (path == '/search') {
                    $scope.selected_merchantlist = [];
                    $scope.timeGapRequest = 0;
                    $scope.intervalRequestlinkGenerate();
                }
            }

        }
        else {
            if (path == '/dashboard') {
                $location.path('/');
                $route.reload();
            }
            if (category == 'women') {
                $scope.selected_merchantlist = angular.copy($scope.featuredShoplistWomen);
                $scope.slide_stores = angular.copy($scope.featuredShoplistWomen);
                define_slider($scope.featuredShoplistWomen, category);
            }
            else if (category == 'men') {
                $scope.selected_merchantlist = angular.copy($scope.featuredShoplistMen);
                $scope.slide_stores = angular.copy($scope.featuredShoplistMen);
                define_slider($scope.featuredShoplistMen, category);
            }
            else if (category == 'shoe') {
                $scope.selected_merchantlist = angular.copy($scope.featuredShoplistShoes);
                $scope.slide_stores = angular.copy($scope.featuredShoplistShoes);
                define_slider($scope.featuredShoplistShoes, category);
            }
            else if (category == 'accessories') {
                $scope.selected_merchantlist = angular.copy($scope.featuredShoplistAccessories);
                $scope.slide_stores = angular.copy($scope.featuredShoplistAccessories);
                define_slider($scope.featuredShoplistAccessories, category);
            }
            else if (category == 'beauty') {
                $scope.selected_merchantlist = angular.copy($scope.featuredShoplistBeauty);
                $scope.slide_stores = angular.copy($scope.featuredShoplistBeauty);
                define_slider($scope.featuredShoplistBeauty, category);
            }  // men end
            else if (category == 'kid') {
                $scope.selected_merchantlist = angular.copy($scope.featuredShoplistKids);
                $scope.slide_stores = angular.copy($scope.featuredShoplistKids);
                define_slider($scope.featuredShoplistKids, category);
            }
            else if (category == 'home') {
                $scope.selected_merchantlist = angular.copy($scope.featuredShoplistHome);
                $scope.slide_stores = angular.copy($scope.featuredShoplistHome);
                define_slider($scope.featuredShoplistHome, category);
            }
            else if (category == 'gift') {
                $scope.selected_merchantlist = angular.copy($scope.featuredShoplistGifts);
                $scope.slide_stores = angular.copy($scope.featuredShoplistGifts);
                define_slider($scope.featuredShoplistGifts, category);
            }
            else if (category == 'dashboard') {
                $scope.selected_merchantlist = angular.copy($scope.featuredShoplistDashboard);
                $scope.slide_stores = angular.copy($scope.featuredShoplistDashboard);
                $scope.pathing = 'Home';
                $scope.SmartPathing = 'Home';
                define_slider($scope.featuredShoplistDashboard, category);
            }
            else if (category.trim() == '') {
                $scope.selected_merchantlist = angular.copy($scope.featuredShoplistOthers);
                $scope.slide_stores = angular.copy($scope.featuredShoplistOthers);
                define_slider($scope.featuredShoplistOthers, '');
            }
            else {
                $scope.selected_merchantlist = angular.copy($scope.featuredShoplistOthers);
                $scope.slide_stores = angular.copy($scope.featuredShoplistOthers);
                define_slider($scope.featuredShoplistOthers, category);
            }
            // if some body start with search result
            if (path == '/search' && $scope.firsttime.loading == 0) {
                $scope.selected_merchantlist = [];
                $scope.timeGapRequest = 0;
                $scope.intervalRequestlinkGenerate();
            }
        }

        if ($scope.firsttime.loading != 0) {

            $scope.loaddone = false;
        }

    }
    $scope.temp_products = [];
    // top menu men women etc clicked
    $scope.menuCategorySearchApi = function (category) {
        $scope.loaddone = false;
        $scope.products = [];
        $scope.totalRecordsFound = 0;
        $scope.sliderStorelist = [];
        $scope.proLoading = true;
        $scope.selected = "";
        $scope.selected_merchantlist = [];
        $scope.selected_merchantlistByclick = [];
        $scope.selected_brandlist = [];
        $scope.selected_categorylist = [];
        $scope.globalSearch = false;
        $scope.selected_key = "";
        $scope.new_keyword_arr = [];
        $scope.oc_casual = false;
        $scope.oc_work = false;
        $scope.oc_vacation = false;
        $scope.oc_other = false;
        $scope.color_arr = [];
        $scope.saleOffer = false;
        path = $location.path();
        $scope.justClickedMenu = true;
        $scope.shopcatset = false;
        $scope.slidimageclick = false;
        $scope.viewall = 0;
        $scope.showup = 0;
        $scope.load_click = 0;
        $scope.bigCurrentPage = 1;
        $scope.usermenu = category; // under which menu he is there
        $scope.menuClicked = category; // which menu clicked
        $scope.selectCategorySearchboxFromInside = false; // used for reset
        $scope.selectMerchantSearchboxFromInside = false; // used for reset
        $scope.selectBrandSearchboxFromInside = false;    // used for reset


        angular.element('main-search').scope().vm.checkAllShop = true;
        angular.element('main-search').scope().vm.checkAllCat = true;
        angular.element('main-search').scope().vm.checkAllDegnr = true;
        if ($scope.loggedin == 1) {
            if (category == 'women') {
                //length not calculated yet
                if (angular.isDefined($scope.userstoptenWomen)) {
                    if ($scope.userstoptenWomen.length > 0) {
                        $scope.selected_merchantlist = angular.copy($scope.userstoptenWomen);
                        $scope.slide_stores = angular.copy($scope.userstoptenWomen);
                        define_slider($scope.userstoptenWomen, category);
                    }
                    else {
                        $scope.selected_merchantlist = angular.copy($scope.featuredShoplistWomen);
                        $scope.slide_stores = angular.copy($scope.featuredShoplistWomen);
                        define_slider($scope.featuredShoplistWomen, category);
                    }
                }
                else {
                    $scope.selected_merchantlist = angular.copy($scope.featuredShoplistWomen);
                    $scope.slide_stores = angular.copy($scope.featuredShoplistWomen);
                    define_slider($scope.featuredShoplistWomen, category);
                }
            }
            else if (category == 'men') {
                if (angular.isDefined($scope.userstoptenMen)) {
                    if ($scope.userstoptenMen.length > 0) {
                        $scope.selected_merchantlist = angular.copy($scope.userstoptenMen);
                        $scope.slide_stores = angular.copy($scope.userstoptenMen);
                        define_slider($scope.userstoptenMen, category);
                    }
                    else {
                        $scope.selected_merchantlist = angular.copy($scope.featuredShoplistMen);
                        $scope.slide_stores = angular.copy($scope.featuredShoplistMen);
                        define_slider($scope.featuredShoplistMen, category);
                    }
                }
                else {
                    $scope.selected_merchantlist = angular.copy($scope.featuredShoplistMen);
                    $scope.slide_stores = angular.copy($scope.featuredShoplistMen);
                    define_slider($scope.featuredShoplistMen, category);
                }
            }  // men end
            else if (category == 'shoe') {
                if (angular.isDefined($scope.userstoptenShoes)) {
                    if ($scope.userstoptenShoes.length > 0) {
                        $scope.selected_merchantlist = angular.copy($scope.userstoptenShoes);
                        $scope.slide_stores = angular.copy($scope.userstoptenShoes);
                        define_slider($scope.userstoptenShoes, category);
                    }
                    else {
                        $scope.selected_merchantlist = angular.copy($scope.featuredShoplistShoes);
                        $scope.slide_stores = angular.copy($scope.featuredShoplistShoes);
                        define_slider($scope.featuredShoplistShoes, category);
                    }
                }
                else {
                    $scope.selected_merchantlist = angular.copy($scope.featuredShoplistShoes);
                    $scope.slide_stores = angular.copy($scope.featuredShoplistShoes);
                    define_slider($scope.featuredShoplistShoes, category);
                }
            }
            else if (category == 'accessories') {
                if (angular.isDefined($scope.userstoptenAccessories)) {
                    if ($scope.userstoptenAccessories.length > 0) {
                        $scope.selected_merchantlist = angular.copy($scope.userstoptenAccessories);
                        $scope.slide_stores = angular.copy($scope.userstoptenAccessories);
                        define_slider($scope.userstoptenAccessories, category);
                    }
                    else {
                        $scope.selected_merchantlist = angular.copy($scope.featuredShoplistAccessories);
                        $scope.slide_stores = angular.copy($scope.featuredShoplistAccessories);
                        define_slider($scope.featuredShoplistAccessories, category);
                    }
                }
                else {
                    $scope.selected_merchantlist = angular.copy($scope.featuredShoplistAccessories);
                    $scope.slide_stores = angular.copy($scope.featuredShoplistAccessories);
                    define_slider($scope.featuredShoplistAccessories, category);
                }
            }
            else if (category == 'beauty') {
                if (angular.isDefined($scope.userstoptenBeauty)) {
                    if ($scope.userstoptenBeauty.length > 0) {
                        $scope.selected_merchantlist = angular.copy($scope.userstoptenBeauty);
                        $scope.slide_stores = angular.copy($scope.userstoptenBeauty);
                        define_slider($scope.userstoptenBeauty, category);
                    }
                    else {
                        $scope.selected_merchantlist = angular.copy($scope.featuredShoplistBeauty);
                        $scope.slide_stores = angular.copy($scope.featuredShoplistBeauty);
                        define_slider($scope.featuredShoplistBeauty, category);
                    }
                }
                else {
                    $scope.selected_merchantlist = angular.copy($scope.featuredShoplistBeauty);
                    $scope.slide_stores = angular.copy($scope.featuredShoplistBeauty);
                    define_slider($scope.featuredShoplistBeauty, category);
                }
            }  // men end
            else if (category == 'kid') {
                if (angular.isDefined($scope.userstoptenKids)) {
                    if ($scope.userstoptenKids.length > 0) {
                        $scope.selected_merchantlist = angular.copy($scope.userstoptenKids);
                        $scope.slide_stores = angular.copy($scope.userstoptenKids);
                        define_slider($scope.userstoptenKids, category);
                    }
                    else {
                        $scope.selected_merchantlist = angular.copy($scope.featuredShoplistKids);
                        $scope.slide_stores = angular.copy($scope.featuredShoplistKids);
                        define_slider($scope.featuredShoplistKids, category);
                    }
                }
                else {
                    $scope.selected_merchantlist = angular.copy($scope.featuredShoplistKids);
                    $scope.slide_stores = angular.copy($scope.featuredShoplistKids);
                    define_slider($scope.featuredShoplistKids, category);
                }
            }
            else if (category == 'home') {
                if (angular.isDefined($scope.userstoptenHome)) {
                    if ($scope.userstoptenHome.length > 0) {
                        $scope.selected_merchantlist = angular.copy($scope.userstoptenHome);
                        $scope.slide_stores = angular.copy($scope.userstoptenHome);
                        define_slider($scope.userstoptenHome, category);
                    }
                    else {
                        $scope.selected_merchantlist = angular.copy($scope.featuredShoplistHome);
                        $scope.slide_stores = angular.copy($scope.featuredShoplistHome);
                        define_slider($scope.featuredShoplistHome, category);
                    }
                }
                else {
                    $scope.selected_merchantlist = angular.copy($scope.featuredShoplistHome);
                    $scope.slide_stores = angular.copy($scope.featuredShoplistHome);
                    define_slider($scope.featuredShoplistHome, category);
                }
            }
            else if (category == 'gift') {
                if (angular.isDefined($scope.userstoptenGifts)) {
                    if ($scope.userstoptenGifts.length > 0) {
                        $scope.selected_merchantlist = angular.copy($scope.userstoptenGifts);
                        $scope.slide_stores = angular.copy($scope.userstoptenGifts);
                        define_slider($scope.userstoptenGifts, category);
                    }
                    else {
                        $scope.selected_merchantlist = angular.copy($scope.featuredShoplistGifts);
                        $scope.slide_stores = angular.copy($scope.featuredShoplistGifts);
                        define_slider($scope.featuredShoplistGifts, category);
                    }
                }
                else {
                    $scope.selected_merchantlist = angular.copy($scope.featuredShoplistGifts);
                    $scope.slide_stores = angular.copy($scope.featuredShoplistGifts);
                    define_slider($scope.featuredShoplistGifts, category);
                }
            }
            else if (category.trim() == '' || category == 'others') {
                if (angular.isDefined($scope.userstoptenLocal)) {
                    if ($scope.userstoptenLocal.length > 0) {
                        $scope.selected_merchantlist = angular.copy($scope.userstoptenLocal);
                        $scope.slide_stores = angular.copy($scope.userstoptenLocal);
                        define_slider($scope.userstoptenLocal, category);
                    }
                    else {
                        $scope.selected_merchantlist = angular.copy($scope.featuredShoplistOthers);
                        $scope.slide_stores = angular.copy($scope.featuredShoplistOthers);
                        define_slider($scope.featuredShoplistOthers, category);
                    }
                }
                else {
                    $scope.selected_merchantlist = angular.copy($scope.featuredShoplistOthers);
                    $scope.slide_stores = angular.copy($scope.featuredShoplistOthers);
                    define_slider($scope.featuredShoplistOthers, category);
                }
            }
            else if (category == 'dashboard') {
                if (angular.isDefined($scope.userstoptenDashboard)) {
                    if ($scope.userstoptenDashboard.length > 0) {
                        $scope.selected_merchantlist = angular.copy($scope.userstoptenDashboard);
                        $scope.slide_stores = angular.copy($scope.userstoptenDashboard);
                        define_slider($scope.userstoptenDashboard, category);
                    }
                    else {
                        $scope.selected_merchantlist = angular.copy($scope.featuredShoplistDashboard);
                        $scope.slide_stores = angular.copy($scope.featuredShoplistDashboard);
                        define_slider($scope.featuredShoplistDashboard, category);
                    }
                }
                else {
                    $scope.selected_merchantlist = angular.copy($scope.featuredShoplistDashboard);
                    $scope.slide_stores = angular.copy($scope.featuredShoplistDashboard);
                    define_slider($scope.featuredShoplistDashboard, category);
                }
            }
            else {
                if (angular.isDefined($scope.userstoptenLocal)) {
                    if ($scope.userstoptenLocal.length > 0) {
                        $scope.selected_merchantlist = angular.copy($scope.userstoptenLocal);
                        $scope.slide_stores = angular.copy($scope.userstoptenLocal);
                        define_slider($scope.userstoptenLocal, category);
                    }
                    else {
                        $scope.selected_merchantlist = angular.copy($scope.featuredShoplistOthers);
                        $scope.slide_stores = angular.copy($scope.featuredShoplistOthers);
                        define_slider($scope.featuredShoplistOthers, category);
                    }
                }
                else {
                    $scope.selected_merchantlist = angular.copy($scope.featuredShoplistOthers);
                    $scope.slide_stores = angular.copy($scope.featuredShoplistOthers);
                    define_slider($scope.featuredShoplistOthers, category);
                }
            }
            //redirected to dashboard page
            if (path != '/dashboard') {


                $location.path('/dashboard');
                $route.reload();
            }
        }
        else {
            if (category == 'women') {
                $scope.selected_merchantlist = angular.copy($scope.featuredShoplistWomen);
                $scope.slide_stores = angular.copy($scope.featuredShoplistWomen);
                define_slider($scope.featuredShoplistWomen, category);
            }
            else if (category == 'men') {
                $scope.selected_merchantlist = angular.copy($scope.featuredShoplistMen);
                $scope.slide_stores = angular.copy($scope.featuredShoplistMen);
                define_slider($scope.featuredShoplistMen, category);
            }
            else if (category == 'shoe') {
                $scope.selected_merchantlist = angular.copy($scope.featuredShoplistShoes);
                $scope.slide_stores = angular.copy($scope.featuredShoplistShoes);
                define_slider($scope.featuredShoplistShoes, category);
            }
            else if (category == 'accessories') {
                $scope.selected_merchantlist = angular.copy($scope.featuredShoplistAccessories);
                $scope.slide_stores = angular.copy($scope.featuredShoplistAccessories);
                define_slider($scope.featuredShoplistAccessories, category);
            }
            else if (category == 'beauty') {
                $scope.selected_merchantlist = angular.copy($scope.featuredShoplistBeauty);
                $scope.slide_stores = angular.copy($scope.featuredShoplistBeauty);
                define_slider($scope.featuredShoplistBeauty, category);
            }  // men end
            else if (category == 'kid') {
                $scope.selected_merchantlist = angular.copy($scope.featuredShoplistKids);
                $scope.slide_stores = angular.copy($scope.featuredShoplistKids);
                define_slider($scope.featuredShoplistKids, category);
            }
            else if (category == 'home') {
                $scope.selected_merchantlist = angular.copy($scope.featuredShoplistHome);
                $scope.pathing = 'Home';
                $scope.SmartPathing = 'Home';
                $scope.slide_stores = angular.copy($scope.featuredShoplistHome);
                define_slider($scope.featuredShoplistHome, category);
            }
            else if (category == 'gift') {
                $scope.selected_merchantlist = angular.copy($scope.featuredShoplistGifts);
                $scope.slide_stores = angular.copy($scope.featuredShoplistGifts);
                define_slider($scope.featuredShoplistGifts, category);
            }
            else if (category == 'others' || category.trim() == '') {
                $scope.selected_merchantlist = angular.copy($scope.featuredShoplistOthers);
                $scope.slide_stores = angular.copy($scope.featuredShoplistOthers);
                define_slider($scope.featuredShoplistOthers, category);
            }
            else if (category == 'dashboard') {
                $scope.selected_merchantlist = angular.copy($scope.featuredShoplistDashboard);
                $scope.slide_stores = angular.copy($scope.featuredShoplistDashboard);
                $scope.pathing = 'Home';
                $scope.SmartPathing = 'Home';
                define_slider($scope.featuredShoplistDashboard, category);
            }
            else {
                $scope.selected_merchantlist = angular.copy($scope.featuredShoplistOthers);
                $scope.slide_stores = angular.copy($scope.featuredShoplistOthers);
                define_slider($scope.featuredShoplistOthers, category);
            }
            //redirected to home page
            if (path != '/') {


                $location.path('/');
                $route.reload();
            }
        }
    }
    // getting current sliders
    $scope.shopcatset = false;
    // set a single store
    function shopset(category, merchant) {
        var deferred = $q.defer();
        $scope.select_merchant = "";
        $scope.justClickedMenu = false;
        $scope.selected = "";
        $scope.ms.checkAllShop = false;
        angular.element('main-search').scope().vm.checkAllShop = false;
        $scope.pro = {};
        $scope.prosearch = {};
        $scope.selected_merchantlistByclick = [];
        $scope.pro[merchant] = true;
        $scope.prosearch[merchant] = true;
        $scope.selected_merchantlistByclick.push(merchant);
        $scope.viewall = 0;
        $scope.showup = 0;
        $scope.load_click = 0;
        deferred.resolve("success");
        return deferred.promise;
    }

    // visit specific shop from sub menu of top
    $scope.menuShopApi = function (category, merchant) {

        if (!angular.isDefined(merchant)) {
            console.log("not defined");
            return;
        }
        if (merchant.trim() == "") {
            console.log("I am menuShopApi");
            return;
        }



        $scope.products = [];
        //$scope.totalRecordsFound =0;
        var path = $location.path();
        $cookies.put('lastshop', merchant);
        $scope.shopcatset = true;
        $scope.justClickedMenu = false;
        $scope.slidimageclick = false;
        $scope.globalSearch = false;
        $scope.selected = "";
        $scope.selected_key = "";
        $scope.new_keyword_arr = [];
        $scope.vm.showsearch = false;
        $scope.currentpage = 1;
        angular.element('main-search').scope().vm.checkAllShop = true;
        angular.element('main-search').scope().vm.checkAllCat = false;
        angular.element('main-search').scope().vm.checkAllDegnr = true;
        $scope.new_keyword_arr = [];
        $scope.pro = {};
        $scope.prosearch = {};
        $scope.selected_merchantlistByclick = [];
        $scope.selected_merchantlist = [];
        $scope.brdg = {};
        $scope.brdglocal = {};
        $scope.selected_brandlist = [];
        $scope.catg = {};
        $scope.catlocal = {};
        $scope.selected_categorylist = [];
        $scope.select_category = "";
        var namecategory;
        // if this category exist in parent category
        var index = -1;
        $scope.queryobj = {};

        //$scope.loadfull= true;


        if (category.trim() != "" ) {

            if ($scope.mapped_cat.hasOwnProperty(category)) {

                $scope.catlocal[category] = true;
                $scope.selected_categorylist.push(category);
                $scope.queryobj.categoryList = angular.copy($scope.selected_categorylist);
                // for inserting inside global category we need same category
                for (var catindex = 0; catindex < $scope.parentcustomCategoryList.length; catindex++) {
                    if ($scope.parentcustomCategoryList[catindex].category == category) {
                        index = catindex;
                        angular.element('main-search').scope().vm.checkAllCat = false;
                        $scope.catg[category] = true;
                        break;
                    }
                }
            }  else if (category != 'dashboard') {

                $scope.queryobj.menuCategory = category;
            }


        }
        $scope.selectCategorySearchboxFromInside = false;
        $scope.selectMerchantSearchboxFromInside = false;
        $scope.selectBrandSearchboxFromInside = false;
        $scope.color_arr = [];
        $scope.select_color = "";
        $scope.temcol = {};
        $scope.$broadcast('colorNull');
        $scope.$broadcast('saleboxNull');
        $scope.percent = {
            range: [0.00, 100.00]
        };
        $scope.saleOffer = false;
        $scope.ocassion_casual = false;
        $scope.ocassion_vacation = false;
        $scope.ocassion_work = false;
        $scope.ocassion_other = false;
        $scope.oc_casual = false;
        $scope.oc_work = false;
        $scope.oc_vacation = false;
        $scope.oc_other = false;
        $scope.menuClicked = category; // under which menu he click
        $scope.usermenu = category; // under which menu he belongs
        $scope.filterCatMerchantBrandList = true;
        $scope.filterBrandListEnable = false;
        $scope.filterMerchantListEnable = false;
        $scope.timegap = 0;
        $scope.timeGapRequest = 0;
        $scope.stopclickInterval();


        $location.path('/storechosen/' + merchant);
        $route.reload();
    }

    // visit specific shop from sub menu of top
    $(document).on('click', '.white_btn', function () {
        var merchant = $(this).attr('merchant');
        $scope.menuShopApi('', merchant);
    })
    // there
    function define_slider(merchantlistArr, category) {

        var pat = $location.path();
        if (pat == '/' || pat == '/dashboard' || $scope.justClickedMenu) {

            var temp_mapped_catArr;
            var temp_map_catidArr;
            $scope.bigCurrentPage = 1;
            $scope.queryobj = {merchantList: merchantlistArr};




            if (category == 'others' && $scope.otherMenu.trim() != '') {
                $scope.queryobj.menuCategory = $scope.otherMenu;
                $scope.loadfull = false;
                searchdatabase();
            }
            else if ($scope.mapped_cat.hasOwnProperty(category)) {


                temp_mapped_catArr = $scope.mapped_cat[category]; //
                temp_map_catidArr =  $scope.mapped_cat_id[category];


                if (temp_map_catidArr.length > 0) {
                    $scope.loadfull = false;

                    //$scope.queryobj.categoryList = temp_mapped_catArr;
                    $scope.queryobj.categoryListId = temp_map_catidArr;

                    searchdatabase();
                } else {
                    $scope.loadfull = false;

                    $scope.queryobj.menuCategory = category;
                    searchdatabase();
                }
            } else {
                if (category == 'others') {
                    console.log('others');
                }
                else if (category != 'dashboard') {
                    $scope.loadfull = false;
                    $scope.queryobj.menuCategory = category;
                }
                searchdatabase();
            }
            var merchants = {stores: merchantlistArr};
            $scope.stopclickInterval();
            $http.post('/get_storelistSlider', merchants).then(function (stores) {
                $scope.sliderlist = stores.data;
                $scope.loadfull = true;

            }, function (response) {
                $scope.loadfull = true;
            });
        } else {
            $scope.loaddone = true;
            $scope.loadfull = true;
        }


    }

    // ------------Login check scope ----------------------
    $scope.pathTorch = [];
    $cookies.put('path', $scope.pathTorch);
    $scope.initializeUser = initializeUser;
    $scope.shipping_address = {}; // required in checkout page
    $scope.billing_address = {};// required in checkout page
    // this is authorized user
    var temppath;


    function initializeUser(data) {
        $scope.purchase_button = "";
        $scope.success = 1;
        $scope.loggedin = 1;
        $rootScope.userinfo = $scope.userinfo = data;
        var path = $location.path();
        if ($scope.loggedin == 1 && path == '/') {
            $location.path('/dashboard');
            $route.reload();
        }

        $cookies.put('useridentity', $scope.userinfo._id);
        $scope.cook_signed = $scope.userinfo._id;
        if ($scope.userinfo.gender == 1) {
            $scope.gendercls = "greyHeart";
        }
        else {
            $scope.gendercls = "redHeart";
        }
        $scope.shipping_address.email = angular.copy($scope.userinfo.email);
        $scope.shipping_address.firstname = angular.copy($scope.userinfo.firstname);
        $scope.shipping_address.lastname = angular.copy($scope.userinfo.lastname);
        $scope.shipping_address.address = angular.copy($scope.userinfo.address);
        $scope.shipping_address.address1 = angular.copy($scope.userinfo.address1);
        $scope.shipping_address.address2 = angular.copy($scope.userinfo.address2);
        $scope.shipping_address.city = angular.copy($scope.userinfo.city);
        $scope.shipping_address.state = angular.copy($scope.userinfo.state);
        $scope.shipping_address.country = angular.copy($scope.userinfo.country);
        $scope.shipping_address.zip = angular.copy($scope.userinfo.zip);
        $scope.shipping_address.phone = angular.copy($scope.userinfo.phone);
        $scope.billing_address.firstname = angular.copy($scope.userinfo.firstname);
        $scope.billing_address.lastname = angular.copy($scope.userinfo.lastname);
        $scope.billing_address.address = angular.copy($scope.userinfo.address);
        $scope.billing_address.address1 = angular.copy($scope.userinfo.address1);
        $scope.billing_address.address2 = angular.copy($scope.userinfo.address2);
        $scope.billing_address.city = angular.copy($scope.userinfo.city);
        $scope.billing_address.state = angular.copy($scope.userinfo.state);
        $scope.billing_address.country = angular.copy($scope.userinfo.country);
        $scope.billing_address.zip = angular.copy($scope.userinfo.zip);
        $scope.billing_address.phone = angular.copy($scope.userinfo.phone);
        if (angular.isDefined(data.wishList)) {
            $scope.saveprofile2 = data.wishList;
            $scope.saved_item_number = calculateItems($scope.saveprofile2);
            $scope.cartDistinctDreamStore = getcartUniqueRetailer($scope.saveprofile2);
            $scope.total_cart_distinct_wishstore = $scope.cartDistinctDreamStore.length;
            $scope.num_stores_wish = $scope.saved_item_number;
        }
        else {
            $scope.saveprofile2 = [];
            $scope.saved_item_number = 0;
            $scope.cartDistinctDreamStore = [];
            $scope.total_cart_distinct_wishstore = 0;

            $scope.num_stores_wish = 0;
        }
        $scope.userstoptenDashboard = data.userDashboardMerchant;
        $scope.userstoptenMen = data.usermenMerchant;
        $scope.userstoptenWomen = data.userWomenMerchant;
        $scope.userstoptenShoes = data.userShoesMerchant;
        $scope.userstoptenAccessories = data.userAccessoriesMerchant;
        $scope.userstoptenBeauty = data.userBeautyMerchant;
        $scope.userstoptenKids = data.userKidsMerchant;
        $scope.userstoptenHome = data.userHomeMerchant;
        $scope.userstoptenGifts = data.userGiftsMerchant;
        $scope.userstoptenLocal = data.userLocalMerchant;
        $scope.subscribe_stores_coupon = data.subscribe_stores_coupon;
        $scope.subscribe_stores_event = data.subscribe_stores_event;
        $scope.varmenu = $scope.userstoptenDashboard;
        $scope.customizeMenuItemName = "dashboard";
        $scope.pathing = "dashboard";
        $scope.SmartPathing = "dashboard";
        $scope.viewall = 0;
        $scope.showup = 0;
        $scope.load_click = 0;
        $scope.bigCurrentPage = 1;
        $scope.slide_stores = [];
        if (angular.isDefined(data.purchaseObj)) {
            $scope.purchaseObj = data.purchaseObj;
        }
        if (angular.isDefined(data.orderObj)) {
            $scope.orderObj = data.orderObj;
        }
        if (angular.isDefined(data.mailbox)) {
            $scope.mailObj = data.mailbox;
        }
        $scope.usermenu = "dashboard";
        $scope.menuClicked = "dashboard"; // search within that zone
        if (angular.isDefined($scope.userstoptenDashboard)) {
            if ($scope.userstoptenDashboard.length > 0) {
                $scope.selected_merchantlist = angular.copy($scope.userstoptenDashboard);
                $scope.slide_stores = angular.copy($scope.userstoptenDashboard);
                define_slider($scope.userstoptenDashboard, 'dashboard');
            }
            else {
                $scope.selected_merchantlist = angular.copy($scope.featuredShoplistDashboard);
                console.log($scope.featuredShoplistDashboard);
                $scope.slide_stores = angular.copy($scope.featuredShoplistDashboard);
                define_slider($scope.featuredShoplistDashboard, 'dashboard');
            }
        }
        else {
            $scope.selected_merchantlist = angular.copy($scope.featuredShoplistDashboard);
            $scope.slide_stores = angular.copy($scope.featuredShoplistDashboard);
            define_slider($scope.featuredShoplistDashboard, 'dashboard');
        }
        if ($scope.userinfo.gender == 1) {
            $scope.genderclass = " subnav-li-men";
        }
        var merge_required = false;
        var tempCartlength;
        var datacartlength;

        $scope.getRightSideBar();
        var merge_required = false; // whether merge required or not
        if (angular.isDefined(data.cart)) // data.cart come from signed user cart
            datacartlength = data.cart.length; //user data cart length
        else
            datacartlength = 0;

        /*
         $http.get('/getUserInfoAfterPurchase')  //logged in user retrieve cart from database user
         .success(function (data) {
         console.log(data);

         }).error(function (err) {
         console.log(" user cart show error: " + err);
         });
         */

        if (angular.isDefined($scope.userprofile2))
            tempCartlength = Object.keys($scope.userprofile2).length;
        else
            tempCartlength = 0;


        if (datacartlength > 0 && tempCartlength > 0) {
            $scope.shoppingbag_cart_changed = true;
            $cookies.put('shoppingbag_cart_changed', true);
            var cnt = 0;
            merge_required = true;
            var dataSet = $scope.userprofile2;
            var item;
            var cartItemUnsigned;
            var data_proid;  // take element by id
            var pushing;
            var ItemQuantity;
            for (var i = 0; i < datacartlength; i++) {
                pushing = true;
                item = data.cart[i]; // hold a data from tem cart
                data_proid = item.product[0].catalogId;  // take element by id
                IQuantity = item.quantity;
                for (var j = 0; j < tempCartlength; j++)   // run loop and try to find whether it is there
                {
                    cartItemUnsigned = $scope.userprofile2[j].product[0].catalogId;
                    if (data_proid == cartItemUnsigned) // if it is there update quantity
                    {
                        $scope.userprofile2[j].quantity = parseInt($scope.userprofile2[j].quantity) + parseInt(IQuantity);
                        pushing = false;
                        break;
                    }
                    if (( j + 1 == tempCartlength) && (pushing))            // if not there push the item
                    {
                        $scope.userprofile2.push(item); // this value get from product list
                    }
                }
            }
            // after scope cart has been update call node to update database
            $http.post('/customers/update/cart',
                {updatedCart: $scope.userprofile2})
                .success(function (data, status, headers, config) {
                    $scope.cartDistinctStore = getcartUniqueRetailer($scope.userprofile2);
                    $scope.total_cart_distinct_store = $scope.cartDistinctStore.length;
                    var temp_cal = calculateItems($scope.userprofile2);
                    $scope.cart_items_number = temp_cal;
                    $scope.num_items = temp_cal;
                    $scope.cartTotal();
                })
                .error(function (data, status, headers, config) {
                    console.log(data);
                });


        }
        else if (tempCartlength > 0) {
            // as user move from unsigned user to signed user user cart need to be updated
            // but if as mini cart remain same no need to check for updated
            $http.post('/customers/update/cart',
                {updatedCart: $scope.userprofile2})
                .success(function (data, status, headers, config) {
                    console.log("No need to redefine cart old cart is okay");


                })
                .error(function (data, status, headers, config) {
                    console.log(data);
                });


        }
        else if (angular.isDefined(data.cart) && datacartlength > 0) {
            $scope.shoppingbag_cart_changed = true;
            $cookies.put('shoppingbag_cart_changed', true);
            $scope.userprofile2 = data.cart;       // new cart taking control update not required
            $scope.cartDistinctStore = getcartUniqueRetailer($scope.userprofile2);
            $scope.total_cart_distinct_store = $scope.cartDistinctStore.length;
            var temp_cal = calculateItems($scope.userprofile2);
            $scope.cart_items_number = temp_cal;
            $scope.num_items = temp_cal;
            $scope.cartTotal(); // calculate cart total from logic
        }
        else {
            $scope.userprofile2 = [];
            $scope.cartDistinctStore = [];
            $scope.total_cart_distinct_store = 0;
            $scope.cart_items_number = 0;
            $scope.num_items = 0;
            var total = 0;
            $scope.saving_total = 0;
            $scope.saving_total_perItem = 0;
            $scope.saving_total = 0;
            $scope.shipping_cost = 0;
            $scope.taxes = 0;
            $scope.fullTotal = 0;


        }
        if ((path.indexOf('shoppingbag') > -1 || path.indexOf('scheckout') > -1) && $scope.firsttime.loading == 0) {

            if (angular.isDefined($scope.userprofile2)) {
                if ($scope.userprofile2.length > 0)
                    $scope.initTwotapCheckoutCart();
            }
            if (angular.isDefined($scope.saveprofile2)) {
                if ($scope.saveprofile2.length > 0)
                    $scope.initTwotapwishOut();
            }


        }
        if (angular.isDefined($scope.cook_unsigned)) {
            $http.post('/unsigned_user_delete', {'unsignedId': $scope.cook_unsigned})
                .success(function (data) {
                    console.log("successful");
                })
            $cookies.remove('unsignedUseridentity');
            console.log($cookies.get('unsignedUseridentity'));
            $scope.cook_unsigned = undefined;
        }
        /*if($scope.firsttime.loading != 0) {

         $scope.loaddone= false;
         } */

        ///////////////
        $scope.getmyLikeditem();

        $scope.getmyRevieweditem();

        $scope.getmyMaileditem();

        if (angular.isDefined($scope.saveprofile2)) {

            if ($scope.saveprofile2.length > 0) {
                for (var st = 0; st < $scope.saveprofile2.length; st++) {

                    if ($scope.saveprofile2[st].product[0].price_sale != -1 && $scope.saveprofile2[st].product[0].price_sale != null) {

                        $scope.saleproducts.push($scope.saveprofile2[st].product[0]);
                        console.log($scope.saveprofile2[st].product[0]);

                    }

                    if (st + 1 == $scope.saveprofile2.length) {


                        $scope.salenotification = angular.copy($scope.saleproducts.length);

                        console.log($scope.salenotification);
                    }

                }


            }


        }

        $http.post('/countunReadFlag')
            .success(function (data) {

                $scope.undread_mails = data.count;

            })


    }

    $scope.mypost = 0;
    $scope.saleproducts = [];

    // close down after sign in
    // sign in using cookies
    $scope.set_from_cookies = false;
    // this function for  unsigned user cart
    function use_cookie_login() {
        var free_me;
        $scope.userprofile2 = free_me;
        $scope.saveprofile2 = free_me;
        $scope.varmenu = [];
        var path = $location.path();


        if (angular.isDefined($cookies.get('unsignedUseridentity')))  // setting the details from user
        {
            $scope.subscribe_stores_coupon = [];
            $scope.subscribe_stores_event = [];
            $scope.customizeMenuItemName = "dashboard";
            $scope.userinfo = free_me;
            $scope.success = 0;
            $scope.loggedin = 0;
            $http.get('/unsigned_user_cart/' + $cookies.get('unsignedUseridentity'))
                .success(function (data) {
                    if (angular.isDefined(data.cart) && data.cart.length > 0) {
                        $scope.userprofile2 = data.cart;
                        console.log($scope.userprofile2);
                        var temp_cal = calculateItems($scope.userprofile2);
                        $scope.cart_items_number = temp_cal;
                        $scope.num_items = temp_cal;
                        $scope.cartDistinctStore = getcartUniqueRetailer($scope.userprofile2);
                        $scope.total_cart_distinct_store = $scope.cartDistinctStore.length;
                        if ((path.indexOf('shoppingbag') > -1) && $scope.firsttime.loading == 0) {
                            if (angular.isDefined($scope.userprofile2)) {
                                if ($scope.userprofile2.length > 0)
                                    $scope.initTwotapCheckoutCart();
                            }

                            if (angular.isDefined($scope.saveprofile2)) {

                                if ($scope.saveprofile2.length > 0)
                                    $scope.initTwotapwishOut();

                            }

                        }


                    }


                    else {
                        $scope.userprofile2 = [];

                        $scope.cart_items_number = 0;
                        $scope.num_items = 0;
                        $scope.cartDistinctStore = [];
                        $scope.total_cart_distinct_store = 0;


                    }
                    if (angular.isDefined(data.wishList) && data.wishList.length > 0) {
                        $scope.saveprofile2 = data.wishList
                        $scope.saved_item_number = calculateItems($scope.saveprofile2);
                        ;
                        $scope.cartDistinctDreamStore = getcartUniqueRetailer($scope.saveprofile2);
                        $scope.total_cart_distinct_wishstore = $scope.cartDistinctDreamStore.length;
                        $scope.num_stores_wish = $scope.saved_item_number;


                    }
                    else {
                        $scope.saveprofile2 = [];
                        $scope.cartDistinctDreamStore = [];
                        $scope.total_cart_distinct_wishstore = 0;
                        $scope.saved_item_number = 0;
                        $scope.num_stores_wish = 0;

                    }
                    if (path == '/scheckout') {
                        $location.path('/');
                        $route.reload();

                    }

                }).error(function (err) {
                $scope.userprofile2 = [];
                $scope.saveprofile2 = [];
                $scope.cart_items_number = 0;
                $scope.saved_item_number = 0;
                $scope.num_stores_wish = 0;
                $scope.total_cart_distinct_wishstore = 0;
                $scope.total_cart_distinct_store = 0;
                $scope.cartDistinctStore = [];
                $scope.num_items = 0;
                $scope.saving_total = 0;
                $scope.shipping_cost = 0;
                $scope.merchandiseTotal = 0;
                $scope.taxes = 0;
                $scope.fullTotal = 0;
                if (path == '/scheckout') {
                    $location.path('/');
                    $route.reload();

                }


            });
        }
        else {

            $scope.userprofile2 = [];
            $scope.saveprofile2 = [];
            $scope.total_cart_distinct_wishstore = 0;
            $scope.total_cart_distinct_store = 0;
            $scope.cartDistinctStore = [];


            var free_me;
            $scope.subscribe_stores_coupon = [];
            $scope.subscribe_stores_event = [];
            $scope.customizeMenuItemName = "dashboard";
            $scope.userinfo = free_me;
            $scope.success = 0;
            $scope.loggedin = 0;
            $scope.cart_items_number = 0;
            $scope.saved_item_number = 0;
            $scope.num_items = 0;
            $scope.saving_total = 0;
            $scope.shipping_cost = 0;
            $scope.merchandiseTotal = 0;
            $scope.taxes = 0;
            $scope.fullTotal = 0;
            $scope.num_stores_wish = 0;

        }
        if (path == '/dashboard' || path == '/')
            $scope.menuCategorySearch('dashboard');
        //  temppath = {'poth':'#!/','label':'HOME'};
        //$scope.pathTorch.push(temppath);
        // $cookies.put('path',$scope.pathTorch);
    }

    // close sign in box
    $scope.closeSignBox = function () {
        $scope.after_login_location = '/dashboard';
    }
    // register using facebook details
    $scope.myFacebookLogin = function () {
        FB.login(function () {
        }, {scope: 'publish_actions'});
    }
    // give purchas complete notification
    function purchase_update() {
        var deferred = $q.defer();
        if (angular.isDefined($cookies.get('useridentity'))) {
            initializeUser(Authentication.user);
            deferred.resolve("success");
        }
        else {
            deferred.reject(err);
            $scope.common_popup_header = "Cart Update Failed";
            $scope.common_popup_message = "initialize error  " + err;
            $('#commonPopup').modal('show');
        }
        return deferred.promise;
    }

    // commission junction coupon getting code
    /*Searching data within home page only*/
    // generate suggestion from database
    ////////////////////////////////// OLDER END ////////////////////////////////////////
    $scope.startsWith = function (state, viewValue) {
        return state.substr(0, viewValue.length).toLowerCase() == viewValue.toLowerCase();
    }
    // function generate suggestion end
    /*---------getting blog data ----------------*/
    function getBlogInfo() {
        $http.get('/wp').success(function (blogSlider) {
            $scope.bloginfo = blogSlider;
            console.log(blogSlider);

        }).error(function (err) {
            console.log("Blog Error: " + err);
        });
    }

    //---------------------Building SEARCH BAR  Component-----------------//
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // generate merchants  for database
    // get merchantlist from csv oriented file
    var merchant_index = 0;
    // creating store list from cache / api only twotap supported not filtered all is there
    $scope.generateAllMerchants = function () {
        var merchantList = $http({
            method: 'POST',
            url: '/get_supported_merchants'
        });
        merchantList.success(function (data) {
            $scope.totalMerchants = data.merchants.length;
            $scope.retailerList = data.merchants;
            $scope.fullMerchantListCount = angular.copy($scope.totalMerchants);
            $scope.initialRetailerList = angular.copy(data.merchants);
            $scope.storelist = angular.copy(data.merchants);

            $scope.makeusableMerchant = {};
            var tempsiteid;
            for (var n = 0; n < $scope.storelist.length; n++) {
                tempsiteid = $scope.storelist[n].id;
                $scope.makeusableMerchant[tempsiteid] = angular.copy($scope.storelist[n]);

            }
        })
    }
    $scope.brand_string = "";
    $scope.urlBrandWiseProductCountArr = [];
    $scope.brandListAlphabet ={};
    $scope.brandListAlphabetInit ={};
    $scope.brandGroupShow ={};
    //  creating brand list from  database
    $scope.generateAllBrands = function () {
        $scope.calledGenerateAllBrands = true;
        var concat_str;
        var brand_q = {offset: brand_offset, start: $scope.brand_start};
        $scope.already_showed_all_brand = true;

        var filter="";
        //  getbrandlistfact.getbrandlist(filter,-1).then(function (data) {
        $scope.brandGroupShow.A = true;
        $scope.brandGroupShow.B = true;
        $scope.brandGroupShow.OTHER = true;

        $scope.brandGroupShow.C = false;
        $scope.brandGroupShow.D = false;
        $scope.brandGroupShow.E = false;
        $scope.brandGroupShow.F = false;
        $scope.brandGroupShow.G = false;
        $scope.brandGroupShow.H = false;
        $scope.brandGroupShow.I = false;
        $scope.brandGroupShow.J = false;
        $scope.brandGroupShow.K = false;
        $scope.brandGroupShow.L = false;
        $scope.brandGroupShow.M = false;
        $scope.brandGroupShow.N = false;
        $scope.brandGroupShow.O = false;
        $scope.brandGroupShow.P = false;
        $scope.brandGroupShow.Q = false;
        $scope.brandGroupShow.R = false;
        $scope.brandGroupShow.S = false;
        $scope.brandGroupShow.T = false;
        $scope.brandGroupShow.U = false;
        $scope.brandGroupShow.V = false;
        $scope.brandGroupShow.W = false;
        $scope.brandGroupShow.X = false;
        $scope.brandGroupShow.Y = false;
        $scope.brandGroupShow.Z = false;

        $scope.totalBrands = 1000;


        $http.post('/get_cmn_brands', brand_q).success(function (data) {


            $scope.initialBrandList = angular.copy(data.brands);
            $scope.brandList = data.brands;
            /*
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
             */
            //   $scope.totalBrands = angular.copy($scope.brandList.length);
            $scope.fullBrandListCount = angular.copy($scope.initialBrandList.length);



            $scope.brandListAlphabetInit.A = angular.copy(data.a);
            $scope.brandListAlphabetInit.B = angular.copy(data.b);
            $scope.brandListAlphabetInit.C = angular.copy(data.c);
            $scope.brandListAlphabetInit.D = angular.copy(data.d);
            $scope.brandListAlphabetInit.E = angular.copy(data.e);
            $scope.brandListAlphabetInit.F = angular.copy(data.f);
            $scope.brandListAlphabetInit.G = angular.copy(data.g);
            $scope.brandListAlphabetInit.H = angular.copy(data.h);
            $scope.brandListAlphabetInit.I = angular.copy(data.i);
            $scope.brandListAlphabetInit.J = angular.copy(data.j);
            $scope.brandListAlphabetInit.K = angular.copy(data.k);
            $scope.brandListAlphabetInit.L = angular.copy(data.l);
            $scope.brandListAlphabetInit.M = angular.copy(data.m);
            $scope.brandListAlphabetInit.N = angular.copy(data.n);
            $scope.brandListAlphabetInit.O = angular.copy(data.o);
            $scope.brandListAlphabetInit.P = angular.copy(data.p);
            $scope.brandListAlphabetInit.Q = angular.copy(data.q);
            $scope.brandListAlphabetInit.R = angular.copy(data.r);
            $scope.brandListAlphabetInit.S = angular.copy(data.s);
            $scope.brandListAlphabetInit.T = angular.copy(data.t);
            $scope.brandListAlphabetInit.U = angular.copy(data.u);
            $scope.brandListAlphabetInit.V = angular.copy(data.v);
            $scope.brandListAlphabetInit.W = angular.copy(data.w);
            $scope.brandListAlphabetInit.X = angular.copy(data.x);
            $scope.brandListAlphabetInit.Y = angular.copy(data.y);
            $scope.brandListAlphabetInit.Z = angular.copy(data.z);
            $scope.brandListAlphabetInit.OTHER = angular.copy(data.other);



            //            $scope.brand_start = $scope.brand_start + 1;
        });



    }
    // search brand from keyword
    $scope.recall_brand = function (brandsearch) {
        if (brandsearch != "") {
            var brand_q = {searching: brandsearch};
            $http.post('/get_brand_search', brand_q).success(function (data) {
                $scope.brandList = data.brands;

            }).error(function (err) {
                $scope.common_popup_header = "brand generate error";
                $scope.common_popup_message = "brand generate error: " + err;
                $('#commonPopup').modal('show');
            });
        }
        else {
            $scope.generateAllBrands();
        }
    }
    // generate mother categories from old style outdated
    $scope.generateAllCategories = function () {
        var cList = $http({
            method: 'POST',
            url: '/get_level_one_category'
        });
        cList.success(function (data) {
            $scope.totalCategories = data.count;
            $scope.categoryList = data.category;
            // console.log($scope.brandList);
        })
    }
    // find subcategory of category
    $scope.find_subcategory = function (category) {
        $http.post('/get_category_child', category)
            .success(function (data) {
                if (category.level == 1) {
                    category.categoryList2 = data.category;
                    category.noOfsubcat = data.count;
                }
                if (category.level > 1) {
                    $scope.get_category_details(category.parent);  // getting parent details
                }
            }).error(function (dataE, status, headers, config) {
            console.log(dataE);
        }); //update end
    }
    // get category using id
    // inside this level 2 and more product is returned
    // Getting ALL CUSTOM Category in side bar //////////
    /////////////////////// INitiall call  CATEGORY ///////
    // mapped category is a json data which hold name of custom category
    // and also define mapped category
    // mapped category information
    var final_cid;
    /*Its get all custom category from database */
    $scope.all_category = [];
    // function for getting all custom category
  /*
    $scope.get_all_custom_category = function () {
        $scope.customCategoryList = [];
        $scope.parentcustomCategoryList = [];
        $http.post('/get_all_custom_category')  //call to retrieve data
            .success(function (data) {

                $scope.all_category = angular.copy(data); // full category
                var x;
                var parent_count1 = 0;
                var parent_level2_count = 0;
                var parent_level3_count = 0;
                var parent_level4_count = 0;
                var parent_level5_count = 0;
                var data_level1 = [];
                var data_level2 = [];
                var data_level3 = [];
                var data_level4 = [];
                var data_level5 = [];
                $scope.TotalCategoriesSubCategories = data.length;


                final_cid = 0;
                // data has been splitted level wise
                var y = 0;
                var yz = 0;
                var yza = 0;
                var yzb = 0;
                var parent;
                var data_temp;
                var caty;
                // first make level wise array of category
                for (x = 0; x < data.length; x++) {
                    data_temp = data[x];
                    data[x].categoryList = [];
                    if (data[x].level == 1) {
                        data_level1[parent_count1] = data[x];  // this is array of first level
                        $scope.customCategoryList.push(data[x]);
                        parent_count1 = parent_count1 + 1;
                    }
                    else if (data[x].level == 2) {
                        data_level2[parent_level2_count] = data[x];
                        parent_level2_count = parent_level2_count + 1;
                    }
                    else if (data[x].level == 3) {
                        data_level3[parent_level3_count] = data[x];
                        parent_level3_count = parent_level3_count + 1;
                    }
                    else if (data[x].level == 4) {
                        data_level4[parent_level4_count] = data[x];
                        parent_level4_count = parent_level4_count + 1;
                    }
                    else if (data[x].level == 5) {
                        data_level5[parent_level5_count] = data[x];
                        parent_level5_count = parent_level5_count + 1;
                    }
                    if (data_temp.prosperent_categories.length > 0) {
                        caty = data_temp.category;
                        $scope.mapped_cat[caty] = data_temp.prosperent_categories;
                        $scope.mapped_cat_id[caty] = data_temp.prosperent_categories_id;
                    }
                    if (data.length == x + 1) {
                       // $scope.parentcustomCategoryList = angular.copy($scope.customCategoryList); // define
                        $scope.totalCategories = parent_count1;
                        if (parent_level2_count > 0) {  // that means there are some category which is for level 2
                            for (y = 0; y < data_level2.length; y++) {
                                parent = data_level2[y].parent;
                                relate_parent_child(parent, data_level1, data_level2[y]);
                                if (y + 1 == data_level2.length) {
                                    if (parent_level3_count > 0) {
                                        for (yz = 0; yz < data_level3.length; yz++) {
                                            parent = data_level3[yz].parent;
                                            // parent cid , array of parent , data object
                                            relate_parent_child(parent, data_level2, data_level3[yz]);
                                            if (yz + 1 == data_level3.length) {
                                                if (parent_level4_count > 0) {
                                                    for (yza = 0; yza < data_level4.length; yza++) {
                                                        parent = data_level4[yza].parent;
                                                        // parent cid , array of parent , data object
                                                        relate_parent_child(parent, data_level3, data_level4[yza]);
                                                        if (yza + 1 == data_level4.length) {
                                                            if (parent_level5_count > 0) {
                                                                for (yzb = 0; yzb < data_level5.length; yzb++) {
                                                                    parent = data_level5[yzb].parent;
                                                                    // parent cid , array of parent , data object
                                                                    relate_parent_child(parent, data_level4, data_level5[yzb]);
                                                                }
                                                            }
                                                        }
                                                    } //
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                var new_cid = data.length - 1;

                final_cid = data[new_cid].cid;
            }).error(function (err) {
            console.log(" sorry category can not be get " + err);
        });
    }

*/

    // Category Parent child relation ship function
    function relate_parent_child(parent, arr, obj) {
        var l = 0;



        for (l = 0; l < arr.length; l++) {

            //console.log(arr);
           if (arr[l]['categoryId'] == parent) {
                arr[l]['categoryList'].push(obj);
                //     $scope.customCategoryList[l].categoryList.push(obj);
            }
        }
    }
    // create category tree of twotap
    $scope.get_twotap_category = function () {
        $scope.customCategoryList = [];
        $scope.parentcustomCategoryList = [];
        $http.post('/get_category_twotap')  //call to retrieve data
            .success(function (datareturn) {
               var data = datareturn.allcat;


               $scope.parentcustomCategoryList = datareturn.parentcat;

                $scope.all_category = angular.copy(data); // full category
                var x,y;
                var parent_count1 = 0;
                var parent_level2_count = 0;
                var parent_level3_count = 0;
                var parent_level4_count = 0;
                var parent_level5_count = 0;
                var data_level1 = [];
                var data_level2 = [];
                var data_level3 = [];
                var data_level4 = [];
                var data_level5 = [];
                $scope.TotalCategoriesSubCategories = data.length;
                for(yindex=0;yindex<datareturn.parentcat.length;yindex++) {
                     data_level1[parent_count1] = datareturn.parentcat[yindex];

                    data_level1[parent_count1].categoryList = [];
                    $scope.customCategoryList.push(datareturn.parentcat[yindex]);



                     parent_count1 = parent_count1 + 1;



                }

                final_cid = 0;
                // data has been splitted level wise
                var y = 0;
                var yz = 0;
                var yza = 0;
                var yzb = 0;
                var parent;
                var data_temp;
                var caty;
                // first make level wise array of category
                for (x = 0; x < data.length; x++) {
                    data_temp = data[x];
                    data[x].level=2; // forcefully change the level

                    data[x].categoryList = [];


                    if (data[x].level == 1) {

                        console.log(data[x]);

                    }
                    else if (data[x].level == 2) {
                        data_level2[parent_level2_count] = data[x];
                        parent_level2_count = parent_level2_count + 1;
                    }
                    else if (data[x].level == 3) {
                        data_level3[parent_level3_count] = data[x];
                        parent_level3_count = parent_level3_count + 1;
                    }
                    else if (data[x].level == 4) {
                        data_level4[parent_level4_count] = data[x];
                        parent_level4_count = parent_level4_count + 1;
                    }
                    else if (data[x].level == 5) {
                        data_level5[parent_level5_count] = data[x];
                        parent_level5_count = parent_level5_count + 1;
                    }
                    if (data_temp.prosperent_categories.length > 0) {
                        caty = data_temp.category;
                        $scope.mapped_cat[caty] = data_temp.prosperent_categories;
                        $scope.mapped_cat_id[caty] = data_temp.prosperent_categories_id;
                    }
                    if (data.length == x + 1) {

                        $scope.totalCategories = parent_count1;
                        if (parent_level2_count > 0) {  // that means there are some category which is for level 2
                            for (y = 0; y < data_level2.length; y++) {
                                parent = 1;
                                relate_parent_child(1, data_level1, data_level2[y]);
                               /* if (y + 1 == data_level2.length) {
                                    if (parent_level3_count > 0) {
                                        for (yz = 0; yz < data_level3.length; yz++) {
                                            parent = data_level3[yz].parent;
                                            // parent cid , array of parent , data object
                                            relate_parent_child(parent, data_level2, data_level3[yz]);
                                            if (yz + 1 == data_level3.length) {
                                                if (parent_level4_count > 0) {
                                                    for (yza = 0; yza < data_level4.length; yza++) {
                                                        parent = data_level4[yza].parent;
                                                        // parent cid , array of parent , data object
                                                        relate_parent_child(parent, data_level3, data_level4[yza]);
                                                        if (yza + 1 == data_level4.length) {
                                                            if (parent_level5_count > 0) {
                                                                for (yzb = 0; yzb < data_level5.length; yzb++) {
                                                                    parent = data_level5[yzb].parent;
                                                                    // parent cid , array of parent , data object
                                                                    relate_parent_child(parent, data_level4, data_level5[yzb]);
                                                                }
                                                            }
                                                        }
                                                    } //
                                                }
                                            }
                                        }
                                    }
                                } */
                            }// for loop end for y data level 2
                        }
                    }
                }

                var new_cid = data.length - 1;

                final_cid = data[new_cid].cid;
            }).error(function (err) {
            console.log(" sorry category can not be get " + err);
        });
    }



    // onlcick search
    $scope.searchbytag = function (key, $event) {
        $scope.proLoading = true;
        $scope.selected = key;
        $scope.selected_key = "";
        $scope.selectMerchantSearchboxFromInside = false;
        $scope.selectBrandSearchboxFromInside = false;
        $scope.selectCategorySearchboxFromInside = false;
        $scope.shopcatset = false;
        $scope.searching_product($event, true);
    }
    //------------------------- CREATING Featured or top 10 MENU ----------------------------------------
    //// MENU MENU MENU MENU MENU MENU MENU MENU MENU
    $scope.generateFeaturedMenu = function () {
        var deferred = $q.defer();
        var TopTen = $http({
            method: 'GET',
            url: '/get_top_stores'
        });
        TopTen.success(function (UserShoplist) {
            $scope.featuredShoplistMen = UserShoplist.usermenMerchant;
            $scope.featuredShoplistWomen = UserShoplist.userWomenMerchant;
            $scope.featuredShoplistShoes = UserShoplist.userShoesMerchant;
            $scope.featuredShoplistAccessories = UserShoplist.userAccessoriesMerchant;
            $scope.featuredShoplistBeauty = UserShoplist.userBeautyMerchant;
            $scope.featuredShoplistKids = UserShoplist.userKidsMerchant;
            $scope.featuredShoplistHome = UserShoplist.userHomeMerchant;
            $scope.featuredShoplistGifts = UserShoplist.userGiftsMerchant;
            $scope.featuredShoplistOthers = UserShoplist.userLocalMerchant;
            $scope.featuredShoplistDashboard = UserShoplist.userDashboardMerchant;
            deferred.resolve(UserShoplist);
        }).error(function (err) {
            window.alert("Top stores generate error" + err);
            deferred.reject(err);
        });
        return deferred.promise;
    }
    // not using this  reuired from customise top ten
    $scope.genusertopstore = function () {
        generateTopTenStore();
    }
    //generate specific user top 10 store No more using
    function generateTopTenStore() {
        var deferred = $q.defer();
        var link;
        link = '/user_stores';
        var TopTen = $http({
            method: 'GET',
            url: link
        });
        TopTen.success(function (UserShoplist) {
            $scope.userstoptenDashboard = UserShoplist.userDashboardMerchant;
            $scope.userstoptenMen = UserShoplist.usermenMerchant;
            $scope.userstoptenWomen = UserShoplist.userWomenMerchant;
            $scope.userstoptenShoes = UserShoplist.userShoesMerchant;
            $scope.userstoptenAccessories = UserShoplist.userAccessoriesMerchant;
            $scope.userstoptenBeauty = UserShoplist.userBeautyMerchant;
            $scope.userstoptenKids = UserShoplist.userKidsMerchant;
            $scope.userstoptenHome = UserShoplist.userHomeMerchant;
            $scope.userstoptenGifts = UserShoplist.userGiftsMerchant;
            $scope.userstoptenLocal = UserShoplist.userLocalMerchant;
            //i have to do 2 things
            //
            if (angular.isDefined($cookies.get('useridentity'))) {
                if (UserShoplist.userDashboardMerchant.length > 0) {
                    $scope.menuCategorySearch('dashboard');
                }
            }
            deferred.resolve(UserShoplist);
        }).error(function (err) {
            console.log("generateTopTenStore Top stores generate error" + err);
            deferred.reject(err);
        });
        return deferred.promise;
    }

    /*Calculate who are the top ten over all stores*/
    $scope.set_columns = function (userstoptenWomen, userstoptenMen,
                                   userstoptenShoes, userstoptenAccessories, userstoptenBeauty, userstoptenKids, userstoptenHome,
                                   userstoptenGift, userstoptenLocal) {
        console.log("nothing delete me");
    }
    // VVIMP first get top featured shop  then
    $scope.generateFeaturedMenu().then(function (response) {
        console.log(Authentication.user);
        if (Authentication.user) {
            initializeUser(Authentication.user);
        }
        else {
            use_cookie_login();
        }
    })
    // eMailService.sendEmail(data).then(function (response) {
    // $scope.anotherFunction();
    // });
    // get cart items
    // get cart items in json format data
    $scope.getCartItemsJson = function () {
        var deferred = $q.defer();
        if (angular.isDefined($cookies.get('useridentity')) && $scope.loggedin == 1) {
            $http.get('/user_cart')  //logged in user retrieve cart from database user
                .success(function (data) {
                    $scope.userprofile2 = data;
                    var temp_cal = calculateItems($scope.userprofile2);
                    $scope.cart_items_number = temp_cal;
                    $scope.cartTotal();
                    deferred.resolve($scope.userprofile2);
                }).error(function (err) {
                console.log(" user cart error: " + err);
                deferred.reject(err);
            });
        }
        else if (angular.isDefined($cookies.get('unsignedUseridentity')))  // check whether this user has cookies
        {
            $http.get('/unsigned_user_cart/' + $cookies.get('unsignedUseridentity'))
                .success(function (data) {
                    $scope.userprofile2 = data.cart;
                    console.log($scope.userprofile2);
                    var temp_cal = calculateItems($scope.userprofile2);
                    $scope.cart_items_number = temp_cal;
                    $scope.num_items = temp_cal;
                    $scope.cartTotal();
                    deferred.resolve("yes");
                }).error(function (err) {
                console.log(" guest cart error " + err);
                deferred.reject(err);
            });
        }
        else {

            deferred.reject(err);

        }

        return deferred.promise;
    } //  crat item json end
    // initial load
    //var firsturl= generateurl(1);
    // all initialization
    $scope.merchantSetfromSearchBoxString = false;
    $scope.categorySetfromSearchBoxString = false;
    $scope.brandSetfromSearchBoxString = false;
    $scope.colorSetfromSearchBoxString = false;
    $scope.saleSetfromSearchBoxString = false;
    $scope.searchforstring = "";
    //// function for global search

    $scope.search_action = function ($item, $model, $label, $event) {
        $scope.selected = $model;
        $scope.searching_product($event, true);

    }
    $scope.brandsearch={brand:""};

    $scope.stringbrandarr =[];
    $scope.stringcatarr =[];
    $scope.genderFromString = false;
    $scope.colorFromString = false;
    $scope.colorFromStringArr = [];
    $scope.categoryFromStringArr = [];
    $scope.categoryFromString = false;
    $scope.brandFromStringArr = []; // brands thats have been selected using searchbox
    $scope.brandFromString = false; // brands select from string false


    // global search function
    // global passed from search box
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
    } // seaching end

    // crossed checked brand with string

    function brand_string_match(keyStringArrRestTop,lowercaseSelectedKeyWord){
        var brnd_replace_str ="";
        var keyStringArrRest=[];
        $scope.brandFromStringArr = []; // brands thats have been selected using searchbox
        $scope.brandFromString = false; // brands select from string false
        var temp;
        for(var ti=0;ti<keyStringArrRestTop.length;ti++){
            temp = keyStringArrRestTop[ti];
            // only insert item that is greater than 1 in size
            if(temp.length>1){

                keyStringArrRest.push(temp);

            }

            if(ti+1 ==keyStringArrRestTop.length ) {

                if(keyStringArrRest.length>0) {
                    for (var brdindex = 0; brdindex < $scope.initialBrandList.length; brdindex++) {

                        var tempBrnadFull = angular.lowercase($scope.initialBrandList[brdindex].brand);
                        var tempBrnadArr = tempBrnadFull.split(" ");

                        for(var cbndIndex=0;cbndIndex<tempBrnadArr.length; cbndIndex++) {
                            tempBrnad = tempBrnadArr[cbndIndex];// brand 1 word
                            for(var indexRest=0;indexRest<keyStringArrRest.length;indexRest++){
                                tempselectedword = keyStringArrRest[indexRest];
                                if(tempBrnad==tempselectedword) {

                                    if(angular.isDefined($scope.queryobj.brandList)) {
                                        if ($scope.queryobj.brandList.indexOf(tempBrnadFull) < 0) {
                                            $scope.queryobj.brandList.push(tempBrnadFull);
                                            $scope.brandFromStringArr.push(tempBrnadFull); // brands thats have been selected using searchbox
                                            $scope.brandFromString = true; // brands select from string false

                                            //$scope.queryobj.brandList.push($scope.initialBrandList[brdindex].brand);
                                            if(brnd_replace_str==""|| tempselectedword.length>brnd_replace_str.length) {

                                                if(lowercaseSelectedKeyWord.indexOf($scope.initialBrandList[brdindex].brand)>-1){

                                                    brnd_replace_str = $scope.initialBrandList[brdindex].brand;

                                                } else
                                                    brnd_replace_str = tempselectedword;
                                            }

                                        }
                                    } else {
                                        $scope.queryobj.brandList =[];
                                        $scope.queryobj.brandList.push($scope.initialBrandList[brdindex].brand);

                                        if(brnd_replace_str==""|| tempselectedword.length>brnd_replace_str.length) {

                                            if(lowercaseSelectedKeyWord.indexOf($scope.initialBrandList[brdindex].brand)>-1){

                                                brnd_replace_str = $scope.initialBrandList[brdindex].brand;

                                            } else
                                                brnd_replace_str = tempselectedword;
                                        }

                                    }
                                }

                            }

                        }


                        if (brdindex + 1 == $scope.initialBrandList.length) {

                            if(brnd_replace_str!="") {
                                lowercaseSelectedKeyWord = lowercaseSelectedKeyWord.replace(brnd_replace_str, '').trim();
                                lowercaseSelectedKeyWord = lowercaseSelectedKeyWord.replace(/  +/g, ' ');
                            }


                            if (lowercaseSelectedKeyWord.trim() == "") {

                                searchdatabase();
                                return;

                            } else {

                                if (lowercaseSelectedKeyWord.length > 1) {

                                    $scope.queryobj.keyword = lowercaseSelectedKeyWord;

                                }

                                searchdatabase();
                            }
                        }
                    }

                } else {

                    searchdatabase();


                }

            }


        }





    } // function end




    function merchantSearch() {
        var matchedRetailerLength = 0;
        var matchedRetailer = "";
        if (angular.isDefined($scope.selectedKeyWord) && $scope.selectedKeyWord.trim() != "") {
            var lowercaseSelectedKeyWord = angular.lowercase($scope.selectedKeyWord);
            var merkeywordArr = lowercaseSelectedKeyWord.split(" "); // main string
            for (var rindex = 0; rindex < $scope.retailerList.length; rindex++) {
                var tempmerchant = $scope.retailerList[rindex].merchant;
                var tempmerchantLower = angular.lowercase(tempmerchant);
                var temMerchantArr = tempmerchant.split(" ");
                if (lowercaseSelectedKeyWord.indexOf(tempmerchantLower) > -1) {
                    var temMerchantInfo = temMerchantArr[0];
                    if (temMerchantArr.length == 1 && merkeywordArr.indexOf(tempmerchantLower) > -1) {
                        if (matchedRetailerLength < tempmerchantLower.length) {
                            matchedRetailer = angular.copy(tempmerchant);    // taking most long as matched retailer
                            matchedRetailerLength = tempmerchantLower.length;
                            $scope.foundMerchantInsideKeyword = true;
                            angular.element('main-search').scope().vm.checkAllShop = false;
                        }
                    }
                    else if (temMerchantArr.length > 1) {
                        if (matchedRetailerLength < tempmerchantLower.length) {
                            matchedRetailer = angular.copy(tempmerchant);    // taking most long as matched retailer
                            matchedRetailerLength = tempmerchantLower.length;
                            $scope.foundMerchantInsideKeyword = true;
                            angular.element('main-search').scope().vm.checkAllShop = false;
                        }
                    }
                }
                if (rindex + 1 == $scope.retailerList.length) {
                    if (matchedRetailer != "") {
                        // previously we set merchant from searching but inside current search all the selected merchants are different from
                        //past
                        /*
                         if($scope.selected_merchantlistByclick.indexOf(matchedRetailer)<0) {
                         angular.element('main-search').scope().vm.checkAllShop =true;
                         $scope.pro ={};
                         $scope.prosearch = {};
                         $scope.selected_merchantlist =[];
                         $scope.selected_merchantlistByclick =[];
                         }
                         */
                        var retReg = new RegExp(matchedRetailer, "ig"); // replace merchant name from keyword
                        var tempStrMer = $scope.selectedKeyWord.replace(retReg, "");
                        $scope.selectedKeyWord = angular.copy(tempStrMer);
                        $scope.selected_merchantlistByclick.push(matchedRetailer);
                        $scope.merchantSetfromSearchBoxString = true;
                    }
                }
            }
        }
    }

    $scope.getsimiliaritemfrommerchant = function(sameMerchantObj){

        searchServiceCount.searchOperationProsperent(sameMerchantObj).then(function (similiarresponse) {
            var t;
            $scope.similiaritems = t;
            if (similiarresponse.product.length > 0) {
                $scope.similiaritems = similiarresponse.product;
            }
        })
    }



    $scope.removeMerchantSearchbox = function (merchantObj) {
        var index = $scope.selected_merchantlistByclick.indexOf(merchantObj);
        $scope.pro[merchantObj] = false;
        $scope.prosearch[merchantObj] = false;
        if (index > -1) {
            $scope.selectMerchantSearchboxFromInside = true;
            $scope.selected_merchantlistByclick.splice(index, 1);
            angular.element('main-search').scope().vm.checkAllShop = false;
        }
    }
    $scope.removeCategorySearchbox = function (categoryObj) {
        var index = $scope.selected_categorylist.indexOf(categoryObj);
        $scope.catg[categoryObj] = false;
        $scope.catlocal[categoryObj] = false;
        if (index > -1) {
            $scope.selectCategorySearchboxFromInside = true;
            $scope.selected_categorylist.splice(index, 1);
            angular.element('main-search').scope().vm.checkAllCat = false;
        }
    }
    $scope.removeBrandSearchbox = function (brandObj) {
        var index = $scope.selected_brandlist.indexOf(brandObj);
        $scope.brdg[brandObj] = false;
        $scope.brdglocal[brandObj] = false;
        if (index > -1) {
            $scope.selectBrandSearchboxFromInside = true;
            $scope.selected_brandlist.splice(index, 1);
            angular.element('main-search').scope().vm.checkAllDegnr = false;
        }
    }
    // all selected brands
    /*$scope.changeBrandSearchbox = function (x, obj, ind) {
     $scope.brandSetfromSearchBoxString=false;
     var index = $scope.selected_brandlist.indexOf(x);
     if (obj) {
     if(index < 0 )
     $scope.selected_brandlist.push(x);
     }
     else {
     if(index > -1)
     $scope.selected_brandlist.splice(index, 1);
     }
     angular.element('main-search').scope().vm.checkAllDegnr=false;
     };*/
    // top brand scroll more

    // all selected category
    /*$scope.changeCategorySearchbox = function (cat_text, boolean_cat_obj) {
     $scope.categorySetfromSearchBoxString =false; //onlcick category changed
     var index = $scope.selected_categorylist.indexOf(cat_text);
     if(boolean_cat_obj)
     {
     if (index < 0)
     $scope.selected_categorylist.push(cat_text);
     }
     else  // false ber kortey hobey
     {
     if (index > -1)
     $scope.selected_categorylist.splice(index, 1);
     }
     angular.element('main-search').scope().vm.checkAllCat=false;
     };*/
    /*old style*/
    //end of searching function
    // menu sub menu part
    $scope.change_smartpathing = function (smart_pathing) {
        $scope.SmartPathing = smart_pathing;
    }

    $scope.menuShopN = function (menu, merchant) {
        $scope.select_merchant = merchant;
        $scope.queryobj.merchant = $scope.select_merchant;
        if ($scope.queryobj.SScategory)      // remove menu category first to see the shop
        {
            delete $scope.queryobj.SScategory;
            $scope.select_dept = "";
        }
        $scope.usermenu = menu;
        $scope.pathing = "home > " + $scope.select_dept + " > " + $scope.select_merchant;
        $scope.SmartPathing = $scope.usermenu + " > " + $scope.select_merchant;
        $scope.viewall = 0;
        $scope.showup = 0;
        $scope.load_click = 0;
        $scope.bigCurrentPage = 1;
        $scope.queryobj.start = $scope.bigCurrentPage - 1;
        var newurl = generateurl(1);
        $scope.productlist = [];
        $scope.SearchVisible = false;
        $location.path('/storechosen/' + merchant);
        $route.reload();
    }
    // clicking on dashboard slide thumnbail user choose store to showproduct
    $scope.setMerchant = function (merchant) {

        $scope.productlist = [];
        $scope.selected_merchantlist = [];
        $scope.selected_merchantlist[0] = merchant;
        $scope.queryobj = {};
        $scope.usermenu = "";
        $scope.pathing = merchant;
        $scope.SmartPathing = merchant;
        $scope.viewall = 0;
        $scope.showup = 0;
        $scope.load_click = 0;
        $scope.bigCurrentPage = 1;
        $scope.queryobj.start = $scope.bigCurrentPage - 1;
        if ($scope.selected_merchantlist.length > 0) {
            $scope.queryobj.merchantList = $scope.selected_merchantlist;
        }
        //var newurl= generateurl(1);
        if ($scope.sortorder > 0)
            $scope.queryobj.sortorder = $scope.sortorder;
        // searchdatabaseTop();
        $scope.SearchVisible = false;
    }
    $scope.customize_shop = function (customizeMenuItemName) {

        if ($scope.loggedin == 0 || $scope.userinfo === undefined) {
            $scope.common_popup_header = "Sign in to customize";
            $scope.common_popup_message = "Sign in please! to make your top ten";
            $('#commonPopup').modal('show');

            return;
        }

        $scope.customizeMenuItemName = customizeMenuItemName; // fixed where it come from
        if ($scope.customizeMenuItemName == "dashboard") {
            $scope.varmenu = $scope.userstoptenDashboard;
            $scope.ss.activeTab = '1';
        }
        else if ($scope.customizeMenuItemName == "women") {
            $scope.varmenu = $scope.userstoptenWomen;
            $scope.ss.activeTab = '2';
        }
        else if ($scope.customizeMenuItemName == "men") {
            $scope.varmenu = $scope.userstoptenMen;
            $scope.ss.activeTab = '3';
        }
        else if ($scope.customizeMenuItemName == "shoe") {
            $scope.varmenu = $scope.userstoptenShoes;
            $scope.ss.activeTab = '4';
        }
        else if ($scope.customizeMenuItemName == "accessories") {
            $scope.varmenu = $scope.userstoptenAccessories;
            $scope.ss.activeTab = '5';
        }
        else if ($scope.customizeMenuItemName == "beauty") {
            $scope.varmenu = $scope.userstoptenBeauty;
            $scope.ss.activeTab = '6';
        }
        else if ($scope.customizeMenuItemName == "kid") {
            $scope.ss.activeTab = '7';
            $scope.varmenu = $scope.userstoptenKids;
        }
        else if ($scope.customizeMenuItemName == "home") {
            $scope.ss.activeTab = '8';
            $scope.varmenu = $scope.userstoptenHome;
        }
        else if ($scope.customizeMenuItemName == "gift") {
            $scope.ss.activeTab = '9';
            $scope.varmenu = $scope.userstoptenGifts;
        }
        else if ($scope.customizeMenuItemName == "others") {
            $scope.ss.activeTab = '10';
            $scope.varmenu = $scope.userstoptenLocal;
        }
        if (!$scope.user || $scope.userinfo === undefined) {
            window.alert("login to have customize shop");
            $("#login-popup").modal("show");
            $scope.after_login_location = '/customizeshop';
        }
        else {
            var path = $location.path();
            if (path != '/customizeshop') {
                return $location.path('/customizeshop');
            }
        }
    }
    // load more home page
    // search result page load more
    //changing department
    //----------------- Searching related function ----------------------------

    //clicking to set price
    /*clicking thumnail to see this */
    $scope.shopSearch = function (merchant, shop_id) {
        $scope.select_merchant = merchant;
        $scope.storeId = shop_id;
        $scope.bigCurrentPage = 1;
        $scope.load_click = 0;
        $scope.viewall = 0;
        $scope.showup = 0; // show up 0 means view only partial
        $scope.scroll_disabled = false; // more to go
        $scope.SearchVisible = false;
        $scope.productlist = [];
        var newurl = generateurl(1);
        searchdatabase();
        function showSingleStore() {
            $http.get('/store_get/' + $scope.storeId)
                .success(function (data) {
                    $scope.store = data;
                })
        }

        showSingleStore();
        return $location.path('/searchResultShop');
    }
    //------------------- page change event-----------------------------
    // sorting top side


    // i do not need to delete product from here
    // change flag from top
    $scope.set_flag = function (flag) {
        $scope.flag = flag;
        //window.alert(flag);
    }
    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
        $scope.currentpage = pageNo;
    };
    $scope.showsignin = function () {
        angular.element('#login-popup').modal("show");
        angular.element('#login').show();
        // $location.hash('login');
        $location.hash('login');
        $anchorScroll('login');
        // $("#login-popup").modal("show");
    }

    // updating user activity function
    function updateActivity(tempcatalogid, user_action) {
        $scope.userActivity =
        {
            activity_product_id: tempcatalogid,
            uaction: user_action
        }
        $http.post('/user_activity_history_update', $scope.userActivity) // update like
            .success(function (dataHistory) {
                window.alert("Updated History");
                return true;
            }).error(function (data, status, headers, config) {
            return false;
        });
    }

    // generate right side bar
    $scope.getRightSideBar = function () {
        $scope.userHistory = {};
        var catArr = [];
        var catId;
        if ($scope.loggedin == 1) {
            $http.get('/user_activity_details')  //call to retrieve data
                .success(function (historyData) {
                    for (var j = 0; j < historyData.length; j++) {
                        catId = historyData[j].catalogId;
                        catArr.push(catId);
                    }

                    var multiID = {'mid': catArr};
                    if (catArr.length > 0) {
                        $http.post('/productUserMulticatalogID', multiID)
                            .success(function (data) {
                                $scope.userHistory = data.product;

                            })
                            .error(function (err) {
                                console.log(" 10 number Error: " + err);
                            });
                    }
                }).error(function (err) {
                console.log("right bar can not be generated: " + err);
            });
        }
    }
    //find index number of product


    //// heart of the project
    var urlencode;
    var merchantUrlencode;
    var brandUrlencode;
    // following function generate url for prosperent
    // Load more functionality for all pages
    $scope.current_limit = 3;
    $scope.maxIndex = $scope.limit;
    $scope.viewPagination = function (direction) {
        if ($scope.current_limit < $scope.numPages && direction == 'next') $scope.current_limit += 3;
        if ($scope.current_limit >= 6 && direction == 'prev') $scope.current_limit -= 3;
    }
    $scope.loadMore = function ($event, pageNo) {

        var group = "";
        var lurl;
        var load_generated_url;
        var gothere = '#targetNo' + pageNo;
        var gotherePrev = '#targetNo' + (pageNo - 1);
        $scope.activePage = pageNo;
        $scope.maxIndex = $scope.activePage * $scope.limit;
        // Going on position which is already loaded
        if ($('#targetNo' + ($scope.activePage)).length && $(gothere).length) {
            //console.log('got there without load')
            $('html, body').animate({scrollTop: $(gothere).offset().top}, 700);
        }
        // After loading one page Next page will start loaded
        $scope.$watch('loaddone', function () {
            if ($scope.activePage > $scope.currentpage && $scope.loaddone) {
                $scope.currentpage += 1;
                $scope.bigCurrentPage += 1;
                $scope.queryobj.start = $scope.bigCurrentPage - 1;
                load_generated_url = $scope.urlforloadmore + "&page=" + $scope.currentpage;
                //$scope.searchApiFilterLoadMore(load_generated_url);
                searchdatabaseLoadMore();
            }
            // Going on position after loading
            $timeout(function () {
                if (pageNo == $scope.currentpage && $scope.loaddone && pageNo > 1) {
                    if ($(gothere).length) {
                        $('html, body').animate({scrollTop: $(gothere).offset().top}, 700);
                    } else {
                        $('html, body').animate({scrollTop: $(gotherePrev).offset().top}, 700);
                    }
                }
            }, 500)
        })
    }
    // Get page number
    $scope.productPageNo = function (indexNo, proLimit) {
        if (indexNo == 0) {
            return Math.ceil((indexNo + 1) / proLimit);
        } else {
            return Math.ceil((indexNo + 1) / proLimit) + 1;
        }
    }
    // Initialize load more
    var loadMoreReset = function () {
        if ($scope.activePage != 1) {
            $scope.matchTarget = 1;
            $scope.activePage = 1;
            //$scope.limit = 200;
            $scope.currentpage = 1;
            $scope.maxIndex = $scope.limit;
            $scope.bigCurrentPage = 1;
        }
    }
    // This one check whether search link changed


    $scope.change_search_key = function () {
        $scope.generatesuggestion();
    }
    $scope.urlencoding = function (str) {
        return rawurlencode(str);
    }
    //// converting to get url
    // For RAJIB
    //
    function rawurlencode(str) {
        str = (str + '')
            .toString()
        // Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
        // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
        return encodeURIComponent(str)
            .replace(/!/g, '%21')
            //    .replace(/'/g, '%27') //'47 face problem'
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
            .replace(/\*/g, '%2A')
            .replace(/%20/g, '+')
    }

    $scope.urldecoding = function (str) {


        return decodeURIComponent(str);

    }



    var sameCategoryObj;
    var keystrokeInterval;
    $scope.stopkeystrokeInterval = function () {
        $interval.cancel(keystrokeInterval);
        $scope.keystrokeGap = 0;
    };


    $scope.generatesuggestion = function (val) {

        if(!$scope.loaddone || ($scope.timeGap>0 && $scope.timeGap<1200)) {
            return;
        }
        return $http.post('/suggestionSS', {keyword: val, start: 0, offset: 5}).then(function (sameProduct) {
            return sameProduct.data;
        })


    }
    function generateurl(pageNo) {
        // var generated_url ="";
        $scope.load_click = 0;   // initially befor
        $scope.viewall = 0;     //
        $scope.showup = 0;      // return  to do not show all

    }

    //// search database
    function searchdatabase() {
      console.log($scope.selected);
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

        console.log($scope.selected_categorylist);

        console.log($scope.selected_brandlist);
       if ($scope.selected_brandlist.length > 0){

            $scope.queryobj.brandList =  angular.copy($scope.selected_brandlist);


        } else {
        if(angular.isDefined($scope.queryobj.brandList)) { // brand list now updated to null so delete it

         delete $scope.queryobj.brandList;

         }
    }



        console.log($scope.queryobj.categoryList);
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



                //console.log($scope.queryobj);
                //return;
        if ($scope.selected_categorylist.length > 0) {
          console.log("if entered");

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
          //console.log("else entered");
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

    function searchdatabaseLoadMore() {
        var concat_str;
        $scope.loaddone = false;
        $http.post('/productResult', $scope.queryobj)  //call to retrieve data
            .success(function (data) {
                var data_count;
                data_count = Object.keys(data.product).length;
                if (data_count > 0) {
                    concat_str = $scope.products;
                    $scope.products = concat_str.concat(data.product);  // concat data with old data
                    if (data_count < $scope.user_offset)  // returned data smaller than data offset
                    {                                    // means there are no more data  available
                        $scope.viewall = 1; //as there is nothing to show that means everything has been shown
                    }
                }
                else {
                    $scope.viewall = 1; //as there is nothing to show that means everything has been shown
                }
                $scope.loaddone = true;
            }).error(function (err) {
            $scope.viewall = 1; //as there is nothing to show that means everything has been shown
            $scope.loaddone = true;
        });
    }
    $scope.already_showed_all_brand = true;
    $scope.showbiggerBrandResult = true;
    $scope.showbiggerMerchantResult = true;
    $scope.already_showed_all_merchant = true;
    $scope.brdloadingdone = true;

    $scope.showallbrandFromSearch = function(){
        $scope.showstatic = false;
        if( $scope.brandList.length < 5){
            $scope.already_showed_all_brand = true;
            $scope.showbiggerBrandResult = true;
            $scope.totalBrands = $scope.brandList.length;
            return;
        }
        $scope.brdloadingdone = false;
        var tobj = angular.copy($scope.queryobj);
        tobj.limit = -1;
        tobj.startindex =-1;
        /*   $scope.brandGroupShow.A = false;
         $scope.brandGroupShow.B = false;
         $scope.brandGroupShow.C = false;
         $scope.brandGroupShow.D = false;
         $scope.brandGroupShow.E = false;
         $scope.brandGroupShow.F = false;
         $scope.brandGroupShow.G = false;
         $scope.brandGroupShow.H = false;
         $scope.brandGroupShow.I = false;
         $scope.brandGroupShow.J = false;
         $scope.brandGroupShow.K = false;
         $scope.brandGroupShow.L = false;
         $scope.brandGroupShow.M = false;
         $scope.brandGroupShow.N = false;
         $scope.brandGroupShow.O = false;
         $scope.brandGroupShow.P = false;
         $scope.brandGroupShow.Q = false;
         $scope.brandGroupShow.R = false;
         $scope.brandGroupShow.S = false;
         $scope.brandGroupShow.T = false;
         $scope.brandGroupShow.U = false;
         $scope.brandGroupShow.V = false;
         $scope.brandGroupShow.W = false;
         $scope.brandGroupShow.X = false;
         $scope.brandGroupShow.Y = false;
         $scope.brandGroupShow.Z = false;
         $scope.brandGroupShow.OTHER = false;
         */
        $scope.already_showed_all_brand = false;
        $scope.showbiggerBrandResult = false;
        $http.post('/productResultGroupBrand', tobj).success(function (data) {

            $scope.brandList = data.brands;
            $scope.totalBrands = $scope.brandList.length;

            $scope.already_showed_all_brand = true;
            $scope.showbiggerBrandResult = true;




            $scope.brandGroupShow.A = true;
            $scope.brandGroupShow.B = true;
            $scope.brandGroupShow.C = true;
            $scope.brandGroupShow.D = true;
            $scope.brandGroupShow.E = true;
            $scope.brandGroupShow.F = true;
            $scope.brandGroupShow.G = true;
            $scope.brandGroupShow.H = true;
            $scope.brandGroupShow.I = true;
            $scope.brandGroupShow.J = true;
            $scope.brandGroupShow.K = true;
            $scope.brandGroupShow.L = true;
            $scope.brandGroupShow.M = true;
            $scope.brandGroupShow.N = true;
            $scope.brandGroupShow.O = true;
            $scope.brandGroupShow.P = true;
            $scope.brandGroupShow.Q = true;
            $scope.brandGroupShow.R = true;
            $scope.brandGroupShow.S = true;
            $scope.brandGroupShow.T = true;
            $scope.brandGroupShow.U = true;
            $scope.brandGroupShow.V = true;
            $scope.brandGroupShow.W = true;
            $scope.brandGroupShow.X = true;
            $scope.brandGroupShow.Y = true;
            $scope.brandGroupShow.Z = true;
            $scope.brandGroupShow.OTHER = true;

            $scope.brdloadingdone = true;

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









        }).error(function (cerr) {
            $scope.already_showed_all_brand = true;
            $scope.showbiggerBrandResult = true;
            $scope.brdloadingdone = true;
            console.log("Brand group error: " + cerr)
        });

    }
    $scope.showallmerchantFromSearch = function(){


        if( $scope.retailerList.length < 6){
            $scope.already_showed_all_merchant = true;
            $scope.showbiggerMerchantResult = true;
            $scope.totalMerchants = $scope.retailerList.length;
            return;
        }


        var mobj = angular.copy($scope.queryobj);

        mobj.mlimit = -1;
        mobj.startmindex =-1;

        $http.post('/productResultGroupMerchant', mobj).success(function (data) {
            $scope.retailerList = data;

            $scope.totalMerchants = $scope.retailerList.length;
            $scope.already_showed_all_merchant = true;
            $scope.showbiggerMerchantResult = true;

        }).error(function (cerr) {
            $scope.already_showed_all_merchant = true;
            $scope.showbiggerMerchantResult = true;
            console.log("Brand group error: " + cerr)
        });

    }
    // searching api Current MAIN ROLE /////////////////////////
    var counter = 0;
    ///////// MAIN SEARCH ////////////////////

    // any product with any property return count along product this is actually do grouping custom
    function uniqueListCount(products, property) {

        var newList = [];
        var temListLength = 0;
        var productLength = products.length
        var tempProduct;
        var found;
        var counter = 0;
        if (productLength > 0) {
            products[0].groupCount = 1;
            tempProduct = products[0];
            newList.push(tempProduct);
            for (var i = 1; i < productLength; i++) {
                found = false;
                tempProduct = products[i];
                temListLength = newList.length;
                console.log("Items products" + temListLength);
                for (var k = 0; k < temListLength; k++) {
                    counter = 0;
                    console.log(newList[k][property]);
                    console.log(tempProduct[property]);
                    if (newList[k][property] == tempProduct[property]) {
                        counter = newList[k].groupCount;
                        newList[k].groupCount = counter + 1;
                        found = true;
                        k = temListLength;
                    }
                    if (!found && k + 1 == temListLength) {
                        tempProduct.groupCount = 1;
                        newList.push(tempProduct);
                    }
                }
                if ((i + 1) >= productLength) {
                    console.log(newList);
                    return newList;
                }
            }
        }
        else
            return newList;
    }

    /// this is also grouping but not return count
    function uniqueList(products, property) {
        var newList = [];
        var temListLength = 0;
        var productLength = products.length
        var tempProduct;
        var found;
        for (var i = 0; i < productLength; i++) {
            found = false;
            tempProduct = products[i];
            temListLength = newList.length;
            for (var k = 0; k < temListLength; k++) {
                if (newList[k][property] == tempProduct[property]) {
                    k = temListLength;
                    found = true;
                    break;
                }
            }
            if (!found) {
                newList.push(tempProduct);
            }
            if (i + 1 == productLength) {
                return newList;
            }
        }
    }

    $scope.loaddone = true;



    //////////////////////////////// OCCASSION WISE COUNT /////////////////////


    // & end of occasion calculate
    // ---------------------- SHOPPING CART ------------------------------------------
    // CART CART CART CART CART CART CART CART
    $scope.est = function (product, required_field_values) {
        console.log(product);
        console.log(required_field_values);

        $scope.cartpopupsimiliaritems = {};
        $scope.estimated_move_price_totals = {};
        var arrUrl = [];
        arrUrl[0] = product.twoTapProductUrl;
        $scope.priceloadedfull = false;
        var pro_url = {product_urls: arrUrl};

        var catOfPro = [];
        catOfPro.push(product.category);
        $scope.twotapmd5 = "";
        $scope.dbmd5 = "";
        $scope.dbmd5 = product.md5;
        var similiarProduct = {categoryList: catOfPro, available: true, start: 0, offset: 30, sortorder: 6};
        console.log("db md5 : ");
        console.log($scope.dbmd5);


        searchServiceCount.searchOperationProsperent(similiarProduct).then(function (similiarresponse) {
            var t;


            if (similiarresponse.product.length > 0) {
                $scope.cartpopupsimiliaritems = similiarresponse.product;
            }


        })

        $('#addToBag').modal('show');

        $http.post('/twotap_cart_single_product', pro_url).then(function (response) {

            for (var si in response.data.productCartDetails.sites) {
                $scope.shipping_countries_support = response.data.productCartDetails.sites[si].shipping_countries_support;
                $scope.billing_countries_support = response.data.productCartDetails.sites[si].billing_countries_support;
                $scope.single_shipping_options = response.data.productCartDetails.sites[si].shipping_options;
                $scope.return_options = response.data.productCartDetails.sites[si].returns;
                for (var pmd5 in response.data.productCartDetails.sites[si].add_to_cart) {
                    $scope.twotapmd5 = pmd5;
                    response.data.productCartDetails.sites[si].add_to_cart[pmd5].quantity = required_field_values.quantity;
                    console.log("2tap md5 : ");
                    console.log($scope.twotapmd5);

                }

            }
            for (var k = 0; k < 10000; k++) {
                if (k == 9000)
                    $scope.estimateSingle(response.data.productCartDetails, product);
            }


        }, function (response) {

            $scope.priceloadedfull = true;
            $http.post('/ProductProsperentUpdate', {available: false, catalogId: product.catalogId}).then(function (response) {
                console.log('unavailable update success');

            }) // update availability
        })

    }

    $scope.estimateSingle = function (data, prosper_product) {
        var site_arraysite_array = [];

        for (var sitekey in data.sites) {
            site_arraysite_array.push(sitekey);              // insert all sites inside an array
        }
        var para_json = {
            "cart_id": data.cart_id,
            "fields_input": {},
        }
        var shoption = "cheapest";
        var cart_by_site;
        var product_key_md5;
        var j;
        var gcard;
        var gpin;
        var price;
        for (var counter = 0; counter < site_arraysite_array.length; counter++) // for one site
        {
            siteskey = site_arraysite_array[counter]; // getting single site
            coupons = [];  // coupon is array for each site there will be one array


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
                    "noauthCheckout": address_user
                    ,
                    "addToCart": {
                        // product_md5 will be dynamic
                    },

                    "shipping_option": shoption
                }
            }
            else {
                para_json.fields_input[siteskey] = {
                    "noauthCheckout": address_user
                    ,
                    "addToCart": {
                        // product_md5 will be dynamic
                    },
                }
            }

            if (data.sites[siteskey].hasOwnProperty('add_to_cart')) {
                cart_by_site = data.sites[siteskey].add_to_cart; // each site have single add to cart
                j = 0;
                for (product_key_md5 in cart_by_site) // each cart have multiple product key md5
                {
                    para_json.fields_input[siteskey]["addToCart"][product_key_md5] = {};

                    para_json.fields_input[siteskey]["addToCart"][product_key_md5]["quantity"] = data.sites[siteskey].add_to_cart[product_key_md5].quantity;

                    if ("size" in data.sites[siteskey].add_to_cart[product_key_md5]["required_field_values"]) {
                        para_json.fields_input[siteskey]["addToCart"][product_key_md5]["size"] = data.sites[siteskey].add_to_cart[product_key_md5].size;
                    }
                    if ("color" in data.sites[siteskey].add_to_cart[product_key_md5]["required_field_values"]) {
                        para_json.fields_input[siteskey]["addToCart"][product_key_md5]["color"] = data.sites[siteskey].add_to_cart[product_key_md5].color;
                    }
                    if ("option" in data.sites[siteskey].add_to_cart[product_key_md5]["required_field_values"]) {
                        para_json.fields_input[siteskey]["addToCart"][product_key_md5]["option"] = data.sites[siteskey].add_to_cart[product_key_md5].option;
                    }
                }
            }
            else {
                $http.post('/ProductProsperentUpdate', {available: false, catalogId: prosper_product.catalogId}).then(function (response) {
                    console.log('update successful');

                })


                $scope.priceloadedfull = true;

                return;
            }


        }

        console.log(para_json);
        $scope.estimated_move_price_totals = {"final_price": "", "subtotal": "", "shipping_price": "", "sales_tax": ""};
        $http.post("https://api.twotap.com/v1.0/cart/estimates?public_token=" + $scope.twotap_public_token, para_json).then(function (response3) {

            console.log(response3.data);
            $scope.estimated_move_price_totals = response3.data.estimated_total_prices;

            $scope.priceloadedfull = true;
        }, function (response) {

            $scope.priceloadedfull = true;
        });
    }


    var ttty;
    var zz = null;
    var retailer_name;
    // add product inside cart
    $scope.addToCart = function (product, ItemQuantity, productDetails, required_field_values, current_price, skey, md5prokey, cart_idx) {
        //$scope.num_moved = ItemQuantity.quantity;

        $scope.shipping_chrg = {};

        console.log(product);


        //$scope.estimateFunctionTop(productDetails,-1,arr); // make it for 1


        var rf = angular.copy(required_field_values);
        delete rf['quantity'];
        $scope.move_item = product;


        $scope.move_text = "bag";
        $scope.move_item.title = product.keyword;
        $scope.move_item.lnk = "#!/SOC/" + product.catalogId + "/" + product.keyword;
        $scope.move_item.image = product.image_url;

        $scope.num_moved = required_field_values.quantity;
        var cartPath = $location.path();

        if (angular.isDefined(required_field_values)) {
            var req_num_items = product.required_field_names.length; // calculate rquired number of item
            var num_defined_items = 0;
            for (var k in required_field_values) {

                if (required_field_values[k] != null && angular.isDefined(required_field_values[k])) {

                    num_defined_items = num_defined_items + 1;
                }
            }

            // calculate no of defined number of item
            // console.log(productDetails.sites[skey].add_to_cart[md5prokey].required_field_names);
            // console.log(required_field_values);
            if (req_num_items > num_defined_items) {
                $scope.common_popup_header = "Cart Item Failed Notification ";
                $scope.common_popup_message = "Please fill up all required fields!";
                $('#commonPopup').modal('show');
                return;
            }

        }
        else  // nothing defined means return
        {
            $scope.common_popup_header = "Cart Item Failed Notification ";
            $scope.common_popup_message = "Please fill up all required fields";
            $('#commonPopup').modal('show');
            return;
        }


        $scope.move_item.input = angular.copy(required_field_values);
        console.log($scope.move_item.input);

        $scope.shoppingbag_cart_changed = true;
        $cookies.put('shoppingbag_cart_changed', true);
        retailer_name = "";
        var site = skey;
        var promd5;
        // var cart_id = productDetails.cart_id;
        var c_price = product.current_price;
        var found = false;
        var undefine_z;
        var priceX = 0;
        var urlOfProduct = $location.host() + ":" + $location.port() + "/#!/SOC/" + product.catalogId + "/" + product.keyword;
        var itemPrice;
        var logourl;
        var key_site;
        //console.log($scope.jantuPakhi);
        var twotap_required = {
            required_fields: {},
            required_field_names: {},
            required_field_values: {}
        }
        var item;
        var i;
        var quant = 0;
        quant = parseInt(ItemQuantity)
        $scope.est(product, required_field_values);

        if ($scope.loggedin == 1) {
            if (angular.isDefined($scope.userprofile2)) {
                if ($scope.userprofile2.length > 0) {
                    for (i = 0; i < $scope.userprofile2.length; i++) {
                        item = $scope.userprofile2[i];
                        // if (angular.equals(angular.lowercase(item.chkout_url), angular.lowercase(productDetails.sites[skey].add_to_cart[md5prokey].original_url))) {
                        if (angular.equals(angular.lowercase(item.chkout_url), angular.lowercase(product.twoTapProductUrl))) {

                            var urf = angular.copy($scope.userprofile2[i].required_field_values);
                            delete urf['quantity'];
                            $scope.userprofile2[i].quantity = parseInt(ItemQuantity) + parseInt(item.quantity);
                            //$scope.userprofile2[i].chkout_url = productDetails.sites[skey].add_to_cart[md5prokey].original_url;
                            $scope.userprofile2[i].required_field_values.quantity = $scope.userprofile2[i].quantity;
                            found = true;
                        }
                    }
                } // profile 2 greater than 0
                else {
                    $scope.userprofile2 = [];
                }
            } else {
                $scope.userprofile2 = [];
            }
            if (!found) {
                itemPrice = 0;
                itemPrice = quant * c_price;
                //key_site = productDetails.sites[skey];
                //logourl = key_site.info.logo;
                retailer_name = product.merchant;
                //twotap_required.required_fields = productDetails.sites[skey].add_to_cart[md5prokey].required_fields;
                //twotap_required.required_field_names = angular.copy(product.required_field_names);
                //twotap_required.required_field_values = angular.copy(product.required_field_values);;
                $scope.userprofile2.push({
                    quantity: quant,
                    url: urlOfProduct,      // tracking product url as well
                    //logo_url: logourl,
                    retailer: retailer_name,
                    catalogId: product.catalogId,
                    productId: product.productId,
                    keyword: product.keyword,
                    prosperent_price: product.price,
                    prosperent_price_sale: product.price_sale,
                    prosperent_percentOff: product.percentOff,
                    required_field_values: required_field_values,
                    product: [product],
                    //chkout_url: $scope.jantuPakhi,
                    chkout_url: product.twoTapProductUrl,
                    twoTapAffiliateLink: product.twoTapAffiliateLink,
                    current_price: c_price,
                    //site_key: skey,
                    productMD5: product.md5,
                    //cartId: cart_id,
                    //coupon_support: productDetails.sites[skey].coupon_support,
                    //gift_support: productDetails.sites[skey].gift_card_support,
                    //checkout_support: productDetails.sites[skey].checkout_support,
                    //shipping_countries_support: productDetails.sites[skey].shipping_countries_support,
                    //billing_countries_support: productDetails.sites[skey].billing_countries_support,
                    // shipping_options: 'cheapest',
                    //twotap_required: twotap_required,
                    affiliated_network: 'prosperent'
                }); // this value get from product list

                $http.post('/customers/update/cart',
                    {updatedCart: $scope.userprofile2, user: $scope.userinfo._id})
                    .success(function (data, status, headers, config) {
                        $scope.cartDistinctStore = getcartUniqueRetailer($scope.userprofile2);
                        $scope.total_cart_distinct_store = $scope.cartDistinctStore.length;
                        var temp_cal = calculateItems($scope.userprofile2);
                        $scope.cart_items_number = temp_cal;
                        if ($scope.ck_all)
                            $scope.num_items = temp_cal;
                        $scope.cartTotal();
                        $('#addToBag').modal('show');

                        if ((cartPath.indexOf('shoppingbag') > -1 || cartPath.indexOf('scheckout') > -1)) {

                            $scope.$broadcast('cartChanged');

                        }

                    })
                    .error(function (data, status, headers, config) {
                        $scope.common_popup_header = "Add to cart Error";
                        $scope.common_popup_message = "Error " + data;
                    });
            }
            else {
                $http.post('/customers/update/cart',
                    {updatedCart: $scope.userprofile2})
                    .success(function (data, status, headers, config) {
                        $scope.cartDistinctStore = getcartUniqueRetailer($scope.userprofile2);
                        $scope.total_cart_distinct_store = $scope.cartDistinctStore.length;
                        var temp_cal = calculateItems($scope.userprofile2);
                        $scope.cart_items_number = temp_cal;
                        if ($scope.ck_all)
                            $scope.num_items = temp_cal;
                        $scope.cartTotal();
                        if ((cartPath.indexOf('shoppingbag') > -1 || cartPath.indexOf('scheckout') > -1)) {

                            $scope.$broadcast('cartChanged');

                        }
                        $('#addToBag').modal('show');
                    })
                    .error(function (data, status, headers, config) {
                        $scope.common_popup_header = "Add to cart Error";
                        $scope.common_popup_message = "Error " + data;
                    });
            }
        }// logged in end
        else if (angular.isDefined($cookies.get('unsignedUseridentity')))  // that means there are some body
        {
            if (angular.isDefined($scope.userprofile2)) {
                if ($scope.userprofile2.length > 0) {
                    for (var i = 0; i < $scope.userprofile2.length; i++) {
                        item = $scope.userprofile2[i];
                        if (angular.equals(angular.lowercase(item.chkout_url), angular.lowercase(product.twoTapProductUrl))) {
                            // if (item.product[0].catalogId == product.catalogId) {
                            var urf = angular.copy($scope.userprofile2[i].required_field_values);
                            delete urf['quantity'];
                            //if (angular.equals(rf, urf)) {
                            console.log("matched");
                            $scope.userprofile2[i].quantity = parseInt(ItemQuantity) + parseInt(item.quantity);
                            $scope.userprofile2[i].required_field_values.quantity = $scope.userprofile2[i].quantity;
                            found = true;
                            //}
                        }
                    }
                }
                else {
                    $scope.userprofile2 = [];
                }
            } else {
                $scope.userprofile2 = [];
            }
            if (!found) {
                // key_site = productDetails.sites[skey];
                //logourl = key_site.info.logo;
                retailer_name = product.merchant;
                // twotap_required.required_fields = productDetails.sites[skey].add_to_cart[md5prokey].required_fields;
                // twotap_required.required_field_names = productDetails.sites[skey].add_to_cart[md5prokey].required_field_names;
                // twotap_required.required_field_values = productDetails.sites[skey].add_to_cart[md5prokey].required_field_values;
                itemPrice = 0;
                itemPrice = parseInt(ItemQuantity) * c_price;
                $scope.userprofile2.push({
                    quantity: quant,
                    url: urlOfProduct,      // tracking product url as well
                    //logo_url: logourl,
                    retailer: retailer_name,
                    catalogId: product.catalogId,
                    productId: product.productId,
                    keyword: product.keyword,
                    prosperent_price: product.price,
                    prosperent_price_sale: product.price_sale,
                    prosperent_percentOff: product.percentOff,
                    required_field_values: required_field_values,
                    product: [product],
                    //chkout_url: $scope.jantuPakhi,
                    chkout_url: product.twoTapProductUrl,
                    twoTapAffiliateLink: product.twoTapAffiliateLink,
                    current_price: c_price,
                    // site_key: skey,
                    productMD5: product.md5,
                    //cartId: cart_id,
                    //coupon_support: productDetails.sites[skey].coupon_support,
                    //gift_support: productDetails.sites[skey].gift_card_support,
                    //checkout_support: productDetails.sites[skey].checkout_support,
                    //shipping_countries_support: productDetails.sites[skey].shipping_countries_support,
                    //billing_countries_support: productDetails.sites[skey].billing_countries_support,
                    //shipping_options:'cheapest',
                    //twotap_required: twotap_required,
                    affiliated_network: 'prosperent'
                }); // this value get from product list
            }
            $http.post('/guest/update/cart',
                {
                    updatedCart: $scope.userprofile2, guestid: $cookies.get('unsignedUseridentity')
                })
                .success(function (data, status, headers, config) {
                    $scope.getCartItemsJson();


                    $scope.cartDistinctStore = getcartUniqueRetailer($scope.userprofile2);
                    $scope.total_cart_distinct_store = $scope.cartDistinctStore.length;
                    var temp_cal = calculateItems($scope.userprofile2);
                    $scope.cart_items_number = temp_cal;
                    if ($scope.ck_all)
                        $scope.num_items = temp_cal;
                    $scope.cartTotal();


                    if ((cartPath.indexOf('shoppingbag') > -1 || cartPath.indexOf('scheckout') > -1)) {

                        $scope.$broadcast('cartChanged');

                    }

                })
                .error(function (data, status, headers, config) {
                    console.log(data);
                    $scope.common_popup_header = "Add to cart Error";
                    $scope.common_popup_message = "Error " + data;
                });
        }
        else {
            // key_site = productDetails.sites[skey];
            // logourl = key_site.info.logo;
            // retailer_name = key_site.info.name;
            //twotap_required.required_fields = productDetails.sites[skey].add_to_cart[md5prokey].required_fields;
            //twotap_required.required_field_names = productDetails.sites[skey].add_to_cart[md5prokey].required_field_names;
            //twotap_required.required_field_values = productDetails.sites[skey].add_to_cart[md5prokey].required_field_values;
            itemPrice = 0;
            itemPrice = parseInt(ItemQuantity) * c_price;
            $scope.userprofile2 = [{
                quantity: quant,
                url: urlOfProduct,      // tracking product url as well
                //logo_url: logourl,
                retailer: product.merchant,
                catalogId: product.catalogId,
                productId: product.productId,
                keyword: product.keyword,
                prosperent_price: product.price,
                prosperent_price_sale: product.price_sale,
                prosperent_percentOff: product.percentOff,
                required_field_values: required_field_values,
                product: [product],
                chkout_url: product.twoTapProductUrl,
                twoTapAffiliateLink: product.twoTapAffiliateLink,
                // chkout_url: $scope.jantuPakhi,
                current_price: c_price,
                //site_key: skey,
                productMD5: product.md5,
                // cartId: cart_id,
                //coupon_support: productDetails.sites[skey].coupon_support,
                //gift_support: productDetails.sites[skey].gift_card_support,
                //checkout_support: productDetails.sites[skey].checkout_support,
                //shipping_countries_support: productDetails.sites[skey].shipping_countries_support,
                //billing_countries_support: productDetails.sites[skey].billing_countries_support,
                // shipping_options: 'cheapest',
                //twotap_required: twotap_required,
                affiliated_network: 'prosperent'
            }]; // this value get from product list
            $http.post('/unsignedUserInfo',
                {updatedCart: $scope.userprofile2})
                .success(function (data, status, headers, config) {
                    $cookies.put('unsignedUseridentity', data._id);
                    $scope.getCartItemsJson();

                    $scope.cartDistinctStore = getcartUniqueRetailer($scope.userprofile2);
                    $scope.total_cart_distinct_store = $scope.cartDistinctStore.length;
                    var temp_cal = calculateItems($scope.userprofile2);
                    $scope.cart_items_number = temp_cal;
                    if ($scope.ck_all)
                        $scope.num_items = temp_cal;

                    $scope.cartTotal();

                    $('#addToBag').modal('show');


                    if ((cartPath.indexOf('shoppingbag') > -1 || cartPath.indexOf('scheckout') > -1)) {

                        $scope.$broadcast('cartChanged');

                    }


                })
                .error(function (data, status, headers, config) {
                    console.log(data);
                    $scope.common_popup_header = "Add to cart Error";
                    $scope.common_popup_message = "Error " + data;
                });
        }


    } // add to cart end

    $scope.addtoWishlistGlobal = function (product, required_field_values) {


        if (angular.isDefined($cookies.get('useridentity'))) {
            var rf = angular.copy(required_field_values);
            delete rf['quantity'];
            $scope.num_moved = required_field_values.quantity;
            $scope.move_item = product;


            $scope.move_text = "saved list";
            $scope.move_item.lnk = "#!/SOC/" + product.catalogId + "/" + product.keyword;
            $scope.move_item.image = product.image_url;
            $scope.wishbag_cart_changed = true;
            $scope.move_item.title = product.keyword;

            var c_price = product.current_price;
            var orgUrl = product.twoTapProductUrl;
            var urlOfProduct = $location.host() + ":" + $location.port() + "/#!/SOC/" + product.catalogId + "/" + product.keyword;
            var found = false;
            var ItemQuantity = required_field_values.quantity;
            var cq = parseInt(ItemQuantity);
            var cartPath = $location.path();
            $scope.move_item.input = angular.copy(required_field_values);
            $scope.est(product, required_field_values);

            // when cart item is there try to find whether product is already there
            // if product item is already there increase counter
            if (angular.isDefined($scope.saveprofile2) && $scope.saveprofile2 != null) {
                if ($scope.saveprofile2.length > 0) {
                    for (var i = 0; i < $scope.saveprofile2.length; i++) {
                        var item = $scope.saveprofile2[i];
                        if (angular.equals(angular.lowercase(item.chkout_url), orgUrl)) {
                            var srf = angular.copy($scope.saveprofile2[i].required_field_values);
                            delete srf['quantity'];
                            $scope.saveprofile2[i].quantity = parseInt(required_field_values.quantity) + parseInt(item.quantity);
                            $scope.saveprofile2[i].required_field_values.quantity = $scope.saveprofile2[i].quantity;
                            found = true;
                            //}
                        }
                    }
                }
            }
            else
                $scope.saveprofile2 = [];
            // when  product is not available add item inside cart
            if (!found) {
                itemPrice = 0;
                itemPrice = required_field_values.quantity * c_price;
                //key_site = productDetails.sites[skey];
                //logourl = key_site.info.logo;
                retailer_name = product.merchant;
                // twotap_required.required_fields = productDetails.sites[skey].add_to_cart[md5prokey].required_fields; // problem is there
                // twotap_required.required_field_names =productDetails.sites[skey].add_to_cart[md5prokey].required_field_names;
                // twotap_required.required_field_values=productDetails.sites[skey].add_to_cart[md5prokey].required_field_values;
                if ($scope.saveprofile2 == null || (!angular.isDefined($scope.saveprofile2))) {
                    $scope.saveprofile2 = [];
                }
                $scope.saveprofile2.push({
                    quantity: cq,
                    url: urlOfProduct,      // tracking product url as well
                    //logo_url: logourl,
                    retailer: retailer_name,
                    catalogId: product.catalogId,
                    productId: product.productId,
                    keyword: product.keyword,
                    prosperent_price: product.price,
                    prosperent_price_sale: product.price_sale,
                    prosperent_percentOff: product.percentOff,
                    required_field_values: required_field_values,
                    product: [product],
                    chkout_url: product.twoTapProductUrl,
                    twoTapAffiliateLink: product.twoTapAffiliateLink,
                    current_price: c_price,
                    //site_key: skey,
                    productMD5: product.md5,
                    //cartId: cart_id,
                    //coupon_support: productDetails.sites[skey].coupon_support,
                    //gift_support: productDetails.sites[skey].gift_card_support,
                    //checkout_support: productDetails.sites[skey].checkout_support,
                    //shipping_countries_support: productDetails.sites[skey].shipping_countries_support,
                    //billing_countries_support: productDetails.sites[skey].billing_countries_support,
                    //shipping_options: productDetails.sites[skey].shipping_options,
                    //twotap_required: twotap_required,
                    affiliated_network: 'prosperent'
                }); // this value get from product list


                if (product.price_sale != -1 && product.price_sale != null) {

                    $scope.saleproducts.push(product);
                    $scope.salenotification = angular.copy($scope.saleproducts.length);

                }


            }
            // update the cart
            $http.post('/customers/update/wishlist',
                {wishList: $scope.saveprofile2})
                .success(function (data, status, headers, config) {
                    $scope.cartDistinctDreamStore = getcartUniqueRetailer($scope.saveprofile2);
                    $scope.total_cart_distinct_wishstore = $scope.cartDistinctDreamStore.length;
                    var temp_cal = calculateItems($scope.saveprofile2);
                    $scope.saved_item_number = temp_cal;
                    $scope.num_stores_wish = $scope.saved_item_number;
                    //$scope.num_items=temp_cal;
                    //$scope.cartTotal();
                    if ((cartPath.indexOf('shoppingbag') > -1 || cartPath.indexOf('scheckout') > -1)) {

                        $scope.$broadcast('wishChanged');

                    }


                })
                .error(function (data, status, headers, config) {
                    console.log(data);
                });
        }
        else {

            // $("#login-popup").modal("show");
            sShoppable.ssLogIn();


        }


    }


    $scope.addToWishlistMod = function (product, ItemQuantity, productDetails, required_field_values, current_price, skey, md5prokey, cart_id, avail) {
        var rf = angular.copy(required_field_values);
        delete rf['quantity'];
        $scope.num_moved = ItemQuantity.quantity;
        $scope.move_item = product;
        $scope.move_text = "saved list";
        $scope.move_item.lnk = "#!/SOC/{{product.catalogId }}/{{ product.keyword | slugify}}";
        $scope.move_item.image = product.image_url;
        $scope.wishbag_cart_changed = true;
        retailer_name = "";
        var site = skey;
        var promd5;
        var c_price = current_price;
        var found = false;
        var undefine_z;
        var priceX = 0;
        var urlOfProduct = $location.host() + ":" + $location.port() + "/#!/SOC/" + product.catalogId + "/" + product.keyword;

        var itemPrice;
        var logourl;
        var key_site;
        //console.log($scope.jantuPakhi);
        var orgUrl;
        if (productDetails.sites[skey].hasOwnProperty('add_to_cart'))
            orgUrl = angular.lowercase(productDetails.sites[skey].add_to_cart[md5prokey].original_url);
        else
            orgUrl = angular.lowercase(productDetails.sites[skey].failed_to_add_to_cart[md5prokey].original_url);
        var twotap_required = {
            required_fields: {},
            required_field_names: {},
            required_field_values: {}
        }
        if (avail) {
            twotap_required.required_fields = productDetails.sites[skey].add_to_cart[md5prokey].required_fields; // problem is there
            twotap_required.required_field_names = productDetails.sites[skey].add_to_cart[md5prokey].required_field_names;
            twotap_required.required_field_values = productDetails.sites[skey].add_to_cart[md5prokey].required_field_values;
            $scope.move_item.title = productDetails.sites[skey].add_to_cart[md5prokey].title;
        }
        else {
            twotap_required.required_fields = productDetails.sites[skey].failed_to_add_to_cart[md5prokey].required_fields; // problem is there
            twotap_required.required_field_names = productDetails.sites[skey].failed_to_add_to_cart[md5prokey].required_field_names;
            twotap_required.required_field_values = productDetails.sites[skey].failed_to_add_to_cart[md5prokey].required_field_values;
            $scope.move_item.title = product.keyword;
        }
        if (angular.isDefined($cookies.get('useridentity'))) {
            // when cart item is there try to find whether product is already there
            // if product item is already there increase counter
            if (angular.isDefined($scope.saveprofile2) && $scope.saveprofile2 != null) {
                if ($scope.saveprofile2.length > 0) {
                    for (var i = 0; i < $scope.saveprofile2.length; i++) {
                        var item = $scope.saveprofile2[i];
                        if (angular.equals(angular.lowercase(item.chkout_url), orgUrl)) {
                            var srf = angular.copy($scope.saveprofile2[i].required_field_values);
                            delete srf['quantity'];
                            //item.quantity = parseInt(ItemQuantity)+parseInt(item.quantity); // if this item already exist increase quantity
                            //if (angular.equals(rf, srf)) { // if except cquantity everything same then add
                            $scope.saveprofile2[i].quantity = parseInt(ItemQuantity) + parseInt(item.quantity);
                            $scope.saveprofile2[i].chkout_url = $scope.jantuPakhi;
                            $scope.saveprofile2[i].required_field_values.quantity = $scope.saveprofile2[i].quantity;
                            found = true;
                            //}
                        }
                    }
                }
            }
            else
                $scope.saveprofile2 = [];
            // when  product is not available add item inside cart
            if (!found) {
                itemPrice = 0;
                itemPrice = ItemQuantity * c_price;
                key_site = productDetails.sites[skey];
                logourl = key_site.info.logo;
                retailer_name = key_site.info.name;
                // twotap_required.required_fields = productDetails.sites[skey].add_to_cart[md5prokey].required_fields; // problem is there
                // twotap_required.required_field_names =productDetails.sites[skey].add_to_cart[md5prokey].required_field_names;
                // twotap_required.required_field_values=productDetails.sites[skey].add_to_cart[md5prokey].required_field_values;
                if ($scope.saveprofile2 == null || (!angular.isDefined($scope.saveprofile2))) {
                    $scope.saveprofile2 = [];
                }
                $scope.saveprofile2.push({
                    quantity: ItemQuantity,
                    url: urlOfProduct,      // tracking product url as well
                    logo_url: logourl,
                    retailer: retailer_name,
                    catalogId: product.catalogId,
                    productId: product.productId,
                    keyword: product.keyword,
                    prosperent_price: product.price,
                    prosperent_price_sale: product.price_sale,
                    prosperent_percentOff: product.percentOff,
                    required_field_values: required_field_values,
                    product: [product],
                    chkout_url: $scope.jantuPakhi,
                    twoTapAffiliateLink: product.twoTapAffiliateLink,
                    current_price: c_price,
                    site_key: skey,
                    productMD5: md5prokey,
                    cartId: cart_id,
                    coupon_support: productDetails.sites[skey].coupon_support,
                    gift_support: productDetails.sites[skey].gift_card_support,
                    checkout_support: productDetails.sites[skey].checkout_support,
                    shipping_countries_support: productDetails.sites[skey].shipping_countries_support,
                    billing_countries_support: productDetails.sites[skey].billing_countries_support,
                    shipping_options: productDetails.sites[skey].shipping_options,
                    twotap_required: twotap_required,
                    affiliated_network: 'prosperent'
                }); // this value get from product list
            }
            // update the cart
            $http.post('/customers/update/wishlist',
                {wishList: $scope.saveprofile2})
                .success(function (data, status, headers, config) {
                    $scope.cartDistinctDreamStore = getcartUniqueRetailer($scope.saveprofile2);
                    $scope.total_cart_distinct_wishstore = $scope.cartDistinctDreamStore.length;
                    var temp_cal = calculateItems($scope.saveprofile2);
                    $scope.saved_item_number = temp_cal;
                    $scope.num_stores_wish = $scope.saved_item_number;

                    $('#addToBag').modal('show');
                    //$scope.num_items=temp_cal;
                    //$scope.cartTotal();
                })
                .error(function (data, status, headers, config) {
                    console.log(data);
                });
        }// logged in end
    }
    // wishlist end
    // save to wishlist from quick view

    //Return all cart items
    $scope.total_cart_distinct_store = 0;
    $scope.num_stores = 0;
    // on click generate min cart items
    $scope.getMiniCartItems = function () {
        if (!angular.isDefined($scope.cartDistinctStore)) {
            $scope.getcartDistinctRetailer();
        }
    }
    //////////////// Getting Distinct retailer //////////////////////////////////////
    ////  It is required to show cart items store wise	/////////////////////////////
    $scope.getcartDistinctRetailer = function () {
        var new_arr = [];
        var jc;
        var validc;
        var tempc;
        var nc;
        if (angular.isDefined($scope.userprofile2)) {
            var count = 0;
            var itemscount = 0;
            var total_cal = 0;
            var retailer_arr = [];
            var retailerindex;
            var tempTotal = 0;
            for (nc = 0; nc < $scope.userprofile2.length; nc++) // nc index jeta compare hoye gechey eleminate that
            {
                retailerindex = -1;
                tempc = $scope.userprofile2[nc].retailer; // one retailer
                tempPrice = $scope.userprofile2[nc].current_price;
                tempQuantity = $scope.userprofile2[nc].quantity;
                tempTotal = 0;
                tempTotal = tempPrice * tempQuantity * 1.0;
                jc = 0;               // counter become 0
                validc = false;       // valid false means new data
                retailerindex = retailer_arr.indexOf(tempc);
                if (retailerindex > -1) {
                    console.log(retailer_arr);
                    new_arr[retailerindex].quantity = new_arr[retailerindex].quantity + tempQuantity;
                    new_arr[retailerindex].store_total_cost = new_arr[retailerindex].store_total_cost + tempTotal;
                }
                else {
                    new_arr.push({
                        "site_key": $scope.userprofile2[nc].site_key,
                        "retailer": tempc,
                        "retailer_logo": $scope.userprofile2[nc].logo_url,
                        "quantity": tempQuantity,
                        "store_total_cost": tempTotal,
                        "coupon_support": $scope.userprofile2[nc].coupon_support,
                        "gift_support": $scope.userprofile2[nc].gift_support,
                        "checkout_support": $scope.userprofile2[nc].checkout_support,
                        "shipping_countries_support": $scope.userprofile2[nc].shipping_countries_support,
                        "billing_countries_support": $scope.userprofile2[nc].billing_countries_support,
                        "shipping_options": $scope.userprofile2[nc].shipping_options
                    });
                    retailer_arr.push(tempc);
                }
                count = count + 1;
                // if(nc==$scope.userprofile2.length-1)
                // deferred.resolve(new_arr);
            }
            $scope.cartDistinctStore = new_arr; // distinct store json data
            $scope.total_cart_distinct_store = new_arr.length;
        }
    } // end distinct retailer
    // for top mini cart unique retailer
    $scope.getcartUniqueRetailerFromChild = function (data) {


        return getcartUniqueRetailer(data);

    }

    function getcartUniqueRetailer(data) {
        var new_arr = [];
        var jc;
        var validc;
        var tempc;
        var nc;
        if (angular.isDefined(data)) {
            var count = 0;
            var itemscount = 0;
            var total_cal = 0;
            var retailer_arr = [];
            var retailerindex;
            var mycount = -1;
            var tempTotal = 0;
            for (nc = 0; nc < data.length; nc++) // nc index jeta compare hoye gechey eleminate that
            {
                retailerindex = -1;
                tempc = data[nc].retailer; // one retailer
                tempPrice = data[nc].current_price;
                tempQuantity = data[nc].quantity;
                jc = 0;               // counter become 0
                validc = false;       // valid false means new data
                retailerindex = retailer_arr.indexOf(tempc);
                tempTotal = 0;
                tempTotal = tempPrice * tempQuantity * 1.0;
                if (retailerindex > -1) {
                    new_arr[retailerindex].quantity = new_arr[retailerindex].quantity + tempQuantity;
                    new_arr[retailerindex].store_total_cost = new_arr[retailerindex].store_total_cost + tempTotal;
                }
                else {
                    mycount = mycount + 1;
                    new_arr.push({
                        "site_key": data[nc].site_key,
                        "retailer": tempc,
                        "retailer_logo": data[nc].logo_url,
                        "quantity": tempQuantity,
                        "store_total_cost": tempTotal,
                        "coupon_support": data[nc].coupon_support,
                        "gift_support": data[nc].gift_support,
                        "checkout_support": data[nc].checkout_support,
                        "shipping_countries_support": data[nc].shipping_countries_support,
                        "billing_countries_support": data[nc].billing_countries_support,
                        "shipping_options": data[nc].shipping_options
                    });
                    retailer_arr.push(tempc);
                }
                count = count + 1;
            }
            // $scope.cartDistinctStore  = new_arr; // distinct store json data
            // $scope.total_cart_distinct_store =new_arr.length;
            return new_arr;
        }
    }

    // function for calculate number of cart items
    $scope.calculateItemsFromChild = function (items) {

        return calculateItems(items);
    }

    function calculateItems(items) {
        var k = 0;
        var caluculateItems = 0;
        for (k = 0; k < items.length; k++) {
            caluculateItems = caluculateItems + items[k].quantity;
        }
        //$scope.cart_items_number  =;
        return caluculateItems;
    }

    // scope for calcualte item from cart
    $scope.calculateItemsForCart = function (items) {
        var k = 0;
        var caluculateItems = 0;
        for (k = 0; k < items.length; k++) {
            caluculateItems = caluculateItems + items[k].quantity;
        }
        $scope.cart_items_number = caluculateItems;
    }
    var indexedTeams = [];
    // return cart and make indexteams as null
    $scope.cartToFilter = function () {
        indexedTeams = [];            // first initialize make it empty
        return $scope.userprofile2;
    }
    // cart grouping previous version

    ///////// reset the cart can be done using service	//////////////
    $scope.resetCart = function () {
        $scope.userprofile2 = [];
        // for loop end
        if ($scope.loggedin == 1) {
            $http.post('/customers/update/cart',
                {updatedCart: $scope.userprofile2})
                .success(function (data, status, headers, config) {
                    $scope.cart_items_number = 0;
                    $scope.num_items = 0;
                    $scope.num_stores = 0;
                    $scope.saving_total = 0;
                    $scope.saving_total_perItem = 0;
                    $scope.shipping_cost = 0;
                    $scope.taxes = 0;
                    $scope.fullTotal = 0;
                    $scope.cartDistinctStore = [];
                    $scope.total_cart_distinct_store = 0;
                    $scope.estimated_move_price_totals = {};
                    $scope.twotap_builtin_cart = undefined;
                    $scope.estimated_price_totals = {"final_price": "$0.0", "subtotal": "$0.0"};
                    $scope.valid_coupons = 0;
                    $scope.invalid_coupons = 0;
                    $scope.valid_coupon_store = 0;
                    $scope.saving = 0;
                    $scope.tap = 0;
                    $scope.step = 1;
                    $scope.failed_item_num = 0;
                    $scope.checkoutpossible = true;

                    $scope.failed_sub_total = 0;


                })
                .error(function (data, status, headers, config) {
                    console.log(data);
                });
        } else {

            $http.post('/guest/update/cart',
                {
                    updatedCart: [], guestid: $cookies.get('unsignedUseridentity')
                })
                .success(function (data, status, headers, config) {
                    $scope.cart_items_number = 0;
                    $scope.num_items = 0;
                    $scope.num_stores = 0;
                    $scope.saving_total = 0;
                    $scope.saving_total_perItem = 0;
                    $scope.shipping_cost = 0;
                    $scope.taxes = 0;
                    $scope.fullTotal = 0;
                    $scope.cartDistinctStore = [];
                    $scope.total_cart_distinct_store = 0;
                    $scope.estimated_move_price_totals = {};
                    $scope.twotap_builtin_cart = undefined;


                    $scope.estimated_price_totals = {"final_price": "$0.0", "subtotal": "$0.0"};
                    $scope.valid_coupons = 0;
                    $scope.invalid_coupons = 0;
                    $scope.valid_coupon_store = 0;
                    $scope.saving = 0;
                    $scope.tap = 0;
                    $scope.step = 1;
                    $scope.failed_item_num = 0;
                    $scope.checkoutpossible = true;

                    $scope.failed_sub_total = 0;


                })
                .error(function (data, status, headers, config) {
                    console.log(data);
                    $scope.common_popup_header = "Reset  Error";
                    $scope.common_popup_message = "Error " + data;
                });

        }


    }
    //for shopping cart changed


    $scope.deleteFromCartProMd5 = function (prokey, sitekey, cart_failed) {
        $scope.shoppingbag_cart_changed = true;
        $cookies.put('shoppingbag_cart_changed', true);

        var ourl;

        if (cart_failed == 1) {
            ourl = angular.copy($scope.twotap_builtin_cart.sites[sitekey].add_to_cart[prokey].original_url);

            delete $scope.twotap_builtin_cart.sites[sitekey].add_to_cart[prokey];

        }
        else {
            ourl = angular.copy($scope.twotap_builtin_cart.sites[sitekey].failed_to_add_to_cart[prokey].original_url);

            delete $scope.twotap_builtin_cart.sites[sitekey].failed_to_add_to_cart[prokey];

        }

        for (var j = 0; j < $scope.considered_items.length; j++) {
            if ($scope.considered_items.url == ourl) {
                $scope.considered_items.splice(j, 1);    // remove the item when done to reduce the array
                break;
            }
        }
        $scope.tGap = 0;
        cInterval = $interval(function () {
            // careful to check purchase status use right purchase id
            if ($scope.tGap > 999) {
                $scope.stopcInterval();

                //$scope.twotapCheckoutCart(1);
                $scope.$broadcast('cartChanged');
                console.log("on going delete");

                //$scope.estimateFunctionTop($scope.twotap_builtin_cart,-1,$scope.considered_items);
            }
            $scope.tGap = $scope.tGap + 1000;
        }, 1000);
    }
    $scope.deleteFromWishProMd5 = function (prokey, sitekey, cart_failed) {
        $scope.sGap = 0;
        $scope.wishbag_cart_changed = true;
        console.log(cart_failed);
        var ourl;


        if (cart_failed == 1) {
            ourl = $scope.twotap_wishlist_cart.sites[sitekey].add_to_cart[prokey].original_url;

            delete $scope.twotap_wishlist_cart.sites[sitekey].add_to_cart[prokey];
        }
        else {
            ourl = $scope.twotap_wishlist_cart.sites[sitekey].failed_to_add_to_cart[prokey].original_url;

            delete $scope.twotap_wishlist_cart.sites[sitekey].failed_to_add_to_cart[prokey];

        }
        for (var j = 0; j < $scope.considered_items_wish.length; j++) {
            if ($scope.considered_items_wish.url == ourl) {
                $scope.considered_items_wish.splice(j, 1);    // remove the item when done to reduce the array
                break;
            }
        }
        sInterval = $interval(function () {
            // careful to check purchase status use right purchase id
            if ($scope.sGap > 999) {
                $scope.stopsInterval();
                $scope.$broadcast('wishChanged');
            }
            $scope.sGap = $scope.sGap + 1000;
        }, 1000);
    }
    // purchase order
    $scope.finalPurchase = function () {
        $scope.$broadcast('finalPurchaseChild');
    }
    // price estimation of the cart
    $scope.estimateFunctionTop = function (data, index, itemlist) {

        var site_arraysite_array = [];
        var coupons = [];
        var gif_card = [];
        for (var sitekey in data.sites) {
            site_arraysite_array.push(sitekey);              // insert all sites inside an array
        }
        var para_json = {
            "cart_id": data.cart_id,
            "fields_input": {},
        }
        var shoption = "cheapest";
        var cart_by_site;
        var product_key_md5;
        var j;
        var gcard;
        var gpin;
        var price;
        for (var counter = 0; counter < site_arraysite_array.length; counter++) // for one site
        {
            siteskey = site_arraysite_array[counter]; // getting single site
            coupons = [];  // coupon is array for each site there will be one array
            gif_card = [];
            if (data.sites[siteskey].coupon1) {
                if (data.sites[siteskey].coupon1 != "") {
                    coupons.push(data.sites[siteskey].coupon1);
                }
            }
            if (data.sites[siteskey].coupon2) {
                if (data.sites[siteskey].coupon2 != "") {
                    coupons.push(data.sites[siteskey].coupon2);
                }
            }
            if (data.sites[siteskey].coupon3) {
                if (data.sites[siteskey].coupon3 != "") {
                    coupons.push(data.sites[siteskey].coupon3);
                }
            }
            if (data.sites[siteskey].coupon4) {
                if (data.sites[siteskey].coupon4 != "") {
                    coupons.push(data.sites[siteskey].coupon4);
                }
            }
            if (data.sites[siteskey].gift_cards_number && data.sites[siteskey].gift_cards_pin) {
                if (data.sites[siteskey].gift_cards_number != "" && data.sites[siteskey].gift_cards_pin != "") {
                    gcard = data.sites[siteskey].gift_cards_number;
                    gpin = data.sites[siteskey].gift_cards_pin;
                    gif_card[0] = {};
                    gif_card[0].number = gcard;
                    gif_card[0].pin = gpin;
                }
            }
            if (angular.isDefined(data.sites[siteskey].shipping_option))
                shoption = data.sites[siteskey].shipping_option;
            else {
                var found_ship = false;
                angular.forEach(data.sites[siteskey].shipping_options, function (shipvalue, shipkey) {

                    data.sites[siteskey].shipping_option = shipkey;

                    shoption = angular.copy(shipkey);

                    if (shipkey == 'cheapest') {
                        found_ship = true;
                    } else if (shipkey == 'default') {
                        found_ship = true;

                    }
                    /*
                     if(!found_ship)
                     {
                     data.sites[siteskey].shipping_option=shipkey;
                     }
                     if(shipkey=='cheapest')
                     {
                     found_ship = true;
                     }
                     else if(shipkey=='default')
                     {
                     found_ship = true;
                     }
                     */

                });
            }


            para_json.fields_input[siteskey] = {

                "addToCart": {
                    // product_md5 will be dynamic
                },
                "failed_to_add_to_cart": {
                    // product_md5 will be dynamic
                },

                "coupons": coupons
            }


            var address_user = {};


            if (angular.isDefined($scope.shipping_address.country) && $scope.shipping_address.country != 'United States of America') {

                para_json.destination_country = 'United States of America';

            }

            else if (angular.isDefined($scope.shipping_address) && $scope.shipping_address != null) {

                if (angular.isDefined($scope.shipping_address.city) && $scope.shipping_address.city != null &&
                    angular.isDefined($scope.shipping_address.state) && $scope.shipping_address.state != null &&
                    angular.isDefined($scope.shipping_address.zip) && $scope.shipping_address.zip != null) {
                    address_user = {
                        "shipping_city": $scope.shipping_address.city,
                        "shipping_state": $scope.shipping_address.state,
                        "shipping_zip": $scope.shipping_address.zip
                    };

                    if (angular.isDefined($scope.shipping_address.country) && $scope.shipping_address.country != null)
                        address_user.shipping_country = $scope.shipping_address.country;

                    if (angular.isDefined($scope.shipping_address.address) && $scope.shipping_address.address != null)
                        address_user.shipping_address = $scope.shipping_address.address;


                    para_json.fields_input[siteskey].noauthCheckout = address_user;
                } else if (angular.isDefined($scope.shipping_address.country) && $scope.shipping_address.country != null) {

                    para_json.destination_country = $scope.shipping_address.country;


                } else {
                    para_json.destination_country = 'United States of America';


                }


            } else {

                para_json.destination_country = 'United States of America';

            }


            if (angular.isDefined(shoption)) {
                para_json.fields_input[siteskey].shipping_option = shoption;
            }


            if (gif_card.length > 0)
                para_json.fields_input[siteskey]["gift_cards"] = gif_card;
            cart_by_site = data.sites[siteskey].add_to_cart; // each site have single add to cart
            j = 0;
            for (product_key_md5 in cart_by_site) // each cart have multiple product key md5
            {
                para_json.fields_input[siteskey]["addToCart"][product_key_md5] = {};
                // if ("quantity" in data.sites[siteskey].add_to_cart[product_key_md5]["required_field_values"])
                // {
                para_json.fields_input[siteskey]["addToCart"][product_key_md5]["quantity"] = data.sites[siteskey].add_to_cart[product_key_md5].quantity;
                // }
                if ("size" in data.sites[siteskey].add_to_cart[product_key_md5]["required_field_values"]) {
                    para_json.fields_input[siteskey]["addToCart"][product_key_md5]["size"] = data.sites[siteskey].add_to_cart[product_key_md5].size;
                }
                if ("color" in data.sites[siteskey].add_to_cart[product_key_md5]["required_field_values"]) {
                    para_json.fields_input[siteskey]["addToCart"][product_key_md5]["color"] = data.sites[siteskey].add_to_cart[product_key_md5].color;
                }
                if ("option" in data.sites[siteskey].add_to_cart[product_key_md5]["required_field_values"]) {
                    para_json.fields_input[siteskey]["addToCart"][product_key_md5]["option"] = data.sites[siteskey].add_to_cart[product_key_md5].option;
                }
            }


        }
        $scope.estimated_move_price_totals = {"final_price": "", "subtotal": "", "shipping_price": "", "sales_tax": ""};
        console.log("top estimate values ");
        console.log(para_json);
        $http.post("https://api.twotap.com/v1.0/cart/estimates?public_token=" + $scope.twotap_public_token, para_json).then(function (response3) {

            //console.log(response3);
            var n;
            var siter_id;
            var shipping_method;
            var pata = $location.path();
            $scope.shipping_chrg = {};

            if (index == -999)  //  estimated price popup appear when move to cart or move to shopping bag
            {
                console.log(" estimated price popup appear when move to cart or move to shopping bag  ");
                $scope.estimated_move_price_totals = response3.data.estimated_total_prices;
            }
            //            else if (index > -1 && pata != '/scheckout') // single store

            else if (index > -1) // single store
            {
                siter_id = $scope.cartDistinctStore[index].site_key;
                $scope.cartDistinctStore[index].estimation = response3.data; // used to update individual estimation
                $scope.cartDistinctStore[index].estimationCalled = true;
                $scope.cartDistinctStore[index].estimates = response3.data.estimates[siter_id];
                //prob remain
                data.sites[siter_id].estimates = response3.data.estimates[siter_id];
                $scope.estimated_price_totals = response3.data.estimated_total_prices;
                $scope.estimated_move_price_totals = angular.copy(response3.data.estimated_total_prices);


                if (angular.isDefined($scope.twotap_builtin_cart)) {
                    $scope.twotap_builtin_cart.estimated_total_prices = response3.data.estimated_total_prices;
                }
                shipping_method = data.sites[siter_id].shipping_option;
                $scope.shipping_chrg[siter_id][shipping_method] = response3.data.estimates[siter_id].prices.shipping_price;


            }
            else {
                var current_sitevalid_coupons;
                $scope.valid_coupons = 0;
                $scope.valid_coupon_store = 0;
                var atleast_one_coupon_store = false; // how many store for coupons

                if (index != -9) // -9 means wishlist not, -1 means all cart
                {

                    var found_ship;
                    for (var p = 0; p < site_arraysite_array.length; p++) {
                        siter_id = site_arraysite_array[p];
                        data.sites[siter_id].estimates = response3.data.estimates[siter_id];
                        $scope.shipping_chrg[siter_id] = {};


                        atleast_one_coupon_store = false;
                        for (var coup in response3.data.coupons[siter_id]) {

                            console.log(response3.data.coupons[siter_id][coup].status);
                            if (response3.data.coupons[siter_id][coup].status == "valid") {
                                $scope.valid_coupons = $scope.valid_coupons + 1;
                                atleast_one_coupon_store = true;
                            }
                            else
                                $scope.checkoutpossible = false;

                        }
                        shipping_method = data.sites[siter_id].shipping_option;
                        if (angular.isDefined(response3.data.estimates[siter_id]))
                            $scope.shipping_chrg[siter_id][shipping_method] = response3.data.estimates[siter_id].prices.shipping_price;
                        else
                            $scope.shipping_chrg[siter_id][shipping_method] = "$0"; //code
                        if (atleast_one_coupon_store) {
                            $scope.valid_coupon_store = $scope.valid_coupon_store + 1;
                        }
                    }
                }
                if (index == -9)  // wishlist
                {

                    console.log(response3.data);
                    $scope.estimated_price_totals_wish = response3.data.estimated_total_prices;
                    $scope.estimated_move_price_totals = angular.copy(response3.data.estimated_total_prices);


                }
                else {
                    $scope.estimated_price_totals = response3.data.estimated_total_prices;
                    $scope.estimated_move_price_totals = angular.copy(response3.data.estimated_total_prices);

                    console.log($scope.estimated_price_totals);
                    if (angular.isDefined($scope.twotap_builtin_cart))
                        $scope.twotap_builtin_cart.estimated_total_prices = response3.data.estimated_total_prices;
                }
            }

            $scope.priceloadedfull = true;
        }, function (response) {

            $scope.priceloadedfull = true;
        });
    }
    $scope.count_items = function (data, index, itemlist) {
        var quantity_store_wise;
        if (index != -9) // -1 means count full cart
        {
            $scope.num_items = 0;
            //   if ($scope.ck_all)  // means check out all
            //  {
            for (var sikey in data.sites) {
                number_of_products = 0;
                $scope.twotap_builtin_cart.sites[sikey].quantity_store_wise = 0;
                for (var p = 0; p < $scope.userprofile2.length; p++) {
                    quantity_store_wise = 0;
                    for (md5pro in data.sites[sikey].add_to_cart) {
                        // // fixed a site
                        // if($scope.userprofile2[p].productMD5==md5pro)
                        if ($scope.userprofile2[p].chkout_url == $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].original_url) {
                            $scope.userprofile2[p].quantity = angular.copy(parseInt($scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].quantity));
                            $scope.userprofile2[p].required_field_values.quantity = $scope.userprofile2[p].quantity;
                            $scope.num_items = $scope.num_items + $scope.userprofile2[p].quantity;
                            $scope.twotap_builtin_cart.sites[sikey].quantity_store_wise = $scope.twotap_builtin_cart.sites[sikey].quantity_store_wise + $scope.userprofile2[p].quantity;
                        }
                    }	// add to cart end
                    for (var md5prox in data.sites[sikey].failed_to_add_to_cart) {
                        // // fixed a site
                        // if($scope.userprofile2[p].productMD5==md5pro)
                        if ($scope.userprofile2[p].chkout_url == $scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].original_url) {
                            $scope.userprofile2[p].quantity = angular.copy(parseInt($scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].quantity));
                            $scope.userprofile2[p].required_field_values.quantity = $scope.userprofile2[p].quantity;
                            $scope.num_items = $scope.num_items + $scope.userprofile2[p].quantity;
                            $scope.twotap_builtin_cart.sites[sikey].quantity_store_wise = $scope.twotap_builtin_cart.sites[sikey].quantity_store_wise + $scope.userprofile2[p].quantity;
                        }
                    }
                }   // user profile end
            }
            //  update_cart_quantity(data, [], $scope.userprofile2, index);
            /*
             for (var siteskey in data.sites) {
             sikey = siteskey;
             number_of_products = 0;
             quantity_store_wise = 0;
             $scope.twotap_builtin_cart.sites[sikey].quantity_store_wise = 0;
             for (var p = 0; p < $scope.userprofile2.length; p++) {
             for (md5pro in data.sites[sikey].add_to_cart) {
             // if($scope.userprofile2[p].productMD5==md5pro)
             if ($scope.userprofile2[p].chkout_url == $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].original_url) {
             $scope.userprofile2[p].quantity = parseInt($scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].quantity);
             $scope.userprofile2[p].required_field_values.quantity = $scope.userprofile2[p].quantity;
             $scope.num_items = $scope.num_items + $scope.userprofile2[p].quantity;
             $scope.twotap_builtin_cart.sites[sikey].quantity_store_wise = $scope.twotap_builtin_cart.sites[sikey].quantity_store_wise + $scope.userprofile2[p].quantity;
             }
             } // for enf
             for (var md5prox in data.sites[sikey].failed_to_add_to_cart) {
             if ($scope.userprofile2[p].chkout_url == $scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].original_url) {
             $scope.userprofile2[p].quantity = parseInt($scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].quantity);
             $scope.userprofile2[p].required_field_values.quantity = $scope.userprofile2[p].quantity;
             $scope.num_items = $scope.num_items + $scope.userprofile2[p].quantity;
             $scope.twotap_builtin_cart.sites[sikey].quantity_store_wise = $scope.twotap_builtin_cart.sites[sikey].quantity_store_wise + $scope.userprofile2[p].quantity;
             }
             }

             }
             }
             */

            //}
        }
        else // count item for wish list
        {
            $scope.num_items_wish = 0;
            for (var n = 0; n < $scope.s_array_wish.length; n++) {
                sikey = $scope.s_array_wish[n]; // target one site
                number_of_products = 0;
                quantity_store_wise = 0;
                $scope.twotap_wishlist_cart.sites[sikey].quantity_store_wise = 0;
                // fixed a site
                for (var p = 0; p < $scope.saveprofile2.length; p++) {
                    for (md5pro in data.sites[sikey].add_to_cart) {
                        // if($scope.userprofile2[p].productMD5==md5pro)
                        if ($scope.saveprofile2[p].chkout_url == $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].original_url) {
                            $scope.saveprofile2[p].quantity = angular.copy(parseInt($scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].required_field_values.quantity));
                            $scope.saveprofile2[p].required_field_values.quantity = $scope.saveprofile2[p].quantity;
                            $scope.num_items_wish = $scope.num_items_wish + $scope.saveprofile2[p].quantity;
                            $scope.twotap_wishlist_cart.sites[sikey].quantity_store_wise = $scope.twotap_wishlist_cart.sites[sikey].quantity_store_wise + $scope.saveprofile2[p].quantity;
                        }
                    }
                    for (var md5prox in data.sites[sikey].failed_to_add_to_cart) {
                        // if($scope.userprofile2[p].productMD5==md5pro)
                        if ($scope.saveprofile2[p].chkout_url == $scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prox].original_url) {
                            $scope.saveprofile2[p].quantity = angular.copy(parseInt($scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prox].required_field_values.quantity));
                            $scope.saveprofile2[p].required_field_values.quantity = $scope.saveprofile2[p].quantity;
                            $scope.num_items_wish = $scope.num_items_wish + $scope.saveprofile2[p].quantity;
                            $scope.twotap_wishlist_cart.sites[sikey].quantity_store_wise = $scope.twotap_wishlist_cart.sites[sikey].quantity_store_wise + $scope.saveprofile2[p].quantity;
                        }
                    }

                }
            }

            //  update_cart_quantity(data, [], $scope.saveprofile2, index);


        }
    } // COUNT ITEM END
    // Delete an item from cart using catalog id

    function update_cart_quantity(datacart, s_array, profile2, index) {

        console.log("I am herex");
        var sikey;
        for (sikey in datacart.sites) {
            number_of_products = 0;
            for (var md5pro in datacart.sites[sikey].add_to_cart) {

                for (var p = 0; p < profile2.length; p++) {


                    // if($scope.userprofile2[p].productMD5==md5pro)
                    if (profile2[p].chkout_url == datacart.sites[sikey].add_to_cart[md5pro].original_url) {
                        if (index == -9) // wishlist
                        {
                            // $scope.$parent.saveprofile2[p].quantity = datacart.sites[sikey].add_to_cart[md5pro].quantity;
                            // $scope.$parent.saveprofile2[p].required_field_values.quantity = datacart.sites[sikey].add_to_cart[md5pro].quantity;
                            console.log($scope.saveprofile2);

                            for (var ix = 0; ix < 5000; ix++) {
                                if (ix == 4999) {
                                    $http.post('/customers/update/wishlist',
                                        {wishList: $scope.saveprofile2})
                                        .success(function (data, status, headers, config) {

                                            console.log(data);

                                            $scope.saved_item_number = calculateItems($scope.saveprofile2);
                                            $scope.cartDistinctDreamStore = getcartUniqueRetailer($scope.saveprofile2);
                                            $scope.total_cart_distinct_wishstore = $scope.cartDistinctDreamStore.length;
                                            $scope.num_stores_wish = $scope.saved_item_number;


                                        })
                                        .error(function (data, status, headers, config) {
                                            console.log(data);
                                        });
                                }

                            }


                        }
                        else //
                        {
                            var old_quanity = angular.copy($scope.$parent.userprofile2[p].quantity);
                            //    $scope.$parent.userprofile2[p].quantity = datacart.sites[sikey].add_to_cart[md5pro].quantity;
                            //   $scope.$parent.userprofile2[p].required_field_values.quantity = datacart.sites[sikey].add_to_cart[md5pro].quantity;


                            if ((datacart.sites[sikey].add_to_cart[md5pro].orig_price) - (parseFloat(datacart.sites[sikey].add_to_cart[md5pro].price.substring(1), 10)) > 0) {
                                // deduct older value add new value

                                //$scope.$parent.saving = $scope.saving-((datacart.sites[sikey].add_to_cart[md5pro].orig_price - parseFloat(datacart.sites[sikey].add_to_cart[md5pro].price.substring(1),10))*(old_quanity));

                                // add new value
                                //$scope.$parent.saving = $scope.saving+((datacart.sites[sikey].add_to_cart[md5pro].orig_price - parseFloat(datacart.sites[sikey].add_to_cart[md5pro].price.substring(1),10))*($scope.userprofile2[p].quantity));

                                console.log($scope.$parent.saving);
                            }

                            console.log($scope.userprofile2);

                            for (var ix = 0; ix < 5000; ix++) {
                                if (ix == 4999) {
                                    $http.post('/customers/update/cart',
                                        {updatedCart: $scope.userprofile2})
                                        .success(function (data, status, headers, config) {


                                            $scope.$parent.shoppingbag_cart_changed = true; //

                                            $cookies.put('shoppingbag_cart_changed', true);

                                            if ((datacart.sites[sikey].add_to_cart[md5pro].orig_price) - (parseFloat(datacart.sites[sikey].add_to_cart[md5pro].price.substring(1), 10)) > 0) {

                                                // add new value
                                                // $scope.$parent.saving = $scope.saving+((datacart.sites[sikey].add_to_cart[md5pro].orig_price - parseFloat(datacart.sites[sikey].add_to_cart[md5pro].price.substring(1),10))*(datacart.sites[sikey].add_to_cart[md5pro].quantity));
                                                console.log($scope.$parent.saving);

                                            }
                                            $scope.cartDistinctStore = getcartUniqueRetailer($scope.userprofile2);
                                            $scope.total_cart_distinct_store = $scope.cartDistinctStore.length;
                                            $scope.cart_items_number = calculateItems($scope.userprofile2);

                                            if ($scope.ck_all)
                                                $scope.num_items = angular.copy($scope.cart_items_number);

                                            $scope.cartTotal();


                                        })
                                        .error(function (data, status, headers, config) {
                                            console.log(data);
                                        });
                                }

                            }

                        }

                    }
                }
            }
        }

    }


    $scope.deleteFromCartCatalog = function (catalogId) {
        $scope.shoppingbag_cart_changed = true;
        $cookies.put('shoppingbag_cart_changed', true);
        var leng = $scope.userprofile2.length;
        var index = -1;
        var item;
        for (var i = 0; i < $scope.userprofile2.length; i++) {
            item = $scope.userprofile2[i];
            if (item.product[0].catalogId == catalogId) {
                $scope.userprofile2.splice(i, 1);

                if ($scope.loggedin == 1) {
                    index = i;
                    $http.post('/customers/update/cart',
                        {updatedCart: $scope.userprofile2})
                        .success(function (data, status, headers, config) {


                            if ($scope.userprofile2.length == 0 || (!angular.isDefined($scope.userprofile2))) {
                                $scope.num_items = 0;
                                $scope.estimated_price_totals = {};
                                $scope.saving = 0;
                                $scope.total_cart_distinct_store = 0;
                                $scope.cart_items_number = 0;

                                $scope.num_stores = 0;

                                $scope.saving_total = 0;


                                $scope.saving_total_perItem = 0;
                                $scope.shipping_cost = 0;
                                $scope.taxes = 0;
                                $scope.fullTotal = 0;
                                $scope.cartDistinctStore = [];
                                $scope.estimated_price_totals = {};

                            } else {

                                $scope.cartDistinctStore = getcartUniqueRetailer($scope.userprofile2);
                                $scope.total_cart_distinct_store = $scope.cartDistinctStore.length;
                                var temp_cal = calculateItems($scope.userprofile2);
                                $scope.cart_items_number = temp_cal;

                                if ($scope.ck_all) {
                                    $scope.num_items = temp_cal;
                                }


                                $scope.cartTotal();


                            }

                        })
                        .error(function (data, status, headers, config) {
                            $scope.getCartItemsJson();
                        });
                    break;


                } else {

                    $http.post('/guest/update/cart', {
                        updatedCart: $scope.userprofile2, guestid: $cookies.get('unsignedUseridentity')
                    })
                        .success(function (data, status, headers, config) {

                            if ($scope.userprofile2.length > 0) {

                                console.log("no need to update")

                                $scope.cartTotal();


                                $scope.getCartItemsJson();
                                $scope.cartDistinctStore = getcartUniqueRetailer($scope.userprofile2);
                                $scope.total_cart_distinct_store = $scope.cartDistinctStore.length;

                            } else {
                                $scope.cart_items_number = 0;
                                $scope.num_items = 0;
                                $scope.num_stores = 0;

                                $scope.saving_total = 0;


                                $scope.saving_total_perItem = 0;
                                $scope.shipping_cost = 0;
                                // $scope.shipping = total*.05;
                                $scope.taxes = 0;
                                $scope.fullTotal = 0;
                                $scope.cartDistinctStore = [];
                                $scope.total_cart_distinct_store = 0;
                            }


                            if ($scope.userprofile2.length == 0 || (!angular.isDefined($scope.userprofile2))) {

                                $scope.estimated_price_totals = {};
                                $scope.saving = 0;

                            }


                        })
                        .error(function (data, status, headers, config) {


                            $scope.common_popup_header = "Delete to cart Error";
                            $scope.common_popup_message = "Error " + data;
                        });


                } // unsigned user


            }
        } // for loop end
    } // delete from cart end
    //delete item from wish list items
    $scope.deleteFromWishCatalog = function (catalogId) {

        if ($scope.loggedin == 1) {
            $scope.wishbag_cart_changed = true;
            var leng = $scope.saveprofile2.length;
            var index = -1;
            for (var i = 0; i < $scope.saveprofile2.length; i++) {
                var item = $scope.saveprofile2[i];
                if (item.product[0].catalogId == catalogId) {
                    $scope.saveprofile2.splice(i, 1);
                    $http.post('/customers/update/wishlist',
                        {
                            wishList: $scope.saveprofile2
                        })
                        .success(function (data, status, headers, config) {
                            //getcartUniqueRetailer();
                            if (angular.isDefined($scope.saveprofile2)) {

                                if ($scope.saveprofile2.length > 0) {
                                    var temp_cal = calculateItems($scope.saveprofile2);
                                    $scope.saved_item_number = calculateItems($scope.saveprofile2);
                                    $scope.cartDistinctDreamStore = getcartUniqueRetailer($scope.saveprofile2);
                                    $scope.total_cart_distinct_wishstore = $scope.cartDistinctDreamStore.length;
                                    $scope.num_stores_wish = $scope.saved_item_number;
                                } else {

                                    $scope.saved_item_number = 0;
                                    $scope.cartDistinctDreamStore = [];
                                    $scope.total_cart_distinct_wishstore = 0;
                                    $scope.num_stores_wish = $scope.saved_item_number;


                                }
                            } else {

                                $scope.saved_item_number = 0;
                                $scope.cartDistinctDreamStore = [];
                                $scope.total_cart_distinct_wishstore = 0;
                                $scope.num_stores_wish = $scope.saved_item_number;

                            }


                        })
                        .error(function (data, status, headers, config) {
                            $scope.common_popup_header = "Wish list Delete Error Notification";
                            $scope.common_popup_message = "Wish list Update Not possible " + data;
                            $('#commonPopup').modal('show');
                            //$scope.getCartItemsJson();
                        });
                    break;
                }
            } // for loop end
        }

    }
    $scope.deleteFromCart = function (productId) {
        var leng = $scope.userprofile2.length;
        for (var i = 0; i < $scope.userprofile2.length; i++) {
            var item = $scope.userprofile2[i];
            if (item.product[0]._id == productId) {
                $scope.userprofile2.splice(i, 1);
                break;
            }
        } // for loop end
        if (leng > 0) {
            $http.post('/customers/update/cart',
                {updatedCart: $scope.userprofile2})
                .success(function (data, status, headers, config) {
                    $scope.userprofile2 = data;
                })
                .error(function (data, status, headers, config) {
                    $scope.common_popup_header = "Wish list Delete Error Notification";
                    $scope.common_popup_message = "Wish list Update Not possible " + data;
                    $('#commonPopup').modal('show');
                });
        }
    }
    ////// remove item from wish list /////
    $scope.deleteFromSaveList = function (productId, catalogId) {
        // for loop end
        var index = $scope.user_saved_item_id.indexOf(productId);
        if (index > -1) {
            $scope.user_saved_item_id.splice(index, 1);
        }
        $http.post('/delete_saved_item', {del_pro_id: $scope.user_saved_item_id})
            .success(function (data2, status, headers, config) {
                $http.get('/user/profile')  //call to retrieve data
                    .success(function (data) {
                        $scope.user_saved_item_id = data.saved_item_id;
                        $scope.saved_item_number = Object.keys(data.saved_item_id).length;

                        $scope.num_stores_wish = $scope.saved_item_number;
                        if ($scope.saved_item_number > 0) {
                            var multiID = {'mid': $scope.user_saved_item_id};
                            $http.post('/productUserMultiID', multiID)
                                .success(function (data) {
                                    $scope.user_saved_item = data;
                                    console.log($scope.user_saved_item);
                                    $scope.$apply();
                                })
                                .error(function (err) {
                                    console.log(" getMiniCartItems Error: " + err);
                                });
                        }
                        else {
                            $scope.user_saved_item = [];
                            console.log($scope.user_saved_item);
                            $scope.$apply();
                        }
                    }).error(function (err) {
                    window.alert(" getMiniCartItems Error: " + err);
                });
            })
            .error(function (data, status, headers, config) {
                console.log(data);
            });
    }

    // calculate cost including shipping
    $scope.cartTotal = function () {
        var total = 0;
        $scope.saving_total = 0;

        for (var i = 0; i < $scope.userprofile2.length; i++) {
            var item = $scope.userprofile2[i];
            var considered_price = 0;
            considered_price = item.current_price;
            $scope.saving_total_perItem = (item.product[0].price - considered_price) * item.quantity;
            $scope.saving_total = $scope.saving_total_perItem + $scope.saving_total;
            total += item.quantity * considered_price;
        }
        $scope.shipping_cost = 0;
        // $scope.shipping = total*.05;
        $scope.taxes = 0;
        $scope.fullTotal = total + parseFloat($scope.shipping_cost, 10) + parseFloat($scope.taxes, 10);
        //return $scope.fullTotal;
    };
    // check whether a variable is defined, return true or false
    ////////////////////////////////////  SUBSCRIBE SECTION ///////////////////////////////////////
    function checkbox_subscribe_window(shop) {
        $scope.both_subscribe = false;
        $scope.events_subscribe = false;
        $scope.promocode_subscribe = false;
        $scope.temp_both = false;
        $scope.temp_events = false;
        $scope.temp_promo = false;
        $scope.both_subscribe_text = '';
        $scope.promocode_subscribe_text = '';
        $scope.events_subscribe_text = '';
        if ($scope.subscribe_stores_event.indexOf(shop) > -1 && $scope.subscribe_stores_coupon.indexOf(shop) > -1) {
            $scope.both_subscribe = true;
            $scope.events_subscribe = true;
            $scope.promocode_subscribe = true;
            $scope.temp_both = true;
            $scope.temp_events = true;
            $scope.temp_promo = true;
            $scope.both_subscribe_text = ' checked';
            $scope.promocode_subscribe_text = ' checked';
            $scope.events_subscribe_text = ' checked';
        }
        else {
            $scope.both_subscribe = false;
            $scope.temp_both = false;
            $scope.both_subscribe_text = '';
            if ($scope.subscribe_stores_coupon.indexOf(shop) > -1) {
                $scope.promocode_subscribe = true;
                $scope.promocode_subscribe_text = ' checked';
                $scope.temp_promo = true;
            }
            else {
                $scope.promocode_subscribe_text = "";
                $scope.temp_promo = false;
                $scope.promocode_subscribe = false;
            }
            if ($scope.subscribe_stores_event.indexOf(shop) > -1) {
                $scope.events_subscribe = true;
                $scope.events_subscribe_text = ' checked';
                $scope.temp_events = true;
            }
            else {
                $scope.events_subscribe_text = '';
                $scope.temp_events = false;
                $scope.events_subscribe = false;
            }
        }
    }

    $scope.ucheckbothsub = function (x) {
        $scope.promocode_subscribe = x;
        $scope.events_subscribe = x;
        $scope.both_subscribe = x;
        if (x) {
            $scope.both_subscribe_text = " checked";
            $scope.promocode_subscribe_text = " checked";
            $scope.events_subscribe_text = " checked";
            $scope.both_subscribe = true;
            $scope.temp_both = true;
        }
        else {
            $scope.both_subscribe_text = "";
            $scope.promocode_subscribe_text = "";
            $scope.events_subscribe_text = "";
            $scope.both_subscribe = false;
            $scope.temp_both = false;
        }
    }
    $scope.both_subscribe_text = "";
    $scope.checkbothsub = function (x, y) {
        if (x == y)
            $scope.both_subscribe = x;
        else
            $scope.both_subscribe = false;
        if ($scope.both_subscribe) {
            $scope.both_subscribe_text = " checked";
        }
        else
            $scope.both_subscribe_text = "";
        if (x)
            $scope.events_subscribe_text = " checked";
        else
            $scope.events_subscribe_text = "";
        if (y)
            $scope.promocode_subscribe_text = " checked";
        else
            $scope.promocode_subscribe_text = "";
    }
    $scope.show_subscribe_window = function (shop, storedetails) {
        $scope.subscribe_store = {};
        $scope.subscribe_store = storedetails;
        $('#storeSubscribed').modal('show');
        checkbox_subscribe_window(shop);
    }

    $scope.show_subscribe_window_frm_store = function (storedetails) {

        if ($scope.loggedin != 1) {


            sShoppable.ssLogIn();
            return;


        }

        $scope.subscribe_store = {};

        $scope.subscribe_store = storedetails;
        $scope.subscribe_store.info = {};
        $scope.subscribe_store.info.logo = angular.copy(storedetails.logo);
        $scope.subscribe_store.info.name = angular.copy(storedetails.name);
        $scope.subscribe_store.shop = angular.copy(storedetails.merchant);
        checkbox_subscribe_window(storedetails['name']);
        $('#storeSubscribed').modal('show');

    }

    $scope.subscribe_all = function (merchant) {
        $scope.common_popup_header = "Full subscription for " + merchant;
        $http.post('/customers/update/subscribe_all', {storename: merchant}).then(function (response) {
            if (response.data.message == "success") {
                $scope.subscribe_stores_coupon = response.data.subscribe_stores_coupon; //update coupon storenlist
                $scope.subscribe_stores_event = response.data.subscribe_stores_event;   //update event storelist
                $scope.common_popup_message = " You have successfully subscribed for the full subscription for " + merchant;
                $scope.common_popup_message = $scope.common_popup_message + "\n *promo codes and coupons \n *notifications for sales and promotional events";
                $scope.common_popup_color_class = "popup";
                $('#commonPopup').modal('show');
                $scope.promocode_subscribe = true;
                $scope.events_subscribe = true;
                $scope.both_subscribe = true;
                $scope.both_subscribe_text = " checked";
                $scope.promocode_subscribe_text = " checked";
                $scope.events_subscribe_text = " checked";
                $scope.temp_both = true;
                $scope.temp_events = true;
                $scope.temp_promo = true;
            }
            else {
                $scope.common_popup_message = " You have failed to subscribed for the full subscription for " + merchant;
                $scope.common_popup_message = $scope.common_popup_message + "\n *promo codes and coupons \n *notifications for sales and promotional events";
                $scope.common_popup_color_class = "red";
                $('#commonPopup').modal('show');
            }
        }, function (response) {
            console.log("unsuccessful");
            $scope.common_popup_message = " You have failed to subscribed for the full subscription for " + merchant;
            console.log("error" + response);
            $scope.common_popup_color_class = "red";
            $('#commonPopup').modal('show');
        })
    }
    function subscribe_promo(merchant) {
        $scope.common_popup_header = "Subscription for promo codes and coupons ";
        $http.post('/customers/update/subscribe_stores_coupon', {storename: merchant}).then(function (response) {
            if (response.data.message == "success") {
                $scope.subscribe_stores_coupon = response.data.subscribe_stores_coupon;  // store
                $scope.subscribe_stores_event = response.data.subscribe_stores_event;    // event
                $scope.promocode_subscribe = true;
                $scope.promocode_subscribe_text = " checked";
                $scope.temp_promo = true;
                //already 1 has been subscribed so subscribe another true means both true
                if ($scope.events_subscribe) {
                    $scope.both_subscribe = true;
                    $scope.both_subscribe_text = " checked";
                    $scope.temp_both = true;
                }
                $scope.common_popup_message = "You have successfully subscribed for " + merchant;
                $scope.common_popup_color_class = "popup";
                $('#commonPopup').modal('show');
            }
            else {
                $scope.common_popup_message = "You have failed to subscribed for " + merchant;
                $scope.common_popup_color_class = "red";
                $('#commonPopup').modal('show');
            }
        }, function (response) {
            console.log("unsuccessful");
            $scope.common_popup_message = "You have failed to subscribed for " + merchant;
            $scope.common_popup_color_class = "red";
            $('#commonPopup').modal('show');
        })
    }

    function subscribe_event(merchant) {
        $scope.common_popup_header = "Subscription for notifications for sales and promo events";
        $http.post('/customers/update/subscribe_stores_event', {storename: merchant}).then(function (response) {
            if (response.data.message == "success") {
                $scope.subscribe_stores_coupon = response.data.subscribe_stores_coupon; //  store list update
                $scope.subscribe_stores_event = response.data.subscribe_stores_event; // store list update
                console.log("successful");
                $scope.common_popup_message = "You have successfully subscribed for " + merchant;
                $scope.common_popup_color_class = "popup";
                $('#commonPopup').modal('show');
                $scope.temp_events = true;
                $scope.events_subscribe = true;
                $scope.events_subscribe_text = " checked";
                if ($scope.promocode_subscribe) {
                    $scope.temp_both = true;
                    $scope.both_subscribe_text = " checked";
                    $scope.both_subscribe = true;
                }
            }
            else {
                $scope.common_popup_message = "You have failed to subscribed for " + merchant;
                $scope.common_popup_color_class = "red";
                $('#commonPopup').modal('show');
            }
        }, function (response) {
            console.log("unsuccessful");
            $scope.common_popup_message = "You have failed to subscribed for " + merchant;
            $scope.common_popup_color_class = "red";
            $('#commonPopup').modal('show');
        })
    }

    function unsubscribe_both(merchant) {
        $scope.common_popup_header = "unsubsscribe to " + merchant;
        $http.post('/customers/update/unsubscribe_all', {storename: merchant}).then(function (response) {
            if (response.data.message == "success") {
                $scope.subscribe_stores_coupon = response.data.subscribe_stores_coupon; //stores for coupon
                $scope.subscribe_stores_event = response.data.subscribe_stores_event;   // stores for events
                $scope.common_popup_message = "You have successfully unsubscribed for " + merchant;
                $scope.common_popup_color_class = "popup";
                $('#commonPopup').modal('show');
                $scope.promocode_subscribe = false;
                $scope.events_subscribe = false;
                $scope.both_subscribe = false;
                $scope.both_subscribe_text = "";
                $scope.promocode_subscribe_text = "";
                $scope.events_subscribe_text = "";
                $scope.temp_both = false;
                $scope.temp_events = false;
                $scope.temp_promo = false;
            }
            else {
                $scope.common_popup_message = "You have failed to unsubscribed  for " + merchant;
                $scope.common_popup_color_class = "red";
                $('#commonPopup').modal('show');
            }
        }, function (response) {
            console.log("unsuccessful");
            $scope.common_popup_message = "You have failed to unsubscribed  for " + merchant;
            $scope.common_popup_color_class = "red";
            $('#commonPopup').modal('show');
        })
    }

    function unsubscribe_event(merchant) {
        if ($scope.uevent)
            $scope.common_popup_header = "Subscription for notifications for sales and promo events";
        $http.post('/customers/update/unsubscribe_stores_event', {storename: merchant}).then(function (response) {
            if (response.data.message == "success") {
                $scope.subscribe_stores_coupon = response.data.subscribe_stores_coupon; // stores for coupon
                $scope.subscribe_stores_event = response.data.subscribe_stores_event; // storelist for events
                if ($scope.uevent)
                    $scope.common_popup_message = "You have successfully unsubscribed  for " + merchant;
                $scope.common_popup_color_class = "popup";
                $('#commonPopup').modal('show');
                $scope.uevent = true
                $scope.events_subscribe = false;
                $scope.events_subscribe_text = "";
                $scope.temp_events = false;
                if (!($scope.promocode_subscribe)) {
                    $scope.both_subscribe = false;
                    $scope.both_subscribe_text = "";
                    $scope.temp_both = false;
                }
            }
            else {
                $scope.common_popup_message = "You have failed to unsubscribed  for " + merchant;
                $scope.common_popup_color_class = "red";
                $('#commonPopup').modal('show');
                $scope.uevent = true;
            }
        }, function (response) {
            console.log("unsuccessful");
            $scope.common_popup_message = "You have failed to unsubscribed  for " + merchant;
            $scope.common_popup_color_class = "red";
            $('#commonPopup').modal('show');
            $scope.uevent = true;
        })
    }

    function unsubscribe_promo(merchant) {
        $scope.common_popup_header = "Subscription for promo codes and coupons ";
        $http.post('/customers/update/unsubscribe_stores_coupon', {storename: merchant}).then(function (response) {
            if (response.data.message == "success") {
                $scope.subscribe_stores_coupon = response.data.subscribe_stores_coupon;
                $scope.subscribe_stores_event = response.data.subscribe_stores_event;
                console.log("successful");
                $scope.common_popup_message = "You have successfully unsubscribed  for " + merchant;
                $scope.common_popup_color_class = "popup";
                $('#commonPopup').modal('show');
                $scope.promocode_subscribe = false;
                $scope.temp_promo = false;
                $scope.promocode_subscribe_text = "";
                if (!($scope.events_subscribe))   // event subscribe false then false both
                {
                    $scope.temp_both = false;
                    $scope.both_subscribe = false;
                    $scope.both_subscribe_text = "";
                }
            }
            else {
                $scope.common_popup_message = "You have failed to unsubscribed  for " + merchant;
                $scope.common_popup_color_class = "red";
                $('#commonPopup').modal('show');
            }
        }, function (response) {
            console.log("unsuccessful");
            $scope.common_popup_message = "You have failed to unsubscribed  for " + merchant;
            $scope.common_popup_color_class = "red";
            $('#commonPopup').modal('show');
        })
    }

    $scope.uevent = true; // subscribe event
    function subscribe_promo_unscubscribe_event(merchant) {
        $scope.uevent = false;
        $scope.common_popup_header = "Subscription for promo codes and coupons";
        $http.post('/customers/update/subscribe_stores_coupon', {storename: merchant}).then(function (response) {
            if (response.data.message == "success") {
                $scope.common_popup_message = "You have successfully to subscribed for " + merchant;
                $scope.common_popup_color_class = "popup";
                $scope.promocode_subscribe = true;
                $scope.temp_promo = true;
                $scope.promocode_subscribe_text = " checked";
                unsubscribe_event(merchant); // both will be checked or not from unsubscribe event
            }
            else {
                $scope.uevent = true;
                $scope.common_popup_message = "You have failed to subscribed for " + merchant;
                $scope.common_popup_color_class = "red";
                $('#commonPopup').modal('show');
            }
        }, function (response) {
            console.log("unsuccessful");
            $scope.common_popup_message = "You have failed to subscribed for " + merchant;
            $scope.common_popup_color_class = "red";
            $('#commonPopup').modal('show');
            $scope.uevent = true;
        })
    }

    function unsubscribe_promo_subscribe_event(merchant) {
        $scope.common_popup_header = "Subscription for notifications for sales and promo events";
        $http.post('/customers/update/unsubscribe_stores_coupon', {storename: merchant}).then(function (response) {
            if (response.data.message == "success") {
                $scope.promocode_subscribe = false;
                $scope.promocode_subscribe_text = "";
                $scope.temp_promo = false;
                subscribe_event(merchant);
            }
            else {
                $scope.common_popup_message = "You have failed to subscribed for " + merchant;
                $scope.common_popup_color_class = "red";
                $('#commonPopup').modal('show');
            }
        }, function (response) {
            $scope.common_popup_message = "You have failed to subscribed for " + merchant;
            $scope.common_popup_color_class = "red";
            $('#commonPopup').modal('show');
        })
    }

    $scope.update_subscribe = function (merchant) {
        if ($scope.events_subscribe && $scope.promocode_subscribe)
            $scope.subscribe_all(merchant);
        else {
            if (!($scope.events_subscribe) && !($scope.promocode_subscribe)) {
                unsubscribe_both(merchant);
                console.log("unsubscribe_both");
            }
            else if ($scope.events_subscribe) {
                if ($scope.temp_events && $scope.temp_promo) // events and promo both was true now only events true unsubscribe  promo
                {
                    unsubscribe_promo(merchant); // in
                }
                else if ((!$scope.temp_events) && (!$scope.temp_promo)) // events and promo both was false now only events true subscribe event
                {
                    subscribe_event(merchant);
                }
                else if ($scope.temp_promo)  // alternate unsubscribe promo and subscribe event
                {
                    unsubscribe_promo_subscribe_event(merchant);
                }
                else if ($scope.temp_events) // same event so no need to update
                {
                    $scope.common_popup_header = "Subscription for notifications for sales and promo events ";
                    $scope.common_popup_message = "You are already subscribed for " + merchant;
                    $scope.common_popup_color_class = "popup";
                    $('#commonPopup').modal('show');
                }
            }
            else if ($scope.promocode_subscribe) {
                if ($scope.temp_events && $scope.temp_promo) // events and promo both was true now only promo true unsubscribe  event
                {
                    unsubscribe_event(merchant);
                }
                else if ((!$scope.temp_events) && (!$scope.temp_promo)) // events and promo both was false now only promo true subscribe promo
                {
                    subscribe_promo(merchant);
                }
                else if ($scope.temp_events) // subscribe prpmo code
                {
                    subscribe_promo_unscubscribe_event(merchant);
                }
                else if ($scope.temp_promo)  // same promo and subscribe event
                {
                    $scope.common_popup_header = "Subscription for promo codes and coupons ";
                    $scope.common_popup_message = "You are already subscribed for " + merchant;
                    $scope.common_popup_color_class = "popup";
                    $('#commonPopup').modal('show');
                }
            }
        }
    }


    $scope.quick_view_parent_orders = function (catalogId) {
        if (angular.isDefined(catalogId)) {
            if (catalogId.trim() != '') {

                searchServiceCatalog.searchOperationProsperentProductByCatalog(catalogId).then(function (responsep) {
                    console.log("I am here");
                    console.log(responsep);
                    $('#quick-popup').modal('show');
                    $scope.set_current_product_common_sim('', '', '', '', responsep.product[0]);
                }, function (responsep) {
                    console.log('not possible');
                })
            } else {

                console.log(" do not have any letter inside");
            }

        } else {

            console.log("catalog id undefined");

        }


    }


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    $scope.quick_view_frm_recent = function (pro, item, prokey, sitekey) {
        var jh;
        $scope.quickview_update = 0;
        $scope.setcurrentitemfrom = 'localstorage';
        $scope.proAvailable = jh;
        $scope.quickvew = 0; // thats mean it is either recent item or item from cart , not quick view item
        $scope.qvLoading = false;
        pro.quantity = 1;
        $scope.required_field_values.quantity = 1;
        $scope.current_product = pro;
        $scope.current_item = item;
        $scope.current_prokey = prokey;
        $scope.current_sitekey = sitekey;
        $scope.twotapapidataready = 0;
        $scope.current_product.keyword = angular.copy(pro.title);
        var sampledata = angular.copy($scope.current_product);
        $scope.current_product.current_price = pro.price;
        searchServiceCatalog.searchOperationProsperentProductByCatalog(pro.catalogId).then(function (responsep) {

            $scope.quickvew = 1;
            $scope.current_product = responsep.product[0];
            $scope.prosper_product = angular.copy($scope.current_product);

            // if(angular.isDefined(sampledata.alt_images))
            //$scope.current_product.alt_images =sampledata.alt_images;

            $scope.current_product.lnk = "#!/SOC/" + $scope.current_product.catalogId + "/" + Slug.slugify($scope.current_product.keyword);
            $scope.current_product.image = $scope.current_product.image_url;
            $scope.current_product.quantity = 1;

            $scope.jantuPakhi = $scope.current_product.twoTapProductUrl; // product url for checkout
            var arrUrl = [];
            arrUrl[0] = $scope.current_product.twoTapProductUrl;
            var pro_url = {product_urls: arrUrl};


            twoTapService.twoTapProductAvailability(pro_url).then(function (data) {
                $scope.setcurrentitemfrom = 'prosperent';

                $scope.qvLoading = true;
                $scope.proAvailable = data.availability;
                $scope.proDetails = data.productCartDetails;
                for (var si in data.productCartDetails.sites) {
                    $scope.current_sitekey = si;
                    for (var pmd5 in data.productCartDetails.sites[si].add_to_cart) {
                        $scope.current_prokey = pmd5;
                        $scope.current_product.alt_images = data.productCartDetails.sites[si].add_to_cart[pmd5].alt_images;
                        if (data.productCartDetails.sites[si].add_to_cart[pmd5].original_price != null) {
                            $scope.current_product.price = parseFloat(data.productCartDetails.sites[si].add_to_cart[pmd5].original_price.substring(1), 10);
                            $scope.current_product.price_sale = parseFloat(data.productCartDetails.sites[si].add_to_cart[pmd5].price.substring(1), 10);
                            $scope.current_product.current_price = angular.copy($scope.current_product.price_sale);
                        }
                        else if (data.productCartDetails.sites[si].add_to_cart[pmd5].price != null) {
                            $scope.current_product.price = parseFloat(data.productCartDetails.sites[si].add_to_cart[pmd5].price.substring(1), 10);
                            $scope.current_product.current_price = angular.copy($scope.current_product.price);
                            $scope.current_product.price_sale = -1;
                        }
                        if (data.productCartDetails.sites[si].add_to_cart[pmd5].required_field_values.hasOwnProperty('color'))
                            $scope.qvcolorjson = data.productCartDetails.sites[si].add_to_cart[pmd5].required_field_values.color;
                        if (data.productCartDetails.sites[si].add_to_cart[pmd5].required_field_values.hasOwnProperty('size'))
                            $scope.qvsizejson = data.productCartDetails.sites[si].add_to_cart[pmd5].required_field_values.size;
                        if (data.productCartDetails.sites[si].add_to_cart[pmd5].required_field_values.hasOwnProperty('option'))
                            $scope.qvoptionjson = data.productCartDetails.sites[si].add_to_cart[pmd5].required_field_values.option;
                        $scope.current_product.required_fields = data.productCartDetails.sites[si].add_to_cart[pmd5].required_fields;
                        $scope.current_product.required_field_names = data.productCartDetails.sites[si].add_to_cart[pmd5].required_field_names;
                        $scope.current_product.required_field_values = data.productCartDetails.sites[si].add_to_cart[pmd5].required_field_values;
                    }
                    for (var pmd5 in data.productCartDetails.sites[si].failed_to_add_to_cart) {
                        console.log(data.productCartDetails.sites[si].failed_to_add_to_cart);
                        $scope.current_prokey = pmd5;
                        $scope.current_product.alt_images = data.productCartDetails.sites[si].failed_to_add_to_cart[pmd5].alt_images;
                        if (data.productCartDetails.sites[si].failed_to_add_to_cart[pmd5].original_price != null) {
                            $scope.current_product.price = parseFloat(data.productCartDetails.sites[si].failed_to_add_to_cart[pmd5].original_price.substring(1), 10);
                            $scope.current_product.price_sale = parseFloat(data.productCartDetails.sites[si].failed_to_add_to_cart[pmd5].price.substring(1), 10);
                        }
                        else if (data.productCartDetails.sites[si].failed_to_add_to_cart[pmd5].price != null) {
                            $scope.current_product.price = parseFloat(data.productCartDetails.sites[si].failed_to_add_to_cart[pmd5].price.substring(1), 10);
                        }
                        $scope.current_product.required_fields = data.productCartDetails.sites[si].failed_to_add_to_cart[pmd5].required_fields;
                        $scope.current_product.required_field_names = data.productCartDetails.sites[si].failed_to_add_to_cart[pmd5].required_field_names;
                        $scope.current_product.required_field_values = data.productCartDetails.sites[si].failed_to_add_to_cart[pmd5].required_field_values;
                    }
                }
                $scope.qvtwotapapidataready = 1;

                $http.post('/ProductProsperentUpdate', {available: $scope.proAvailable, catalogId: pro.catalogId}).then(function (response) {
                    console.log(response);

                })

            }, function (e4) {

                $scope.qvtwotapapidataready = 0;
                $scope.proAvailable = false;
                $scope.qvLoading = true;
                $http.post('/ProductProsperentUpdate', {available: $scope.proAvailable, catalogId: pro.catalogId}).then(function (response) {
                    console.log(response);

                })
            });

        }, function (response) {

            $scope.qvLoading = true;
            $scope.proAvailable = false;
            $http.post('/ProductProsperentUpdate', {available: $scope.proAvailable, catalogId: pro.catalogId}).then(function (response) {
                console.log(response);
            })
        })
    }


    $scope.set_current_product_common = function (pro, item, prokey, sitekey) {

        var p;
        $scope.current_product = p;
        $scope.quickview_update = 0;
        $scope.setcurrentitemfrom = 'localstorage';
        var temp;
        var potap = [];
        var length = 0;
        var retp;
        var timeCurrent;
        var jsonTemp = {"timestamp": {}};
        var mobile_arr = {};
        if (!Date.now) {
            timeCurrent = function now() {
                return new Date().getTime();
            }
        }
        else {
            timeCurrent = Date.now();
        }
        if (angular.isDefined($window.localStorage.getItem('recentI')) && $window.localStorage.getItem('recentI') != null) {
            temp = $window.localStorage.getItem('recentI');
            potap = JSON.parse(temp);
            length = Object.keys(potap).length;
            jsonTemp["timestamp"] = {};
            jsonTemp["timestamp"][timeCurrent] = {"sites": {}};
            jsonTemp["timestamp"][timeCurrent]["sites"][sitekey] = item;
            if (length >= 1) {
                length = 1;
            }
            for (var i = length; i >= 0; i--) {
                if (i == 0) {
                    potap[i] = jsonTemp;
                    mobile_arr[i] = {img: pro.image};
                }
                else {
                    potap[i] = potap[i - 1];
                    mobile_arr[i] = mobile_arr[i - 1];
                }
            }
        }
        else {
            jsonTemp["timestamp"] = {};
            jsonTemp["timestamp"][timeCurrent] = {"sites": {}};
            jsonTemp["timestamp"][timeCurrent]["sites"] = item;
            potap[length] = jsonTemp;
            mobile_arr[length] = {img: pro.image};
        }
        retp = JSON.stringify(potap);
        var jsx = JSON.stringify(mobile_arr);
        $window.localStorage.setItem('recentI', retp);
        var tem1 = $window.localStorage.getItem('recentI');
        var potax = JSON.parse(tem1);
        $scope.recentItems = potax;
        $scope.quickvew = 0; // thats mean it is either recent item or item from cart , not quick view item
        $scope.set_current_product_pro_mother(pro, item, prokey, sitekey, 'add');
    }
    // for using rececnt item from keys
    $scope.set_current_product_pro_mother = function (pro, item, prokey, sitekey, add_fail) {
        $scope.required_field_values = {};
        $scope.qvcolorText = " ";
        $scope.current_product = angular.copy(pro);
        $scope.current_item = angular.copy(item);
        $scope.current_prokey = angular.copy(prokey);
        $scope.current_sitekey = angular.copy(sitekey);
        $scope.current_product.keyword = $scope.current_product.title;
        $scope.add_fail = add_fail;
        if ($scope.quickview_update != 1) {
            pro.quantity = 1;
            $scope.required_field_values.quantity = 1;
        }
        else {


            if (angular.isDefined($scope.current_product.required_field_values)) {


                $scope.current_product.requiredjsons = $scope.current_product.required_field_values;
                if ($scope.current_product.required_field_values.hasOwnProperty('color'))
                    $scope.qvcolorjson = $scope.current_product.required_field_values.color;

                if ($scope.current_product.required_field_values.hasOwnProperty('size'))
                    $scope.qvsizejson = $scope.current_product.required_field_values.size;

            }


        }
        var rn;
        for (var i = 0; i < $scope.current_product.required_field_names.length; i++) {


            rn = $scope.current_product.required_field_names[i];
            $scope.required_field_values[rn] = $scope.current_product[rn];

        }
        $scope.current_product.price = angular.copy(parseFloat($scope.current_product.price.substring(1), 10));


        //  $scope.current_product.current_price = pro.price;
        //$scope.current_product.price  = angular.copy(parseFloat(pro.price.substring(1),10));

        /*$scope.current_product.upc='';
         $scope.current_product.isbn=''; */
        $scope.twotapapidataready = 0;
        //	$scope.current_product.price_sale =-1;

    }

    // need to work with price when set color
    $scope.set_color_mother = function (colorArr, itemByColor) {
        var i = 0;
        var num = -1;
        var tempname;
        for (i = 0; i < colorArr.length; i++) {
            if (colorArr[i].text == itemByColor.text) {
                num = i;
                $scope.qvcolorText = colorArr[i].text;


                if (angular.isDefined(colorArr[num].image))
                    $scope.current_product.image = colorArr[num].image;

                if (colorArr[num].dep.size) {
                    $scope.qvsizejson = colorArr[num].dep.size;
                    $scope.required_field_values.size = null;

                }
                for (var j = 0; j < $scope.current_product.required_field_names.length; j++) {
                    tempname = $scope.current_product.required_field_names[j];
                    if (colorArr[num].dep.hasOwnProperty(tempname)) {

                        if (tempname != 'quantity' && tempname != 'color' && tempname != 'size') {

                            if (colorArr[num].dep[tempname]) {
                                $scope.current_product.requiredjsons[tempname] = colorArr[num].dep[tempname];
                                $scope.required_field_values[tempname] = null;

                            }

                        }
                    }
                }


                var cp = colorArr[num].price.substring(1);
                var pri = parseFloat(cp, 10);

                $scope.current_product.current_price = pri;
                $scope.qvcurrent_price = parseFloat(cp, 10);

                if ($scope.current_product.price_sale != '' && $scope.current_product.price_sale != null && $scope.current_product.price_sale != -1)
                    $scope.current_product.price_sale = pri;
                else
                    $scope.current_product.price = pri;


                if (angular.isDefined(colorArr[num].extra_info)) {
                    $scope.current_product.extra_info = colorArr[num].extra_info;
                }


            }
        }


        if (angular.isDefined(colorArr.extra_info)) {
            $scope.current_product.extra_info = colorArr.extra_info;
        }
    }


    $scope.get_related_color_list_mother = function (completeSizeJson) {
        if (completeSizeJson.dep.color) {
            $scope.qvcolorjson = completeSizeJson.dep.color;
        }
    }
    // size and price relation for quick view

    // need to work with price when set color

    $scope.set_size_mother = function (sizeArr, itemBySize) {
        // $scope.required_field_values.size = size;
        var tempname;
        if (itemBySize.hasOwnProperty('dep')) {
            if (itemBySize.dep.hasOwnProperty('color')) {
                $scope.get_related_color_list_mother(itemBySize);
                $scope.required_field_values.color = null;
                $scope.qvcolorText = null;
            }

            for (var j = 0; j < $scope.current_product.required_field_names.length; j++) {
                tempname = $scope.current_product.required_field_names[j];
                if (itemBySize.dep.hasOwnProperty(tempname)) {

                    if (tempname != 'quantity' && tempname != 'color' && tempname != 'size') {

                        if (itemBySize.dep[tempname]) {
                            $scope.current_product.requiredjsons[tempname] = itemBySize.dep[tempname];

                            $scope.required_field_values[tempname] = null;


                        }

                    }
                }
            }


        }
        if (angular.isDefined(itemBySize.price)) {
            var cpx = itemBySize.price.substring(1);
            var pr = parseFloat(cpx, 10);
            $scope.qvcurrent_price = parseFloat(cpx, 10);
            $scope.current_product.current_price = pr;


            if ($scope.current_product.price_sale != '' && $scope.current_product.price_sale != null && $scope.current_product.price_sale != -1)
                $scope.current_product.price_sale = pr;
            else
                $scope.current_product.price = pr;

            $scope.subtotal = "" + "subtotal $ " + pr;
        }
        if (angular.isDefined(itemBySize.image)) {
            $scope.current_product.image = itemBySize.image;
        }
        if (angular.isDefined(itemBySize.extra_info)) {
            $scope.current_product.extra_info = itemBySize.extra_info;
        }
        if (angular.isNumber($scope.required_field_values['size'])) {
            $scope.required_field_values['size'] = $scope.required_field_values['size'].toString();
        }


    }

    $scope.set_json_field_mother = function (requiredjsons, selectedjson) {


        var selectedfield;
        // $scope.required_field_values.size = size;
        var tempname;

        if (angular.isDefined(selectedjson.price)) {
            var cpx = selectedjson.price.substring(1);
            var pr = parseFloat(cpx, 10);
            $scope.qvcurrent_price = parseFloat(cpx, 10);
            $scope.current_product.current_price = pr;

            if ($scope.current_product.price_sale != '' && $scope.current_product.price_sale != null && $scope.current_product.price_sale != -1)
                $scope.current_product.price_sale = pr;
            else
                $scope.current_product.price = pr;

            $scope.subtotal = "" + "subtotal $ " + pr;
        }
        if (angular.isDefined(selectedjson.extra_info)) {
            $scope.current_product.extra_info = selectedjson.extra_info;
        }

        if (angular.isDefined(selectedjson.image)) {
            $scope.current_product.image = selectedjson.image;
        }


        if (selectedjson.hasOwnProperty('dep')) {
            for (var j = 0; j < $scope.current_product.required_field_names.length; j++) {
                tempname = $scope.current_product.required_field_names[j];
                if (selectedjson.dep.hasOwnProperty(tempname)) {

                    if (tempname == 'color') {
                        $scope.get_related_color_list_mother(selectedjson);
                        $scope.required_field_values['color'] = null;
                        $scope.qvcolorText = null;
                    }
                    else if (tempname == 'size') {

                        if (selectedjson.dep.size) {
                            $scope.qvsizejson = selectedjson.dep.size;
                            //$scope.current_product.image_url = colorArr[num].image;
                            $scope.required_field_values['size'] = null;
                        }
                    } else if (tempname != 'quantity') {

                        if (selectedjson.dep[tempname]) {
                            $scope.current_product.requiredjsons[tempname] = selectedjson.dep[tempname];

                            $scope.required_field_values[tempname] = null;
                        }

                    }

                }
            }
        }
    }


    // qucik view from product list
    $scope.set_current_product_common_sim = function (pro, item, prokey, sitekey, product) {
        var jh;
        $scope.current_product = jh;
        $scope.prosper_product = jh;


        $scope.prodetails = {cart_id: ''};

        $scope.required_field_values = {};
        $scope.proAvailable = jh;
        $scope.qvcolorjson = jh;
        $scope.qvsizejson = jh;
        $scope.qvoptionjson = jh;

        $scope.quickvew = 1; // taking care whether it come from quick view
        $scope.quickview_update = 0;
        $scope.qvtwotapapidataready = 0;
        $scope.setcurrentitemfrom = 'prosperent';

        $scope.prosper_product = angular.copy(product);
        $scope.current_product = product;
        $scope.qvLoading = false;

        searchServiceCatalog.searchOperationProsperentProductByCatalog(product.catalogId).then(function (responsep) {
            $scope.current_product = responsep.product[0];
            $scope.current_product.lnk = "#!/SOC/" + product.catalogId + "/" + Slug.slugify(product.keyword);
            $scope.current_product.image = product.image_url;
            $scope.current_product.quantity = 1;
            $scope.current_prokey = "";
            $scope.current_sitekey = "";
            $cookies.put('lastcatalog', product.catalogId);
            $cookies.put('lastcatalogtitle', product.keyword);
            if (!($scope.current_product.hasOwnProperty('current_price'))) {
                if ($scope.current_product.price_sale == -1 || $scope.current_product.price_sale == null || $scope.current_product.price_sale == '')
                    $scope.current_product.current_price = $scope.current_product.price;
                else
                    $scope.current_product.current_price = $scope.current_product.price_sale;

            }

            $scope.jantuPakhi = $scope.current_product.twoTapProductUrl; // product url for checkout
            $scope.required_field_values.quantity = 1;
            var arrUrl = [];
            arrUrl[0] = $scope.current_product.twoTapProductUrl;
            var pro_url = {product_urls: arrUrl};

            console.log($scope.current_product);
            $scope.move_item = {};
            $scope.move_item.title = $scope.current_product.keyword;
            $scope.move_item.brand = $scope.current_product.brand;
            $scope.move_item.catalogId = $scope.current_product.catalogId;
            $scope.num_moved = $scope.required_field_values.quantity;
            $scope.move_text = 'Cart';
            //$scope.move_item.colorText ='';
            $scope.estimated_move_price_totals = {};

            if (angular.isDefined($scope.required_field_values.quantity) && angular.isDefined($scope.current_product.current_price))
                $scope.estimated_move_price_totals.subtotal = $scope.required_field_values.quantity * $scope.current_product.current_price;
            if (angular.isDefined($scope.current_product.required_field_names)) {

                $scope.proAvailable = $scope.current_product.available;
                $scope.current_sitekey = $scope.current_product.site_id;
                $scope.current_prokey = $scope.current_product.md5;
                $scope.current_product.alt_images = $scope.current_product.alt_images;
                if (angular.isDefined($scope.current_product.required_field_values)) {


                    $scope.current_product.requiredjsons = $scope.current_product.required_field_values;
                    if ($scope.current_product.required_field_values.hasOwnProperty('color'))
                        $scope.qvcolorjson = $scope.current_product.required_field_values.color;

                    if ($scope.current_product.required_field_values.hasOwnProperty('size'))
                        $scope.qvsizejson = $scope.current_product.required_field_values.size;

                }
                $scope.qvLoading = true;


            }

            else {

                console.log('api down');

                twoTapService.twoTapProductAvailability(pro_url).then(function (data) {

                    $scope.qvLoading = true;
                    $scope.proAvailable = data.availability;
                    $scope.proDetails = data.productCartDetails;
                    $scope.current_product.cartProductStatus = angular.copy(data.productCartDetails);

                    for (var si in data.productCartDetails.sites) {
                        $scope.current_sitekey = si;
                        for (var pmd5 in data.productCartDetails.sites[si].add_to_cart) {
                            $scope.current_prokey = pmd5;
                            $scope.current_product.alt_images = data.productCartDetails.sites[si].add_to_cart[pmd5].alt_images;

                            $scope.current_product.requiredjsons = data.productCartDetails.sites[si].add_to_cart[pmd5].required_field_values;

                            if (data.productCartDetails.sites[si].add_to_cart[pmd5].original_price != null) {
                                $scope.current_product.price = parseFloat(data.productCartDetails.sites[si].add_to_cart[pmd5].original_price.substring(1), 10);
                                $scope.current_product.price_sale = parseFloat(data.productCartDetails.sites[si].add_to_cart[pmd5].price.substring(1), 10);
                                $scope.current_product.current_price = angular.copy($scope.current_product.price_sale);
                            }
                            else if (data.productCartDetails.sites[si].add_to_cart[pmd5].price != null) {
                                $scope.current_product.price = parseFloat(data.productCartDetails.sites[si].add_to_cart[pmd5].price.substring(1), 10);
                                $scope.current_product.current_price = angular.copy($scope.current_product.price);
                                $scope.current_product.price_sale = -1;
                            }
                            if (data.productCartDetails.sites[si].add_to_cart[pmd5].required_field_values.hasOwnProperty('color'))
                                $scope.qvcolorjson = data.productCartDetails.sites[si].add_to_cart[pmd5].required_field_values.color;
                            if (data.productCartDetails.sites[si].add_to_cart[pmd5].required_field_values.hasOwnProperty('size'))
                                $scope.qvsizejson = data.productCartDetails.sites[si].add_to_cart[pmd5].required_field_values.size;

                            if (data.productCartDetails.sites[si].add_to_cart[pmd5].required_field_values.hasOwnProperty('option'))
                                $scope.qvoptionjson = data.productCartDetails.sites[si].add_to_cart[pmd5].required_field_values.option;
                            $scope.current_product.required_fields = data.productCartDetails.sites[si].add_to_cart[pmd5].required_fields;
                            $scope.current_product.required_field_names = data.productCartDetails.sites[si].add_to_cart[pmd5].required_field_names;
                            $scope.current_product.required_field_values = data.productCartDetails.sites[si].add_to_cart[pmd5].required_field_values;
                            $scope.current_product.alt_images = data.productCartDetails.sites[si].add_to_cart[pmd5].alt_images;


                        }
                        for (var pmd5 in data.productCartDetails.sites[si].failed_to_add_to_cart) {
                            console.log(data.productCartDetails.sites[si].failed_to_add_to_cart);
                            $scope.current_prokey = pmd5;
                            $scope.current_product.alt_images = data.productCartDetails.sites[si].failed_to_add_to_cart[pmd5].alt_images;
                            if (data.productCartDetails.sites[si].failed_to_add_to_cart[pmd5].original_price != null) {
                                $scope.current_product.price = parseFloat(data.productCartDetails.sites[si].failed_to_add_to_cart[pmd5].original_price.substring(1), 10);
                                $scope.current_product.price_sale = parseFloat(data.productCartDetails.sites[si].failed_to_add_to_cart[pmd5].price.substring(1), 10);
                            }
                            else if (data.productCartDetails.sites[si].failed_to_add_to_cart[pmd5].price != null) {
                                $scope.current_product.price = parseFloat(data.productCartDetails.sites[si].failed_to_add_to_cart[pmd5].price.substring(1), 10);
                            }
                            $scope.current_product.required_fields = data.productCartDetails.sites[si].failed_to_add_to_cart[pmd5].required_fields;
                            $scope.current_product.required_field_names = data.productCartDetails.sites[si].failed_to_add_to_cart[pmd5].required_field_names;
                            $scope.current_product.required_field_values = data.productCartDetails.sites[si].failed_to_add_to_cart[pmd5].required_field_values;
                        }
                    }
                    $scope.qvtwotapapidataready = 1;
                    $http.post('/ProductProsperentUpdate', {available: $scope.proAvailable, catalogId: product.catalogId}).then(function (response) {
                        console.log(response);

                    })


                }, function (e4) {
                    $scope.qvtwotapapidataready = 0;
                    $scope.proAvailable = false;
                    $scope.qvLoading = true;
                    $http.post('/ProductProsperentUpdate', {available: $scope.proAvailable, catalogId: product.catalogId}).then(function (response) {
                        console.log(response);

                    })


                });
            } // else end


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
                if (length >= 19) {
                    length = 19;

                }

                for (var p = 0; p < Object.keys(pota).length; p++) {
                    if (angular.isDefined(pota[p]) && pota[p] != null) {
                        var checkobj = pota[p].timestamp;
                        for (var single_recent in checkobj) {
                            if (checkobj[single_recent].catalogId == $scope.current_product.catalogId) {
                                console.log("success delete");
                                pota.splice(p, 1);
                                p = p - 1;
                            }
                        }
                    }

                }
                obj["timestamp"] = {};
                obj["timestamp"][timeCurrent] = $scope.current_product;


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


        }, function (response) {

            $scope.qvLoading = true;
            $scope.proAvailable = false;
            $http.post('/ProductProsperentUpdate', {available: $scope.proAvailable, catalogId: product.catalogId}).then(function (response) {
                console.log(response);

            })
        })

    }
    $scope.get_size_list_mother = function (complete, itemByColor, ind) {
        $scope.acx = "";
        var num = -1;
        // $scope.required_field_values.color =itemByColor.value;
        var leng = -1;
        var leng = Object.keys(complete.color).length
        var sikey = $scope.current_sitekey;
        var prokey = $scope.current_prokey;
        console.log(leng);
        if (leng > 0) {
            for (var i = 0; i < leng; i++) {
                if (complete.color[i].text == itemByColor.text) {
                    num = i;
                    $scope.current_product.colorText = complete.color[i].text;
                    $scope.current_product.color = complete.color[i].value;
                    // $scope.current_product.required_field_values.size = itemByColor.dep.size;
                    // $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[prokey].required_field_values.size= itemByColor.dep.size;
                    // console.log( $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[prokey].required_field_values.size);
                    // break;
                    if (complete.color[i].dep.size) {
                        $scope.required_field_values.size = null;
                        $scope.current_product.size = null;

                        $scope.current_product.required_field_values.size = complete.color[i].dep.size;
                    }
                    break;
                }
            }
        }

    }
    $scope.update_promd5 = function () {
        var sikey = angular.copy($scope.current_sitekey);
        var prokey = angular.copy($scope.current_prokey);
        var md5pro = angular.copy($scope.current_prokey);
        var rn1;
        var count = 0;
        $('#quick-popup').modal('hide');

        console.log($scope.update_cart_or_wish);

        if ($scope.update_cart_or_wish == 'wish') {

            if ($scope.add_fail == 'failed')
                $scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[prokey].movetobagPossible = 0;
            else
                var num_required = $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].required_field_names.length;


            ///////////////////////
            if ($scope.add_fail == 'add') {

                for (var i = 0; i < $scope.current_product.required_field_names.length; i++) {


                    rn1 = $scope.current_product.required_field_names[i];
                    $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[prokey][rn1] = angular.copy($scope.required_field_values[rn1]);

                    if (rn1 == 'color') {

                        $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[prokey].required_field_values.color = angular.copy($scope.qvcolorjson);
                    } else if (rn1 == 'size') {

                        $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[prokey].required_field_values.size = angular.copy($scope.qvsizejson);

                    }


                }

                count = $scope.current_product.required_field_names.length;

                for (var i = 0; i < $scope.current_product.required_field_names.length; i++) {


                    rn1 = $scope.current_product.required_field_names[i];
                    $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[prokey][rn1] = angular.copy($scope.required_field_values[rn1]);

                }

                $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[prokey].price = angular.copy("$" + $scope.current_product.price);


                if (num_required > count)
                    $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[prokey].movetobagPossible = 0;
                else {
                    $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[prokey].movetobagPossible = 1;
                    $scope.acx = "";
                }


            } else {


                for (var i = 0; i < $scope.current_product.required_field_names.length; i++) {


                    rn1 = $scope.current_product.required_field_names[i];
                    $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[prokey][rn1] = angular.copy($scope.required_field_values[rn1]);

                    if (rn1 == 'color') {

                        $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[prokey].required_field_values.color = angular.copy($scope.qvcolorjson);
                    } else if (rn1 == 'size') {

                        $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[prokey].required_field_values.size = angular.copy($scope.qvsizejson);

                    }


                }

                count = $scope.current_product.required_field_names.length;

                for (var i = 0; i < $scope.current_product.required_field_names.length; i++) {


                    rn1 = $scope.current_product.required_field_names[i];
                    $scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[prokey][rn1] = angular.copy($scope.required_field_values[rn1]);

                }

                $scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[prokey].price = angular.copy("$" + $scope.current_product.price);


            }

            for (var j = 0; j < $scope.saveprofile2.length; j++) {
                if (angular.equals(angular.lowercase($scope.saveprofile2[j].chkout_url), angular.lowercase($scope.current_product.original_url))) {
                    console.log("I am here");
                    $scope.saveprofile2[j].quantity = angular.copy($scope.required_field_values.quantity);
                    $scope.saveprofile2[j].current_price = angular.copy($scope.current_product.price);


                    for (var i = 0; i < $scope.current_product.required_field_names.length; i++) {


                        rn1 = $scope.current_product.required_field_names[i];
                        $scope.saveprofile2[j].required_field_values[rn1] = angular.copy($scope.required_field_values[rn1]);

                    }

                    $http.post('/customers/update/wishlist', {wishList: $scope.saveprofile2})
                        .success(function (data, status, headers, config) {
                            if (angular.isDefined($scope.saveprofile2)) {

                                if ($scope.saveprofile2.length > 0) {
                                    var temp_cal = calculateItems($scope.saveprofile2);
                                    $scope.saved_item_number = calculateItems($scope.saveprofile2);
                                    $scope.cartDistinctDreamStore = getcartUniqueRetailer($scope.saveprofile2);
                                    $scope.total_cart_distinct_wishstore = $scope.cartDistinctDreamStore.length;
                                    $scope.num_stores_wish = $scope.saved_item_number;

                                    $scope.$broadcast('wingChanged');


                                } else {

                                    $scope.saved_item_number = 0;
                                    $scope.cartDistinctDreamStore = [];
                                    $scope.total_cart_distinct_wishstore = 0;
                                    $scope.num_stores_wish = $scope.saved_item_number;


                                }
                            } else {

                                $scope.saved_item_number = 0;
                                $scope.cartDistinctDreamStore = [];
                                $scope.total_cart_distinct_wishstore = 0;
                                $scope.num_stores_wish = $scope.saved_item_number;

                            }


                        })
                        .error(function (data, status, headers, config) {
                            $scope.common_popup_header = "Wish list Update Error";
                            $scope.common_popup_message = "Wish list Update Not possible " + data;
                            $('#commonPopup').modal('show');
                            //$scope.getCartItemsJson();
                        });


                }
            }


            /////////////////////////


        } else if ($scope.update_cart_or_wish == 'cart') {



            //  $scope.twotap_builtin_cart.sites[sikey].add_to_cart[prokey].required_field_values = angular.copy($scope.required_field_values);
            //if( $scope.twotap_builtin_cart.sites[sikey].add_to_cart[prokey].quantity!=$scope.required_field_values.quantity)
            if ($scope.add_fail == 'add') {
                for (var i = 0; i < $scope.current_product.required_field_names.length; i++) {


                    rn1 = $scope.current_product.required_field_names[i];
                    $scope.twotap_builtin_cart.sites[sikey].add_to_cart[prokey][rn1] = angular.copy($scope.required_field_values[rn1]);

                    if (rn1 == 'color') {

                        $scope.twotap_builtin_cart.sites[sikey].add_to_cart[prokey].required_field_values.color = angular.copy($scope.qvcolorjson);
                    } else if (rn1 == 'size') {

                        $scope.twotap_builtin_cart.sites[sikey].add_to_cart[prokey].required_field_values.size = angular.copy($scope.qvsizejson);

                    }

                }
                $scope.twotap_builtin_cart.sites[sikey].add_to_cart[prokey].price = "$" + $scope.current_product.price;

            } else {

                for (var i = 0; i < $scope.current_product.required_field_names.length; i++) {


                    rn1 = $scope.current_product.required_field_names[i];
                    $scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[prokey][rn1] = angular.copy($scope.required_field_values[rn1]);

                    if (rn1 == 'color') {

                        $scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[prokey].required_field_values.color = angular.copy($scope.qvcolorjson);
                    } else if (rn1 == 'size') {

                        $scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[prokey].required_field_values.size = angular.copy($scope.qvsizejson);

                    }

                }

                $scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[prokey].price = "$" + $scope.current_product.price;

            }

            for (var j = 0; j < $scope.userprofile2.length; j++) {
                if (angular.equals(angular.lowercase($scope.userprofile2[j].chkout_url), angular.lowercase($scope.current_product.original_url))) {
                    console.log("I am here");
                    $scope.userprofile2[j].quantity = angular.copy($scope.required_field_values.quantity);
                    $scope.userprofile2[j].current_price = angular.copy($scope.current_product.price);


                    for (var i = 0; i < $scope.current_product.required_field_names.length; i++) {


                        rn1 = $scope.current_product.required_field_names[i];
                        $scope.userprofile2[j].required_field_values[rn1] = angular.copy($scope.required_field_values[rn1]);

                    }

                    $http.post('/customers/update/cart',
                        {updatedCart: $scope.userprofile2})
                        .success(function (data, status, headers, config) {
                            $scope.cartDistinctStore = getcartUniqueRetailer($scope.userprofile2);
                            $scope.total_cart_distinct_store = $scope.cartDistinctStore.length;
                            var temp_cal = calculateItems($scope.userprofile2);
                            $scope.cart_items_number = temp_cal;
                            $scope.num_items = temp_cal;
                            $scope.cartTotal();
                            $scope.$broadcast('quanChanged');


                        })
                        .error(function (data, status, headers, config) {
                            console.log(data);
                        });


                }
            }


        }


        //  $("#quick-popup").modal("hide");
    }
    $scope.closeCommonPopup = function () {
        $scope.common_popup_message = "";
        $scope.common_popup_header = "";
        $("#commonPopup").modal("hide");

    }
    $scope.generateAllMerchants();
    $scope.generateAllBrands();
    $scope.get_twotap_category();

    //$scope.get_all_custom_category();
    getBlogInfo();
    ///////////////////////////////////////////////////////////
    var clickInterval;
    $scope.timeGap = 0;
    $scope.stopclickInterval = function () {
        $scope.timeGap = 0;
        $interval.cancel(clickInterval);
    };
    // it is counting and tracking time difference between two clicks
    // mainly useful in search result page
    $scope.intervalgapGeneratelink = function () {
        $scope.loaddone = false;
        clickInterval = $interval(function () {
            // careful to check purchase status use right purchase id
            if ($scope.timeGap > 1200) {
                $scope.stopclickInterval();

                $scope.selectCategorySearchboxFromInside = false;
                $scope.selectMerchantSearchboxFromInside = false;
                $scope.selectBrandSearchboxFromInside = false;
                $scope.lastsearchobj = angular.copy($scope.queryobj);

                searchdatabase();



            }
            $scope.timeGap = $scope.timeGap + 605;
        }, 605);
    }
    ////////////////////////////////////////////////////////////////////////////////////
    var clickIntervalForRequest;
    $scope.timeGapRequest = 0;
    $scope.stopclickIntervalForRequest = function () {
        $interval.cancel(clickIntervalForRequest);
    };
    // it is counting and tracking time difference between two clicks
    // mainly useful in search result page
    // finalize the url after 1 second
    $scope.intervalRequestlinkGenerate = function () {
        clickIntervalForRequest = $interval(function () {
            // careful to check purchase status use right purchase id
            if ($scope.timeGapRequest > 1200) {
                $scope.stopclickIntervalForRequest();
                var tempLoc = $location.path();
                $scope.proLoading = false;
            }
            $scope.timeGapRequest = $scope.timeGapRequest + 601;
        }, 601);
    }
    ///////////////////////////////////////////// Purchase Processing System //////////////////////////////////
    var purchase_check;
    $scope.stopPurchaseCheck = function () {
        if (angular.isDefined(purchase_check)) {
            $interval.cancel(purchase_check);
            purchase_check = undefined;
        }
    };
    // code to notify about any purchase
    $scope.purchase_process = function (purchase_id) {

        if (!angular.isDefined(purchase_id)) {
            $scope.purchase_button = "";
            console.log("purchase id idefined purchase not possible");
            return;

        }
        var validpurchase = false;
        var timerP = 0;
        $scope.timeGapPurchase = 0;
        $scope.current_purchase_id = purchase_id;
        console.log($scope.userprofile2);
        var arrCartItem = [];
        if ($scope.purchase_all) {

            $scope.userprofile2 = [];
        } else {
            for (var t = 0; t < $scope.userprofile2.length; t++) {

                if ($scope.userprofile2[t].retailer != $scope.cur_merchant) {

                    arrCartItem.push($scope.userprofile2[t]);
                }

                if (t + 1 == $scope.userprofile2.length) {
                    if (arrCartItem.length > 0) {

                        $scope.userprofile2 = angular.copy(arrCartItem);
                    }
                }
            }
        }

        purchase_check = $interval(function () {
            // careful to check purchase status use right purchase id
            if (!validpurchase) {
                if ($scope.timeGapPurchase >= 3600000) {
                    if ($scope.purchase_complete == "done") {
                        validpurchase = true;
                        // check database status for this
                        $scope.purchase_button = "";
                        $scope.stopPurchaseCheck();
                        $http.get('/getUserInfoAfterPurchase')  //logged in user retrieve cart from database user
                            .success(function (data) {
                                $scope.cart_items_number = 0;
                                $scope.saving_total_perItem = 0;
                                $scope.saving_total = 0;
                                $scope.shipping_cost = 0;
                                $scope.taxes = 0;
                                $scope.fullTotal = 0;
                                $scope.num_items = 0;

                                console.log(data);
                                $scope.userprofile2 = data.cart;
                                if ($scope.userprofile2.length > 0) {
                                    $scope.cartDistinctStore = getcartUniqueRetailer($scope.userprofile2);
                                    $scope.total_cart_distinct_store = $scope.cartDistinctStore.length;
                                    var temp_cal = calculateItems($scope.userprofile2);
                                    $scope.cart_items_number = temp_cal;
                                    $scope.num_items = temp_cal;
                                    $scope.cartTotal();


                                }
                                else {
                                    $scope.cart_items_number = 0;
                                    $scope.num_items = 0;
                                    $scope.num_stores = 0;
                                    $scope.saving_total = 0;
                                    $scope.saving_total_perItem = 0;
                                    $scope.shipping_cost = 0;
                                    $scope.taxes = 0;
                                    $scope.fullTotal = 0;
                                    $scope.cartDistinctStore = [];
                                    $scope.total_cart_distinct_store = 0;
                                    $scope.estimated_move_price_totals = {};
                                    $scope.twotap_builtin_cart = undefined;
                                    $scope.estimated_price_totals = {"final_price": "$0.0", "subtotal": "$0.0"};
                                    $scope.valid_coupons = 0;
                                    $scope.invalid_coupons = 0;
                                    $scope.valid_coupon_store = 0;
                                    $scope.saving = 0;
                                    $scope.tap = 0;
                                    $scope.step = 1;
                                    $scope.failed_item_num = 0;
                                    $scope.checkoutpossible = true;

                                    $scope.failed_sub_total = 0;


                                }

                                if (angular.isDefined(data.orderObj)) {
                                    $scope.orderObj = data.orderObj;
                                }
                                if (angular.isDefined(data.mailbox)) {
                                    $scope.mailObj = data.mailbox;
                                }

                            }).error(function (err) {
                            console.log(" user cart show error: " + err);
                        });


                    }
                    else {
                        validpurchase = false;
                        $scope.purchase_complete = "failed";
                        $scope.purchase_button = "";
                        $scope.stopPurchaseCheck();
                    }
                    $scope.tap = 1;
                    $scope.step = 0;

                }
                $http.get("https://api.twotap.com/v1.0/purchase/status?public_token=" + $scope.twotap_public_token + "&purchase_id=" + purchase_id
                    + "&test_mode=fake_confirm").then(function (responsePurc) {
                    //
                    if (responsePurc.status == 200 || responsePurc.status == 202 || responsePurc.status == 203 || responsePurc.status == 302 || responsePurc.status == 303 || responsePurc.status == 304) {
                        if (responsePurc.data.message != "still_processing") {
                            $scope.stopPurchaseCheck();
                            validpurchase = true;
                            $scope.purchase_complete = responsePurc.data.message;
                            $scope.shoppingbag_cart_changed = true; //
                            $cookies.put('shoppingbag_cart_changed', true);
                            $scope.card_details = angular.copy($scope.twotap_builtin_cart.card);
                            $scope.tap = 1;
                            $scope.step = 0;
                            $scope.final_purchase_message = responsePurc.data;
                            $scope.common_popup_message = $scope.purchase_complete;
                            $scope.common_popup_header = "Purchase Notification";
                            $('#commonPopup').modal('show');

                            $http.get('/getUserInfoAfterPurchase')  //logged in user retrieve cart from database user
                                .success(function (data) {
                                    $scope.saving_total = 0;
                                    $scope.saving_total_perItem = 0;
                                    $scope.shipping_cost = 0;
                                    $scope.taxes = 0;
                                    $scope.fullTotal = 0;

                                    $scope.userprofile2 = data.cart;
                                    console.log(data.cart);


                                    if (angular.isDefined(data.cart)) {

                                        if ($scope.userprofile2.length > 0) {
                                            var temp_cal = calculateItems($scope.userprofile2);
                                            $scope.cart_items_number = temp_cal;
                                            $scope.cartTotal();
                                            $scope.num_items = temp_cal;
                                            $scope.cartDistinctStore = getcartUniqueRetailer($scope.userprofile2);
                                            $scope.total_cart_distinct_store = $scope.cartDistinctStore.length;
                                        }
                                        else {

                                            $scope.cart_items_number = 0;
                                            $scope.num_items = 0;
                                            $scope.num_stores = 0;
                                            $scope.cartDistinctStore = [];
                                            $scope.total_cart_distinct_store = 0;
                                            $scope.estimated_move_price_totals = {};
                                            $scope.twotap_builtin_cart = undefined;
                                            $scope.estimated_price_totals = {"final_price": "$0.0", "subtotal": "$0.0"};
                                            $scope.valid_coupons = 0;
                                            $scope.invalid_coupons = 0;
                                            $scope.valid_coupon_store = 0;
                                            $scope.saving = 0;
                                            $scope.tap = 0;
                                            $scope.step = 1;
                                            $scope.failed_item_num = 0;
                                            $scope.checkoutpossible = true;

                                            $scope.failed_sub_total = 0;

                                        }


                                    } else {

                                        $scope.cart_items_number = 0;
                                        $scope.num_items = 0;
                                        $scope.num_stores = 0;
                                        $scope.cartDistinctStore = [];
                                        $scope.total_cart_distinct_store = 0;
                                        $scope.estimated_move_price_totals = {};
                                        $scope.twotap_builtin_cart = undefined;
                                        $scope.estimated_price_totals = {"final_price": "$0.0", "subtotal": "$0.0"};
                                        $scope.valid_coupons = 0;
                                        $scope.invalid_coupons = 0;
                                        $scope.valid_coupon_store = 0;
                                        $scope.saving = 0;
                                        $scope.tap = 0;
                                        $scope.step = 1;
                                        $scope.failed_item_num = 0;
                                        $scope.checkoutpossible = true;

                                        $scope.failed_sub_total = 0;
                                    }


                                    if (angular.isDefined(data.orderObj)) {
                                        $scope.orderObj = data.orderObj;
                                    }
                                    if (angular.isDefined(data.mailbox)) {
                                        $scope.mailObj = data.mailbox;
                                    }

                                    if (angular.isDefined(purchase_id)) {

                                        if (purchase_id.trim() != '') {
                                            var pathafterpurchase = '/confirmation_placed_view/' + purchase_id + '/' + $scope.userinfo['_id'];
                                            $location.path(pathafterpurchase);
                                            $route.reload();
                                        }

                                    }


                                }).error(function (err) {
                                console.log(" user cart show error: " + err);
                            });


                            $scope.purchase_button = "";

                        }
                        else
                            $scope.purchase_complete = responsePurc.data.message;
                    }

                }, function (responsePurc) {
                    $scope.common_popup_message = responsePurc.data.message;
                    $scope.common_popup_header = "Purchase Status Check error";
                    $('#commonPopup').modal('show');
                    $scope.stopPurchaseCheck();
                })
            }
            timerP = timerP + 90000;
            $scope.timeGapPurchase = timerP;
        }, 90000);
    }
    // back or continue shopping from other pages
    $scope.continue_shopping = function () {
        var path = $location.path();
        $scope.priceloadedfull = true;
        if (path.indexOf('search') > -1 || path == '/dashboard' || path == '/' || path.indexOf('storechosen') > -1) {
            $('#quick-popup').modal('hide');
            $('#addToBag').modal('hide');
            console.log("need to close down everything");
            return;
        }
        else {

            $('#quick-popup').modal('hide');
            $('#addToBag').modal('hide');
            $scope.bigCurrentPage = 1;
            $scope.load_click = 0;
            $scope.viewall = 0;
            $scope.showup = 0;

            $scope.SearchVisible = false;

            //$scope.selected_sorting = "relevance";
            $scope.globalSearch = true;


            if (angular.isDefined($scope.lastsearchobj)) {
                $scope.queryobj = angular.copy($scope.lastsearchobj);

            } else if (angular.isDefined($scope.queryobj)) {
                console.log("direct search as query obj is there");

            } else {

                $scope.queryobj = {};

            }
            $scope.intervalgapGeneratelink(); // create link

            $location.path('/search');

            $route.reload();


        }
        $scope.bigCurrentPage = 1;
        $scope.load_click = 0;
        $scope.viewall = 0;
        $scope.showup = 0;
        $scope.SearchVisible = false;
        $scope.globalSearch = true;
        $location.path('/search');
        var searchUrl = $cookies.get('lastsearch');
        $scope.prosperentSearchUrl = searchUrl; // url which sent to prosperent
    }


    $scope.gotomailbox = function () {

        $location.path('/mail_coupon');
        $route.reload();
        $('#storeSubscribed').modal('hide');


    }

    // required if you are trying to go checkout page instantly


    $scope.tx = function (merchant) {

        $scope.$broadcast('checkout_step2');
    }
    // required if you are trying to go shopping page instantly
    $scope.popupcheckout = function (merchant) {
        $scope.priceloadedfull = true;

        $('#quick-popup').modal('hide');
        $('#addToBag').modal('hide');
        $location.path('/shoppingbag');
        $route.reload();
    }
    /////////////////////////////////////////////////// Social Page ////////////
    $scope.set_alert_type = function (ind) {
        $scope.sale_alert_details = undefined;
        $scope.sale_alert_details = $scope.twotap_coupon[ind];
    }
    ///////////////////////////////////////////////////////////////////////////
    $scope.gourllocation = function (location) {
        $location.path(location);
        $route.reload();
    }
    // array indicating popular search
    $scope.related_popularsearch = [];
    // search keywords on bottom
    $scope.generateRelatedSearchArr = function () {
        if (angular.isDefined($scope.searchtermarr) && $scope.searchtermarr.length > 0) {
            var keywordx;
            if (angular.isDefined($scope.selected) && $scope.selected.trim() != '')
                keywordx = angular.lowercase($scope.selected);
            else if (angular.isDefined($scope.selected_key) && $scope.selected_key.trim() != '')
                keywordx = angular.lowercase($scope.selected_key);
            else {
                console.log("I am returning as search key not there");
                return;
            }
            var tempmix;
            var tota;
            var keywordarr = keywordx.split(" ");
            var found = false;
            for (var mx = 0; mx < $scope.searchtermarr.length; mx++) {
                found = false;
                tempmix = angular.lowercase($scope.searchtermarr[mx]);
                for (var k = 0; k < keywordarr.length; k++) {
                    keyword = keywordarr[k];
                    if (tempmix.indexOf(keyword) > -1) {
                        $scope.related_popularsearch.push(tempmix);
                        found = true;
                        break;
                    }
                    if ($scope.related_popularsearch.length >= 6)
                        break;
                }
            } // mixpanel loop
        } // mixpanel arr item exist or not
    } // generateRelatedSearchArr end

    $(document).on('click', '.white_btn', function () {
        var merchant = $(this).attr('merchant');
        $scope.menuShopApi('', merchant);
    })
    /*go to mail page for getting coupon from shopping bag page*/
    $scope.getcoupon = function (retailer, storedetails) {
        $scope.subscribe_store = storedetails;
        var indexstores = -1;
        if ($scope.loggedin == 0 || $scope.loggedin === undefined) {
            window.alert("logged in and subscribe to get coupon");
            $scope.after_login_location = '/shoppingbag';

            $("#login-popup").modal("show");


        }
        else {


            if ($scope.subscribe_stores_coupon.indexOf(retailer) > -1) {
                $location.path('/mail_coupon');
                $route.reload();
            }
            else {
                checkbox_subscribe_window(retailer); // subscribe window


                $('#storeSubscribed').modal('show');
            }
        }


    }

    $scope.signout = function () {
        $scope.searchuser = {
            loginemail: "",
            password: ""
        }
        $scope.pathTorch = [];
        var und;
        var free_me;
        $scope.loggedin = 0;
        $scope.userprofile2 = free_me;
        $scope.saveprofile2 = free_me;
        $scope.shoppingbag_cart_changed = true;
        $cookies.put('shoppingbag_cart_changed', true);
        $cookies.remove('shoppingbag_cart_id');
        $scope.cart_items_number = 0;
        $scope.saved_item_number = 0;
        $scope.num_stores_wish = $scope.saved_item_number;

        $scope.total_cart_distinct_store = 0;
        $scope.saving_total = 0;
        $scope.shipping_cost = 0;
        $scope.merchandiseTotal = 0;
        $scope.taxes = 0;
        $scope.fullTotal = 0;
        $scope.user_saved_item_id = [];
        $cookies.remove("useridentity");
        $scope.cook_signed = free_me;
        $scope.purchase_button = "";
        $scope.userinfo = free_me;

        $http.get('/api/auth/signout').success(function (data) {
            // $scope.login=false;
            $scope.userstopten = [];
            $scope.userstoptenWomen = [];
            $scope.userstoptenMen = [];
            $scope.userstoptenShoes = [];
            $scope.userstoptenAccessories = [];
            $scope.userstoptenBeauty = [];
            $scope.userstoptenKids = [];
            $scope.userstoptenHome = [];
            $scope.userstoptenGifts = [];
            $scope.userstoptenLocal = [];
            $scope.subscribe_stores_coupon = [];
            $scope.subscribe_stores_event = [];
            $scope.menuCategorySearch('dashboard');
            $scope.after_login_location = '/dashboard';
            $scope.num_stores = 0;
            $scope.num_items = 0;
            $scope.estimated_price_totals = "$0.0";
            $scope.valid_coupons = 0;
            $scope.valid_coupon_store = 0;
            $scope.twotap_builtin_cart = undefined;
            $scope.considered_items = [];
            $scope.userprofile2 = [];
            $scope.saveprofile2 = [];
            $scope.shipping_chrg = undefined;
            $scope.shipping_address = undefined;
            $scope.billing_address = undefined;
            $scope.card_details = undefined;
            $scope.twotap_wishlist_cart = undefined;
            $scope.ck_all = true;
            $scope.tap = 1;
            $scope.s_array = [];
            $scope.cartDistinctStore = [];
            $scope.total_cart_distinct_store = 0;
            $scope.wishbag_cart_changed = true;
            $scope.itemQuantity_wish = [];
            $scope.considered_items_wish = [];
            $scope.num_items_wish = 0;
            $scope.num_stores_wish = 0;
            $scope.estimated_price_totals_wish = "$0.0";
            $scope.s_array_wish = [];
            $scope.user_saved_item_id = [];
            $scope.user_saved_item = undefined;
            // $location.path('/'); //redirect to unsigned user home
            // $route.reload();

            $scope.$apply();
        }).error(function (err) {
            console.log("sign out Error: " + err);
            //$route.reload();
            $scope.$apply();

        });
        temppath = {'poth': '#!/', 'label': 'HOME'};
        $scope.pathTorch.push(temppath);
        $cookies.put('path', $scope.pathTorch);
    }
    // Tab  in mobile in top ten and store page


    $scope.initTwotapCheckoutCart = function () {


        var temp_changed;

        $scope.ck_all = true;


        if (!Date.now) {
            var timeCurrent = function now() {
                return new Date().getTime();
            }
        }
        else {
            var timeCurrent = Date.now();
        }


        $scope.itemQuantity = [];
        var checkoutRequest = {};
        var obj = $scope.userprofile2;     // my custom cart data
        var url_product = "";
        var counter = 0; 							// keeping product url
        var requestedItems = [];
        $scope.considered_items = [];
        var quantity_product;
        //$scope.$parent.num_items = 0;
        for (var t in obj) {
            url_product = obj[t].chkout_url;
            quantity_product = obj[t].quantity;
            $scope.itemQuantity.push({'url': url_product, 'affiliate_link': obj[t].twoTapAffiliateLink, 'quantity': quantity_product}); // define json object
            $scope.considered_items.push(obj[t]);
            requestedItems.push(url_product); // make an array of product url
            // $scope.$parent.num_items = $scope.num_items + quantity_product;
            counter = counter + 1;

        }
        $scope.estimated_price_totals = {};

        if (requestedItems.length > 0) {

            console.log("length greater than 0");

        } else {

            $scope.num_items = 0;
            $scope.num_stores = 0;
            $scope.failed_item_num = 0;        // calculate number of item which failed to add
            $scope.failed_sub_total = 0;       // calculate failed item  subotoal

            $scope.saving = 0;
            $scope.valid_coupons = 0;
            $scope.invalid_coupons = 0;

            $scope.valid_coupon_store = 0;
            $scope.fullTotal = undefined;

            console.log("no way bro... 0 item inside cart");
            return;

        }


        pro_url = {product_urls: requestedItems};
        if ($location.path() == '/shoppingbag') {

            $scope.step = 1;
            $scope.tap = 1;
        } else if ($location.path() == '/scheckout') {

            $scope.step = 2;
            $scope.tap = 0;
        }
        $scope.initTwotapLoaddone = 0;


        $http.post('/twotap_cart', pro_url).then(function (response) {

                //	$scope.ss_cart_load = 0;
                $scope.initTwotapLoaddone = 1;

                var sites_arr = [];
                $scope.twotap_builtin_cart = response.data.productCartDetails;
                $scope.twotap_builtin_cart.product_urls = [];

                $scope.num_stores = 0;

                for (var skey in $scope.twotap_builtin_cart.sites) {
                    sites_arr.push(skey);
                    $scope.shipping_chrg[skey] = {};
                    $scope.num_stores = $scope.num_stores + 1;
                }


                $scope.s_array = sites_arr;  //make an array of sites

                var storeProducts = [];
                // return cart and make indexteams as null

                var ramp = [];
                var sikey = "";
                var number_of_products = 0;
                var store_id;
                var quantity_store_wise = 0;
                var distinct_site_key;
                var temp_aff = "";
                var clean_url = "";
                var jjj = {};

                // matching with saved cart
                $scope.failed_item_num = 0;        // calculate number of item which failed to add
                $scope.failed_sub_total = 0;       // calculate failed item  subotoal

                $scope.saving = 0;
                var temp_price = 0;
                var temp_price_total = 0;


                if (sites_arr.length > 0) {
                    console.log("go on");

                } else {
                    console.log("empty cart as site array nulll");
                    return;

                }

                for (sikey in $scope.twotap_builtin_cart.sites) {

                    $scope.twotap_builtin_cart.sites[sikey].failed_sub_total_store = 0;    // calculate failed item  subtotal store wise

                    for (var q = 0; q < $scope.userprofile2.length; q++) {


                        for (var md5prox in $scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart) {

                            if (angular.equals(angular.lowercase($scope.userprofile2[q].chkout_url), angular.lowercase($scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].original_url))) {


                                if (angular.isDefined($scope.userprofile2[q].current_price)) {
                                    $scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].price = "$" + $scope.userprofile2[q].current_price;

                                }


                                $scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].rateAvg = angular.copy($scope.userprofile2[q].product[0].rateAvg);
                                $scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].shareCount = angular.copy($scope.userprofile2[q].product[0].shareCount);
                                $scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].likeCount = angular.copy($scope.userprofile2[q].product[0].likeCount);
                                $scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].reviewCount = angular.copy($scope.userprofile2[q].product[0].reviewCount);
                                $scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].ratedByUser = angular.copy($scope.userprofile2[q].product[0].ratedByUser);


                                $scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].percentOff = $scope.userprofile2[q].product[0].percentOff;
                                $scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].orig_price = $scope.userprofile2[q].product[0].price;
                                $scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].catalogId = $scope.userprofile2[q].product[0].catalogId;
                                $scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].quantity = angular.copy($scope.userprofile2[q].quantity);
                                $scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].lnk = $scope.userprofile2[q].url; // link within website
                                $scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].required_field_values = angular.copy($scope.userprofile2[q].required_field_values);
                                $scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].category = $scope.userprofile2[q].product[0].category;

                                //$scope.$parent.num_items =$scope.num_items+$scope.userprofile2[p].quantity;
                                $scope.twotap_builtin_cart.sites[sikey].shop = $scope.userprofile2[q].product[0].merchant;

                                $scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].brand = $scope.userprofile2[q].product[0].brand;
                                // $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.size=$scope.userprofile2[p].size;
                                // $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color=$scope.userprofile2[p].color;
                                // $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.option=$scope.userprofile2[p].option;
                                // $scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].cartId = $scope.userprofile2[q].cartId;
                                for (var rq in $scope.userprofile2[q].required_field_values) {

                                    if (rq == 'color' || rq == 'size' || rq == 'quantity') {
                                        console.log("do not do anything");
                                    } else {

                                        $scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox][rq] = angular.copy($scope.userprofile2[q].required_field_values[rq]);

                                    }

                                }


                                if (angular.isDefined($scope.userprofile2[q].required_field_values.size)) {
                                    $scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].size = $scope.userprofile2[q].required_field_values.size;

                                }

                                if ($scope.userprofile2[q].required_field_values.hasOwnProperty('color')) {

                                    $scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].color = $scope.userprofile2[q].required_field_values.color;
                                    // $scope.reset_size_list($scope.twotap_builtin_cart,$scope.userprofile2[p].required_field_values.color,-2);
                                    var t = 0;
                                    var num = -1;
                                    for (t = 0; t < $scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].required_field_values.color.length; t++) {

                                        if ($scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].required_field_values.color[t].value == $scope.userprofile2[q].required_field_values.color) {
                                            $scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].required_field_values.size = $scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].required_field_values.color[t].dep.size;

                                            $scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].size = $scope.userprofile2[q].required_field_values.size;

                                            break;
                                        }
                                    }


                                }


                                //$scope.twotap_builtin_cart.affiliate_links[sikey] = $scope.userprofile2[p].twoTapAffiliateLink;
                                temp_aff = $scope.userprofile2[q].twoTapAffiliateLink;

                                $scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].affiliate_links = temp_aff;
                                clean_url = $scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].clean_url;

                                if ($scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].image == "") {
                                    if ($scope.userprofile2[q].product[0].image_url != "")
                                        $scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].image = $scope.userprofile2[q].product[0].image_url;
                                    else if ($scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].alt_images.length > 0)
                                        $scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].image = $scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].alt_images[0];


                                }
                                $scope.failed_item_num = $scope.failed_item_num + $scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].quantity;        // calculate number of total failed item which failed to add
                                if ($scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].hasOwnProperty('price')) {
                                    if ($scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].price != null) {
                                        temp_price = parseFloat($scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].price.substring(1), 10);  // getting price of failed item


                                    } else {

                                        temp_price = $scope.userprofile2[q].current_price;
                                        $scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].orig_price = angular.copy($scope.userprofile2[q].current_price);


                                    }
                                }
                                else {
                                    temp_price = $scope.userprofile2[q].current_price;
                                    $scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].orig_price = angular.copy($scope.userprofile2[q].current_price);


                                }
                                temp_price_total = $scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].quantity * temp_price;
                                $scope.twotap_builtin_cart.sites[sikey].failed_sub_total_store = $scope.twotap_builtin_cart.sites[sikey].failed_sub_total_store + temp_price_total; // store wise calculate failed item price
                                $scope.failed_sub_total = $scope.failed_sub_total + temp_price_total;    	// full subtotal of failed items 																		// calculate total


                            } // url cross check

                        }


                        for (md5pro in $scope.twotap_builtin_cart.sites[sikey].add_to_cart) {
                            // if($scope.userprofile2[p].productMD5==md5pro)
                            // if($scope.userprofile2[p].chkout_url==$scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].original_url)
                            // {

                            if (angular.equals(angular.lowercase($scope.userprofile2[q].chkout_url), angular.lowercase($scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].original_url))) {
                                if (angular.isDefined($scope.userprofile2[q].current_price)) {
                                    $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].price = "$" + $scope.userprofile2[q].current_price;

                                }
                                $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].rateAvg = angular.copy($scope.userprofile2[q].product[0].rateAvg);
                                $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].shareCount = angular.copy($scope.userprofile2[q].product[0].shareCount);
                                $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].likeCount = angular.copy($scope.userprofile2[q].product[0].likeCount);
                                $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].reviewCount = angular.copy($scope.userprofile2[q].product[0].reviewCount);
                                $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].ratedByUser = angular.copy($scope.userprofile2[q].product[0].ratedByUser);

                                $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].input_fields = angular.copy($scope.userprofile2[q].required_field_values);
                                $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].percentOff = $scope.userprofile2[q].product[0].percentOff;
                                $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].orig_price = $scope.userprofile2[q].product[0].price;
                                $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].category = $scope.userprofile2[q].product[0].category;

                                $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].rateAvg = angular.copy($scope.userprofile2[q].product[0].rateAvg);
                                $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].shareCount = angular.copy($scope.userprofile2[q].product[0].shareCount);
                                $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].likeCount = angular.copy($scope.userprofile2[q].product[0].likeCount);
                                $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].reviewCount = angular.copy($scope.userprofile2[q].product[0].reviewCount);
                                $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].ratedByUser = angular.copy($scope.userprofile2[q].product[0].ratedByUser);


                                $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].catalogId = $scope.userprofile2[q].product[0].catalogId;

                                for (var rq in $scope.userprofile2[q].required_field_values) {

                                    if (rq == 'color' || rq == 'size' || rq == 'quantity') {
                                        console.log("do not do anything");
                                    } else {

                                        $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro][rq] = angular.copy($scope.userprofile2[q].required_field_values[rq]);

                                    }

                                }


                                $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.quantity = angular.copy($scope.userprofile2[q].quantity);
                                $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].quantity = angular.copy($scope.userprofile2[q].quantity);
                                $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].lnk = $scope.userprofile2[q].url; // link within website
                                //$scope.$parent.num_items =$scope.num_items+$scope.userprofile2[q].quantity;
                                $scope.twotap_builtin_cart.sites[sikey].shop = $scope.userprofile2[q].product[0].merchant;
                                $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].brand = $scope.userprofile2[q].product[0].brand;
                                if ($scope.userprofile2[q].required_field_values.hasOwnProperty('size')) {

                                    $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].size = $scope.userprofile2[q].required_field_values.size;
                                }
                                if ($scope.userprofile2[q].required_field_values.hasOwnProperty('color')) {

                                    $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].color = $scope.userprofile2[q].required_field_values.color;
                                    // $scope.reset_size_list($scope.twotap_builtin_cart,$scope.userprofile2[q].required_field_values.color,-2);
                                    var i = 0;
                                    var num = -1;
                                    if ($scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.hasOwnProperty('color')) {

                                        for (i = 0; i < $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color.length; i++) {

                                            if ($scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[i].value == $scope.userprofile2[q].required_field_values.color) {
                                                // num = i;
                                                if ($scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[i].hasOwnProperty('dep')) {

                                                    if ($scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[i].dep.hasOwnProperty('size')) {

                                                        $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.size = $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[i].dep.size;
                                                        $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].size = $scope.userprofile2[q].required_field_values.size;
                                                        console.log("Ra Check");

                                                        break;
                                                    }

                                                }
                                            }
                                        } //
                                    }

                                    //$scope.twotap_builtin_cart.affiliate_links[sikey] = $scope.userprofile2[q].twoTapAffiliateLink;
                                }
                                temp_aff = $scope.userprofile2[q].twoTapAffiliateLink;

                                $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].affiliate_links = temp_aff;
                                clean_url = $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].clean_url;
                                $scope.saving = $scope.saving + (($scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].orig_price - parseFloat($scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].price.substring(1), 10)) * ($scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].quantity));
                                if ($scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].image == "") {
                                    if ($scope.userprofile2[q].product[0].image_url != "")
                                        $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].image = $scope.userprofile2[q].product[0].image_url;
                                    else if ($scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].alt_images.length > 0)
                                        $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].image = $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].alt_images[0];


                                }


                            }
                        }


                        $scope.shipping_countries_support = angular.copy($scope.twotap_builtin_cart.sites[sikey].shipping_countries_support);
                        $scope.billing_countries_support = angular.copy($scope.twotap_builtin_cart.sites[sikey].billing_countries_support);


                        // $scope.$parent.twotap_builtin_cart.sites[sikey].shipping =$scope.shipping_address;
                        // $scope.$parent.twotap_builtin_cart.sites[sikey].billing =$scope.billing_address;
                        // $scope.$parent.twotap_builtin_cart.sites[sikey].card =$scope.card_details;
                        $scope.twotap_builtin_cart.sites[sikey].shipping = angular.copy($scope.shipping_address);
                        $scope.twotap_builtin_cart.sites[sikey].billing = angular.copy($scope.billing_address);
                        $scope.twotap_builtin_cart.sites[sikey].card = angular.copy($scope.card_details);
                        $scope.twotap_builtin_cart.sites[sikey].shipping_option = 'cheapest';
                    }

                }


                $scope.twotap_builtin_cart.shipping = angular.copy($scope.shipping_address);
                $scope.twotap_builtin_cart.billing = angular.copy($scope.billing_address);
                $scope.twotap_builtin_cart.card = angular.copy($scope.card_details);


                //if(response.data.availability)
                //{

                $scope.count_items($scope.twotap_builtin_cart, -1, $scope.considered_items);
                $scope.shoppingbag_cart_changed = false; //

                $cookies.put('shoppingbag_cart_changed', false);

                $cookies.put('shoppingbag_cart_id', response.data.cart_id);

                $scope.mcart = false;

                $scope.estimateFunctionTop($scope.twotap_builtin_cart, -1, $scope.considered_items); // no need to change the items


                if ($scope.failed_item_num > 0) {
                    $scope.common_popup_message = "Please Remove unavailable items before proceed";
                    $scope.common_popup_header = "Unavailable Items ";
                    $('#commonPopup').modal('show');

                    if ($location.path == '/scheckout') {
                        $location.path('/shoppingbag');
                        $route.reload();

                    }
                }


                $scope.firsttime.loading = 1;


            },
            function (response) {
                $scope.num_stores = 0;
                $scope.num_items = 0;
                $scope.estimated_price_totals = {"final_price": "$0.0", "subtotal": "$0.0"};
                //  $scope.$parent.estimated_move_price_totals = {"final_price": "$0.0", "subtotal": "$0.0"};

                $scope.valid_coupons = 0;
                $scope.invalid_coupons = 0;

                $scope.valid_coupon_store = 0;
                $scope.twotap_builtin_cart = undefined;
                $scope.ss_cart_load = 0;
                $scope.initTwotapLoaddone = 1;
                $scope.firsttime.loading = 1;
            })


    }





    $scope.initTwotapwishOut = function () {


        $scope.num_stores_wish = $scope.total_cart_distinct_store_wish;
        var temp_changed = $scope.wishbag_cart_changed;
        $scope.itemQuantity_wish = [];
        var checkoutRequest = {};
        var obj2 = $scope.saveprofile2;     // my custom cart data
        var url_product = "";
        var counter = 0; 							// keeping product url

        var requestedItems_wish = [];
        // using following loop we generate json object for the product


        $scope.considered_items_wish = [];
        for (var t in obj2) {
            url_product = obj2[t].chkout_url;
            var quantity_product = obj2[t].quantity;
            $scope.itemQuantity_wish.push({
                'url': url_product,
                'affiliate_link': obj2[t].twoTapAffiliateLink,
                'quantity': quantity_product
            }); // define json object
            $scope.considered_items_wish.push(obj2[t]);
            requestedItems_wish.push(url_product); // make an array of product url
            counter = counter + 1;

        }


        if (requestedItems_wish.length == 0) {
            $scope.num_items_wish = 0;
            $scope.num_stores_wish = 0;
            $scope.estimated_price_totals_wish = {"final_price": "$0.0", "subtotal": "$0.0"};
            //  $scope.estimated_move_price_totals = {"final_price": "$0.0", "subtotal": "$0.0"};

            $scope.twotap_wishlist_cart = undefined;
            $scope.ss_wish_load = 0;

            return;
        }

        pro_url_wish = {product_urls: requestedItems_wish};

        $scope.twotap_wishlist_cart = undefined;
        $scope.failed_wish_sub_total = 0;
        $scope.estimated_price_totals_wish = {};
        $scope.initWishLoaddone = 0;
        $http.post('/twotap_cart', pro_url_wish).then(function (response) {
            $scope.initWishLoaddone = 1;

            $scope.twotap_wishlist_cart = response.data.productCartDetails;
            $scope.twotap_wishlist_cart.product_urls = [];

            sites_arr = [];
            for (skey in $scope.twotap_wishlist_cart.sites) {
                sites_arr.push(skey);
            }
            $scope.s_array_wish = sites_arr;  //make an array of sites
            $scope.num_stores_wish = $scope.s_array_wish.length;

            var storeProducts = [];
            // return cart and make indexteams as null

            var ramp = [];
            var sikey = "";
            var md5pro = "";
            var md5prof = "";
            var number_of_products = 0;
            var store_id;
            var quantity_store_wise = 0;
            var distinct_site_key;


            var temp_aff = "";
            var clean_url = "";
            var jjj = {};


            $scope.num_items_wish = 0;
            $scope.failed_wish_item_num = 0;        // calculate number of item which failed to add
            $scope.failed_wish_sub_total = 0;       // calculate failed item  subotoal
            var saveCount = 0;
            $scope.wish_sub_total_handcount = 0;
            $scope.success_wish_sub_total = 0;
            for (var n = 0; n < $scope.s_array_wish.length; n++) {
                sikey = $scope.s_array_wish[n]; // target one site
                number_of_products = 0;

                var num_required;
                for (var p = 0; p < $scope.saveprofile2.length; p++) {

                    for (md5prof in $scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart) {

                        //		if($scope.saveprofile2[p].chkout_url==$scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5pro].original_url)

                        if (angular.equals(angular.lowercase($scope.saveprofile2[p].chkout_url), angular.lowercase($scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].original_url))) {


                            if (angular.isDefined($scope.saveprofile2[p].current_price)) {
                                $scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].price = "$" + $scope.saveprofile2[p].current_price;

                            }
                            var temp_pricew = 0;
                            var temp_price_totalw = 0;
                            var num_required = 0;

                            for (var rq in $scope.saveprofile2[p].required_field_values) {

                                if (rq == 'color' || rq == 'size' || rq == 'quantity') {
                                    console.log("do not do anything");
                                }
                                else {

                                    $scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof][rq] = angular.copy($scope.saveprofile2[p].required_field_values[rq]);

                                }

                            }

                            $scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].movetobagPossible = 0;
                            $scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].required_field_values = angular.copy($scope.saveprofile2[p].required_field_values);
                            $scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].input_fields = $scope.saveprofile2[p].required_field_values;


                            $scope.twotap_wishlist_cart.sites[sikey].shop = $scope.saveprofile2[p].product[0].merchant;

                            $scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].percentOff = $scope.saveprofile2[p].product[0].percentOff;
                            $scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].orig_price = angular.copy($scope.saveprofile2[p].product[0].price);
                            $scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].category = $scope.saveprofile2[p].product[0].category;

                            $scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].rateAvg = angular.copy($scope.saveprofile2[p].product[0].rateAvg);
                            $scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].shareCount = angular.copy($scope.saveprofile2[p].product[0].shareCount);
                            $scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].likeCount = angular.copy($scope.saveprofile2[p].product[0].likeCount);
                            $scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].reviewCount = angular.copy($scope.saveprofile2[p].product[0].reviewCount);
                            $scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].ratedByUser = angular.copy($scope.saveprofile2[p].product[0].ratedByUser);


                            $scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].lnk = $scope.saveprofile2[p].url;
                            $scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].catalogId = $scope.saveprofile2[p].product[0].catalogId;
                            //$scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].cartId = $scope.saveprofile2[p].cartId;

                            $scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].required_field_values = angular.copy($scope.saveprofile2[p].required_field_values);
                            $scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].quantity = angular.copy($scope.saveprofile2[p].quantity);

                            $scope.num_items_wish = $scope.num_items_wish + parseInt($scope.saveprofile2[p].quantity);

                            $scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].shop = $scope.saveprofile2[p].product[0].merchant;
                            $scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].brand = $scope.saveprofile2[p].product[0].brand;

                            if (angular.isDefined($scope.saveprofile2[p].required_field_values.size)) {
                                $scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].size = angular.copy($scope.saveprofile2[p].required_field_values.size);

                            }


                            if ($scope.saveprofile2[p].required_field_values.hasOwnProperty('color')) {


                                $scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].color = angular.copy($scope.saveprofile2[p].required_field_values.color);
                                // $scope.reset_size_list($scope.twotap_builtin_cart,$scope.userprofile2[p].required_field_values.color,-2);
                                var i = 0;
                                var num = -1;


                                for (zw = 0; zw < $scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].required_field_values.color.length; zw++) {

                                    if ($scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].required_field_values.color[zw].value == $scope.saveprofile2[p].required_field_values.color) {
                                        $scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].required_field_values.size = $scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].required_field_values.color[zw].dep.size;

                                        break;
                                    }
                                }

                            }


                            temp_aff = $scope.saveprofile2[p].twoTapAffiliateLink;

                            clean_url = $scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].clean_url;
                            if ($scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].image == "") {
                                if ($scope.saveprofile2[p].product[0].image_url != "")
                                    $scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].image = $scope.saveprofile2[p].product[0].image_url;
                                else if ($scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].alt_images.length > 0)
                                    $scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].image = $scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].alt_images[0];
                            }
                            $scope.failed_wish_item_num = $scope.failed_wish_item_num + $scope.saveprofile2[p].quantity;
                            if (angular.isDefined($scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof])) {
                                if ($scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].hasOwnProperty('price')) {

                                    if ($scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].price != null)
                                        temp_pricew = parseFloat($scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].price.substring(1), 10);  // getting price of failed item
                                    else {
                                        temp_pricew = $scope.saveprofile2[p].current_price;
                                        $scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].price = angular.copy("$" + $scope.saveprofile2[p].current_price);
                                        $scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].orig_price = angular.copy(temp_pricew);

                                    }
                                } else {
                                    temp_pricew = $scope.saveprofile2[p].current_price;

                                    $scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].price = angular.copy("$" + $scope.saveprofile2[p].current_price);
                                    $scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].orig_price = angular.copy(temp_pricew);


                                }


                                temp_price_totalw = $scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].quantity * temp_pricew;
                            }

                            $scope.failed_wish_sub_total = $scope.failed_wish_sub_total + temp_price_totalw;    	// full subtotal of failed items 																		// calculate total


                        }

                    }


                    for (md5pro in $scope.twotap_wishlist_cart.sites[sikey].add_to_cart) {

                        //								if($scope.saveprofile2[p].chkout_url==$scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].original_url)

                        if (angular.equals(angular.lowercase($scope.saveprofile2[p].chkout_url), angular.lowercase($scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].original_url))) {


                            if (angular.isDefined($scope.saveprofile2[p].current_price)) {
                                $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].price = "$" + $scope.saveprofile2[p].current_price;
                            }

                            $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].input_fields = angular.copy($scope.saveprofile2[p].required_field_values);

                            $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].movetobagPossible = 0;
                            num_required = 0;
                            num_required = $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].required_field_names.length;
                            if (num_required > Object.keys($scope.saveprofile2[p].required_field_values).length) {
                                $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].movetobagPossible = 0;
                            }
                            else {
                                $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].movetobagPossible = 1;

                            }

                            for (var rq in $scope.saveprofile2[p].required_field_values) {

                                if (rq == 'color' || rq == 'size' || rq == 'quantity') {
                                    console.log("do not do anything");
                                }
                                else {

                                    $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro][rq] = angular.copy($scope.saveprofile2[p].required_field_values[rq]);

                                }

                            }


                            $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].percentOff = $scope.saveprofile2[p].product[0].percentOff;
                            $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].orig_price = angular.copy($scope.saveprofile2[p].product[0].price);

                            $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].rateAvg = angular.copy($scope.saveprofile2[p].product[0].rateAvg);
                            $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].shareCount = angular.copy($scope.saveprofile2[p].product[0].shareCount);
                            $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].likeCount = angular.copy($scope.saveprofile2[p].product[0].likeCount);
                            $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].reviewCount = angular.copy($scope.saveprofile2[p].product[0].reviewCount);
                            $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].ratedByUser = angular.copy($scope.saveprofile2[p].product[0].ratedByUser);


                            $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].lnk = $scope.saveprofile2[p].url;
                            $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].catalogId = $scope.saveprofile2[p].product[0].catalogId;
                            // $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].cartId = $scope.saveprofile2[p].cartId;
                            $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].category = $scope.saveprofile2[p].product[0].category;

                            $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].required_field_values.quantity = angular.copy($scope.saveprofile2[p].quantity);
                            $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].quantity = angular.copy($scope.saveprofile2[p].quantity);

                            $scope.num_items_wish = $scope.num_items_wish + parseInt($scope.saveprofile2[p].quantity);

                            $scope.twotap_wishlist_cart.sites[sikey].shop = $scope.saveprofile2[p].product[0].merchant;
                            $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].brand = $scope.saveprofile2[p].product[0].brand;


                            if (angular.isDefined($scope.saveprofile2[p].required_field_values.size)) {
                                $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].size = angular.copy($scope.saveprofile2[p].required_field_values.size);
                            }


                            if ($scope.saveprofile2[p].required_field_values.hasOwnProperty('color')) {

                                $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].color = $scope.saveprofile2[p].required_field_values.color;
                                // $scope.reset_size_list($scope.twotap_builtin_cart,$scope.userprofile2[q].required_field_values.color,-2);
                                var i = 0;
                                var num = -1;
                                if ($scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].required_field_values.hasOwnProperty('color')) {

                                    for (i = 0; i < $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color.length; i++) {

                                        if ($scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[i].value == $scope.saveprofile2[p].required_field_values.color) {
                                            // num = i;
                                            if ($scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[i].hasOwnProperty('dep')) {

                                                if ($scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[i].dep.hasOwnProperty('size')) {

                                                    $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].required_field_values.size = $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[i].dep.size;
                                                    $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].size = $scope.saveprofile2[p].required_field_values.size;
                                                    console.log("Ra Check");

                                                    break;
                                                }

                                            }
                                        }
                                    } //
                                }

                                //$scope.twotap_builtin_cart.affiliate_links[sikey] = $scope.userprofile2[q].twoTapAffiliateLink;
                            }


                            //

                            //  $scope.saving = $scope.saving + (($scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].orig_price - parseFloat($scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].price.substring(1), 10)) * ($scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].quantity));

                            temp_aff = $scope.saveprofile2[p].twoTapAffiliateLink;
                            $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].affiliate_links = temp_aff;

                            clean_url = $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].clean_url;

                            if ($scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].image == "") {
                                if ($scope.saveprofile2[p].product[0].image_url != "")
                                    $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].image = $scope.saveprofile2[p].product[0].image_url;
                                else if ($scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].alt_images.length > 0)
                                    $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].image = $scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].alt_images[0];


                            }

                            $scope.success_wish_sub_total = $scope.success_wish_sub_total + parseFloat($scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].price.substring(1), 10) * ($scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].quantity);

                        }


                    } // for loop end


                } // save profile loop


            }


            $scope.twotap_wishlist_cart.shipping = angular.copy($scope.shipping_address);
            $scope.twotap_wishlist_cart.billing = angular.copy($scope.billing_address);
            $scope.twotap_wishlist_cart.card = angular.copy($scope.card_details);

            $scope.firsttime.loading = 1;


            $scope.estimateFunctionTop($scope.twotap_wishlist_cart, -9, $scope.considered_items_wish);


        }, function (response) {
            $scope.initWishLoaddone = 1;
            $scope.firsttime.loading = 1;
        })


    }


    $scope.getmyLikeditem = function () {
        $http.post('/getMyfavourites').then(function (response) {
            $scope.favCataloglist = [];
            for (var i = 0; i < response.data.length; i++)
                $scope.favCataloglist.push(response.data[i].catalogId);

            $scope.mypost = $scope.mypost + $scope.favCataloglist.length;

        })

    };


    $scope.getmyRevieweditem = function () {

        $http.post('/getMyReviewed').then(function (response) {
            $scope.reviewCataloglist = [];
            for (var i = 0; i < response.data.length; i++)
                $scope.reviewCataloglist.push(response.data[i].catalogId);
            $scope.mypost = $scope.mypost + $scope.reviewCataloglist.length;

        })
    };

    $scope.getmyMaileditem = function () {

        $http.post('/getMyMailed').then(function (response) {

            $scope.mailCatalogList = [];


            for (var i = 0; i < response.data.length; i++)
                $scope.mailCatalogList.push(response.data[i].catalogId);


            $scope.mypost = $scope.mypost + $scope.mailCatalogList.length;

        })
    };
    $scope.sharedMail = "rv@sociallyshoppable.com; af@sociallyshoppable.com; anthonymflores@gmail.com; abir@aan-nahl.com; aan-rajib@aan-nahl.com";
    $scope.cleaning = function () {
        $scope.timeGap = 0;
        $scope.stopclickInterval();
        $scope.selected = "";
        $scope.searchforstring = "";
        $scope.metaxdescription = 'buy product through ecommerce';
        $scope.title = 'SS-Search';
        $scope.metax = 'buy product,ecommerce';


        $scope.proLoading = true;
        $scope.selected_key = "";
        $scope.new_keyword_arr = [];
        $scope.ms.checkAllShop = true;
        $scope.ms.checkAllCat = true;
        $scope.ms.checkAllDegnr = true;
        angular.element('main-search').scope().vm.checkAllShop = true;
        angular.element('main-search').scope().vm.checkAllCat = true;
        angular.element('main-search').scope().vm.checkAllDegnr = true;
        $scope.pro = {};
        $scope.catg = {};
        $scope.brdg = {};
        $scope.color_arr = [];
        $scope.prosearch = {};
        $scope.catlocal = {};
        $scope.brdglocal = {};
        $scope.temcol = {};
        $scope.cost = {
            range: [0.00, 1000000.00]
        };
        $scope.percent = {
            range: [0.00, 100.00]
        };
        $scope.currentpage = 1;
        $scope.extendedurl = "";
        $scope.selected_groupby = "";
        $scope.select_color = "";
        $scope.selected_merchantlist = [];
        $scope.select_merchant = "";
        $scope.selected_brandlist = [];
        $scope.select_brand = "";
        $scope.selected_categorylist = [];
        $scope.select_category = "";
        $scope.saleOffer = false;
        $scope.premiumMerchant = false;
        $scope.oc_casual = false;
        $scope.oc_work = false;
        $scope.oc_vacation = false;
        $scope.oc_other = false;
        $scope.selected_merchantlistByclick = [];
    }

});


////// main controller end
angular.module('UserAppMainContent', []).controller('signInMainContent', function ($scope) {
    $scope.mainContent = function () {
    }
})
UserApp.config(['$routeProvider', '$locationProvider',
        function ($routeProvider, $locationProvider) {
            $locationProvider.hashPrefix('!');
            // for making it searchable using google
            $routeProvider.when('/',
                {
                    templateUrl: 'partials/s_user/dashboard.html',
                    controller: 'homeController',
                    title: 'HOME',
                    metax: 'product, sociallyshoppable.com',
                    metaxdescription: 'sociallyshoppable'
                }).when('/search',
                {
                    templateUrl: 'partials/s_user/search_result.html',
                    title: 'Search Result',
                    metax: 'Search Result',
                    controller: 'searchapicontroller',
                    metaxdescription: 'Search Result'
                }).when('/search2',
                {
                    templateUrl: 'partials/s_user/search_result2.html',
                    title: 'Twotap Category Search Result ',
                    metax: 'Search Result',
                    controller: 'searchapicontroller',
                    metaxdescription: 'Search Result'
                })



                .when('/account',
                    {
                        templateUrl: 'partials/s_user/account.html',
                        controller: 'accountController',
                        title: 'Your Account',
                        metax: 'sociallyshoppable.com',
                        metaxdescription: 'sociallyshoppable '
                    }).when('/user/:userid',
                {
                    templateUrl: 'partials/s_user/accountSS.html',
                    controller: 'userController',
                    title: 'Profile',
                    metax: 'sociallyshoppable.com',
                    metaxdescription: 'sociallyshoppable '
                })


                .when('/all_store',
                    {
                        templateUrl: 'partials/s_user/all_store.html',
                        controller: 'customizeTopshopController',
                        title: 'Store list',
                        metax: 'sociallyshoppable.com',
                        metaxdescription: 'sociallyshoppable '
                    })
                .when('/blog',
                    {
                        templateUrl: 'partials/s_user/blog.html',
                        controller: 'blogController',
                        title: '',
                        metax: 'sociallyshoppable.com',
                        metaxdescription: 'sociallyshoppable '
                    })
                .when('/blogSignin/:sql',
                    {
                        templateUrl: 'partials/s_user/blog.html',
                        controller: 'blogSigninController',
                        title: '',
                        metax: 'sociallyshoppable.com',
                        metaxdescription: 'sociallyshoppable '
                    })
                .when('/company',
                    {
                        templateUrl: 'partials/s_user/company.html',
                        title: 'Socially Shoppable',
                        metax: 'sociallyshoppable.com',
                        metaxdescription: 'sociallyshoppable '
                    })
                //.when('/confirmation',
                // {
                //    templateUrl: 'partials/s_user/confirmation_of_purchase.html',
                //   controller: 'confirmController',
                //   title: 'confirmation',
                //  metax: 'sociallyshoppable.com',
                //   metaxdescription: 'confirmation purchase'
                //})
                .when('/confirmation_placed_view/:purchaseId/:user_id',
                    {
                        templateUrl: 'partials/s_user/confirmation_of_purchase_smart.html',
                        controller: 'confirmControllerView',
                        title: 'Purchase Confirmation',
                        metax: 'sociallyshoppable.com',
                        metaxdescription: 'confirmation purchase'
                    })
                .when('/customer_service',
                    {
                        templateUrl: 'partials/s_user/customer_service.html',
                        title: 'customer service',
                        metax: 'sociallyshoppable.com',
                        metaxdescription: 'sociallyshoppable '
                    })
                .when('/customizeshop',
                    {
                        templateUrl: 'partials/s_user/customize_shop.html',
                        controller: 'customizeTopshopController',
                        title: 'Manage Top 10 Shop',
                        metax: 'customize shop',
                        metaxdescription: 'Customize top 10 Shops'
                    })
                .when('/dashboard',
                    {
                        templateUrl: 'partials/s_user/dashboard.html',
                        controller: 'dashController',
                        title: 'Dashboard',
                        metax: 'dashboard, sociallyshoppable.com',
                        metaxdescription: 'sociallyshoppable dashboard',
                        path: 'DASHBOARD'
                    })
                .when('/social', /*this is search within api*/
                    {
                        templateUrl: 'partials/s_user/social.html',
                        controller: 'mailController',
                        title: 'Social',
                        metax: 'Social',
                        metaxdescription: 'Social box'
                    }).when('/mywall',
                {
                    templateUrl: 'partials/s_user/mywallfull.html',

                    title: 'My Wall',
                    metax: 'sociallyshoppable.com',
                    metaxdescription: 'sociallyshoppable '
                }).when('/like',
                {
                    templateUrl: 'partials/s_user/yourlikefull.html',
                    controller: 'collectiveController',
                    title: 'My Wall',
                    metax: 'sociallyshoppable.com',
                    metaxdescription: 'sociallyshoppable '
                })


                .when('/order_placed',
                    {
                        templateUrl: 'partials/s_user/confirmation_of_order.html',
                        controller: 'orderController',
                        title: 'Order Placed',
                        metax: 'order',
                        metaxdescription: 'Order Placed inside system'
                    }).when('/order_history',
                {
                    templateUrl: 'partials/s_user/order_history.html',
                    controller: 'orderhistorycontroller',
                    title: 'Order History',
                    metax: 'SS,Order',
                    metaxdescription: 'Order History'
                })
                .when('/order_placed_view/:purchaseId',                               // show specific product from api
                    {
                        templateUrl: 'partials/s_user/confirmation_of_order2.html',
                        controller: 'orderControllerView',
                        title: 'Purchase Confirmation',
                        metax: 'sociallyshoppable.com',
                        metaxdescription: 'Purchase Confirmation'
                    })
                .when('/mail', /*this is search within api*/
                    {
                        templateUrl: 'partials/s_user/notificationfull.html',
                        controller: 'mailController',
                        title: 'Mail',
                        metax: 'Mail',
                        metaxdescription: 'Mail box'
                    })


                .when('/SOC/:CatalogId/:producttitle',                               // show specific product from api
                    {
                        templateUrl: 'partials/s_user/single_product.html',
                        controller: 'APIcatalogCtrl',
                        title: 'Product Details'
                    })
                .when('/SOC2/:CatalogId/:producttitle',                               // show specific product from api
                    {
                        templateUrl: 'partials/s_user/single_product.html',
                        controller: 'APIcatalogCtrl',
                        title: 'CJ Product Details'
                    })
                .when('/collective', {
                    templateUrl: 'partials/s_user/collective.html',
                    controller: 'collectiveController',
                    title: 'Socially Shoppable Collective',
                    metax: 'Socially Shoppable, Stores, Merchants',
                    metaxdescription: 'View All Stores / Merchants / Retailer by Socially Shoppable'
                })
                .when('/scheckout',
                    {
                        templateUrl: 'partials/s_user/check_out.html',
                        controller: 'cartControllerCheckout',
                        title: 'Check Out',
                        metax: 'sociallyshoppable.com',
                        metaxdescription: 'sociallyshoppable Shoppingbag '
                    })
                .when('/shoppingbag',
                    {
                        templateUrl: 'partials/s_user/shopping_bag.html',
                        controller: 'cartController',
                        title: 'Shopping bag Socially Shoppable',
                        metax: 'sociallyshoppable.com',
                        metaxdescription: 'sociallyshoppable Shoppingbag '
                    })
                .when('/store',
                    {
                        templateUrl: 'partials/s_user/all_store.html',
                        controller: 'customizeTopshopController',
                        title: 'Socially Shoppable Store List',
                        metax: 'Socially Shoppable, Stores, Merchants',
                        metaxdescription: 'View All Stores / Merchants / Retailer by Socially Shoppable'
                    })
                .when('/storechosen/:merchant',
                    {
                        templateUrl: 'partials/s_user/store_chosen.html',
                        title: 'Search Store',
                        metax: 'Search Store',
                        controller: 'searchapicontroller',
                        metaxdescription: 'Search Result Store'
                    })
                .when('/policy',
                    {
                        templateUrl: 'partials/s_user/policy.html',
                        title: 'Policy',
                        metax: 'sociallyshoppable.com',
                        metaxdescription: 'sociallyshoppable '
                    })
                .otherwise({
                    templateUrl: 'partials/s_user/construction.html',
                    title: 'Socially Shoppable Under Construction',
                    metax: 'sociallyshoppable.com',
                    metaxdescription: 'sociallyshoppable '
                });
        }
    ]
);
///////////////////////////// RUN RUN RUN WHEN APP START //////////////////////////////////////////////
UserApp.run(['$location', '$rootScope', '$http', '$window', function ($location, $rootScope, $http, $window) {
    $rootScope.fbUser = {};
    $rootScope.shipping_address = {};
    $rootScope.billing_address = {};
    // for facebook user
    $rootScope.pathChangeBegin = false;
    $window.fbAsyncInit = function () {
        // Executed when the SDK is loaded
        FB.init({
            //appId: '***************',
            //appId: '1106111612741704',
            //appId: '528670563962413',
            appId: '328805820802009',
            //328805820802009

            channelUrl: 'partials/app/channel.html',
            status: true,
            cookie: true,
            xfbml: true,
            version: 'v2.5'
        });
        // sAuth.watchAuthenticationStatusChange();
        //watchLoginChange();
    };
    // watchLoginChange = function () {
    // var _self = this;
    // FB.Event.subscribe('auth.authResponseChange', function (res) {
    // if (res.status === 'connected') {
    // _self.getUserInfo();
    // var fbAccessToken = res.authResponse.accessToken;
    // $rootScope.fbAccessToken = fbAccessToken;
    // }
    // });
    // }// watchlogin change end
    // getUserInfo = function () {
    // var _self = this;
    // FB.api('/me', function (res) {
    // $rootScope.$apply(function () {
    // $rootScope.fbUser = _self.user = res;
    // // $rootScope.fbUserProfilePic = "https://graph.facebook.com/"+$rootScope.fbUser.id+"?fields=picture&access_token="+$rootScope.fbAccessToken+"&redirect=0";
    // $rootScope.passUserDetails = {
    // "id": $rootScope.fbUser.id,
    // "token": $rootScope.fbAccessToken
    // }
    // //ajax call to get image url
    // $http.post('/fb_profile_pic', $rootScope.passUserDetails)
    // .success(function (imgData) {
    // $rootScope.fbUserProfilePic = imgData.url;	// it is face book pic url
    // })
    // .error(function (err) {
    // // console.log("profile image " + err);
    // });
    // });
    // });
    // }

    $rootScope.$on('$routeChangeStart', function (event, next, current) {

        $rootScope.routechange = false;

    });

    // get userinfo end
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {  //Broadcasted after a route change has happened successfully.

        $rootScope.routechange = true;


        if (current.hasOwnProperty('$$route')) {
            $rootScope.title = current.$$route.title;
            $rootScope.metax = current.$$route.metax;
            $rootScope.SmartPathing = current.$$route.path;
        }
    });	// route change success end
    $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
        $rootScope.routechange = true;
    });
}]);
