

UserApp.factory('searchServiceCount',function searchServiceCount($http, $q,$location,$cookies) { 

    return {
		 'searchOperationProsperent': function(obj) {
			var defer = $q.defer();
			$http.post('productResult', obj).then(function successCallback(resp) {
				defer.resolve(resp.data);
			}, function errorCallback(err) {
				console.log(err);
				defer.reject(err);
			});
			return defer.promise;
		}

	};

 })// factory end 
