angular.module('SSApp').directive('cartComponent', ['$sce', '$http', '$window', '$cookies', '$route', '$location', '$interval', 'setRequiredfieldCart', '$anchorScroll', function ($sce, $http, $window, $cookies, $route, $location, $interval, setRequiredfieldCart, $anchorScroll) {
    return {
        restrict: 'E',
        templateUrl: 'assets/directive/components/shopping-bag/cartView.html',
        link: function (scope) {
            var $parentScope = scope.$parent;
            // scope.ss_wish_load = 1;
            // scope.ss_cart_load = 1;
            $parentScope.selected = "";
            var tempo, pushtrue = true, pather = $location.path();
            if (angular.isDefined(scope.pathTorch)) {
                tempo = scope.pathTorch;
            }
            $parentScope.checkoutpossible = true;
            $parentScope.ck_all = true;
            $parentScope.twotap_builtin_cart = undefined;
            $parentScope.twotap_wishlist_cart = undefined;
            $parentScope.estimated_price_totals = {};
            $parentScope.saving = 0;
            $parentScope.failed_sub_total = 0;
            (function savedItemsSmoothScroller() {
                var $html = $('html'), selector = location.href.substring(location.href.lastIndexOf('#')), $offset_target;
                console.log(selector);
                if (selector.charAt(1) !== '!') { // Make sure it's not a route (eg. #!/shoppingbag)
                    $offset_target = $(selector);
                    $parentScope.$watchGroup(["twotap_builtin_cart", "twotap_wishlist_cart"], function (value) {
                        if (value && $offset_target.length) {
                            $html.stop().animate({
                                scrollTop: $offset_target.offset().top
                            }, 500);
                        }
                    });
                }
            }());
            var pro_url_wish, url, pro_url, temppath, i, k;
            url = '#!/shoppingbag';
            temppath = {
                'poth': url,
                'label': 'Shopping bag'
            };
            $parentScope.addTobagPossible = true;
            $parentScope.tap = 1;
            $parentScope.step = 1; // back to step 1
            // bread crumb logic
            for (i = 0; i < tempo.length; i++) {
                if (tempo[i].label == temppath.label) {
                    pushtrue = false;
                    for (k = i + 1; k < tempo.length; k++) { // remove laters
                        tempo.splice(k, 1);
                    }
                    break;
                }
                if (i + 1 == tempo.length) {
                    if (pushtrue) {
                        tempo.push(temppath);
                    }
                }
            }
            scope.reset_cart = function () {
                $parentScope.num_stores = 0;
                $parentScope.num_items = 0;
                $parentScope.estimated_price_totals = {
                    "final_price": "$0.0",
                    "subtotal": "$0.0"
                };
                $parentScope.valid_coupons = 0;
                $parentScope.invalid_coupons = 0;
                scope.valid_coupon_store = 0;
                $parentScope.twotap_builtin_cart = undefined;
                $parentScope.saving = 0;
                scope.ss_cart_load = 0;
                scope.tap = 0;
                scope.step = 1;
                scope.failed_item_num = 0;
                $parentScope.failed_sub_total = 0;
                $parentScope.num_stores = 0; // when checking out single
                pro_url = {};
                $parentScope.fullTotal = undefined;
                $parentScope.twotap_builtin_cart = undefined;
                if (scope.loggedin) {
                    $http.post('/customers/update/cart', {
                        updatedCart: []
                    }).success(function (data, status, headers, config) {
                        scope.userprofile2 = [];
                        $parentScope.getCartItemsJson();
                        $parentScope.cartDistinctStore = $parentScope.getcartUniqueRetailerFromChild(scope.userprofile2);
                        $parentScope.total_cart_distinct_store = scope.cartDistinctStore.length;
                    }).error(function (data, status, headers, config) {
                        console.log(data);
                    });
                } else {
                    $http.post('/guest/update/cart', {
                        updatedCart: scope.userprofile2,
                        guestid: $cookies.get('unsignedUseridentity')
                    }).success(function (data, status, headers, config) {
                        $parentScope.getCartItemsJson();
                        $parentScope.cartDistinctStore = $parentScope.getcartUniqueRetailerFromChild(scope.userprofile2);
                        $parentScope.total_cart_distinct_store = scope.cartDistinctStore.length;
                    }).error(function (data, status, headers, config) {
                        console.log(data);
                        scope.common_popup_header = "Add to cart Error";
                        scope.common_popup_message = "Error " + data;
                    });
                }
                $parentScope.cart_items_number = 0;
                $parentScope.total_cart_distinct_store = 0;
                $parentScope.cartDistinctStore = [];
            };
            scope.reset_wishlist = function () {
                $parentScope.cartDistinctDreamStore = undefined;
                $parentScope.twotap_wishlist_cart = undefined;
                $parentScope.saved_item_number = 0;
                pro_url_wish = undefined;
                $parentScope.num_items_wish = 0;
                $parentScope.num_stores_wish = 0;
                $parentScope.estimated_price_totals_wish = {
                    "final_price": "$0.0",
                    "subtotal": "$0.0"
                };
                // $parentScope.estimated_move_price_totals = {"final_price": "$0.0", "subtotal": "$0.0"};
                $parentScope.twotap_wishlist_cart = undefined;
                scope.ss_wish_load = 0;
                scope.asyncIsUserLoggedIn(function (isLoggedIn) {
                    if (isLoggedIn) {
                        $http.post('/customers/update/wishlist', {
                            wishList: []
                        }).success(function (data, status, headers, config) {
                            scope.saveprofile2 = [];
                        }).error(function (data, status, headers, config) {
                            console.log(data);
                        });
                    }
                });
            };
            // (proMd5,item,prokey,wsitekey,'wish')
            scope.set_current_product_pro_update = function (pro, item, prokey, sitekey, cart_or_wishlist, add_fail) {
                $parentScope.quickview_update = 1;
                $parentScope.set_current_product_pro_mother(pro, item, prokey, sitekey, add_fail);
                $parentScope.quickvew = 0;
                $parentScope.qvLoading = true;
                $parentScope.update_cart_or_wish = cart_or_wishlist;
                $parentScope.current_sitekey = sitekey;
                $parentScope.current_prokey = prokey;
            };
            // when click to quick view
            scope.set_current_product_pro = function (pro, item, prokey, sitekey) {
                $parentScope.qvLoading = true;
                $parentScope.quickview_update = 0;
                $parentScope.quickvew = 0;
                var temp, potap = [], length = 0, retp, timeCurrent;
                var jsonTemp = {
                    "timestamp": {}
                };
                var mobile_arr = {};
                // var jsonTemp ={"sites" : {}};
                if (!Date.now) {
                    timeCurrent = function now() {
                        return new Date().getTime();
                    }
                } else {
                    timeCurrent = Date.now();
                }
                $parentScope.set_current_product_pro_mother(pro, item, prokey, sitekey);
            };
            var tem, pota, tem2, pota2;
            if (angular.isDefined($window.localStorage.getItem('recentI'))) {
                var tem = $window.localStorage.getItem('recentI');
                //pota = angular.fromJson(tem);
                pota = JSON.parse(tem);
                $parentScope.recentItems = pota;
                var tem2 = $window.localStorage.getItem('recent2');
                //pota = angular.fromJson(tem);
                pota2 = JSON.parse(tem2);
                $parentScope.recentItems2 = pota2;
            } else {
                $parentScope.recentItems = undefined;
            }
            if (!angular.isDefined(scope.step)) {
                $parentScope.step = 1;
                $parentScope.tap = 1;
            }
            var requestedItems;
            var obj;
            var url_product; // url temporary
            var checkoutRequest = {};
            //scope.browser_action = "Goback";
            scope.browser_action = "Go Back";
            var ind;
            var counter = 0;
            if (!angular.isDefined(scope.card_details)) $parentScope.card_details = {};
            var quantity_product;
            var sites_arr = [];
            var storeProducts = [];
            var ramp = [];
            var sikey;
            var md5pro;
            var timeCurrent;
            var sk;
            $parentScope.considered_items = [];
            $parentScope.considered_items_wish = [];
            scope.gotocart = function (url) {
                $anchorScroll();
            };
            scope.gotoSaved = function () {
                $location.hash('saved');
                $anchorScroll();
            };
            scope.set_cartitem_color = function (itemByColor, pro) {
                pro = itemByColor;
            };
            scope.quantityChange = function (quantity, datacart, wsitekey, prokey, index) {
                console.log("do any one hit me");
                if (index == -9) {
                    if (datacart.sites[wsitekey].hasOwnProperty('add_to_cart')) {
                        $parentScope.twotap_wishlist_cart.sites[wsitekey].add_to_cart[prokey].required_field_values.quantity = quantity;
                        $parentScope.twotap_wishlist_cart.sites[wsitekey].add_to_cart[prokey].quantity = quantity;
                    } else {
                        $parentScope.twotap_wishlist_cart.sites[wsitekey].failed_to_add_to_cart[prokey].required_field_values.quantity = quantity;
                        $parentScope.twotap_wishlist_cart.sites[wsitekey].failed_to_add_to_cart[prokey].quantity = quantity;
                    }
                    setRequiredfieldCart.userCartRefresh(datacart, scope.saveprofile2).then(function (responsep) {
                            $parentScope.saveprofile2 = responsep;
                            // update_cart_quantity(datacart, responsep, index);
                            // $parentScope.saved_item_number = $parentScope.calculateItemsFromChild(responsep);
                            // $parentScope.cartDistinctDreamStore = $parentScope.getcartUniqueRetailerFromChild(responsep);
                            //  $parentScope.num_stores_wish = scope.saved_item_number;
                        })
                        // $parentScope.count_items(datacart, index, scope.considered_items_wish);
                    $parentScope.estimateFunctionTop(datacart, index, scope.considered_items_wish); // no need to change the items
                } else {
                    var old_quanity = 0;
                    var quantity_inc = 0;
                    var quantity_dec = 0;
                    var diff = 0;
                    if (index == -100) {
                        var o_quanity = angular.copy(scope.twotap_builtin_cart.sites[wsitekey].failed_to_add_to_cart[prokey].required_field_values.quantity);
                        old_quanity = parseInt(o_quanity);
                        diff = scope.twotap_builtin_cart.sites[wsitekey].failed_to_add_to_cart[prokey].orig_price - parseFloat(scope.twotap_builtin_cart.sites[wsitekey].failed_to_add_to_cart[prokey].price.substring(1), 10);
                        if (quantity > old_quanity) // we need to add price saving
                        {
                            quantity_inc = (quantity - old_quanity);
                            $parentScope.saving = scope.saving + (diff * quantity_inc);
                            //scope.twotap_builtin_cart.sites[wsitekey].
                            $parentScope.twotap_builtin_cart.sites[wsitekey].quantity_store_wise = scope.twotap_builtin_cart.sites[wsitekey].quantity_store_wise + quantity_inc;
                        } else if (old_quanity > quantity) // we need to add price saving
                        {
                            quantity_dec = (old_quanity - quantity);
                            $parentScope.saving = scope.saving - (diff * quantity_dec);
                            $parentScope.twotap_builtin_cart.sites[wsitekey].quantity_store_wise = scope.twotap_builtin_cart.sites[wsitekey].quantity_store_wise - quantity_dec;
                        }
                        $parentScope.twotap_builtin_cart.sites[wsitekey].failed_to_add_to_cart[prokey].required_field_values.quantity = quantity;
                        $parentScope.twotap_builtin_cart.sites[wsitekey].failed_to_add_to_cart[prokey].quantity = quantity;
                    } else {
                        var o_quanity = angular.copy(scope.twotap_builtin_cart.sites[wsitekey].add_to_cart[prokey].required_field_values.quantity);
                        old_quanity = parseInt(o_quanity);
                        diff = scope.twotap_builtin_cart.sites[wsitekey].add_to_cart[prokey].orig_price - parseFloat(scope.twotap_builtin_cart.sites[wsitekey].add_to_cart[prokey].price.substring(1), 10);
                        if (quantity > old_quanity) // we need to add price saving
                        {
                            quantity_inc = (quantity - old_quanity);
                            $parentScope.saving = scope.saving + (diff * quantity_inc);
                            //scope.twotap_builtin_cart.sites[wsitekey].
                            $parentScope.twotap_builtin_cart.sites[wsitekey].quantity_store_wise = scope.twotap_builtin_cart.sites[wsitekey].quantity_store_wise + quantity_inc;
                        } else if (old_quanity > quantity) // we need to add price saving
                        {
                            quantity_dec = (old_quanity - quantity);
                            $parentScope.saving = scope.saving - (diff * quantity_dec);
                            $parentScope.twotap_builtin_cart.sites[wsitekey].quantity_store_wise = scope.twotap_builtin_cart.sites[wsitekey].quantity_store_wise - quantity_dec;
                        }
                        $parentScope.twotap_builtin_cart.sites[wsitekey].add_to_cart[prokey].required_field_values.quantity = quantity;
                        $parentScope.twotap_builtin_cart.sites[wsitekey].add_to_cart[prokey].quantity = quantity;
                    }
                    // $parentScope.count_items(datacart, index, scope.considered_items);
                    setRequiredfieldCart.userCartRefresh(scope.twotap_builtin_cart, scope.userprofile2).then(function (responsep) {
                        $parentScope.userprofile2 = responsep;
                        //update_cart_quantity(scope.twotap_builtin_cart, scope.userprofile2, index);
                        // $parentScope.cartDistinctStore = $parentScope.getcartUniqueRetailerFromChild(responsep);
                        // $parentScope.cart_items_number = $parentScope.calculateItemsFromChild(responsep);
                        if (scope.ck_all) scope.num_items = angular.copy(scope.cart_items_number);
                        // $parentScope.cartTotal();
                    })
                    $parentScope.estimateFunctionTop(datacart, index, scope.considered_items); // no need to change the items
                }
            };
            function update_cart_quantity(datacart, profile2, index) {
                if (index == -9) { // wishlist
                    $http.post('/customers/update/wishlist', {
                        wishList: scope.saveprofile2
                    }).success(function (data, status, headers, config) {
                        console.log(data);
                    }).error(function (data, status, headers, config) {
                        console.log(data);
                    });
                } else {
                    scope.asyncIsUserLoggedIn(function (isLoggedIn) {
                        if (isLoggedIn) {
                            $http.post('/customers/update/cart', {
                                updatedCart: scope.userprofile2
                            }).success(function (data, status, headers, config) {
                                $parentScope.shoppingbag_cart_changed = true; //
                                $cookies.put('shoppingbag_cart_changed', true);
                            }).error(function (data, status, headers, config) {
                                console.log(data);
                            });
                        } else if (angular.isDefined($cookies.get('unsignedUseridentity'))) {
                            $http.post('/guest/update/cart', {
                                updatedCart: scope.userprofile2,
                                guestid: $cookies.get('unsignedUseridentity')
                            }).success(function (data, status, headers, config) {
                                console.log(data);
                            }).error(function (data, status, headers, config) {
                                console.log(data);
                            });
                        }
                    });
                }
            }
            scope.requiredvalueChange = function (required_value, datacart, wsitekey, prokey, index) {
                console.log(" required value change");
                if (index == -9) { // wishlist
                    $parentScope.twotap_wishlist_cart.sites[wsitekey].add_to_cart[prokey].required_field_values = required_value;
                    $parentScope.twotap_wishlist_cart.sites[wsitekey].add_to_cart[prokey].quantity = required_value.quantity;
                    $parentScope.estimateFunctionTop(datacart, index, scope.considered_items_wish); // no need to change the items
                    update_cart(datacart, [], scope.saveprofile2, index)
                } else {
                    if (index == -100) { // failed cart
                        $parentScope.twotap_builtin_cart.sites[wsitekey].failed_to_add_to_cart[prokey].required_field_values = required_value;
                    } else {
                        $parentScope.twotap_builtin_cart.sites[wsitekey].add_to_cart[prokey].required_field_values = required_value;
                    }
                    $parentScope.estimateFunctionTop(datacart, index, scope.considered_items); // no need to change the items
                    update_cart(datacart, scope.userprofile2, index);
                }
            };
            /////////////////////////////////////////////////////////////////////////////////////////////////////
            /////////////////////// FUNCTION THAT UPDATE QUANTITY IN OUR CART ////////////////////////////////////
            //////////////////////////////////////////////////////////////////////////////////////////////////////
            function update_cart(datacart, profile2, index) {
                var sikey;
                for (sikey in datacart.sites) {
                    number_of_products = 0;
                    for (var md5pro in datacart.sites[sikey].add_to_cart) {
                        for (var p = 0; p < profile2.length; p++) {
                            // if(scope.userprofile2[p].productMD5==md5pro)
                            if (profile2[p].chkout_url == datacart.sites[sikey].add_to_cart[md5pro].original_url) {
                                if (index == -9) { // wishlist
                                    $parentScope.saveprofile2[p].required_field_values = datacart.sites[sikey].add_to_cart[md5pro].required_field_values;
                                    for (var ix = 0; ix < 5000; ix++) {
                                        if (ix == 4999) {
                                            $http.post('/customers/update/wishlist', {
                                                wishList: scope.saveprofile2
                                            }).success(function (data, status, headers, config) {
                                                console.log(data);
                                            }).error(function (data, status, headers, config) {
                                                console.log(data);
                                            });
                                        }
                                    }
                                } else {
                                    $parentScope.userprofile2[p].required_field_values = datacart.sites[sikey].add_to_cart[md5pro].required_field_values;
                                }
                                for (var ix = 0; ix < 5000; ix++) {
                                    if (ix == 4999) {
                                        $http.post('/customers/update/cart', {
                                            updatedCart: scope.userprofile2
                                        }).success(function (data, status, headers, config) {
                                            $parentScope.shoppingbag_cart_changed = true; //
                                            $cookies.put('shoppingbag_cart_changed', true);
                                        }).error(function (data, status, headers, config) {
                                            console.log(data);
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }
            var lefyInterval;
            scope.leftcmbhistory = 0;
            scope.stoplefyInterval = function () {
                scope.leftcmbhistory = 0;
                $interval.cancel(lefyInterval);
            };
            // left drop down events
            scope.browser_method = function (val) {
                scope.leftcmbhistory = 0;
                lefyInterval = $interval(function () {
                    if (scope.leftcmbhistory > 1000) {
                        scope.stoplefyInterval();
                        // window.alert(val);
                        if (val == "Go Back") {
                            goBack();
                        } else if (val == "Last Search") {
                            $parentScope.bigCurrentPage = 1;
                            $parentScope.load_click = 0;
                            $parentScope.viewall = 0;
                            $parentScope.showup = 0;
                            $parentScope.SearchVisible = false;
                            $parentScope.selected_sorting = "relevance";
                            $parentScope.globalSearch = true;
                            var lastsearchObj = $cookies.get('lastquerysearch');
                            if (angular.isDefined(scope.lastsearchobj)) {
                                $parentScope.queryobj = angular.copy(scope.lastsearchobj);
                                $parentScope.intervalgapGeneratelink(); // create link
                                $location.path('/search');
                                $route.reload();
                            }
                            //  window.alert(val);
                        } else if (val == "Last Shop") {
                            if (angular.isDefined($cookies.get('lastmerchant'))) {
                                var smerchant = $cookies.get('lastmerchant');
                                var url = 'storechosen/' + smerchant;
                                $location.path(url);
                                $route.reload();
                            }
                        } else if (val == "Last Item") {
                            if (angular.isDefined($cookies.get('lastcatalog')) && angular.isDefined($cookies.get('lastcatalogtitle'))) {
                                var url = "SOC/" + $cookies.get('lastcatalog') + "/" + $cookies.get('lastcatalogtitle');
                                $location.path(url);
                                $route.reload();
                            }
                            // window.alert(val);
                        } else if (val == "Dashboard") {
                            scope.asyncIsUserLoggedIn(function (isLoggedIn) {
                                if (isLoggedIn) {
                                    $location.path('/dashboard');
                                    $route.reload();
                                } else {
                                    $location.path('/');
                                    $route.reload();
                                }
                            });
                        }
                    }
                    scope.leftcmbhistory = scope.leftcmbhistory + 505;
                }, 505);
            };
            scope.$on('checkout_step2', function (e) {
                if (scope.ck_all) {
                    scope.twotapCheckoutCart(2);
                } else {
                    var temp_merchant = scope.cur_merchant;
                    scope.twotapCheckoutMerchantWise(temp_merchant, 2);
                }
            });
            scope.$on('quanChanged', function (e) {
                if (scope.ck_all) {
                    scope.quantityChange(scope.required_field_values.quantity, scope.twotap_builtin_cart, scope.current_sitekey, scope.current_prokey, -1);
                } else {
                    scope.quantityChange(scope.required_field_values.quantity, scope.twotap_builtin_cart, scope.current_sitekey, scope.current_prokey, 1);
                }
            });
            scope.$on('wingChanged', function (e) { // wish list quantity changed
                scope.quantityChange(scope.required_field_values.quantity, scope.twotap_wishlist_cart, scope.current_sitekey, scope.current_prokey, -9);
            });
            scope.$on('cartChanged', function (e) {
                console.log("broad cast cartChanged working");
                scope.ss_cart_load = 1;
                if (scope.ck_all) {
                    scope.twotapCheckoutCart(1);
                } else {
                    var temp_merchant = scope.cur_merchant;
                    scope.twotapCheckoutMerchantWise(temp_merchant, 1);
                }
            });
            // following broadcast for move to cart
            scope.$on('movetocartChanged', function (e) {
                console.log("broad cast move to cart working");
                scope.ss_cart_load = 2;
                if (scope.ck_all) {
                    scope.twotapCheckoutCart(1);
                } else {
                    var temp_merchant = scope.cur_merchant;
                    scope.twotapCheckoutMerchantWise(temp_merchant, 1);
                }
            });
            scope.$on('cartChangedDelete', function (e) {
                console.log("broad cast cartChanged working");
                if (scope.ck_all) {
                    scope.twotapCheckoutCart(1);
                } else {
                    var temp_merchant = scope.cur_merchant;
                    scope.twotapCheckoutMerchantWise(temp_merchant, 1);
                }
            });
            scope.$on('wishChanged', function (e) {
                scope.ss_wish_load = 1;
                console.log("broad cast wish changed working");
                scope.twotapwishOut(1);
            });
            scope.$on('movetowishChanged', function (e) {
                scope.ss_wish_load = 2;
                console.log("broad cast wish changed working");
                scope.twotapwishOut(1);
            });
            scope.$on('wishChangedDelete', function (e) {
                console.log("broad cast wish changed delete working");
                scope.twotapwishOut(1);
            });
            var temp_fieldName;
            scope.twotapCheckoutCart = function (step) {
                    $parentScope.step = step;
                    // not logged in quit
                    // move to cart true
                    if (!(scope.mcart)) { // defined and check out all true
                        if (angular.isDefined(scope.twotap_builtin_cart) && scope.ck_all) {
                            if (scope.step == 2) { // if step ==2 that goes to checkout page
                                scope.ss_cart_load = 0;
                                if (scope.failed_item_num > 0) { // do not allow to checkout if any failed item there
                                    $parentScope.common_popup_message = "Please Remove unavailable items before proceed";
                                    $parentScope.common_popup_header = "Unavailable Items ";
                                    $('#commonPopup').modal('show');
                                    console.log("you need to remove unavailable items for level 2");
                                    $parentScope.step = 1;
                                    return;
                                }
                                scope.asyncIsUserLoggedIn(function (isLoggedIn) {
                                    if (!isLoggedIn) {
                                        $parentScope.common_popup_message = "Login to proceed";
                                        $parentScope.common_popup_header = "Login required ";
                                        $('#commonPopup').modal('show');
                                        $parentScope.step = 1;
                                        return;
                                    } else if (scope.checkoutpossible) {
                                        $parentScope.tap = 0;
                                        $location.path('/scheckout');
                                        $route.reload();
                                        return;
                                    } else if (!scope.checkoutpossible) {
                                        $parentScope.step = 1;
                                        $parentScope.common_popup_message = "Please Remove invalid coupon code before proceed";
                                        $parentScope.common_popup_header = "Invalid Coupon code";
                                        $('#commonPopup').modal('show');
                                        return;
                                    }
                                });
                            }
                            //
                        } else if (angular.isDefined(scope.twotap_builtin_cart) && !(scope.ck_all)) { // it's come from check out single
                            if (scope.step == 2) {
                                $parentScope.tap = 1;
                                $parentScope.step = 1; // back to step 1
                                console.log("you are in single checkout option");
                            }
                        }
                    }
                    var temp_changed;
                    $parentScope.ck_all = true;
                    scope.itemQuantity = [];
                    checkoutRequest = {};
                    obj = scope.userprofile2; // my custom cart data
                    url_product = "";
                    counter = 0; // keeping product url
                    requestedItems = [];
                    $parentScope.considered_items = [];
                    //$parentScope.num_items = 0;
                    for (var t in obj) {
                        url_product = obj[t].chkout_url;
                        quantity_product = obj[t].quantity;
                        scope.itemQuantity.push({
                            'url': url_product,
                            'affiliate_link': obj[t].twoTapAffiliateLink,
                            'quantity': quantity_product
                        }); // define json object
                        $parentScope.considered_items.push(obj[t]);
                        requestedItems.push(url_product); // make an array of product url
                        // $parentScope.num_items = scope.num_items + quantity_product;
                        counter = counter + 1;
                    }
                    pro_url = {
                        product_urls: requestedItems
                    };
                    $parentScope.estimated_price_totals = {};
                    $parentScope.twotap_builtin_cart = undefined;
                    if (requestedItems.length > 0) {
                        console.log("length greater than 0");
                    } else {
                        $parentScope.step = 1;
                        $parentScope.num_items = 0;
                        scope.ss_cart_load = 0;
                        $parentScope.num_stores = 0;
                        $parentScope.failed_item_num = 0; // calculate number of item which failed to add
                        $parentScope.failed_sub_total = 0; // calculate failed item  subotoal
                        $parentScope.saving = 0;
                        $parentScope.valid_coupons = 0;
                        $parentScope.invalid_coupons = 0;
                        scope.valid_coupon_store = 0;
                        $parentScope.fullTotal = undefined;
                        console.log("no way bro... 0 item inside cart");
                        return;
                    }
                    scope.ss_cart_load = 1;
                    $http.post('/twotap_cart', pro_url).then(function (response) {
                            scope.ss_cart_load = 0;
                            sites_arr = [];
                            $parentScope.twotap_builtin_cart = response.data.productCartDetails;
                            console.log(response.data.productCartDetails);
                            $parentScope.twotap_builtin_cart.product_urls = [];
                            if (scope.step == 2) $parentScope.tap = 0;
                            $parentScope.num_stores = 0;
                            for (var skey in scope.twotap_builtin_cart.sites) {
                                sites_arr.push(skey);
                                $parentScope.shipping_chrg[skey] = {};
                                $parentScope.num_stores = $parentScope.num_stores + 1;
                            }
                            $parentScope.s_array = sites_arr; //make an array of sites
                            storeProducts = [];
                            // return cart and make indexteams as null
                            ramp = [];
                            sikey = "";
                            var number_of_products = 0;
                            var store_id;
                            var quantity_store_wise = 0;
                            var distinct_site_key;
                            var temp_aff = "";
                            var clean_url = "";
                            var jjj = {};
                            // matching with saved cart
                            $parentScope.failed_item_num = 0; // calculate number of item which failed to add
                            $parentScope.failed_sub_total = 0; // calculate failed item  subotoal
                            $parentScope.saving = 0;
                            var temp_price = 0;
                            var temp_price_total = 0;
                            if (sites_arr.length > 0) {
                                console.log("go on");
                            } else {
                                console.log("empty cart as site array nulll");
                                return;
                            }
                            $parentScope.failed_sub_total = 0;
                            for (var q = 0; q < scope.userprofile2.length; q++) {
                                for (sikey in scope.twotap_builtin_cart.sites) {
                                    // $parentScope.twotap_builtin_cart.sites[sikey].coupon1="beauty15";
                                    $parentScope.twotap_builtin_cart.sites[sikey].failed_sub_total_store = 0; // calculate failed item  subtotal store wise
                                    $parentScope.twotap_builtin_cart.sites[sikey].quantity_store_wise = 0;
                                    for (var md5prox in scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart) {
                                        // if(scope.userprofile2[p].productMD5==md5pro)
                                        if (angular.equals(angular.lowercase(scope.userprofile2[q].chkout_url), angular.lowercase(scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].original_url))) {
                                            if (angular.isDefined(scope.userprofile2[q].current_price)) {
                                                $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].price = "$" + scope.userprofile2[q].current_price;
                                            }
                                            temp_aff = scope.userprofile2[q].twoTapAffiliateLink;
                                            $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].affiliate_links = temp_aff;
                                            clean_url = scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].clean_url;
                                            //  $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].input_fields = angular.copy(scope.userprofile2[q].required_field_values);
                                            $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].rateAvg = angular.copy(scope.userprofile2[q].product[0].rateAvg);
                                            $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].shareCount = angular.copy(scope.userprofile2[q].product[0].shareCount);
                                            $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].likeCount = angular.copy(scope.userprofile2[q].product[0].likeCount);
                                            $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].reviewCount = angular.copy(scope.userprofile2[q].product[0].reviewCount);
                                            $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].ratedByUser = angular.copy(scope.userprofile2[q].product[0].ratedByUser);
                                            $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].percentOff = scope.userprofile2[q].product[0].percentOff;
                                            $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].orig_price = angular.copy(scope.userprofile2[q].price);
                                            $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].catalogId = scope.userprofile2[q].product[0].catalogId;
                                            $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].quantity = angular.copy(scope.userprofile2[q].quantity);
                                            $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].lnk = scope.userprofile2[q].url; // link within website
                                            $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].required_field_values = angular.copy(scope.userprofile2[q].required_field_values);
                                            $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].category = scope.userprofile2[q].product[0].category;
                                            //$parentScope.num_items =scope.num_items+scope.userprofile2[p].quantity;
                                            $parentScope.twotap_builtin_cart.sites[sikey].shop = scope.userprofile2[q].product[0].merchant;
                                            $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].brand = scope.userprofile2[q].product[0].brand;
                                            // scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.size=scope.userprofile2[p].size;
                                            // scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color=scope.userprofile2[p].color;
                                            // scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.option=scope.userprofile2[p].option;
                                            // $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].cartId = scope.userprofile2[q].cartId;
                                            $parentScope.twotap_builtin_cart.sites[sikey].quantity_store_wise = scope.twotap_builtin_cart.sites[sikey].quantity_store_wise + scope.userprofile2[q].quantity;
                                            for (var rq in scope.userprofile2[q].required_field_values) {
                                                if (rq == 'color' || rq == 'size' || rq == 'quantity') {
                                                    console.log("do not do anything");
                                                } else {
                                                    $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox][rq] = angular.copy(scope.userprofile2[q].required_field_values[rq]);
                                                }
                                            }
                                            if (angular.isDefined(scope.userprofile2[q].required_field_values.size)) {
                                                $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].size = scope.userprofile2[q].required_field_values.size;
                                            }
                                            if (scope.userprofile2[q].required_field_values.hasOwnProperty('color')) {
                                                $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].color = scope.userprofile2[q].required_field_values.color;
                                                // scope.reset_size_list(scope.twotap_builtin_cart,scope.userprofile2[p].required_field_values.color,-2);
                                                var t = 0;
                                                var num = -1;
                                                for (t = 0; t < scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].required_field_values.color.length; t++) {
                                                    if (scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].required_field_values.color[t].value == scope.userprofile2[q].required_field_values.color) {
                                                        $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].required_field_values.size = scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].required_field_values.color[t].dep.size;
                                                        $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].size = scope.userprofile2[q].required_field_values.size;
                                                        break;
                                                    }
                                                }
                                            }
                                            //scope.twotap_builtin_cart.affiliate_links[sikey] = scope.userprofile2[p].twoTapAffiliateLink;
                                            temp_aff = scope.userprofile2[q].twoTapAffiliateLink;
                                            $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].affiliate_links = temp_aff;
                                            clean_url = scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].clean_url;
                                            if (scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].image == "") {
                                                if (scope.userprofile2[q].product[0].image_url != "") $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].image = scope.userprofile2[q].product[0].image_url;
                                                else if (scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].alt_images.length > 0) $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].image = scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].alt_images[0];
                                            }
                                            $parentScope.failed_item_num = scope.failed_item_num + scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].quantity; // calculate number of total failed item which failed to add
                                            if (angular.isDefined(scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].price)) {
                                                if (angular.isDefined(scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].price) && scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].price != null) {
                                                    temp_price = parseFloat((scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].price.substring(1)), 10); // getting price of failed item
                                                    $parentScope.saving = scope.saving + ((scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].orig_price - parseFloat(scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].price.substring(1), 10)) * (scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].quantity));
                                                } else {
                                                    temp_price = scope.userprofile2[q].current_price;
                                                    $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].orig_price = angular.copy(scope.userprofile2[q].current_price);
                                                }
                                            } else {
                                                temp_price = scope.userprofile2[q].current_price;
                                                $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].orig_price = angular.copy(scope.userprofile2[q].current_price);
                                            }
                                            temp_price_total = scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].quantity * temp_price;
                                            $parentScope.twotap_builtin_cart.sites[sikey].failed_sub_total_store = scope.twotap_builtin_cart.sites[sikey].failed_sub_total_store + temp_price_total; // store wise calculate failed item price
                                            $parentScope.failed_sub_total = scope.failed_sub_total + temp_price_total; // full subtotal of failed items 																		// calculate total
                                        } // url cross check
                                    }
                                    for (md5pro in scope.twotap_builtin_cart.sites[sikey].add_to_cart) {
                                        // if(scope.userprofile2[p].productMD5==md5pro)
                                        // if(scope.userprofile2[p].chkout_url==scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].original_url)
                                        // {
                                        if (angular.equals(angular.lowercase(scope.userprofile2[q].chkout_url), angular.lowercase(scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].original_url))) {
                                            console.log(scope.userprofile2[q]);
                                            if (angular.isDefined(scope.userprofile2[q].current_price)) {
                                                $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].price = "$" + scope.userprofile2[q].current_price;
                                            }
                                            temp_aff = scope.userprofile2[q].twoTapAffiliateLink;
                                            $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].affiliate_links = temp_aff;
                                            clean_url = scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].clean_url;
                                            $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].input_fields = angular.copy(scope.userprofile2[q].required_field_values);
                                            $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].percentOff = scope.userprofile2[q].product[0].percentOff;
                                            $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].orig_price = angular.copy(scope.userprofile2[q].product[0].price);
                                            $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].category = scope.userprofile2[q].product[0].category;
                                            $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].catalogId = scope.userprofile2[q].product[0].catalogId;
                                            $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].rateAvg = angular.copy(scope.userprofile2[q].product[0].rateAvg);
                                            $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].shareCount = angular.copy(scope.userprofile2[q].product[0].shareCount);
                                            $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].likeCount = angular.copy(scope.userprofile2[q].product[0].likeCount);
                                            $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].reviewCount = angular.copy(scope.userprofile2[q].product[0].reviewCount);
                                            $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].ratedByUser = angular.copy(scope.userprofile2[q].product[0].ratedByUser);
                                            for (var rq in scope.userprofile2[q].required_field_values) {
                                                if (rq == 'color' || rq == 'size' || rq == 'quantity') {
                                                    console.log("do not do anything");
                                                } else {
                                                    $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro][rq] = angular.copy(scope.userprofile2[q].required_field_values[rq]);
                                                }
                                            }
                                            $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.quantity = angular.copy(scope.userprofile2[q].quantity);
                                            $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].quantity = angular.copy(scope.userprofile2[q].quantity);
                                            $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].lnk = scope.userprofile2[q].url; // link within website
                                            $parentScope.twotap_builtin_cart.sites[sikey].shop = scope.userprofile2[q].product[0].merchant;
                                            $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].brand = scope.userprofile2[q].product[0].brand;
                                            if (scope.userprofile2[q].required_field_values.hasOwnProperty('size')) {
                                                $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].size = scope.userprofile2[q].required_field_values.size;
                                            }
                                            if (scope.userprofile2[q].required_field_values.hasOwnProperty('color')) {
                                                $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].color = scope.userprofile2[q].required_field_values.color;
                                                // scope.reset_size_list(scope.twotap_builtin_cart,scope.userprofile2[q].required_field_values.color,-2);
                                                var i = 0;
                                                var num = -1;
                                                if (scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.hasOwnProperty('color')) {
                                                    for (i = 0; i < scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color.length; i++) {
                                                        if (scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[i].value == scope.userprofile2[q].required_field_values.color) {
                                                            /*   if (angular.isDefined(scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[i].price)) {
                                                                   $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].price = scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[i].price;
                                                               }*/
                                                            if (scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[i].hasOwnProperty('dep')) {
                                                                if (scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[i].dep.hasOwnProperty('size')) {
                                                                    $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.size = scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[i].dep.size;
                                                                    $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].size = scope.userprofile2[q].required_field_values.size;
                                                                    break;
                                                                }
                                                            }
                                                        }
                                                    }
                                                } //
                                            }
                                            //scope.twotap_builtin_cart.affiliate_links[sikey] = scope.userprofile2[q].twoTapAffiliateLink;
                                            if (scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].image == "") {
                                                if (scope.userprofile2[q].product[0].image_url != "") $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].image = scope.userprofile2[q].product[0].image_url;
                                                else if (scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].alt_images.length > 0) $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].image = scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].alt_images[0];
                                            }
                                            $parentScope.saving = scope.saving + ((scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].orig_price - parseFloat(scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].price.substring(1), 10)) * (scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].quantity));
                                        }
                                    }
                                    $parentScope.twotap_builtin_cart.sites[sikey].quantity_store_wise = scope.twotap_builtin_cart.sites[sikey].quantity_store_wise + scope.userprofile2[q].quantity;
                                    $parentScope.shipping_countries_support = angular.copy(scope.twotap_builtin_cart.sites[sikey].shipping_countries_support);
                                    $parentScope.billing_countries_support = angular.copy(scope.twotap_builtin_cart.sites[sikey].billing_countries_support);
                                    $parentScope.twotap_builtin_cart.sites[sikey].shipping = angular.copy(scope.shipping_address);
                                    $parentScope.twotap_builtin_cart.sites[sikey].billing = angular.copy(scope.billing_address);
                                    $parentScope.twotap_builtin_cart.sites[sikey].card = angular.copy(scope.card_details);
                                }
                            }
                            // $parentScope.twotap_builtin_cart.sites[sikey].shipping =scope.shipping_address;
                            // $parentScope.twotap_builtin_cart.sites[sikey].billing =scope.billing_address;
                            // $parentScope.twotap_builtin_cart.sites[sikey].card =scope.card_details;
                            $parentScope.twotap_builtin_cart.shipping = angular.copy(scope.shipping_address);
                            $parentScope.twotap_builtin_cart.billing = angular.copy(scope.billing_address);
                            $parentScope.twotap_builtin_cart.card = angular.copy(scope.card_details);
                            $parentScope.count_items(scope.twotap_builtin_cart, -1, scope.considered_items);
                            scope.estimatefunction (scope.twotap_builtin_cart, -1, scope.considered_items, 'cart'); // -1 means all cart
                            $parentScope.shoppingbag_cart_changed = false; //
                            $cookies.put('shoppingbag_cart_changed', false);
                            $cookies.put('shoppingbag_cart_id', response.data.cart_id);
                            $parentScope.mcart = false;
                            //}
                            if (scope.step == 2) {
                                if (scope.failed_item_num > 0) {
                                    $parentScope.common_popup_message = "Please Remove unavailable items before proceed";
                                    $parentScope.common_popup_header = "Unavailable Items ";
                                    $('#commonPopup').modal('show');
                                } else if (scope.checkoutpossible) {
                                    $parentScope.tap = 0;
                                    $location.path('/scheckout');
                                    $route.reload();
                                } else {
                                    $parentScope.common_popup_message = "Please Remove invalid coupon code before proceed";
                                    $parentScope.common_popup_header = "Invalid Coupon code";
                                    $('#commonPopup').modal('show');
                                }
                            }
                            //////////////////////VVIMP///////////////////////////////////////////////
                        }, function (response) {
                            $parentScope.num_stores = 0;
                            $parentScope.num_items = 0;
                            $parentScope.estimated_price_totals = {
                                "final_price": "$0.0",
                                "subtotal": "$0.0"
                            };
                            //  $parentScope.estimated_move_price_totals = {"final_price": "$0.0", "subtotal": "$0.0"};
                            $parentScope.valid_coupons = 0;
                            $parentScope.invalid_coupons = 0;
                            scope.valid_coupon_store = 0;
                            $parentScope.twotap_builtin_cart = undefined;
                            scope.ss_cart_load = 0;
                            $parentScope.mcart = false;
                        })
                        // $parentScope.initTwotapCheckoutCart();
                };
                // purchase attempt
                ////////////////////////////////// MERCHANT WISE CHECKPOUT
            scope.twotapCheckoutMerchantWise = function (merchant, val) {
                scope.ss_cart_load = 1;
                scope.itemQuantity = [];
                checkoutRequest = {};
                obj = scope.userprofile2; // my custom cart data
                $parentScope.considered_items = [];
                counter = 0; // keeping product url
                quantity_product = 0;
                requestedItems = [];
                url_product = "";
                var r_ind;
                $parentScope.cur_merchant = merchant;
                if (scope.ck_all) { // previous step is user in checkout all state
                    $parentScope.step = 1;
                    $parentScope.ck_all = false;
                    $parentScope.tap = 1;
                } else {
                    if (scope.step == 1) {
                        $parentScope.step = 2;
                        $parentScope.tap = 0;
                    }
                }
                for (var t in obj) {
                    if (obj[t].retailer == merchant) {
                        url_product = obj[t].chkout_url;
                        requestedItems.push(url_product); // make an array of product url
                        $parentScope.considered_items.push(obj[t]);
                        quantity_product = obj[t].quantity;
                        scope.itemQuantity[counter] = {
                            'url': url_product,
                            'quantity': quantity_product
                        }; // define json object
                        counter = counter + 1;
                    }
                }
                ////////////////----------- STORE WISE -------------------------////////////////////
                scope.asyncIsUserLoggedIn(function (isLoggedIn) {
                    if (!isLoggedIn && (scope.step == 2 && scope.tap == 0)) {
                        $parentScope.after_login_location = '/shoppingbag';
                        $("#login-popup").modal("show");
                        scope.ss_cart_load = 0;
                        console.log("please loggedin to move next page");
                        $parentScope.step = 1;
                        $parentScope.tap = 1;
                    } else {
                        if (requestedItems.length == 0) {
                            $parentScope.num_stores = 0;
                            $parentScope.num_items = 0;
                            $parentScope.estimated_price_totals = {
                                "final_price": "$0.0",
                                "subtotal": "$0.0"
                            };
                            // $parentScope.estimated_move_price_totals = {"final_price": "$0.0", "subtotal": "$0.0"};
                            $parentScope.valid_coupons = 0;
                            $parentScope.invalid_coupons = 0;
                            scope.valid_coupon_store = 0;
                            $parentScope.twotap_builtin_cart = undefined;
                            $parentScope.saving = 0;
                            scope.ss_cart_load = 0;
                            $parentScope.failed_item_num = 0; // calculate number of item which failed to add
                            $parentScope.failed_sub_total = 0; // calculate failed item  subotoal
                            $parentScope.fullTotal = undefined;
                            $parentScope.step = 1;
                            $parentScope.tap = 1;
                            return;
                        }
                        if (scope.tap == 0 && scope.step == 2 && !(scope.mcart)) { // tap 0 means he was there before
                            console.log("I am here exit 2");
                            if (val == 2) {
                                console.log("I am here exit 1");
                                if (scope.failed_item_num > 0) // do not allow to checkout if any failed item there
                                {
                                    console.log("I am here exit ");
                                    $parentScope.common_popup_message = "Please Remove unavailable items before proceed";
                                    $parentScope.common_popup_header = "Unavailable Items ";
                                    $('#commonPopup').modal('show');
                                    $parentScope.step = 1;
                                    $parentScope.tap = 1;
                                    scope.ss_cart_load = 0;
                                    return;
                                } else if (!(scope.checkoutpossible)) {
                                    $parentScope.common_popup_message = "Please Remove invalid coupon code before proceed";
                                    $parentScope.common_popup_header = "Invalid Coupon code";
                                    $('#commonPopup').modal('show');
                                    $parentScope.step = 1;
                                    $parentScope.tap = 1;
                                    scope.ss_cart_load = 0;
                                    return;
                                } else {
                                    $location.path('/scheckout');
                                    $route.reload();
                                    scope.ss_cart_load = 0;
                                    return;
                                }
                            }
                        } else {
                            console.log("I am here exit 3");
                        }
                        $parentScope.num_stores = 1; // when checking out single
                        pro_url = {
                            product_urls: requestedItems
                        };
                        $parentScope.twotap_builtin_cart = undefined;
                        $parentScope.saving = 0;
                        $parentScope.estimated_price_totals = {};
                        $parentScope.failed_sub_total = 0;
                        $parentScope.twotap_builtin_cart = undefined;
                        scope.ss_cart_load = 1;
                        $http.post('/twotap_cart', pro_url).then(function (response) {
                            scope.ss_cart_load = 0;
                            $parentScope.tap = 0; // why tap = 0 mean ready to check out page
                            $parentScope.twotap_builtin_cart = response.data.productCartDetails;
                            // scope.twotap_builtin_cart.product_urls =[];
                            $parentScope.num_items = 0;
                            $parentScope.failed_item_num = 0; // calculate number of item which failed to add
                            $parentScope.failed_sub_total = 0; // calculate failed item  subotoal
                            sites_arr = [];
                            sk = "";
                            //scope.s_array =sites_arr;  //make an array of sites
                            storeProducts = [];
                            ramp = [];
                            sikey = "";
                            for (var skeyT in scope.twotap_builtin_cart.sites) {
                                sikey = skeyT;
                                $parentScope.shipping_chrg[sikey] = {};
                            }
                            md5pro = "";
                            var i;
                            var num;
                            var temp_price = 0;
                            var temp_price_total = 0;
                            $parentScope.twotap_builtin_cart.sites[sikey].quantity_store_wise = 0;
                            for (var p = 0; p < scope.userprofile2.length; p++) {
                                $parentScope.twotap_builtin_cart.sites[sikey].failed_sub_total_store = 0; // calculate failed item  subtotal store wise
                                for (var md5proSx in scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart) {
                                    // if(scope.userprofile2[p].productMD5==md5pro)
                                    if (scope.userprofile2[p].chkout_url == scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].original_url) {
                                        temp_price = 0;
                                        temp_price_total = 0;
                                        if (angular.isDefined(scope.userprofile2[p].current_price)) {
                                            $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].price = "$" + scope.userprofile2[p].current_price;
                                        }
                                        $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].required_field_values = angular.copy(scope.userprofile2[p].required_field_values);
                                        $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].percentOff = scope.userprofile2[p].product[0].percentOff;
                                        $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].orig_price = angular.copy(scope.userprofile2[p].product[0].price);
                                        $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].rateAvg = angular.copy(scope.userprofile2[p].product[0].rateAvg);
                                        $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].shareCount = angular.copy(scope.userprofile2[p].product[0].shareCount);
                                        $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].likeCount = angular.copy(scope.userprofile2[p].product[0].likeCount);
                                        $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].reviewCount = angular.copy(scope.userprofile2[p].product[0].reviewCount);
                                        $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].ratedByUser = angular.copy(scope.userprofile2[p].product[0].ratedByUser);
                                        for (var rq in scope.userprofile2[p].required_field_values) {
                                            if (rq == 'color' || rq == 'size' || rq == 'quantity') {
                                                console.log("do not do anything");
                                            } else {
                                                $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx][rq] = angular.copy(scope.userprofile2[p].required_field_values[rq]);
                                            }
                                        }
                                        $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].catalogId = scope.userprofile2[p].product[0].catalogId;
                                        $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].required_field_values.quantity = angular.copy(scope.userprofile2[p].quantity);
                                        $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].quantity = angular.copy(scope.userprofile2[p].quantity);
                                        $parentScope.num_items = scope.num_items + parseInt(scope.userprofile2[p].quantity);
                                        $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].lnk = scope.userprofile2[p].url; // link within website
                                        $parentScope.twotap_builtin_cart.sites[sikey].shop = scope.userprofile2[p].product[0].merchant;
                                        $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].category = scope.userprofile2[p].product[0].category;
                                        $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].brand = scope.userprofile2[p].product[0].brand;
                                        $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].size = scope.userprofile2[p].required_field_values.size;
                                        if (scope.userprofile2[p].required_field_values.hasOwnProperty('color')) {
                                            $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].color = scope.userprofile2[p].required_field_values.color;
                                            var zz = 0;
                                            var num = -1;
                                            if (angular.isDefined(scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].required_field_values)) {
                                                for (zz = 0; zz < scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].required_field_values.color.length; zz++) {
                                                    if (scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].required_field_values.color[zz].value == scope.userprofile2[p].required_field_values.color) {
                                                        $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].required_field_values.size = scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].required_field_values.color[zz].dep.size;
                                                        break;
                                                    }
                                                }
                                            } //bug fux
                                        }
                                        $parentScope.twotap_builtin_cart.sites[sikey].quantity_store_wise = scope.twotap_builtin_cart.sites[sikey].quantity_store_wise + scope.userprofile2[p].quantity;
                                        //scope.twotap_builtin_cart.affiliate_links[sikey] = scope.userprofile2[p].twoTapAffiliateLink;
                                        temp_aff = scope.userprofile2[p].twoTapAffiliateLink;
                                        $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].affiliate_links = temp_aff;
                                        clean_url = scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].clean_url;
                                        if (scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].image == "") {
                                            if (scope.userprofile2[p].product[0].image_url != "") $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].image = scope.userprofile2[p].product[0].image_url;
                                            else if (scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].alt_images.length > 0) $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].image = scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].alt_images[0];
                                        }
                                        $parentScope.failed_item_num = scope.failed_item_num + scope.userprofile2[p].quantity; // calculate number of total failed item which failed to add
                                        if (scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].hasOwnProperty('price')) {
                                            if (scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].price != null) {
                                                temp_price = parseFloat(scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].price.substring(1), 10); // getting price of failed item
                                            } else {
                                                temp_price = scope.userprofile2[p].current_price;
                                                $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].orig_price = angular.copy(scope.userprofile2[p].current_price);
                                            }
                                        } else {
                                            temp_price = scope.userprofile2[p].current_price;
                                            $parentScope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].orig_price = angular.copy(scope.userprofile2[p].current_price);
                                        }
                                        temp_price_total = scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].quantity * temp_price;
                                        $parentScope.twotap_builtin_cart.sites[sikey].failed_sub_total_store = scope.twotap_builtin_cart.sites[sikey].failed_sub_total_store + temp_price_total; // store wise calculate failed item price
                                        $parentScope.failed_sub_total = scope.failed_sub_total + temp_price_total; // full subtotal of failed items 																		// calculate total
                                    } // if end url compare
                                }
                                for (md5pro in scope.twotap_builtin_cart.sites[sikey].add_to_cart) {
                                    //if(scope.userprofile2[p].productMD5==md5pro)
                                    //if(scope.userprofile2[p].chkout_url==scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].original_url)
                                    if (angular.equals(angular.lowercase(scope.userprofile2[p].chkout_url), angular.lowercase(scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].original_url))) {
                                        if (angular.isDefined(scope.userprofile2[p].current_price)) {
                                            $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].price = "$" + scope.userprofile2[p].current_price;
                                        }
                                        for (var rq in scope.userprofile2[p].required_field_values) {
                                            if (rq == 'color' || rq == 'size' || rq == 'quantity') {
                                                console.log("do not do anything");
                                            } else {
                                                $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro][rq] = angular.copy(scope.userprofile2[p].required_field_values[rq]);
                                            }
                                        }
                                        $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].input_fields = angular.copy(scope.userprofile2[p].required_field_values);
                                        $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].percentOff = scope.userprofile2[p].product[0].percentOff;
                                        //$parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].orig_price=scope.userprofile2[p].product[0].price;
                                        $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].orig_price = angular.copy(scope.userprofile2[p].product[0].price);
                                        $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].catalogId = scope.userprofile2[p].product[0].catalogId;
                                        $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].rateAvg = angular.copy(scope.userprofile2[p].product[0].rateAvg);
                                        $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].shareCount = angular.copy(scope.userprofile2[p].product[0].shareCount);
                                        $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].likeCount = angular.copy(scope.userprofile2[p].product[0].likeCount);
                                        $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].reviewCount = angular.copy(scope.userprofile2[p].product[0].reviewCount);
                                        $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].ratedByUser = angular.copy(scope.userprofile2[p].product[0].ratedByUser);
                                        $parentScope.twotap_builtin_cart.sites[sikey].shop = scope.userprofile2[p].product[0].merchant;
                                        $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].brand = scope.userprofile2[p].product[0].brand;
                                        $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].category = scope.userprofile2[p].product[0].category;
                                        $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].lnk = scope.userprofile2[p].url;
                                        $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.quantity = angular.copy(scope.userprofile2[p].quantity);
                                        // $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].cartId = scope.userprofile2[p].cartId;
                                        $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].quantity = angular.copy(scope.userprofile2[p].quantity);
                                        $parentScope.num_items = scope.num_items + parseInt(scope.userprofile2[p].quantity);
                                        // scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.size=scope.userprofile2[p].size;
                                        // scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color=scope.userprofile2[p].color;
                                        // scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.option=scope.userprofile2[p].option;
                                        if (angular.isDefined(scope.userprofile2[p].required_field_values.size)) $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].size = angular.copy(scope.userprofile2[p].required_field_values.size);
                                        if (scope.userprofile2[p].required_field_values.hasOwnProperty('color')) {
                                            scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].color = scope.userprofile2[p].required_field_values.color;
                                            var i = 0;
                                            var num = -1;
                                            if (scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.hasOwnProperty('color')) {
                                                for (var zy = 0; zy < scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color.length; zy++) {
                                                    if (scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[i].value == scope.userprofile2[p].required_field_values.color) {
                                                        if (scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[i].hasOwnProperty('dep')) {
                                                            if (scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[i].dep.hasOwnProperty('size')) {
                                                                $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.size = scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[zy].dep.size;
                                                                $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].size = scope.userprofile2[p].required_field_values.size;
                                                                break;
                                                            } // if end
                                                        } // if end
                                                    } // if end
                                                } // for end
                                            } // color end
                                        } // if color end
                                        $parentScope.twotap_builtin_cart.sites[sikey].quantity_store_wise = scope.twotap_builtin_cart.sites[sikey].quantity_store_wise + scope.userprofile2[p].quantity;
                                        $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].affiliate_links = scope.userprofile2[p].twoTapAffiliateLink;
                                        if (scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].image == "") {
                                            if (scope.userprofile2[p].product[0].image_url != "") $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].image = scope.userprofile2[p].product[0].image_url;
                                            else if (scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].alt_images.length > 0) $parentScope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].image = scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].alt_images[0];
                                        }
                                        $parentScope.saving = scope.saving + ((scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].orig_price - parseFloat(scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].price.substring(1), 10)) * (scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].quantity));
                                    }
                                }
                            } // for end outer
                            $parentScope.shipping_countries_support = angular.copy(scope.twotap_builtin_cart.sites[sikey].shipping_countries_support);
                            $parentScope.billing_countries_support = angular.copy(scope.twotap_builtin_cart.sites[sikey].billing_countries_support);
                            // $parentScope.twotap_builtin_cart.sites[sikey].quantity_store_wise = angular.copy(scope.num_items);
                            $parentScope.twotap_builtin_cart.sites[sikey].shipping = angular.copy(scope.shipping_address);
                            $parentScope.twotap_builtin_cart.sites[sikey].billing = angular.copy(scope.billing_address);
                            $parentScope.twotap_builtin_cart.sites[sikey].card = angular.copy(scope.card_details);
                            $parentScope.twotap_builtin_cart.shipping = angular.copy(scope.shipping_address);
                            $parentScope.twotap_builtin_cart.billing = angular.copy(scope.billing_address);
                            $parentScope.twotap_builtin_cart.card = angular.copy(scope.card_details);
                            // if(response.data.availability)
                            // {
                            scope.estimatefunction(scope.twotap_builtin_cart, 1, scope.considered_items, 'cart'); // single store single index
                            // }
                            $parentScope.mcart = false;
                        }, function (response) {
                            $parentScope.num_stores = 0;
                            $parentScope.num_items = 0;
                            $parentScope.estimated_price_totals = {
                                "final_price": "$0.0",
                                "subtotal": "$0.0"
                            };
                            //  $parentScope.estimated_move_price_totals = {"final_price": "$0.0", "subtotal": "$0.0"};
                            $parentScope.valid_coupons = 0;
                            $parentScope.invalid_coupons = 0;
                            scope.valid_coupon_store = 0;
                            $parentScope.twotap_builtin_cart = undefined;
                            scope.ss_cart_load = 0;
                            $parentScope.mcart = false;
                        })
                    }
                });
            };
            var clength; // number of color
            /////////////////// WISH LIST ADD //////////////////////////
            function twotapwishOut_part(step) {
                $parentScope.num_stores_wish = scope.total_cart_distinct_store_wish;
                var temp_changed = scope.wishbag_cart_changed;
                scope.itemQuantity_wish = [];
                checkoutRequest = {};
                obj2 = scope.saveprofile2; // my custom cart data
                url_product = "";
                counter = 0; // keeping product url
                requestedItems_wish = [];
                // using following loop we generate json object for the product
                $parentScope.considered_items_wish = [];
                for (var t in obj2) {
                    url_product = obj2[t].chkout_url;
                    quantity_product = obj2[t].quantity;
                    scope.itemQuantity_wish.push({
                        'url': url_product,
                        'affiliate_link': obj2[t].twoTapAffiliateLink,
                        'quantity': quantity_product
                    }); // define json object
                    $parentScope.considered_items_wish.push(obj2[t]);
                    requestedItems_wish.push(url_product); // make an array of product url
                    counter = counter + 1;
                }
                $parentScope.twotap_wishlist_cart = undefined;
                $parentScope.failed_wish_sub_total = 0;
                $parentScope.estimated_price_totals_wish = {};
                if ((!angular.isDefined(scope.saveprofile2))) {
                    $parentScope.num_items_wish = 0;
                    $parentScope.num_stores_wish = 0;
                    $parentScope.estimated_price_totals_wish = {
                        "final_price": "$0.0",
                        "subtotal": "$0.0"
                    };
                    scope.ss_wish_load = 0;
                    return;
                } else {
                    if (scope.saveprofile2.length < 1) {
                        $parentScope.num_items_wish = 0;
                        $parentScope.num_stores_wish = 0;
                        $parentScope.estimated_price_totals_wish = {
                            "final_price": "$0.0",
                            "subtotal": "$0.0"
                        };
                        scope.ss_wish_load = 0;
                        return;
                    }
                }
                pro_url_wish = {
                    product_urls: requestedItems_wish
                };
                scope.ss_wish_load = 1;
                console.log(scope.$parent);
                $http.post('/twotap_cart', pro_url_wish).then(function (response) {
                    scope.ss_wish_load = 0;
                    console.log(scope.$parent);
                    $parentScope.twotap_wishlist_cart = response.data.productCartDetails;
                    $parentScope.twotap_wishlist_cart.product_urls = [];
                    sites_arr = [];
                    for (skey in scope.twotap_wishlist_cart.sites) {
                        sites_arr.push(skey);
                    }
                    $parentScope.s_array_wish = sites_arr; //make an array of sites
                    $parentScope.num_stores_wish = scope.s_array_wish.length;
                    storeProducts = [];
                    // return cart and make indexteams as null
                    ramp = [];
                    sikey = "";
                    md5pro = "";
                    var number_of_products = 0;
                    var store_id;
                    var quantity_store_wise = 0;
                    var distinct_site_key;
                    var temp_aff = "";
                    var clean_url = "";
                    var jjj = {};
                    $parentScope.num_items_wish = 0;
                    var md5prof = "";
                    $parentScope.failed_wish_item_num = 0; // calculate number of item which failed to add
                    $parentScope.failed_wish_sub_total = 0; // calculate failed item  subotoal
                    var saveCount = 0;
                    for (var p = 0; p < scope.saveprofile2.length; p++) {
                        for (var n = 0; n < scope.s_array_wish.length; n++) {
                            sikey = scope.s_array_wish[n]; // target one site
                            number_of_products = 0;
                            // consider 1 site
                            var num_required;
                            for (md5prof in scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart) {
                                //		if(scope.saveprofile2[p].chkout_url==scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5pro].original_url)
                                if (angular.equals(angular.lowercase(scope.saveprofile2[p].chkout_url), angular.lowercase(scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].original_url))) {
                                    var temp_pricew = 0;
                                    var temp_price_totalw = 0;
                                    var num_required = 0;
                                    if (angular.isDefined(scope.saveprofile2[p].current_price)) {
                                        $parentScope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].price = "$" + scope.saveprofile2[p].current_price;
                                        console.log(scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].price);
                                    }
                                    for (var rq in scope.saveprofile2[p].required_field_values) {
                                        if (rq == 'color' || rq == 'size' || rq == 'quantity') {
                                            console.log("do not do anything");
                                        } else {
                                            $parentScope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof][rq] = angular.copy(scope.saveprofile2[p].required_field_values[rq]);
                                        }
                                    }
                                    $parentScope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].movetobagPossible = 0;
                                    $parentScope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].required_field_values = angular.copy(scope.saveprofile2[p].required_field_values);
                                    $parentScope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].input_fields = scope.saveprofile2[p].required_field_values;
                                    $parentScope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].rateAvg = angular.copy(scope.saveprofile2[p].product[0].rateAvg);
                                    $parentScope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].shareCount = angular.copy(scope.saveprofile2[p].product[0].shareCount);
                                    $parentScope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].likeCount = angular.copy(scope.saveprofile2[p].product[0].likeCount);
                                    $parentScope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].reviewCount = angular.copy(scope.saveprofile2[p].product[0].reviewCount);
                                    $parentScope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].ratedByUser = angular.copy(scope.saveprofile2[p].product[0].ratedByUser);
                                    $parentScope.twotap_wishlist_cart.sites[sikey].shop = scope.saveprofile2[p].product[0].merchant;
                                    $parentScope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].percentOff = scope.saveprofile2[p].product[0].percentOff;
                                    $parentScope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].orig_price = angular.copy(scope.saveprofile2[p].product[0].price);
                                    $parentScope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].category = scope.saveprofile2[p].product[0].category;
                                    $parentScope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].lnk = scope.saveprofile2[p].url;
                                    $parentScope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].catalogId = scope.saveprofile2[p].product[0].catalogId;
                                    $parentScope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].required_field_values = angular.copy(scope.saveprofile2[p].required_field_values);
                                    $parentScope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].quantity = angular.copy(scope.saveprofile2[p].quantity);
                                    console.log(scope.saveprofile2[p].quantity);
                                    console.log("failed case");
                                    //$parentScope.num_items_wish = scope.num_items_wish + parseInt(scope.saveprofile2[p].quantity);
                                    $parentScope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].shop = scope.saveprofile2[p].product[0].merchant;
                                    $parentScope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].brand = scope.saveprofile2[p].product[0].brand;
                                    if (angular.isDefined(scope.saveprofile2[p].required_field_values.size)) {
                                        $parentScope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].size = angular.copy(scope.saveprofile2[p].required_field_values.size);
                                    }
                                    if (scope.saveprofile2[p].required_field_values.hasOwnProperty('color')) {
                                        $parentScope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].color = angular.copy(scope.saveprofile2[p].required_field_values.color);
                                        // scope.reset_size_list(scope.twotap_builtin_cart,scope.userprofile2[p].required_field_values.color,-2);
                                        var i = 0;
                                        var num = -1;
                                        for (zw = 0; zw < scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].required_field_values.color.length; zw++) {
                                            if (scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].required_field_values.color[zw].value == scope.saveprofile2[p].required_field_values.color) {
                                                $parentScope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].required_field_values.size = scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].required_field_values.color[zw].dep.size;
                                                break;
                                            }
                                        }
                                    }
                                    temp_aff = scope.saveprofile2[p].twoTapAffiliateLink;
                                    clean_url = scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].clean_url;
                                    if (scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].image == "") {
                                        if (scope.saveprofile2[p].product[0].image_url != "") $parentScope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].image = scope.saveprofile2[p].product[0].image_url;
                                        else if (scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].alt_images.length > 0) $parentScope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].image = scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].alt_images[0];
                                    }
                                    $parentScope.failed_wish_item_num = scope.failed_wish_item_num + scope.saveprofile2[p].quantity;
                                    if (angular.isDefined(scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof])) {
                                        if (scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].hasOwnProperty('price')) {
                                            if (scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].price != null) temp_pricew = parseFloat(scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].price.substring(1), 10); // getting price of failed item
                                            else {
                                                temp_pricew = scope.saveprofile2[p].current_price;
                                                $parentScope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].price = angular.copy("$" + scope.saveprofile2[p].current_price);
                                                $parentScope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].orig_price = angular.copy(scope.saveprofile2[p].product[0].current_price);
                                            }
                                        } else {
                                            temp_pricew = scope.saveprofile2[p].current_price;
                                            $parentScope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].orig_price = angular.copy(scope.saveprofile2[p].product[0].current_price);
                                            $parentScope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].price = angular.copy("$" + scope.saveprofile2[p].current_price);
                                        }
                                        temp_price_totalw = scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].quantity * temp_pricew;
                                    }
                                    $parentScope.failed_wish_sub_total = scope.failed_wish_sub_total + temp_price_totalw; // full subtotal of failed items 																		// calculate total
                                }
                            }
                            for (md5pro in scope.twotap_wishlist_cart.sites[sikey].add_to_cart) {
                                //								if(scope.saveprofile2[p].chkout_url==scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].original_url)
                                if (angular.equals(angular.lowercase(scope.saveprofile2[p].chkout_url), angular.lowercase(scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].original_url))) {
                                    if (angular.isDefined(scope.saveprofile2[p].current_price)) {
                                        $parentScope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].price = "$" + scope.saveprofile2[p].current_price;
                                    }
                                    $parentScope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].input_fields = angular.copy(scope.saveprofile2[p].required_field_values);
                                    $parentScope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].movetobagPossible = 0;
                                    num_required = 0;
                                    num_required = scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].required_field_names.length;
                                    if (num_required > Object.keys(scope.saveprofile2[p].required_field_values).length) {
                                        $parentScope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].movetobagPossible = 0;
                                    } else {
                                        $parentScope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].movetobagPossible = 1;
                                    }
                                    for (var rq in scope.saveprofile2[p].required_field_values) {
                                        if (rq == 'color' || rq == 'size' || rq == 'quantity') {
                                            console.log("do not do anything");
                                        } else {
                                            $parentScope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro][rq] = angular.copy(scope.saveprofile2[p].required_field_values[rq]);
                                        }
                                    }
                                    $parentScope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].percentOff = scope.saveprofile2[p].product[0].percentOff;
                                    $parentScope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].orig_price = angular.copy(scope.saveprofile2[p].product[0].price);
                                    $parentScope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].lnk = scope.saveprofile2[p].url;
                                    $parentScope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].catalogId = scope.saveprofile2[p].product[0].catalogId;
                                    // $parentScope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].cartId = scope.saveprofile2[p].cartId;
                                    $parentScope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].category = scope.saveprofile2[p].product[0].category;
                                    $parentScope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].rateAvg = angular.copy(scope.saveprofile2[p].product[0].rateAvg);
                                    $parentScope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].shareCount = angular.copy(scope.saveprofile2[p].product[0].shareCount);
                                    $parentScope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].likeCount = angular.copy(scope.saveprofile2[p].product[0].likeCount);
                                    $parentScope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].reviewCount = angular.copy(scope.saveprofile2[p].product[0].reviewCount);
                                    $parentScope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].ratedByUser = angular.copy(scope.saveprofile2[p].product[0].ratedByUser);
                                    $parentScope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].required_field_values.quantity = angular.copy(scope.saveprofile2[p].quantity);
                                    $parentScope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].quantity = angular.copy(scope.saveprofile2[p].quantity);
                                    console.log(scope.saveprofile2[p].quantity);
                                    $parentScope.num_items_wish = scope.num_items_wish + parseInt(scope.saveprofile2[p].quantity);
                                    $parentScope.twotap_wishlist_cart.sites[sikey].shop = scope.saveprofile2[p].product[0].merchant;
                                    $parentScope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].brand = scope.saveprofile2[p].product[0].brand;
                                    if (angular.isDefined(scope.saveprofile2[p].required_field_values.size)) {
                                        $parentScope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].size = angular.copy(scope.saveprofile2[p].required_field_values.size);
                                    }
                                    if (scope.saveprofile2[p].required_field_values.hasOwnProperty('color')) {
                                        $parentScope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].color = angular.copy(scope.saveprofile2[p].required_field_values.color);
                                        var i = 0;
                                        var num = -1;
                                        if (scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].required_field_values.hasOwnProperty('color')) {
                                            for (var zt = 0; zt < scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color.length; zt++) {
                                                if (scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[zt].value == scope.saveprofile2[p].required_field_values.color) {
                                                    if (scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[zt].hasOwnProperty('dep')) {
                                                        if (scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[zt].dep.hasOwnProperty('size')) {
                                                            $parentScope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].required_field_values.size = scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[zt].dep.size;
                                                            $parentScope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].size = scope.saveprofile2[p].required_field_values.size;
                                                            break;
                                                        }
                                                    }
                                                }
                                            } //
                                        }
                                    } //
                                    //  $parentScope.saving = scope.saving + ((scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].orig_price - parseFloat(scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].price.substring(1), 10)) * (scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].quantity));
                                    temp_aff = scope.saveprofile2[p].twoTapAffiliateLink;
                                    $parentScope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].affiliate_links = temp_aff;
                                    clean_url = scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].clean_url;
                                    if (scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].image == "") {
                                        if (scope.saveprofile2[p].product[0].image_url != "") $parentScope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].image = scope.saveprofile2[p].product[0].image_url;
                                        else if (scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].alt_images.length > 0) $parentScope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].image = scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].alt_images[0];
                                    }
                                }
                            } // for loop end 
                        } // save profile loop
                    }
                    $parentScope.twotap_wishlist_cart.shipping = angular.copy(scope.shipping_address);
                    $parentScope.twotap_wishlist_cart.billing = angular.copy(scope.billing_address);
                    $parentScope.twotap_wishlist_cart.card = angular.copy(scope.card_details);
                    //if(data.availability)
                    //{
                    //$parentScope.estimateFunctionTop(scope.twotap_wishlist_cart,-9,scope.considered_items_wish);
                    scope.estimatefunction (scope.twotap_wishlist_cart, -9, scope.considered_items_wish, 'wish');
                    //}
                }, function (response) {
                    scope.ss_wish_load = 0;
                });
            }
            scope.twotapwishOut = function (step) {
                console.log('cart');
                scope.asyncIsUserLoggedIn(function (isLoggedIn) {
                    if (!isLoggedIn) {
                        $parentScope.after_login_location = '/shoppingbag';
                        sShoppable.ssLogIn();
                        console.log('show popup login');
                        $parentScope.step = 1;
                        scope.ss_wish_load = 0;
                        return;
                    }
                    twotapwishOut_part(step);
                });
            };
            // purchase attempt
            scope.size_change = function (sikey, md5pro) {
                var num_required = 0;
                num_required = scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].required_field_names.length;
                var count = 0;
                if (angular.isDefined(scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].size)) {
                    if (scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].size != "") count = count + 1;
                }
                if (angular.isDefined(scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].color)) {
                    if (scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].color != "") count = count + 1;
                }
                if (angular.isDefined(scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].quantity)) {
                    if (scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].quantity > 0) count = count + 1;
                }
                if (angular.isDefined(scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].option)) {
                    if (scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].option != "") count = count + 1;
                }
                if (num_required > count) $parentScope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].movetobagPossible = 0;
                else $parentScope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].movetobagPossible = 1;
            };
            scope.linksearchapi = function () {
                $http.get("https://linksearch.api.cj.com/v2/link-search?website-id=7095303&advertiser-ids=2609575&link-type=Text+Link&promotion-type=coupon&page-number=1&records-per-page=20").then(function (response) {
                    console.log(response.data);
                })
            };
            scope.return_policy = function (return_info, name, logo) {
                var len = return_info.length - 1;
                $parentScope.return_info = $sce.trustAsHtml(return_info);
                $parentScope.return_store_name = name;
                $parentScope.return_store_logo = logo;
                scope.$apply();
            };
            scope.coupon_apply = function () {
                scope.estimatefunction (scope.twotap_builtin_cart, -1, scope.considered_items, 'cart');
            };
            scope.coupka = false;
            scope.priceEstimationMerchantWise = function (merchant, index) {
                scope.coupka = true;
                scope.itemQuantity = [];
                checkoutRequest = {};
                obj = scope.userprofile2; // my custom cart data
                scope.considered_items = [];
                counter = 0; // keeping product url
                // using following loop we generate json object for the product
                quantity_product = 0;
                requestedItems = [];
                // using following loop we generate json object for the product
                url_product = "";
                if (!Date.now) {
                    timeCurrent = function now() {
                        return new Date().getTime();
                    }
                } else {
                    timeCurrent = Date.now();
                }
                for (t in obj) {
                    // if(obj[t].retailer==merchant)
                    // {
                    url_product = obj[t].chkout_url;
                    requestedItems.push(url_product); // make an array of product url
                    scope.considered_items.push(obj[t]);
                    quantity_product = obj[t].quantity;
                    scope.itemQuantity[counter] = {
                        'url': url_product,
                        'quantity': quantity_product
                    }; // define json object
                    counter = counter + 1;
                    // }
                }
                checkoutRequest['public_token'] = scope.twotap_public_token;
                checkoutRequest['products'] = JSON.stringify(scope.itemQuantity); // adding product urls
                checkoutRequest['custom_css_url'] = '';
                if (requestedItems.length == 0) {
                    console.log("no item inside cart");
                    return;
                }
                if (scope.tap == 0) {
                    console.log("already added to cart ");
                    scope.estimatefunction (scope.twotap_builtin_cart, -1, scope.considered_items, 'cart'); // as full cart is there
                    return;
                }
                pro_url = {
                    products: requestedItems
                };
                if (angular.isDefined(scope.twotap_builtin_cart)) {
                    console.log("inside edge");
                    scope.estimatefunction (scope.twotap_builtin_cart, -1, scope.considered_items, 'cart');
                } else {
                    add_product_into_cart(pro_url, index);
                }
            };
            function add_product_into_cart(pro_url, index) {
                var CART_ID;
                var status_coming = false;
                $http.post("https://api.twotap.com/v1.0/cart?public_token=" + scope.twotap_public_token, pro_url).then(function (response) {
                    scope.details = response.data;
                    CART_ID = response.data.cart_id;
                    var stop;
                    var timer = 0;
                    // Don't start a new fight if we are already fighting
                    if (angular.isDefined(stop)) return;
                    var valid = false;
                    stop = $interval(function () {
                        if (!valid) {
                            $http.get("https://api.twotap.com/v1.0/cart/status?public_token=" + scope.twotap_public_token + "&cart_id=" + CART_ID).then(function (response2) {
                                //
                                if (response2.data.message != "still_processing" || timer > 300000) {
                                    scope.stopFight();
                                    valid = true;
                                    if (response2.data.message == "done") {
                                        scope.estimatefunction (response2.data, index, scope.considered_items, 'cart'); // product added to cart now call estimation function
                                    }
                                }
                            })
                        }
                        timer = timer + 3000;
                    }, 3000);
                });
            }
            // use cart id to build cart
            // Function That  calculate estimate price
            scope.estimateFunction = function (data, index, itemlist, cart_wish) {
                    var con_j = [];
                    if (index == -3) { // by clicking shipping option
                        var obj = scope.userprofile2; // my custom cart data
                        for (var t in obj) {
                            if (scope.ck_all) con_j.push(obj[t]);
                            else {
                                ///////////////////
                                if (obj[t].retailer == scope.cur_merchant) {
                                    con_j.push(obj[t]);
                                }
                            }
                        }
                        itemlist = con_j;
                    }
                    var site_arraysite_array = [];
                    var coupons = [];
                    var gif_card = [];
                    for (var sitekey in data.sites) {
                        site_arraysite_array.push(sitekey); // insert all sites inside an array
                    }
                    // var para_json = {
                    // "cart_id": data.cart_id,
                    // "fields_input": {},
                    // "destination_country": "Japan"
                    // }
                    var para_json = {
                        "cart_id": data.cart_id,
                        "fields_input": {}
                    }
                    var shoption = "cheapest";
                    var cart_by_site;
                    var product_key_md5;
                    var j;
                    var gcard;
                    var gpin;
                    for (var counter = 0; counter < site_arraysite_array.length; counter++) { // for one site
                        siteskey = site_arraysite_array[counter]; // getting single site
                        coupons = []; // coupon is array for each site there will be one array
                        gif_card = [];
                        // if(scope.tap==1)
                        // {
                        // if(index>0)
                        // counter= index;
                        // if(scope.cartDistinctStore[counter].coupon1!="" || scope.cartDistinctStore[counter].coupon1!=undefined)
                        // coupons.push(scope.cartDistinctStore[counter].coupon1);
                        // if(scope.cartDistinctStore[counter].coupon2!="" || scope.cartDistinctStore[counter].coupon2!=undefined)
                        // coupons.push(scope.cartDistinctStore[counter].coupon2);
                        // if(scope.cartDistinctStore[counter].coupon3!="" || scope.cartDistinctStore[counter].coupon3!=undefined)
                        // coupons.push(scope.cartDistinctStore[counter].coupon3);
                        // if(scope.cartDistinctStore[counter].coupon4!="" || scope.cartDistinctStore[counter].coupon4!=undefined)
                        // coupons.push(scope.cartDistinctStore[counter].coupon4);
                        // if(angular.isDefined(scope.cartDistinctStore[counter].shoption))
                        // {
                        // shoption = scope.cartDistinctStore[counter].shoption;
                        // }
                        // }
                        // else
                        // {
                        if (data.sites[siteskey].coupon1) {
                            if (data.sites[siteskey].coupon1 != "") {
                                coupons.push(data.sites[siteskey].coupon1);
                            }
                        }
                        if (data.sites[siteskey].coupon2) {
                            if (data.sites[siteskey].coupon2 != "") {
                                coupons.push(data.sites[siteskey].coupon2);
                            }
                        }
                        if (data.sites[siteskey].coupon3) {
                            if (data.sites[siteskey].coupon3 != "") {
                                coupons.push(data.sites[siteskey].coupon3);
                            }
                        }
                        if (data.sites[siteskey].coupon4) {
                            if (data.sites[siteskey].coupon4 != "") {
                                coupons.push(data.sites[siteskey].coupon4);
                            }
                        }
                        if (data.sites[siteskey].gift_cards_number && data.sites[siteskey].gift_cards_pin) {
                            if (data.sites[siteskey].gift_cards_number != "" && data.sites[siteskey].gift_cards_pin != "") {
                                gcard = data.sites[siteskey].gift_cards_number;
                                gpin = data.sites[siteskey].gift_cards_pin;
                                gif_card[0] = {};
                                gif_card[0].number = gcard;
                                gif_card[0].pin = gpin;
                            }
                        }
                        // set shipping option along price
                        var found_ship;
                        if (cart_wish == 'cart') {
                            if (angular.isDefined(data.sites[siteskey].shipping_option)) shoption = data.sites[siteskey].shipping_option;
                            else {
                                found_ship = false;
                                angular.forEach(data.sites[siteskey].shipping_options, function (shipvalue, shipkey) {
                                    if (!found_ship) {
                                        data.sites[siteskey].shipping_option = shipkey;
                                        shoption = data.sites[siteskey].shipping_option;
                                    }
                                    if (shipvalue == 'cheapest') {
                                        found_ship = true;
                                    } else if (shipvalue == 'default') {
                                        found_ship = true;
                                    }
                                });
                            }
                        }
                        // }
                        para_json.fields_input[siteskey] = {
                            "addToCart": {
                                // product_md5 will be dynamic
                            },
                            "failed_to_add_to_cart": {
                                // product_md5 will be dynamic
                            },
                            "coupons": coupons
                        }
                        var address_user = {};
                        if (angular.isDefined(scope.shipping_address.country) && scope.shipping_address.country != 'United States of America') {
                            para_json.destination_country = 'United States of America';
                        } else if (angular.isDefined(scope.shipping_address) && scope.shipping_address != null) {
                            if (angular.isDefined(scope.shipping_address.city) && scope.shipping_address.city != null && angular.isDefined(scope.shipping_address.state) && scope.shipping_address.state != null && angular.isDefined(scope.shipping_address.zip) && scope.shipping_address.zip != null) {
                                address_user = {
                                    "shipping_city": scope.shipping_address.city,
                                    "shipping_state": scope.shipping_address.state,
                                    "shipping_zip": scope.shipping_address.zip
                                };
                                if (angular.isDefined(scope.shipping_address.country) && scope.shipping_address.country != null) address_user.shipping_country = scope.shipping_address.country;
                                if (angular.isDefined(scope.shipping_address.address) && scope.shipping_address.address != null) address_user.shipping_address = scope.shipping_address.address;
                                para_json.fields_input[siteskey].noauthCheckout = address_user;
                            } else if (angular.isDefined(scope.shipping_address.country) && scope.shipping_address.country != null) {
                                para_json.destination_country = scope.shipping_address.country;
                            } else {
                                para_json.destination_country = 'United States of America';
                            }
                        } else {
                            para_json.destination_country = 'United States of America';
                        }
                        if (angular.isDefined(shoption)) {
                            para_json.fields_input[siteskey].shipping_option = shoption;
                        }
                        if (gif_card.length > 0) para_json.fields_input[siteskey]["gift_cards"] = gif_card;
                        cart_by_site = data.sites[siteskey].add_to_cart; // each site have single add to cart
                        j = 0;
                        for (product_key_md5 in cart_by_site) { // each cart have multiple product key md5
                            para_json.fields_input[siteskey]["addToCart"][product_key_md5] = {};
                            for (j = 0; j < itemlist.length; j++) {
                                if (itemlist[j].chkout_url == cart_by_site[product_key_md5].original_url) {
                                    para_json.fields_input[siteskey]["addToCart"][product_key_md5]["quantity"] = itemlist[j].quantity;
                                    if ("size" in itemlist[j]["required_field_values"]) {
                                        para_json.fields_input[siteskey]["addToCart"][product_key_md5]["size"] = itemlist[j]["required_field_values"].size;
                                    }
                                    if ("color" in itemlist[j]["required_field_values"]) para_json.fields_input[siteskey]["addToCart"][product_key_md5]["color"] = itemlist[j]["required_field_values"].color;
                                    if ("option" in itemlist[j]["required_field_values"]) para_json.fields_input[siteskey]["addToCart"][product_key_md5]["option"] = itemlist[j]["required_field_values"].option;
                                    itemlist.splice(j, 1); // remove the item when done to reduce the array
                                    break;
                                }
                            }
                        }
                        // fcart_by_site =  data.sites[siteskey].failed_to_add_to_cart; // each site have single add to cart
                        // var f=0;
                        // for(fproduct_key_md5 in fcart_by_site) // each cart have multiple product key md5
                        // {
                        // para_json.fields_input[siteskey]["failed_to_add_to_cart"][fproduct_key_md5] ={};
                        // for(f=0;f<itemlist.length;f++)
                        // {
                        // if(itemlist[f].chkout_url==fcart_by_site[fproduct_key_md5].original_url)
                        // {
                        // para_json.fields_input[siteskey]["failed_to_add_to_cart"][fproduct_key_md5]["quantity"] = itemlist[f].quantity;
                        // if ("size" in itemlist[f]["required_field_values"])
                        // {
                        // para_json.fields_input[siteskey]["failed_to_add_to_cart"][fproduct_key_md5]["size"] =itemlist[f]["required_field_values"].size;
                        // }
                        // if ("color" in itemlist[f]["required_field_values"])
                        // para_json.fields_input[siteskey]["failed_to_add_to_cart"][fproduct_key_md5]["color"] = itemlist[f]["required_field_values"].color;
                        // if("option" in itemlist[f]["required_field_values"])
                        // para_json.fields_input[siteskey]["failed_to_add_to_cart"][fproduct_key_md5]["option"] =  itemlist[f]["required_field_values"].option;
                        // itemlist.splice(f, 1);    // remove the item when done to reduce the array
                        // break;
                        // }
                        // }
                        // }
                    }
                    // calling price estimation api
                    console.log(para_json);
                    $http.post("https://api.twotap.com/v1.0/cart/estimates?public_token=" + scope.twotap_public_token, para_json).then(function (response3) {
                        var xjson = angular.copy(para_json);
                        var n;
                        var siter_id;
                        var shipping_method;
                        var pata = $location.path();
                        // if (index > -1 && pata != '/scheckout') {
                        // siter_id = scope.cartDistinctStore[index].site_key;
                        // scope.cartDistinctStore[index].estimation = response3.data; // used to update individual estimation
                        // scope.cartDistinctStore[index].estimationCalled = true;
                        // scope.cartDistinctStore[index].estimates = response3.data.estimates[siter_id];
                        // //prob remain
                        // if (cart_wish == 'cart') {
                        // if (angular.isDefined(scope.twotap_builtin_cart)) {
                        // for(var siter )
                        // $parentScope.twotap_builtin_cart.sites[siter_id].estimates = response3.data.estimates[siter_id];
                        // $parentScope.estimated_price_totals = response3.data.estimated_total_prices;
                        // //  $parentScope.estimated_move_price_totals = angular.copy(response3.data.estimated_total_prices);
                        // }
                        // else {
                        // $parentScope.estimated_price_totals = {"final_price": "$0.0", "subtotal": "$0.0"};
                        // //    $parentScope.estimated_move_price_totals = {"final_price": "$0.0", "subtotal": "$0.0"};
                        // }
                        // }
                        // }
                        // else {
                        $parentScope.checkoutpossible = true;
                        var path = $location.path();
                        if (cart_wish == 'cart') {
                            var current_sitevalid_coupons;
                            $parentScope.valid_coupons = 0;
                            scope.valid_coupon_store = 0;
                            $parentScope.invalid_coupons = 0;
                            var atleast_one_coupon_store = false; // how many store for coupons
                            var sarray = [];
                            for (var sitekey in response3.data.estimates) {
                                console.log(sitekey);
                                sarray.push(sitekey); // insert all sites inside an array
                            }
                            for (var p = 0; p < sarray.length; p++) {
                                atleast_one_coupon_store = false;
                                siter_id = sarray[p];
                                shipping_method = scope.twotap_builtin_cart.sites[siter_id].shipping_option;
                                $parentScope.twotap_builtin_cart.sites[siter_id].estimates = response3.data.estimates[siter_id];
                                if (angular.isDefined($parentScope.shipping_chrg[siter_id])) $parentScope.shipping_chrg[siter_id][shipping_method] = response3.data.estimates[siter_id].prices.shipping_price;
                                xjson.fields_input[siter_id].coupons = [];
                                var i = 0;
                                for (var coup in response3.data.coupons[siter_id]) // single site
                                {
                                    if (response3.data.coupons[siter_id][coup].status == "valid") {
                                        $parentScope.valid_coupons = scope.valid_coupons + 1;
                                        atleast_one_coupon_store = true;
                                    } else {
                                        $parentScope.invalid_coupons = scope.invalid_coupons + 1;
                                        $parentScope.checkoutpossible = false;
                                    }
                                    i = i + 1;
                                }
                                if (atleast_one_coupon_store) {
                                    scope.valid_coupon_store = scope.valid_coupon_store + 1;
                                }
                            }
                            if (scope.invalid_coupons > 0) {
                                console.log("there is atleast one invalid coupon");
                            }
                            if (atleast_one_coupon_store) {
                                if (scope.coupka) {
                                    $parentScope.common_popup_message = "You have successfully applied total " + scope.valid_coupons + " coupons";
                                    $parentScope.common_popup_header = "Coupon Apply Notification";
                                    $('#commonPopup').modal('show');
                                    scope.coupka = false;
                                }
                            }
                            $parentScope.estimated_price_totals = response3.data.estimated_total_prices;
                            //$parentScope.estimated_move_price_totals = angualr.copy(response3.data.estimated_total_prices);
                            scope.twotap_builtin_cart.estimated_total_prices = response3.data.estimated_total_prices;
                            //console.log(response3.data.estimated_total_prices);
                            // if(angular.isDefined(scope.estimated_price_totals.coupon_value))
                            // {
                            // if(angular.isNumber(scope.estimated_price_totals.coupon_value.substring(1)))
                            // $parentScope.saving =scope.saving+  parseFloat(scope.estimated_price_totals.coupon_value.substring(1),10)
                            // else
                            // $parentScope.saving =scope.saving;
                            // }
                            // else
                            // {
                            // console.log("estimate");
                            // $parentScope.saving =scope.saving;
                            // }
                            if (angular.isDefined(scope.estimated_price_totals)) {
                                if (scope.estimated_price_totals.coupon_value == "applied at checkout") {
                                    $parentScope.saving = scope.saving;
                                    //scope.estimatefunction (data,index,itemlist,cart_wish);
                                } else {
                                    if (angular.isDefined(scope.estimated_price_totals.coupon_value)) $parentScope.saving = parseFloat(scope.estimated_price_totals.coupon_value.substring(1), 10) + scope.saving;
                                }
                            }
                        } else {
                            $parentScope.estimated_price_totals_wish = response3.data.estimated_total_prices;
                        }
                        //}
                    }, function (response3) {
                        if (cart_wish == 'cart') {
                            $parentScope.estimated_price_totals = {
                                "final_price": "$0.0",
                                "subtotal": "$0.0",
                                "sales_tax": "$0.0",
                                "shipping_price": "$0.0"
                            };
                            scope.twotap_builtin_cart.estimated_total_prices = response3.data.estimated_total_prices;
                        } else {
                            $parentScope.estimated_price_totals_wish = {
                                "final_price": "$0.0",
                                "subtotal": "$0.0"
                            };
                        }
                    });
                };
                // stop interval
                // remove invalid coupons and make thing workable
            scope.remove_invalid = function (coupon) {
                if (coupon == "") $parentScope.invalid_coupons = scope.invalid_coupons - 1;
                if (scope.invalid_coupons < 1) {
                    scope.priceEstimationMerchantWise("", -1)
                    $parentScope.checkoutpossible = true;
                }
            };
            scope.stopFight = function () {
                if (angular.isDefined(stop)) {
                    $interval.cancel(stop);
                    stop = undefined;
                }
            };
            var purchase_id;
            var validPurchaseClick = false;
            var lefyInterval;
            scope.leftcmbhistory = 0;
            scope.stoplefyInterval = function () {
                scope.leftcmbhistory = 0;
                $interval.cancel(lefyInterval);
            };
            //destroy interval
            scope.$on('$destroy', function () {
                // Make sure that the interval is destroyed too
                scope.stopFight();
                $parentScope.purchase_button = "";
                scope.stoplefyInterval();
                scope.leftcmbhistory = 0;
            });
            scope.saveUserProduct = function (productId, catalogId, retailer) {
                var s_product = {
                    'productId': productId,
                    'catalogId': catalogId,
                    'retailer': retailer
                };
                $http.post('/update_user_products', s_product).success(function (data) {
                    $parentScope.user_saved_item_id = data; // redefine saved item ids
                    $parentScope.saved_item_number = Object.keys(data).length; // redefine saved item ids
                    if ($parentScope.saved_item_number > 0) {
                        var multiID = {
                            'mid': $parentScope.user_saved_item_id
                        };
                        $http.post('/productUserMultiID', multiID).success(function (data) {
                            $parentScope.user_saved_item = data;
                        }).error(function (err) {
                            window.alert("Error: " + err);
                        });
                    }
                    $parentScope.deleteFromCart(productId);
                }).error(function (err) {
                    window.alert("Error: " + err);
                });
            };
            scope.saveUserProductCatId = function (catalogId, retailer) {
                var s_product = {
                    'catalogId': catalogId,
                    'retailer': retailer
                };
                $http.post('/update_user_products', s_product).success(function (data) {
                    $parentScope.user_saved_item_id = data; // redefine saved item ids
                    $parentScope.saved_item_number = Object.keys(data).length; // redefine saved item ids
                    $parentScope.deleteFromCartCatalog(catalogId);
                    console.log(scope.user_saved_item_id);
                    if (scope.saved_item_number > 0) {
                        var multiID = {
                            'mid': scope.user_saved_item_id
                        };
                        $http.post('/productUserMulticatalogID', multiID).success(function (data) {
                            $parentScope.user_saved_item = data;
                        }).error(function (err) {
                            console.log("Error: " + err);
                        });
                    }
                }).error(function (err) {
                    console.log("multi catalogue id Error: " + err);
                });
            };
            scope.deleteFromCartX = function (productId) {
                $parentScope.deleteFromCart(productId);
                $parentScope.getCartItemsJson();
                $parentScope.getcartDistinctRetailer();
            };
            scope.deleteFromCartCatId = function (catalogId) {
                $parentScope.deleteFromCartCatalog(catalogId);
            };
            scope.deleteFromCart = function (promd5, catalogId) {
                $parentScope.deleteFromCartCatalog(catalogId);
            };
            scope.reset_size_list = function (complete, col, ind) {
                // need to find the index
                var i = 0,
                    num = -1;
                for (i = 0; i < complete.required_field_values.color.length; i++) {
                    if (complete.required_field_values.color[i].value == col) {
                        num = i;
                    }
                }
                complete.required_field_values.size = complete.required_field_values.color[num].dep.size;
                //  console.log(complete.required_field_values.size);
                //complete.image= col;
            };
            if (scope.firsttime.loading == 1) {
                if (angular.isDefined(scope.userprofile2)) {
                    scope.ss_cart_load = 1;
                    scope.twotapCheckoutCart(1);
                    if (scope.ck_all) {
                        $parentScope.num_stores = angular.copy(scope.total_cart_distinct_store);
                    } else {
                        $parentScope.num_stores = 1;
                    }
                }
                if (angular.isDefined(scope.saveprofile2)) {
                    scope.ss_wish_load = 1;
                    scope.twotapwishOut(1);
                }
            }
            console.log('loggedin: ' + scope.loggedin, 'isDefined: ' + (!angular.isDefined(scope.loggedin)));
            scope.asyncIsUserLoggedIn(function (isLoggedIn) {
                // if (scope.loggedin == 0 || (!angular.isDefined(scope.loggedin))) {
                if (!isLoggedIn) {
                    sShoppable.$loginPopupOverlay.on('close.login.modal', function () {
                        scope.menuCategorySearch('dashboard'); // Show the slider
                        $location.path('/');
                        $route.reload();
                    });
                    sShoppable.ssLogIn();
                    window.cartComponent$location = $location;
                    window.cartComponent$route = $route;
                    console.log('show popup login');
                }
            });
            $parentScope.loadfull = true;
        }
    };
}]);