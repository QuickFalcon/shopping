//////////////////////// THIS ONE IS ADMIN MAIN CONTROLLER/////////////////////
//1 .app_admin_main.js has following controllers
//a.dashctrl  // dashbooard controller
//b. registerctrl admin registration controller
//c.profilectrl admin profile controller
//d.storeSingleCtrl single store data
//e. storeCtrl adding store data
//f. storeListCtrl listing store

// i.clickListCtrl work with number of clicks and mixpanel


// 2 .admin_productcontroller.js has following controllers
//a.productListCtrl admin -
//b. productCtrl admin -product controller page
//3. searchcontroller.js hold all data from ap is
// a. APIproductCtrl return productlist from api using product key
// b.  APIcatalogCtrl return productlist from api using catalog key
// c.searchcontroller product search using api
var adminapp = angular.module('adminapp', ['ngRoute', 'ngResource', 'ui.bootstrap', 'ui.slider', 'ngFileUpload', 'SSApp']);
//This array lists the modules that adminapp depends on.

//TypeaheadCtrl
adminapp.config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/',
                {
                    // templateUrl : 'partials/admin/productlistapi.html',           //productlist search from controller for api data
                    // controller : 'searchcontroller'
                    templateUrl: 'partials/admin/index.html',
                    controller: 'dashCtrl',

                }).when('/apicat/:CatalogId',                               // show specific product from api
                {
                    templateUrl: 'partials/admin/apicat.html',
                    controller: 'APIcatalogCtrl',
                    title: 'Product Details from Api using catalogid'


                }).when('/apiproduct/:ProductId',                               // show specific prdouct from api
                {
                    templateUrl: 'partials/admin/apiproduct.html',
                    controller: 'APIproductCtrl',
                    title: 'Product Details from API using product id'

                })


            .when('/clicks',
                {
                    templateUrl: 'partials/admin/clicks.html',
                    controller: 'clickListCtrl',
                    title: 'SS : Number of clicks'


                })
            .when('/createCustomCategories',
                {
                    templateUrl: 'partials/admin/categories_create.html',
                    controller: 'syncCategoriesCtrl',
                    title: 'Sync Categories'
                })
            .when('/dashboard',
                {
                    templateUrl: 'partials/admin/index.html',
                    controller: 'dashCtrl',
                    title: 'Admin dashboard'


                })
            .when('/featureStoreAdd',
                {
                    templateUrl: 'partials/admin/store_add_featured.html',
                    controller: 'storeListCtrl',
                    title: 'Add Featured Store'
                })
            .when('/img_management',
                {
                    templateUrl: 'partials/admin/store_manage_sync.html',
                    controller: 'syncimageManagementCtrl',
                    title: 'Do not Sync Store Images'
                })
            .when('/login_registration',
                {
                    templateUrl: 'partials/admin/login_registration.html',
                    controller: 'registerctrl',
                    title: 'Add Admin'
                })
            .when('/manageCustomCategories',
                {
                    templateUrl: 'partials/admin/categories_manage.html',
                    controller: 'syncCategoriesCtrl',
                    title: 'Sync Categories'
                })
                .when('/mappedword',
                    {
                        templateUrl: 'partials/admin/mapped_word.html',
                        controller: 'mapCategoriesCtrl',
                        title: 'map word to category'
                    })


                .when('/pages_user_profile',
                {
                    templateUrl: 'partials/admin/pages_user_profile.html',
                    controller: 'profilectrl',
                    title: 'User Profile'

                })
            .when('/productlistapi',
                {
                    templateUrl: 'partials/admin/productlistapi.html',           //productlist search from controller for api data
                    controller: 'searchcontroller',                               // name is similar with file name
                    title: 'Api Returned Product List'

                })
                .when('/productdb/:CatalogId',                           // show specific product from database it is inside productcontroller page
                {
                    templateUrl: 'partials/admin/productdb.html',
                    controller: 'productCtrl',
                    title: 'Product Details from DB using catalog id'
                })
               .when('/productgrouplistapi',
                {
                    templateUrl: 'partials/admin/productgrouplistapi.html',       //productlist search from controller for api data
                    controller: 'searchcontroller',                               // name is similar with file name
                    title: 'Api Returned Group Product'

                })
                .when('/productlistdb',                                   // show product list from database it is inside productcontroller page
                {
                    templateUrl: 'partials/admin/productlistdb.html',
                    controller: 'productListCtrl',
                    title: 'Product List from Database'


                })


                .when('/storeAnalysis',
                {
                    templateUrl: 'partials/admin/store_compare_analysis.html',
                    controller: 'adminStoreAnalysisCtrl',
                    title: 'Store Analysis'
                })
                .when('/storeadd',
                {
                    templateUrl: 'partials/admin/store_add.html',
                    controller: 'storeCtrl',
                    title: 'Add Store'
                })
                .when('/storelist',
                {
                    templateUrl: 'partials/admin/store_list.html',
                    controller: 'storeListCtrl',
                    title: 'Stores'
                })
                .when('/storeupdate/:storeId',
                {
                    templateUrl: 'partials/admin/store_update.html',
                    controller: 'storeSingleCtrl',
                    title: 'Update Store'
                })

                .when('/sync',
                {
                    templateUrl: 'partials/admin/index.html',
                    controller: 'dashCtrl',
                    title: 'Admin dashboard'
                })
                .when('/syncBrand',
                {
                    templateUrl: 'partials/admin/brand_sync.html',
                    controller: 'syncBrandCtrl',
                    title: 'Sync Brand'
                }).when('/syncCategories',
                {
                    templateUrl: 'partials/admin/categories_sync.html',
                    controller: 'syncCategoriesCtrl',
                    title: 'Sync Categories'
                }).when('/syncCategoriesSame',
                {
                    templateUrl: 'partials/admin/categories_sync_same.html',
                    controller: 'syncCategoriesCtrl',
                    title: 'Sync Categories'
                })
				

                .when('/syncProducts',
                {
                    templateUrl: 'partials/admin/product_sync.html',
                    controller: 'syncProductsCtrl',
                    title: 'Sync Products'
                }).when('/syncStore',
                {
                    templateUrl: 'partials/admin/store_sync.html',
                    controller: 'syncStoreCtrl',
                    title: 'Sync Store'
                }).when('/syncStoreFile',
                {
                    templateUrl: 'partials/admin/store_sync_common.html',
                    controller: 'syncStoreCtrl',
                    title: 'Sync Common Store'
                })
				
				.otherwise({redirectTo: '/dashboard'});

        }
    ]
);


