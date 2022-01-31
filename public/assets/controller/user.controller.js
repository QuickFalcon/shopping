'use strict';

(function() {

  angular.module('SSApp').controller('userController', userController);
  userController.$inject = ['$scope', '$http', '$route', '$routeParams', '$location', 'UserService', '$filter', '$window', 'toastr'];

  function userController($scope, $http,$route, $routeParams, $location, User, $filter, $window, toastr) {
    $scope.upclass = 0;
    $scope.SmartPathing = 'USER PROFILE';
    // export functions

    // set the birthday options
 
      $scope.$parent.addTobagPossible = true;
	  $scope.$parent.ck_all = true;
    $scope.uid = $routeParams.userid; // retrieve  catalog id

    // functions
    function searchuser() {
      
     $scope.accountloaddone=false; 

	  $http
        .get('/user/gprofile/'+ $scope.uid)  // call to retrieve data
        .success(function (data) {
          
		  $scope.accountloaddone=true; 

		  $scope.genuserprofile = data;
          
		  
	
		
		}).error(function (err) {
          console.log(' profile Error: ' + err);
           $scope.accountloaddone=true; 

		
		});
    }
       
    
	
	$scope.userid = $routeParams.userid; // retrieve  catalog id
   angular.element('#prSocialPopup').modal('hide');
     socialPopup.closed();
	   

       if($scope.loggedin==1)  
	   searchuser();

    // update user data
    
	
	console.log("I am okay");
	
	
	$scope.$parent.firsttime.loading =1;
	$scope.$parent.loadfull = true;

  }
}());
