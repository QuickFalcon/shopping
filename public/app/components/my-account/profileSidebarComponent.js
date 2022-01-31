var profileSidebarComponentModule = angular.module('profileSidebarComponentModule', []);
profileSidebarComponentModule.component('profileSidebarComponent', {
    'templateUrl': 'app/components/my-account/profileSidebarView.html',
    'bindings': {
        isLoggedIn: '<'
    },
    'controller': ['$scope', '$location', function ($scope, $location) {
        var ctrl = this;
        ctrl.isCurrentPath = function isCurrentPath(path) {
            console.log($location.path(), path);
            return $location.path() === path;
        };
        console.log(this, $scope);
    }]
});