'use strict';

(function() {
  angular.module('SSApp').directive('mainSearch', MainSearch);

  MainSearch.$inject = ['$route','$location'];

  function MainSearch($route,$location) {
    return {
      restrict: 'E',
      templateUrl: '/partials/search/mainSearch.html',
      controllerAs: 'vm',

      link: function(scope) {
        var vm = scope.vm = {
          activeTab: 1,
          prevTab: 0,
          tabs: ['shop', 'category', 'designer'],
          checkAll: [],
          checkAllShop: true,
          checkAllCat: true,
          checkAllDegnr:true
        };

        vm.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

        vm.changeTab = function (tab) {
          vm.prevTab = vm.activeTab;
          vm.activeTab = tab;
          var pt=$location.path();
         


        };
  

        vm.emptyselecteditem = function(type, val) {
          switch (type) {
            case 'shop':
              scope.selected_merchantlistByclick = [];
              scope.pro = {};
              vm.checkAllShop = val;
             // scope.generateAllMerchants();
      			  scope.retailerList = angular.copy(scope.initialRetailerList);
      			  scope.totalMerchants = angular.copy(scope.fullMerchantListCount);
              break;
            case 'brand':
              scope.selected_brandlist = [];
              scope.brdg = {};
              vm.checkAllDegnr = val;
              scope.brand_start = 0;
			         scope.showstatic = true;
			  
               /*
			   
			   scope.brandList = angular.copy(scope.initialBrandList);


              scope.brandListAlphabet.A = angular.copy(scope.brandListAlphabetInit.A);
              scope.brandListAlphabet.B = angular.copy(scope.brandListAlphabetInit.B);
              scope.brandListAlphabet.C = angular.copy(scope.brandListAlphabetInit.C);
              scope.brandListAlphabet.D = angular.copy(scope.brandListAlphabetInit.D);
              scope.brandListAlphabet.E = angular.copy(scope.brandListAlphabetInit.E);
              scope.brandListAlphabet.F = angular.copy(scope.brandListAlphabetInit.F);
              scope.brandListAlphabet.G = angular.copy(scope.brandListAlphabetInit.G);
              scope.brandListAlphabet.H = angular.copy(scope.brandListAlphabetInit.H);
              scope.brandListAlphabet.I = angular.copy(scope.brandListAlphabetInit.I);
              scope.brandListAlphabet.J = angular.copy(scope.brandListAlphabetInit.J);
              scope.brandListAlphabet.K = angular.copy(scope.brandListAlphabetInit.K);
              scope.brandListAlphabet.L = angular.copy(scope.brandListAlphabetInit.L);
              scope.brandListAlphabet.M = angular.copy(scope.brandListAlphabetInit.M);
              scope.brandListAlphabet.N = angular.copy(scope.brandListAlphabetInit.N);
              scope.brandListAlphabet.O = angular.copy(scope.brandListAlphabetInit.O);
              scope.brandListAlphabet.P = angular.copy(scope.brandListAlphabetInit.P);
              scope.brandListAlphabet.Q = angular.copy(scope.brandListAlphabetInit.Q);
              scope.brandListAlphabet.R = angular.copy(scope.brandListAlphabetInit.R);
              scope.brandListAlphabet.S = angular.copy(scope.brandListAlphabetInit.S);
              scope.brandListAlphabet.T = angular.copy(scope.brandListAlphabetInit.T);
              scope.brandListAlphabet.U = angular.copy(scope.brandListAlphabetInit.U);
              scope.brandListAlphabet.V = angular.copy(scope.brandListAlphabetInit.V);
              scope.brandListAlphabet.W = angular.copy(scope.brandListAlphabetInit.W);
              scope.brandListAlphabet.X = angular.copy(scope.brandListAlphabetInit.X);
              scope.brandListAlphabet.Y = angular.copy(scope.brandListAlphabetInit.Y);
              scope.brandListAlphabet.Z = angular.copy(scope.brandListAlphabetInit.Z);
              scope.brandListAlphabet.OTHER = angular.copy(scope.brandListAlphabetInit.OTHER);

             scope.$apply();
             


              scope.totalBrands = angular.copy(scope.fullBrandListCount);
              */
			  
			 // scope.$apply();
			  scope.totalBrands = 1000;
			  
			  break;
            case 'category':
              scope.selected_categorylist = [];
              scope.catg = {};
              vm.checkAllCat = val;

          }
        };

        vm.searchEng = function ($event) {
          $event.stopPropagation();
          //vm.showsearch = true;
          if(vm.activeTab == vm.prevTab){
            vm.showsearch = false;
            vm.prevTab = 0;
          }else{
            vm.showsearch = true;
          };
          var pt=$location.path();




          if(vm.activeTab==4) {

		  
		  

            angular.element("#brandallR").on('scroll', function(evt){


              var scrollObjDiv = document.getElementById("brandallR");




              var shouldScroll = scrollObjDiv.scrollTop + scrollObjDiv.clientHeight === scrollObjDiv.scrollHeight;

                  if((scrollObjDiv.scrollTop + scrollObjDiv.clientHeight) >= (scrollObjDiv.scrollHeight -100) ){


                   if(!scope.brandGroupShow.C ){

                     scope.brandGroupShow.C = true;

                     scope.$apply();


                   }  else if(!scope.brandGroupShow.D ){


                      scope.brandGroupShow.D = true;
                      scope.$apply();
                    }



                   else if(!scope.brandGroupShow.E) {

                     scope.brandGroupShow.E = true;

                     scope.$apply();



                   }  else if(!scope.brandGroupShow.F) {


                     scope.brandGroupShow.F = true;
                     scope.$apply();



                   } else if(!scope.brandGroupShow.G) {

                     scope.brandGroupShow.G = true;
                     scope.$apply();



                   } else if(!scope.brandGroupShow.H) {

                     scope.brandGroupShow.H = true;
                     scope.$apply();



                   } else if(!scope.brandGroupShow.I) {

                     scope.brandGroupShow.I = true;

                     scope.$apply();



                   } else if(!scope.brandGroupShow.J) {

                     scope.brandGroupShow.J = true;
                     scope.$apply();
                   }
                   else if(!scope.brandGroupShow.K) {

                     scope.brandGroupShow.K = true;

                     scope.$apply();



                   }  else if(!scope.brandGroupShow.L) {

                     scope.brandGroupShow.L = true;

                     scope.$apply();



                   }  else if(!scope.brandGroupShow.M) {

                     scope.brandGroupShow.M = true;

                     scope.$apply();



                   } else if(!scope.brandGroupShow.N) {

                     scope.brandGroupShow.N = true;

                     scope.$apply();



                   }
                   else if(!scope.brandGroupShow.O ) {

                     scope.brandGroupShow.O = true;

                     scope.$apply();



                   } else if(!scope.brandGroupShow.P) {

                     scope.brandGroupShow.P = true;

                     scope.$apply();



                   } else if(!scope.brandGroupShow.Q) {

                     scope.brandGroupShow.Q = true;

                     scope.$apply();
                   } else if(!scope.brandGroupShow.R) {

                     scope.brandGroupShow.R = true;
                     scope.$apply();
                   } else if(!scope.brandGroupShow.S) {

                     scope.brandGroupShow.S = true;
                     scope.$apply();
                   }  else if(!scope.brandGroupShow.T) {

                     scope.brandGroupShow.T = true;
                     scope.$apply();
                   } else if(!scope.brandGroupShow.U) {

                     scope.brandGroupShow.U = true;
                     scope.$apply();
                   } else if(!scope.brandGroupShow.V) {

                     scope.brandGroupShow.V = true;
                     scope.$apply();
                   }  else if(!scope.brandGroupShow.W) {

                     scope.brandGroupShow.W = true;
                     scope.$apply();
                   }  else if(!scope.brandGroupShow.X) {

                     scope.brandGroupShow.X = true;
                     scope.$apply();
                   }
                   else if(!scope.brandGroupShow.Y) {

                     scope.brandGroupShow.Y= true;
                     scope.$apply();
                   }  else if(!scope.brandGroupShow.Z) {

                     scope.brandGroupShow.Z = true;
                     scope.$apply();
                   }


              }


            });




            if(pt.indexOf('/search')>-1 || pt.indexOf('storechosen')>-1) {



               if(!scope.showstatic && !scope.already_showed_all_brand ){



                scope.showallbrandFromSearch();
              }
            }
            else if(!scope.showstatic) {
              scope.showstatic = true;
                scope.brand_start = 0;
                scope.totalBrands = 1000;

                scope.brandList =  angular.copy(scope.initialBrandList);

              return;
            }



          } else if(vm.activeTab==2) {

              if(pt.indexOf('/search')>-1) {


                if(!scope.already_showed_all_merchant){

                  scope.retailerList = angular.copy(scope.initialRetailerList);
                  scope.showallmerchantFromSearch();
                }
              }
              else if(scope.fullMerchantListCount!=scope.totalMerchants) {


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
        vm.GetAllSelected = function (x, obj, selectedArray, group) {

          if (group === 'merchant') {
            scope.merchantSetfromSearchBoxString = false;
            scope.selectMerchantSearchboxFromInside=true;
            vm.checkAllShop = false;
            /*
            if(scope.fullMerchantListCount!=scope.totalMerchants)
            scope.generateAllMerchants(); */

          } else if (group === 'brand') {
            scope.brandSetfromSearchBoxString = false;
            scope.selectBrandSearchboxFromInside=true;
            vm.checkAllDegnr = false;
            /*
           if(!scope.showstatic && !scope.already_showed_all_brand )
            scope.generateAllBrands();
              */
            x = decodeURIComponent(x);

          } else if (group === 'category') {
            scope.categorySetfromSearchBoxString = false;
            scope.selectCategorySearchboxFromInside=true;
            vm.checkAllCat = false;

          }


          var index = selectedArray.indexOf(x);
          if (obj && index < 0) {
            selectedArray.push(x);
          } else {
            selectedArray.splice(index, 1);
          }
        };

      }
    };
  }
}());
