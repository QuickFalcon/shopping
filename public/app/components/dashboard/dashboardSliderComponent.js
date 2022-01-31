var dashboardSliderComponentModule = angular.module('dashboardSliderComponentModule', ['stageSliderComponentModule', 'thumbnailSliderComponentModule', 'userSidebarComponentModule', 'userServiceModule']);

dashboardSliderComponentModule.component('dashboardSliderComponent', {
  templateUrl: 'app/components/dashboard/dashboardSliderView.html',
  bindings: {
    isLoggedIn: '=',
    userInfo: '=',
    userDashboardMerchant: '<'
  },
  controller: ['$scope', 'userService', function($scope, userService){
    var ctrl = this;
    ctrl.sliderData = null;

    ctrl.$onChanges = function(changesObj){
      if(changesObj.userDashboardMerchant){
        ctrl.setSlider(ctrl.userDashboardMerchant);
      }
    };

    ctrl.$postLink = function(){

    };

    ctrl.setSlider = function(merchant){
      userService.getStoreSliderList(merchant).then(function(data){
        ctrl.sliderData = data;
      }, function(response){

      });
    };

  }]
});
