 
	
	    // generate categories for database

    function generateCategories() {
        var merchantReuqestUrl = $http({
            method: 'GET',
            url: '/groupbyCategory'
        });
        merchantReuqestUrl.success(function (groupCategoriesResult) {
            $scope.categorylistByGroup = groupCategoriesResult;
        }).error(function (err) {
            console.log("Categories generate error: " + err)
        });
    }
	
    function generateMerchants() {
        var merchantReuqestUrl = $http({
            method: 'GET',
            url: '/groupbyMerchantid'
        });
        merchantReuqestUrl.success(function (groupMerchantsResult) {
            $scope.merchantlistByGroup = groupMerchantsResult;
        }).error(function (err) {
            console.log("merchant generate error: " + err)
        });
    }	
	
	
	  // generate brands from database $old
    function generateBrands() {
        var brandReuqestUrl = $http({
            method: 'GET',
            url: '/groupbyBrand'
        });
        brandReuqestUrl.success(function (groupBrandsResult) {
            $scope.brandlistByGroup = groupBrandsResult;
        }).error(function (err) {
            console.log("Brand generate error: " + err)
        });
    }

	    // $scope.searchingTop= function(){
    // $scope.bigCurrentPage = 1;
    // $scope.load_click=0;
    // $scope.viewall=0;
    // $scope.SearchVisible = false;
    // var newurl= generateurlforTop(1);
    // searchdatabaseTop();

    // }; //end of searching function


    // $scope.searchusingfilter =  function(){
    // var newurl= generateurl(1); // passing first oafe
    // //searchfilter(newurl);
    // searchdatabase();

    // }
	
	
	// $scope.setSubMenuCategory =function(cat,merchant)
    // {
    // $scope.queryobj.SScategory=cat;
    // $scope.select_dept=cat;

    // $scope.select_merchant = merchant;
    // $scope.queryobj.merchant= $scope.select_merchant;

    // $scope.pathing= "home > " +$scope.select_dept+" > "+$scope.select_merchant;
    // $scope.SmartPathing= $scope.select_dept+" > "+$scope.select_merchant;
    // $scope.viewall=0;
    // $scope.showup=0;
    // $scope.load_click=0;
    // $scope.bigCurrentPage =1;
    // $scope.queryobj.start = $scope.bigCurrentPage-1;
    // searchdatabaseTop();

    // }
	/*
 function MainCtrl($scope, Page) {
 $scope.Page = Page;
 }

 UserApp.factory('Page', function(){
 var title = 'default';
 return {
 title: function() { return title; },
 setTitle: function(newTitle) { title = newTitle; }
 };
 });
 */
 
 
     $scope.pageChanged = function () {

        var newurl = generateurl($scope.bigCurrentPage);
        // searchfilter(newurl);
        searchdatabase();
    }; //page change function end
	
	
 $scope.getcoupon = function (retailer, storedetails) {
        $scope.subscribe_store = storedetails;
        var indexstores = -1;
        if ($scope.loggedin == 0 || $scope.loggedin === undefined) {
            window.alert("logged in and subscribe to get coupon");
            $scope.after_login_location = '/shoppingbag';

            $("#login-popup").modal("show");


        }
        else {


            if (retailer == "AMI Clubwear")
                $scope.advertiser_ids = '3011689';
            else if (retailer == "Gap")
                $scope.advertiser_ids = '1610772';
            else if (retailer == "LOFT")
                $scope.advertiser_ids = '3818707';
            else if (retailer == "Pink Basis")
                $scope.advertiser_ids = '4268837';
            else if (retailer == "Backcountry")
                $scope.advertiser_ids = '260551';
            else if (retailer == "Kmart") {
                $scope.advertiser_ids = '2628179';

                //Albee Baby (4488778)
                //Ann Taylor (3818674)
                //Art.com (2729793)
            }
            else if (retailer == "Art.com")
                $scope.advertiser_ids = '2729793';
            else if (retailer == "1931704")
                $scope.advertiser_ids = '1931704';


            // return $location.path('/mail_notification_full');
            console.log(retailer);


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
	
	/*  ip address to country convert
    countriesx.list(function (countriesx) {    // countries is my service name
        $scope.userdetails = countriesx;  //saving all details of browser
        $scope.countriesx = angular.lowercase(countriesx.country);  //accessing json data
    }); */
	// getting country name from ip address
UserApp.factory('countriesx', function ($http) {
    return {
        list: function (callback) {
            $http.get("http://ipinfo.io").success(callback); // use api ipinfo.io to get country
        }
    }
});

//$scope.cj_website_id = '8087571';
$scope.cj_website_id = '7095303'; // rosio's site

    $scope.cj_authorization_key = '00d9fb63e7cc3b9d1ca158074cb36009be6ecbb1251c703b229c1ac0a9fb98e08e27b2c1d49706565113db02afe9e4a4026eb0d204eabf439030685ff0be419b1f/00941c5e0bb817a16f3ca9c57bf63d812165c2fd808bcc2e421bf38989762cb016658dcba660f5c7d3bafa383ec6bca7f947c19983570cfb8754683086ac75c701';
    //$scope.current_date = new Date();
   