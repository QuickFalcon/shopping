/*
$routeProvider.when('/refactor/policy', {
    template: '<policy-component></policy-component>'
});
*/
var policyComponentModule = angular.module('policyComponentModule', ['profileSidebarComponentModule']);
policyComponentModule.component('policyComponent', {
    'templateUrl': 'app/components/my-account/policyView.html',
    'bindings': {
        isLoggedIn: '<'
    },
    'controller': ['$scope', function ($scope) {
        var ctrl = this;
        ctrl.$postLink = function () {
            
        };
    }]
});