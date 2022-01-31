var mainSearchComponentModule = angular.module('mainSearchComponentModule', ['ngRoute']);

mainSearchComponentModule.component('mainSearchComponent', {
  restrict: 'E',
  templateUrl: 'app/components/search/mainSearchView.html',
  bindings: {
    checkAllShop: '=',
    checkAllCategory: '=',
    checkAllDesigner: '='
  },
  controller: ['$scope', '$element', '$attrs', '$route', '$location', function(scope, element, attrs, route, location){
    var ctrl = this;

    ctrl.activeTab = 1;
    ctrl.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    ctrl.changeTab = function (tab) {
      ctrl.activeTab = tab;
      var path = $location.path();
    };

    ctrl.emptySelectedItem = function(type, bool) {
      switch (type) {
        case 'shop':
          scope.selected_merchantlistByclick = [];
          scope.pro = {};
          vm.checkAllShop = bool;
          scope.retailerList = angular.copy(scope.initialRetailerList);
          scope.totalMerchants = angular.copy(scope.fullMerchantListCount);
          break;

        case 'brand':
          scope.selected_brandlist = [];
          scope.brdg = {};
          vm.checkAllDegnr = bool;
          scope.brand_start = 0;
          scope.showstatic = true;
          scope.totalBrands = 1000;
          break;

        case 'category':
          scope.selected_categorylist = [];
          scope.catg = {};
          vm.checkAllCat = bool;

      }
    };

  }]
});
