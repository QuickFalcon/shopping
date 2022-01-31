angular.module('SSApp').directive('orderHistoryComponent', ['$http','$route', '$routeParams', function($http, $route, $routeParams){
  return {
    restrict: 'E',
    templateUrl: 'assets/directive/components/account/orderHistoryView.html',
    link: function(scope, element, attrs){

      scope.$parent.firsttime.loading =1;
    	scope.$parent.loadfull = true;

      var userId;
      scope.$parent.addTobagPossible = true;

      if(angular.isDefined(scope.userinfo) && scope.loggedin==1){
        userId = scope.userinfo._id;
  		} else {
  			console.log("user id is not there");
  			sShoppable.ssLogIn();
  			return;
  		}

      $http.get('/user_purchase/' + userId).success(function (data) {

        scope.orderObj = data.orderObj;
        scope.purchaseObj = data.purchaseObj;
        }).error(function (err) {
          console.log(' profile Error: ' + err);
        });

		  scope.quick_view_for_orders = function(catalogId) {
        console.log(catalogId);
		  };

    }
  };
}]);
