var app = angular.module('MyApp', [])app.controller('MyController', function ($scope) {    //This will hide the DIV by default.});angular.module('UserApp', []).controller('signin', function ($scope) {// $scope.x="hey";//  $scope.header_top = 'header_top.html';    $scope.SearchVisible = false;    $scope.StoreVisible = false;    $scope.CategoryVisible = false;    $scope.DesignerVisible = false;    $scope.allProductActive = "active last";    $scope.sArrawIconActiveAll = "icon-search-arrow-down";    $scope.ShowSearch = function () {        $scope.SearchVisible = true;    }    $scope.cancelSearch = function () {        $scope.SearchVisible = false;    }    $scope.topHeaderRight = function () {        $scope.SearchVisible = false;    }    $scope.mainContent = function (event) {        $scope.SearchVisible = false;    }    $scope.sShowAllProduct = function () {        $scope.CategoryVisible = false;        $scope.DesignerVisible = false;        $scope.StoreVisible = false;        $scope.sArrawIconActiveStore = "";        $scope.sArrawIconActiveCat = "";        $scope.sArrawIconActiveDesign = "";        $scope.storeActive = " ";        $scope.catActive = " ";        $scope.designerActive = " ";        $scope.sArrawIconActiveAll = "icon-search-arrow-down";        $scope.allProductActive = "active last";    }    $scope.ShowStore = function () {        $scope.CategoryVisible = false;        $scope.DesignerVisible = false;        $scope.StoreVisible = true;        $scope.sArrawIconActiveAll = "";        $scope.sArrawIconActiveCat = "";        $scope.sArrawIconActiveDesign = "";        $scope.allProductActive = " ";        $scope.catActive = " ";        $scope.designerActive = " ";        $scope.sArrawIconActiveStore = "icon-search-arrow-down";        $scope.storeActive = "active last";    }    $scope.ShowCategory = function () {        $scope.StoreVisible = false;        $scope.DesignerVisible = false;        $scope.CategoryVisible = true;        $scope.sArrawIconActiveAll = "";        $scope.sArrawIconActiveStore = "";        $scope.sArrawIconActiveDesign = "";        $scope.allProductActive = " ";        $scope.storeActive = " ";        $scope.designerActive = " ";        $scope.sArrawIconActiveCat = "icon-search-arrow-down";        $scope.catActive = "active last";    }    $scope.ShowDesigner = function () {        $scope.StoreVisible = false;        $scope.CategoryVisible = false;        $scope.DesignerVisible = true;        $scope.sArrawIconActiveAll = "";        $scope.sArrawIconActiveCat = "";        $scope.sArrawIconActiveStore = "";        $scope.allProductActive = " ";        $scope.storeActive = " ";        $scope.catActive = " ";        $scope.sArrawIconActiveDesign = "icon-search-arrow-down";        $scope.designerActive = "active last";    }    /* Mobile menu function */    $scope.MobileMnuVisible = false;    $scope.showMobileMenu = function () {        $scope.MobileMnuVisible = $scope.MobileMnuVisible == false ? true : false;    }    $scope.showSubMenu = false;    $scope.showSubMobileMenu = function () {        $scope.showSubMenu = $scope.showSubMenu == false ? true : false;    }    /* End mobile menu function */})/* For mobile show mobile menu */// angular.module('MobileMenu', []).controller('mobileMenuContent', function($scope){// })/* For mobile show mobile menu */angular.module('UserAppMainContent', []).controller('signInMainContent', function ($scope) {    $scope.mainContent = function () {    }})