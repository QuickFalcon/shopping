/* global socialPopup, toastr, sShoppable */
'use strict';

(function() {
  angular
  .module('validators', [])
  .directive('equalValidator', equalValidatorDirective)
  .directive('forceValidate', ['$timeout', forceValidateDirective])
  .directive('zipValidate', zipValidateDirective);

  function equalValidatorDirective() {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        equalValidator: '='
      },
      link: function(scope, element, attrs, ngModel) {
        ngModel.$validators.equal = function(modelValue) {
          var val1 = scope.equalValidator,
              val2 = modelValue;

          if (val1 && val2 && typeof attrs.caseInsensitive !== 'undefined') {
            val1 = val1.toLowerCase();
            val2 = val2.toLowerCase();
          }

          return val1 === val2;
        };
      }
    };
  }

  function forceValidateDirective($timeout) {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        forceValidate: '=',
        model: '=ngModel'
      },
      link: function(scope) {
        scope.$watch('model', function() {
          $timeout(scope.forceValidate.$validate, 0);
        });
      }
    };
  }

  function zipValidateDirective() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attributes, ngModel) {
        ngModel.$validators.zip = function(modelValue) {
          return !!(modelValue && modelValue.match(/^\d{5}(?:[-\s]\d{4})?$/));
        };
      }
    };
  }
}());
