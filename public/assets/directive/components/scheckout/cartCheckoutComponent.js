angular.module('SSApp').directive('cartCheckoutComponent', ['$sce', '$http', '$window', '$cookies', '$route', '$location', '$interval', 'setRequiredfieldCart', '$anchorScroll', function ($sce, $http, $window, $cookies, $route, $location, $interval, setRequiredfieldCart, $anchorScroll) {
    return {
        restrict: 'E',
        templateUrl: 'assets/directive/components/scheckout/cartCheckoutView.html',
        link: function (scope) {
            // scope.ss_wish_load = 1;
            // scope.ss_cart_load = 1;
            scope.asyncIsUserLoggedIn(function (isLoggedIn) {
                if (isLoggedIn) {
                    console.log('ok');
                } else {
                    if (scope.firsttime.loading == 0) {
                        $location.path('/shoppingbag');
                        scope.$parent.firsttime.loading = 1;
                        scope.$parent.loadfull = true;
                        //scope.$parent.menuCategorySearchApi('dashboard');
                    } else {
                        $location.path('/shoppingbag');
                    }
                    $route.reload();
                    $("#login-popup").modal("show");
                    return;
                }
            });
            scope.$parent.step = 2;
            scope.$parent.tap = 0;
            scope.$parent.selected = "";
            var tempo, pushtrue = true, pather = $location.path();
            if (angular.isDefined(scope.pathTorch)) {
                tempo = scope.pathTorch;
            }
            var pro_url_wish, url, pro_url, temppath;
            url = '#!/scheckout';
            temppath = {
                'poth': url,
                'label': 'checkout'
            };
            scope.$parent.addTobagPossible = false;
            // bread crumb logic
            for (var i = 0; i < tempo.length; i++) {
                if (tempo[i].label == temppath.label) {
                    pushtrue = false;
                    for (var k = i + 1; k < tempo.length; k++) { // remove laters
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
            scope.card_validate = function (item, ccnumber) {
                    if (!ccnumber) {
                        return '';
                    }
                    var cardType, valid, val;
                    mul = 0,
                        prodArr = [
                            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                            [0, 2, 4, 6, 8, 1, 3, 5, 7, 9]
                        ],
                        sum = 0;
                    ccnumber = ccnumber.toString().replace(/\s+/g, ''); // replace all spaces
                    var number_length = ccnumber.length;
                    if (/^(34)|^(37)/.test(ccnumber)) {
                        cardType = "American Express";
                        if (number_length == 15) {
                            val = 1;
                            console.log("valid length")
                        } else {
                            val = 0;
                        }
                    } else if (/^(62)|^(88)/.test(ccnumber)) {
                        cardType = "China UnionPay";
                        val = 0; // card type not supported
                    } else if (/^30[0-5]/.test(ccnumber)) {
                        cardType = "Diners Club Carte Blanche";
                        val = 0;
                    } else if (/^(2014)|^(2149)/.test(ccnumber)) {
                        cardType = "Diners Club enRoute";
                        val = 0;
                    } else if (/^36/.test(ccnumber)) {
                        cardType = "Diners Club International";
                        val = 0;
                    } else if (/^(6011)|^(622(1(2[6-9]|[3-9][0-9])|[2-8][0-9]{2}|9([01][0-9]|2[0-5])))|^(64[4-9])|^65/.test(ccnumber)) {
                        cardType = "Discover Card";
                        val = 0;
                    } else if (/^35(2[89]|[3-8][0-9])/.test(ccnumber)) {
                        cardType = "JCB";
                        val = 0;
                    } else if (/^(6304)|^(6706)|^(6771)|^(6709)/.test(ccnumber)) {
                        cardType = "Laser";
                        val = 0;
                    } else if (/^(5018)|^(5020)|^(5038)|^(5893)|^(6304)|^(6759)|^(6761)|^(6762)|^(6763)|^(0604)/.test(ccnumber)) {
                        cardType = "Maestro";
                        val = 0;
                    } else if (/^5[1-5]/.test(ccnumber)) {
                        cardType = "Mastercard";
                        if (number_length == 16) {
                            val = 1;
                            console.log("valid length")
                        } else {
                            val = 0;
                        }
                    } else if (/^4/.test(ccnumber)) {
                        cardType = "Visa";
                        if (number_length == 13 || number_length == 16) {
                            val = 1;
                            console.log("valid length")
                        } else val = 0;
                    } else if (/^(4026)|^(417500)|^(4405)|^(4508)|^(4844)|^(4913)|^(4917)/.test(ccnumber)) {
                        cardType = "Visa Electron";
                        val = 0;
                    } else {
                        cardType = "";
                        val = 0;
                    }
                    item.card.type = cardType;
                    item.card_valid = val;
                    console.log(item.card_valid);
                }
                // (proMd5,item,prokey,wsitekey,'wish')
            scope.set_current_product_pro_update = function (pro, item, prokey, sitekey, cart_or_wishlist) {
                scope.$parent.quickview_update = 1;
                scope.$parent.set_current_product_pro_mother(pro, item, prokey, sitekey);
                scope.$parent.quickvew = 0;
                scope.$parent.qvLoading = true;
                scope.$parent.update_cart_or_wish = cart_or_wishlist;
                scope.$parent.current_sitekey = sitekey;
                scope.$parent.current_prokey = prokey;
            };
            scope.review = function () {
                $location.hash('rev');
                $anchorScroll();
            };
            // when click to quick view
            scope.set_current_product_pro = function (pro, item, prokey, sitekey) {
                scope.$parent.qvLoading = true;
                scope.$parent.quickview_update = 0;
                scope.$parent.quickvew = 0;
                var temp, potap = [], length = 0, retp, timeCurrent, jsonTemp = {
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
                scope.$parent.set_current_product_pro_mother(pro, item, prokey, sitekey);
            };
            var tem, pota, tem2, pota2;
            if (angular.isDefined($window.localStorage.getItem('recentI'))) {
                var tem = $window.localStorage.getItem('recentI');
                //pota = angular.fromJson(tem);
                pota = JSON.parse(tem);
                scope.$parent.recentItems = pota;
                var tem2 = $window.localStorage.getItem('recent2');
                //pota = angular.fromJson(tem);
                pota2 = JSON.parse(tem2);
                scope.$parent.recentItems2 = pota2;
            } else {
                scope.$parent.recentItems = undefined;
            }
            if (!angular.isDefined(scope.twotap_builtin_cart)) {
                scope.$parent.step = 1;
                scope.$parent.tap = 1;
            } else {
                scope.$parent.step = 2;
                scope.$parent.tap = 0;
            }
            var requestedItems;
            var obj;
            var url_product; // url temporary
            var checkoutRequest = {};
            //scope.browser_action = "Goback";
            scope.browser_action = "Go Back";
            var ind;
            var counter = 0;
            if (!angular.isDefined(scope.card_details)) scope.$parent.card_details = {};
            var quantity_product;
            var sites_arr = [];
            var storeProducts = [];
            var ramp = [];
            var sikey;
            var md5pro;
            var timeCurrent;
            var sk;
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
            scope.requiredvalueChange = function (required_value, datacart, wsitekey, prokey, index) {
                    console.log(" required value change");
                    if (index == -9) { // wishlist
                        scope.$parent.twotap_wishlist_cart.sites[wsitekey].add_to_cart[prokey].required_field_values = required_value;
                        scope.$parent.twotap_wishlist_cart.sites[wsitekey].add_to_cart[prokey].quantity = required_value.quantity;
                        scope.$parent.estimateFunctionTop(datacart, index, scope.considered_items_wish); // no need to change the items
                        update_cart(datacart, [], scope.saveprofile2, index)
                    } else {
                        if (index == -100) { // failed cart
                            scope.$parent.twotap_builtin_cart.sites[wsitekey].failed_to_add_to_cart[prokey].required_field_values = required_value;
                        } else {
                            scope.$parent.twotap_builtin_cart.sites[wsitekey].add_to_cart[prokey].required_field_values = required_value;
                        }
                        scope.$parent.estimateFunctionTop(datacart, index, scope.considered_items); // no need to change the items
                        update_cart(datacart, scope.userprofile2, index);
                    }
                }
                /////////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////////// FUNCTION THAT UPDATE QUANTITY IN OUR CART ////////////////////////////////////
                //////////////////////////////////////////////////////////////////////////////////////////////////////
            scope.quantityChange = function (quantity, datacart, wsitekey, prokey, index) {
                if (index == -9) {
                    console.log("I am herez");
                    if (datacart.sites[wsitekey].hasOwnProperty('add_to_cart')) {
                        scope.$parent.twotap_wishlist_cart.sites[wsitekey].add_to_cart[prokey].required_field_values.quantity = quantity;
                        scope.$parent.twotap_wishlist_cart.sites[wsitekey].add_to_cart[prokey].quantity = quantity;
                    } else {
                        scope.$parent.twotap_wishlist_cart.sites[wsitekey].failed_to_add_to_cart[prokey].required_field_values.quantity = quantity;
                        scope.$parent.twotap_wishlist_cart.sites[wsitekey].failed_to_add_to_cart[prokey].quantity = quantity;
                    }
                    setRequiredfieldCart.userCartRefresh(datacart, scope.saveprofile2).then(function (responsep) {
                            scope.$parent.saveprofile2 = responsep;
                            console.log(responsep);
                            update_cart_quantity(datacart, responsep, index);
                            scope.$parent.saved_item_number = scope.$parent.calculateItemsFromChild(responsep);
                            scope.$parent.cartDistinctDreamStore = scope.$parent.getcartUniqueRetailerFromChild(responsep);
                            //scope.total_cart_distinct_wishstore = scope.cartDistinctDreamStore.length;
                            scope.$parent.num_stores_wish = scope.saved_item_number;
                        })
                        // scope.$parent.count_items(datacart, index, scope.considered_items_wish);
                    scope.$parent.estimateFunctionTop(datacart, index, scope.considered_items_wish); // no need to change the items
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
                            scope.$parent.saving = scope.saving + (diff * quantity_inc);
                            //scope.twotap_builtin_cart.sites[wsitekey].
                            scope.$parent.twotap_builtin_cart.sites[wsitekey].quantity_store_wise = scope.twotap_builtin_cart.sites[wsitekey].quantity_store_wise + quantity_inc;
                        } else if (old_quanity > quantity) // we need to add price saving
                        {
                            quantity_dec = (old_quanity - quantity);
                            scope.$parent.saving = scope.saving - (diff * quantity_dec);
                            scope.$parent.twotap_builtin_cart.sites[wsitekey].quantity_store_wise = scope.twotap_builtin_cart.sites[wsitekey].quantity_store_wise - quantity_dec;
                        }
                    } else {
                        var o_quanity = angular.copy(scope.twotap_builtin_cart.sites[wsitekey].add_to_cart[prokey].required_field_values.quantity);
                        old_quanity = parseInt(o_quanity);
                        diff = scope.twotap_builtin_cart.sites[wsitekey].add_to_cart[prokey].orig_price - parseFloat(scope.twotap_builtin_cart.sites[wsitekey].add_to_cart[prokey].price.substring(1), 10);
                        if (quantity > old_quanity) // we need to add price saving
                        {
                            quantity_inc = (quantity - old_quanity);
                            scope.$parent.saving = scope.saving + (diff * quantity_inc);
                            //scope.twotap_builtin_cart.sites[wsitekey].
                            scope.$parent.twotap_builtin_cart.sites[wsitekey].quantity_store_wise = scope.twotap_builtin_cart.sites[wsitekey].quantity_store_wise + quantity_inc;
                        } else if (old_quanity > quantity) // we need to add price saving
                        {
                            quantity_dec = (old_quanity - quantity);
                            scope.$parent.saving = scope.saving - (diff * quantity_dec);
                            scope.$parent.twotap_builtin_cart.sites[wsitekey].quantity_store_wise = scope.twotap_builtin_cart.sites[wsitekey].quantity_store_wise - quantity_dec;
                        }
                    }
                    if (index == -100) {
                        scope.$parent.twotap_builtin_cart.sites[wsitekey].failed_to_add_to_cart[prokey].required_field_values.quantity = quantity;
                        scope.$parent.twotap_builtin_cart.sites[wsitekey].failed_to_add_to_cart[prokey].quantity = quantity;
                    } else {
                        scope.$parent.twotap_builtin_cart.sites[wsitekey].add_to_cart[prokey].required_field_values.quantity = quantity;
                        scope.$parent.twotap_builtin_cart.sites[wsitekey].add_to_cart[prokey].quantity = quantity;
                    }
                    // scope.$parent.count_items(datacart, index, scope.considered_items);
                    setRequiredfieldCart.userCartRefresh(scope.twotap_builtin_cart, scope.userprofile2).then(function (responsep) {
                        scope.$parent.userprofile2 = responsep;
                        update_cart_quantity(scope.twotap_builtin_cart, scope.userprofile2, index);
                        //get_cart_details(proMd5.cartId, proMd5.quantity);
                        scope.$parent.cartDistinctStore = scope.$parent.getcartUniqueRetailerFromChild(responsep);
                        //  scope.total_cart_distinct_store = scope.cartDistinctStore.length;
                        scope.$parent.cart_items_number = scope.$parent.calculateItemsFromChild(responsep);
                        if (scope.ck_all) scope.num_items = angular.copy(scope.cart_items_number);
                        scope.$parent.cartTotal();
                    })
                    scope.$parent.estimateFunctionTop(datacart, index, scope.considered_items); // no need to change the items
                }
            };
            function update_cart_quantity(datacart, profile2, index) {
                if (index == -9) // wishlist
                {
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
                                scope.$parent.shoppingbag_cart_changed = true; //
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
            function update_cart(datacart, profile2, index) {
                var sikey;
                for (sikey in datacart.sites) {
                    number_of_products = 0;
                    for (var md5pro in datacart.sites[sikey].add_to_cart) {
                        for (var p = 0; p < profile2.length; p++) {
                            // if(scope.userprofile2[p].productMD5==md5pro)
                            if (profile2[p].chkout_url == datacart.sites[sikey].add_to_cart[md5pro].original_url) {
                                if (index == -9) // wishlist
                                {
                                    scope.$parent.saveprofile2[p].required_field_values = datacart.sites[sikey].add_to_cart[md5pro].required_field_values;
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
                                    scope.$parent.userprofile2[p].required_field_values = datacart.sites[sikey].add_to_cart[md5pro].required_field_values;
                                }
                                for (var ix = 0; ix < 5000; ix++) {
                                    if (ix == 4999) {
                                        $http.post('/customers/update/cart', {
                                            updatedCart: scope.userprofile2
                                        }).success(function (data, status, headers, config) {
                                            scope.$parent.shoppingbag_cart_changed = true; //
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
                            scope.$parent.bigCurrentPage = 1;
                            scope.$parent.load_click = 0;
                            scope.$parent.viewall = 0;
                            scope.$parent.showup = 0;
                            scope.$parent.SearchVisible = false;
                            scope.$parent.selected_sorting = "relevance";
                            scope.$parent.globalSearch = true;
                            var lastsearchObj = $cookies.get('lastquerysearch');
                            if (angular.isDefined(scope.lastsearchobj)) {
                                scope.$parent.queryobj = angular.copy(scope.lastsearchobj);
                                scope.$parent.intervalgapGeneratelink(); // create link
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
                scope.twotapCheckoutCart(2);
            });
            scope.$on('quanChanged', function (e) {
                if (scope.ck_all) scope.quantityChange(scope.required_field_values.quantity, scope.twotap_builtin_cart, scope.current_sitekey, scope.current_prokey, -1);
                else {
                    scope.quantityChange(scope.required_field_values.quantity, scope.twotap_builtin_cart, scope.current_sitekey, scope.current_prokey, 1);
                }
            });
            scope.$on('wingChanged', function (e) { // wish list quantity changed
                scope.quantityChange(scope.required_field_values.quantity, scope.twotap_wishlist_cart, scope.current_sitekey, scope.current_prokey, -9);
            });
            scope.$on('cartChanged', function (e) {
                console.log("broad cast cartChanged working");
                scope.ss_cart_load = 1;
                if (scope.ck_all) scope.twotapCheckoutCart(1);
                else {
                    var temp_merchant = scope.cur_merchant;
                    scope.twotapCheckoutMerchantWise(temp_merchant);
                }
            });
            // following broadcast for move to cart
            scope.$on('movetocartChanged', function (e) {
                console.log("broad cast move to cart working");
                scope.ss_cart_load = 2;
                if (scope.ck_all) scope.twotapCheckoutCart(1);
                else {
                    var temp_merchant = scope.cur_merchant;
                    scope.twotapCheckoutMerchantWise(temp_merchant);
                }
            });
            scope.$on('cartChangedDelete', function (e) {
                console.log("broad cast cartChanged working");
                if (scope.ck_all) scope.twotapCheckoutCart(1);
                else {
                    var temp_merchant = scope.cur_merchant;
                    scope.twotapCheckoutMerchantWise(temp_merchant);
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
            scope.$on('finalPurchaseChild', function (e) {
                scope.twotapPurchase();
                scope.$parent.closeCommonPopup();
            });
            var temp_fieldName;
            // purchase attempt
            ////////////////////////////////// MERCHANT WISE CHECKPOUT
            var clength; // number of color
            /////////////////// WISH LIST ADD //////////////////////////
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
                if (num_required > count) scope.$parent.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].movetobagPossible = 0;
                else scope.$parent.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].movetobagPossible = 1;
            }
            scope.linksearchapi = function () {
                $http.get("https://linksearch.api.cj.com/v2/link-search?website-id=7095303&advertiser-ids=2609575&link-type=Text+Link&promotion-type=coupon&page-number=1&records-per-page=20").then(function (response) {
                    console.log(response.data);
                });
            };
            scope.return_policy = function (return_info, name, logo) {
                var len = return_info.length - 1;
                scope.$parent.return_info = $sce.trustAsHtml(return_info);
                scope.$parent.return_store_name = name;
                scope.$parent.return_store_logo = logo;
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
                pro_url = {
                    products: requestedItems
                };
                if (angular.isDefined(scope.twotap_builtin_cart)) //
                {
                    console.log("inside edge");
                    scope.estimatefunction (scope.twotap_builtin_cart, -1, scope.considered_items, 'cart');
                } else {
                    add_product_into_cart(pro_url, index);
                }
            }
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
                    var site_arraysite_array = [], coupons = [], gif_card = [];
                    for (var sitekey in data.sites) {
                        site_arraysite_array.push(sitekey); // insert all sites inside an array
                    }
                    var para_json = {
                        "cart_id": data.cart_id,
                        "fields_input": {}
                    };
                    var shoption = "cheapest", cart_by_site, product_key_md5, j, gcard, gpin;
                    for (var counter = 0; counter < site_arraysite_array.length; counter++) { // for one site
                        siteskey = site_arraysite_array[counter]; // getting single site
                        coupons = []; // coupon is array for each site there will be one array
                        gif_card = [];
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
                        var address_user = {};
                        para_json.fields_input[siteskey] = {
                            "addToCart": {}, // product_md5 will be dynamic
                            "failed_to_add_to_cart": {}, // product_md5 will be dynamic
                            "coupons": coupons
                        }
                        if (angular.isDefined(scope.shipping_address.country) && scope.shipping_address.country != 'United States of America') {
                            para_json.destination_country = 'United States of America';
                        } else if (angular.isDefined(scope.shipping_address)) {
                            address_user = {
                                "shipping_address": scope.shipping_address.address,
                                "shipping_city": scope.shipping_address.city,
                                "shipping_state": scope.shipping_address.state,
                                "shipping_country": scope.shipping_address.country,
                                "shipping_zip": scope.shipping_address.zip
                            };
                            para_json.fields_input[siteskey].noauthCheckout = address_user;
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
                    }
                    // calling price estimation api
                    $http.post("https://api.twotap.com/v1.0/cart/estimates?public_token=" + scope.twotap_public_token, para_json).then(function (response3) {
                        console.log(response3.data);
                        var xjson = angular.copy(para_json);
                        var n;
                        var siter_id;
                        var shipping_method;
                        var pata = $location.path();
                        scope.$parent.checkoutpossible = true;
                        var path = $location.path();
                        if (cart_wish == 'cart') {
                            var current_sitevalid_coupons;
                            scope.$parent.valid_coupons = 0;
                            scope.valid_coupon_store = 0;
                            scope.$parent.invalid_coupons = 0;
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
                                scope.$parent.twotap_builtin_cart.sites[siter_id].estimates = response3.data.estimates[siter_id];
                                if (angular.isDefined(scope.$parent.shipping_chrg[siter_id])) scope.$parent.shipping_chrg[siter_id][shipping_method] = response3.data.estimates[siter_id].prices.shipping_price;
                                xjson.fields_input[siter_id].coupons = [];
                                var i = 0;
                                for (var coup in response3.data.coupons[siter_id]) { // single site
                                    if (response3.data.coupons[siter_id][coup].status == "valid") {
                                        scope.$parent.valid_coupons = scope.valid_coupons + 1;
                                        atleast_one_coupon_store = true;
                                    } else {
                                        scope.$parent.checkoutpossible = false;
                                        scope.$parent.invalid_coupons = scope.invalid_coupons + 1;
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
                                    scope.$parent.common_popup_message = "You have successfully applied total " + scope.valid_coupons + " coupons";
                                    scope.$parent.common_popup_header = "Coupon Apply Notification";
                                    $('#commonPopup').modal('show');
                                    scope.coupka = false;
                                }
                            }
                            scope.$parent.estimated_price_totals = response3.data.estimated_total_prices;
                            scope.twotap_builtin_cart.estimated_total_prices = response3.data.estimated_total_prices;

                            if (angular.isDefined(scope.estimated_price_totals)) {
                                if (scope.estimated_price_totals.coupon_value == "applied at checkout") {
                                    scope.$parent.saving = scope.saving;
                                    //scope.estimatefunction (data,index,itemlist,cart_wish);
                                } else {
                                    if (angular.isDefined(scope.estimated_price_totals.coupon_value)) scope.$parent.saving = parseFloat(scope.estimated_price_totals.coupon_value.substring(1), 10) + scope.saving;
                                }
                            }
                        } else {
                            scope.$parent.estimated_price_totals_wish = response3.data.estimated_total_prices;
                        }
                        // }
                    }, function (response3) {
                        if (cart_wish == 'cart') {
                            scope.$parent.estimated_price_totals = {
                                "final_price": "$0.0",
                                "subtotal": "$0.0",
                                "sales_tax": "$0.0",
                                "shipping_price": "$0.0"
                            };
                            scope.twotap_builtin_cart.estimated_total_prices = response3.data.estimated_total_prices;
                        } else {
                            scope.$parent.estimated_price_totals_wish = {
                                "final_price": "$0.0",
                                "subtotal": "$0.0"
                            };
                        }
                    });
                };
                // stop interval
                // remove invalid coupons and make thing workable
            scope.remove_invalid = function (coupon) {
                if (coupon == "") scope.$parent.invalid_coupons = scope.invalid_coupons - 1;
                if (scope.invalid_coupons < 1) {
                    scope.priceEstimationMerchantWise("", -1)
                    scope.$parent.checkoutpossible = true;
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
                scope.$parent.purchase_button = "";
                scope.stoplefyInterval();
                scope.leftcmbhistory = 0;
            });
            // purchase operation
            scope.twotapPurchase = function () {
                scope.messageError = "";
                scope.messageFinal = "";
                valid = true;
                var temp_siteid;
                var b_arr = [];
                var s_arr = [];
                var user_shipping_country = scope.twotap_builtin_cart.shipping.country;
                var user_billing_country = scope.twotap_builtin_cart.billing.country;
                var ind;
                var bind;
                // first check whether merchant can deliver in that address
                if (!angular.isDefined(scope.s_array) || !(scope.ck_all)) {
                    var tid;
                    for (temp_siteid in scope.twotap_builtin_cart.sites) {
                        ind = -1;
                        bind = -1;
                        s_arr = scope.twotap_builtin_cart.sites[temp_siteid].shipping_countries_support;
                        b_arr = scope.twotap_builtin_cart.sites[temp_siteid].billing_countries_support;
                        ind = s_arr.indexOf(user_shipping_country);
                        if (ind == -1) {
                            scope.messageError = scope.messageError + "\n your shipping address is not supported by " + scope.twotap_builtin_cart.sites[temp_siteid].info.name;
                            valid = false;
                        }
                        bind = b_arr.indexOf(user_billing_country);
                        if (bind == -1) {
                            scope.messageError = scope.messageError + "\n your billing address is not supported by " + scope.twotap_builtin_cart.sites[temp_siteid].info.name;
                            valid = false;
                        }
                    }
                } else {
                    for (var n = 0; n < scope.s_array.length; n++) {
                        ind = -1;
                        bind = -1;
                        temp_siteid = scope.s_array[n];
                        s_arr = scope.twotap_builtin_cart.sites[temp_siteid].shipping_countries_support;
                        b_arr = scope.twotap_builtin_cart.sites[temp_siteid].billing_countries_support;
                        ind = s_arr.indexOf(user_shipping_country);
                        if (ind == -1) {
                            scope.messageError = scope.messageError + "\n your shipping address is not supported by " + scope.twotap_builtin_cart.sites[temp_siteid].info.name;
                            valid = false;
                        }
                        bind = b_arr.indexOf(user_billing_country);
                        if (bind == -1) {
                            scope.messageError = scope.messageError + "\n your billing address is not supported by " + scope.twotap_builtin_cart.sites[temp_siteid].info.name;
                            valid = false;
                        }
                    }
                }
                // valid means it is deliverable in that zone
                // not disabled means u can process the order
                if (valid && scope.purchase_button != "disabled") { // check whether valid address
                    scope.$parent.purchase_button = "disabled"
                    $http.post('https://api.twotap.com/v1.0/fields_input_validate?public_token=' + scope.twotap_public_token, {
                        'shipping_first_name': scope.twotap_builtin_cart.firstname,
                        'shipping_last_name': scope.twotap_builtin_cart.lastname,
                        'shipping_address': scope.twotap_builtin_cart.shipping.address,
                        'shipping_city': scope.twotap_builtin_cart.shipping.shipping_city,
                        'shipping_state': scope.twotap_builtin_cart.shipping.shipping_state,
                        'shipping_country': scope.twotap_builtin_cart.shipping.country,
                        'shipping_zip': scope.twotap_builtin_cart.shipping.zip,
                        'shipping_telephone': scope.twotap_builtin_cart.shipping.phone,
                        'cart_id': scope.twotap_builtin_cart.cart_id
                    }).then(function (resp) {
                        if (resp.data.message == 'done') {
                            if (scope.num_stores == 1) {
                                scope.common_shipping = true;
                                scope.common_billing = true;
                            } else {
                                scope.common_shipping = false;
                                scope.common_billing = false;
                            }
                            console.log(scope.twotap_builtin_cart);
                            $http.post('/purchase', {
                                'product_urls': requestedItems,
                                'user_cart': scope.twotap_builtin_cart,
                                'common_shipping': scope.common_shipping,
                                'common_billing': scope.common_billing
                            }).then(function (response) {
                                scope.messageError = "";
                                scope.messageFinal = "";
                                scope.details = response.data;
                                if (response.data.status == "failed" || response.data.hasOwnProperty('bad_field_keys') || (!angular.isDefined(response.data.purchase_id))) {
                                    scope.messageError = response.data.description;
                                    scope.$parent.purchase_complete = "failed";
                                    scope.$parent.purchase_button = "";
                                    scope.$parent.common_popup_message = scope.messageError;
                                    scope.$parent.common_popup_header = "Error";
                                    valid = false;
                                    $('#commonPopup').modal('show');
                                    return;
                                }
                                purchase_id = response.data.purchase_id;
                                if (angular.isDefined(purchase_id)) {
                                    scope.$parent.current_purchase_id = purchase_id;
                                    scope.$parent.purchase_process(purchase_id);
                                    scope.$parent.purchase_all = scope.ck_all;
                                }
                                scope.$parent.common_popup_message = "Order placed, Order ID " + purchase_id;
                                scope.$parent.common_popup_header = "Order Notification";
                                $('#commonPopup').modal('show');
                                scope.$parent.purchase_complete = "still_processing";
                                scope.messageFinal = response.data.description;
                                valid = true;
                                $location.path('/order_placed');
                                $route.reload();
                            }, function (response) {
                                console.log(response.data);
                                scope.messageError = response.data;
                                scope.$parent.purchase_button = "";
                                scope.$parent.common_popup_message = scope.messageError;
                                scope.$parent.common_popup_header = "Order Place Error Notification";
                                $('#commonPopup').modal('show');
                                valid = false;
                            });
                        } else {
                            scope.messageError = resp.data.description;
                            scope.$parent.purchase_button = "";
                            scope.messageFinal = "";
                            valid = false; // means wrong address format
                            scope.$parent.common_popup_message = scope.messageError;
                            scope.$parent.common_popup_header = "Address Validation Error";
                        }
                        validPurchaseClick = false;
                    }, function (resp) {
                        scope.messageError = resp.data.description;
                        scope.$parent.purchase_button = "";
                        scope.messageFinal = "";
                        scope.$parent.common_popup_message = scope.messageError;
                        scope.$parent.common_popup_header = "Order Place Error Notification";
                        $('#commonPopup').modal('show');
                        validPurchaseClick = false;
                        valid = false; // means wrong address format
                    });
                } else if (scope.purchase_button != "disabled") { // thats mean it is not valid reqeust
                    scope.messageError = scope.messageError + "\n please change address or remove the store items for successful purchase ";
                    scope.$parent.purchase_button = "";
                    scope.$parent.purchase_complete = "failed";
                    scope.$parent.common_popup_message = scope.messageError;
                    scope.$parent.common_popup_header = "Order Place Validation Error Notification";
                    $('#commonPopup').modal('show');
                    validPurchaseClick = false;
                } else if (valid) { // that mean valid address 
                    scope.messageError = "\n please wait for last purchase to complete ";
                    scope.$parent.common_popup_message = scope.messageError;
                    scope.$parent.common_popup_header = "Last Purchase completion waiting";
                    $('#commonPopup').modal('show');
                } else { // both way problem
                    scope.messageError = scope.messageError + "\n please change address or remove the store items for successful purchase\n last purchase on process ";
                    scope.$parent.common_popup_message = scope.messageError;
                    scope.$parent.common_popup_header = "Order Place Error Notification";
                    $('#commonPopup').modal('show');
                }
            }; // purchase end
            scope.twotapPurchaseConfirm = function () {
                scope.messageError = "";
                scope.asyncIsUserLoggedIn(function (isLoggedIn) {
                    if (!isLoggedIn) {
                        scope.messageError = "Logged in to purchase ";
                        scope.$parent.after_login_location = '/shoppingbag';
                        sShoppable.ssLogIn();
                    } else if (scope.failed_item_num > 0) {
                        scope.$parent.common_popup_message = "  You have failed item inside cart ";
                        scope.$parent.common_popup_header = "\n Remove failed item";
                        $('#commonPopup').modal('show');
                        return;
                    } else if (!scope.checkoutpossible || scope.invalid_coupons > 0) {
                        scope.$parent.common_popup_message = "  You have Invalid coupons ";
                        scope.$parent.common_popup_header = "\n Remove invalid coupons";
                        $('#commonPopup').modal('show');
                        return;
                    } else if (scope.purchase_complete == "still_processing") { // incase already a purchase on process
                        scope.$parent.common_popup_message = scope.messageError + "  Already one purchase ongoing. Current Purchase Id " + purchase_id;
                        scope.$parent.common_popup_header = "\n Wait For last purchase Finish Or refresh to try again";
                        $('#commonPopup').modal('show');
                        return; // internal one purchase going on
                    }
                });
                scope.card_validation = true;
                var scoun;
                var scounlist;
                var bcoun;
                var bcounlist;
                if (scope.num_stores > 1) {
                    angular.forEach(scope.twotap_builtin_cart.sites, function (cvalue, ckey) {
                        if (cvalue.card_valid == 1) console.log(cvalue.card_valid);
                        else {
                            scope.messageError = "Card Validation Error \n";
                        }
                        // console.log(cvalue.shipping_countries_support);
                        //console.log(cvalue.shipping.country);
                        scoun = cvalue.shipping.country;
                        scounlist = cvalue.shipping_countries_support;
                        if (scounlist.indexOf(scoun) > -1) {
                            console.log("shipping address supported")
                        } else {
                            scope.messageError = scope.messageError + " Your shipping country " + cvalue.shipping.country + " not supported by store " + cvalue.info.name + "\n";
                        }
                        if (cvalue.billing_countries_support.indexOf(cvalue.billing.country) > -1) {
                            console.log("Billing Country supported")
                        } else {
                            scope.messageError = scope.messageError + " Your Billing country " + cvalue.billing.country + " not supported by store " + cvalue.info.name + "\n";
                        }
                    })
                } else {
                    if (scope.twotap_builtin_cart.card_valid == 1) console.log(scope.twotap_builtin_cart.card_valid);
                    else {
                        scope.messageError = "Card Validation Error \n";
                    }
                    angular.forEach(scope.twotap_builtin_cart.sites, function (cvalue, ckey) {
                        scoun = scope.twotap_builtin_cart.shipping.country;
                        scounlist = cvalue.shipping_countries_support;
                        if (scounlist.indexOf(scoun) > -1) {
                            console.log("shipping address supported")
                        } else {
                            scope.messageError = scope.messageError + " Your shipping country " + cvalue.shipping.country + " not supported by store " + cvalue.info.name + "\n";
                        }
                        if (cvalue.billing_countries_support.indexOf(scope.twotap_builtin_cart.billing.country) > -1) {
                            console.log("Billing Country supported")
                        } else {
                            scope.messageError = scope.messageError + " Your Billing country " + cvalue.billing.country + " not supported by store " + cvalue.info.name + "\n";
                        }
                    })
                }
                if (scope.messageError == "") {
                    console.log("Proceed Please");
                    scope.twotapPurchase(); // purchase call
                } else {
                    scope.$parent.common_popup_message = scope.messageError;
                    scope.$parent.common_popup_header = "Validation Error ";
                    $('#commonPopup').modal('show');
                }
            };
            scope.saveUserProduct = function (productId, catalogId, retailer) {
                var s_product = {
                    'productId': productId,
                    'catalogId': catalogId,
                    'retailer': retailer
                };
                $http.post('/update_user_products', s_product).success(function (data) {
                    scope.$parent.user_saved_item_id = data; // redefine saved item ids
                    scope.$parent.saved_item_number = Object.keys(data).length; // redefine saved item ids
                    if (scope.$parent.saved_item_number > 0) {
                        var multiID = {
                            'mid': scope.$parent.user_saved_item_id
                        };
                        $http.post('/productUserMultiID', multiID).success(function (data) {
                            scope.$parent.user_saved_item = data;
                        }).error(function (err) {
                            window.alert("Error: " + err);
                        });
                    }
                    scope.$parent.deleteFromCart(productId);
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
                    scope.$parent.user_saved_item_id = data; // redefine saved item ids
                    scope.$parent.saved_item_number = Object.keys(data).length; // redefine saved item ids
                    scope.$parent.deleteFromCartCatalog(catalogId);
                    console.log(scope.user_saved_item_id);
                    if (scope.saved_item_number > 0) {
                        var multiID = {
                            'mid': scope.user_saved_item_id
                        };
                        $http.post('/productUserMulticatalogID', multiID).success(function (data) {
                            scope.$parent.user_saved_item = data;
                        }).error(function (err) {
                            console.log("Error: " + err);
                        });
                    }
                }).error(function (err) {
                    console.log("multi catalogue id Error: " + err);
                });
            };
            scope.deleteFromCartX = function (productId) {
                scope.$parent.deleteFromCart(productId);
                scope.$parent.getCartItemsJson();
                scope.$parent.getcartDistinctRetailer();
            };
            scope.deleteFromCartCatId = function (catalogId) {
                scope.$parent.deleteFromCartCatalog(catalogId);
            };
            scope.deleteFromCart = function (promd5, catalogId) {
                scope.$parent.deleteFromCartCatalog(catalogId);
            };
            scope.reset_size_list = function (complete, col, ind) {
                // need to find the index
                var i = 0, num = -1;
                for (i = 0; i < complete.required_field_values.color.length; i++) {
                    if (complete.required_field_values.color[i].value == col) {
                        num = i;
                    }
                }
                complete.required_field_values.size = complete.required_field_values.color[num].dep.size;
                //  console.log(complete.required_field_values.size);
                //complete.image= col;
            };
            function twotapCheckoutCart_part(step) {
                var temp_changed;
                scope.itemQuantity = [];
                checkoutRequest = {};
                obj = scope.userprofile2; // my custom cart data
                url_product = "";
                counter = 0; // keeping product url
                requestedItems = [];
                scope.$parent.considered_items = [];
                //scope.$parent.num_items = 0;
                for (var t in obj) {
                    url_product = obj[t].chkout_url;
                    quantity_product = obj[t].quantity;
                    scope.itemQuantity.push({
                        'url': url_product,
                        'affiliate_link': obj[t].twoTapAffiliateLink,
                        'quantity': quantity_product
                    }); // define json object
                    scope.$parent.considered_items.push(obj[t]);
                    requestedItems.push(url_product); // make an array of product url
                    // scope.$parent.num_items = scope.num_items + quantity_product;
                    counter = counter + 1;
                }
                pro_url = {
                    product_urls: requestedItems
                };
                scope.$parent.estimated_price_totals = {};
                scope.$parent.twotap_builtin_cart = undefined;
                if (requestedItems.length > 0) {
                    console.log("I will try to finish");
                } else {
                    scope.$parent.num_items = 0;
                    scope.ss_cart_load = 0;
                    scope.$parent.num_stores = 0;
                    scope.$parent.failed_item_num = 0; // calculate number of item which failed to add
                    scope.$parent.failed_sub_total = 0; // calculate failed item  subotoal
                    scope.$parent.saving = 0;
                    scope.$parent.valid_coupons = 0;
                    scope.$parent.invalid_coupons = 0;
                    scope.valid_coupon_store = 0;
                    scope.$parent.fullTotal = undefined;
                    console.log("no way bro");
                    return;
                }
                scope.ss_cart_load = 1;
                $http.post('/twotap_cart', pro_url).then(function (response) {
                    scope.ss_cart_load = 0;
                    sites_arr = [];
                    console.log(response.data.productCartDetails);
                    scope.$parent.twotap_builtin_cart = response.data.productCartDetails;
                    scope.$parent.twotap_builtin_cart.product_urls = [];
                    if (scope.step == 2) scope.$parent.tap = 0;
                    scope.$parent.num_stores = 0;
                    for (var skey in scope.twotap_builtin_cart.sites) {
                        sites_arr.push(skey);
                        scope.$parent.shipping_chrg[skey] = {};
                        scope.$parent.num_stores = scope.$parent.num_stores + 1;
                    }
                    scope.$parent.s_array = sites_arr; //make an array of sites
                    storeProducts = [];
                    // return cart and make indexteams as null
                    ramp = [];
                    sikey = "";
                    var number_of_products = 0, store_id, quantity_store_wise = 0, distinct_site_key, clean_url = "", jjj = {};
                    var temp_aff = "";
                    // matching with saved cart
                    scope.$parent.failed_item_num = 0; // calculate number of item which failed to add
                    scope.$parent.failed_sub_total = 0; // calculate failed item  subotoal
                    scope.$parent.saving = 0;
                    var temp_price = 0;
                    var temp_price_total = 0;
                    if (sites_arr.length > 0) {
                        console.log("go on");
                    } else {
                        console.log("empty cart as site array nulll");
                        return;
                    }
                    scope.$parent.failed_sub_total = 0;
                    for (var q = 0; q < scope.userprofile2.length; q++) {
                        for (sikey in scope.twotap_builtin_cart.sites) {
                            // scope.$parent.twotap_builtin_cart.sites[sikey].coupon1="beauty15";
                            scope.$parent.twotap_builtin_cart.sites[sikey].failed_sub_total_store = 0; // calculate failed item  subtotal store wise
                            scope.$parent.twotap_builtin_cart.sites[sikey].quantity_store_wise = 0;
                            for (var md5prox in scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart) {
                                // if(scope.userprofile2[p].productMD5==md5pro)
                                if (angular.equals(angular.lowercase(scope.userprofile2[q].chkout_url), angular.lowercase(scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].original_url))) {
                                    if (angular.isDefined(scope.userprofile2[p].current_price)) {
                                        scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].price = "$" + scope.userprofile2[p].current_price;
                                    }
                                    temp_aff = scope.userprofile2[q].twoTapAffiliateLink;
                                    scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].affiliate_links = temp_aff;
                                    clean_url = scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].clean_url;
                                    //  scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].input_fields = angular.copy(scope.userprofile2[q].required_field_values);
                                    scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].rateAvg = angular.copy(scope.userprofile2[q].product[0].rateAvg);
                                    scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].shareCount = angular.copy(scope.userprofile2[q].product[0].shareCount);
                                    scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].likeCount = angular.copy(scope.userprofile2[q].product[0].likeCount);
                                    scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].reviewCount = angular.copy(scope.userprofile2[q].product[0].reviewCount);
                                    scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].ratedByUser = angular.copy(scope.userprofile2[q].product[0].ratedByUser);
                                    scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].percentOff = scope.userprofile2[q].product[0].percentOff;
                                    scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].orig_price = angular.copy(scope.userprofile2[q].price);
                                    scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].catalogId = scope.userprofile2[q].product[0].catalogId;
                                    scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].quantity = angular.copy(scope.userprofile2[q].quantity);
                                    scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].lnk = scope.userprofile2[q].url; // link within website
                                    scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].required_field_values = angular.copy(scope.userprofile2[q].required_field_values);
                                    scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].category = scope.userprofile2[q].product[0].category;
                                    //scope.$parent.num_items =scope.num_items+scope.userprofile2[p].quantity;
                                    scope.$parent.twotap_builtin_cart.sites[sikey].shop = scope.userprofile2[q].product[0].merchant;
                                    scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].brand = scope.userprofile2[q].product[0].brand;
                                    // scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.size=scope.userprofile2[p].size;
                                    // scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color=scope.userprofile2[p].color;
                                    // scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.option=scope.userprofile2[p].option;
                                    // scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].cartId = scope.userprofile2[q].cartId;
                                    scope.$parent.twotap_builtin_cart.sites[sikey].quantity_store_wise = scope.twotap_builtin_cart.sites[sikey].quantity_store_wise + scope.userprofile2[q].quantity;
                                    for (var rq in scope.userprofile2[q].required_field_values) {
                                        if (rq == 'color' || rq == 'size' || rq == 'quantity') {
                                            console.log("do not do anything");
                                        } else {
                                            scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox][rq] = angular.copy(scope.userprofile2[q].required_field_values[rq]);
                                        }
                                    }
                                    if (angular.isDefined(scope.userprofile2[q].required_field_values.size)) {
                                        scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].size = scope.userprofile2[q].required_field_values.size;
                                    }
                                    if (scope.userprofile2[q].required_field_values.hasOwnProperty('color')) {
                                        scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].color = scope.userprofile2[q].required_field_values.color;
                                        // scope.reset_size_list(scope.twotap_builtin_cart,scope.userprofile2[p].required_field_values.color,-2);
                                        var t = 0;
                                        var num = -1;
                                        for (t = 0; t < scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].required_field_values.color.length; t++) {
                                            if (scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].required_field_values.color[t].value == scope.userprofile2[q].required_field_values.color) {
                                                scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].required_field_values.size = scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].required_field_values.color[t].dep.size;
                                                scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].size = scope.userprofile2[q].required_field_values.size;
                                                break;
                                            }
                                        }
                                    }
                                    //scope.twotap_builtin_cart.affiliate_links[sikey] = scope.userprofile2[p].twoTapAffiliateLink;
                                    temp_aff = scope.userprofile2[q].twoTapAffiliateLink;
                                    scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].affiliate_links = temp_aff;
                                    clean_url = scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].clean_url;
                                    if (scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].image == "") {
                                        if (scope.userprofile2[q].product[0].image_url != "") scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].image = scope.userprofile2[q].product[0].image_url;
                                        else if (scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].alt_images.length > 0) scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].image = scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].alt_images[0];
                                    }
                                    scope.$parent.failed_item_num = scope.failed_item_num + scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].quantity; // calculate number of total failed item which failed to add
                                    if (angular.isDefined(scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].price)) {
                                        if (angular.isDefined(scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].price) && scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].price != null) {
                                            temp_price = parseFloat((scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].price.substring(1)), 10); // getting price of failed item
                                            scope.$parent.saving = scope.saving + ((scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].orig_price - parseFloat(scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].price.substring(1), 10)) * (scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].quantity));
                                        } else {
                                            temp_price = scope.userprofile2[q].current_price;
                                            scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].orig_price = angular.copy(scope.userprofile2[q].current_price);
                                        }
                                    } else {
                                        temp_price = scope.userprofile2[q].current_price;
                                        scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].orig_price = angular.copy(scope.userprofile2[q].current_price);
                                    }
                                    temp_price_total = scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5prox].quantity * temp_price;
                                    scope.$parent.twotap_builtin_cart.sites[sikey].failed_sub_total_store = scope.twotap_builtin_cart.sites[sikey].failed_sub_total_store + temp_price_total; // store wise calculate failed item price
                                    scope.$parent.failed_sub_total = scope.failed_sub_total + temp_price_total; // full subtotal of failed items 																		// calculate total
                                } // url cross check
                            }
                            for (md5pro in scope.twotap_builtin_cart.sites[sikey].add_to_cart) {
                                // if(scope.userprofile2[p].productMD5==md5pro)
                                // if(scope.userprofile2[p].chkout_url==scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].original_url)
                                // {
                                if (angular.equals(angular.lowercase(scope.userprofile2[q].chkout_url), angular.lowercase(scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].original_url))) {
                                    if (angular.isDefined(scope.userprofile2[p].current_price)) {
                                        scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].price = "$" + scope.userprofile2[p].current_price;
                                    }
                                    temp_aff = scope.userprofile2[q].twoTapAffiliateLink;
                                    scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].affiliate_links = temp_aff;
                                    clean_url = scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].clean_url;
                                    scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].input_fields = angular.copy(scope.userprofile2[q].required_field_values);
                                    scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].percentOff = scope.userprofile2[q].product[0].percentOff;
                                    scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].orig_price = angular.copy(scope.userprofile2[q].product[0].price);
                                    scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].category = scope.userprofile2[q].product[0].category;
                                    scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].catalogId = scope.userprofile2[q].product[0].catalogId;
                                    scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].rateAvg = angular.copy(scope.userprofile2[q].product[0].rateAvg);
                                    scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].shareCount = angular.copy(scope.userprofile2[q].product[0].shareCount);
                                    scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].likeCount = angular.copy(scope.userprofile2[q].product[0].likeCount);
                                    scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].reviewCount = angular.copy(scope.userprofile2[q].product[0].reviewCount);
                                    scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].ratedByUser = angular.copy(scope.userprofile2[q].product[0].ratedByUser);
                                    for (var rq in scope.userprofile2[q].required_field_values) {
                                        if (rq == 'color' || rq == 'size' || rq == 'quantity') {
                                            console.log("do not do anything");
                                        } else {
                                            scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro][rq] = angular.copy(scope.userprofile2[q].required_field_values[rq]);
                                        }
                                    }
                                    scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.quantity = angular.copy(scope.userprofile2[q].quantity);
                                    scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].quantity = angular.copy(scope.userprofile2[q].quantity);
                                    scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].lnk = scope.userprofile2[q].url; // link within website
                                    scope.$parent.twotap_builtin_cart.sites[sikey].shop = scope.userprofile2[q].product[0].merchant;
                                    scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].brand = scope.userprofile2[q].product[0].brand;
                                    if (scope.userprofile2[q].required_field_values.hasOwnProperty('size')) {
                                        scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].size = scope.userprofile2[q].required_field_values.size;
                                    }
                                }
                                if (scope.userprofile2[q].required_field_values.hasOwnProperty('color')) {
                                    scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].color = scope.userprofile2[q].required_field_values.color;
                                    // scope.reset_size_list(scope.twotap_builtin_cart,scope.userprofile2[q].required_field_values.color,-2);
                                    var i = 0;
                                    var num = -1;
                                    if (scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.hasOwnProperty('color')) {
                                        for (i = 0; i < scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color.length; i++) {
                                            if (scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[i].value == scope.userprofile2[q].required_field_values.color) {
                                                /*  if (angular.isDefined(scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[i].price)) {
                                                    scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].price = scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[i].price;
                                                } */
                                                if (scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[i].hasOwnProperty('dep')) {
                                                    if (scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[i].dep.hasOwnProperty('size')) {
                                                        scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.size = scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[i].dep.size;
                                                        scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].size = scope.userprofile2[q].required_field_values.size;
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                    } //
                                }
                                //scope.twotap_builtin_cart.affiliate_links[sikey] = scope.userprofile2[q].twoTapAffiliateLink;
                                if (scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].image == "") {
                                    if (scope.userprofile2[q].product[0].image_url != "") scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].image = scope.userprofile2[q].product[0].image_url;
                                    else if (scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].alt_images.length > 0) scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].image = scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].alt_images[0];
                                }
                                scope.$parent.saving = scope.saving + ((scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].orig_price - parseFloat(scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].price.substring(1), 10)) * (scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].quantity));
                            }
                            scope.$parent.twotap_builtin_cart.sites[sikey].quantity_store_wise = scope.twotap_builtin_cart.sites[sikey].quantity_store_wise + scope.userprofile2[q].quantity;
                            scope.$parent.shipping_countries_support = angular.copy(scope.twotap_builtin_cart.sites[sikey].shipping_countries_support);
                            scope.$parent.billing_countries_support = angular.copy(scope.twotap_builtin_cart.sites[sikey].billing_countries_support);
                            scope.$parent.twotap_builtin_cart.sites[sikey].shipping = angular.copy(scope.shipping_address);
                            scope.$parent.twotap_builtin_cart.sites[sikey].billing = angular.copy(scope.billing_address);
                            scope.$parent.twotap_builtin_cart.sites[sikey].card = angular.copy(scope.card_details);
                        }
                    }
                    scope.$parent.twotap_builtin_cart.shipping = angular.copy(scope.shipping_address);
                    scope.$parent.twotap_builtin_cart.billing = angular.copy(scope.billing_address);
                    scope.$parent.twotap_builtin_cart.card = angular.copy(scope.card_details);
                    //if(response.data.availability)
                    //{
                    scope.$parent.count_items(scope.twotap_builtin_cart, -1, scope.considered_items);
                    scope.estimatefunction (scope.twotap_builtin_cart, -1, scope.considered_items, 'cart'); // -1 means all cart
                    scope.$parent.shoppingbag_cart_changed = false; //
                    $cookies.put('shoppingbag_cart_changed', false);
                    $cookies.put('shoppingbag_cart_id', response.data.cart_id);
                    scope.$parent.mcart = false;
                    //}
                    if (scope.step == 2) {
                        if (scope.failed_item_num > 0) {
                            scope.$parent.common_popup_message = "Please Remove unavailable items before proceed";
                            scope.$parent.common_popup_header = "Unavailable Items ";
                            $('#commonPopup').modal('show');
                        }
                    }
                    //////////////////////VVIMP///////////////////////////////////////////////
                }, function (response) {
                    scope.$parent.num_stores = 0;
                    scope.$parent.num_items = 0;
                    scope.$parent.estimated_price_totals = {
                        "final_price": "$0.0",
                        "subtotal": "$0.0"
                    };
                    //  scope.$parent.estimated_move_price_totals = {"final_price": "$0.0", "subtotal": "$0.0"};
                    scope.$parent.valid_coupons = 0;
                    scope.$parent.invalid_coupons = 0;
                    scope.valid_coupon_store = 0;
                    scope.$parent.twotap_builtin_cart = undefined;
                    scope.ss_cart_load = 0;
                    scope.$parent.mcart = false;
                });
            }
            scope.twotapCheckoutCart = function (step) {
                scope.$parent.allitemdefined = true;
                scope.asyncIsUserLoggedIn(function (isLoggedIn) {
                    if (!isLoggedIn) {
                        scope.ss_cart_load = 0;
                        scope.$parent.common_popup_message = "Login to proceed";
                        scope.$parent.common_popup_header = "Login required ";
                        $('#commonPopup').modal('show');
                        return;
                    }
                    twotapCheckoutCart_part(step);
                });
            };
            // purchase attempt
            ////////////////////////////////// MERCHANT WISE CHECKPOUT
            scope.twotapCheckoutMerchantWise = function (merchant) {
                scope.itemQuantity = [];
                checkoutRequest = {};
                obj = scope.userprofile2; // my custom cart data
                scope.$parent.considered_items = [];
                counter = 0; // keeping product url
                // using following loop we generate json object for the product
                quantity_product = 0;
                requestedItems = [];
                url_product = "";
                var r_ind;
                scope.$parent.cur_merchant = merchant;
                for (var t in obj) {
                    if (obj[t].retailer == merchant) {
                        url_product = obj[t].chkout_url;
                        requestedItems.push(url_product); // make an array of product url
                        scope.$parent.considered_items.push(obj[t]);
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
                    if (!isLoggedIn) {
                        $("#login-popup").modal("show");
                        scope.ss_cart_load = 0;
                    } else {
                        if (requestedItems.length == 0) {
                            scope.$parent.num_stores = 0;
                            scope.$parent.num_items = 0;
                            scope.$parent.estimated_price_totals = {
                                "final_price": "$0.0",
                                "subtotal": "$0.0"
                            };
                            // scope.$parent.estimated_move_price_totals = {"final_price": "$0.0", "subtotal": "$0.0"};
                            scope.$parent.valid_coupons = 0;
                            scope.$parent.invalid_coupons = 0;
                            scope.valid_coupon_store = 0;
                            scope.$parent.twotap_builtin_cart = undefined;
                            scope.$parent.saving = 0;
                            scope.ss_cart_load = 0;
                            scope.$parent.failed_item_num = 0; // calculate number of item which failed to add
                            scope.$parent.failed_sub_total = 0; // calculate failed item  subotoal
                            scope.$parent.fullTotal = undefined;
                            return;
                        }
                        scope.$parent.num_stores = 1; // when checking out single
                        pro_url = {
                            product_urls: requestedItems
                        };
                        scope.$parent.twotap_builtin_cart = undefined;
                        scope.$parent.saving = 0;
                        scope.$parent.estimated_price_totals = {};
                        scope.$parent.failed_sub_total = 0;
                        scope.$parent.twotap_builtin_cart = undefined;
                        scope.ss_cart_load = 1;
                        $http.post('/twotap_cart', pro_url).then(function (response) {
                            scope.ss_cart_load = 0;
                            scope.$parent.tap = 0; // why tap = 0 mean ready to check out page 
                            scope.$parent.twotap_builtin_cart = response.data.productCartDetails;
                            // scope.twotap_builtin_cart.product_urls =[];
                            scope.$parent.num_items = 0;
                            scope.$parent.failed_item_num = 0; // calculate number of item which failed to add
                            scope.$parent.failed_sub_total = 0; // calculate failed item  subotoal
                            sites_arr = [];
                            sk = "";
                            //scope.s_array =sites_arr;  //make an array of sites
                            storeProducts = [];
                            ramp = [];
                            sikey = "";
                            for (var skeyT in scope.twotap_builtin_cart.sites) {
                                sikey = skeyT;
                                scope.$parent.shipping_chrg[sikey] = {};
                            }
                            md5pro = "";
                            var i;
                            var num;
                            var temp_price = 0;
                            var temp_price_total = 0;
                            scope.$parent.twotap_builtin_cart.sites[sikey].quantity_store_wise = 0;
                            for (var p = 0; p < scope.userprofile2.length; p++) {
                                scope.$parent.twotap_builtin_cart.sites[sikey].failed_sub_total_store = 0; // calculate failed item  subtotal store wise
                                for (var md5proSx in scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart) {
                                    // if(scope.userprofile2[p].productMD5==md5pro)
                                    if (scope.userprofile2[p].chkout_url == scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].original_url) {
                                        if (angular.isDefined(scope.userprofile2[p].current_price)) {
                                            scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].price = "$" + scope.userprofile2[p].current_price;
                                        }
                                        temp_price = 0;
                                        temp_price_total = 0;
                                        scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].required_field_values = angular.copy(scope.userprofile2[p].required_field_values);
                                        scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].percentOff = scope.userprofile2[p].product[0].percentOff;
                                        scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].orig_price = scope.userprofile2[p].product[0].price;
                                        scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].rateAvg = angular.copy(scope.userprofile2[p].product[0].rateAvg);
                                        scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].shareCount = angular.copy(scope.userprofile2[p].product[0].shareCount);
                                        scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].likeCount = angular.copy(scope.userprofile2[p].product[0].likeCount);
                                        scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].reviewCount = angular.copy(scope.userprofile2[p].product[0].reviewCount);
                                        scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].ratedByUser = angular.copy(scope.userprofile2[p].product[0].ratedByUser);
                                        for (var rq in scope.userprofile2[p].required_field_values) {
                                            if (rq == 'color' || rq == 'size' || rq == 'quantity') {
                                                console.log("do not do anything");
                                            } else {
                                                scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx][rq] = angular.copy(scope.userprofile2[p].required_field_values[rq]);
                                            }
                                        }
                                        scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].catalogId = scope.userprofile2[p].product[0].catalogId;
                                        scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].required_field_values.quantity = angular.copy(scope.userprofile2[p].quantity);
                                        scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].quantity = angular.copy(scope.userprofile2[p].quantity);
                                        scope.$parent.num_items = scope.num_items + parseInt(scope.userprofile2[p].quantity);
                                        scope.$parent.twotap_builtin_cart.sites[sikey].quantity_store_wise = scope.$parent.twotap_builtin_cart.sites[sikey].quantity_store_wise + scope.userprofile2[p].quantity;
                                        scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].lnk = scope.userprofile2[p].url; // link within website
                                        scope.$parent.twotap_builtin_cart.sites[sikey].shop = scope.userprofile2[p].product[0].merchant;
                                        scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].category = scope.userprofile2[p].product[0].category;
                                        scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].brand = scope.userprofile2[p].product[0].brand;
                                        scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].cartId = scope.userprofile2[p].cartId;
                                        if (angular.isDefined(scope.userprofile2[p].required_field_values.size)) {
                                            scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].size = scope.userprofile2[p].required_field_values.size;
                                        }
                                        if (scope.userprofile2[p].required_field_values.hasOwnProperty('color')) {
                                            scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].color = scope.userprofile2[p].required_field_values.color;
                                            var zz = 0;
                                            var num = -1;
                                            for (zz = 0; zz < scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].required_field_values.color.length; zz++) {
                                                if (scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].required_field_values.color[zz].value == scope.userprofile2[p].required_field_values.color) {
                                                    scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].required_field_values.size = scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].required_field_values.color[zz].dep.size;
                                                    break;
                                                }
                                            }
                                        }
                                        //scope.twotap_builtin_cart.affiliate_links[sikey] = scope.userprofile2[p].twoTapAffiliateLink;
                                        temp_aff = scope.userprofile2[p].twoTapAffiliateLink;
                                        scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].affiliate_links = temp_aff;
                                        clean_url = scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].clean_url;
                                        if (scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].image == "") {
                                            if (scope.userprofile2[p].product[0].image_url != "") scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].image = scope.userprofile2[p].product[0].image_url;
                                            else if (scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].alt_images.length > 0) scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].image = scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].alt_images[0];
                                        }
                                        scope.$parent.failed_item_num = scope.failed_item_num + scope.userprofile2[p].quantity; // calculate number of total failed item which failed to add
                                        if (scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].hasOwnProperty('price')) {
                                            if (scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].price != null) {
                                                temp_price = parseFloat(scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].price.substring(1), 10); // getting price of failed item
                                            } else {
                                                temp_price = scope.userprofile2[p].current_price;
                                                scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].orig_price = angular.copy(scope.userprofile2[p].current_price);
                                            }
                                        } else {
                                            temp_price = scope.userprofile2[p].current_price;
                                            scope.$parent.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].orig_price = angular.copy(scope.userprofile2[p].current_price);
                                        }
                                        temp_price_total = scope.twotap_builtin_cart.sites[sikey].failed_to_add_to_cart[md5proSx].quantity * temp_price;
                                        scope.$parent.twotap_builtin_cart.sites[sikey].failed_sub_total_store = scope.twotap_builtin_cart.sites[sikey].failed_sub_total_store + temp_price_total; // store wise calculate failed item price
                                        scope.$parent.failed_sub_total = scope.failed_sub_total + temp_price_total; // full subtotal of failed items 																		// calculate total
                                    }
                                }
                                for (md5pro in scope.twotap_builtin_cart.sites[sikey].add_to_cart) {
                                    //if(scope.userprofile2[p].productMD5==md5pro)
                                    //if(scope.userprofile2[p].chkout_url==scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].original_url)
                                    if (angular.equals(angular.lowercase(scope.userprofile2[p].chkout_url), angular.lowercase(scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].original_url))) {
                                        if (angular.isDefined(scope.userprofile2[p].current_price)) {
                                            scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].price = "$" + scope.userprofile2[p].current_price;
                                        }
                                        for (var rq in scope.userprofile2[p].required_field_values) {
                                            if (rq == 'color' || rq == 'size' || rq == 'quantity') {
                                                console.log("do not do anything");
                                            } else {
                                                scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro][rq] = angular.copy(scope.userprofile2[p].required_field_values[rq]);
                                            }
                                        }
                                        scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].input_fields = angular.copy(scope.userprofile2[p].required_field_values);
                                        scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].percentOff = scope.userprofile2[p].product[0].percentOff;
                                        //scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].orig_price=scope.userprofile2[p].product[0].price;
                                        scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].orig_price = scope.userprofile2[p].product[0].price;
                                        scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].catalogId = scope.userprofile2[p].product[0].catalogId;
                                        scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].rateAvg = angular.copy(scope.userprofile2[p].product[0].rateAvg);
                                        scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].shareCount = angular.copy(scope.userprofile2[p].product[0].shareCount);
                                        scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].likeCount = angular.copy(scope.userprofile2[p].product[0].likeCount);
                                        scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].reviewCount = angular.copy(scope.userprofile2[p].product[0].reviewCount);
                                        scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].ratedByUser = angular.copy(scope.userprofile2[p].product[0].ratedByUser);
                                        scope.$parent.twotap_builtin_cart.sites[sikey].shop = scope.userprofile2[p].product[0].merchant;
                                        scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].brand = scope.userprofile2[p].product[0].brand;
                                        scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].category = scope.userprofile2[p].product[0].category;
                                        scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].lnk = scope.userprofile2[p].url;
                                        scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.quantity = angular.copy(scope.userprofile2[p].quantity);
                                        // scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].cartId = scope.userprofile2[p].cartId;
                                        scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].quantity = angular.copy(scope.userprofile2[p].quantity);
                                        scope.$parent.num_items = scope.num_items + parseInt(scope.userprofile2[p].quantity);
                                        scope.$parent.twotap_builtin_cart.sites[sikey].quantity_store_wise = scope.$parent.twotap_builtin_cart.sites[sikey].quantity_store_wise + scope.userprofile2[p].quantity;
                                        // scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.size=scope.userprofile2[p].size;
                                        // scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color=scope.userprofile2[p].color;
                                        // scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.option=scope.userprofile2[p].option;
                                        if (angular.isDefined(scope.userprofile2[p].required_field_values.size)) scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].size = angular.copy(scope.userprofile2[p].required_field_values.size);
                                        if (scope.userprofile2[p].required_field_values.hasOwnProperty('color')) {
                                            scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].color = scope.userprofile2[p].required_field_values.color;
                                            var i = 0;
                                            var num = -1;
                                            if (scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.hasOwnProperty('color')) {
                                                for (var zy = 0; zy < scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color.length; zy++) {
                                                    if (scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[i].value == scope.userprofile2[p].required_field_values.color) {
                                                        if (scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[i].hasOwnProperty('dep')) {
                                                            if (scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[i].dep.hasOwnProperty('size')) {
                                                                scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.size = scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[zy].dep.size;
                                                                scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].size = scope.userprofile2[p].required_field_values.size;
                                                                break;
                                                            } // if end 
                                                        } // if end 
                                                    } // if end 
                                                } // for end 
                                            } // color end 
                                        } // if color end 
                                        scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].affiliate_links = scope.userprofile2[p].twoTapAffiliateLink;
                                        if (scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].image == "") {
                                            if (scope.userprofile2[p].product[0].image_url != "") scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].image = scope.userprofile2[p].product[0].image_url;
                                            else if (scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].alt_images.length > 0) scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].image = scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].alt_images[0];
                                        }
                                        scope.$parent.saving = scope.saving + ((scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].orig_price - parseFloat(scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].price.substring(1), 10)) * (scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].quantity));
                                    }
                                }
                            } // for end outer
                            scope.$parent.shipping_countries_support = angular.copy(scope.twotap_builtin_cart.sites[sikey].shipping_countries_support);
                            scope.$parent.billing_countries_support = angular.copy(scope.twotap_builtin_cart.sites[sikey].billing_countries_support);
                            scope.$parent.twotap_builtin_cart.sites[sikey].shipping = angular.copy(scope.shipping_address);
                            scope.$parent.twotap_builtin_cart.sites[sikey].billing = angular.copy(scope.billing_address);
                            scope.$parent.twotap_builtin_cart.sites[sikey].card = angular.copy(scope.card_details);
                            scope.$parent.twotap_builtin_cart.shipping = angular.copy(scope.shipping_address);
                            scope.$parent.twotap_builtin_cart.billing = angular.copy(scope.billing_address);
                            scope.$parent.twotap_builtin_cart.card = angular.copy(scope.card_details);
                            // if(response.data.availability)
                            // {
                            scope.estimatefunction (scope.twotap_builtin_cart, 1, scope.considered_items, 'cart'); // single store single index
                            // }
                            scope.$parent.mcart = false;
                        }, function (response) {
                            scope.$parent.num_stores = 0;
                            scope.$parent.num_items = 0;
                            scope.$parent.estimated_price_totals = {
                                "final_price": "$0.0",
                                "subtotal": "$0.0"
                            };
                            //  scope.$parent.estimated_move_price_totals = {"final_price": "$0.0", "subtotal": "$0.0"};
                            scope.$parent.valid_coupons = 0;
                            scope.$parent.invalid_coupons = 0;
                            scope.valid_coupon_store = 0;
                            scope.$parent.twotap_builtin_cart = undefined;
                            scope.ss_cart_load = 0;
                            scope.$parent.mcart = false;
                            console.log("cart merchantwise  error");
                        })
                    }
                });
            };
            /////////////////// WISH LIST ADD //////////////////////////
            function twotapwishOut_part(step) {
                scope.$parent.num_stores_wish = scope.total_cart_distinct_store_wish;
                var temp_changed = scope.wishbag_cart_changed;
                scope.itemQuantity_wish = [];
                checkoutRequest = {};
                obj2 = scope.saveprofile2; // my custom cart data
                url_product = "";
                counter = 0; // keeping product url
                requestedItems_wish = [];
                scope.$parent.considered_items_wish = [];
                for (var t in obj2) {
                    url_product = obj2[t].chkout_url;
                    quantity_product = obj2[t].quantity;
                    scope.itemQuantity_wish.push({
                        'url': url_product,
                        'affiliate_link': obj2[t].twoTapAffiliateLink,
                        'quantity': quantity_product
                    }); // define json object
                    scope.$parent.considered_items_wish.push(obj2[t]);
                    requestedItems_wish.push(url_product); // make an array of product url
                    counter = counter + 1;
                }
                if (requestedItems_wish.length == 0) {
                    console.log("no item inside wishlist");
                    scope.$parent.num_items_wish = 0;
                    scope.$parent.num_stores_wish = 0;
                    scope.$parent.estimated_price_totals_wish = {
                        "final_price": "$0.0",
                        "subtotal": "$0.0"
                    };
                    //  scope.$parent.estimated_move_price_totals = {"final_price": "$0.0", "subtotal": "$0.0"};
                    scope.$parent.twotap_wishlist_cart = undefined;
                    scope.ss_wish_load = 0;
                    return;
                }
                pro_url_wish = {
                    product_urls: requestedItems_wish
                };
                scope.$parent.twotap_wishlist_cart = undefined;
                scope.$parent.failed_wish_sub_total = 0;
                scope.$parent.estimated_price_totals_wish = {};
                scope.ss_wish_load = 1;
                $http.post('/twotap_cart', pro_url_wish).then(function (response) {
                    scope.ss_wish_load = 0;
                    scope.$parent.twotap_wishlist_cart = response.data.productCartDetails;
                    scope.$parent.twotap_wishlist_cart.product_urls = [];
                    sites_arr = [];
                    for (skey in scope.twotap_wishlist_cart.sites) {
                        sites_arr.push(skey);
                    }
                    scope.$parent.s_array_wish = sites_arr; //make an array of sites
                    scope.$parent.num_stores_wish = scope.s_array_wish.length;
                    storeProducts = [];
                    // return cart and make indexteams as null
                    ramp = [];
                    sikey = "";
                    md5pro = "";
                    var number_of_products = 0, store_id, quantity_store_wise = 0, distinct_site_key,clean_url = "", jjj = {}, saveCount = 0; 
                    var temp_aff = "";
                    scope.$parent.num_items_wish = 0;
                    var md5prof = "";
                    scope.$parent.failed_wish_item_num = 0; // calculate number of item which failed to add
                    scope.$parent.failed_wish_sub_total = 0; // calculate failed item subotoal
                    for (var p = 0; p < scope.saveprofile2.length; p++) {
                        for (var n = 0; n < scope.s_array_wish.length; n++) {
                            sikey = scope.s_array_wish[n]; // target one site
                            number_of_products = 0;
                            // consider 1 site 
                            var num_required;
                            for (md5prof in scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart) {
                                //		if(scope.saveprofile2[p].chkout_url==scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5pro].original_url)
                                if (angular.equals(angular.lowercase(scope.saveprofile2[p].chkout_url), angular.lowercase(scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].original_url))) {
                                    var temp_pricew = 0, temp_price_totalw = 0, num_required = 0;
                                    for (var rq in scope.saveprofile2[p].required_field_values) {
                                        if (rq == 'color' || rq == 'size' || rq == 'quantity') {
                                            console.log("do not do anything");
                                        } else {
                                            scope.$parent.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof][rq] = angular.copy(scope.saveprofile2[p].required_field_values[rq]);
                                        }
                                    }
                                    scope.$parent.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].movetobagPossible = 0;
                                    scope.$parent.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].required_field_values = angular.copy(scope.saveprofile2[p].required_field_values);
                                    scope.$parent.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].input_fields = scope.saveprofile2[p].required_field_values;
                                    scope.$parent.twotap_wishlist_cart.sites[sikey].shop = scope.saveprofile2[p].product[0].merchant;
                                    scope.$parent.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].percentOff = scope.saveprofile2[p].product[0].percentOff;
                                    scope.$parent.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].orig_price = angular.copy(scope.saveprofile2[p].product[0].price);
                                    scope.$parent.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].category = scope.saveprofile2[p].product[0].category;
                                    scope.$parent.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].rateAvg = angular.copy(scope.saveprofile2[p].product[0].rateAvg);
                                    scope.$parent.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].shareCount = angular.copy(scope.saveprofile2[p].product[0].shareCount);
                                    scope.$parent.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].likeCount = angular.copy(scope.saveprofile2[p].product[0].likeCount);
                                    scope.$parent.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].reviewCount = angular.copy(scope.saveprofile2[p].product[0].reviewCount);
                                    scope.$parent.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].ratedByUser = angular.copy(scope.saveprofile2[p].product[0].ratedByUser);
                                    scope.$parent.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].lnk = scope.saveprofile2[p].url;
                                    scope.$parent.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].catalogId = scope.saveprofile2[p].product[0].catalogId;
                                    //scope.$parent.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].cartId = scope.saveprofile2[p].cartId;
                                    scope.$parent.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].required_field_values = angular.copy(scope.saveprofile2[p].required_field_values);
                                    scope.$parent.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].quantity = angular.copy(scope.saveprofile2[p].quantity);
                                    scope.$parent.num_items_wish = scope.num_items_wish + parseInt(scope.saveprofile2[p].quantity);
                                    scope.$parent.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].shop = scope.saveprofile2[p].product[0].merchant;
                                    scope.$parent.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].brand = scope.saveprofile2[p].product[0].brand;
                                    if (angular.isDefined(scope.saveprofile2[p].required_field_values.size)) {
                                        scope.$parent.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].size = angular.copy(scope.saveprofile2[p].required_field_values.size);
                                    }
                                    if (scope.saveprofile2[p].required_field_values.hasOwnProperty('color')) {
                                        scope.$parent.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].color = angular.copy(scope.saveprofile2[p].required_field_values.color);
                                        // scope.reset_size_list(scope.twotap_builtin_cart,scope.userprofile2[p].required_field_values.color,-2);
                                        var i = 0, num = -1;
                                        for (zw = 0; zw < scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].required_field_values.color.length; zw++) {
                                            if (scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].required_field_values.color[zw].value == scope.saveprofile2[p].required_field_values.color) {
                                                scope.$parent.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].required_field_values.size = scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].required_field_values.color[zw].dep.size;
                                                break;
                                            }
                                        }
                                    }
                                    temp_aff = scope.saveprofile2[p].twoTapAffiliateLink;
                                    clean_url = scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].clean_url;
                                    if (scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].image == "") {
                                        if (scope.saveprofile2[p].product[0].image_url != "") scope.$parent.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].image = scope.saveprofile2[p].product[0].image_url;
                                        else if (scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].alt_images.length > 0) scope.$parent.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].image = scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].alt_images[0];
                                    }
                                    scope.$parent.failed_wish_item_num = scope.failed_wish_item_num + scope.saveprofile2[p].quantity;
                                    if (angular.isDefined(scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof])) {
                                        if (scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].hasOwnProperty('price')) {
                                            if (scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].price != null) temp_pricew = parseFloat(scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].price.substring(1), 10); // getting price of failed item
                                            else {
                                                temp_pricew = scope.saveprofile2[p].current_price;
                                                scope.$parent.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].price = angular.copy("$" + scope.saveprofile2[p].current_price);
                                                scope.$parent.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].orig_price = angular.copy(scope.saveprofile2[p].product[0].current_price);
                                            }
                                        } else {
                                            temp_pricew = scope.saveprofile2[p].current_price;
                                            scope.$parent.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].price = angular.copy("$" + scope.saveprofile2[p].current_price);
                                            scope.$parent.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].orig_price = angular.copy(scope.saveprofile2[p].product[0].current_price);
                                        }
                                        temp_price_totalw = scope.twotap_wishlist_cart.sites[sikey].failed_to_add_to_cart[md5prof].quantity * temp_pricew;
                                    }
                                    scope.$parent.failed_wish_sub_total = scope.failed_wish_sub_total + temp_price_totalw; // full subtotal of failed items 																		// calculate total
                                }
                            }
                            for (md5pro in scope.twotap_wishlist_cart.sites[sikey].add_to_cart) {
                                if (angular.equals(angular.lowercase(scope.saveprofile2[p].chkout_url), angular.lowercase(scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].original_url))) {
                                    scope.$parent.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].input_fields = angular.copy(scope.saveprofile2[p].required_field_values);
                                    scope.$parent.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].movetobagPossible = 0;
                                    num_required = 0;
                                    num_required = scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].required_field_names.length;
                                    if (num_required > Object.keys(scope.saveprofile2[p].required_field_values).length) {
                                        scope.$parent.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].movetobagPossible = 0;
                                    } else {
                                        scope.$parent.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].movetobagPossible = 1;
                                    }
                                    for (var rq in scope.saveprofile2[p].required_field_values) {
                                        if (rq == 'color' || rq == 'size' || rq == 'quantity') {
                                            console.log("do not do anything");
                                        } else {
                                            scope.$parent.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro][rq] = angular.copy(scope.saveprofile2[p].required_field_values[rq]);
                                        }
                                    }
                                    scope.$parent.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].percentOff = scope.saveprofile2[p].product[0].percentOff;
                                    scope.$parent.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].orig_price = angular.copy(scope.saveprofile2[p].product[0].price);
                                    scope.$parent.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].lnk = scope.saveprofile2[p].url;
                                    scope.$parent.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].catalogId = scope.saveprofile2[p].product[0].catalogId;
                                    scope.$parent.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].rateAvg = angular.copy(scope.saveprofile2[p].product[0].rateAvg);
                                    scope.$parent.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].shareCount = angular.copy(scope.saveprofile2[p].product[0].shareCount);
                                    scope.$parent.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].likeCount = angular.copy(scope.saveprofile2[p].product[0].likeCount);
                                    scope.$parent.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].reviewCount = angular.copy(scope.saveprofile2[p].product[0].reviewCount);
                                    scope.$parent.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].ratedByUser = angular.copy(scope.saveprofile2[p].product[0].ratedByUser);
                                    scope.$parent.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].category = scope.saveprofile2[p].product[0].category;
                                    scope.$parent.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].required_field_values.quantity = angular.copy(scope.saveprofile2[p].quantity);
                                    scope.$parent.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].quantity = angular.copy(scope.saveprofile2[p].quantity);
                                    scope.$parent.num_items_wish = scope.num_items_wish + parseInt(scope.saveprofile2[p].quantity);
                                    scope.$parent.twotap_wishlist_cart.sites[sikey].shop = scope.saveprofile2[p].product[0].merchant;
                                    scope.$parent.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].brand = scope.saveprofile2[p].product[0].brand;
                                    if (angular.isDefined(scope.saveprofile2[p].required_field_values.size)) {
                                        scope.$parent.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].size = angular.copy(scope.saveprofile2[p].required_field_values.size);
                                    }
                                    if (scope.saveprofile2[p].required_field_values.hasOwnProperty('color')) {
                                        scope.$parent.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].color = angular.copy(scope.saveprofile2[p].required_field_values.color);
                                        var i = 0, num = -1;
                                        if (scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].required_field_values.hasOwnProperty('color')) {
                                            for (var zt = 0; zt < scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color.length; zt++) {
                                                if (scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[zt].value == scope.saveprofile2[p].required_field_values.color) {
                                                    if (scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[zt].hasOwnProperty('dep')) {
                                                        if (scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[zt].dep.hasOwnProperty('size')) {
                                                            scope.$parent.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].required_field_values.size = scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[zt].dep.size;
                                                            scope.$parent.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].size = scope.saveprofile2[p].required_field_values.size;
                                                            break;
                                                        }
                                                    }
                                                }
                                            } //
                                        }
                                    } //
                                    temp_aff = scope.saveprofile2[p].twoTapAffiliateLink;
                                    scope.$parent.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].affiliate_links = temp_aff;
                                    clean_url = scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].clean_url;
                                    if (scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].image == "") {
                                        if (scope.saveprofile2[p].product[0].image_url != "") scope.$parent.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].image = scope.saveprofile2[p].product[0].image_url;
                                        else if (scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].alt_images.length > 0) scope.$parent.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].image = scope.twotap_wishlist_cart.sites[sikey].add_to_cart[md5pro].alt_images[0];
                                    }
                                }
                            } // for loop end 
                        } // save profile loop
                    }
                    scope.$parent.twotap_wishlist_cart.shipping = angular.copy(scope.shipping_address);
                    scope.$parent.twotap_wishlist_cart.billing = angular.copy(scope.billing_address);
                    scope.$parent.twotap_wishlist_cart.card = angular.copy(scope.card_details);
                    scope.estimatefunction (scope.twotap_wishlist_cart, -9, scope.considered_items_wish, 'wish');
                }, function (response) {
                    scope.ss_wish_load = 0;
                });
            }
            scope.twotapwishOut = function (step) {
                scope.asyncIsUserLoggedIn(function (isLoggedIn) {
                    if (!isLoggedIn) {
                        scope.$parent.after_login_location = '/scheckout';
                        sShoppable.ssLogIn();
                        scope.ss_wish_load = 0;
                        return;
                    }
                    twotapwishOut_part(step);
                });
            };
            // purchase attempt
            scope.$parent.loadfull = true;
            if (scope.firsttime.loading == 1) {
                if (angular.isDefined(scope.userprofile2)) {
                    if (!angular.isDefined(scope.twotap_builtin_cart)) {
                        scope.ss_cart_load = 1;
                        if (scope.ck_all) {
                            scope.twotapCheckoutCart(1);
                        } else if (!(angular.isDefined(scope.ck_all))) {
                            scope.twotapCheckoutCart(1);
                        } else {
                            if (angular.isDefined(scope.cur_merchant && scope.cur_merchant != '')) {
                                scope.twotapCheckoutMerchantWise(scope.cur_merchant);
                                scope.$parent.num_stores = 1;
                            } else if (angular.isDefined(scope.considered_items)) {
                                if (scope.considered_items.length > 0) {
                                    var temp_merchant = scope.considered_items[0].retailer; // careful 
                                    scope.$parent.num_stores = 1;
                                    scope.twotapCheckoutMerchantWise(temp_merchant);
                                    scope.$parent.cur_merchant = temp_merchant;
                                } else {
                                    $location.path('/shoppingbag');
                                    $route.reload();
                                }
                            } else {
                                $location.path('/shoppingbag');
                                $route.reload();
                            }
                        } // else end 
                    } // cart defined 
                } // profile defined
                if (angular.isDefined(scope.saveprofile2)) {
                    if (!angular.isDefined(scope.twotap_wishlist_cart) && scope.saveprofile2.length > 0) {
                        scope.ss_wish_load = 1;
                        scope.twotapwishOut(1);
                    } else {
                        console.log("user save cart is not there");
                    }
                }
            }
        }
    };
}]);