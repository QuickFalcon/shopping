angular.module('SSApp').directive('accountComponent', ['$http', '$route', '$routeParams', '$location', '$filter', '$window', 'UserService', 'Upload', 'toastr',function ($http, $route, $routeParams, $location, $filter, $window, User, Upload, toastr) {
  return {
    restrict: 'E',
    templateUrl: 'assets/directive/components/account/accountView.html',
    link: function (scope, element, attrs) {
       scope.asyncIsUserLoggedIn(function (isLoggedIn) {
          if (isLoggedIn) {
            searchuser();
          } else {
            $location.path('/');
            $route.reload();
          }
       });
      scope.upclass = 0;
      scope.SmartPathing = 'YOUR ACCOUNT > MY PROFILE';
      // export functions
      scope.update_user = updateUser;
      scope.changePhoto = changePhoto;
      scope.showpopup = 0;

      scope.triggerpopup = function ($event,val) {
          $event.stopPropagation();
          scope.showpopup = val;
      };

      scope.popClose = function () {
          scope.showpopup = false;
      };

      // set the birthday options
      scope.days = (function (n) {
          for (var a = []; n--; a[n] = n + 1) {
          }
          return a;
      })(31);

      scope.months = (function (n) {
          for (var a = []; n--; a[n] = n + 1) {
          }
          return a;
      })(12);

      scope.years = (function (n, year) {
          for (var a = []; n--; a[n] = year - n) {
          }
          return a;
      })(100, (new Date()).getUTCFullYear());

      scope.$parent.addTobagPossible = true;
      scope.$parent.ck_all = true;

      // function searchuser() {

        // scope.accountloaddone = false;

        // $http.get('/user/profile').success(function (data) {// call to retrieve data

          // scope.accountloaddone = true;
          // scope.userprofile = data;
          // scope.backupprofile = angular.copy(scope.userprofile);
          // var birtdayDate = new Date(scope.userprofile.birthDay);

          // scope.byear = birtdayDate.getFullYear();
          // scope.bmonth = birtdayDate.getMonth() + 1;
          // scope.bday = birtdayDate.getDate();

          // scope.byear2 = angular.copy(scope.byear);
          // scope.bmonth2 = angular.copy(scope.bmonth);
          // scope.bday2 = angular.copy(scope.bday);
          // scope.triggerpopup(event,0);

          // }).error(function (err) {
            // console.log(' profile Error: ' + err);
            // scope.accountloaddone = true;
          // });
      // }

      scope.reset_userprofile = function () {
        searchuser();
      };

      scope.reset_userprofilename = function ($event) {
        $event.stopPropagation();
        scope.triggerpopup(event,0);
        scope.userprofile.username = angular.copy(scope.backupprofile.username);

      };

      // if (scope.loggedin == 1) {
          // searchuser();
      // }

      var jsonProduct = {};
      // update user data

      // scope.update_username = function ($event) {
        // $event.stopPropagation();

        // jsonProduct = {};
        // jsonProduct.username = scope.userprofile.username;

        // $http.post('/user/profile', {userfields: jsonProduct}).success(function (res) {
          // console.log(res, 'username updated');
          // toastr.success('User name Updated ');
          // scope.triggerpopup(event,0);

          // }).error(function (err) {
            // toastr.error(err, 'User name  not saved');
        // });
      // };

      // function updateUser() {

        // jsonProduct = {};
        // jsonProduct.email = scope.userprofile.email;

        // jsonProduct.firstname = scope.userprofile.firstname;
        // jsonProduct.middlename = scope.userprofile.middlename;

        // jsonProduct.lastname = scope.userprofile.lastname;
        // jsonProduct.address = scope.userprofile.address;
        // jsonProduct.address1 = scope.userprofile.address1;
        // jsonProduct.address2 = scope.userprofile.address2;

        // jsonProduct.city = scope.userprofile.city;
        // jsonProduct.state = scope.userprofile.state;
        // jsonProduct.country = scope.userprofile.country;
        // jsonProduct.zip = scope.userprofile.zip;
        // jsonProduct.phone = scope.userprofile.phone;
        // jsonProduct.username = scope.userprofile.username;
        // jsonProduct.ss_subscribe = scope.userprofile.ss_subscribe;
        // jsonProduct.blog_subscribe = scope.userprofile.blog_subscribe;
        // jsonProduct.gender = scope.userprofile.gender;
        // jsonProduct.currency = scope.userprofile.currency;
        // jsonProduct.apt = scope.userprofile.apt;

          // if (angular.isDefined(scope.byear) && angular.isDefined(scope.bmonth) && angular.isDefined(scope.bday)) {
            // if (scope.byear != null && scope.bmonth != null && scope.bday != null)
              // jsonProduct.birthDay = scope.byear + '-' + scope.bmonth + '-' + scope.bday;
          // }

          // scope.accountloaddone = false;

          // $http.post('/user/profile', {userfields: jsonProduct}).success(function (data) {
            // scope.accountloaddone = true;
            // scope.triggerpopup(event, 0);

          // });
        // }

  // set the birthday options
  scope.days = (function (n) {for(var a=[];n--;a[n]=n+1) {}return a;})(31);
  scope.months = (function (n) {for(var a=[];n--;a[n]=n+1) {}return a;})(12);
  scope.years = (function (n, year) {for(var a=[];n--;a[n]=year-n) {}return a;})(100, (new Date()).getUTCFullYear());


    scope.$parent.addTobagPossible = true;
  scope.$parent.ck_all = true;

  // functions
  function searchuser() {
    console.log('searchuser');
    scope.accountloaddone=false;

    $http.get('/user/profile').success(function (data) {

    scope.accountloaddone=true;
    scope.userprofile = data;
    scope.backupprofile = angular.copy(scope.userprofile);

   if(angular.isDefined(scope.userprofile.birthDay)) {

    var birtdayDate = new Date(scope.userprofile.birthDay);

      scope.byear = birtdayDate.getFullYear();
      scope.bmonth = birtdayDate.getMonth() + 1;
      scope.bday = birtdayDate.getDate();

      scope.byear2 = angular.copy(scope.byear) ;
      scope.bmonth2 = angular.copy(scope.bmonth);
      scope.bday2 = angular.copy(scope.bday);
    }
        // scope.triggerpopup(0);
    }).error(function (err) {
      console.log(' profile Error: ' + err);
      scope.accountloaddone=true;
  });
  }

  scope.reset_userprofile= function () {
     searchuser();
   };

  scope.reset_userprofilename = function ($event) {
    scope.triggerpopup(event,0);
    scope.userprofile.username = angular.copy(scope.backupprofile.username);
  };

  // if(scope.loggedin==1) {
    // searchuser();
  // }else{
    // $location.path('/');
    // $route.reload();
  // }
  

  jsonProduct = {};
  // update user data

scope.ERROR_username = false;
scope.update_username = function ($event) {

  jsonProduct = {};
  jsonProduct.username = scope.userprofile.username;
    
  if ($event.type === 'keydown') {
      console.log($event.target);
      angular.element($event.target).trigger('blur');
  }
  $http.post('/user/profile', { userfields : jsonProduct }).success(function (res) {
    if (res.error) {
      scope.ERROR_username = true;
      //scope.userprofile.username = scope.backupprofile.username;
      toastr.error(res.error);
      return;
    }
    scope.ERROR_username = false;
    scope.backupprofile.username = scope.userprofile.username;
    console.log(res, 'username updated!');
    toastr.success('User name Updated ');
    scope.triggerpopup(event,0);
  }).error(function (err) {
    toastr.error(err, 'username was not saved');
  });
};

  function updateUser() {
    console.log('updateUser');
    jsonProduct ={};
    jsonProduct.email = scope.userprofile.email;

    jsonProduct.firstname = scope.userprofile.firstname;
    jsonProduct.middlename = scope.userprofile.middlename;

    jsonProduct.lastname= scope.userprofile.lastname;
    jsonProduct.address= scope.userprofile.address;
    jsonProduct.address1= scope.userprofile.address1;
    jsonProduct.address2= scope.userprofile.address2;

    jsonProduct.city= scope.userprofile.city;
    jsonProduct.state= scope.userprofile.state;
    jsonProduct.country= scope.userprofile.country;
    jsonProduct.zip= scope.userprofile.zip;
    jsonProduct.phone= scope.userprofile.phone;
    jsonProduct.username= scope.userprofile.username;
    jsonProduct.ss_subscribe= scope.userprofile.ss_subscribe;
    jsonProduct.blog_subscribe= scope.userprofile.blog_subscribe;
    jsonProduct.gender = scope.userprofile.gender;
    jsonProduct.currency= scope.userprofile.currency;
    jsonProduct.apt =scope.userprofile.apt;

    if(angular.isDefined(scope.byear) && angular.isDefined( scope.bmonth) && angular.isDefined(scope.bday)) {
      if(scope.byear!=null && scope.bmonth!=null && scope.bday!=null && scope.byear!='' && scope.bmonth!='' && scope.bday!='')
       jsonProduct.birthDay = scope.byear + '-' + scope.bmonth + '-' + scope.bday;

       console.log(scope.byear);
       console.log(scope.bmonth);
       console.log(scope.bday);
      }else {
       scope.byear ="";
       scope.bmonth ="";
       scope.bday="";
      }

    scope.accountloaddone=false;

    $http.post('/user/profile', {userfields : jsonProduct}).success(function (data) {
      scope.accountloaddone=true;
      scope.triggerpopup(event,0);

      toastr.success('Profile saved');

      scope.$parent.shipping_address.email = angular.copy(scope.userprofile.email);
      scope.$parent.shipping_address.firstname = angular.copy(scope.userprofile.firstname);
      scope.$parent.shipping_address.lastname = angular.copy(scope.userprofile.lastname);
      scope.$parent.shipping_address.address = angular.copy(scope.userprofile.address);
      scope.$parent.shipping_address.address1 = angular.copy(scope.userprofile.address1);
      scope.$parent.shipping_address.address2 = angular.copy(scope.userprofile.address2);

      scope.$parent.shipping_address.city = angular.copy(scope.userprofile.city);
      scope.$parent.shipping_address.state = angular.copy(scope.userprofile.state);
      scope.$parent.shipping_address.country = angular.copy(scope.userprofile.country);
      scope.$parent.shipping_address.zip = angular.copy(scope.userprofile.zip);
      scope.$parent.shipping_address.phone = angular.copy(scope.userprofile.phone);

      scope.$parent.billing_address.firstname = angular.copy(scope.userprofile.firstname);
      scope.$parent.billing_address.lastname = angular.copy(scope.userprofile.lastname);
      scope.$parent.billing_address.address = angular.copy(scope.userprofile.address);
      scope.$parent.billing_address.address1 = angular.copy(scope.userprofile.address1);
      scope.$parent.billing_address.address2 = angular.copy(scope.userprofile.address2);

      scope.$parent.billing_address.city = angular.copy(scope.userprofile.city);
      scope.$parent.billing_address.state = angular.copy(scope.userprofile.state);
      scope.$parent.billing_address.country = angular.copy(scope.userprofile.country);
      scope.$parent.billing_address.zip = angular.copy(scope.userprofile.zip);
      scope.$parent.billing_address.phone = angular.copy(scope.userprofile.phone);
      scope.$parent.userinfo.username = scope.userprofile.username;

      if (scope.userprofile.gender === 1) {
        scope.gendercls = "greyHeart";
      }else
        scope.gendercls = "redHeart";

      }).error(function (err) {
        toastr.error(err, 'Profile not saved');
        scope.accountloaddone = true;


      });
    }

    scope.$parent.firsttime.loading = 1;
    scope.$parent.loadfull = true;

    function changePhoto(photo) {
      scope.userprofile.img_location = photo.img;
      toastr.success('Profile photo changed');
      scope.$parent.userinfo.img_location = photo.img;
      scope.triggerpopup(event,0);
      }

    }
  };
}]);
