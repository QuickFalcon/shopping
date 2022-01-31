var sliderDirectiveModule = angular.module('sliderDirectiveModule', []);

sliderDirectiveModule.directive('blogSlider', ['$timeout', function($timeout){
  return {
    restrict: 'A',
    scope: {
      blogs: '='
    },
    link: function(scope, element, attrs, controller, transcludeFn){
      scope.$watch('blogs', function () {
          if (scope.blogs.length) {
              $timeout(function () {
                  element.flexslider({
                      selector: '.blogSlides >li',
                      animation: 'slide',
                      controlNav: false,
                      directionNav: false,
                      slideshow: true,
                      slideshowSpeed: 3000,
                      useCSS: false
                  });
              }, 600);
          }
      });
    }
  };
}]);

sliderDirectiveModule.directive('stageSlider', [function(){
  return {
      restrict: 'A',
      scope: {
        sliderList: '=',
      },
      link: function (scope, element) {
        scope.$watch('sliderList', function(){
          if(scope.sliderList){
            element.flexslider({
              animation: 'slide',
              controlNav: false,
              animationLoop: false,
              slideshow: false,
              start: function(slider){
                element.removeClass('sliderLoading');
              }
            });
          }
        });
    }
  };
}]);

sliderDirectiveModule.directive('thumbnailSlider', [function(){
  return {
    restrict: 'A',
    scope: {
      sliderList: '<'
    },
    link: function(scope, element){
      scope.$watch('sliderList', function(){
        if(scope.sliderList){
          element.flexslider({
            asNavFor: '#carouselStage',
            animation: 'slide',
            itemWidth: 210,
            itemMargin: 5,
            controlNav: false,
            animationLoop: false,
            slideshow: false,
            minItems: 3,
            maxItems: 4
          });
        }
      });
    }
  }
}]);
