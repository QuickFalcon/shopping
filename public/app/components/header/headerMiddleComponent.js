var headerMiddleComponentModule = angular.module('headerMiddleComponentModule', ['mainSearchComponentModule']);

headerMiddleComponentModule.component('headerMiddleComponent', {
  templateUrl: 'app/components/header/headerMiddleView.html',
  bindings: {

  },
  controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs){

  }]
});
