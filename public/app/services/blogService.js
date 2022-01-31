var blogServiceModule = angular.module('blogServiceModule', []);

blogServiceModule.factory('blogService', ['$http', function($http){

  return {
    getBlogs: function(){
      return $http.get('/wp');
    }
  };
}]);
