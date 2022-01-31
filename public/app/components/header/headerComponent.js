var headerComponentModule = angular.module('headerComponentModule', ['headerLeftComponentModule', 'headerMiddleComponentModule', 'headerRightComponentModule']);

headerComponentModule.component('headerComponent', {
  templateUrl: 'app/components/header/headerView.html',
  bindings: {
    onInitializeUser: '&',
    onUninitializeUser: '&',
    userInfo: '='
  },
  controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs){
    var ctrl = this;
    ctrl.$onInit = function(){
      //ctrl.onUninitializeUser();
    };
  }]
});
