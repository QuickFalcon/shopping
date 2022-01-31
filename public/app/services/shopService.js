var shopServiceModule = angular.module('shopServiceModule', []);

shopServiceModule.factory('shopService', ['$q', '$http', function($q, $http){
  return {
    calculateTotalItems: function(items){
      var i = 0;
      var total = 0;
      for (i = 0; i < items.length; i++) {
          total = total + items[i].quantity;
      }
      return total;
    },

    getCartUniqueRetailer: function(data){
      var new_arr = [];
      var jc;
      var validc;
      var tempc;
      var nc;
      if (angular.isDefined(data)) {
          var count = 0;
          var itemscount = 0;
          var total_cal = 0;
          var retailer_arr = [];
          var retailerindex;
          var mycount = -1;
          var tempTotal = 0;
          for (nc = 0; nc < data.length; nc++) // nc index jeta compare hoye gechey eleminate that
          {
              retailerindex = -1;
              tempc = data[nc].retailer; // one retailer
              tempPrice = data[nc].current_price;
              tempQuantity = data[nc].quantity;
              jc = 0;               // counter become 0
              validc = false;       // valid false means new data
              retailerindex = retailer_arr.indexOf(tempc);
              tempTotal = 0;
              tempTotal = tempPrice * tempQuantity * 1.0;
              if (retailerindex > -1) {
                  new_arr[retailerindex].quantity = new_arr[retailerindex].quantity + tempQuantity;
                  new_arr[retailerindex].store_total_cost = new_arr[retailerindex].store_total_cost + tempTotal;
              }
              else {
                  mycount = mycount + 1;
                  new_arr.push({
                      "site_key": data[nc].site_key,
                      "retailer": tempc,
                      "retailer_logo": data[nc].logo_url,
                      "quantity": tempQuantity,
                      "store_total_cost": tempTotal,
                      "coupon_support": data[nc].coupon_support,
                      "gift_support": data[nc].gift_support,
                      "checkout_support": data[nc].checkout_support,
                      "shipping_countries_support": data[nc].shipping_countries_support,
                      "billing_countries_support": data[nc].billing_countries_support,
                      "shipping_options": data[nc].shipping_options
                  });
                  retailer_arr.push(tempc);
              }
              count = count + 1;
          }
          // $scope.cartDistinctStore  = new_arr; // distinct store json data
          // $scope.total_cart_distinct_store =new_arr.length;
          return new_arr;
      }
    },

    getTopStores: function (){
        var deferred = $q.defer();

        $http.get('/get_top_stores').then(function(response){
          var data = response.data;

          deferred.resolve(data);
        }, function(response){
          console.log('failed to get top stores');
          deferred.reject(response);
        });

        return deferred.promise;
    },

    getProducts: function(query){
      var deferred = $q.defer();

      $http.post('/productResult', query).then(function (response) {
          var data = response.data;

          deferred.resolve(data);
      }, function (response) {
          console.log('failed to get products');
          deferred.reject(response)
      });

      return deferred.promise;
    },

    getProductsCount: function(query){
      var deferred = $q.defer();

      $http.post('/productResultCount', query).then(function (response) {
          var data = response.data;

          deferred.resolve(data);
      }, function (response) {
          console.log('failed to get products count');
          deferred.reject(response)
      });

      return deferred.promise;
    },
  };
}]);