var SSApp = angular.module('SSApp', []); // now again define a directive
//define all of the controller one by one


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////  GRAPH RELATED CONTROLLERS              /////////////////////////////////////////////////////////////				


//-------------------------a.DASHBOARD CONTROLLER

SSApp.controller('dashCtrl', ['$scope', '$http', function ($scope, $http) {

    $scope.title = "dashboard";
    $scope.action_sync = function () {
        $scope.queryobj = {};
        $http.post('/productsync', $scope.queryobj)  //call to retrieve data
            .success(function (data) {
                $scope.database = data;
                var k = 0;
                for (k = 0; k < data.length; k++) {
                    $http.get('/catalog_pro_sync/' + $scope.database[k].catalogId).success(function (apidata) {

                        window.alert(apidata.total + "I am api data" + apidata.data.catalogId);
                    })
                }
            });
    }
    $scope.generateTopTen = function () {

        console.log("top ten");
        $http.get('/calculate_top').success(function (data) {
            window.alert("successfully new top ten generated from user preference")
        })
    }
//-----------------------------------b.DASHBOARD CONTROLLER


    $http.get('/prosperent').success(function (data, status, headers, config) {

        $scope.prospernetclick = data.totalRecordsFound;

    }).error(function (data, status, headers, config) {

        $scope.prospernetclick = 'ERROR';
    });

    $http.get('/prosperentcommission').success(function (dcommission, status, headers, config) {

        if (dcommission.length == 0) {
            $scope.dcommission = 0;

        }
        else
            $scope.dcommission = dcommission;
    }).error(function (dcommission, status, headers, config) {

        $scope.dcommission = 'ERROR';
    });

    $http.get('/prosperentpayment').success(function (datapayment, status, headers, config) {

        if (datapayment.length == 0) {
            $scope.datapayment = 0;

        }
        else
            $scope.datapayment = datapayment;


    }).error(function (datapayment, status, headers, config) {

        $scope.datapayment = 'ERROR';
    });

    chart1Handler(); //inside chart.js
    Index.init(); // part of custom_scripts/admin/index.js
}]);



