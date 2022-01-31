angular.module('SSApp').directive('orderPlacedComponent', ['$http', '$route', '$routeParams', '$location', function ($http, $route, $routeParams, $location) {
    return {
        restrict: 'E',
        templateUrl: 'assets/directive/components/order_placed/orderPlacedView.html',
        link: function (scope) {
            scope.$parent.ck_all = true;
            scope.$parent.addTobagPossible = true;
            scope.$parent.twotap_ordered_cart = angular.copy(scope.twotap_builtin_cart);
            scope.set_current_product_pro = function (pro, item, prokey, sitekey) {
                scope.$parent.quickview_update = 0;
                scope.$parent.set_current_product_pro_mother(pro, item, prokey, sitekey);
            };
            scope.$parent.loadfull = true;
            scope.$parent.firsttime.loading = 1;
        }
    };
}]);