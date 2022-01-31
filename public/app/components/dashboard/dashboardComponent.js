var dashboardComponentModule = angular.module('dashboardComponentModule', ['utilityFilterModule', 'dashboardSliderComponentModule', 'dashboardProductsComponentModule']);

dashboardComponentModule.component('dashboardComponent', {

  templateUrl: 'app/components/dashboard/dashboardView.html',
  bindings: {
    isLoggedIn: '=',
    userInfo: '=',
    loadFull: '=', // var for loading
    userDashboardMerchant: '<'
  },
  controller: ['$scope', function($scope){

    var ctrl = this;

    ctrl.$postLink = function(){
    };
  }]
});
