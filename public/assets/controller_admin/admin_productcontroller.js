//user single &  productListCtrl for multiple product controller where data come from database 


//productListCtrl productCtrl


SSApp.controller('productListCtrl', ['$scope', '$http', '$route', '$routeParams', '$location', function ($scope, $http, $route, $routeParams, $location) {
    var arr = [];
    //var tarry=['accessories','bag','beauty','gap','gifts','home','jeans','kids','men','overstock','pant','shirt','shoe','women'];
    var tarry = [];
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
    var tempdiscount = false;
    var temppercentoff = 0;

    $scope.states = tarry;
    $scope.countries = [];


    $scope.select_dept = "";
    // $scope.selected={"catalogId":"","productId":"","affiliate_url":"","image_url":"","keyword":"","keywords":null,"celebrity":[],"description":"","category":"","price":"","price_sale":"","percentOff":null,"currency":"","merchant":"","merchantId":"","brand":"","upc":"","isbn":"","sales":0};
    $scope.queryobj = {};
    $scope.selected = "";
    $scope.select_brand = "";
    $scope.select_merchant = "";
    $scope.select_designer = "";
    $scope.select_offers = false;
    $scope.select_oc_casual = false;  // occassion casual
    $scope.select_oc_vacation = false;  // occassion vacation
    $scope.select_oc_work = false; // occassion work
    $scope.select_oc_other = false; // occassion other
    $scope.gender = 0;
    //$scope.minprice = 0;
    // $scope.maxprice = 9999.00;
    $scope.select_color = [];
    $scope.total_record = 0;
    $scope.totalRecordsAvailable = 0;
    $scope.bigCurrentPage = 1;
    $scope.adminitemsperpage = 5;//
    $scope.limit = 5;
    $scope.maxSize = 5; //  Limit number for pagination size.


    $scope.urlextend = "";
    $scope.cost = {"range": [0.00, 9999.00]};
    $scope.percent = {"range": [0.00, 100.00]};
    $scope.extendedurl = "";
    $scope.sortorder = 1;
    $scope.viewall = 0; // initially view limited
    //$scope.fullpath= $location.host()+$location.path();
    $scope.fullpath = $location.absUrl();
    $scope.pathing = "Search";
    $scope.load_click = 0;
    $scope.showup = 0;
    $scope.user_offset = 3;
    $scope.itemsperpage = $scope.user_offset;//


    //$scope.percent.range[0] =0;
//$scope.percent.range[1]   =100;

    //initial


    function generateurl(pageNo) {

        var generated_url = "";
        $scope.load_click = 0;
        $scope.viewall = 0;
        if ($scope.showup == 1) {
            $scope.user_offset = 3;
            $scope.showup = 0;
            $scope.itemsperpage = $scope.user_offset;//

        }

        //if($scope.selected.keyword!="")
        //$scope.queryobj={"keyword":"","SScategory":"","gender":0,"brand":"","merchant":"","color":"","min_price":0.0,"max_price":9999.00,"min_off":0.0,"max_off":100.00 };
        $scope.queryobj = {};


        $scope.pathing = "Search";
        if ($scope.selected != "") {
            //generated_url = generated_url + "&query="+$scope.selected.keyword;
            $scope.queryobj.keyword = $scope.selected;
            // $scope.queryobj.keywords=$scope.selected;
        }

        if ($scope.select_dept != "") {
            generated_url = generated_url + "&filterCategory=" + $scope.select_dept;
            $scope.queryobj.SScategory = $scope.select_dept;

            if ($scope.pathing == "")
                $scope.pathing = $scope.select_dept;
            else
                $scope.pathing = $scope.pathing + ">" + $scope.select_dept;

        }

        //$scope.queryobj.gender=$scope.gender;


        if ($scope.select_merchant != "") {
            generated_url = generated_url + "&filterMerchant=" + $scope.select_merchant;
            $scope.queryobj.merchant = $scope.select_merchant;
            if ($scope.pathing == "")
                $scope.pathing = $scope.select_merchant;
            else
                $scope.pathing = $scope.pathing + ">" + $scope.select_merchant;
            ;


        }


        if ($scope.select_designer != "") {
            $scope.queryobj.designer = $scope.select_designer;
            if ($scope.pathing == "")
                $scope.pathing = $scope.select_designer;
            else
                $scope.pathing = $scope.pathing + ">" + $scope.select_designer;

        }

        if ($scope.select_brand != "") {
            generated_url = generated_url + "&filterBrand=" + $scope.select_brand;
            $scope.queryobj.brand = $scope.select_brand;

            if ($scope.pathing == "")
                $scope.pathing = $scope.select_brand;
            else
                $scope.pathing = $scope.pathing + ">" + $scope.select_brand;

        }

        if ($scope.select_premium == true)   // when true use it in query
        {

            $scope.queryobj.premium = $scope.select_premium;
        }

        if ($scope.select_color.length > 0) {
            $scope.queryobj.color = $scope.select_color;

        }

        if ($scope.cost.range[0] != 0.00 || $scope.cost.range[1] != 9999.00) {
            //generated_url = generated_url + "&filterPrice="+$scope.cost.range[0]+","+ $scope.cost.range[1];
            $scope.queryobj.min_price = $scope.cost.range[0];
            $scope.queryobj.max_price = $scope.cost.range[1];

        }

        if ($scope.percent.range[0] != 0.00 || $scope.percent.range[1] != 100.00) {
            generated_url = generated_url + "&filterPercentOff=" + "," + $scope.percent.range[1];

            $scope.queryobj.min_off = $scope.percent.range[0];
            $scope.queryobj.max_off = $scope.percent.range[1];

        }
        if ($scope.select_offers == true) {
            $scope.queryobj.sale_offer = $scope.select_offers; // shows only offers

        }
        else {
            $scope.queryobj.sale_offer = false; // shows all

        }

        if ($scope.select_oc_casual == true) {
            $scope.queryobj.occasion_casual = $scope.select_oc_casual;
        }
        if ($scope.select_oc_vacation == true) {
            $scope.queryobj.occasion_vacation = $scope.select_oc_vacation;
        }

        if ($scope.select_oc_work == true) {
            $scope.queryobj.occasion_work = $scope.select_oc_work;
        }
        if ($scope.select_oc_other == true) {

            $scope.queryobj.occasion_other = $scope.select_oc_other;
        }
        if ($scope.select_new_arrival == true) {
            $scope.queryobj.select_new_arrival = true;

        }
        // $scope.queryobj.offset= $scope.limit;

        $scope.queryobj.offset = $scope.user_offset;

        $scope.queryobj.sortorder = $scope.sortorder;


        $scope.bigCurrentPage = pageNo;

        $scope.queryobj.start = $scope.bigCurrentPage - 1;

        //generated_url = generated_url + "&limit="+ $scope.limit+"&page="+pageNo;
        // window.alert($scope.queryobj);


        //str = "query="+u+"&filterCategory="+$scope.select_dept+"&currentpage="+$scope.bigCurrentPage;

        $scope.extendedurl = generated_url;


        return generated_url;
    }


    //--------------------------------SEARCH-------------------------------------------
    function searchfilter(newurl) {
        //window.alert("request for new search"+newurl);

        var productlist = $http({
            method: 'GET',
            url: '/productslist/' + newurl
        });
        //--------------- search
        productlist.success(function (data) {


            countries = [];

            $scope.countries = [];

            $scope.countries = data;


            if ($scope.bigCurrentPage == 1) // suggestion generate only for new page
                generatesuggestion();

        }).error(function (data, status, headers, config) {
            window.alert("filter search request can not be proceeded");
        });

    }


////------------------MAIN SEARCH -------------------------------------
    // search list of the products from database
    function searchdatabaseProduct() {
        ///////////////////// MOST IMPORTANT SEARCH OPERATION AKSING NODE TO RETURN SEARCH RESULT

        $scope.queryobj.offset = $scope.user_offset; // limit
        window.alert("product search database");

        //if($scope.sortorder==1)
        // {
        $http.post('/productlistuser', $scope.queryobj)  //call to retrieve data
            .success(function (data) {


                countries = [];


                if ($scope.viewall != 1)    // view all true means already shown everything
                {
                    $scope.scroll_disabled = true;  // disabled the scroll for while

                    if ($scope.showup == 1)     // view all clicked so showup=1
                    {
                        $scope.productlist = [];

                        $scope.productlist = data.product;
                        $scope.totalRecordsAvailable = $scope.productlist.length;
                        $scope.user_offset = $scope.totalRecordsAvailable;
                        $scope.numPages = 1;

                        // $scope.bigCurrentPage= -2; // means there is nothing to concat
                        $scope.viewall = 1; //as there is nothing to show that means everything has been shown

                    }
                    else if ($scope.showup == 0)     //  view all not clicked
                    {

                        if ($scope.load_click == 1) // only load click concat if not first timer
                        {

                            var data_count = data.product.length;
                            if (data_count > 0) {

                                $scope.productlist = $scope.productlist.concat(data.product);  // concat data with old data
                                //  $scope.countries = data.product;
                                //  window.alert(data.product[0].keyword);
                                if (data_count < $scope.user_offset)  // returned data smaller than data offset means there are no more data available
                                {
                                    //$scope.bigCurrentPage= -2; // means there is nothing to concat
                                    $scope.viewall = 1; //as there is nothing to show that means everything has been shown

                                }
                                else {

                                    $scope.scroll_disabled = false; // more to go


                                }
                            }
                            else {

                                //$scope.bigCurrentPage= -2; // means there is nothing to concat
                                $scope.viewall = 1; //as there is nothing to show that means everything has been shown


                            }


                        } // load_click ==1 end

                        else // when partially showing for first time
                        {

                            $scope.productlist = [];
                            $scope.productlist = data.product;
                            var data_count = data.product.length;
                            //window.alert(data_count);


                            if (data_count < $scope.user_offset)  // returned data smaller than data offset means there are no more data available
                            {
                                //  $scope.bigCurrentPage= -2; // means there is nothing to concat
                                $scope.viewall = 1; //as there is nothing to show that means everything has been shown

                            }
                            else {

                                $scope.scroll_disabled = false; // more to go

                            }


                            $http.post('/productcount', $scope.queryobj).success(function (data) {
                                $scope.totalRecordsAvailable = data.count;   // calculate only first time                             //calculated on first time
                                $scope.numPages = Math.ceil(($scope.totalRecordsAvailable) / ($scope.user_offset));


                            }).error(function (err) {
                                window.alert("count error: " + err)
                            });


                            generatesuggestion();

                        }

                    }
                    //window.alert("enabled the load more again that means disabled false "+$scope.scroll_disabled);
                } // whether all viewed


                /*
                 if($scope.load_click==1 && $scope.viewall==0) // only load click concat if view_all true then no pint to load
                 {
                 if(data.length>0)
                 $scope.countries = $scope.countries.concat(data);  // concat data with old data
                 else
                 {

                 $scope.bigCurrentPage= -2; // means there is nothing to concat
                 $scope.viewall= 1; //as there is nothing to show that means everything has been shown
                 $scope.totalRecordsAvailable= $scope.countries.length;
                 }

                 }
                 else if($scope.viewall==1)          // when view all item then give fresh start
                 {
                 $scope.countries = [];
                 $scope.countries =data;
                 $scope.totalRecordsAvailable= $scope.countries.length;
                 }
                 else // when partially showing
                 {

                 $scope.countries = [];
                 $scope.countries =data;
                 // total record need to calculate separately
                 if($scope.bigCurrentPage==1)
                 {

                 $http.post('/productcount', $scope.queryobj ).success(function(count) {
                 $scope.totalRecordsAvailable= count.length;

                 })

                 }

                 }
                 */
                /* 12 oct 5 19

                 if($scope.load_click==1 && $scope.viewall==0) // only load click concat if view_all true then no point to load
                 {
                 if(data.product.length>0)
                 $scope.countries = $scope.countries.concat(data.product);  // concat data with old data
                 else
                 {

                 $scope.bigCurrentPage= -2; // means there is nothing to concat
                 $scope.viewall= 1; //as there is nothing to show that means everything has been shown
                 //  $scope.totalRecordsAvailable= $scope.countries.length;
                 }

                 }
                 else if($scope.viewall==1)          // when view all item then give fresh start
                 {
                 $scope.countries = [];
                 $scope.countries =data.product;
                 //   $scope.totalRecordsAvailable= $scope.countries.length;
                 }
                 else // when partially showing for first time
                 {

                 $scope.countries = [];
                 $scope.countries =data.product;
                 // total record need to calculate separately
                 if($scope.bigCurrentPage==1)
                 {

                 $http.post('/productcount', $scope.queryobj ).success(function(count) {
                 //$scope.totalRecordsAvailable= count.length;

                 })

                 }

                 }
                 $scope.totalRecordsAvailable=data.count;
                 */


                /*
                 $scope.numPages= Math.ceil(($scope.totalRecordsAvailable) /($scope.limit));
                 if($scope.bigCurrentPage==1) // suggestion generate only for new page
                 generatesuggestion();

                 */

            }).error(function (err) {
            window.alert("Product list can not generated: " + err);
        });

        /*
         $http.post('/distinctdesigners', $scope.queryobj )  //call to retrieve data
         .success(function(data) {


         }).error(function(err) {
         window.alert("Distinct Designer Error: " + err);
         });

         */
        //  }
        /* else
         {

         $http.post('/productlistuser2', $scope.queryobj )  //call to retrieve data
         .success(function(data) {

         countries=[];

         $scope.countries = [];

         $scope.countries = data;
         $scope.totalRecordsAvailable= data.length;
         $scope.numPages= Math.ceil(($scope.totalRecordsAvailable) /($scope.limit));
         if($scope.bigCurrentPage==1) // suggestion generate only for new page
         generatesuggestion();



         }).error(function(err) {
         window.alert("Query Error: " + err);
         });

         }
         */


    } // search database end

    //----------- generate url suggestion for
    function generatesuggestion() {
        var suggestion;


        if ($scope.extendedurl == "") {
            suggestion = $http({
                method: 'GET',
                url: '/suggestiondatabase'
            });
        }
        else {

            suggestion = $http({
                method: 'GET',
                url: '/suggestiondatabase/' + $scope.extendedurl
            });

        }

        suggestion.success(function (datax) {

            arr = [];
            var k;
            var t;
            var cobra = "";

            var length = Object.keys(datax).length;


            $scope.states = [];
            for (k = 0; k < length; k++) {
                $scope.states[k] = datax[k].keyword;
            }
            for (t = 0; t < tarry.length; t++) {
                $scope.states[k] = tarry[t];
                k = k + 1;

            }
        }).error(function (fata, status, headers, config) {
            window.alert("suggestion error " + fata + " status " + status + " headers " + headers + " config  " + config);
        });
    }


    /*old style*/
    $scope.searching = function () {
        $scope.load_click = 0;
        $scope.viewall = 0;
        $scope.showup = 0; // show up 0 means view only partial
        $scope.scroll_disabled = false; // more to go

        var newurl = generateurl(1);
        searchdatabaseProduct();

    }; //end of searching function

    $scope.searchusingfilter = function () {
        var newurl = generateurl(1);
        //searchfilter(newurl);
        searchdatabaseProduct();

    }


    $scope.load_more = function () {
        //window.alert($scope.viewall);
        if ($scope.viewall == 0) // already not showing everything
        {
            $scope.load_click = 1;

            $scope.bigCurrentPage = $scope.bigCurrentPage + 1;
            $scope.queryobj.start = $scope.bigCurrentPage - 1;
            searchdatabaseProduct();


        }

    }


    //changing department
    $scope.update_suggestion = function () {


        var newurl = generateurl(1);
        //searchfilter(newurl);
        searchdatabaseProduct();

    }
    //clicking to set price
    $scope.setPrice = function (min, max) {

        $scope.cost.range[0] = min;
        $scope.cost.range[1] = max;
        var newurl = generateurl(1);
        searchdatabaseProduct();


    }
    $scope.setMinDiscount = function (min) {
        $scope.percent.range[0] = min;
        var newurl = generateurl(1);
        searchdatabaseProduct();
    }
    $scope.gender_change = function () {
        var newurl = generateurl(1);
        // searchfilter(newurl);
        searchdatabaseProduct();

    }
    $scope.brand_change = function () {
        var newurl = generateurl(1);
        // searchfilter(newurl);
        searchdatabaseProduct();

    }
    $scope.designer_change = function () {


        var newurl = generateurl(1);
        searchdatabaseProduct();

    }
    $scope.merchant_change = function () {
        var newurl = generateurl(1);
        // searchfilter(newurl);
        searchdatabaseProduct();
    }


    $scope.premium_designer_change = function () {
        var newurl = generateurl(1);
        searchdatabaseProduct();

    }

    $scope.occasion_casual_change = function (temp) {

        var newurl = generateurl(1);
        searchdatabaseProduct();

    }
    $scope.occasion_vacation_change = function (temp) {

        var newurl = generateurl(1);
        searchdatabaseProduct();

    }

    $scope.occasion_work_change = function (temp) {

        var newurl = generateurl(1);
        searchdatabaseProduct();
    }
    $scope.occasion_other_change = function (temp) {

        var newurl = generateurl(1);
        searchdatabaseProduct();
    }

    $scope.new_arrival = function () {
        var newurl = generateurl(1);
        searchdatabaseProduct();

    }

    $scope.promotion_change = function () {

        var newurl = generateurl(1);
        searchdatabaseProduct();

    }


//------------------- Product view all-----------------------------
    $scope.showall = function () {
        $scope.itemsperpage = 0;
        $scope.numPages = 1;
        $scope.bigCurrentPage = 1;
        $scope.queryobj.start = -1;
        $scope.viewall = 0;
        $scope.showup = 1;       // showup representing somebody click on show all button

        searchdatabaseProduct();

    }
    $scope.showallSearch = function () {
        $scope.itemsperpage = 0;
        $scope.numPages = 1;
        $scope.bigCurrentPage = 1;
        $scope.queryobj.start = -1;
        $scope.viewall = 0;
        $scope.showup = 1;
        searchdatabaseProduct();

    }
    $scope.deleteProduct = function (id) {


        $http.delete('/product_delete/' + id)
            .success(function (data) {
                searchdatabaseProduct();


            })
            .error(function (data) {
                console.log('Error: ' + data);
            });


    };


    $scope.pageChanged = function () {


        var newurl = generateurl($scope.bigCurrentPage);
        // searchfilter(newurl);
        searchdatabaseProduct();
    }; //page change function end


    //$scope.numPages= $scope.totalRecordsAvailable/120;

    $scope.priceFilter = function (pro) {

        if (pro.price_sale == "") {
            return pro.price >= $scope.cost.range[0] && pro.price <= $scope.cost.range[1];

        }
        else {
            return pro.price_sale >= $scope.cost.range[0] && pro.price_sale <= $scope.cost.range[1];

        }

    }


    $scope.percentFilter = function (pro) {

        return pro.percentOff >= $scope.percent.range[0] && pro.percentOff <= $scope.percent.range[1];

    }


    $scope.setColor = function (Bigcolor) {

        var color = angular.lowercase(Bigcolor);

        $scope.select_color.push(color);

        var newurl = generateurl(1);
        searchdatabaseProduct();
    }

    // $scope.setColor2 = function(){
    // var newurl= generateurl(1);
    // // searchfilter(newurl);
    // searchdatabaseProduct();
    // }
    $scope.update_sort_order = function () {
        var newurl = generateurl(1);
        searchdatabaseProduct();

    }
    $scope.clearFilter = function () {


        $scope.queryobj = {};
        $scope.selected = "";

        $scope.select_dept = "";
        $scope.select_brand = "";
        $scope.select_merchant = "";
        $scope.select_color = [];
        $scope.select_designer = ""
        $scope.select_offers = false;
        $scope.select_oc_casual = false;  // occassion casual
        $scope.select_oc_vacation = false;  // occassion vacation
        $scope.select_oc_work = false; // occassion work
        $scope.select_new_arrival = false; // new arrival checkbox

        $scope.cost = {
            range: [0.00, 9999.00]
        };

        $scope.percent = {

            range: [0.00, 100.00]

        };


        $scope.bigCurrentPage = 1;
        var newurl = generateurl($scope.bigCurrentPage);
        searchdatabaseProduct();
    };


    $scope.setPage = function (pageNo) {
        // $scope.currentPage = pageNo;
        $scope.bigCurrentPage = pageNo;

    };


    var urlinitial = generateurl(1);
    searchdatabaseProduct();


    //generatesuggestion();
}]);


