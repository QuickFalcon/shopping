angular.module('SSApp').directive('confirmationPlacedComponent', ['$sce', '$http', '$route', '$routeParams', '$location', function($sce, $http, $route, $routeParams, $location) {
    return {
        restrict: 'E',
        templateUrl: 'assets/directive/components/confirmation_placed/confirmationPlacedView.html',
        link: function (scope) {
            var userId = $routeParams.user_id;
            scope.$parent.addTobagPossible = true;
            $http
                .get('/user_purchase/' + userId) //call to retrieve data
                .success(function(data) {
                    var pid = $routeParams.purchaseId;
                    scope.current_order = data.purchaseObj[pid];
                    scope.current_order_cart = data.orderObj[pid].userCart;
                    scope.current_order_fields_input = data.orderObj[pid].fields_input;
                    scope.num_of_sites = Object.keys(scope.current_order_cart.sites).length;
                    //sShoppable.ssCustomScrollbar();
                }).error(function(err) {
                    console.log("  Error: " + err);
                });
            scope.return_policyz = function(return_info, name, logo) {
                var len = return_info.length - 1;
                scope.$parent.return_info = $sce.trustAsHtml(return_info);
                scope.$parent.return_store_name = name;
                scope.$parent.return_store_logo = logo;
                scope.$apply();
            };
            scope.set_current_product_pro = function(pro, item, prokey, sitekey) {
                scope.$parent.quickview_update = 0;
                scope.$parent.set_current_product_pro_mother(pro, item, prokey, sitekey);
            };
            scope.$parent.firsttime.loading = 1;
            scope.$parent.loadfull = true;
        }
    };
}]);