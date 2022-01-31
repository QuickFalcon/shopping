

UserApp.factory('searchBrandGrpCount',function searchBrandGrpCount($http, $q,$location,$cookies) { 

    return {
		 'searchBrandGrpCountFact': function(link) {
			var defer = $q.defer();
			$http.post('product_apisearch_correct', link).then(function successCallback(resp) {
				defer.resolve(resp.data);
			}, function errorCallback(err) {
				defer.reject(err);
			});
			return defer.promise;
		}

	};

 })// factory end 
