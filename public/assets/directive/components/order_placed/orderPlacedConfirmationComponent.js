angular.module('SSApp').directive('orderPlacedConfirmationComponent', ['$http', '$route', '$routeParams', '$location', function ($http, $route, $routeParams, $location) {
    return {
        restrict: 'E',
        templateUrl: 'assets/directive/components/order_placed/orderPlacedConfirmationView.html',
        link: function (scope) {
            var pid = $routeParams.purchaseId;
            scope.ss_order_id = pid;
            scope.$parent.addTobagPossible = true;
            scope.$parent.ck_all = true;
            $http
                .get('/user/profile')  //call to retrieve data
                .success(function (data) {
                    scope.$parent.twotap_ordered_cart = angular.copy(data.orderObj[pid].userCart);
                    scope.timeoforder = pid;
                    scope.num_of_sites = Object.keys(data.orderObj[pid].userCart.sites).length;
                }).error(function (err) {
                    console.log(" error Error: " + err);
                });
            scope.set_current_product_pro = function (pro, item, prokey, sitekey) {
                scope.$parent.quickview_update = 0;
                scope.$parent.set_current_product_pro_mother(pro, item, prokey, sitekey);
            };
            scope.$parent.firsttime.loading = 1;
            scope.$parent.loadfull = true;
        }
    };
}]);