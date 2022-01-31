var registerapp = angular.module('registerapp', []);


registerapp.controller('registerctrl', function ($scope, $http) {

    $scope.title = "Socially Shoppable";

    $http.get('/rajib')
        .success(function (data) {
            $scope.title = "SS";
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });


    // when landing on the page, get all todos and show them
    /*
     $http.get('/admin')
     .success(function(data) {  // get data from node
     $scope.todos = data;
     alert(data);
     })
     .error(function(data) {
     console.log('Error: ' + data);
     });
     */

})



