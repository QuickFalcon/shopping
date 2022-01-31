angular.module('SSApp').directive('headerLeftComponent', ['$timeout', function($timeout){
  return {
    restrict: 'E',
    templateUrl: '/assets/directive/components/header/headerLeftView.html',
    link: function(scope, element, attrs){
      $timeout(function () {
        $('.blogspot_slider').mouseenter(function () {
            $(this).parents('.header_left').addClass('extend')
        })
        $('.header_left').mouseleave(function () {
            $(this).removeClass('extend')
        });
}, 0,false);
    },
  };
}]);
