// controller for clicks
SSApp.controller('clickListCtrl', ['$scope', '$http', function ($scope, $http) {


    // $scope.title="click";


    $http.get('/mixpanel').success(function (data, status, headers, config) {

        var pageView = data.data.values.pageViewed;
        var productClick = data.data.values.clickSpecificProduct;
        var checkout = data.data.values.clickCheckout;
        var success = data.data.values.SuccessfulBuy;
        var searching = data.data.values.search;


        $scope.pageView = JSON.stringify(pageView);   // JSON.stringify() method converts a JavaScript value to a JSON string
        $scope.productClick = JSON.stringify(productClick);
        $scope.checkout = JSON.stringify(checkout);
        $scope.search = JSON.stringify(searching);
      

		barChartHandler(data);                        //public/custom_scripts/admin/main.js

       Charts.init(data);                           // initialize charts.init from external library file : public\vendor\Chart.js


    }).error(function (data, status, headers, config) {

        $scope.name = 'ERROR';
    });


    $http.get('/mixpanelsearch').success(function (searchterm, status, headers, config) {
         console.log(searchterm);
		 
		
         var searchkey = searchterm.data.values;
         var obj = searchterm.data.values;
         console.log(searchkey);

		  $scope.searchkey= JSON.stringify(searchkey);
        // $scope.pageView= JSON.stringify(pageView);

        var t;
        var searchcounter = 0; // returned search key
        //read search key terms
        var searchtermarr = [];
        var valuearr = [];


        for (t in obj) {

            searchtermarr[searchcounter] = Object.keys(searchkey)[searchcounter];        // store all search terms
            searchcounter = searchcounter + 1;
        }

        var firstKey = Object.keys(searchkey)[0];

        //$scope.searchkey= firstKey;
        $scope.searchkey = obj; // will print the value

        $scope.search_term = firstKey;
        $scope.first_one = obj[firstKey];
        var t_obj = obj[firstKey];

        var x;
        var temp_key;
        for (x in t_obj) {

            temp_key = x;              // it is  key date

        }

        $scope.key_tmp = x;           // now i know the date


        var countersec;
        for (countersec = 0; countersec < searchcounter; countersec++) {
            firstKey = searchtermarr[countersec];

            t_obj = obj[firstKey]; //date value pair
            valuearr[countersec] = t_obj[temp_key];

        }

        //sort the data and key array for future consider only single date
        var i;
        var j;
        var tempdata;
        var tempkey;

        for (i = 0; i < searchcounter - 1; i++) {

            for (j = 1; j <= i; j++) {
                if (valuearr[j - 1] < valuearr[j])   // base on value sort will take place
                {
                    tempdata = valuearr[j - 1];
                    valuearr[j - 1] = valuearr[j];
                    valuearr[j] = tempdata;

                    tempkey = searchtermarr[j - 1];            // synchronized change the key sorting of array
                    searchtermarr[j - 1] = searchtermarr[j];
                    searchtermarr[j] = tempkey;

                }
            }

        }
        var valstring = "";
        for (i = 0; i < searchcounter; i++) {

            valstring = valstring + searchtermarr[i] + " " + valuearr[i] + "\n";

        }

        $scope.val = valstring;        // now i know the value

        //page view =data
        barchartsearch(searchtermarr, valuearr);
    }).error(function (searchterm, status, headers, config) {

        $scope.n = 'ERROR';
    });


}]);