//--------------------- c. Chart Related Controller	-----------------------------------------------
SSApp.controller('ChartCtrl2', ["$scope", function ($scope) {

    // Chart.js Data
    $scope.data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'My First dataset',
                fillColor: 'rgba(220,220,220,0.5)',
                strokeColor: 'rgba(220,220,220,0.8)',
                highlightFill: 'rgba(220,220,220,0.75)',
                highlightStroke: 'rgba(220,220,220,1)',
                data: [60, 59, 80, 81, 56, 55, 40]
            },
            {
                label: 'My Second dataset',
                fillColor: 'rgba(151,187,205,0.5)',
                strokeColor: 'rgba(151,187,205,0.8)',
                highlightFill: 'rgba(151,187,205,0.75)',
                highlightStroke: 'rgba(151,187,205,1)',
                data: [20, 48, 40, 19, 86, 27, 90]
            }
        ]
    };

    // Chart.js Options
    $scope.options = {

        // Sets the chart to be responsive
        responsive: true,

        //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
        scaleBeginAtZero: true,

        //Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines: true,

        //String - Colour of the grid lines
        scaleGridLineColor: "rgba(0,0,0,.05)",

        //Number - Width of the grid lines
        scaleGridLineWidth: 1,

        //Boolean - If there is a stroke on each bar
        barShowStroke: true,

        //Number - Pixel width of the bar stroke
        barStrokeWidth: 2,

        //Number - Spacing between each of the X value sets
        barValueSpacing: 5,

        //Number - Spacing between data sets within X values
        barDatasetSpacing: 1,

        //String - A legend template
        legendTemplate: '<ul class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].fillColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
    };

}]);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////----------------------STORE RELATED CONTROLLERS----------------////////////////////////////////////////////
SSApp.controller('storeListCtrl', ['$scope', '$http', function ($scope, $http) {


    function searchdatabaseStore() {
        $scope.storequeryobj = {};
        $http.post('/storelist', $scope.storequeryobj)  //call to retrieve data
            .success(function (data) {

                $scope.adminstorelist = data.product;

            }).error(function (err) {
            window.alert("Store list can not generated: " + err);
        });

    }

    searchdatabaseStore();
    $scope.deleteStore = function (storeid) {
        $http.delete('/store_delete/' + storeid)  //call to retrieve data
            .success(function (data) {

                searchdatabaseStore();
            }).error(function (err) {
            window.alert("Store can not be deleted " + err);
        });

    }

    $scope.add_store_featured = function () {

        $scope.featureStore = {};
        $scope.featureStore.store_name = $scope.selected_shop;
        $scope.featureStore.menuItem = $scope.menuutem;
        $scope.featureStore.store_id = "";

        $http.post('/feature_store_save', $scope.featureStore)
            .success(function (data) {

                window.alert("successfully featured store saved in system");
            })


    }


}]);

// single store related data
SSApp.controller('storeSingleCtrl', ['$scope', '$http', '$route', '$routeParams', '$location', function ($scope, $http, $route, $routeParams, $location) {

    $scope.storeId = $routeParams.storeId; // retrieve  catalog id

    function showSingleStore() {
        $http.get('/store_get/' + $scope.storeId)
            .success(function (data) {
                $scope.store = data;
            })
    }

    showSingleStore();
    $scope.update_store = function () {


        $http.post('/store_update', $scope.store)
            .success(function (data) {

                window.alert("successfully data stored in system");
                showSingleStore();
            })

    }

}]);

