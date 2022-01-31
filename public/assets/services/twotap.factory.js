
UserApp.factory('twoTapService', function twoTapService($http, $q, $location, $cookies, $window) {

    return {
        'twoTapProductAvailability': function (pro_url) {
            var defer = $q.defer();

            $http.post('/twotap_cart_single_product', pro_url).then(function (response) {
                //    $scope.avail = response.data.availability;
                //    $scope.msg = response.data.message;
                var avail = false;
                var obj = {"timestamp": {}};
                var pri = 0;
                var ori_pri = 0;
                if (response.data.productCartDetails.unknown_urls.length > 0) {
                    window.alert('We cant get this product details ... unknwon url for checkout');
                    defer.reject(err);
                }
                else if (response.data.message == 'done' || response.data.message == 'has_failures') {
                    /*
                     $scope.cartProductStatus = response.data.productCartDetails;
                     $scope.twotap_builtin_cart_single = response.data.productCartDetails;
                     $scope.cart_id = response.data.productCartDetails.cart_id;

                     if(angular.isDefined(response.data.estimation))
                     $scope.$parent.estimated_move_price_totals =response.data.estimation.estimated_total_prices;
                     else {
                     if(angular.isDefined($scope.product.price_sale) && $scope.product.price_sale!='')
                     $scope.$parent.estimated_move_price_totals ={subtotal:$scope.product.price_sale };
                     else
                     $scope.$parent.estimated_move_price_totals ={subtotal:$scope.product.price };

                     }
                     if (response.data.message == 'has_failures') {

                     avail = false;
                     for (var si in $scope.twotap_builtin_cart_single.sites) {
                     for (var pmd5 in $scope.twotap_builtin_cart_single.sites[si].failed_to_add_to_cart) {

                     $scope.md5prokey = pmd5;

                     if (pmd5.image == "" || pmd5.image == null) {

                     $scope.twotap_builtin_cart_single.sites[si].failed_to_add_to_cart[pmd5].image = $scope.product.image_url;

                     }
                     $scope.twotap_builtin_cart_single.sites[si].failed_to_add_to_cart[pmd5].catalogId = $scope.product.catalogId;
                     if(angular.isDefined($scope.twotap_builtin_cart_single.sites[si].failed_to_add_to_cart[pmd5].price) && $scope.twotap_builtin_cart_single.sites[si].failed_to_add_to_cart[pmd5].price!=null)
                     {
                     pri = $scope.twotap_builtin_cart_single.sites[si].failed_to_add_to_cart[pmd5].price.substring(1);
                     $scope.current_price = parseFloat(pri, 10);
                     }

                     $scope.alt_images = response.data.productCartDetails.sites[si].failed_to_add_to_cart[pmd5].alt_images;

                     }
                     $scope.shipping_countries_support = $scope.twotap_builtin_cart_single.sites[si].shipping_countries_support;
                     $scope.billing_countries_support = $scope.twotap_builtin_cart_single.sites[si].billing_countries_support;


                     }
                     $scope.twotapapidataready = 1;

                     }
                     else if (response.data.message == 'done') {

                     avail = true;
                     for (var si in $scope.twotap_builtin_cart_single.sites) {
                     $scope.shipping_countries_support = $scope.twotap_builtin_cart_single.sites[si].shipping_countries_support;
                     $scope.billing_countries_support = $scope.twotap_builtin_cart_single.sites[si].billing_countries_support;

                     for (var pmd5 in $scope.twotap_builtin_cart_single.sites[si].add_to_cart) {

                     $scope.md5prokey = pmd5;
                     if (pmd5.image == "" || pmd5.image == null) {
                     $scope.twotap_builtin_cart_single.sites[si].add_to_cart[pmd5].image = $scope.product.image_url;
                     }
                     $scope.twotap_builtin_cart_single.sites[si].add_to_cart[pmd5].catalogId = $scope.product.catalogId;
                     pri = $scope.twotap_builtin_cart_single.sites[si].add_to_cart[pmd5].price.substring(1);
                     $scope.current_price = parseFloat(pri, 10);
                     $scope.alt_images = $scope.twotap_builtin_cart_single.sites[si].add_to_cart[pmd5].alt_images;


                     if($scope.cartProductStatus.sites[si].add_to_cart[pmd5].required_field_values.hasOwnProperty('color'))
                     $scope.colorjson = $scope.cartProductStatus.sites[si].add_to_cart[pmd5].required_field_values.color;

                     if($scope.cartProductStatus.sites[si].add_to_cart[pmd5].required_field_values.hasOwnProperty('size'))
                     $scope.sizejson = $scope.cartProductStatus.sites[si].add_to_cart[pmd5].required_field_values.size;


                     if($scope.cartProductStatus.sites[si].add_to_cart[pmd5].required_field_values.hasOwnProperty('option'))
                     $scope.optionjson = $scope.cartProductStatus.sites[si].add_to_cart[pmd5].required_field_values.option;

                     // if($scope.twotap_builtin_cart_single.sites[si].add_to_cart[pmd5].hasOwnProperty('original_price'))
                     // {    ori_pri = $scope.twotap_builtin_cart_single.sites[si].add_to_cart[pmd5].original_price.substring(1);
                     // $scope.original_price = parseFloat(ori_pri, 10);
                     // $scope.bonus = $scope.original_price - $scope.current_price;
                     // }
                     $scope.required_field_names = angular.copy(response.data.productCartDetails.sites[si].add_to_cart[pmd5].required_field_names);

                     }
                     }
                     $scope.twotapapidataready = 1;

                     }
                     else {
                     $scope.twotapapidataready = 1;
                     }

                     var tem;
                     var pota = [];
                     var length = 0;
                     var ret;
                     if (!Date.now) {
                     timeCurrent = function now() {
                     return new Date().getTime();
                     }
                     }
                     else {
                     timeCurrent = Date.now();
                     }

                     // $window.localStorage.removeItem("recentI");

                     if (angular.isDefined($window.localStorage.getItem('recentI')) && $window.localStorage.getItem('recentI') != null) {
                     tem = $window.localStorage.getItem('recentI');
                     pota = JSON.parse(tem);

                     length = Object.keys(pota).length;


                     // we are gonna iterate for 20 times
                     if (length >= 19) {
                     length = 19;

                     }

                     obj["timestamp"] = {};
                     obj["timestamp"][timeCurrent] = $scope.twotap_builtin_cart_single;


                     var temp;
                     for (var i = length; i >= 0; i--) {
                     if (i == 0)
                     pota[i] = obj;
                     else
                     pota[i] = pota[i - 1];
                     }

                     }
                     else {

                     // pota[length] =$scope.twotap_builtin_cart_single;
                     obj.timestamp[timeCurrent] = $scope.twotap_builtin_cart_single;
                     pota[0] = obj;

                     }


                     ret = JSON.stringify(pota);
                     $window.localStorage.setItem('recentI', ret);
                     var keyid;
                     var keys = [];
                     var price;
                     var eststring = "";



                     var sites_arr = [];
                     var skey;
                     var md5prokey;
                     var con_j = [];
                     var site_arraysite_array = [];
                     for (skey in response.data.productCartDetails.sites) {
                     sites_arr.push(skey);
                     $scope.skey = skey;
                     site_arraysite_array.push(skey);
                     }

                     $scope.s_array = sites_arr;  //make an array of sites

                     var para_json = {
                     "cart_id": response.data.productCartDetails.cart_id,
                     "fields_input": {}

                     }
                     var shoption = "cheapest";
                     var cart_by_site;
                     var product_key_md5;
                     var j;
                     var gcard;
                     var gpin;
                     for (var counter = 0; counter < site_arraysite_array.length; counter++) // for one site
                     {
                     siteskey = site_arraysite_array[counter]; // getting single site

                     // set shipping option along price
                     var found_ship = false;
                     angular.forEach(response.data.productCartDetails.sites[siteskey].shipping_options, function (shipvalue, shipkey) {
                     if (!found_ship) {
                     response.data.productCartDetails.sites[siteskey].shipping_option = shipkey;
                     shoption = response.data.productCartDetails.sites[siteskey].shipping_option;
                     }
                     if (shipvalue == 'cheapest') {
                     found_ship = true;
                     }
                     else if (shipvalue == 'default') {
                     found_ship = true;
                     }
                     });


                     var address_user = {};

                     if (angular.isDefined($scope.shipping_address))
                     address_user = {
                     "shipping_address": $scope.shipping_address.address,
                     "shipping_city": $scope.shipping_address.city,
                     "shipping_state": $scope.shipping_address.state,
                     "shipping_country": $scope.shipping_address.country,
                     "shipping_zip": $scope.shipping_address.zip
                     };


                     if (angular.isDefined(shoption)) {

                     para_json.fields_input[siteskey] = {
                     "noauthCheckout": address_user,
                     "addToCart": {
                     // product_md5 will be dynamic
                     },
                     "shipping_option": shoption
                     }

                     }
                     else {
                     para_json.fields_input[siteskey] = {
                     "noauthCheckout": address_user,
                     "addToCart": {
                     // product_md5 will be dynamic
                     }
                     }
                     }


                     cart_by_site = response.data.productCartDetails.sites[siteskey].add_to_cart; // each site have single add to cart
                     j = 0;
                     for (product_key_md5 in cart_by_site) // each cart have multiple product key md5
                     {
                     para_json.fields_input[siteskey]["addToCart"][product_key_md5] = {};
                     para_json.fields_input[siteskey]["addToCart"][product_key_md5]["quantity"] = 1;
                     }
                     }
                     // console.log(para_json);
                     $http.post("https://api.twotap.com/v1.0/cart/estimates?public_token=" + $scope.twotap_public_token, para_json).then(function (response3) {

                     var n;
                     var siter_id;
                     var shipping_method;
                     var pata = $location.path();
                     //console.log(response3.data);
                     $scope.estimate = response3.data.estimated_total_prices;
                     if ($scope.loggedin != 1) {
                     eststring = "Estimated ";
                     }

                     for (var p in $scope.estimate) {

                     if (p == "subtotal") {

                     var jk = $scope.estimate[p].substring(1);
                     $scope.current_price = parseFloat(jk, 10);


                     if ($scope.product.price_sale != '' && $scope.product.price_sale != null)
                     $scope.product.price_sale = $scope.current_price;
                     else
                     $scope.product.price = $scope.current_price;
                     }

                     else if (p == "shipping_price") {
                     $scope.shipping_price = parseFloat($scope.estimate[p].substring(1), 10);

                     }
                     else if (p == "sales_tax") {
                     $scope.sales_tax = parseFloat($scope.estimate[p].substring(1), 10)

                     }
                     else if (p == "final_price") {

                     $scope.final_price = parseFloat($scope.estimate[p].substring(1), 10);


                     }


                     }


                     }, function (response3) {


                     var temp = {"estimated_price_totals": {"final_price": "$0.0", "subtotal": "$0.0"}};

                     });
                     */
                    defer.resolve(response.data);

                }
                else {
                    $scope.avail = false;
                    defer.reject("No way");
                }


            }, function (response) {
                console.log("api call error");
                // $scope.avail = false;
                // $scope.msg = response.data.message;
                // $scope.twotapapidataready = 1;
                // $scope.$parent.proLoading = false;

                defer.reject(err);

            });

            return defer.promise;
        }


    };

})// factory end


