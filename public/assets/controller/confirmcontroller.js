SSApp.controller('confirmController', ['$scope', '$http', '$route', '$routeParams', '$location', function ($scope, $http, $route, $routeParams, $location) {

    $scope.$parent.addTobagPossible = true;
	  $scope.$parent.ck_all = true;

    $http.get('/user/profile')  //call to retrieve data
        .success(function (data) {

            var pid = $scope.current_purchase_id
            $scope.$parent.current_order = data.purchaseObj[pid];

        }).error(function (err) {
        console.log(" get Error: " + err);
    });

    $scope.set_current_product_pro = function (pro, item, prokey, sitekey) {

        $scope.$parent.quickview_update = 0;
        $scope.$parent.set_current_product_pro_mother(pro, item, prokey, sitekey);


    }
	 	$scope.$parent.loadfull = true;
	$scope.$parent.firsttime.loading =1;


}]);

SSApp.controller('orderController', ['$scope', '$http', '$route', '$routeParams', '$location', function ($scope, $http, $route, $routeParams, $location) {
	  $scope.$parent.ck_all = true;

     $scope.$parent.addTobagPossible = true;

    $scope.$parent.twotap_ordered_cart = angular.copy($scope.twotap_builtin_cart);

    //sShoppable.ssCustomScrollbar();

    $scope.set_current_product_pro = function (pro, item, prokey, sitekey) {

        $scope.$parent.quickview_update = 0;
        $scope.$parent.set_current_product_pro_mother(pro, item, prokey, sitekey);


    }
	 	$scope.$parent.loadfull = true;
	$scope.$parent.firsttime.loading =1;


}]);


SSApp.controller('orderControllerView', ['$scope', '$http', '$route', '$routeParams', '$location', function ($scope, $http, $route, $routeParams, $location) {
            var pid = $routeParams.purchaseId;
    $scope.ss_order_id = pid;
    $scope.$parent.addTobagPossible = true;
	  $scope.$parent.ck_all = true;

    $http.get('/user/profile')  //call to retrieve data
        .success(function (data) {

           
			// $scope.$parent.twotap_ordered_cart =data.mailbox[pid].userCart;
            $scope.$parent.twotap_ordered_cart = angular.copy(data.orderObj[pid].userCart);
            $scope.timeoforder = pid;

            $scope.num_of_sites = Object.keys(data.orderObj[pid].userCart.sites).length;
            //sShoppable.ssCustomScrollbar();

        }).error(function (err) {
        console.log(" error Error: " + err);
    });

    $scope.set_current_product_pro = function (pro, item, prokey, sitekey) {

        $scope.$parent.quickview_update = 0;
        $scope.$parent.set_current_product_pro_mother(pro, item, prokey, sitekey);


    }
	$scope.$parent.firsttime.loading =1;
		$scope.$parent.loadfull = true;


}]);

//// im

SSApp.controller('confirmControllerView', ['$scope', '$sce', '$http', '$route', '$routeParams', '$location', function ($scope, $sce, $http, $route, $routeParams, $location) {
    
	 $scope.$parent.addTobagPossible = true;

	var userId = $routeParams.user_id; //
    $http.get('/user_purchase/' + userId)  //call to retrieve data
        .success(function (data) {

            var pid = $routeParams.purchaseId;
            $scope.current_order = data.purchaseObj[pid];
            $scope.current_order_cart = data.orderObj[pid].userCart;
            $scope.current_order_fields_input = data.orderObj[pid].fields_input;
            $scope.num_of_sites = Object.keys($scope.current_order_cart.sites).length;
            //sShoppable.ssCustomScrollbar();

        }).error(function (err) {
        console.log("  Error: " + err);
    });

    $scope.return_policyz = function (return_info, name, logo) {

        var len = return_info.length - 1;
        $scope.$parent.return_info = $sce.trustAsHtml(return_info);
        $scope.$parent.return_store_name = name;
        $scope.$parent.return_store_logo = logo;
        $scope.$apply();

    }

    $scope.set_current_product_pro = function (pro, item, prokey, sitekey) {

        $scope.$parent.quickview_update = 0;
        $scope.$parent.set_current_product_pro_mother(pro, item, prokey, sitekey);


    }
$scope.$parent.firsttime.loading =1;
		$scope.$parent.loadfull = true;
}]);


