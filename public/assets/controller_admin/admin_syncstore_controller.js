SSApp.controller('syncStoreCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.sync_store = function () {

        $http.post('/sync_stores_add')  //call to retrieve data
            .success(function (data) {
                window.alert("successful sync operation");

            }).error(function (err) {
            console.log(" SOrry error " + err);
        });

    }
    $scope.sync_store_common = function () {

        $http.post('/sync_stores_add_common')  //call to retrieve data
            .success(function (data) {
                window.alert("successful sync operation");

            }).error(function (err) {
            console.log(" SOrry error " + err);
        });

    }
      $scope.import_twotap_store = function () {

        $http.post('/import_TwotapStore_CSV')  //call to retrieve data
            .success(function (data) {
                window.alert("successful twotap store operation");

            }).error(function (err) {
            console.log(" SOrry error " + err);
        });

    } 

}]);