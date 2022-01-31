angular.module('SSApp').directive('userSidebar',function(){
    return {
      restrict: 'E',
      templateUrl: '/assets/directive/components/user/userSidebarView.html',
      controllerAs: 'vm',
      link: function(scope) {
        var vm = scope.vm = {};
      }
    };
});
