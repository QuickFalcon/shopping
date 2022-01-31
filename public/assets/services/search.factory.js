
// angular
  // .module('UserApp')
  // .factory('searchService', searchService);

UserApp.factory('searchService',function searchService($http, $q,$location,$cookies) { 

    return {
     'searchOperationProsperentProduct': function(link) {
        var defer = $q.defer();

         $http.post('product_apisearch', link).then(function successCallback(resp) {
                  
		 defer.resolve(resp.data);
        }, function errorCallback(err) {
            console.log(err);
            defer.reject(err);
        });
        return defer.promise;
      }



	};

 })// factory end 
UserApp.factory('searchServiceCatalog',function searchServiceCatalog($http, $q,$location) {

    return {
     'searchOperationProsperentProductByCatalog': function(catalogId) {
        var defer = $q.defer();
         var obj ={};
         obj.catalogId = catalogId;
         obj.start = 0;
         obj.offset =1;
         obj.sortorder=1;
         var pt = $location.path();
         console.log(pt);

         var callpath= '/productResultByCatalogId';
         if(pt.indexOf('SOC2')>-1){

             callpath = '/productResultCJByCatalogId';

         }
         $http.post(callpath , obj).then(function successCallback(resp) {
         defer.resolve(resp.data);
        }, function errorCallback(err) {
            console.log(err);
            defer.reject(err);
        });
        return defer.promise;
      }

 

    };

 })
 





 
 
 // factory end 
// UserApp.factory('searchServiceM',function searchServiceM($http, $q,$location,$cookies) { 

    // return {

        // 'searchOperationProsperentMain': function(link) {
            // var defer = $q.defer();
            // $http.post('product_apisearch_correct', link).then(function successCallback(resp) {
                // defer.resolve(resp.data);
            // }, function errorCallback(err) {
                // console.log(err);
                // defer.reject(err);
            // });
            // return defer.promise;
        // }

    // };

 // })