SSApp.controller('adminStoreAnalysisCtrl', ['$scope', '$http', function ($scope, $http) {
	$scope.CurrentPage=1;
	//var url = 'http://api.prosperent.com/api/merchant?api_key=0da1ade1627ce72127d551d52d5b55e7&limit=200&sortBy=merchant';
	$scope.lmt = 3900;
	// $scope.lmt = 1;

	$scope.storetype =1;
	$scope.skip_index = 0;
	$scope.BigCurrentPage =1;
	$scope.biglimit =2000;

	var jsonstore ={limit: $scope.lmt,currentpage: $scope.CurrentPage };
	var jsonallstore ={limit: $scope.lmt,currentpage: $scope.CurrentPage};
	var csvstore ={};
	$scope.current_limit = angular.copy($scope.lmt);
	$scope.showNext =function()
	{
		$scope.skip_index = $scope.skip_index  +  $scope.lmt;
		$scope.current_limit = $scope.current_limit + $scope.lmt;

	}

	$scope.importcsv = function(){

		//csvstore.TwotapStorelist =  $scope.TwotapStorelist;
		csvstore.limit = $scope.totalRecordsAvailable;
		window.alert('Just clicked');

		$http.post('/getCommonStoreCsv',csvstore ).then(function (responsePurcx) {

			window.alert('import csv finished');

		})

	}


	$scope.showPrev =function()
	{

		if($scope.current_limit> $scope.lmt)
		{
			$scope.skip_index = $scope.skip_index - $scope.lmt;
			$scope.current_limit = $scope.current_limit - $scope.lmt;
		}
	}

	var temp_domain;
	var temp_twotap_domain;
	var twotapurl ='https://api.twotap.com/v1.0/supported_sites';
    $scope.loaddone = false;

    // gettin twotap supported stores
	$http.get('https://api.twotap.com/v1.0/supported_sites').then(function (responsePurc) {
		$scope.TwotapStorelist = responsePurc.data;
		$scope.TwotapStorelistCompare =angular.copy($scope.TwotapStorelist);

        // gettin all prosperent stores
        $http.post('/getAllProsperentStore',jsonstore ).then(function (responsePurcx) {
			$scope.Storelist = responsePurcx.data.storedata;
			$scope.prospereStore ={};

			$scope.totalRecordsAvailable  = responsePurcx.data.totalRecordsFound;
			$scope.numPages =   Math.ceil(($scope.totalRecordsAvailable) / ($scope.lmt));
			var leng = $scope.Storelist.length;
			for(var j=0;j<$scope.Storelist.length;j++)
			{
				temp_domain = $scope.Storelist[j].domain;

				$scope.prospereStore[temp_domain] =  angular.copy($scope.Storelist[j]);

				if((j+1)==leng)
				{

					console.log($scope.TwotapStorelistCompare.length);
					for(var k=0;k<$scope.TwotapStorelistCompare.length;k++)
					{

						// temp_twotap_domain =$scope.TwotapStorelist[k].merchant;
						temp_twotap_domain =$scope.TwotapStorelistCompare[k].url;

						if(angular.isDefined($scope.prospereStore[temp_twotap_domain]))
						{
							$scope.prospereStore[temp_twotap_domain].twotap =true;
							$scope.TwotapStorelistCompare.splice(k,1);
						}


					}


				}
			}

            $scope.loaddone = true;


		},function (responseErrx) {
			console.log(responseErrx);
            $scope.loaddone = true;
		});



	},function (responseErr) {
		console.log(responseErr);
        $scope.loaddone = false;

    });



	$scope.pageChangedProsper = function ()
	{
		$scope.prospereStore ={};

		if($scope.storetype ==2)
			$scope.storetype =1;


		jsonstore ={limit: $scope.lmt,currentpage: $scope.CurrentPage };
		$http.post('/getAllProsperentStore',jsonstore ).then(function (responsePurc) {
			$scope.Storelist = responsePurc.data.storedata;

			for(var j=0;j<$scope.Storelist.length;j++)
			{
				temp_domain = $scope.Storelist[j].domain;

				$scope.prospereStore[temp_domain] =  angular.copy($scope.Storelist[j]);

				if((j+1)==$scope.Storelist.length)
				{
					for(var k=0;k<$scope.TwotapStorelistCompare.length;k++)
					{

						temp_twotap_domain =$scope.TwotapStorelistCompare[k].url;

						if(angular.isDefined($scope.prospereStore[temp_twotap_domain]))
						{
							$scope.prospereStore[temp_twotap_domain].twotap =true;

							$scope.TwotapStorelistCompare.splice(k,1);

						}

					}
				}
			}

		},function (responseErr) {
			console.log(responseErr);
		});

	}


	$scope.pageChangedProsperSplice = function (currentpage)
	{
		$scope.CurrentPage = currentpage+1;
		if($scope.storetype ==2)
			$scope.storetype =1;

		jsonstore ={limit: $scope.lmt,currentpage: $scope.CurrentPage };
		$http.post('/getAllProsperentStore',jsonstore ).then(function (responsePurc) {
			$scope.Storelist = responsePurc.data.storedata;
			var len =$scope.Storelist.length;

			for(var j=0;j<len;j++)
			{
				temp_domain = $scope.Storelist[j].domain;

				$scope.prospereStore[temp_domain] =  angular.copy($scope.Storelist[j]);

				if((j+1)==len)
				{

					console.log($scope.TwotapStorelistCompare.length);
					for(var k=0;k<$scope.TwotapStorelistCompare.length;k++)
					{
						temp_twotap_domain =$scope.TwotapStorelistCompare[k].url;
						if(angular.isDefined($scope.prospereStore[temp_twotap_domain]))
						{
							$scope.prospereStore[temp_twotap_domain].twotap =true;
							$scope.TwotapStorelistCompare.splice(k,1);
						}

					}
				}
			}

		},function (responseErr) {
			console.log(responseErr);
		});

	}


	$scope.commonstore =[];

	var temp_twotap_store;
	var fullstorelist;
	var temp_twotap;


	$scope.showStoreType = function(storeType)
	{
		$scope.storetype =storeType;



		if($scope.storetype==4)
		{
			jsonallstore ={limit:$scope.biglimit,currentpage: $scope.BigCurrentPage };
			$scope.bignumPages =   Math.ceil(($scope.totalRecordsAvailable) / ($scope.biglimit));

			$http.post('/getAllProsperentStore',jsonallstore ).then(function (response) {

				fullstorelist = response.data.storedata;

				$scope.FullStore ={};

				for(var j=0;j<fullstorelist.length;j++)
				{
					temp_domain = fullstorelist[j].domain;

					$scope.FullStore[temp_domain] =  angular.copy(fullstorelist[j]);

					if((j+1)==fullstorelist.length)
					{
						for(var k=0;k<$scope.TwotapStorelist.length;k++)
						{

							temp_twotap =$scope.TwotapStorelist[k].url;

							if(angular.isDefined($scope.FullStore[temp_twotap]))
							{
								$scope.FullStore[temp_twotap].twotap =true;

								console.log($scope.FullStore[temp_twotap]);

							}

						}


					}
				}

			})
		}
	}
	$scope.pageChangedBig = function()
	{
		jsonallstore ={limit:$scope.biglimit,currentpage: $scope.BigCurrentPage };

		$http.post('/getAllProsperentStore',jsonallstore ).then(function (response) {

			fullstorelist = response.data.storedata;

			$scope.FullStore ={};

			for(var j=0;j<fullstorelist.length;j++)
			{
				temp_domain = fullstorelist[j].domain;

				$scope.FullStore[temp_domain] =  angular.copy(fullstorelist[j]);

				if((j+1)==fullstorelist.length)
				{
					for(var k=0;k<$scope.TwotapStorelist.length;k++)
					{

						temp_twotap =$scope.TwotapStorelist[k].url;

						if(angular.isDefined($scope.FullStore[temp_twotap]))
						{
							$scope.FullStore[temp_twotap].twotap =true;

							console.log($scope.FullStore[temp_twotap]);

						}

					}


				}
			}

		})
	}


}]);
