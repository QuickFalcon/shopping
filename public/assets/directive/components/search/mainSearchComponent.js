angular.module("SSApp").directive("mainSearch", ["$route","$location","$timeout",function($route, $location, $timeout) {
    return {
      restrict: "E",
      templateUrl: "assets/directive/components/search/mainSearchView.html",
      controllerAs: "vm",
      link: function (scope) {
        var vm = (scope.vm = {
          activeTab: 1,
          prevTab: 0,
          tabs: ["shop", "category", "designer"],
          checkAll: [],
          checkAllShop: true,
          checkAllCat: true,
          checkAllDegnr: true
        });
        vm.isSearchTypeAheadOpen = false;
        vm.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        vm.changeTab = function($event, tab) {
          // console.log($event);
          $event.stopPropagation();
          vm.prevTab = vm.activeTab;
          vm.activeTab = tab;
          var pt = $location.path();
          console.log('vm.changeTab', 'vm.activeTab: ' + vm.activeTab, 'vm.prevTab: ' + vm.prevTab);
        };
        vm.emptyselecteditem = function($event, type, val) {
          $event.stopPropagation();
          switch (type) {
            case "shop":
              scope.selected_merchantlistByclick = [];
              scope.pro = {};
              vm.checkAllShop = val;
              // scope.generateAllMerchants();
              scope.retailerList = angular.copy(scope.initialRetailerList);
              scope.totalMerchants = angular.copy(scope.fullMerchantListCount);
              break;
            case "brand":
              scope.selected_brandlist = [];
              scope.brdg = {};
              vm.checkAllDegnr = val;
              scope.brand_start = 0;
              scope.showstatic = true;
              scope.totalBrands = 1000;
              break;
            case "category":
              scope.selected_categorylist = [];
              scope.catg = {};
              vm.checkAllCat = val;
          }
        };
        vm.searchEng = function($event) {
          console.log('vm.searchEng');
          // Allow the event to propagate down to the body element if the suggested search dropdown is open
          if (!vm.isSearchTypeAheadOpen) {
            $event.stopPropagation();
          }
          //vm.showsearch = true;
          // if(vm.activeTab == vm.prevTab){
            // vm.showsearch = false;
            // vm.prevTab = 0;
          // }else{
            // vm.showsearch = true;
          // }
          if (!vm.showsearch) {
              vm.showsearch = true;
          }
          var pt = $location.path();
          if (vm.activeTab == 4) {
            angular.element("#brandallR").on("scroll", function(evt) {
              var scrollObjDiv = document.getElementById("brandallR");
              var shouldScroll = scrollObjDiv.scrollTop + scrollObjDiv.clientHeight === scrollObjDiv.scrollHeight;
              if (scrollObjDiv.scrollTop + scrollObjDiv.clientHeight >= scrollObjDiv.scrollHeight - 100) {
                if (!scope.brandGroupShow.C) 
                    scope.brandGroupShow.C = true;
                else if (!scope.brandGroupShow.D)
                    scope.brandGroupShow.D = true;
                else if (!scope.brandGroupShow.E)
                    scope.brandGroupShow.E = true;
                else if (!scope.brandGroupShow.F)
                    scope.brandGroupShow.F = true;
                else if (!scope.brandGroupShow.G)
                    scope.brandGroupShow.G = true;
                else if (!scope.brandGroupShow.H)
                    scope.brandGroupShow.H = true;
                else if (!scope.brandGroupShow.I)
                    scope.brandGroupShow.I = true;
                else if (!scope.brandGroupShow.J)
                    scope.brandGroupShow.J = true;
                else if (!scope.brandGroupShow.K)
                    scope.brandGroupShow.K = true;
                else if (!scope.brandGroupShow.L)
                    scope.brandGroupShow.L = true;
                else if (!scope.brandGroupShow.M)
                    scope.brandGroupShow.M = true;
                else if (!scope.brandGroupShow.N)
                    scope.brandGroupShow.N = true;
                else if (!scope.brandGroupShow.O)
                    scope.brandGroupShow.O = true;
                else if (!scope.brandGroupShow.P)
                    scope.brandGroupShow.P = true;
                else if (!scope.brandGroupShow.Q)
                    scope.brandGroupShow.Q = true;
                else if (!scope.brandGroupShow.R)
                    scope.brandGroupShow.R = true;
                else if (!scope.brandGroupShow.S)
                    scope.brandGroupShow.S = true;
                else if (!scope.brandGroupShow.T)
                    scope.brandGroupShow.T = true;
                else if (!scope.brandGroupShow.U)
                    scope.brandGroupShow.U = true;
                else if (!scope.brandGroupShow.V)
                    scope.brandGroupShow.V = true;
                else if (!scope.brandGroupShow.W)
                    scope.brandGroupShow.W = true;
                else if (!scope.brandGroupShow.X)
                    scope.brandGroupShow.X = true;
                else if (!scope.brandGroupShow.Y)
                    scope.brandGroupShow.Y = true;
                else if (!scope.brandGroupShow.Z)
                    scope.brandGroupShow.Z = true;
                scope.$apply();
              }
            });
            if (pt.indexOf("/search") > -1 || pt.indexOf("storechosen") > -1) {
              if (!scope.showstatic && !scope.already_showed_all_brand) {
                scope.showallbrandFromSearch();
              }
            }else if (!scope.showstatic) {
              scope.showstatic = true;
              scope.brand_start = 0;
              scope.totalBrands = 1000;
              scope.brandList = angular.copy(scope.initialBrandList);
              return;
            }
          } else if (vm.activeTab == 2) {
            if (pt.indexOf("/search") > -1) {
              if (!scope.already_showed_all_merchant) {
                scope.retailerList = angular.copy(scope.initialRetailerList);
                scope.showallmerchantFromSearch();
              }
            } else if (scope.fullMerchantListCount != scope.totalMerchants) {
              scope.retailerList = angular.copy(scope.initialRetailerList);
              scope.totalMerchants = angular.copy(scope.fullMerchantListCount);
            }
          }
        };
        vm.cancelSearch = function($event) {
          $event.stopPropagation();
          vm.showsearch = false;
        };
        /**
         * Get all selected
         * @param x
         * @param obj
         * @param selectedArray
         * @constructor
         */
        vm.GetAllSelected = function(x, obj, selectedArray, group) {
          if (group === "merchant") {
            scope.merchantSetfromSearchBoxString = false;
            scope.selectMerchantSearchboxFromInside = true;
            vm.checkAllShop = false;
          } else if (group === "brand") {
            scope.brandSetfromSearchBoxString = false;
            scope.selectBrandSearchboxFromInside = true;
            vm.checkAllDegnr = false;
            x = decodeURIComponent(x);
          } else if (group === "category") {
            scope.categorySetfromSearchBoxString = false;
            scope.selectCategorySearchboxFromInside = true;
            vm.checkAllCat = false;
          }
          var index = selectedArray.indexOf(x);
          if (obj && index < 0) {
            selectedArray.push(x);
          } else {
            selectedArray.splice(index, 1);
          }
        };
        $timeout(function(){
            $('ul.s_category_list li').on('mouseenter', function(){
                    $(this).css("color", "#c71617");
                }).on('mouseleave', function(){
                    $(this).removeAttr("style")
            });
        },0,false);
      }
    };
  }
]);
