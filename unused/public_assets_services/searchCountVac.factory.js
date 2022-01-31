

UserApp.factory('searchServiceCountVac',function searchServiceCountVac($http, $q,$location,$cookies) { 

    return {
		 'searchOperationProsperentVac': function(link) {
			var defer = $q.defer();
			$http.post('product_apisearch_main', link).then(function successCallback(resp) {
				defer.resolve(resp.data);
			}, function errorCallback(err) {
				console.log(err);
				defer.reject(err);
			});
			return defer.promise;
		}

	};

 })// factory end 
