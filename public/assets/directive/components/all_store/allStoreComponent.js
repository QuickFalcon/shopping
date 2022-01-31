angular.module('SSApp').directive('allStoreComponent', ['$http', '$route', '$routeParams', '$location', function($http, $route, $routeParams, $location) {
    return {
        restrict: 'E',
        templateUrl: 'assets/directive/components/all_store/allStoreView.html',
        link: function (scope) {
            scope.$parent.addTobagPossible = true;
            scope.$parent.ck_all = true;
            var loc = $location.path()
            if ((scope.loggedin == 0 || scope.userinfo === undefined) && loc == '/customizeshop') {
                scope.after_login_location = loc;
                sShoppable.ssLogIn();
                $location.path('/');
                $route.reload();
                return;
            }
            scope.customizeloading = false;
            scope.ss.changeTab = function changeTab(tab) {
                scope.ss.activeTab = tab;
            };
            // Tabbing by select dropdown in moible
            scope.tabH = {
                tabHoptions: [{
                    id: '1',
                    name: 'DASHBOARD'
                }, {
                    id: '2',
                    name: 'WOMEN'
                }, {
                    id: '3',
                    name: 'MEN'
                }, {
                    id: '4',
                    name: 'SHOES'
                }, {
                    id: '5',
                    name: 'ACCESSORIES'
                }, {
                    id: '6',
                    name: 'BEAUTY'
                }, {
                    id: '7',
                    name: 'KIDS'
                }, {
                    id: '8',
                    name: 'HOME'
                }, {
                    id: '9',
                    name: 'GIFTS'
                }, {
                    id: '10',
                    name: 'CUSTOMIZE'
                }],
                selectedItem: {
                    id: '1',
                    name: 'DASHBOARD'
                }
            };
            scope.sltTabHead = function() {
                scope.$parent.ss.activeTab = scope.tabH.selectedItem.id;
            };
            // update user store for menu
            scope.removetopten = function(store_name, menuitem) {
                if ((scope.loggedin != 1)) {
                    scope.after_login_location = '/customizeshop';
                    sShoppable.ssLogIn();
                    return;
                }
                var available = false;
                var store;
                var message = "";
                if (menuitem == "dashboard") {
                    if (angular.isDefined(scope.userstoptenDashboard)) {
                        var w_index = scope.userstoptenDashboard.indexOf(store_name); // women index
                        if (w_index > -1) {
                            available = true;
                            store = {
                                "menuitem": menuitem,
                                "storelist": scope.userstoptenDashboard
                            };
                            scope.$parent.userstoptenDashboard.splice(w_index, 1);
                            scope.$parent.varmenu = scope.userstoptenDashboard;
                            removefromtopten(menuitem, scope.userstoptenDashboard);
                        }
                    }
                } else if (menuitem == "women") {
                    if (angular.isDefined(scope.userstoptenWomen)) {
                        var w_index = scope.userstoptenWomen.indexOf(store_name); // women index
                        if (w_index > -1) {
                            available = true;
                            store = {
                                "menuitem": menuitem,
                                "storelist": scope.userstoptenWomen
                            };
                            scope.$parent.userstoptenWomen.splice(w_index, 1);
                            scope.$parent.varmenu = scope.userstoptenWomen;
                            removefromtopten(menuitem, scope.userstoptenWomen);
                        }
                    }
                } else if (menuitem == "men") {
                    if (angular.isDefined(scope.userstoptenMen)) {
                        var w_index = scope.userstoptenMen.indexOf(store_name); // women index
                        if (w_index > -1) {
                            available = true;
                            store = {
                                "menuitem": menuitem,
                                "storelist": scope.userstoptenMen
                            };
                            scope.$parent.userstoptenMen.splice(w_index, 1);
                            scope.$parent.varmenu = scope.userstoptenMen;
                            removefromtopten(menuitem, scope.userstoptenMen);
                        }
                    }
                } else if (menuitem == "shoes") {
                    if (angular.isDefined(scope.userstoptenShoes)) {
                        var s_index = scope.userstoptenShoes.indexOf(store_name); // women index
                        if (s_index > -1) {
                            available = true;
                            store = {
                                "menuitem": menuitem,
                                "storelist": scope.userstoptenShoes
                            };
                            scope.$parent.userstoptenShoes.splice(w_index, 1);
                            scope.$parent.varmenu = scope.userstoptenShoes;
                            removefromtopten(menuitem, scope.userstoptenShoes);
                        }
                    }
                } else if (menuitem == "accessories") {
                    if (angular.isDefined(scope.userstoptenAccessories)) {
                        var w_index = scope.userstoptenAccessories.indexOf(store_name); // women index
                        if (w_index > -1) {
                            available = true;
                            store = {
                                "menuitem": menuitem,
                                "storelist": scope.userstoptenAccessories
                            };
                            scope.$parent.userstoptenAccessories.splice(w_index, 1);
                            scope.$parent.varmenu = scope.userstoptenAccessories;
                            removefromtopten(menuitem, scope.userstoptenAccessories);
                        }
                    }
                } else if (menuitem == "beauty") {
                    if (angular.isDefined(scope.userstoptenBeauty)) {
                        var w_index = scope.userstoptenBeauty.indexOf(store_name); // women index
                        if (w_index > -1) {
                            available = true;
                            store = {
                                "menuitem": menuitem,
                                "storelist": scope.userstoptenBeauty
                            };
                            scope.$parent.userstoptenBeauty.splice(w_index, 1);
                            scope.$parent.varmenu = scope.userstoptenBeauty;
                            removefromtopten(menuitem, scope.userstoptenBeauty);
                        }
                    }
                } else if (menuitem == "kids") {
                    if (angular.isDefined(scope.userstoptenKids)) {
                        var w_index = scope.userstoptenKids.indexOf(store_name); // women index
                        if (w_index > -1) {
                            available = true;
                            store = {
                                "menuitem": menuitem,
                                "storelist": scope.userstoptenKids
                            };
                            scope.$parent.userstoptenKids.splice(w_index, 1);
                            scope.$parent.varmenu = scope.userstoptenKids;
                            removefromtopten(menuitem, scope.userstoptenKids);
                        }
                    }
                } else if (menuitem == "home") {
                    if (angular.isDefined(scope.userstoptenHome)) {
                        var w_index = scope.userstoptenHome.indexOf(store_name); // women index
                        if (w_index > -1) {
                            available = true;
                            store = {
                                "menuitem": menuitem,
                                "storelist": scope.userstoptenHome
                            };
                            scope.$parent.userstoptenHome.splice(w_index, 1);
                            scope.$parent.varmenu = scope.userstoptenHome;
                            removefromtopten(menuitem, scope.userstoptenHome);
                        }
                    }
                } else if (menuitem == "gift") {
                    if (angular.isDefined(scope.userstoptenGifts)) {
                        var w_index = scope.userstoptenGifts.indexOf(store_name); // women index
                        if (w_index > -1) {
                            available = true;
                            store = {
                                "menuitem": menuitem,
                                "storelist": scope.userstoptenGifts
                            };
                            scope.$parent.userstoptenGifts.splice(w_index, 1);
                            scope.$parent.varmenu = scope.userstoptenGifts;
                            removefromtopten(menuitem, scope.userstoptenGifts);
                        }
                    }
                } else if (menuitem == "others") {
                    if (angular.isDefined(scope.userstoptenLocal)) {
                        var w_index = scope.userstoptenLocal.indexOf(store_name); // women index
                        if (w_index > -1) {
                            available = true;
                            scope.$parent.userstoptenLocal.splice(w_index, 1);
                            scope.$parent.varmenu = scope.userstoptenLocal;
                            removefromtopten(menuitem, scope.userstoptenLocal);
                        }
                    }
                }
            };
            scope.updatetopten = function(store_name, menuitem) {
                if (scope.loggedin != 1) {
                    scope.after_login_location = '/customizeshop';
                    sShoppable.ssLogIn();
                    return;
                }
                var store = {
                    "menuitem": menuitem,
                    "store_name": store_name
                };
                var message;
                if (menuitem == "dashboard") {
                    if (scope.userstoptenDashboard.length >= 10) {
                        message = "you can not add more than 10 under  " + menuitem;
                        window.alert("you can not add more than 10 under  " + menuitem)
                        return;
                    }
                    $http.post('/update_user_store', store).then(function(response) {
                        scope.$parent.userstoptenDashboard = response.data.userDashboardMerchant;
                        scope.$parent.varmenu = response.data.userDashboardMerchant;
                    }, function(err) {
                        window.alert(err);
                    });
                }
                if (menuitem == "women") {
                    if (scope.userstoptenWomen.length >= 10) {
                        message = "you can not add more than 10 under  " + menuitem;
                        window.alert("you can not add more than 10 under  " + menuitem)
                        return;
                    }
                    $http.post('/update_user_store', store).then(function(response) {
                        scope.$parent.userstoptenWomen = response.data.userWomenMerchant;
                        scope.$parent.varmenu = scope.userstoptenWomen;
                    }, function(err) {
                        window.alert(err);
                    });
                } else if (menuitem == "men") {
                    if (scope.userstoptenMen.length >= 10) {
                        message = "you can not add more than 10 under  " + menuitem;
                        window.alert("you can not add more than 10 under  " + menuitem)
                        return;
                    }
                    $http.post('/update_user_store', store).then(function(response) {
                        scope.$parent.userstoptenMen = response.data.usermenMerchant;
                        scope.$parent.varmenu = scope.userstoptenMen;
                    }, function(err) {
                        window.alert(err);
                    });
                } else if (menuitem == "shoes") {
                    if (scope.userstoptenShoes.length >= 10) {
                        message = "you can not add more than 10 under  " + menuitem;
                        window.alert("you can not add more than 10 under  " + menuitem)
                        return;
                    }
                    $http.post('/update_user_store', store).then(function(response) {
                        scope.$parent.userstoptenShoes = response.data.userShoesMerchant;
                        scope.$parent.varmenu = scope.userstoptenShoes;
                    }, function(err) {
                        window.alert(err);
                    });
                } else if (menuitem == "accessories") {
                    if (scope.userstoptenAccessories.length >= 10) {
                        message = "you can not add more than 10 under  " + menuitem;
                        window.alert("you can not add more than 10 under  " + menuitem)
                        return;
                    }
                    $http.post('/update_user_store', store).then(function(response) {
                        scope.$parent.userstoptenAccessories = response.data.userAccessoriesMerchant;
                        scope.$parent.varmenu = scope.userstoptenAccessories;
                    }, function(err) {
                        window.alert(err);
                    });
                } else if (menuitem == "beauty") {
                    if (scope.userstoptenBeauty.length >= 10) {
                        message = "you can not add more than 10 under  " + menuitem;
                        window.alert("you can not add more than 10 under  " + menuitem)
                        return;
                    }
                    $http.post('/update_user_store', store).then(function(response) {
                        scope.$parent.userstoptenBeauty = response.data.userBeautyMerchant;
                        scope.$parent.varmenu = scope.userstoptenBeauty;
                    }, function(err) {
                        window.alert(err);
                    });
                } else if (menuitem == "kids") {
                    if (scope.userstoptenKids.length >= 10) {
                        message = "you can not add more than 10 under  " + menuitem;
                        window.alert("you can not add more than 10 under  " + menuitem)
                        return;
                    }
                    $http.post('/update_user_store', store).then(function(response) {
                        scope.$parent.userstoptenKids = response.data.userKidsMerchant;
                        scope.$parent.varmenu = scope.userstoptenKids;
                    }, function(err) {
                        window.alert(err);
                    });
                } else if (menuitem == "home") {
                    if (scope.userstoptenHome.length >= 10) {
                        message = "you can not add more than 10 under  " + menuitem;
                        window.alert("you can not add more than 10 under  " + menuitem)
                        return;
                    }
                    $http.post('/update_user_store', store).then(function(response) {
                        scope.$parent.userstoptenHome = response.data.userHomeMerchant;
                        scope.$parent.varmenu = scope.userstoptenHome;
                    }, function(err) {
                        window.alert(err);
                    });
                } else if (menuitem == "gift") {
                    if (scope.userstoptenGifts.length >= 10) {
                        message = "you can not add more than 10 under  " + menuitem;
                        window.alert("you can not add more than 10 under  " + menuitem)
                        return;
                    }
                    $http.post('/update_user_store', store).then(function(response) {
                        scope.$parent.userstoptenGifts = response.data.userGiftsMerchant;
                        scope.$parent.varmenu = scope.userstoptenGifts;
                    }, function(err) {
                        window.alert(err);
                    });
                } else if (menuitem == "others") {
                    if (scope.userstoptenLocal.length >= 10) {
                        message = "you can not add more than 10 under  " + menuitem;
                        window.alert("you can not add more than 10 under  " + menuitem)
                        return;
                    }
                    $http.post('/update_user_store', store).then(function(response) {
                        scope.$parent.userstoptenLocal = response.data.userLocalMerchant;
                        scope.$parent.varmenu = scope.userstoptenLocal;
                    }, function(err) {
                        window.alert(err);
                    });
                } else {
                    if (scope.userstoptenLocal.length >= 10) {
                        message = "you can not add more than 10 under  " + menuitem;
                        window.alert("you can not add more than 10 under  " + menuitem)
                        return;
                    }
                    $http.post('/update_user_store', store).then(function(response) {
                        scope.$parent.userstoptenLocal = response.data.userLocalMerchant;
                        scope.$parent.varmenu = scope.userstoptenLocal;
                    }, function(err) {
                        window.alert(err);
                    });
                }
            };
            function removefromtopten(menuitem, storelist) {
                var store = {
                    "menuitem": menuitem,
                    "storelist": storelist
                };
                $http.post('/remove_user_toptenstore', store).then(function(response) {
                    if (menuitem == "dashboard") {
                        scope.$parent.userstoptenDashboard = response.data.userDashboardMerchant;
                        scope.$parent.varmenu = response.data.userDashboardMerchant;
                    } else if (menuitem == "women") {
                        scope.$parent.userstoptenWomen = response.data.userWomenMerchant;
                        scope.$parent.varmenu = scope.userstoptenWomen;
                    } else if (menuitem == "men") {
                        scope.$parent.userstoptenMen = response.data.usermenMerchant;
                        scope.$parent.varmenu = scope.userstoptenMen;
                    } else if (menuitem == "shoes") {
                        scope.$parent.userstoptenShoes = response.data.userShoesMerchant;
                        scope.$parent.varmenu = scope.userstoptenShoes;
                    } else if (menuitem == "accessories") {
                        scope.$parent.userstoptenAccessories = response.data.userAccessoriesMerchant;
                        scope.$parent.varmenu = scope.userstoptenAccessories;
                    } else if (menuitem == "beauty") {
                        scope.$parent.userstoptenBeauty = response.data.userBeautyMerchant;
                        scope.$parent.varmenu = scope.userstoptenBeauty;
                    } else if (menuitem == "kids") {
                        scope.$parent.userstoptenKids = response.data.userKidsMerchant;
                        scope.$parent.varmenu = scope.userstoptenKids;
                    } else if (menuitem == "home") {
                        scope.$parent.userstoptenHome = response.data.userHomeMerchant;
                        scope.$parent.varmenu = scope.userstoptenHome;
                    } else if (menuitem == "gift") {
                        scope.$parent.userstoptenGifts = response.data.userGiftsMerchant;
                        scope.$parent.varmenu = scope.userstoptenGifts;
                    } else if (menuitem == "others") {
                        scope.$parent.userstoptenLocal = response.data.userLocalMerchant;
                        scope.$parent.varmenu = scope.userstoptenLocal;
                    }
                }, function(response) {
                    console.log("failed");
                });
            }
            // getting storelist from database (database created from api morethan item 1 )
            scope.customizeloading = true;
            scope.$parent.firsttime.loading = 1;
            scope.$parent.loadfull = true;
        }
    };
}]);