var stageSliderComponentModule = angular.module('stageSliderComponentModule', ['shopServiceModule', 'sliderDirectiveModule']);

stageSliderComponentModule.component('stageSliderComponent', {
  templateUrl: 'app/components/slider/stageSliderView.html',
  bindings: {
    isLoggedIn: '=',
    userInfo: '=',
    sliderData: '<'
  },
  controller: ['$scope', 'shopService', function($scope, shopService){

    var ctrl = this;

    ctrl.$postLink = function(){

    };
  }]
})
