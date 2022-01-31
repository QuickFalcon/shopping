'use strict';

(function () {
    angular.module('SSApp').directive('profileSidebar', profileSidebar);

    profileSidebar.$inject = ['$timeout', '$location','Slug'];

    function profileSidebar($timeout, $location,Slug) {
        return {
            restrict: 'E',
            templateUrl: '/partials/sidebar/profile-sidebar.html',
            controllerAs: 'vm',

            link: function (scope) {
                var vm = scope.vm = {};

                vm.isCurrentPath = isCurrentPath;

                function isCurrentPath(path) {
                    return $location.path() == path;
                };
            }
        };
    }
}());



