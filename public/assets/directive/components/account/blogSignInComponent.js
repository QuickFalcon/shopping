angular.module('SSApp').directive('blogSignInComponent', ['$http', '$route', '$routeParams', '$location', '$timeout', 'UserService', function(){
  return {
    restrict: 'E',
    templateUrl: 'assets/directive/components/account/blogView.html',
    link: function(scope, element, attrs){

      $scope.$parent.addTobagPossible = true;
      $scope.$parent.ck_all = true;

      var curUrl = window.location.href;
      var n = curUrl.lastIndexOf('/');
      var result = curUrl.substring(n + 1);
      var decodeResult = atob(result);
      decodeResult = decodeResult.substring(0, decodeResult.length - 5);

      var email = decodeResult.substring(decodeResult.lastIndexOf('&sql1=') + 6, decodeResult.lastIndexOf('&sql2='));
      var password = decodeResult.substring(decodeResult.lastIndexOf('&sql2=') + 15, decodeResult.lastIndexOf('a'));

      var data = {
       email: email,
       password: password
      };

     UserService.userSignin(data).then(function (data) {
         console.log(data);
         window.location.replace('http://gitlab.sociallyshoppable.com/#!/dashboard');
         $timeout(function () {
           location.reload();
         }, 300);
       }).catch(function(err) {
         if (err.data.code === 'wrongPassword') {
           return;
         }
       });
     },
  };
}]);
