var companyComponentModule = angular.module('companyComponentModule', ['profileSidebarComponentModule']);
companyComponentModule.component('companyComponent', {
    'templateUrl': 'app/components/my-account/companyView.html',
    'bindings': {
        isLoggedIn: '<'
    },
    'controller': ['$scope', function ($scope) {
        var ctrl = this;
        ctrl.$postLink = function () {
            
        };
    }]
});