//Admin product list from api
// /product_apisearch/
//////////////////////////////////////////// API  RELATED CONTROLLERS////////////////////////////////////////////////////////////////////////////////				
/////////////////////////// a. API PRODUCT CONTROLLERS(Search by product ID)/////////////////////////////////////////

SSApp.controller('APIproductCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    $scope.title = "SS Product page";
    $scope.ProductId = $routeParams.ProductId; // retrieve  catalog id


    $scope.twotap_public_token = '56842635c4b9b3fa82b222e29f24e8';
    $scope.select_color = "";
    $scope.coloravnum = 0;
    var tempData;
    var indexcol;
    var timeInMs;
    $scope.setColor = function (color) {
        $scope.coloravnum = $scope.coloravnum + 1;
        indexcol = $scope.coloravnum;
        $scope.product.color = color;

    }


    $scope.setSSCategory = function (cat) {

        $scope.product.SS_category = cat;

    }

    $scope.brand_change = function (brand) {
        $scope.product.brand = brand;
    }

    $scope.merchant_change = function (merchant) {
        $scope.product.merchant = merchant;
    }
    // request to show catalog item
    var arrlength = 0;


    $http.get('/product/' + $scope.ProductId).success(function (datax) {

        tempData = datax.data;

        var count = 0;

        // var affurl=[];
        //var arrlength = k.length;   //jason array length
        //var arrlength  = 2;
        arrlength = datax.totalRecordsFound;
        $scope.product = tempData;                            //assign jason array data to product

        if (!Date.now) {
            timeInMs = function now() {
                return new Date().getTime();
            };
        }
        else {
            timeInMs = Date.now();

        }

        $scope.uniqueID = timeInMs;


        //////////////////------------------find out product availability and set it ----------------------------
        // step 1 find out product original url base on affiliated url


        var temp;
        var affurl;
        //arrlength=1;
        for (count = 0; count < arrlength; count++) {
            $scope.currentCounter = count; // it is required otherwise count cant be passed to next request

            $scope.product[count].prosper_availability = true; //  if i get a product in prosper that means its prosper available
            // need temp as a jason data which is affiliated link
            $scope.product[count].url = '';
            temp = $scope.product[count].affiliate_url;
            $scope.product[count].checkbx = false;

            affurl = {affiliate_url: temp};

            // #work close as giving error
            $http.post('/productoriginalurl', affurl)
                .success(function (urldata) {
                    var j_counter = $scope.currentCounter;
                    $scope.product[j_counter].url = urldata;
                    var realurl = {realurl: $scope.product[j_counter].url}


                    $http.post('/productavailability', realurl).success(function (availdata) {

                        var a_counter = $scope.currentCounter;

                        $scope.product[a_counter].availability = availdata;
                    })
                    window.alert(urldata);
                }).error(function (err) {
                window.alert("Checkout URL for " + count + " index  can not be generated. Try manually : " + err);
            });
        }


    });


    /*saving multiple products*/
    $scope.saveMultiProducts = function (j) {

        //  $http.post('/product_save_product', $scope.product)
        var k = 0;
        product_save(arrlength, 0, j);

        // following save selected products
        // if(j==2)
        // {
        // for(k=0;k<arrlength;k++)
        // {


        // if( $scope.product[k].checkbx==true) // save only if it is true
        // {
        // $http.post('/product_save', $scope.product[k])
        // .success(function(data) {

        // window.alert(k+"stored");
        // })
        // .error(function(data) {
        // window.alert("Error: " + data);
        // });

        // }


        // }
        // }


        // for(k=0;k<arrlength;k++)
        // {


        // //  $http.get('/product_save', $scope.product[k]).then(successCallback, errorCallback);

        // if( $scope.product[k].checkbx==true) // save only if it is true
        // {
        // $http.post('/product_save', $scope.product[k])
        // .success(function(data) {

        // window.alert(k+"stored");
        // })
        // .error(function(data) {
        // window.alert("Error: " + data);
        // });

        // }


        // }
        // }

        // else if(j==1) //save all products
        // {
        // for(k=0;k<arrlength;k++)
        // {

        // $http.post('/product_save', $scope.product[k])
        // .success(function(data) {

        // window.alert(k+"stored");
        // })
        // .error(function(data) {
        // window.alert("Error: " + data);
        // });

        // }
        // }


        /*


         for(k=0;k<arrlength;k++)
         {
         $http.post('/product_save', $scope.product[k])
         .success(function(data) {

         window.alert("successfully data stored in system");
         })
         .error(function(data) {
         window.alert("Error: " + data);
         });
         }

         */

    }

    function product_save(length, count, j) {

        if (length <= count)
            window.alert("finished saving");

        else {

            if (j == 2)                                 // 2 means save selected products
            {
                if ($scope.product[count].checkbx == true) // save only if it is true
                {

                    $http.post('/product_save_multiple', $scope.product[count])
                        .then(function successCallback(data) {
                            count = count + 1;
                            product_save(length, count, j);
                            // this callback will be called asynchronously
                            // when the response is available
                        }, function errorCallback(data) {

                            count = count + 1;
                            product_save(length, count, j);

                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                        });


                }
                else  // uncehcked ignored moved to next one
                {

                    count = count + 1;
                    product_save(length, count, j);

                }


            }
            else if (j == 1)                            // 1 means save all products
            {

                // used recursion to save products
                $http.post('/product_save_multiple', $scope.product[count])
                    .then(function successCallback(data) {
                        count = count + 1;
                        product_save(length, count, j);
                        // this callback will be called asynchronously
                        // when the response is available
                    }, function errorCallback(data) {

                        count = count + 1;
                        product_save(length, count, j);

                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });

            }


        }

    }


}]);
//////////////////// b. API catalog controller = Search By catalog ID ////////////////////
SSApp.controller('APIcatalogCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    $scope.CatId = $routeParams.CatalogId; // retrieve  catalog id
    $scope.twotap_public_token = '56842635c4b9b3fa82b222e29f24e8';
    $scope.select_color = "";
    $scope.select_premium = false;      // premium designer
    $scope.select_oc_casual = false;  // occassion casual
    $scope.select_oc_vacation = false;  // occassion vacation
    $scope.select_oc_work = false; // occassion work
    $scope.select_oc_other = false; // occassion other
    $scope.coloravnum = 0;

    var indexcol;

    $scope.setColor = function (Bigcolor) {
        $scope.coloravnum = $scope.coloravnum + 1;
        indexcol = $scope.coloravnum;

        var tcolor = angular.lowercase(Bigcolor);

        $scope.product.color = tcolor;

    }


    $scope.setSSCategory = function (cat) {

        $scope.product.SS_category = cat;

    }

    $scope.brand_change = function (brand) {
        $scope.product.brand = brand;
    }

    $scope.merchant_change = function (merchant) {

        $scope.product.merchant = merchant;
    }

    $scope.premium_designer_change = function (premium_boolean) {

        $scope.product.premium = $scope.select_premium;

    }

    $scope.occasion_casual_change = function (temp) {

        $scope.product.occasion_casual = $scope.select_oc_casual;

    }
    $scope.occasion_vacation_change = function (temp) {

        $scope.product.occasion_vacation = $scope.select_oc_vacation;

    }

    $scope.occasion_work_change = function (temp) {

        $scope.product.occasion_work = $scope.select_oc_work;

    }
    $scope.occasion_other_change = function (temp) {

        $scope.product.occasion_other = $scope.select_oc_other;

    }


    // request to show catalog item

    $http.get('/catalogapi/' + $scope.CatId).success(function (data) {
        // define product
        $scope.retrievebrand = data.brand;
        var timeInMs;
        if (!Date.now) {
            timeInMs = function now() {
                return new Date().getTime();
            };
        }
        else {
            timeInMs = Date.now();

        }

        var u_timestamp = Math.floor(timeInMs / 1000); // getting unix time stamp
        //window.alert("hey"+u_timestamp);

        var ts_milisecond = u_timestamp * 1000; // cause unix time stamp is in second
        //window.alert(ts_milisecond);
        var d = new Date();
        d.setTime(ts_milisecond);
        //window.alert(d);

        //var gdate = new Date(ts);

        //window.alert(gdate);

        /**/

        //var timeStamp = Math.floor(Date.now() / 1000);

        //window.alert(timestamp);


        /*
         var today = new Date();
         //window.alert(today);
         var day = today.getDate();
         var month = today.getMonth();
         var year = today.getFullYear();
         var h = today.getHours();
         var m = today.getMinutes();
         var s = today.getSeconds();
         window.alert(day+"-"+month+"-"+year);
         */
        var sale_offer = false;
        if (data.price_sale > 0 || data.percentOff > 0) {
            sale_offer = true;

        }

        $scope.product = {
            catalogId: data.catalogId,
            productId: data.productId,
            image_url: data.image_url,

            keyword: data.keyword,
            keywords: data.keywords,
            gender: 0,
            category: data.category,
            SS_category: "",
            itemname: "",
            merchant: data.merchant,
            merchantId: data.merchantId,
            designer: "",
            rate: "",
            brand: data.brand,
            price: data.price,
            price_sale: data.price_sale,
            percentOff: data.percentOff,
            sale_offer: sale_offer,
            //affiliate_url: data.affiliate_url,
            affiliate_url: data.twoTapAffiliateLink,
            url: data.twoTapProductUrl,
            color: "",
            colorcode: "",
            size: "",
            description: data.description,
            sales: data.sales,
            currency: data.currency,
            upc: data.upc,
            isbn: data.isbn,
            premium: $scope.select_premium,
            occasion_casual: false,
            occasion_vacation: false,
            occasion_work: false,
            occasion_other: false,
            insert_date: u_timestamp,
            update_date: ""


        }

        console.log(data.category);


        //within successful call i will call for what is product url so i do not need to wait
        timeInMs = timeInMs;
        $scope.uniqueID = timeInMs;

        //****find out original url from affiliated url  ****//

        // ajax call to get color from product image
        //define image url
        var affurl = {affiliate_url: data.affiliate_url}
        // $http.post('/productoriginalurl',affurl )
        // .success(function(urldata) {
        // $scope.product.url=urldata;
        // var pro_realurl = { realurl : $scope.product.url }

        // // product availability return whether product available or not

        // $http.post('/productavailability',pro_realurl).success(function(data)
        // {
        // $scope.product.availability = data;
        // }).error(function(availerr)
        // {
        // window.alert("availability err " + availerr);
        // });

        // }).error(function(err)
        // {
        // window.alert("Product URL can not generated: " + err);
        // });
        $scope.product.availability = true;

        var imgurl = {image_url: data.image_url}
        $http.post('/productcolor', imgurl)
            .success(function (Bigcolor) {

                var color = angular.lowercase(Bigcolor);
                $scope.product.colorcode = color; // hex color
                $scope.select_color = color;
                var colorcode = {col_name: color}
                $http.post('/productcolorname', colorcode).success(function (cname) {
                    $scope.product.color = cname; // set color name

                }).error(function (err) {
                    window.alert("color code 2 color name Error: " + err);
                });


            }).error(function (err) {
            window.alert("Product color Error: " + err);
        });


        // product original url return url of the product fron prosperent url


        // MAPPING CLOSED
        // var s = data.category;

        // if(s.indexOf("shoe") > -1)
        // {
        // $scope.product.SS_category ="shoes";
        // $scope.product.itemname="shoes";

        // }
        // else if(s.indexOf("jewelry") > -1)
        // {
        // $scope.product.SS_category ="beauty";
        // $scope.product.itemname="jewelry";

        // }
        // else if(s.indexOf("women") > -1)
        // {
        // $scope.product.SS_category ="women";
        // }
        // else if(s.indexOf("men") > -1)
        // {
        // $scope.product.SS_category ="men";
        // }

        // else if(s.indexOf("accessories") > -1)
        // {
        // $scope.product.SS_category ="accessories";
        // }
        // else if(s.indexOf("home") > -1)
        // {
        // $scope.product.SS_category ="home";
        // }

        // else if(s.indexOf("beauty") > -1)
        // {
        // $scope.product.SS_category ="beauty";
        // }

        // else if(s.indexOf("health") > -1)
        // {
        // $scope.product.SS_category ="beauty";

        // }
        // else if(s.indexOf("kid") > -1)
        // {
        // $scope.product.SS_category ="kids";


        // }
        // else if(s.indexOf("baby") > -1)
        // {
        // $scope.product.SS_category ="kids";
        // }
        // else if(s.indexOf("toddler") > -1)
        // {

        // $scope.product.SS_category ="kids";


        // }
        // else if(s.indexOf("girl") > -1)
        // {
        // $scope.product.SS_category ="women";
        // }
        // else if(s.indexOf("boy") > -1)
        // {
        // $scope.product.SS_category ="men";
        // }


        // $scope.product.SS_category="women";


    });// catalog wise product call end

///////////////////////////////////////PRODUCT SAVING ///////////////////////////////////////////////////////////////////////////////////////////////////	
    $scope.saveproducts = function () {
        $http.post('/product_save', $scope.product)
            .success(function (data) {

                window.alert("successfully data stored in system");
            })
            .error(function (data) {
                window.alert("Error: " + data);
            });

    }

}]);


