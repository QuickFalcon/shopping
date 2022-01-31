var searchServiceModule = angular.module('searchServiceModule', []);

searchServiceModule.factory('searchServiceCatalog', ['$http', '$q', '$location', function($http, $q, $location){
  return {
    searchOperationProsperentProductByCatalog: function(catalogId){
      var deferred = $q.defer();

      var query ={};
      query.catalogId = catalogId;
      query.start = 0;
      query.offset =1;
      query.sortorder=1;
      var path = $location.path();

      var callPath= '/productResultByCatalogId';
      if(path.indexOf('SOC2')>-1){
        callPath = '/productResultCJByCatalogId';
      }

     $http.post(callPath, query).then(function(response){
       deferred.resolve(response.data)
     }, function(response){
       console.log('failed to product result by catalog id');
       deferred.reject(response);
     });

      return deferred.promise;
    },
  };
}]);
