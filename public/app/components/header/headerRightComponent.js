var headerRightComponentModule = angular.module('headerRightComponentModule', ['signUpComponentModule']);

headerRightComponentModule.component('headerRightComponent', {

  templateUrl: 'app/components/header/headerRightView.html',
  bindings: {
    onInitializeUser: '&',
    onUninitializeUser: '&',
    userInfo: '='
  },
  controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs){

    var ctrl = this;
    ctrl.eventsScope = $scope.$new(true);   // SHARED SCOPE ON THE CHILD COMPONENT

    // CONTROLLER FUNCTIONS

    // LIFECYCLE HOOKS
    ctrl.$onInit = function(){

    };

    ctrl.$postLink = function(){

    };

    ctrl.signOut = function(){
      ctrl.onUninitializeUser();
    };

    // CONTROLLERS
    ctrl.showSignUpModal = function(){
      ctrl.eventsScope.$broadcast('showSignUpModalEvent', function(){
      });
    };

    ctrl.showLoginModal = function(){
      ctrl.eventsScope.$broadcast('showLoginModalEvent', function(){
      });
    };

  }]
});
