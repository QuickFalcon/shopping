SSApp.controller('homeController', ['$scope', function ($scope) {
    
	
	$scope.$parent.addTobagPossible = true;
	  $scope.$parent.ck_all = true;

	$scope.$parent.merchantSetfromSearchBoxString =false;
    $scope.$parent.categorySetfromSearchBoxString =false;
    $scope.$parent.brandSetfromSearchBoxString =false;
      $scope.$parent.shopcatset= false;
      $scope.$parent.globalSearch = false;
      $scope.$parent.searchforstring ="";
		
	  $scope.$parent.color_arr =[];
      $scope.$parent.color_arr_search =[];
	if(!$scope.justClickedMenu) {
      $scope.$parent.stopclickInterval();
      $scope.$parent.intervalgapGeneratelink(); // create link
      console.log("I am here");
	
	}  
       
       	if($scope.sortorder==9)
		 $scope.$parent.sortorder=1;

	   $scope.$parent.percent = {

            range: [0.00, 100.00]
        };
$scope.customize_shop = function (customizeMenuItemName) { 
	$scope.$parent.customize_shop(customizeMenuItemName);

} 

    $scope.$parent.cost = {"range": [0.00, 1000000.00]};

    $scope.set_current_product = function (pro) {

        $scope.$parent.current_product = pro;
        $scope.$parent.set_product_scope(pro);
    }

    $scope.$parent.currentpage = 1;
	var tempo=[];
    var pushtrue = true;
    var url = '#!/';
	var temppath = {'poth':'#!/','label':'HOME'};
	tempo.push(temppath);
	
	
	$scope.$parent.pathTorch =tempo;
	//$scope.$parent.pathTorch[0]= tempo;
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
        
		  $scope.$parent.stopclickInterval();
		$scope.$parent.intervalgapGeneratelink();

    }
	
	

    // $scope.$parent.generatelink(1);
   // $scope.$parent.firsttime.loading =1;


}]);