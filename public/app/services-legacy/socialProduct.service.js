'use strict';

(function () {
  angular
    .module('SSApp')
    .factory('SocialProductService', SocialProductService);

  SocialProductService.$inject = ['$resource'];

  function SocialProductService($resource) {
    var Social = $resource(
      '/product/:catalogId/social',
      { catalogId: '@catalogId' },
      {
        getProductSocials: {
          method: 'get',
          isArray: false
        },
        getAllLikes: {
          url: '/product/:catalogId/likes',
          method: 'get',
          isArray: true
        }
      });
    return Social;
  }
}());


UserApp.factory('getSocialDataAll',function getSocialDataAll($http, $q) { 

    return {

    'getSocDataAll': function(catalogId) {
     
       var defer = $q.defer();
     ///////////////////
         $http.get('/product/:catalogId/socialAll').then(function successCallback(resp) {
            defer.resolve(resp.data);
        }, function errorCallback(err) {
            defer.reject(err);
        });
        
		
		////////////////
        return defer.promise;
        }


	};

 })


UserApp.factory('setSocialData',function setSocialData($http, $q) { 

    return {

    'updateSocialData': function(data,catalogId) {
     
       var defer = $q.defer();
     ///////////////////
         $http.post('/product_update_social', { socialFields : data,catalogId :catalogId }).then(function successCallback(resp) {
            defer.resolve(resp.data);
        }, function errorCallback(err) {
            defer.reject(err);
        });
        
		
		////////////////
        return defer.promise;
        }


	};

 })// factory end 

 
 
 UserApp.factory('updateUserActivity',function updateUserActivity($http, $q) { 

    return {

    'updateUserActivityData': function(catalogId,activityObj,sharetypes) {
       
	   console.log(sharetypes);
	   
	   console.log("service called");
       var defer = $q.defer();
     ///////////////////
			  if(angular.isDefined(activityObj.mail)) {
				  if((!sharetypes.like) && (!sharetypes.mail) && (!sharetypes.collective) && (!activityObj.mail)) {
						
						$http.post('/user_activity_history_delete', { catalogId :catalogId}).then(function successCallback(resp) {

						defer.resolve(resp.data);
						}, function errorCallback(err) {

						defer.reject(err);
						});
						
					} else {     
					  $http.post('/user_activity_history_update', { catalogId :catalogId, activity : activityObj, sharetypes : sharetypes  }).then(function successCallback(resp) {
							console.log(resp);
							defer.resolve(resp.data);
						}, function errorCallback(err) {
							console.log(err);	
							defer.reject(err);
						});
					}   
			} else {
				
				 if((!sharetypes.like) && (!sharetypes.mail) && (!sharetypes.collective)) {
						
						$http.post('/user_activity_history_delete', { catalogId :catalogId}).then(function successCallback(resp) {

						defer.resolve(resp.data);
						}, function errorCallback(err) {

						defer.reject(err);
						});
						
					} else {     
					  $http.post('/user_activity_history_update', { catalogId :catalogId, activity : activityObj, sharetypes : sharetypes  }).then(function successCallback(resp) {
							console.log(resp);
							defer.resolve(resp.data);
						}, function errorCallback(err) {
							console.log(err);	
							defer.reject(err);
						});
					}
			
			}
		////////////////
        return defer.promise;
        }


	};

 })// factory end 