SSApp.controller('storeCtrl', ['$scope', '$http', function ($scope, $http) {


    $scope.add_store = function () {
        $http.post('/store_save', $scope.store)
            .success(function (data) {

                window.alert("successfully data stored in system");
            })

    }
    // first delete all store then add new
    $scope.delete_all_store = function () {


        $http.delete('/store_delete/' + storeid)  //call to retrieve data
            .success(function (data) {

                searchdatabaseStore();
            }).error(function (err) {
            window.alert("Store can not be deleted " + err);
        });

    }

    $scope.sync_store = function () {

        $http.post('/sync_stores_add')  //call to retrieve data
            .success(function (data) {
                window.alert("successful sync operation");

            }).error(function (err) {
            console.log(" SOrry error " + err);
        });

    }


}]);


SSApp.controller('syncProductsCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.sync_products = function () {

        $http.post('/sync_products_add')  //call to retrieve data
            .success(function (data) {
                window.alert("successful sync operation");

            }).error(function (err) {
            console.log(" SOrry error " + err);
        });

    }

}]);


// synchronize brands 
SSApp.controller('syncBrandCtrl', ['$scope', '$http', function ($scope, $http) {

    var brand_offset = 200;
    $scope.brand_start = 0;
	$scope.brdglocal = {};
	$scope.fileName ='shopstyle.txt';
	
	
    $scope.sync_brands = function () {
        
        $http.post('/get_all_brand_from_text',{path: $scope.fileName})  //call to retrieve data
            .success(function (data) {
                window.alert("successful sync operation for brand");
                $scope.brand_start = 0;
				$scope.generateAllBrands();
				
				
            }).error(function (err) {
            console.log(" SOrry error " + err);
        });

    }
	$scope.deleteSpecificBrand = function(brand,index) {
		
		    $http.post('/brand_delete_specific',brand)  //call to retrieve data
            .success(function (data) {
               	
				if (data == "success")
				$scope.brandList.splice(index,1);
                else
				window.alert("Delete failure");


            }).error(function (err) {
            window.alert(" SOrry error " + err);
            });
	
	
	
	
	}

    $scope.updateBrand = function(brand,index) {
        
            $http.post('/brand_update',brand)  //call to retrieve data
            .success(function (data) {
                
                if (data == "success")
               window.alert("Update Success");
                else
                window.alert("Update failure");


            }).error(function (err) {
            window.alert(" SOrry error " + err);
            });
   
    
    
    
    }


    $scope.delete_brands = function () {

        $http.post('/brand_delete_all')  //call to retrieve data
            .success(function (data) {
                if (data == "success") {  
			      $scope.brand_start = 0;
				   $scope.brandList =[];
			       window.alert("successful delete operation!");
                
				}
				else
                    window.alert("Delete failure");


            }).error(function (err) {
            window.alert(" SOrry error " + err);
        });

    }

    $scope.generateAllBrands = function () {
        var concat_str;
        var brand_q = {offset: brand_offset, start: $scope.brand_start};
        $http.post('/get_cmn_brands', brand_q).success(function (data) {
            if ($scope.brand_start == 0) {
                $scope.totalBrands = data.count;
                $scope.brandList = data.brands;
                //$scope.number_BrandPage = Math.ceil($scope.totalBrands / brand_offset);
            }
            else {
                concat_str = $scope.brandList;
                $scope.brandList = concat_str.concat(data.brands);
            }
            $scope.brand_start = $scope.brand_start + 1;
            $scope.brandLoading = false;
        }).error(function (err) {
            console.log("brand generate error: " + err)
            $scope.brandLoading = false;
        });
    } 
	
	$scope.generateAllBrands();
	
	
}]);




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// USER RELATED CONTROLLER --------------------------------------//////////////////////////////////////////
SSApp.controller('registerctrl', ['$scope', '$http', function ($scope, $http) {

    $scope.createadmin = function(){

        window.alert("Create");


        if($scope.moderator.terms) {

            if($scope.moderator.password!=$scope.moderator.password2 ){
                window.alert("password do not match");
                return;

            }


            console.log($scope.moderator.gender);

            $http.post('http://gitlab.sociallyshoppable.com/loginRegistration',$scope.moderator)  //call to retrieve data
                .success(function (data) {

                    window.alert("Admin Created successfully")

                })
        } else {

           window.alert("please checked i agree");

        }



    }




}]);