//////////////////////////////////////////////////////////////////////////////////////////////////////
SSApp.controller('productCtrl', ['$scope', '$http', '$route', '$routeParams', '$rootScope', function ($scope, $http, $route, $routeParams, $rootScope) {


    $scope.twotapCheckout = function (x) {

        var checkoutRequest = {};
        //checkoutRequest['products'] = [ {  url: 'http://www.bewild.com/glindafa.html' } ];
        checkoutRequest['products'] = [{'url': x, 'quantity': 2}, {
            'url': 'http://www.bewild.com/glindafa.html',
            'quantity': 12
        }];

        checkoutRequest['public_token'] = '56842635c4b9b3fa82b222e29f24e8';
        checkoutRequest['custom_css_url'] = '';
        //checkoutRequest['confirm'] = { method: 'sms', sms_confirm_url: '<%- smsConfirmURL %>' }
        checkoutRequest['confirm'] = {
            method: 'http',
            http_confirm_url: 'http://45.55.138.4/confirm',
            http_finished_url: 'http://45.55.138.4/finish'
        };
        checkoutRequest['unique_token'] = (Math.floor(Math.random() * 9999999) + 1).toString();
        // checkoutRequest['test_mode'] = 'dummy_data';
        checkoutRequest['test_mode'] = 'fake_confirm';
        jQuery.post('https://checkout.twotap.com/prepare_checkout', {checkout_request: checkoutRequest}, function (data) {
            console.log(data);
            // This will return a hash like:
            // {
            //   "message":"done",
            //   "checkout_request_id":"7E9N560S85THFDMlt85UBgWVZqCSfv",
            //   "url":"https://checkout.twotap.com/?checkout_request_id=7E9N560S85THFDMlt85UBgWVZqCSfv"
            // }

            // Point an iFrame to that URL.
            $('#ttIframe').attr('src', data['url']);
            $scope.links = data.url;

        });
    }
    $scope.CatId = $routeParams.CatalogId; // retrieve  catalog id
    $scope.twotap_public_token = '56842635c4b9b3fa82b222e29f24e8';
    $scope.select_color = "";
    $scope.coloravnum = 0;
    var indexcol;
    $scope.setColor = function (Bigcolor) {
        $scope.coloravnum = $scope.coloravnum + 1;
        indexcol = $scope.coloravnum;

        var color = angular.lowercase(Bigcolor);
        $scope.product.color = color;

    }
    $scope.setSSCategory = function (cat) {

        $scope.product.SS_category = cat;

    }


    function productfetch() {
        $http.get('/productsingleuser/' + $scope.CatId).success(function (data) {
            // define product
            $scope.retrievebrand = data.brand;

            //$scope.product = data.data;
            // $scope.creation= data[0]._id.getTimestamp();
            //window.alert($scope.creation);
            $scope.product = {
                _id: data[0]._id,
                catalogId: data[0].catalogId,
                productId: data[0].productId,
                keyword: data[0].keyword,
                keywords: data[0].keywords,
                brand: data[0].brand,
                category: data[0].category,
                SS_category: data[0].SScategory,
                designer: data[0].designer,  //**********
                price: data[0].price,
                percentOff: data[0].percentOff,
                sale_offer: data[0].sale_offer, //****** sale 0ffer
                price_sale: data[0].price_sale,
                currency: data[0].currency,
                merchant: data[0].merchant,
                gender: data[0].gender,
                image_url: data[0].image_url,
                url: data[0].product_url,
                affiliate_url: data[0].affiliate_url,
                merchantId: data[0].merchantId,
                color: data[0].color,
                color_code: data[0].color_code,
                availability: data[0].availability,
                prosper_availability: data[0].prosper_availability,
                sales: data[0].sales,
                description: data[0].description,
                created_at: data[0].created_at,
                updated_at: data[0].updated_at

            }


            //		  $scope.title=data[0].keyword+" "+data[0].SScategory;
            $rootScope.title = data[0].keyword + " " + data[0].SScategory;

            $rootScope.metax = data[0].keyword + "," + data[0].SScategory + "," + data[0].designer;

            $rootScope.metaxdescription = data[0].keyword + " " + data[0].SScategory + " " + data[0].description;


            var cata = "";
            if (data[0].SScategory == "") {
                cata = "All";
            }
            else {
                cata = data[0].SScategory;
            }

            $scope.pathing = cata + ">" + data[0].merchant + ">" + data[0].keyword;
            $scope.SmartPathing = $scope.SmartPathing + " > " + data[0].keyword;


            //       var u_timestamp = Math.floor(timeInMs / 1000); // getting unix time stamp
            //		window.alert("hey"+u_timestamp);

            var ts_milisecond = (data[0].created_at) * 1000; // cause unix time stamp is in second
            //window.alert(ts_milisecond);
            var d = new Date();
            d.setTime(ts_milisecond);
            $scope.create_date = d;


            var up_ts_milisecond = (data[0].updated_at) * 1000; // cause unix time stamp is in second
            //window.alert(up_ts_milisecond);
            var up_date = new Date();
            up_date.setTime(up_ts_milisecond);
            $scope.update_date = up_date;

            /*  rate: Number,
             premium:Boolean,
             occasion:String,
             created_at: Date,
             updated_at: Date
             */

            //within successful call i will call for what is product url so i do not need to wait
            var timeInMs;
            if (!Date.now) {
                timeInMs = function now() {
                    return new Date().getTime();
                };
            }
            else {
                timeInMs = Date.now();
            }
            timeInMs = timeInMs;
            $scope.uniqueID = timeInMs + "" + $scope.product._id;

        });
        prosperent_check(); // check after fetch


    }

    // $scope.customer.cart={};

    productfetch();


    // ///////////////////////////following for admin //////////////////////////////////////////////////


    function prosperent_check() {
        $http.get('/catalogapi/' + $scope.CatId).success(function (available) {
        }).error(function (err) {
            window.alert("Product color Error: " + err);
        });

    }

    $scope.updateproduct = function () {
        //window.alert($scope.product.SS_category);
        $http.post('/product_update', $scope.product)
            .success(function (data) {

                window.alert("successfully updated");
                productfetch();

            })
            .error(function (data) {
                window.alert("Error: " + data);
            });

    }

    $scope.del_product = function () {


        $http.delete('/product_delete/' + $scope.product._id)
            .success(function (data) {
                window.alert("deleted");
                productfetch();
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });


    }


}]);