//////////////////// b. API catalog controller = Search By catalog ID ////////////////////
SSApp.controller('searchcontroller', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
//angular.module('SSApp').controller('searchcontroller', function($scope, $http) {

    var arr = [];
    var tarry = ['accessories', 'bag', 'beauty', 'gap', 'gifts', 'home', 'jeans', 'kids', 'men', 'overstock', 'pant', 'shirt', 'shoe', 'women'];
    //  var countries = [];
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

    $scope.suggestions = tarry; // holding suggestions for current filter
    $scope.products = [];
    $scope.select_dept = "";

    $scope.selected = "";
    $scope.select_brand = "";
    $scope.select_merchant = "";
    //$scope.minprice = 0;
    // $scope.maxprice = 9999.00;
    $scope.select_color = "";

    $scope.selected_sorting = "price";
    //$scope.sortorder="+asc";
    $scope.sortorder = " desc";

    $scope.selected_groupby = "productId";
    $scope.total_record = 0;
    $scope.totalRecordsAvailable = 0;
    $scope.CurrentPage = 1;
    $scope.maxSize = 5; // per page pagination item
    $scope.urlextend = "";


    $scope.cost = {"range": [0.00, 1000000.00]};
    $scope.percent = {"range": [0.00, 100.00]};
    $scope.extendedurl = "";
    $scope.limit = 10;

    $scope.itemColors = [{
        colorName: 'yellow'
    }, {
        colorName: 'gold'
    }, {
        colorName: 'orange'
    }, {
        colorName: 'brown'
    }, {
        colorName: 'red'
    }, {
        colorName: 'pink'
    }, {
        colorName: 'violet'
    }, {
        colorName: 'fuchsia'
    }, {
        colorName: 'magenta'
    }, {
        colorName: 'purple'
    }, {
        colorName: 'cyan'
    }, {
        colorName: 'turquoise'
    }, {
        colorName: 'teal'
    }, {
        colorName: 'green'
    }, {
        colorName: 'blue'
    }, {
        colorName: 'white'
    }, {
        colorName: 'beige'
    }, {
        colorName: 'tan'
    }, {
        colorName: 'gray'
    }, {
        colorName: 'indigo'
    }, {
        colorName: 'black'
    }

    ];

    //----------------------- generate url for search-----------------------
    function generateurl(pageNo) {

        var generated_url = "";
        var search_operation = 0;
        var group = "";

        // selected is query string
        if ($scope.selected != "") {
            generated_url = generated_url + "&query=" + $scope.selected;
            search_operation = 1;
            // if($scope.select_color!="")
            // {
            // generated_url = generated_url + " "+$scope.select_color;

            // }

        }
        // else if($scope.select_color!="")
        // {
        // generated_url = generated_url + "&query="+$scope.select_color;
        // search_operation=1;
        // }

        // dept is category
        if ($scope.select_color != "") {
            generated_url = generated_url + "&filterKeyword=" + $scope.select_color;

        }


        if ($scope.select_dept != "") {
            generated_url = generated_url + "&filterCategory=" + $scope.select_dept;
        }

        if ($scope.select_brand != "") {
            generated_url = generated_url + "&filterBrand=" + $scope.select_brand;
        }

        if ($scope.select_merchant != "") {
            generated_url = generated_url + "&filterMerchant=" + $scope.select_merchant;
        }


        // use cost range for filter
        if ($scope.cost.range[0] != 0.00 && $scope.cost.range[1] != 1000000.00) {
            generated_url = generated_url + "&filterPrice=" + $scope.cost.range[0] + "," + $scope.cost.range[1];
        }

        else if ($scope.cost.range[0] != 0.00)    // lower limit changed
        {
            generated_url = generated_url + "&filterPrice=" + $scope.cost.range[0] + ",";

        }

        else if ($scope.cost.range[1] != 1000000.00) // upper limit changed
        {
            generated_url = generated_url + "&filterPrice=," + $scope.cost.range[1];

        }


        //percent wise filter
        if ($scope.percent.range[0] != 0.00 && $scope.percent.range[1] != 100.00) {
            generated_url = generated_url + "&filterPercentOff=" + $scope.percent.range[0] + "," + $scope.percent.range[1];
        }
        else if ($scope.percent.range[0] != 0.00)
            generated_url = generated_url + "&filterPercentOff=" + $scope.percent.range[0] + ",";
        else if ($scope.percent.range[1] != 100.00) // upper limit changed
        {
            generated_url = generated_url + "&filterPercentOff=," + $scope.percent.range[1];

        }

        // check is there any sale offer running
        if ($scope.saleOffer) {
            generated_url = generated_url + "&filterPriceSale=0.5,";

        }


        if ($scope.selected_groupby != "") {

            group = "&groupBy=" + $scope.selected_groupby;
        }

        generated_url = "filterTwoTapSupported=1"+generated_url;

        var temp_url = generated_url;

        //  when searching with keyword / query enable facets
        if (search_operation == 1) {
            generated_url = generated_url + "&enableFacets=true&limit=" + $scope.limit + "&page=" + pageNo + group + "&sortBy=" + $scope.selected_sorting + $scope.sortorder;
            $scope.extendedurl = temp_url + "&limit=1000&page=1&groupBy=productId";


        }
        else {
            generated_url = generated_url + "&limit=" + $scope.limit + "&page=" + pageNo + group + "&sortBy=" + $scope.selected_sorting + $scope.sortorder;
            $scope.extendedurl = temp_url + "&limit=1000&page=1&groupBy=productId";


        }


        //str = "query="+u+"&filterCategory="+$scope.select_dept+"&currentpage="+$scope.CurrentPage;

        $scope.CurrentPage = pageNo;
        // should use cache
        return generated_url;
    }

    //--------------------------------SEARCH-------------------------------------------
    function searchfilter(newurl) {

        //below ajax call to see products using new generated url
        // var productlist = $http({
            // method: 'GET',
            // url: '/product_apisearch/' + newurl
        // });
        // //--------------- search
        // productlist.success(function (data) {
        var link = {'path': newurl};
		
        $http.post('/product_apisearch', link).success(function (data) {
		// countries=[];
            //  window.alert(data.totalRecords);
            //   $scope.totalRecordsAvailable=data.totalRecordsAvailable;
            //  $scope.total_record = data.totalRecords;
            // $scope.numPages= Math.ceil(($scope.totalRecordsAvailable) /($scope.limit));

            $scope.products = [];
            $scope.products = data.data;
            window.alert("search operation finished!");

            if ($scope.CurrentPage == 1) // suggestion generate only for new page
                generatesuggestion();

        }).error(function (e, status, headers, config) {

            $scope.products = [];
            $scope.numPages = 1;
            $scope.total_record = 0;
            $scope.totalRecordsAvailable = 0;

            window.alert("filter search request can not be proceeded" + e);
        });

    }

    //----------- generate suggestion for

    function generatesuggestion() {

        $scope.suggestions = [];

        var suggestion = $http({
            method: 'GET',
            url: '/suggestion/' + $scope.extendedurl
        });

        suggestion.success(function (fata) {

            arr = [];                    // if success then clear past

            var recordsavailable = fata.totalRecordsAvailable;
            var recordtotal = fata.totalRecords;
            var k = 0;
            var t;
            var cobra = "";
            $scope.totalRecordsAvailable = recordsavailable;
            $scope.total_record = recordtotal;
            $scope.numPages = Math.ceil(($scope.totalRecordsAvailable) / ($scope.limit));

            console.log(fata);

            for (k = 0; k < recordsavailable; k++) {
                $scope.suggestions[k] = fata.data[k].keyword;
                console.log(fata.data[k].keyword);

            }
            for (t = 0; t < tarry.length; t++)  // some fixed key words
            {
                $scope.suggestions[k] = tarry[t];
                k = k + 1;

            }

        }).error(function (e, status, headers, config) {
            window.alert("sorry suggestion cant be generated" + e);
        });

    }

    // ------------generate all merchant list
    function generateAllMerchants() {

        var merchantList = $http({
            method: 'GET',
            url: '/merchants_apisearch'
        });
        merchantList.success(function (merchantdata) {
            $scope.retailerList = merchantdata;
        })


    }

    // initial load
    var firsturl = generateurl(1);
    searchfilter(firsturl);   
    // generateAllMerchants();
    $scope.numPages = $scope.totalRecordsAvailable / $scope.limit;

// ----------- Searching-----------------------
    /*on submit function*/
    $scope.searching = function () {
        window.alert("search begin!");
        var newurl = generateurl(1);
        searchfilter(newurl);

    }; //end of searching function

    $scope.searchusingfilter = function () {
        window.alert("search begin!");
        var newurl = generateurl(1);
        searchfilter(newurl);

    }

    //changing categories
    $scope.update_suggestion = function () {
        var newurl = generateurl(1);
        searchfilter(newurl);
    }

    $scope.update_sorting = function () {
        var newurl = generateurl(1);
        searchfilter(newurl);

    }
    // change the sort order of returned data

    $scope.update_sort_order = function () {
        var newurl = generateurl(1);
        searchfilter(newurl);
    }
    $scope.update_groupby = function () {
        var newurl = generateurl(1);
        searchfilter(newurl);

    }
    $scope.setPrice = function (min, max) {
        $scope.cost.range[0] = min;
        $scope.cost.range[1] = max;
        var newurl = generateurl(1);
        searchfilter(newurl);
    }
    $scope.setMinDiscount = function (min) {

        $scope.percent = {"range": []};
        $scope.percent.range[0] = min;
        $scope.percent.range[1] = 100.00;
        var newurl = generateurl(1);
        searchfilter(newurl);
    }
    // sale promotion true or not
    $scope.setIsDiscount = function (saletrue) {

        if (saletrue) {
            $scope.selected_sorting = "price_sale";
            $scope.sortorder = " desc";


        }
        else {
            $scope.selected_sorting = "relevance";
            $scope.sortorder = " asc";

        }

        var newurl = generateurl(1);
        searchfilter(newurl);
    }


    $scope.brand_change = function () {
        var newurl = generateurl(1);
        searchfilter(newurl);
    }
    $scope.merchant_change = function () {
        var newurl = generateurl(1);
        searchfilter(newurl);
    }

//------------------- page change event-----------------------------
    $scope.pageChanged = function () {

        var newurl = generateurl($scope.CurrentPage);
        searchfilter(newurl);
    }; //page change function end

    // api price filter
    $scope.priceFilter = function (pro) {
        if (pro.price_sale == "") {
            return pro.price >= $scope.cost.range[0] && pro.price <= $scope.cost.range[1];
        }
        else {
            return pro.price_sale >= $scope.cost.range[0] && pro.price_sale <= $scope.cost.range[1];
        }
    }

    // api percent filter
    $scope.percentFilter = function (pro) {
        return pro.percentOff >= $scope.percent.range[0] && pro.percentOff <= $scope.percent.range[1];
    }

    $scope.setColor = function (color) {
        $scope.select_color = "*" + color + "*";
        var newurl = generateurl(1);
        searchfilter(newurl);
    }

    $scope.clearFilter = function () {
        // $scope.selected={"catalogId":"","productId":"","affiliate_url":"","image_url":"","keyword":"","keywords":null,"celebrity":[],"description":"","category":"","price":"","price_sale":"","percentOff":null,"currency":"","merchant":"","merchantId":"","brand":"","upc":"","isbn":"","sales":0};
        $scope.selected = "";
        $scope.select_dept = "";
        $scope.select_brand = "";
        $scope.select_merchant = "";
        $scope.select_color = "";
        $scope.cost = {
            range: [0.00, 1000000.00]
        };

        $scope.percent = {

            range: [0.00, 100.00]

        };


        $scope.CurrentPage = 1;
        $scope.extendedurl = "";
        $scope.selected_sorting = "keyword";
        $scope.selected_groupby = "";

        var newurl = generateurl($scope.CurrentPage);
        searchfilter(newurl);


    };

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };
    //-------------------- SAVE --------------------------------------------------
    $scope.saveproducts = function () {
        window.alert("saving....");

    }


}]);