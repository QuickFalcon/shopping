SSApp.controller('storeController', ['$scope', '$http', '$route', '$routeParams',  function ($scope, $http, $route, $routeParams) {

    $scope.$parent.addTobagPossible = true;
	  $scope.$parent.ck_all = true;


    $http.get('/get_storelist_api_database').then(function (response) {


        $scope.storelist =response.data;
       
    }, function (response) {
        console.log(response.data);

    });
		$scope.$parent.loadfull = true;
		    $scope.$parent.firsttime.loading =1;



}]);