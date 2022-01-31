var customerServiceComponentModule = angular.module('customerServiceComponentModule', ['profileSidebarComponentModule']);
customerServiceComponentModule.component('customerServiceComponent', {
    'templateUrl': 'app/components/my-account/customerServiceView.html',
    'bindings': {
        isLoggedIn: '<'
    },
    'controller': ['$scope', function ($scope) {
        var ctrl = this;
        ctrl.$postLink = function () {
            
        };
    }]
});