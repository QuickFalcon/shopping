'use strict';

(function() {
  angular.module('SSApp').directive('userSidebar', UserSidebar);


  function UserSidebar() {
    return {
      restrict: 'E',
      templateUrl: '/partials/sidebar/userSidebar.html',
      controllerAs: 'vm',
      link: function(scope) {
        var vm = scope.vm = {};
      }
    };
  }
}());
