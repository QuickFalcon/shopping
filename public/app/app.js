var appModule = angular.module('appModule', ['ngRoute', 'ngCookies', 'headerComponentModule', 'mainNavigationComponentModule', 'dashboardComponentModule', 'quickViewPopupComponentModule', 'footerComponentModule', 'companyComponentModule', 'customerServiceComponentModule', 'policyComponentModule', 'myWallComponentModule', 'shopServiceModule']);

appModule.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider){
  $locationProvider.html5Mode(true);

  $routeProvider
    .when('/refactor', {
        template: '<dashboard-component is-logged-in="appCtrl.isLoggedIn" user-info="appCtrl.userInfo" load-full="appCtrl.loadFull" user-dashboard-merchant="appCtrl.userDashboardMerchant"></dashboard-component>'
    }).when('/refactor/dashboard', {
        template: '<dashboard-component is-logged-in="appCtrl.isLoggedIn" user-info="appCtrl.userInfo" load-full="appCtrl.loadFull" user-dashboard-merchant="appCtrl.userDashboardMerchant"></dashboard-component>'
    }).when('/refactor/policy', { // part of 'My Account'
        template: '<policy-component is-logged-in="appCtrl.isLoggedIn"></policy-component>'
    }).when('/refactor/customer_service', { // part of 'My Account'
        template: '<customer-service-component is-logged-in="appCtrl.isLoggedIn"></customer-service-component>'
    }).when('/refactor/company', { // part of 'My Account'
    template: '<company-component is-logged-in="appCtrl.isLoggedIn"></company-component>'
  }).when('/refactor/order_placed', {
    template: '<my-wall-component is-logged-in="appCtrl.isLoggedIn"></my-wall-component>'
  });
}]);

appModule.run(['$rootScope', '$location', function($rootScope, $location){

  $rootScope.$on('$routeChangeStart', function (event, next, current) {

      $rootScope.routechange = false;

  });

  // get userinfo end
  $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {  //Broadcasted after a route change has happened successfully.

    $rootScope.routechange = true;


    if(current && current.hasOwnProperty('$$route')) {
      $rootScope.title = current.$$route.title;
      $rootScope.metax = current.$$route.metax;
      $rootScope.SmartPathing = current.$$route.path;
      }
  });	// route change success end


  $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
      $rootScope.routechange = true;
  });

}]);


