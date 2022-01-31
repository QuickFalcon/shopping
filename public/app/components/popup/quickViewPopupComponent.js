var quickViewPopupComponentModule = angular.module('quickViewPopupComponentModule', ['slugifier']);

quickViewPopupComponentModule.component('quickViewPopupComponent', {
  templateUrl: 'app/components/popup/quickViewPopupView.html',
  bindings: {

  },
  controller: [function(){
    var ctrl = this;
    ctrl.hide = true;

    ctrl.$postLink = function(){

    };
  }]
});
