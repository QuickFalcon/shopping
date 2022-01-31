var userServiceModule = angular.module('userServiceModule', []);

userServiceModule.factory('userService', ['$http', '$q', function($http, $q){
  return {
    initializeUser: function(data){

    },

    uninitializeUser: function(){

    },

    getHistory: function(){
      var deferred = $q.defer();
      var userHistory = {};
      var catArr = [];
      var catId;

      $http.get('/user_activity_details')  //call to retrieve data
        .then(function (response) {
          for (var j = 0; j < response.data.length; j++) {
            catId = response.data[j].catalogId;
            catArr.push(catId);
              }
              console.log(response.data[0].catalogId);
          var multiID = {'mid': catArr};
          if (catArr.length > 0) {
            $http.post('/productUserMulticatalogID', multiID)
              .then(function (response) {
                  userHistory = response.data.product;
                  deferred.resolve(userHistory);

                  }, function (response) {
                    console.log('failed to get product user multicatalog ID');
                    deferred.reject(response)
                  });
            }
          }, function (response) {
              console.log('failed to get user activity details');
          });

      return deferred.promise;
    },

    getLikedItems: function(){
      var deferred = $q.defer();
      var favCatalogList = [];

      $http.post('/getMyfavourites').then(function (response) {
          for (var i = 0; i < response.data.length; i++)
            favCatalogList.push(response.data[i].catalogId);

          deferred.resolve(favCatalogList);
      }, function(response){

          console.log('failed to get favorites');
          deferred.reject(response);
      });

      return deferred.promise;
    },

    getReviewedItems: function(){
      var deferred = $q.defer();
      var reviewedCatalogList = [];

      $http.post('/getMyReviewed').then(function (response) {
          for (var i = 0; i < response.data.length; i++)
            reviewedCatalogList.push(response.data[i].catalogId);

          deferred.resolve(reviewedCatalogList);
      }, function(respose){
        console.log('failed to get reviewed items');
        deferred.reject(response);
      });

      return deferred.promise;
    },

    getMailedItems: function(){
      var deferred = $q.defer();
      var mailedCatalogList = [];

      $http.post('/getMyMailed').then(function (response) {

          for (var i = 0; i < response.data.length; i++)
              mailedCatalogList.push(response.data[i].catalogId);

          deferred.resolve(mailedCatalogList);
      }, function(response){
          console.log('failed to get mailed items');
          deferred.reject(response);
      });

      return deferred.promise;
    },

    getStoreSliderList: function(merchantList){
      var deferred = $q.defer();

      var sliderList;
      var merchants = {stores: merchantList}
      $http.post('/get_storelistSlider', merchants).then(function (response) {
          sliderList = response.data;
          deferred.resolve(sliderList);
      }, function (response) {
          console.log('failed to get store slider list');
          deferred.reject(response);
      });

      return deferred.promise;
    },
  };
}]);
