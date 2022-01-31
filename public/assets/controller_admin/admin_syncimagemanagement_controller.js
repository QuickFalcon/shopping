SSApp.controller('syncimageManagementCtrl', ['$scope', '$http', function ($scope, $http) {

 var dom;
 $scope.store_model ={};
 
    function showSyncedStore() {
        $scope.storequeryobj = {};
        $http.get('/get_storelistSyncImage')  //call to retrieve data
            .then(function (store) {
                  
                $scope.syncStorelist = store.data;
	         		
				
                  $http.get('/get_storesyncignorelist')  //call to retrieve data
					.then(function (sdata) {
						var list = sdata.data;
						console.log(list);
						for(var i=0;i<list.length;i++ )
						{
						  dom = list[i].domain;
					      $scope.store_model[dom] =true;
						
						}
					
					});
			
			
			});

    }

    showSyncedStore();
 

    $scope.updatedStr = function (str,mdl) {
         console.log(str);
		

		 if(!mdl)
		 {
		 
		
		    $http.post('/del_storesyncignorelist', { 'store' : str})
            .success(function (data) {

                window.alert("successfully removed synced store");
            })
		  
		 }
		 else
		 {
		 	$http.post('/add_storesyncignorelist', { 'store' : str})
            .success(function (data) {

                window.alert("successfully added inside ignored list");
            })
		 
		 }
       
    }
   
}]);