appModule.controller('appController',
['$scope', '$rootScope', '$location', '$route', '$http', '$cookies', 'shopService', 'userService', function($scope, $rootScope, $location, $route, $http, $cookies, shopService, userService){ // root controller

  var ctrl = this;

  // all user related data must be passed on 1 object
  ctrl.loadFull = false; // ng-view
  ctrl.isLoggedIn = false;
  ctrl.userInfo = { /* user data will be placed here*/ };
  ctrl.flag = "flag_us";
  ctrl.shippingAddress = { /* not sure if needed, but old code say needed for checkout page */};
  ctrl.billingAddress = { /* not sure if needed, but old code say needed for checkout page */ };
  ctrl.dashboardSliderData = null;

  ctrl.likedItems = null; //liked items, initialize at login
  ctrl.reviewedItems = null; //reviewed items, initialize at login
  ctrl.mailedItems = null; //mailed items, initialize at login


  ctrl.onInit = function(){
    // run all the initialization here, when not login

    shopService.getTopStores().then(function(data){
      ctrl.userDashboardMerchant = data.userDashboardMerchant;
      ctrl.loadFull = true;
    }, function(response){

    });
  };

  ctrl.getUserHistory = function(){

    userService.getHistory().then(function(data){
      ctrl.userInfo.userHistory = data;
    }, function(response){

    });
  };

  ctrl.getUserLikedItems = function(){
    userService.getLikedItems().then(function(data){
      ctrl.userInfo.likedItems = data;
      ctrl.userInfo.myPostsTotal = ctrl.userInfo.myPostsTotal + data.length;
    }, function(response){

    });
  };

  ctrl.getUserMailedItems = function(){
    userService.getMailedItems().then(function(data){
      ctrl.userInfo.mailedItems = data;
      ctrl.userInfo.myPostsTotal = ctrl.userInfo.myPostsTotal + data.length;
    }, function(response){

    });
  };

  ctrl.getUserReviewedItems = function(){
    userService.getReviewedItems().then(function(data){
      ctrl.userInfo.reviewedItems = data;
      ctrl.userInfo.myPostsTotal = ctrl.userInfo.myPostsTotal + data.length;
    }, function(response){

    })
  };

  // at login
  ctrl.initializeUser = function(data){

      //ctrl.purchaseButton = ""; //not sure if needed
      ctrl.success = 1;
      ctrl.isLoggedIn = true;
      ctrl.userInfo = data;

      ctrl.userInfo.userHistory = null;
      ctrl.userInfo.myPostsTotal = 0;

      if(ctrl.isLoggedIn){ // get posts - likes, collective, mail
        ctrl.getUserHistory();

        ctrl.getUserMailedItems();
        ctrl.getUserLikedItems();
        ctrl.getUserReviewedItems();
      }


      ctrl.userInfo.flag = ctrl.flag; //hacked, revise this
      var path = $location.path();

      if (ctrl.isLoggedIn && path == '/refactor') {
          $location.path('/refactor/dashboard'); //temporary changed
          $route.reload();
      }

      //cookies.put('user', ctrl.userInfo._id);


      ctrl.cook_signed = ctrl.userInfo._id;

      if (ctrl.userInfo.gender == 1) {
          ctrl.gendercls = "greyHeart";
      }
      else {
          ctrl.gendercls = "redHeart";
      }

      ctrl.shippingAddress.email = angular.copy(ctrl.userInfo.email);
      ctrl.shippingAddress.firstname = angular.copy(ctrl.userInfo.firstname);
      ctrl.shippingAddress.lastname = angular.copy(ctrl.userInfo.lastname);
      ctrl.shippingAddress.address = angular.copy(ctrl.userInfo.address);
      ctrl.shippingAddress.address1 = angular.copy(ctrl.userInfo.address1);
      ctrl.shippingAddress.address2 = angular.copy(ctrl.userInfo.address2);
      ctrl.shippingAddress.city = angular.copy(ctrl.userInfo.city);
      ctrl.shippingAddress.state = angular.copy(ctrl.userInfo.state);
      ctrl.shippingAddress.country = angular.copy(ctrl.userInfo.country);
      ctrl.shippingAddress.zip = angular.copy(ctrl.userInfo.zip);
      ctrl.shippingAddress.phone = angular.copy(ctrl.userInfo.phone);

      ctrl.billingAddress.firstname = angular.copy(ctrl.userInfo.firstname);
      ctrl.billingAddress.lastname = angular.copy(ctrl.userInfo.lastname);
      ctrl.billingAddress.address = angular.copy(ctrl.userInfo.address);
      ctrl.billingAddress.address1 = angular.copy(ctrl.userInfo.address1);
      ctrl.billingAddress.address2 = angular.copy(ctrl.userInfo.address2);
      ctrl.billingAddress.city = angular.copy(ctrl.userInfo.city);
      ctrl.billingAddress.state = angular.copy(ctrl.userInfo.state);
      ctrl.billingAddress.country = angular.copy(ctrl.userInfo.country);
      ctrl.billingAddress.zip = angular.copy(ctrl.userInfo.zip);
      ctrl.billingAddress.phone = angular.copy(ctrl.userInfo.phone);

      if (angular.isDefined(ctrl.userInfo.wishList)) {
          ctrl.saveprofile2 = ctrl.userInfo.wishList;
          ctrl.saved_item_number = shopService.calculateTotalItems(ctrl.saveprofile2);
          ctrl.cartDistinctDreamStore = shopService.getCartUniqueRetailer(ctrl.saveprofile2);
          ctrl.total_cart_distinct_wishstore = ctrl.cartDistinctDreamStore.length;
          ctrl.num_stores_wish = ctrl.saved_item_number;
      }
      else {
          ctrl.saveprofile2 = [];
          ctrl.saved_item_number = 0;
          ctrl.cartDistinctDreamStore = [];
          ctrl.total_cart_distinct_wishstore = 0;

          ctrl.num_stores_wish = 0;
      }


      ctrl.userstoptenDashboard = data.userDashboardMerchant;
      ctrl.userstoptenMen = data.usermenMerchant;
      ctrl.userstoptenWomen = data.userWomenMerchant;
      ctrl.userstoptenShoes = data.userShoesMerchant;
      ctrl.userstoptenAccessories = data.userAccessoriesMerchant;
      ctrl.userstoptenBeauty = data.userBeautyMerchant;
      ctrl.userstoptenKids = data.userKidsMerchant;
      ctrl.userstoptenHome = data.userHomeMerchant;
      ctrl.userstoptenGifts = data.userGiftsMerchant;
      ctrl.userstoptenLocal = data.userLocalMerchant;
      ctrl.subscribe_stores_coupon = data.subscribe_stores_coupon;
      ctrl.subscribe_stores_event = data.subscribe_stores_event;
      ctrl.varmenu = ctrl.userstoptenDashboard;
      ctrl.customizeMenuItemName = "dashboard";
      ctrl.pathing = "dashboard";
      ctrl.SmartPathing = "dashboard";
      ctrl.viewall = 0;
      ctrl.showup = 0;
      ctrl.load_click = 0;
      ctrl.bigCurrentPage = 1;
      ctrl.slide_stores = [];
      if (angular.isDefined(data.purchaseObj)) {
          ctrl.purchaseObj = data.purchaseObj;
      }
      if (angular.isDefined(data.orderObj)) {
          ctrl.orderObj = data.orderObj;
      }
      if (angular.isDefined(data.mailbox)) {
          ctrl.mailObj = data.mailbox;
      }
      ctrl.usermenu = "dashboard";
      ctrl.menuClicked = "dashboard"; // search within that zone


      ctrl.loadFull = true; // temporary, stop showing the loading icon
      return; //temporary

      if (angular.isDefined(ctrl.userstoptenDashboard)) {
          if (ctrl.userstoptenDashboard.length > 0) {
              ctrl.selected_merchantlist = angular.copy(ctrl.userstoptenDashboard);
              ctrl.slide_stores = angular.copy(ctrl.userstoptenDashboard);
              define_slider(ctrl.userstoptenDashboard, 'dashboard');
          }
          else {
              ctrl.selected_merchantlist = angular.copy(ctrl.featuredShoplistDashboard);
              console.log(ctrl.featuredShoplistDashboard);
              ctrl.slide_stores = angular.copy(ctrl.featuredShoplistDashboard);
              define_slider(ctrl.featuredShoplistDashboard, 'dashboard');
          }
      }
      else {
          ctrl.selected_merchantlist = angular.copy(ctrl.featuredShoplistDashboard);
          ctrl.slide_stores = angular.copy(ctrl.featuredShoplistDashboard);
          define_slider(ctrl.featuredShoplistDashboard, 'dashboard');
      }
      if (ctrl.userInfo.gender == 1) {
          ctrl.genderclass = " subnav-li-men";
      }
      var merge_required = false;
      var tempCartlength;
      var datacartlength;

      //ctrl.getRightSideBar(); // moved to the component - darwin
      var merge_required = false; // whether merge required or not
      if (angular.isDefined(data.cart)) // data.cart come from signed user cart
          datacartlength = data.cart.length; //user data cart length
      else
          datacartlength = 0;

      if (angular.isDefined(ctrl.userprofile2))
          tempCartlength = Object.keys(ctrl.userprofile2).length;
      else
          tempCartlength = 0;


      if (datacartlength > 0 && tempCartlength > 0) {
          ctrl.shoppingbag_cart_changed = true;
          $cookies.put('shoppingbag_cart_changed', true);
          var cnt = 0;
          merge_required = true;
          var dataSet = ctrl.userprofile2;
          var item;
          var cartItemUnsigned;
          var data_proid;  // take element by id
          var pushing;
          var ItemQuantity;
          for (var i = 0; i < datacartlength; i++) {
              pushing = true;
              item = data.cart[i]; // hold a data from tem cart
              data_proid = item.product[0].catalogId;  // take element by id
              IQuantity = item.quantity;
              for (var j = 0; j < tempCartlength; j++)   // run loop and try to find whether it is there
              {
                  cartItemUnsigned = ctrl.userprofile2[j].product[0].catalogId;
                  if (data_proid == cartItemUnsigned) // if it is there update quantity
                  {
                      ctrl.userprofile2[j].quantity = parseInt(ctrl.userprofile2[j].quantity) + parseInt(IQuantity);
                      pushing = false;
                      break;
                  }
                  if (( j + 1 == tempCartlength) && (pushing))            // if not there push the item
                  {
                      ctrl.userprofile2.push(item); // this value get from product list
                  }
              }
          }
          // after ctrl cart has been update call node to update database
          $http.post('/customers/update/cart',
              {updatedCart: ctrl.userprofile2})
              .success(function (data, status, headers, config) {
                  ctrl.cartDistinctStore = getcartUniqueRetailer(ctrl.userprofile2);
                  ctrl.total_cart_distinct_store = ctrl.cartDistinctStore.length;
                  var temp_cal = calculateItems(ctrl.userprofile2);
                  ctrl.cart_items_number = temp_cal;
                  ctrl.num_items = temp_cal;
                  ctrl.cartTotal();
              })
              .error(function (data, status, headers, config) {
                  console.log(data);
              });


      }
      else if (tempCartlength > 0) {
          // as user move from unsigned user to signed user user cart need to be updated
          // but if as mini cart remain same no need to check for updated
          $http.post('/customers/update/cart',
              {updatedCart: ctrl.userprofile2})
              .success(function (data, status, headers, config) {
                  console.log("No need to redefine cart old cart is okay");


              })
              .error(function (data, status, headers, config) {
                  console.log(data);
              });


      }
      else if (angular.isDefined(data.cart) && datacartlength > 0) {
          ctrl.shoppingbag_cart_changed = true;
          $cookies.put('shoppingbag_cart_changed', true);
          ctrl.userprofile2 = data.cart;       // new cart taking control update not required
          ctrl.cartDistinctStore = getcartUniqueRetailer(ctrl.userprofile2);
          ctrl.total_cart_distinct_store = ctrl.cartDistinctStore.length;
          var temp_cal = calculateItems(ctrl.userprofile2);
          ctrl.cart_items_number = temp_cal;
          ctrl.num_items = temp_cal;
          ctrl.cartTotal(); // calculate cart total from logic
      }
      else {
          ctrl.userprofile2 = [];
          ctrl.cartDistinctStore = [];
          ctrl.total_cart_distinct_store = 0;
          ctrl.cart_items_number = 0;
          ctrl.num_items = 0;
          var total = 0;
          ctrl.saving_total = 0;
          ctrl.saving_total_perItem = 0;
          ctrl.saving_total = 0;
          ctrl.shipping_cost = 0;
          ctrl.taxes = 0;
          ctrl.fullTotal = 0;


      }
      if ((path.indexOf('shoppingbag') > -1 || path.indexOf('scheckout') > -1) && ctrl.firsttime.loading == 0) {

          if (angular.isDefined(ctrl.userprofile2)) {
              if (ctrl.userprofile2.length > 0)
                  ctrl.initTwotapCheckoutCart();
          }
          if (angular.isDefined(ctrl.saveprofile2)) {
              if (ctrl.saveprofile2.length > 0)
                  ctrl.initTwotapwishOut();
          }


      }
      if (angular.isDefined(ctrl.cook_unsigned)) {
          $http.post('/unsigned_user_delete', {'unsignedId': ctrl.cook_unsigned})
              .success(function (data) {
                  console.log("successful");
              })
          $cookies.remove('unsignedUseridentity');
          console.log($cookies.get('unsignedUseridentity'));
          ctrl.cook_unsigned = undefined;
      }

      ///////////////
      ctrl.getmyLikeditem();

      ctrl.getmyRevieweditem();

      //ctrl.getmyMaileditem();

      if (angular.isDefined(ctrl.saveprofile2)) {

          if (ctrl.saveprofile2.length > 0) {
              for (var st = 0; st < ctrl.saveprofile2.length; st++) {

                  if (ctrl.saveprofile2[st].product[0].price_sale != -1 && ctrl.saveprofile2[st].product[0].price_sale != null) {

                      ctrl.saleproducts.push(ctrl.saveprofile2[st].product[0]);
                      console.log(ctrl.saveprofile2[st].product[0]);

                  }

                  if (st + 1 == ctrl.saveprofile2.length) {


                      ctrl.salenotification = angular.copy(ctrl.saleproducts.length);

                      console.log(ctrl.salenotification);
                  }
              }
          }
      }

      $http.post('/countunReadFlag')
          .success(function (data) {

              ctrl.undread_mails = data.count;

          });



  };

  ctrl.uninitializeUser = function(){

    ctrl.searchuser = {
        loginemail: "",
        password: ""
    }; //not sure if needed


    ctrl.pathTorch = [];
    var und;
    var free_me;
    ctrl.isLoggedIn = false;
    ctrl.success = 0;

    return; // temporary
    ctrl.userprofile2 = free_me;
    ctrl.saveprofile2 = free_me;
    ctrl.shoppingbag_cart_changed = true;
    $cookies.put('shoppingbag_cart_changed', true);
    $cookies.remove('shoppingbag_cart_id');
    ctrl.cart_items_number = 0;
    ctrl.saved_item_number = 0;
    ctrl.num_stores_wish = ctrl.saved_item_number;

    ctrl.total_cart_distinct_store = 0;
    ctrl.saving_total = 0;
    ctrl.shipping_cost = 0;
    ctrl.merchandiseTotal = 0;
    ctrl.taxes = 0;
    ctrl.fullTotal = 0;
    ctrl.user_saved_item_id = [];
    $cookies.remove("useridentity");
    ctrl.cook_signed = free_me;
    ctrl.purchase_button = "";
    ctrl.userInfo = free_me;

    $http.get('/api/auth/signout').success(function (data) {
        // ctrl.login=false;
        ctrl.userstopten = [];
        ctrl.userstoptenWomen = [];
        ctrl.userstoptenMen = [];
        ctrl.userstoptenShoes = [];
        ctrl.userstoptenAccessories = [];
        ctrl.userstoptenBeauty = [];
        ctrl.userstoptenKids = [];
        ctrl.userstoptenHome = [];
        ctrl.userstoptenGifts = [];
        ctrl.userstoptenLocal = [];
        ctrl.subscribe_stores_coupon = [];
        ctrl.subscribe_stores_event = [];
        ctrl.menuCategorySearch('dashboard');
        ctrl.after_login_location = '/dashboard';
        ctrl.num_stores = 0;
        ctrl.num_items = 0;
        ctrl.estimated_price_totals = "$0.0";
        ctrl.valid_coupons = 0;
        ctrl.valid_coupon_store = 0;
        ctrl.twotap_builtin_cart = undefined;
        ctrl.considered_items = [];
        ctrl.userprofile2 = [];
        ctrl.saveprofile2 = [];
        ctrl.shipping_chrg = undefined;
        ctrl.shipping_address = undefined;
        ctrl.billing_address = undefined;
        ctrl.card_details = undefined;
        ctrl.twotap_wishlist_cart = undefined;
        ctrl.ck_all = true;
        ctrl.tap = 1;
        ctrl.s_array = [];
        ctrl.cartDistinctStore = [];
        ctrl.total_cart_distinct_store = 0;
        ctrl.wishbag_cart_changed = true;
        ctrl.itemQuantity_wish = [];
        ctrl.considered_items_wish = [];
        ctrl.num_items_wish = 0;
        ctrl.num_stores_wish = 0;
        ctrl.estimated_price_totals_wish = "$0.0";
        ctrl.s_array_wish = [];
        ctrl.user_saved_item_id = [];
        ctrl.user_saved_item = undefined;
        // $location.path('/'); //redirect to unsigned user home
        // $route.reload();

        $scope.apply();
    }).error(function (err) {
        console.log("sign out Error: " + err);
        //$route.reload();
        $scope.apply();

    });
    temppath = {'poth': '#!/', 'label': 'HOME'};
    ctrl.pathTorch.push(temppath);
    $cookies.put('path', ctrl.pathTorch);
  };

  ctrl.openSocialPopup(product, tab event){
    ctrl.socialPopupProduct = product;
    ctrl.socialPopupTab = tab;
    /*if ($location.path().indexOf('/SOC') > -1) {
        if (angular.isDefined($scope.backupaltimages) && $scope.backupaltimages !== '') {
            $scope.socialPopupProduct.image_url = angular.copy($scope.backupaltimages);
        }
    }*/
  };

  ctrl.onInit();
}]);
