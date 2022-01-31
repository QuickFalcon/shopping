////////////////////////// controller for mailcontroller bag page /////////////////////////////////////////////////////
SSApp.controller('orderhistorycontroller', ['$scope', '$http','$route', '$routeParams', function ($scope, $http, $route, $routeParams) {
     
	   
	$scope.$parent.firsttime.loading =1;
	$scope.$parent.loadfull = true;
    var userId;
	 
        $scope.$parent.addTobagPossible = true;
        if(angular.isDefined($scope.userinfo) && $scope.loggedin==1){
			
			userId = $scope.userinfo['_id'];
			
		} else {
			console.log("user id is not there");
			sShoppable.ssLogIn();
			return;
		}  
	
	    $http.get('/user_purchase/' + userId)   // call to retrieve data
        .success(function (data) {
          
          $scope.orderObj = data.orderObj;
			$scope.purchaseObj = data.purchaseObj;

        }).error(function (err) {
          console.log(' profile Error: ' + err);
        });
	
	
		$scope.quick_view_for_orders = function(catalogId) { 
		     console.log(catalogId);
		
            // $scope.$parent.quick_view_parent_orders(catalogId);
              
		}

}])