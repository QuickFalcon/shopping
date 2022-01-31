var userSidebarComponentModule = angular.module('userSidebarComponentModule', ['slugifier']);

userSidebarComponentModule.component('userSidebarComponent', {
  templateUrl: 'app/components/sidebar/userSidebarView.html',
  bindings: {
    isLoggedIn: '=',
    userInfo: '=',
  },
  controller: ['$scope', 'userService', function($scope, userService){

    var ctrl = this;

    //  CONTROLLERS
    ctrl.$postLink = function(){
      console.log('sidebar');
    };
    
  }]
});
