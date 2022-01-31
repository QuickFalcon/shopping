var thumbnailSliderComponentModule = angular.module('thumbnailSliderComponentModule', ['sliderDirectiveModule']);

thumbnailSliderComponentModule.component('thumbnailSliderComponent', {
  templateUrl: 'app/components/slider/thumbnailSliderView.html',
  bindings: {
    sliderData: '<'
  },
  controller: ['$scope', function($scope){

    var ctrl = this;


    ctrl.$postLink = function(){
    };

    ctrl.$onChanges = function(changesObj){
      if(changesObj.sliderData){
        //console.log(ctrl.sliderData);
      }
    };
  }]
});
