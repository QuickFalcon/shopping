var dashboardProductsComponentModule = angular.module('dashboardProductsComponentModule', ['ngSanitize', 'shopServiceModule', 'utilityFilterModule', 'slugifier']);

dashboardProductsComponentModule.component('dashboardProductsComponent', {
  templateUrl: 'app/components/dashboard/dashboardProductsView.html',
  bindings: {
    isLoggedIn: '<',
    userDashboardMerchant: '<'
  },
  controller: ['$scope', 'shopService', function($scope, shopService){

    var ctrl = this;
    ctrl.products = null;
    ctrl.PRODUCTSLIMITPERLOAD = 80;
    ctrl.loadDone = true;
    ctrl.query = {};
    ctrl.currentPage = 1;
    ctrl.sortOrder = 6; //initial sort order, 6 means most popular

    // build the query, variable naming convention according to the server
    ctrl.query.start = 0;
    ctrl.query.offset = ctrl.PRODUCTSLIMITPERLOAD; // limit
    ctrl.query.sortorder = ctrl.sortOrder;
    ctrl.query.available = true;
    ctrl.query.merchantList = null;

    ctrl.$postLink = function(){

    };

    ctrl.$onChanges = function(changesObj){

      // if the merchant is set, then get the products
      if(changesObj.userDashboardMerchant){
        ctrl.query.merchantList = ctrl.userDashboardMerchant;
        ctrl.getProducts(ctrl.query);
        ctrl.getProductsCount(ctrl.query);
      }
    };

    ctrl.getProducts = function(query){
      shopService.getProducts(query).then(function(data){
        ctrl.products = data.product;
        ctrl.loadDone = true;
      }, function(response){

      });
    };

    ctrl.getProductsCount = function(query){
      shopService.getProductsCount(query).then(function(data){
      }, function(response){

      });
    };

    ctrl.updateSorting = function(sort){
      ctrl.sortOrder = sort;
      //$scope.change_sorting = true;
      if (sort == 7) {
          ctrl.tooltipShow = true;
          return;
      }
      // for showing red heart
      sort == 0 ? ctrl.sFavorite = true : ctrl.sFavorite = false;
      ctrl.tooltipShow = false;
      ctrl.loadDone = false;
      // /$scope.bigCurrentPage = 1;
      ctrl.getProducts(ctrl.query);
      ctrl.getProductsCount(ctrl.query)
    };
  }]
});