SSApp.controller('profilectrl', ['$scope', '$http', function ($scope, $http) {
}]);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	

/*
 angular.module('SSApp').controller('TypeaheadCtrl', function($scope, $http) {

 $scope.states = ['shirt','pant','shoe','bag','jeans'];
 $scope.countries =[];
 $scope.select_dept="Electronics";
 $scope.selected={"catalogId":"","productId":"","affiliate_url":"","image_url":"","keyword":"","keywords":null,"celebrity":[],"description":"","category":"","price":"","price_sale":"","percentOff":null,"currency":"","merchant":"","merchantId":"","brand":"","upc":"","isbn":"","sales":0};
 $scope.select_brand="";
 $scope.select_merchant="";
 $scope.minprice = 0;
 $scope.maxprice = 9999;
 $scope.select_color="";
 $scope.total_record =0;
 $scope.totalRecordsAvailable=0;
 $scope.bigCurrentPage = 1;
 $scope.maxSize =  5; // per page item


 //initial



 $scope.cost = {

 range:	    [0.0, 9999.00]

 };
 $scope.percent = {

 range:	    [0, 100]

 };

 var arr=[];
 var countries = [];
 var tempname;
 var tempcode;
 var tempimg;
 var tempbrand;
 var tempcategory;
 //tempprice=data.data[i].price;
 var tempprice;
 var temppricesale;
 var tempcurrency;
 var tempmerchant;
 var tempaffiliate_url;
 var tempdiscount=false;
 var temppercentoff=0;

 $scope.save_option ="manually";
 // initial load
 $http.get('/autocomplete').success(function(data, status, headers, config){
 var i=0;
 $scope.total_record = data.totalRecords;
 $scope.totalRecordsAvailable=data.totalRecordsAvailable;
 countries=[];
 arr=[];

 //$scope.countries = countries;
 $scope.countries = data.data;

 });



 // -------------Searching by click -----------------

 $scope.searching= function(){
 //  window.alert("searching");

 var str="";
 var u=this.selected.keyword;

 $scope.bigCurrentPage = 1;
 if(u=="")
 {
 u="null";
 }
 str = "query="+u+"&filterCategory="+$scope.select_dept+"&currentpage="+$scope.bigCurrentPage;
 var suggestion = $http({
 method: 'GET',
 url: '/autosuggestion?'+str
 });

 suggestion.success(function(data){
 var temp=[];
 arr=[];
 countries=[];
 //  window.alert(data.totalRecords);
 $scope.totalRecordsAvailable=data.totalRecordsAvailable;
 $scope.total_record = data.totalRecords;




 $scope.countries = [];
 //$scope.countries =countries;
 $scope.countries = data.data;


 arr[i+1] ='shirt';
 arr[i+2] ='pant';
 // arr.sort();
 //$scope.states=[];
 //$scope.states= arr;

 }).
 error(function(data, status, headers, config) {
 window.alert("request can not be proceeded");
 });



 }; //end of searching function



 //changing department
 $scope.update_suggestion= function(){

 var catagory = this.select_dept;
 var suggestion = $http({
 method: 'GET',
 url: '/autosuggestioncat/'+catagory

 });


 suggestion.success(function(data){
 $scope.totalRecordsAvailable=data.totalRecordsAvailable;
 $scope.total_record = data.totalRecords;
 countries=[];  // empty the country
 arr =[]; //empty the array

 $scope.countries =[];
 //$scope.countries =countries;

 $scope.countries = data.data;
 arr[i+1] ='shirt';
 arr[i+2] ='pant';

 });

 }

 //------------------- page change event-----------------------------
 $scope.pageChanged = function() {

 var p=0;

 var str="";
 var u=this.selected.keyword;
 if(u=="")
 {
 u="null";
 }
 str = "query="+u+"&filterCategory="+$scope.select_dept+"&currentpage="+$scope.bigCurrentPage; // call next 10 item
 var suggestion = $http({
 method: 'GET',
 url: '/autosuggestion?'+str
 });

 suggestion.success(function(data){
 var temp=[];
 arr=[];
 countries=[];
 $scope.totalRecordsAvailable=data.totalRecordsAvailable;
 $scope.total_record = data.totalRecords;

 for(i=0;i<data.totalRecords;i++)
 {

 arr[i] = data.data[i].keyword; // redefine suggestion
 tempname=data.data[i].keyword;
 tempcode=data.data[i].catalogId;
 tempimg=data.data[i].image_url;
 tempbrand=data.data[i].brand;
 tempcategory=data.data[i].category;
 tempprice=data.data[i].price;
 temppricesale= data.data[i].price_sale;
 tempcurrency=data.data[i].currency;
 tempmerchant=data.data[i].merchant;
 tempaffiliate_url=  data.data[i].affiliate_url;


 if(temppricesale!=="")
 {
 tempdiscount= true;
 }
 else
 {
 tempdiscount= false;
 }
 if(data.data[i].percentOff==null)
 {
 temppercentoff=0;
 }
 else
 {
 temppercentoff=data.data[i].percentOff;
 }




 if(i%3==0)
 {
 tempcolor = "red";
 }
 else if(i%2==0)
 {
 tempcolor = "green";
 }
 else
 {
 tempcolor = "blue";
 }

 countries[i] ={name:tempname,catalogId:tempcode,image_url:tempimg,brand:tempbrand,category:tempcategory,price:tempprice,saleprice:temppricesale,discount:tempdiscount,percentOff:temppercentoff,color:tempcolor,currency:tempcurrency,merchant:tempmerchant,
 affiliate_url:tempaffiliate_url};
 }
 $scope.countries = [];
 //$scope.countries =countries;

 $scope.countries = data.data;

 arr[i+1] ='shirt';
 arr[i+2] ='pant';
 arr.sort();
 $scope.states=[];
 $scope.states= arr;

 }); //call back method

 }; //page change function end



 //$scope.numPages= $scope.totalRecordsAvailable/120;

 $scope.priceFilter = function(pro)
 {

 if(pro.price_sale=="")
 {
 return pro.price >= $scope.cost.range[0] && pro.price <= $scope.cost.range[1];

 }
 else
 {
 return pro.price_sale >= $scope.cost.range[0] && pro.price_sale <= $scope.cost.range[1];

 }

 }


 $scope.percentFilter = function(pro)
 {

 return pro.percentOff >= $scope.percent.range[0] && pro.percentOff <= $scope.percent.range[1];

 }

 $scope.setColor = function(color){
 $scope.select_color = color;
 }

 $scope.clearFilter = function() {
 $scope.selected={"catalogId":"","productId":"","affiliate_url":"","image_url":"","keyword":"","keywords":null,"celebrity":[],"description":"","category":"","price":"","price_sale":"","percentOff":null,"currency":"","merchant":"","merchantId":"","brand":"","upc":"","isbn":"","sales":0};

 $scope.select_brand="";
 $scope.select_merchant="";
 $scope.select_color="";
 $scope.category="";


 $scope.cost = {
 range:	    [0.0, 9999.00]
 };

 $scope.percent = {

 range:	    [0, 100]

 };
 $scope.bigCurrentPage=1;
 };


 $scope.setPage = function (pageNo) {
 $scope.currentPage = pageNo;
 };

 $scope.select_for_save =function(val){
 window.alert(value);
 $scope.save_option =val;
 };


 });

 */
SSApp.controller('PhoneDetailsCtrl', ['$scope', '$routeParams', function ($scope, $routeParams) {

    $scope.name = 'gazi';
    $scope.phone = 'samsung';
    $scope.phoneId = $routeParams.phoneId;
}


]);

adminapp.run(['$location', '$rootScope', function ($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {

        if (current.hasOwnProperty('$$route')) {

            $rootScope.title = current.$$route.title;
        }
    });
}]);

/* might need that for further factory purpose
 myApp.run(function ($rootScope, $location, myFactory) {
 $http.get('/confirm-login')
 .success(function (user) {
 if (user && user.userId) {
 $rootScope.user = user;
 }
 });
 }

 */
							 