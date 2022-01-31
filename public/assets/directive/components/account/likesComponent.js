angular.module('SSApp').directive('likesComponent', ['$http', 'searchServiceCount', '$route', '$routeParams', '$location', '$cookies', '$interval', '$window', '$timeout', function($http, searchServiceCount, $route, $routeParams, $location, $cookies, $interval, $window, $timeout){
  return {
    restrict: 'E',
    templateUrl: 'assets/directive/components/account/likesView.html',
    link: function(scope, element, attrs){

      scope.$parent.ck_all = true;
      scope.similiaritems = [];
      scope.$parent.currentpage = 1;
      var smerchant;
      var catal;

      var temppath;
      var tempo;
      var pushtrue = true;
      var path = $location.path();
      var searchParams = {path: 'divine'};
      tempo = [];
      var url1;
      var url2;
      scope.$parent.proLoading = true;


      if (angular.isDefined($window.localStorage.getItem('recentI'))) {
          var tem = $window.localStorage.getItem('recentI');

          pota = JSON.parse(tem);
          scope.$parent.recentItemsx = pota;
      }

  	 scope.$parent.collectivepage=false;

     scope.seeCollectiveReview = function(user_id,url){
       scope.$parent.collectivepage=true;
		   scope.$parent.collectiveuserid=user_id;

  		 $location.path(url);
  		 $route.reload();
    	 };


    	scope.$parent.stopclickInterval();


      scope.$parent.og_image = 'http://104.236.166.98/images/logo.jpg';

      scope.$parent.products = [];
      scope.$parent.queryobj = {};
      scope.optionValue = 'all';


      scope.$parent.metaxdescription = 'SS-product-collective';
      scope.$parent.title = 'SS-Product-Collective';
      scope.$parent.metax = 'User Product,buy,cheap';

      url2 = '#!/collective';
      temppath = {'poth': url2, 'label': 'COLLECTIVE'};
      tempo.push(temppath);

      scope.$parent.og_image = 'http://104.236.166.98/images/logo.jpg';


      scope.$parent.pathTorch = tempo;
      var arr = [];
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
      scope.$parent.selected = "";
      var keyStringArr;
      var lowercaseSelectedKeyWord;
      var temcol;
      var searchkeyword = "";

      scope.set_current_product = function (pro) {
          scope.$parent.current_product = pro;
          scope.$parent.set_product_scope(pro);
      };

      scope.$parent.metaxdescription = 'buy product through ecommerce ';
      scope.$parent.title = 'SS-Search-Collective';
      scope.$parent.metax = 'Collective,SS,buy product,ecommerce';

      // ----------- Search Fucntion Within The page Not globar search ------

      function generateRelatedSearch() {
        if (angular.isDefined(scope.searchtermarr) && scope.searchtermarr.length > 0) {
          var keywordx = angular.lowercase(scope.collective_keyword);

          var tempmix;
          var tota;
          var keywordarr = keywordx.split(" ");
          var found = false;

          for (var mx = 0; mx < scope.searchtermarr.length; mx++) {
            found = false;
            tempmix = angular.lowercase(scope.searchtermarr[mx]);

            for (var k = 0; k < keywordarr.length; k++) {
              keyword = keywordarr[k];
              if (tempmix.indexOf(keyword) > -1) {
                  scope.$parent.related_popularsearch.push(tempmix);
                  found = true;
                  break;
              }
              if (scope.related_popularsearch.length >= 6)
                  break;
            }
          } // mixpanel loop
        } // mixpanel arr item exist or not
      }


      scope.actionCollective = function () {

        scope.cproducts = [];
        scope.$parent.queryobj = {};
        scope.$parent.queryobj.collective = scope.optionValue;

        scope.$parent.related_popularsearch = [];
        scope.$parent.queryobj.collective = angular.copy(scope.optionValue);


        if (scope.optionValue == 'all') {

          scope.$parent.queryobj.sortorder = 6; // popular
        } else if (scope.optionValue == 'mostrated') {  // high rating

          scope.$parent.queryobj.sortorder = 4;
        } else if (scope.optionValue == 'mostreviewed') { // most people put review

          scope.$parent.queryobj.sortorder = 10;
        } else if (scope.optionValue == 'mostshared') { //share count

          scope.$parent.queryobj.sortorder = 5;
        } else if (scope.optionValue == 'topten') { //share count
          if (scope.userstoptenDashboard.length > 0) {

            scope.$parent.queryobj.merchantList = angular.copy(scope.userstoptenDashboard);
            scope.$parent.queryobj.sortorder = 6; // popular
          }
        }
        else if (scope.optionValue == 'myfav') { //share count

            scope.$parent.queryobj.multiId = angular.copy(scope.favCataloglist);
            scope.$parent.queryobj.sortorder = 0;
        }
        else if (scope.optionValue == 'myreview') { //share count

            scope.$parent.queryobj.multiId = angular.copy(scope.reviewCataloglist);
            scope.$parent.queryobj.sortorder = 4;
        } else if (scope.optionValue == 'hashtag') {

            var arr = [];
            scope.$parent.loaddone = false;
            scope.$parent.totalRecordsFound = 0;

            scope.$parent.numPages = 0;
            $http.post('/getHashtag', {keyword: scope.collective_keyword}).then(function (response) {

              scope.hashCataloglist = [];
              if (response.data.length < 1) {

                  scope.$parent.loaddone = true;
                  scope.similiaritems = [];
              }
                for (var i = 0; i < response.data.length; i++) {
                  arr.push(response.data[i].catalogId);


                  if (i + 1 == response.data.length) {
                    console.log(arr);
                    $http.post('/productUserMulticatalogID', {mid: arr}).then(function(result) {

                      console.log(result);
                      scope.cproducts = result.data.product;
                      scope.similiaritems = angular.copy(result.data.product);
                      scope.$parent.loaddone = true;
                      scope.$parent.totalRecordsFound = result.data.product.length;
                      scope.$parent.numPages = Math.ceil((scope.totalRecordsFound) / (scope.user_offset));

                      }, function(err){

                      scope.$parent.loaddone = true;
                      scope.similiaritems = [];

                      console.log(" getMiniCartItems Error: " + err);
                      });
                  }
                }


            }, function (response) {

                scope.$parent.loaddone = true;
                scope.$parent.totalRecordsFound = 0;
                scope.similiaritems = [];

                scope.$parent.numPages == 0;
                console.log(" getMiniCartItems Error: " + err);
            });
        }

        scope.color_arr = [];

        if (angular.isDefined(scope.collective_keyword)) {
          if (scope.collective_keyword.trim() != '') {

            generateRelatedSearch();

            scope.$parent.metaxdescription = 'buy product through ecommerce ' + scope.collective_keyword;
            scope.$parent.title = 'SS-Search-Collective ' + scope.collective_keyword;
            scope.$parent.metax = '';
            SSmixPanel.lookingFor(scope.collective_keyword);

            lowercaseSelectedKeyWord = angular.lowercase(scope.collective_keyword);

            keyStringArr = lowercaseSelectedKeyWord.split(" ");
            var tempCoData;


            for (var ind = 0; ind < keyStringArr.length; ind++) {
              tempcol = keyStringArr[ind];

              if (ind == 0)
                  scope.$parent.metax = tempcol;
              else
                  scope.$parent.metax = ',' + tempcol;

              if (scope.color_array.indexOf(tempcol) > -1) {

                  tempCoData = keyStringArr[ind];
                  scope.color_arr.push(tempCoData);
                  keyStringArr.splice(ind, 1);
              }

              if ((ind + 1) == keyStringArr.length) {
                for (var yu = 0; yu < 1000; yu++) {
                  if (yu == 999) {
                    if (scope.color_arr.length > 0) {
                      for (var keystr = 0; keystr < keyStringArr.length; keystr++) {
                        if (keystr == 0) {
                            searchkeyword = keyStringArr[keystr];
                        } else {
                            searchkeyword = searchkeyword + " " + keyStringArr[keystr];
                        }
                        if ((keystr + 1) == keyStringArr.length) {
                            scope.$parent.queryobj.keyword = angular.copy(searchkeyword);
                            scope.$parent.queryobj.color = angular.copy(scope.color_arr);
                            if (scope.optionValue != 'hashtag')
                                searchcollectivedatabase();
                        }
                      }
                    } else {
                        scope.$parent.queryobj.keyword = angular.copy(scope.collective_keyword);
                        if (scope.optionValue != 'hashtag')
                          searchcollectivedatabase();
                    }
                  }
                }
              }
            }
          } else {
              if (scope.optionValue != 'hashtag')
                  searchcollectivedatabase();
          }
        } else {
            if (scope.optionValue != 'hashtag')
                searchcollectivedatabase();
        }
      };

        // changing merchant
        var cloadMoreReset = function () {
            if (scope.activePage != 1) {
                scope.$parent.matchTarget = 1;
                scope.$parent.activePage = 1;
                scope.$parent.currentpage = 1;
                scope.$parent.maxIndex = scope.limit;
                scope.$parent.bigCurrentPage = 1;
            }
        };

        var $productsGrid;

        function searchcollectivedatabase() {

          scope.queryobj.offset = scope.user_offset;
      		scope.queryobj.available = true;
      		scope.$parent.viewall = 0;

          scope.$parent.queryobj.start = 0;

          scope.$parent.load_click = 0;
          scope.$parent.viewall = 0;
          scope.$parent.showup = 0;

          scope.$parent.queryobj.start = 0;
          scope.$parent.queryobj.offset = scope.user_offset;

          scope.cproducts = [];
          scope.homeloaded = 1;

          scope.$parent.queryobj.available = true;
          cloadMoreReset();
          scope.$parent.homeloaded = 1;


          scope.$parent.loaddone = false;
          scope.$parent.totalRecordsFound = 0;
    	    scope.$parent.numPages = 0;

            $http.post('/productResult', scope.queryobj).success(function (data) {

              var data_count;
              scope.cproducts = data.product;
              scope.similiaritems = angular.copy(data.product);
              scope.$parent.loaddone = true;

              $http.post('/productResultCount', scope.queryobj).success(function (data) {

                scope.$parent.totalRecordsFound = data.count;
                scope.$parent.numPages = Math.ceil((scope.totalRecordsFound) / (scope.user_offset));

              }).error(function (cerr) {
                console.log("count error: " + cerr);
                });

            }).error(function (err) {
                console.log("Search Productlist error : " + err);
                scope.$parent.viewall = 1;
                scope.$parent.totalRecordsAvailable = 0;
                scope.$parent.loaddone = true;
            });


        }

        function searchcollectiveLoadMore() {
          var concat_str;
          scope.$parent.loaddone = false;

            $http.post('/productResult', scope.queryobj).success(function (data) {

              var data_count;
              data_count = Object.keys(data.product).length;

              if (data_count > 0) {

                concat_str = scope.cproducts;
                scope.cproducts = concat_str.concat(data.product);  // concat data with old data
                if (data_count < scope.user_offset)  // returned data smaller than data offset
                {                                    // means there are no more data  available
                    scope.$parent.viewall = 1; //as there is nothing to show that means everything has been shown
                }
              }else {
                scope.$parent.viewall = 1; //as there is nothing to show that means everything has been shown
              }

              scope.$parent.loaddone = true;

                }).error(function (err) {
                  scope.$parent.viewall = 1;
                  scope.$parent.loaddone = true;
            });
        }


        scope.cloadMore = function ($event, pageNo) {

          var group = "";
          var lurl;
          var gothere = '#targetNo' + pageNo;
          var gotherePrev = '#targetNo' + (pageNo - 1);

          scope.$parent.activePage = pageNo;
          scope.$parent.maxIndex = scope.activePage * scope.limit;

            // Going on position which is already loaded
          if ($('#targetNo' + (scope.activePage)).length && $(gothere).length) {
              //console.log('got there without load')
              $('html, body').animate({scrollTop: $(gothere).offset().top}, 700);
          }

          scope.$parent.currentpage = pageNo;
          scope.$parent.bigCurrentPage = pageNo;
          scope.$parent.queryobj.start = scope.bigCurrentPage - 1;
          searchcollectiveLoadMore();
            // After loading one page Next page will start loaded

            // Going on position after loading
          $timeout(function () {
            if (pageNo == scope.currentpage && scope.loaddone && pageNo > 1) {
                if ($(gothere).length) {
                    $('html, body').animate({scrollTop: $(gothere).offset().top}, 700);
                } else {
                    $('html, body').animate({scrollTop: $(gotherePrev).offset().top}, 700);
                }
              }
            }, 500);
          };
          
        scope.setPage = function (pageNo) {
          scope.currentPage = pageNo;
        };

        scope.$parent.loadfull = true;
        scope.$parent.firsttime.loading = 1;


        if($location.path()=='/like'){

      		console.log("I am like page");
      		scope.optionValue == 'myfav';
    	  }

        scope.actionCollective();
    },
  };
}]);
