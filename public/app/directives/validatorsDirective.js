var validatorsDirectiveModule = angular.module('validatorsDirectiveModule', []);

validatorsDirectiveModule.directive('equalityValidator', [function(){
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      equalityValidator: '=',
    },
    link: function(scope, element, attrs, ngModel){
      ngModel.$validators.equal = function(modelValue){
        if(!scope.equalityValidator) return; // skip at first

        var val1 = modelValue;
        var val2 = scope.equalityValidator; //get the value

        if (val1 && val2 && typeof attrs.caseInsensitive !== 'undefined') {
          val1 = val1.toLowerCase();
          val2 = val2.toLowerCase();
        }

        return val1 === val2;
      };
    },
  };
}]);

validatorsDirectiveModule.directive('zipValidator', [function(){
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      zipValidator: '='
    },
    link: function(scope, element, attrs, ngModel){
      ngModel.$validators.zip = function(modelValue){
        return !!(modelValue && modelValue.match(/^\d{5}(?:[-\s]\d{4})?$/));
      };
    }
  };
}]);

validatorsDirectiveModule.directive('forceValidator', ['$timeout', function(timeout){
  return {
    restrict: 'A',
    require: 'ngModel',
    scope:{
      forceValidator: '=',
      ngModel: '='
    },
    link: function(scope, element, attrs, ngModel){
      scope.$watch('ngModel', function() {
        console.log(scope.forceValidator.$validate());
        //timeout(scope.forceValidator.$validate, 2000);
      });
    }
  };
}]);
