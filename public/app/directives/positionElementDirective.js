var positionElementDirectiveModule = angular.module('positionElementDirectiveModule', []);

positionElementDirectiveModule.directive('centerElement', [function(){
  return {
    link: function(scope, element){
      element.parents('.popup-container').click(function () {
        if (screen.width > 767) {
          var elementHeight = element.outerHeight();
          element.attr('style', 'margin-top: ' + (-elementHeight / 2) + 'px');
        }
      });
    }
  };
}]);
