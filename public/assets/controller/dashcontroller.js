SSApp.controller('dashController', ['$scope', function ($scope) {
    $scope.$parent.addTobagPossible = true;
   	  $scope.$parent.ck_all = true;

   $scope.$parent.currentpage = 1;
    $scope.$parent.merchantSetfromSearchBoxString =false;
    $scope.$parent.categorySetfromSearchBoxString =false;
    $scope.$parent.brandSetfromSearchBoxString =false;
    $scope.$parent.shopcatset= false;
    $scope.$parent.globalSearch = false;
    $scope.$parent.searchforstring =""; 
    $scope.$parent.percent = {
            range: [0.00, 100.00]
        };
    $scope.$parent.color_arr =[];
	$scope.$parent.color_arr_search =[];
   	if($scope.sortorder==9)
	 $scope.$parent.sortorder=1;

	
	$scope.$parent.premiumMerchant = false;
    $scope.$parent.color_arr =[];
    $scope.$parent.cost = {"range": [0.00, 1000000.00]};

$scope.customize_shop = function (customizeMenuItemName) { 
	$scope.$parent.customize_shop(customizeMenuItemName);

} 

    $scope.set_current_product = function (pro) {

        $scope.$parent.current_product = pro;
        $scope.$parent.set_product_scope(pro);
    }

  if(!$scope.justClickedMenu)  {
      console.log('!$scope.justClickedMenu');
	  $scope.$parent.stopclickInterval();
	  $scope.$parent.intervalgapGeneratelink(); // create link

   
   }
  
 
	var tempo=[];
    var url = '#!/dashboard';
	var temppath = {'poth':'#!/dashboard','label':'DASHBOARD'};
	tempo.push(temppath);
	$scope.$parent.pathTorch =tempo;
	//$cookies.put('path',tempo);

        $scope.menuCategoryStoreSearchApi = function (menulabel, store) {
        console.log('$scope.menuCategoryStoreSearchApi');
        $scope.$parent.proLoading = true;
        $scope.$parent.stopclickInterval();
        $scope.$parent.justClickedMenu = false;

        $scope.$parent.shopcatset= false;
        $scope.$parent.slidimageclick = true;

        $scope.$parent.selected_merchantlist = [];
        $scope.$parent.selected_merchantlist.push(store);



        if(menulabel=='') {
            $scope.justClickedMenu = true;

        }
        $scope.$parent.pathing = $scope.menuClicked + ' > ' + store;
        $scope.$parent.SmartPathing = $scope.menuClicked + ' > ' + store;
        $scope.$parent.viewall = 0;
        $scope.$parent.showup = 0;
        $scope.$parent.load_click = 0;
        $scope.$parent.bigCurrentPage = 1;
        $scope.$parent.intervalgapGeneratelink();

    }

    //$scope.$parent.firsttime.loading =1;

	
	}]);
