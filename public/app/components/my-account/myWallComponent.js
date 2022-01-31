var myWallComponentModule = angular.module('myWallComponentModule', ['userSidebarComponentModule']);

myWallComponentModule.component('myWallComponent', {
  templateUrl: 'app/components/my-account/myWallView.html',
  bindings: {
    isLoggedIn: '<',

  },
  controller: [function(){

    var ctrl = this;

    ctrl.$postLink = function(){
      console.log(ctrl.isLoggedIn);
    };
  }],
});
