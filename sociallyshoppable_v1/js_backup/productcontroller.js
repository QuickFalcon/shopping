//user single &  productListCtrl for multiple product controller where data come from database 
SSApp.controller('searchResultController',['$scope','$http','$route','$routeParams','$location',function($scope,$http,$route,$routeParams,$location)
{


}]);
// Controller For Search Page ======= and Search result shop page
SSApp.controller('searchapicontroller',['$scope','$http','$route','$routeParams','$location',function($scope,$http,$route,$routeParams,$location)
{

	// $("#brandz").mCustomScrollbar({
    // callbacks:{
        // onTotalScroll:function(){
            // $scope.load_more_brand();
        // }
    // }
// });

	// $scope.getMore2=function()
	// {
	
	// $scope.$parent.getMore();
	// }
// $scope.$parent.getMore();
   var arr=[];
   var tarry=['accessories','bag','beauty','gap','gifts','home','jeans','kids','men','overstock','pant','shirt','shoe','women'];
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
   var tempdiscount=false;
   var temppercentoff=0;
  
  
 
  $scope.selected="";

  
 

  
  

   $scope.$parent.numPages= $scope.totalRecordsAvailable/ $scope.limit;

 
  $("#brandz").scroll(function() {
    $scope.load_more_brand(); 
});

$scope.load_more_brand = function()
	{
	 
	if ($scope.busy || $scope.brand_start>$scope.number_BrandPage) 
	  return;
       $scope.$parent.busy = true;
	   $scope.$parent.generateAllBrands();
	  
	}
	$scope.set_current_product= function(pro)
	{
			
	$scope.$parent.current_product = pro;
	$scope.$parent.set_product_scope(pro); 
	}
 
 
  
 
 // ------------generate all merchant list
	$scope.searching_within_page = function (keystring)
	{
		
		$scope.$parent.timeGap = 0;
	    $scope.$parent.stopclickInterval();
		$scope.$parent.selected = keystring;
		$scope.$parent.intervalgapGeneratelink(); 

		
		
	}

  // changing merchant 
 $scope.changeMerchantList= function(merchant,obj,ind){
	 $scope.$parent.timeGap = 0;
	 $scope.$parent.stopclickInterval();
	
	 var index=-1;
	 var index1=-1;
	 index = $scope.$parent.selected_merchantlist.indexOf(merchant);
	 index1 = $scope.$parent.selected_merchantlistByclick.indexOf(merchant); 
 	 
     if(obj)  
     {
	  window.alert(merchant);

	 if(index<0) 
	  $scope.$parent.selected_merchantlist.push(merchant);
	  
	  if(index1<0)
	  $scope.$parent.selected_merchantlistByclick.push(merchant);
		
	 
	  $scope.$parent.retailerList[ind].IsTrue = true;

	   //$scope.$parent.generatelink(1);
       $scope.$parent.intervalgapGeneratelink(); 
	 }
	 else
	 {
	 	

	    if(index>-1)
	    $scope.$parent.selected_merchantlist.splice(index, 1);    
        
	    if(index1>-1)
		$scope.$parent.selected_merchantlistByclick.splice(index1, 1);    
		
		 $scope.$parent.retailerList[ind].IsTrue = false;
		//$scope.$parent.generatelink(1);
        $scope.$parent.intervalgapGeneratelink(); 

	 
	 }  
	 console.log($scope.selected_merchantlist);
	 

   };
   
   
   $scope.changeMerchantListStoreChoosen= function(merchant,obj,ind){
	 
	  var mer;
      var length_sel_merchant = $scope.$parent.selected_merchantlist.length;
	  $scope.$parent.selected_merchantlist =[];
	  $scope.$parent.selected_merchantlistByclick=[];
	 
	 if(obj.IsTrue)
     {
	  
			
				for(var n=0;n<$scope.$parent.retailerList.length;n++ )
			        $scope.$parent.retailerList[n].IsTrue =false;
	  
	  $scope.$parent.retailerList[ind].IsTrue =true;
	  $scope.$parent.selected_merchantlist.push(merchant);
	  $scope.$parent.selected_merchantlistByclick.push(merchant);
	  $scope.$parent.generatelink(1);
     	
	  
	 
	 
	 }
	 else
	 {
	  
	  $scope.$parent.retailerList[ind].IsTrue =false;

	  
	 // $scope.$parent.retailerList[ind].IsTrue= false;
	  //obj.IsTrue =false;  // no need splice as already removed
	  $scope.$parent.generatelink(1);
	 
	 }  
	 
	 
	 // for(var k=0;k<$scope.$parent.retailerList.length;k++)
	  // {
	 
	  // $scope.$parent.retailerList[k].IsTrue=false;
	 
	  
	  // }
	 
	 //$scope.$parent.searchApiFilter(newurl);
	 
   };
   
$scope.changeCategoryList= function(category,obj){
	 
	     $scope.$parent.selected_sorting = "relevance";
	    
		 var str;
		 
		 if(category.level==1)
		 str = category.fullcategory;
		 else
		 str = "*"+category.fullcategory+"*";
		 
		  var index = $scope.$parent.selected_categorylist.indexOf(category.fullcategory);
		  var index_v1 = $scope.$parent.selected_categorylist_apistring.indexOf(str);
         
		 
		 if(index>-1)   // first remove all case then again insert if necessary 
 		 {	
		 
		 $scope.$parent.selected_categorylist.splice(index, 1);   
    	 $scope.$parent.selected_categorylist_apistring.splice(index_v1,1);

		 }
        

		if(obj)		 
         {
         $scope.$parent.selected_categorylist.push(category.fullcategory);
         $scope.$parent.selected_categorylist_apistring.push(str); 		
		 $scope.$parent.find_subcategory(category);   // we also remove sub category over there 
		 
		 } 
	 
		if(category.level==1 && obj)
		{
		 $scope.$parent.generatelink(1);
		//$scope.$parent.searchApiFilter(newurl);
		}  
   
        if(!obj)		 
         {
			$scope.$parent.generatelink(1);
			//$scope.$parent.searchApiFilter(newurl);
         } 
   
   };
 
 // 
 $scope.catSearch= function(cate)
 {
           $scope.$parent.timeGap = 0;
	       $scope.$parent.stopclickInterval();
		   
		   $http.post('/get_custom_category_cid',cate)  //call to retrieve data
                 .success(function(data) {
			
                 $scope.$parent.mapped_categorylist = data[0].prosperent_categories;
                 $scope.$parent.intervalgapGeneratelink(); 
				 
	         		 }).error(function(err) {
                  		console.log("error " + err);
            		$scope.$parent.intervalgapGeneratelink();  // not mapped still give a try 
					
					});
	
 }
 

 
  // adding brands 
 $scope.changeBrandList= function(brand,obj,ind){
	$scope.$parent.timeGap = 0;
	$scope.$parent.stopclickInterval();
	 if(obj)
	 {
	 $scope.$parent.selected_brandlist.push(brand);
	 $scope.$parent.intervalgapGeneratelink(); 
	 
	 }
	 else
	 {
		 var index = $scope.selected_brandlist.indexOf(brand);
         $scope.selected_brandlist.splice(index, 1);    
         $scope.$parent.intervalgapGeneratelink();  
	 
	 }
	 
  
   }; 
   
   $scope.changePremium= function(obj){
	 
  $scope.$parent.premiumMerchant =obj;
  
    $scope.$parent.generatelink(1);
     }; 

  
 

// ----------- Searching-----------------------
  /*on submit function*/

  $scope.searchusingfilter =  function(){
    $scope.$parent.generatelink(1);
    
  }
  
  //changing categories 
 $scope.update_suggestion= function(){
  $scope.$parent.generatelink(1);
     }
  // change sort 
  $scope.update_sorting= function(sort){
       
      $scope.$parent.timeGap = 0;
	  $scope.$parent.stopclickInterval();
       $scope.$parent.selected_sorting = sort;
      $scope.$parent.intervalgapGeneratelink();  

	   }
   // change the sort order of returned data

$scope.update_sort_order= function(){
    
     
	$scope.$parent.generatelink(1);
    
    }
$scope.update_groupby= function(){
    $scope.$parent.generatelink(1);
       
   }
   $scope.$parent.atleast_one =0;
   	$scope.$parent.priceRange0_100 =false;
	$scope.$parent.priceRange100_300 =false;
	$scope.$parent.priceRange300_500 = false;
	$scope.$parent.priceRange500_1000  = false;
	$scope.$parent.priceRange1000_2500 = false;
	$scope.$parent.priceRange2500_1000000 = false;
$scope.setPrice= function(min,max,val,whichOneCheck){
	 
	  $scope.$parent.timeGap = 0;
	  $scope.$parent.stopclickInterval();
	
	 
	 if(val)
	 {
	 $scope.$parent.cost.range[0] =min;
     $scope.$parent.cost.range[1] =max;
	 $scope.$parent.atleast_one=$scope.atleast_one+1;
	
	$scope.$parent.priceRange0_100 =false;
	$scope.$parent.priceRange100_300 =false;
	$scope.$parent.priceRange300_500 = false;
	$scope.$parent.priceRange500_1000  = false;
	$scope.$parent.priceRange1000_2500 = false;
	$scope.$parent.priceRange2500_1000000 = false;
	
	 
	 
		if(whichOneCheck==0) 
		{
		$scope.priceRange0_100 =true;
		$scope.priceRange100_300 =false;
		$scope.priceRange300_500 =false;
		$scope.priceRange500_1000 =false;
		$scope.priceRange1000_2500 =false;
		$scope.priceRange2500_1000000 =false;
		$scope.$parent.priceRange0_100 =true;
		
		
		
		} 
	    else if(whichOneCheck==1) 
		{
		$scope.priceRange0_100 =false;
		$scope.priceRange100_300 =true;
		$scope.priceRange300_500 =false;
		$scope.priceRange500_1000 =false;
		$scope.priceRange1000_2500 =false;
		$scope.priceRange2500_1000000 =false;
		$scope.$parent.priceRange100_300 =true;
		
		
		} 
		else if(whichOneCheck==2) 
		{
		$scope.priceRange0_100 =false;
		$scope.priceRange100_300 =false;
		$scope.priceRange300_500 =true;
		$scope.priceRange500_1000 =false;
		$scope.priceRange1000_2500 =false;
		$scope.priceRange2500_1000000 =false;
		
		$scope.$parent.priceRange300_500 =true;
		
		} 
		else if(whichOneCheck==3) 
		{
		$scope.priceRange0_100 =false;
		$scope.priceRange100_300 =false;
		$scope.priceRange300_500 =false;
		$scope.priceRange500_1000 =true;
		$scope.priceRange1000_2500 =false;
		$scope.priceRange2500_1000000 =false;
		
		$scope.$parent.priceRange500_1000  = true;
		
		} 
		else if(whichOneCheck==4) 
		{
		$scope.priceRange0_100 =false;
		$scope.priceRange100_300 =false;
		$scope.priceRange300_500 =false;
		$scope.priceRange500_1000 =false;
		$scope.priceRange1000_2500 =true;
		$scope.priceRange2500_1000000 =false;
		
		$scope.$parent.priceRange1000_2500 =true;
		} 
		else if(whichOneCheck==5) 
		{
		$scope.priceRange0_100 =false;
		$scope.priceRange100_300 =false;
		$scope.priceRange300_500 =false;
		$scope.priceRange500_1000 =false;
		$scope.priceRange1000_2500 =false;
		$scope.priceRange2500_1000000 =true;
		
		$scope.$parent.priceRange2500_1000000 = true;
		} 
		
	 

	 
	 
	 
	 
	 }
	 else
	  {
	  $scope.$parent.cost = { 
				range:	    [0.00, 1000000.00]
		};

	   	$scope.$parent.atleast_one=$scope.atleast_one-1;
	 
	 	if(whichOneCheck==0) 
		{
		$scope.priceRange0_100 =false;
		
		$scope.$parent.priceRange0_100 =false;
		
		
		
		} 
	    else if(whichOneCheck==1) 
		{
		$scope.priceRange100_300 =false;
	
		$scope.$parent.priceRange100_300 =false;
		
		
		} 
		else if(whichOneCheck==2) 
		{

		$scope.priceRange300_500 =false;

		$scope.$parent.priceRange300_500 =false;
		
		} 
		else if(whichOneCheck==3) 
		{
	
		$scope.priceRange500_1000 =false;

		
		$scope.priceRange500_1000  = false;
		
		} 
		else if(whichOneCheck==4) 
		{

		$scope.priceRange1000_2500 =false;
		
		$scope.$parent.priceRange1000_2500 =false;
		} 
		else if(whichOneCheck==5) 
		{
		
		$scope.priceRange2500_1000000 =false;
		
		$scope.$parent.priceRange2500_1000000 = false;
		} 
	 
	 
	 
	 
	 }
	 
	 $scope.$parent.intervalgapGeneratelink();  
	  //$scope.$parent.generatelink(1);
	}
$scope.setMinDiscount= function(min){
   
    $scope.$parent.percent = {"range":[]};  
    $scope.$parent.percent.range[0] =min;
	$scope.$parent.percent.range[1] =100.00;
	$scope.$parent.generatelink(1);
		  
  }
  // sale promotion true or not
$scope.setIsDiscount= function(saletrue){
      $scope.$parent.timeGap = 0;
	  $scope.$parent.stopclickInterval();
	 if(saletrue)
	 {
	 
	 $scope.$parent.selected_sorting = "price+asc";
	 $scope.sortorder="+asc";

	 }
	 else
	 {
	  
	  $scope.$parent.selected_sorting = "price+asc";
	  $scope.sortorder="+asc";

	 }
	    $scope.$parent.saleOffer = saletrue;
		$scope.$parent.intervalgapGeneratelink(); 
	}  
  
  
$scope.brand_change= function(){
   	 $scope.$parent.generatelink(1);
	 }
$scope.merchant_change= function(){
	$scope.$parent.generatelink(1);
	
}
$scope.commonAction= function(oc_type,boolObj){
	      $scope.$parent.timeGap = 0;
	      $scope.$parent.stopclickInterval();
		 if(boolObj)
		  {
		  if(oc_type=='casual')
		  $scope.$parent.oc_casual =true;
		  else if (oc_type=='work')
		  	$scope.$parent.oc_work =true;

		  else if (oc_type=='vacation')
		  	$scope.$parent.oc_vacation =true;

		  else if (oc_type=='other')
		  	 $scope.$parent.oc_other =true;

		  $scope.$parent.selected_sorting = "relevance"; 	 
		  }
		  else
		  {
		   if(oc_type=='casual')
		  $scope.$parent.oc_casual =false;
		  else if (oc_type=='work')
		  	$scope.$parent.oc_work =false;

		  else if (oc_type=='vacation')
		  	$scope.$parent.oc_vacation =false;

		  else if (oc_type=='other')
		  	 $scope.$parent.oc_other =false;

		  }
		
		  $scope.$parent.intervalgapGeneratelink(); 

}//------------------- page change event-----------------------------
$scope.pageChanged = function() {
 
    $scope.$parent.generatelink($scope.CurrentPage);
        
  }; //page change function end

  // api price filter
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
  
  // api percent filter
  $scope.percentFilter = function(pro) 
  {
   	    return pro.percentOff >= $scope.percent.range[0] && pro.percentOff <= $scope.percent.range[1];
   }
  
  $scope.setColor = function(color){
    
        $scope.$parent.timeGap = 0;
	    $scope.$parent.stopclickInterval();
		$scope.$parent.select_color = color;
	    $scope.$parent.intervalgapGeneratelink();  
       }
    
 $scope.clearFilter = function() {
        $scope.$parent.timeGap = 0;
	    $scope.$parent.stopclickInterval();
      $scope.$parent.selected="";
	  $scope.$parent.select_dept="";
	  
      $scope.$parent.cost = { 
				range:	    [0.00, 1000000.00]
		};
	  
	    $scope.$parent.percent = {
			
				range:	    [0.00, 100.00]

			};
	 
		$scope.$parent.CurrentPage=1; 
		$scope.$parent.extendedurl="";
		$scope.$parent.selected_groupby="";
		$scope.$parent.select_color="";
		$scope.$parent.selected_merchantlist=[];	
		$scope.$parent.select_merchant ="";
					
		$scope.$parent.selected_brandlist =[];	
		$scope.$parent.select_brand ="";
		
		$scope.$parent.selected_categorylist =[];	
		$scope.$parent.select_category ="";
		$scope.$parent.mapped_categorylist=[];
			// check is there any sale offer running 
		$scope.$parent.select_dept ="";	

		$scope.saleOffer =false;     
		$scope.$parent.saleOffer=false; 
		$scope.premiumMerchant=false;        
		$scope.$parent.premiumMerchant=false;
		$scope.priceRange0_100 =false;
		$scope.priceRange100_300 =false;
		$scope.priceRange300_500 =false;
		$scope.priceRange500_1000 =false;
		$scope.priceRange1000_2500 =false;
		$scope.priceRange2500_1000000 =false;
		
		$scope.$parent.selected_sorting="price+asc";
		$scope.ocassion_casual =false;
		$scope.ocassion_vacation=false;
		$scope.ocassion_work=false;
		$scope.ocassion_other=false;
		$scope.$parent.oc_casual =false;
		$scope.$parent.oc_work =false;
		$scope.$parent.oc_vacation =false;
		$scope.$parent.oc_other =false;
	    $scope.$parent.intervalgapGeneratelink();  
	  
	
	}

  $scope.setPage = function (pageNo) {
   $scope.currentPage = pageNo;
  };
  //-------------------- SAVE --------------------------------------------------
  $scope.saveproducts=function()
  {
  window.alert("saving....");
   
  }

  
}]);


////////////// Controller for product detail page//////////////////////
SSApp.controller('APIcatalogCtrl',['$scope','$http','$sce','$routeParams','$interval',function($scope,$http,$sce,$routeParams,$interval)
				{
					
					var cp=0;
					if($scope.loggedin!=1)
					{
					$scope.eststring ="Estimated "
					eststring ="Estimated "; 
					}
					else
					{
					$scope.eststring ="";
					eststring ="Estimated "; 
                    }
					
					$scope.required_field_values ={};
					$scope.required_field_values.quantity=1;
					
					$scope.CatId = $routeParams.CatalogId; // retrieve  catalog id 
				
					$scope.select_color="";
					$scope.select_premium=false;      // premium designer
					$scope.select_oc_casual=false;  // occassion casual
		            $scope.select_oc_vacation=false;  // occassion vacation
		            $scope.select_oc_work=false; // occassion work
		            $scope.select_oc_other=false; // occassion other
					$scope.coloravnum=0;
					$scope.avail =false;
					$scope.msg ="";
					
					var indexcol;
				 
			
				 $scope.get_size_list = function(complete,itemByColor,ind){
			     // need to find the index
					var i=0;
					var num=-1;
					for (i=0;i<complete.color.length;i++ )
					{
					
					   if(complete.color[i].text == itemByColor.text)
						{
						  num = i;
						   console.log(complete.color[i].text);
						   $scope.colorText =complete.color[i].text;
						   $scope.required_field_values.color =complete.color[i].value;
						}
					}
			        if(num>-1)
					{
					
					complete.size = complete.color[num].dep.size; 
                   	$scope.product.image_url =	complete.color[num].image;
					
					  cp=complete.color[num].price.substring(1);
									   
					  $scope.current_price =parseFloat(cp,10);
					 if($scope.product.price_sale!='' && $scope.product.price_sale !=null)
					   $scope.product.price_sale = $scope.current_price;
					else
					 $scope.product.price = $scope.current_price;
					
					   
					
									
					}
					//  console.log(complete.required_field_values.size); 
					//complete.image= col;
			 
				}
				 $scope.set_size = function(size,sizeJson){
					 
					 if(angular.isDefined(sizeJson.price))
					 {
					 
					  cp=sizeJson.price.substring(1);
					  $scope.current_price =parseFloat(cp,10);
					 
					if($scope.product.price_sale!='' && $scope.product.price_sale !=null)
					  $scope.product.price_sale =$scope.current_price;
					 else
					  $scope.product.price = $scope.current_price;
					 
                      $scope.subtotal =eststring+"subtotal $ "+ $scope.current_price;	 
                     

					 }
				  
						 if(angular.isDefined(sizeJson.image_url))
						 {
						  $scope.product.image_url =	sizeJson.image;
						 }
				 
				       if(angular.isDefined(sizeJson.extra_info))
						 {
						 
						 $scope.product.extra_info =	sizeJson.extra_info;
						 
						 }
				         $scope.size =size;
						
						 $scope.required_field_values.size =size;
						
				 }
				
				
	//https://linksearch.api.cj.com/v2/link-search?website-id=7095303&advertiser-ids=2609575&link-type=Text+Link&promotion-type=coupon&page-number=1&records-per-page=20


                
				$http.get('/catalogapi/'+ $scope.CatId).success(function(data1) {
                           // define product
						   	$scope.cart_id="";
							
							$scope.product = data1;
							$scope.$parent.jantuPakhi = data1.twoTapProductUrl; // product url for checkout
							
							$scope.retrievebrand =data1.brand;
                             
							 
							 var timeInMs; 
							 if (!Date.now) {
								  timeInMs = function now() {
									return new Date().getTime();
								  };
								}
								else
								{ 
								timeInMs= Date.now();   
								
								} 
								
								var u_timestamp = Math.floor(timeInMs / 1000); // getting unix time stamp
								
								var ts_milisecond= u_timestamp * 1000; // cause unix time stamp is in second
		
								var d = new Date();
                                d.setTime(ts_milisecond);
							
													
							var sale_offer= false;
							if(data1.price_sale>0 || data1.percentOff>0)
                              {
							  sale_offer = true;
							  
							  }
						var affurl ={ affiliate_url : data1.affiliate_url }  
			
						var arrUrl =[];
						arrUrl[0] =data1.twoTapProductUrl;
			
						var realurlx = { realurl : data1.twoTapProductUrl }; 
			   	
						
						var checkoutRequest = {};
					    checkoutRequest['products'] = [ { 'url': data1.twoTapProductUrl, 'quantity': 1 } ];

						checkoutRequest['public_token'] = '56842635c4b9b3fa82b222e29f24e8';
						checkoutRequest['custom_css_url'] = '';
						checkoutRequest['confirm'] = { method: 'http', http_confirm_url: 'http://45.55.138.4/confirm', http_finished_url: 'http://45.55.138.4/finish' };
                        checkoutRequest['unique_token'] = (Math.floor(Math.random()* ts_milisecond * 9999999) + 1).toString();
                        checkoutRequest['test_mode'] = 'fake_confirm';
					      // jQuery.post('https://checkout.twotap.com/prepare_checkout', { checkout_request: checkoutRequest }, function(data) {
				
					  
							// $('#ttIframe').attr('src', data1['url']); // setting an id's src 
					      // 
						// $scope.links =$sce.trustAsResourceUrl(data1['url']);
						// $scope.$apply();
                        
						
						// });		
	 
	 
	        //within successful call i will call for what is product url so i do not need to wait 
						$scope.uniqueID =timeInMs;
			 
			//****find out original url from affiliated url  ****//
			
            // ajax call to get color from product image
            //define image url 
          
			
			
			    
                    var pro_url = { product_urls : arrUrl }; 
                
					var product_url_ckout = { products : arrUrl }; 
			        
					add_product_into_cart(product_url_ckout,-1);
						
						
						$http.post('/twotap_cart_single_product',pro_url).then(function(response)
						{         
						$scope.twotap_builtin_cart ={};	 
						$scope.estimate ={};
						$scope.cart_id="";
						
						if(response.data.message=='done' || response.data.message=='has_failure' )	 
						{
						
						$scope.avail =response.data.availability;
						$scope.cartProductStatus = response.data.productCartDetails; 
						$scope.twotap_builtin_cart = response.data.productCartDetails;
						$scope.twotap_builtin_cart.product_urls =[];
					    $scope.estimateAll =response.data;
					
						var keyid;
					    var keys = [];
					    var price;
						var eststring="";
						if($scope.avail)
						{
						$scope.cart_id= response.data.cart_id;
						$scope.msg="Available";
						$scope.estimate = response.data.estimation.estimated_price_totals;
				
							if($scope.loggedin !=1)
							{
							eststring ="Estimated ";


							}
					        for(var p in $scope.estimate)
							{ 

						  	  if(p=="subtotal")
	                         {
	                                   
									   var jk=$scope.estimate[p].substring(1);
									   $scope.current_price =parseFloat(jk,10);
                                       
									   
									   			if($scope.product.price_sale!='' && $scope.product.price_sale !=null)
													$scope.product.price_sale =$scope.current_price;
												else
													$scope.product.price = $scope.current_price;
									   
									 //  $scope.subtotal =eststring+"subtotal $ "+ $scope.current_price;	                               // $scope.final_price =eststring+"Total USD "+ price.final_price.substring(1);
	                         
							 
							 }
							
							else if(p=="shipping_price")
	                          {
	                           $scope.shipping_price = parseFloat($scope.estimate[p].substring(1),10);
							  
							  }
	                         else if(p=="sales_tax")
	                         {
	                              $scope.sales_tax = parseFloat($scope.estimate[p].substring(1),10)

	                         }
	                        else if(p=="final_price")
	                         {
	                            
	                            $scope.final_price =parseFloat($scope.estimate[p].substring(1),10);
	                         
							 
							 }
                          

							}
						}	
							
				
							
						     var sites_arr = [];
							 var skey;
							  var md5prokey;

							 for(skey in response.data.productCartDetails.sites)
								  {  
										sites_arr.push(skey);
										$scope.skey =skey;		
								        
								  
								  }

                   
								  
							 $scope.s_array =sites_arr;  //make an array of sites
						     $scope.shipping_countries_support = $scope.twotap_builtin_cart.sites[skey].shipping_countries_support;
						     $scope.billing_countries_support =$scope.twotap_builtin_cart.sites[skey].billing_countries_support;
						  
						  
						    	 
								 ////////////////////////////////////////////////////////////////////////////
								  for(md5prokey in response.data.productCartDetails.sites[skey].add_to_cart)
											{  
										
												$scope.md5prokey =md5prokey;	
																					
											}
							
								 ////////////////////////////////////////////////////////////////////////////
								  
							$scope.alt_images= response.data.productCartDetails.sites[skey].add_to_cart[md5prokey].alt_images;
						}	 
						else
						{
						$scope.avail =false;
						$scope.msg ="This Product Not available";
						
						
						}

				            
					 }, function (response) {
				
						$scope.avail =false;
						$scope.msg ="This Product Error";
					});
					 
					 
				
					 
					 // product availability return whether product available or not
					// send request to get estimate price
			
					// $http.post('/cart_estimate',realurlx).success(function(dataC)
					// {
					  // $scope.cartProductStatus = dataC.productCartDetails; 
					  // console.log("after adding inside cart");
					  
					   // console.log($scope.cartProductStatus);
					  
					  // $scope.estimateAll =dataC;
					  
					  // $scope.estimate = dataC.estimates;
					  // var keyid;
					  // var keys = [];
					  // var price;
						// for(var k in $scope.estimate)
						// { 
							// keyid = k; 
							// price=$scope.estimate[keyid].prices; // assign key values inside price


						// }

                      // // while user is not logged in all of the value will be estimated 
                      // // so we are going to add estimated word before each price
						// var eststring="";
						// if($scope.loggedin ==1)
						// {


						// }
						// else
						// {

						// eststring ="Estimated ";

						// }
						
                        // // we are going to run a loop to extract price from api returned estimated price

						// for(var p in price)
						// { 

						  	// if(p=="shipping_price")
	                          // {
	                          	 // $scope.shipping_price =eststring+"Shipping USD " + price.shipping_price.substring(1);
	                          // }
	                         // else if(p=="sales_tax")
	                         // {
	                              // $scope.sales_tax =eststring+"Tax USD "+ price.sales_tax.substring(1);

	                         // }
	                        // else if(p=="final_price")
	                         // {
	                         
	                                // $scope.final_price =eststring+"Total USD "+ price.final_price.substring(1);
	                         // }
                           // else if(p=="product_prices")
	                         // {
	                               
									// $scope.product.price = price.product_prices[0].substring(1);     // two tap price 
	                         // }

						// }
                   
                      // $scope.loading = false;

					 // })	.error(function(err) {
						  // window.alert("Estimation Error: " + err);
						  // $scope.loading =false;
					// });
			
			
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
			 //$scope.product.availability = true;

             var imgurl = {image_url: data1.image_url } 
             // $http.post('/productcolor',imgurl)
            	 // .success(function(Bigcolor) {
                	 
                 // var color= angular.lowercase(Bigcolor);
                	  // $scope.product.colorcode=color; // hex color
         			  // $scope.select_color=color; 
                      // var colorcode = {col_name: color }   
					  // $http.post('/productcolorname',colorcode).success(function(cname) {   
                      // $scope.product.color=cname; // set color name  
                      // window.alert(cname);
                      // }).error(function(err) {
                  			// window.alert("color code 2 color name Error: " + err);
            						 // });

					
					
					 // }).error(function(err)
					 // {
                  		// window.alert("Product color Error: " + err);
            		// });		
            


			 });// catalog wise product call end 
				
///////////////////////////////////////PRODUCT SAVING ///////////////////////////////////////////////////////////////////////////////////////////////////	
function add_product_into_cart(pro_url,index)
		{
		
		 var CART_ID;
		 var status_coming=false;
		
		$http.post("https://api.twotap.com/v1.0/cart?public_token=" + $scope.twotap_public_token,pro_url)
                    .then(function(response){ 
					$scope.details = response.data; 
					CART_ID= response.data.cart_id;
					var stop;
					var timer=0;
          // Don't start a new fight if we are already fighting
					if (angular.isDefined(stop) ) return;
					var valid =false;

					  stop = $interval(function() {
					  
					  if(!valid)  
					  {
					   $http.get("https://api.twotap.com/v1.0/cart/status?public_token="+$scope.twotap_public_token+"&cart_id="+CART_ID).then(function(response2) {
						//
						
						if(response2.data.message!="still_processing" || timer>300000)
						{
							  $scope.stopFight();			
							  valid= true;
							  if(response2.data.message=="done")
							  {
								 //$scope.estimateFunction(response2.data,index,$scope.considered_items); // product added to cart now call estimation function
							  
							  }
							 
						
						}
						console.log(response2.data);
					   
					   })
					  
					   }
					  
					  timer=timer+3000;
					  
					  
					  }, 3000);
  

  
  
					});
		}
			
           $scope.stopFight = function() {
          if (angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;
          }
        };

			$scope.share= function(catalogId)
					 {
					 
						  if($scope.current_product.likeMe)
						  {
						  
							  $scope.$parent.addlike(catalogId);
						  
						  }
						  else
						  {
						  
							 console.log("remove like");
						  }
					 
					 }
		
			 // adding product into cart
				$scope.addToCartSingle= function(product,twotap_builtin_cart)
				{
				
				$scope.$parent.addToCart(product,$scope.required_field_values.quantity,twotap_builtin_cart,$scope.required_field_values,$scope.current_price,$scope.skey,$scope.md5prokey,$scope.cart_id);

				}
		
		
		
		
		}]);


/////////////////////controller for home page ///////////////////////////////
SSApp.controller('homeController',['$scope','$http','addWishList','$route','$routeParams','$location',function($scope,$http,addWishList,$route,$routeParams,$location)
{
 
 	$scope.set_current_product= function(pro)
	{
			
	$scope.$parent.current_product = pro;
	$scope.$parent.set_product_scope(pro); 
	}
 
 function searchdatabaseStore() {
                $scope.storequeryobj ={};
	             $http.post('/storelist',$scope.storequeryobj)  //call to retrieve data
                 .success(function(data) {
			
                 $scope.adminstorelist = data.product;

	         		 }).error(function(err) {
                  		window.alert("Store list can not generated: " + err);
            		});
				
		         }
                searchdatabaseStore();


               /* $('.carousel-stage').on('jcarousel:create jcarousel:reload', function() {

						$(this).jcarousel('scroll', 1, false);

						var element = $(this),

						width = element.innerWidth();
						element.jcarousel('items').css('width', width + 'px');

						}).jcarousel({

							wrap: 'circular'

						}).jcarouselAutoscroll({

							interval: 5000,

							   scroll: '+=1',
							autostart: true
					

						});

                 
                 $('.carousel-stage').jcarousel({

                        wrap: 'circular'

	                  }).jcarouselAutoscroll({

						interval: 5000,   // control final interval
                        scroll: '+=1',
						//target: '+=1',

						autostart: true

					});
					
					
					$('.prev-stage')

						 .jcarouselControl({

							target: '-=1'

						});



        $('.next-stage')

           .jcarouselControl({

                target: '+=1'

            });*/
		   
  $scope.update_sorting= function(sort){
       $scope.$parent.selected_sorting = sort;
      $scope.$parent.generatelink(1);
       
   }


				    // $scope.$parent.generatelink(1);

					
			
 
}]);

// ///////////////////controller for dashboard ////////////////////////
SSApp.controller('dashController',['$scope','$http','addWishList','$route','$routeParams','$location',function($scope,$http,addWishList,$route,$routeParams,$location)
{
 	$scope.set_current_product= function(pro)
	{
			
	$scope.$parent.current_product = pro;
	$scope.$parent.set_product_scope(pro); 
	}
	
	
	 
 // if($scope.loggedin==1)
 // {
 // $scope.adminstorelist=[{'store_name':'Blooming Dale','store_url':'http://www.bloomingdales.com/','image_url':'images/das3.png','thumbnail_url':'images/shop_thumb_1.png'}];
               
			   
			   function searchdatabaseStore() {
                $scope.storequeryobj ={};
	             $http.post('/storelist',$scope.storequeryobj)  //call to retrieve data
                 .success(function(data) {
			
                 $scope.adminstorelist = data.product;

	         		 }).error(function(err) {
                  		window.alert("Store list can not generated: " + err);
            		});
				
		         }
				 
		          
                   searchdatabaseStore();
		    	  $scope.update_sorting= function(sort){
				   $scope.$parent.selected_sorting = sort;
				  $scope.$parent.generatelink(1);
       
				}
               // $scope.$parent.getCartItems();
		    	//$scope.$parent.getRightSideBar(); // generate right sidebar after sign in
   // }
	// else
	// {
                 // window.alert("login to see dashboard data");
                // $("#login-popup").modal("show");  

	// }   
                 
			// $('.carousel-stage').on('jcarousel:create jcarousel:reload', function() {

						// $(this).jcarousel('scroll', 1, false);

						// var element = $(this),

						// width = element.innerWidth();
						// element.jcarousel('items').css('width', width + 'px');

						// }).jcarousel({

							// wrap: 'circular'

						// }).jcarouselAutoscroll({

							// interval: 5000,

							   // scroll: '+=1',
							// autostart: true
					

						// });

                 
                 // $('.carousel-stage').jcarousel({

                        // wrap: 'circular'

	                  // }).jcarouselAutoscroll({

						// interval: 5000,   // control final interval
                        // scroll: '+=1',
						// //target: '+=1',

						// autostart: true

					// });
					
					
					// $('.prev-stage')

						 // .jcarouselControl({

							// target: '-=1'

					// });



        // $('.next-stage')

           // .jcarouselControl({

                // target: '+=1'

            // });
		    //$scope.$parent.generatelink(1);
	    
			
}]);	

///////////////// CUSTOMIZE UR SHOP /////////////////////////////////////////////
SSApp.controller('customizeshopController',['$scope','$http','$route','$routeParams','$location',function($scope,$http,$route,$routeParams,$location)
{
  
  /*
  function searchstores() {
    
	             $http.get('/distinctstores', $scope.queryobj )  //call to retrieve data
                 .success(function(data) {
				// window.alert(data);
				 $scope.stores=  data;
				 
				 }).error(function(err) {
                  window.alert("Distinct Designer Error: " + err);
            });
		   }
	searchstores();
	*/


function searchdatabaseStore() {
                $scope.storequeryobj ={};
	             $http.post('/storelist',$scope.storequeryobj)  //call to retrieve data
                 .success(function(data) {
			
                 $scope.adminstorelist = data.product;

	         		 }).error(function(err) {
                  		window.alert("Store list can not generated: " + err);
            		});
				
		         }
    searchdatabaseStore();
    /*
	$scope.update_user_store=function(store_name,menuitem)
	{
     // window.alert(store_name);


var store = {"menuitem":menuitem,"store_name": store_name};
		
		$http.post('/update_user_store', store)
		    {     
		      

               var TopTen = $http({
				method: 'GET',
				url: '/user_stores'
				}); 
   				TopTen.success(function(UserShoplist){
                $scope.userstoptenMen = UserShoplist.usermenMerchant;
               // return $location.path('/customizeshop#tab1');


      			}).error(function(err) {
  			     window.alert(err);

   			   });
 

			}
   


   }*/

}]);	

//////////////////////////////////// Controller for Account /////////////////////////////////////////////////////////////
SSApp.controller('accountController',['$scope','$http','Upload','$timeout' ,'$route','$routeParams','$location','UserService','$filter',function($scope,$http,Upload,$timeout,$route,$routeParams,$location,User,$filter)
{      $scope.upclass = 0;
       $scope.SmartPathing = "YOUR ACCOUNT > MY PROFILE";

       var path=$location.search();
	   if(path.uploadClass)
	   {
	   $scope.upclass =path.uploadClass;
	   window.alert(path.uploadClass);
	    		 $http.get('/twitter_profile_image')  //call to retrieve data
								 .success(function(data) {

								   //  $scope.twitterUserProfilePic=data.profile_image_url;
									
									var profile_pic =data;
									$scope.twitterUserProfilePic=profile_pic.replace(/_normal/g,'');  // to make image size normal
									// var word ="_normal"; 
									// var n = profile_pic.toLowerCase().lastIndexOf(word); // get last occurance
                                    // profile_pic = profile_pic.slice(0, n) + profile_pic.slice(n).replace(word, ''); // replace last occurrence of normal to get original sized image
							        // $scope.twitterUserProfilePic=profile_pic;

							}).error(function(err) {
								  console.log(" profile pic not available : " + err);
						});  
	   }
	  /*fb login part*/
	  $scope.login = function() {
			  // configuration object
			  var config = { /* ... */ }

			  $http(config)
			  .success(function(data, status, headers, config) {
				if (data.status) {
				  // succefull login
				  $scope.fbUser.isLogged = true;
				  $scope.fbUser.username = data.username;
				}
				else {
				   $scope.fbUser.isLogged = false;
				  $scope.fbUser.username = '';
				}
			  })
			  .error(function(data, status, headers, config) {
				 $scope.fbUser.isLogged = false;
				$scope.fbUser.username = '';
			  });
			}
	  
	   $scope.$watch('files', function() {  
         //$scope.upload($scope.files);
        });
	  		  // FB.api('/me', function(res) {
                  // var _self = this; 
				 // $scope.$apply(function() { 

				  // $scope.fbUser = _self.user = res; 
				  	   
					    // $scope.passUserDetails = {
					    // "id": $scope.fbUser.id,
					     // "token":$scope.fbAccessToken  
					    // }
					   
					    // $http.post('/fb_profile_pic', $scope.passUserDetails)
                               // .success(function(imgData) {
                
                                    // $scope.fbUserProfilePic =imgData.url;	// it is face book pic url	
   
				                // })
								 // .error(function(err) {
										 // console.log("profile image " + err);
								 // });
								
								
							
			
				  
				 // });

			   // });
            
    
	  function searchuser() {
    
	             $http.get('/user_profile')  //call to retrieve data
                 .success(function(data) {

				 $scope.userprofile={};
					 $scope.userprofile= data; 
					 
					  $scope.byear = $filter('date')(new Date($scope.userprofile.birthDay),
                              'yyyy');
					 
					 	  $scope.bmonth = $filter('date')(new Date($scope.userprofile.birthDay),
                              'MM');
					 	  $scope.bday = $filter('date')(new Date($scope.userprofile.birthDay),
                              'dd');
					 
					      console.log($scope.bmonth);
					 // var birthArr =  $scope.userprofile.birthDay.split("-");
					 // console.log(birthArr);
					 // $scope.bday =birthArr[2];
					 // $scope.bmonth=birthArr[1];
					 // $scope.byear=birthArr[0];
					 
					 $scope.oldpassword =data.password;
					
					 
				
				 }).error(function(err) {
                  window.alert(" profile Error: " + err);
                 });
		   }
	searchuser();
 	
	//------------- update user data -------------------
	$scope.update_user= function()
	{      
			$scope.userprofile.birthDay= $scope.byear +"-"+$scope.bmonth+"-"+$scope.bday; 
			
			$http.post('/update_user_profile', $scope.userprofile)
            .success(function(data) {
                
               window.alert("successfully updated");
			    
				if($scope.userprofile.gender==1)
				{   
				
				  $scope.genderclass =" subnav-li-men"; 
				  $scope.$apply(); 
				}
			   			    

			   	//searchuser();

			   
            })
            .error(function(err) {
                  window.alert("Error: " + err);
            });
			   
		  
	
	}
	
	 $scope.deletepic =function() { 
	 		
			window.alert("deleting");
			$http.post('/delete_user_pic', $scope.userprofile)
            .success(function(data) {
                window.alert(data.img_location);
				$scope.userprofile.img_location= data.img_location;
				$scope.picFile = null;
			    $scope.userinfo.img_location=data.img_location;

            })
            .error(function(err) {
                  window.alert("Error: " + err);
            });
	 
	 
	 }
	 
	     // var myCanvas = document.getElementById('my_canvas_id');
		 // var ctx = myCanvas.getContext('2d');


		 // var img = new Image;
		 // img.onload = function(){
				// ctx.drawImage(img,0,0); // Or at whatever offset you like
			// };
		 
		 // //var strDataURI =$scope.fbUserProfilePic;
		// var strDataURI = document.getElementById("fbImageUrl").value; 
		// img.src = strDataURI;
        // var data = myCanvas.toDataURL('image/png');
		// //$scope.fbImgdata = data;
		
	   // document.getElementById('socialInput').value = data;
       // $scope.facebookImg = data;
	   
	 
	      $http.get('/twitter_profile')  //call to retrieve data
                 .success(function(data) {

				   //  $scope.twitterUserProfilePic=data.profile_image_url;
					$scope.twitterImportUrl=data;
					 
				
				 }).error(function(err) {
                  window.alert(" profile not available : " + err);
                 });  
	// on click import image   
	//$scope.import_twitter_img= function()
	//{

					  
		 
				 
	//} 


	
 $scope.show_img_upload= function(variable)
 {
  

  $scope.progress=0; 
   $scope.upclass = variable;
   $('.upload_picture_popup').toggle();
 
		// var img = new Image;
		// img.src = document.getElementById("fbImageUrl").value; 
		   // img.src =$scope.fbUserProfilePic;
	    // img.src ="http://media02.hongkiat.com/instagram-filters-on-web-images/featured.jpg";
			 
			  // if(myCanvas.getContext)
			  // {
			  
               // ctx.drawImage(img,0,0);			   
			   // ctx.fillRect(0, 0, 100, 100);
				// ctx.strokeStyle = "#000000";
				 // ctx.fillStyle = "#FFFF00";
				 // ctx.beginPath();
				 // ctx.arc(100,100,50,0,Math.PI*2,true);
				 // ctx.closePath();
				 // ctx.stroke();
				// ctx.fill();
				
			         // var data = myCanvas.toDataURL('image/png');
					 // window.alert(data);
                      // document.getElementById('socialInput').value = data;
			          	// $scope.fbImgdata = data;

			   
			   // }
			   
		  
 
 
}
 
    // function that upload social pics 
 
	$scope.uploadPicSocial= function(img_link) {

		
	
	    $scope.imgobj ={"img_url":img_link,"prev_img":$scope.userprofile.img_location};
	             $http.post('/social_img_upload',$scope.imgobj)  //call to retrieve data
                 .success(function(response) {
			
				 
				  $scope.userprofile.img_location=response.img_location;
				  $scope.userinfo.img_location=response.img_location;
				  $scope.upclass = 0;

	         		 }).error(function(err) {
                  		window.alert("can not generated: " + err);
            		});
	// CAN VAS PART
		//$scope.fbImgdata = angular.element('#socialInput').val();
	// $scope.imgdata = angular.element('#p').val();
	 	//$scope.fbImgdata = angular.element('#crp').val();
	// if($scope.fbImgdata!="")
     // {
	 
	 	
	
	    // var file = $scope.fbImgdata; 

		
	     // file.upload = Upload.upload({
	         // url: '/api/photo',
			 // method: 'POST',
	          // data: {
					   // file: Upload.dataUrltoBlob(file),pictype: 'png',email:$scope.userprofile.email, id:$scope.userprofile._id,prev_img:$scope.userprofile.img_location
					
					// }
	 
	     // }).then(function (response) {
					// $timeout(function () {
						// $scope.result = response.data;
						// $scope.userprofile.img_location=response.data.img_location;
						// $scope.userinfo.img_location=response.data.img_location;
					
					
					// });
				// }, function (response) {
					// if (response.status > 0) 
					// $scope.errorMsg = response.status + ': ' + response.data;
				// }, function (evt) {
					// $scope.upclass = 0;
			
					 // $scope.fbImgdata="";
				// });   
	 
	 
	 
	 // } 
	
	
	
	}
 
	$scope.uploadPic2 = function() {
	 
	 $scope.imgdata = angular.element('#p').val();
	 // $scope.htmlReady();
	 if($scope.imgdata!="")
     {	
			var file = $scope.imgdata; 
			 file.upload = Upload.upload({
			  url: '/api/photo',
			  method: 'POST',
			//  data: {file: file, pictype: 'user',id:$scope.userprofile._id,email:$scope.userprofile.email}
			   data: {
					   file: Upload.dataUrltoBlob(file),pictype: 'png',email:$scope.userprofile.email, id:$scope.userprofile._id,prev_img:$scope.userprofile.img_location
					
					}
			}).then(function (response) {
					$timeout(function () {
						$scope.result = response.data;
						$scope.userprofile.img_location=response.data.img_location;
						$scope.userinfo.img_location=response.data.img_location;
						$scope.picFile = null;
					
					
					});
				}, function (response) {
					if (response.status > 0) $scope.errorMsg = response.status 
						+ ': ' + response.data;
				}, function (evt) {
					$scope.progress = parseInt(100.0 * evt.loaded / evt.total);
					$scope.upclass = 0;
					angular.element('#p').val() ="";
					 $( "#photo" ).attr( "src", "" );
					 $scope.imgdata="";
				});
	  }
	  else
	  {
	      window.alert("capture a pic first")
	  }
	 
	 }
   
    //TRYING TO DRAW EXTERNAL IMAGE INSIDE OUR CANVAS
     // var myCanvas = angular.element('#my_canvas_id').val();
    // var ctx = element[0].getContext('2d');

	 // var j= angular.element[0]('#profile_img').val();
	// window.alert(j);
	
	$scope.uploadPic = function(file) {
	
    file.upload = Upload.upload({
      //url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
	  url: '/api/photo',
	  method: 'POST',
	//  data: {file: file, pictype: 'user',id:$scope.userprofile._id,email:$scope.userprofile.email}
	   data: {
               file: Upload.dataUrltoBlob(file),pictype: 'png',email:$scope.userprofile.email, id:$scope.userprofile._id,prev_img:$scope.userprofile.img_location
			
			}
    }).then(function (response) {
            $timeout(function () {
                $scope.result = response.data;
				$scope.userprofile.img_location=response.data.img_location;
                $scope.userinfo.img_location=response.data.img_location;
			    $scope.picFile = null;
			
			
			});
        }, function (response) {
            if (response.status > 0) $scope.errorMsg = response.status 
                + ': ' + response.data;
        }, function (evt) {
            $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
			//$scope.upclass = 0;
			

			
        });
	/*
    file.upload.then(function (response) {
      	
	  $timeout(function () {
        file.result = response.data;
		  $scope.userprofile.img_location=response.data.img_location;


      });
    }, function (response) {
     
	 if (response.status > 0)
        $scope.errorMsg = response.status + ': ' + response.data;
    }, function (evt) {
      // Math.min is to fix IE which reports 200% sometimes
      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    });
    */
	
	
	
	}
 
 
 
}]);	

////////////////////////// controller for shopping bag page /////////////////////////////////////////////////////
SSApp.controller('cartController',['$scope','$sce','$http','$anchorScroll','$cookies','Upload','$timeout' ,'$route','$routeParams','$location','UserService','$interval',function($scope,$sce,$http,$anchorScroll,$cookies,Upload,$timeout,$route,$routeParams,$location,User,$interval)
{

  //$scope.$parent.getCartItems(); // call function of main controller tp get cart items 
  //$scope.$parent.cartTotal();
               
                          //sShoppable.ssDropwdown.ssSelectDrpdwn();
                          

			   if(!angular.isDefined($scope.step))
                $scope.$parent.step=1;
				
               if(!angular.isDefined($scope.tap))
				$scope.$parent.tap = 1;
				 
				 var requestedItems;
	             var obj;
	  
	            var url_product; // url temporary
				var checkoutRequest = {};
		 
		        var ind;
		        var counter = 0; 	
		      //  $scope.shipping_address = {};
			//	$scope.billing_address =  {};
				if(!angular.isDefined($scope.card_details))
				$scope.$parent.card_details ={};

				var quantity_product;
				var sites_arr = [];
				var pro_url;
				var storeProducts = [];
							// return cart and make indexteams as null
				            
				var ramp=[];
				var sikey;
				var md5pro;
				var timeCurrent;
				var sk;
         
				//$scope.$parent.num_items =$scope.cart_items_number;
				// when load it is already defined 
	            // $http.get('/user_profile')  //call to retrieve data
                  // .success(function(data) {

	
					 // $scope.$parent.user_saved_item_id =data.saved_catalogId;
				     // $scope.$parent.saved_item_number = Object.keys(data.saved_catalogId).length;
					         // if($scope.saved_item_number>0)
								   // {
									// var multiID ={ 'mid' : $scope.user_saved_item_id};

								   // $http.post('/productUserMulticatalogID',multiID)
										 // .success(function(data) {
										 // $scope.$parent.user_saved_item =data;
									// })
									// .error(function(err) {
									  // window.alert("Error: " + err);
										// }); 
								  // }
	             // }).error(function(err) {
                   // console.log(" profile Error: " + err);
                  // });
				
					$scope.gotocart=function(url)
					{
                        $anchorScroll();

					}
				  // if($scope.loggedin==1)
				  // {
				  
				  
				  // $http.get('/getsessionForPurchase').success(function(data1) {
                     
			
								  // if(data1)
								  // { 
							  
								                // $scope.shipping_address = data1.d;
												// $scope.billing_address =  data1.d1;
												// $scope.card_details ={};
								  
								  // }
				   
								   // }).error(function(err) 
								   // {
								   
								            
												  // console.log(err+" to get session data")
												  
									// });
		           // }
				   
				   
			$scope.moveToCart= function(product,ItemQuantity,productDetails)
				{
				 
				 $scope.$parent.deleteFromSaveList(product._id,product.catalogId);

				 // $scope.$parent.addToCart(product,ItemQuantity,productDetails);
				
				}
				$scope.set_cartitem_color = function(itemByColor,pro)
				{
					pro =itemByColor;
				}
         
         $scope.$parent.considered_items =[];

            // following loop check distinct stores    
					   
       // $scope.$parent.getcartDistinctRetailer();
       // function that call two tap api and add products inside cart load iframe
       $scope.twotapCheckoutCart =function(step)
		{           
		            
					
		            
					$scope.$parent.step=step;
					
					if(($scope.loggedin==0 || $scope.loggedin===undefined ) && $scope.step==2)
					{
						$scope.$parent.after_login_location='/shoppingbag';
						//$("#loginPopup").modal("show"); 
						//$("#login-popup").modal("show"); 
                       // application.ssLogIn(); 					   
					   sShoppable.user.ssLogIn();
					   
					   $scope.$parent.step=1;
					    return;	
					}
					
					$scope.$parent.num_stores =  $scope.total_cart_distinct_store; 
					var temp_changed =$scope.shoppingbag_cart_changed;  
					if(angular.isDefined($scope.twotap_builtin_cart) && $scope.ck_all)
					{ 
					   if($scope.step==2)
					   {
					      $scope.$parent.tap = 0;
					       $location.path('/scheckout');
						  $route.reload();
					   }
					
					return;
					}
					else if(angular.isDefined($scope.twotap_builtin_cart) && !($scope.ck_all)) // it's come from check out single
					{ 
					   if($scope.step==2)
					   {
					       $scope.$parent.tap = 1;
					       $scope.$parent.step=1;
					   }
					
					}
					
					
					$scope.$parent.ck_all =true;
					//incase cart already defined before
					
					
					
					if(!temp_changed && angular.isDefined($cookies['shoppingbag_cart_id']))
					 {
					 
					 	 if(angular.isDefined($cookies['shoppingbag_cart_id']))
						 {
						 
                            						 
						 get_cart_status($cookies['shoppingbag_cart_id'],-1);
						 if($scope.step==2)
					     {
					     $scope.$parent.tap = 0;
						  $location.path('/scheckout');
						  $route.reload();
					     }
						 return;
						 
						 }
						 
					 }   
					$scope.itemQuantity=[]; 
                    checkoutRequest = {};
					obj= $scope.userprofile2;     // my custom cart data 
					url_product="";
					counter = 0; 							// keeping product url 
					  
                    requestedItems=[];
					// using following loop we generate json object for the product 
				      if (!Date.now) 
						 {
					        timeCurrent = function now() 
							{
						    return new Date().getTime();
				            }
				         }
						else
						{
						timeCurrent= Date.now();   
						}
					  
					  $scope.$parent.considered_items =[];
					  $scope.$parent.num_items =0;
					  for(var t in obj)
					  {
                          url_product= obj[t].chkout_url;  
                          quantity_product=obj[t].quantity;
                          $scope.itemQuantity.push({ 'url': url_product,'affiliate_link': url_product,'quantity':quantity_product}); // define json object
                          $scope.$parent.considered_items.push(obj[t]);
						  requestedItems.push(url_product); // make an array of product url
						  $scope.$parent.num_items = $scope.num_items + quantity_product;
						  counter=counter+1;  

					  }
          	            
						
						checkoutRequest['public_token'] =$scope.twotap_public_token ;
						checkoutRequest['products'] = JSON.stringify($scope.itemQuantity); // adding product urls
						checkoutRequest['custom_css_url'] = '';
                        //checkoutRequest['confirm'] = { method: 'sms', sms_confirm_url: '<%- smsConfirmURL %>' }
						checkoutRequest['confirm'] = { method: 'http', http_confirm_url: 'http://45.55.138.4/confirm', http_finished_url: 'http://45.55.138.4/finish' };
                        checkoutRequest['unique_token'] = (Math.floor(Math.random()* timeCurrent * 9999999) + 1).toString();
						checkoutRequest['test_mode'] = 'fake_confirm';
					
                     // request  for checkout in iframe 
					jQuery.post('https://checkout.twotap.com/prepare_checkout', { checkout_request: checkoutRequest }, function(data) {
					 
	
					  
					  // Point an iFrame to that URL.
					$('#ttIframe').attr('src', data['url']); // setting an id's src 
						$scope.links =$sce.trustAsResourceUrl(data['url']);
						$scope.$apply();
					}); // end of jquery post
				  
				
                         
						 if(requestedItems.length==0)
						 {
						 console.log("no item inside cart");
						 return;
						 }
						 
						 pro_url = { product_urls : requestedItems }; 
              
					
						$http.post('/twotap_cart',pro_url).success(function(data)
						{         
							
                           

							$scope.$parent.twotap_builtin_cart = data.productCartDetails;
						    $scope.$parent.twotap_builtin_cart.product_urls =[];
							 if($scope.step==2)
							 $scope.$parent.tap=0;
							 
							 
							 sites_arr = [];
							 for(skey in $scope.twotap_builtin_cart.sites)
								  {  
									sites_arr.push(skey);
									$scope.$parent.shipping_chrg[skey]={};						
								  } 
							 $scope.$parent.s_array =sites_arr;  //make an array of sites
							 $scope.$parent.num_stores = $scope.s_array.length;
							 
							 storeProducts = [];
							// return cart and make indexteams as null
				            
							ramp=[];
							sikey="";
							md5pro="";
							var number_of_products=0;
							var store_id;
							
							
							var quantity_store_wise=0;
							var distinct_site_key;
							for(var t=0;t<$scope.cartDistinctStore.length;t++)
							{
							
							quantity_store_wise = $scope.cartDistinctStore[t].quantity;
							distinct_site_key =$scope.cartDistinctStore[t].site_key;
							
							 $scope.$parent.twotap_builtin_cart.sites[distinct_site_key].quantity_store_wise=quantity_store_wise;
							}
							var temp_aff="";
							var clean_url="";
							var jjj={};
							$scope.$parent.num_items =0;
							
							for(var n=0;n<$scope.s_array.length;n++)
							{
								sikey = $scope.s_array[n]; // target one site 
								number_of_products=0;
							      for(md5pro in $scope.twotap_builtin_cart.sites[sikey].add_to_cart)
								  {  
								      
									   for(var p=0;p<$scope.userprofile2.length;p++ )
									   {     
									   
									      if($scope.userprofile2[p].site_key==sikey)
											{
											
											
												   
												 if($scope.userprofile2[p].productMD5==md5pro)
												 {
												  $scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.quantity=$scope.userprofile2[p].quantity;
												  $scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].quantity=$scope.userprofile2[p].quantity;
												  $scope.$parent.num_items =$scope.num_items+$scope.userprofile2[p].quantity;
												  
												  $scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].brand=$scope.userprofile2[p].product[0].brand;
												   // $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.size=$scope.userprofile2[p].size;
												   // $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color=$scope.userprofile2[p].color;
												   // $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.option=$scope.userprofile2[p].option;  
   
   
                                                  if(angular.isDefined($scope.userprofile2[p].required_field_values.size))
												  {
												  $scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].size=$scope.userprofile2[p].required_field_values.size;

												 }

												  if(angular.isDefined($scope.userprofile2[p].required_field_values.color))
												  { 
												  
												  
												  $scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].color=$scope.userprofile2[p].required_field_values.color;
												  // $scope.reset_size_list($scope.twotap_builtin_cart,$scope.userprofile2[p].required_field_values.color,-2);
												  var i=0;
			                                      var num=-1;
			                                      for (i=0;i<$scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color.length;i++ )
														{
														
														   if($scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[i].value == $scope.userprofile2[p].required_field_values.color)
															{
															  num = i;
															  break;
															}
														}
														$scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.size = $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[num].dep.size; 


												  
												  
												  } 
												    if(angular.isDefined($scope.userprofile2[p].required_field_values.option))
													$scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].option=$scope.userprofile2[p].required_field_values.option;
												
											//$scope.twotap_builtin_cart.affiliate_links[sikey] = $scope.userprofile2[p].twoTapAffiliateLink;
													temp_aff = $scope.userprofile2[p].twoTapAffiliateLink;
												
													
													$scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].affiliate_links=temp_aff;
													clean_url = $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].clean_url;
													
                                                   //  $scope.twotap_builtin_cart.product_urls.push(clean_url);

												// [sikey][md5pro]
												}
												  
												 
											  
											}
									   
									   }	
							     }  
							}
							
					
							
							  
							$scope.$parent.twotap_builtin_cart.shipping = $scope.shipping_address;
							$scope.$parent.twotap_builtin_cart.billing = $scope.billing_address;
							$scope.$parent.twotap_builtin_cart.card =$scope.card_details;
					
						     
							 //if(data.availability) 
							 //{
							 $scope.estimateFunction($scope.twotap_builtin_cart,-1,$scope.considered_items);
							 $scope.$parent.shoppingbag_cart_changed = false; // 
						     $cookies['shoppingbag_cart_id'] = data.cart_id; 
						    

							 
							 //}
							   if($scope.step==2)
									  {
									  
									  $scope.$parent.tap = 0;
									  $location.path('/scheckout');
									  $route.reload();
									  }	 
//////////////////////VVIMP///////////////////////////////////////////////
							
							setTimeout(function() {
								sShoppable.ssDropwdown.ssSelectDrpdwn();
								sShoppable.ssCustomScroll.ssCustomScrollbar();
							},1000)
						 })

      
		}
		 // purchase attempt			
		
		 
        $scope.twotapCheckoutMerchantWise =function(merchant)
		{  
                   
					 
					  if($scope.ck_all)   // previous step is user in checkout all page
					 {
					 $scope.$parent.step=1;
					 $scope.$parent.ck_all =false;
 
                     }
					 else
					  {
						  if($scope.step==1)
						  {
						    $scope.$parent.step=2;
						  }
					  }
					 
					 
					  $scope.$parent.num_stores = 1; // when checking out single
					  $scope.itemQuantity=[]; 
                      checkoutRequest = {};
					  obj= $scope.userprofile2;     // my custom cart data 
					  $scope.$parent.considered_items =[];
					  counter = 0; 							// keeping product url 
                      // using following loop we generate json object for the product 
					 quantity_product=0;
					 requestedItems=[];
					  url_product ="";
					     if (!Date.now) 
						 {
					        timeCurrent = function now() 
							{
						    return new Date().getTime();
				            }
				         }
						else
						{
						timeCurrent= Date.now();   
						}
					  var r_ind;
					 $scope.$parent.num_items = 0;
					  for(var t in obj)
					  {
                      
						  if(obj[t].retailer==merchant) 
                          {
						  url_product= obj[t].chkout_url; 
						  requestedItems.push(url_product); // make an array of product url
					      $scope.$parent.considered_items.push(obj[t]);
						  quantity_product=obj[t].quantity;
						  $scope.itemQuantity[counter]={ 'url': url_product, 'quantity':quantity_product}; // define json object
                           $scope.$parent.num_items = $scope.num_items + quantity_product;
						  counter=counter+1;  
					     
						  }
					  }
					  
					  // find retailer index of distinct cart
					 
			
          	            
						checkoutRequest['public_token'] =$scope.twotap_public_token ;
						checkoutRequest['products'] = JSON.stringify($scope.itemQuantity); // adding product urls
						checkoutRequest['custom_css_url'] = '';
						checkoutRequest['confirm'] = { method: 'http', http_confirm_url: 'http://45.55.138.4/confirm', http_finished_url: 'http://45.55.138.4/finish' };
                        checkoutRequest['unique_token'] = (Math.floor(Math.random()* timeCurrent * 9999999) + 1).toString();
						checkoutRequest['test_mode'] = 'fake_confirm';
					
                     // request  for checkout in iframe 
					jQuery.post('https://checkout.twotap.com/prepare_checkout', { checkout_request: checkoutRequest }, function(data) {
					  
					  // Point an iFrame to that URL.
					$('#ttIframe').attr('src', data['url']); // setting an id's src 
					//$scope.links = data.url;
						$scope.links =$sce.trustAsResourceUrl(data['url']);
						$scope.$apply();
					}); // end of jquery post
				  
				  if(($scope.loggedin==0 || $scope.loggedin===undefined ) && $scope.step==2)
					{
						$scope.$parent.after_login_location='/shoppingbag';
						
						$("#login-popup").modal("show"); 
					
					
					
					}
                    else
					{
	                     if(requestedItems.length==0)
						 {
						 console.log("no item inside cart");
						 
						 window.alert("no item inside cart. Try checkout all");
						 
						 return;
						 }
						pro_url = { product_urls : requestedItems }; 
						$http.post('/twotap_cart',pro_url).success(function(data)
						{         
							 
						//$scope.twotap_builtin_cart = data.productCartDetails;

							 $scope.$parent.tap=0;
							
							
							 $scope.$parent.twotap_builtin_cart = data.productCartDetails;
							// $scope.twotap_builtin_cart.product_urls =[];
						
							 sites_arr = [];
                             sk="";					
						 
							 
							 //$scope.s_array =sites_arr;  //make an array of sites
							storeProducts = [];
							// // return cart and make indexteams as null
				            
							ramp=[];
							sikey="";
							md5pro="";
							var i;
							var num;
							for(var skeyT in $scope.twotap_builtin_cart.sites)
								  {  
									sikey = skeyT;
															
								  } 
							
							
								
							      for(md5pro in $scope.twotap_builtin_cart.sites[sikey].add_to_cart)
								  {  
								     
									   for(var p=0;p<$scope.userprofile2.length;p++ )
									   {     
									   
									      if($scope.userprofile2[p].site_key==sikey)
											{
											
												 if($scope.userprofile2[p].productMD5==md5pro)
												  {
												 
												 
												  $scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.quantity=$scope.userprofile2[p].quantity;
												   $scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].quantity=$scope.userprofile2[p].quantity;
												   // $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.size=$scope.userprofile2[p].size;
												   // $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color=$scope.userprofile2[p].color;
												   // $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.option=$scope.userprofile2[p].option;  
												  	if(angular.isDefined($scope.userprofile2[p].required_field_values.size))
												    $scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].size=$scope.userprofile2[p].required_field_values.size;
												  
                                                   if(angular.isDefined($scope.userprofile2[p].required_field_values.color))
												    {
												      
					  
												  $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].color=$scope.userprofile2[p].required_field_values.color;

												  var i=0;
			                                      var num=-1;
			                                      for (i=0;i<$scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color.length;i++ )
														{
														
														   if($scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[i].value == $scope.userprofile2[p].required_field_values.color)
															{
															  num = i;
															  console.log(num);
															  $scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].color = $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[i].value;
															  
															  break;
															}
														}
														$scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.size = $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[num].dep.size; 

													
													}
													
													
																					
													
  												    if(angular.isDefined($scope.userprofile2[p].required_field_values.option))
												   $scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].option=$scope.userprofile2[p].required_field_values.option;

										
													$scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].affiliate_links=$scope.userprofile2[p].twoTapAffiliateLink;
													

												//   $scope.twotap_builtin_cart.product_urls.push($scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].clean_url);
												  
												  }
											  
											};
									   
									   }	
							     }  
							 $scope.shipping_countries_support = $scope.$parent.twotap_builtin_cart.sites[sikey].shipping_countries_support;
						     $scope.billing_countries_support =$scope.$parent.twotap_builtin_cart.sites[sikey].billing_countries_support;
					 
							
							
							for(var t=0;t<$scope.cartDistinctStore.length;t++)
							{
							
								if($scope.cartDistinctStore[t].retailer==merchant)
								{
								quantity_store_wise = $scope.cartDistinctStore[t].quantity;
								distinct_site_key =$scope.cartDistinctStore[t].site_key;
								
								 $scope.$parent.twotap_builtin_cart.sites[distinct_site_key].quantity_store_wise=quantity_store_wise;
								 r_ind =t; // which index we are working with 
								 break;
								}
							
							
							}
							
		
							// return cart and make indexteams as null
				            // following return session data
                     
			
										 		$scope.$parent.twotap_builtin_cart.shipping = $scope.shipping_address;
							                    $scope.$parent.twotap_builtin_cart.billing = $scope.billing_address;
										        $scope.$parent.twotap_builtin_cart.card =$scope.card_details;
				
						 // if(data.availability) 
							 // {
							 $scope.estimateFunction($scope.twotap_builtin_cart,r_ind,$scope.considered_items);
						     
						     // }
							 
							 

							 
							 
							   if($scope.step==2)
									  {
									  $scope.$parent.tap = 0;

									  $location.path('/scheckout');
									  $route.reload();
									  }	 
							 
							 
						 })

                    }

						

		
		}		
// calculate price 


                   $http.get("https://linksearch.api.cj.com/v2/link-search?website-id=7095303&advertiser-ids=2609575&link-type=Text+Link&promotion-type=coupon&page-number=1&records-per-page=20")
                    .then(function(response){
					
					console.log(response.data);
					
					})

					$scope.return_policy=function(return_info)
					{

						  $scope.$parent.return_info= return_info;
						  $scope.$apply();

					}

 $scope.priceEstimationMerchantWise =function(merchant,index)
		{  
					 $scope.itemQuantity=[]; 
                      checkoutRequest = {};
					  obj= $scope.userprofile2;     // my custom cart data 
					  $scope.considered_items =[];
					  counter = 0; 							// keeping product url 
					  
                      // using following loop we generate json object for the product 
					
					quantity_product=0;
					requestedItems=[];
					 // using following loop we generate json object for the product 
					  url_product ="";

					     if (!Date.now) 
						 {
					        timeCurrent = function now() 
							{
						    return new Date().getTime();
				            }
				         }
						else
						{
						timeCurrent= Date.now();   
						}
					  
					  for(t in obj)
					  {
                          if(obj[t].retailer==merchant) 
                          {
						  url_product= obj[t].chkout_url; 
						  requestedItems.push(url_product); // make an array of product url
					      $scope.considered_items.push(obj[t]);
						  quantity_product=obj[t].quantity;
                          $scope.itemQuantity[counter]={ 'url': url_product, 'quantity':quantity_product}; // define json object
                          counter=counter+1;  
					      
						  
						  }
					  }
          	            
						
						checkoutRequest['public_token'] =$scope.twotap_public_token ;
						checkoutRequest['products'] = JSON.stringify($scope.itemQuantity); // adding product urls
						checkoutRequest['custom_css_url'] = '';
				 
				 if(requestedItems.length==0)
						 {
						 console.log("no item inside cart");
						 
						 window.alert("no item inside cart.");
						 
						 return;
						 }	
			    if($scope.tap==0)
					 {
					 
					 console.log("already added to cart ");
					 $scope.estimateFunction($scope.twotap_builtin_cart,-1,$scope.considered_items); // as full cart is there 
					 return;
					 }
			         
					pro_url = { products : requestedItems }; 
			        add_product_into_cart(pro_url,index);
			
		}
		
		function add_product_into_cart(pro_url,index)
		{
		
		 var CART_ID;
		 var status_coming=false;
		
		$http.post("https://api.twotap.com/v1.0/cart?public_token=" + $scope.twotap_public_token,pro_url)
                    .then(function(response){ 
					$scope.details = response.data; 
					CART_ID= response.data.cart_id;
					var stop;
					var timer=0;
          // Don't start a new fight if we are already fighting
					if (angular.isDefined(stop) ) return;
					var valid =false;

					  stop = $interval(function() {
					  
					  if(!valid)  
					  {
					   $http.get("https://api.twotap.com/v1.0/cart/status?public_token="+$scope.twotap_public_token+"&cart_id="+CART_ID).then(function(response2) {
						//
						
						if(response2.data.message!="still_processing" || timer>300000)
						{
							  $scope.stopFight();			
							  valid= true;
							  if(response2.data.message=="done")
							  {
								 $scope.estimateFunction(response2.data,index,$scope.considered_items); // product added to cart now call estimation function
							  
							  }
							 
						
						}
						console.log(response2.data);
					   
					   })
					  
					   }
					  
					  timer=timer+3000;
					  
					  
					  }, 3000);
  

  
  
					});
		}
		// use cart id to build cart
		function get_cart_status(CART_ID,index)
		{
		  
		  var t;
		  var quantity_product;
		 $http.get("https://api.twotap.com/v1.0/cart/status?public_token="+$scope.twotap_public_token+"&cart_id="+CART_ID).then(function(response) {
						
						
						if(response.data.message!="still_processing")
						{
							    
							   $scope.$parent.twotap_builtin_cart =response.data;
							  	 var obj = $scope.userprofile2; 
								 
                                  $scope.$parent.num_items =0;    
								  $scope.$parent.considered_items =[];

								 for(t in obj)
								  {
								  
									  $scope.$parent.considered_items.push(obj[t]);
									  quantity_product=obj[t].quantity;
									  // $scope.itemQuantity[counter]={ 'url': url_product, 'quantity':quantity_product}; // define json object
									  // counter=counter+1;  
									    $scope.$parent.num_items = $scope.num_items + quantity_product;
									  
									 
								  }
							  
							  
							  if(response.data.message=="done")
							  {
								 
							var quantity_store_wise=0;
							var distinct_site_key;
								for(var l=0;l<$scope.cartDistinctStore.length;l++)
								{
								
								quantity_store_wise = $scope.cartDistinctStore[l].quantity;
								distinct_site_key =$scope.cartDistinctStore[l].site_key;
					
								 $scope.$parent.twotap_builtin_cart.sites[distinct_site_key].quantity_store_wise=quantity_store_wise;
								}
								 var temp_changed = $scope.shoppingbag_cart_changed;
								
//// when nothing changed inside cart use cart id to get cart items 
					if(!temp_changed)
						{
								 
          
							
							var sikey="";
							var md5pro="";
							var number_of_products=0;
							
							
							for(var n=0;n<$scope.s_array.length;n++)
							{
								sikey = $scope.s_array[n]; // target one site 
								number_of_products=0;
							      for(md5pro in $scope.twotap_builtin_cart.sites[sikey].add_to_cart)
								  {  
								      
									   for(var p=0;p<$scope.userprofile2.length;p++ )
									   {     
									   
									      if($scope.userprofile2[p].site_key==sikey && $scope.userprofile2[p].productMD5==md5pro)
											{
												   
												 
							
							
				
											
											

												 $scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].quantity=$scope.userprofile2[p].quantity;
												  $scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.quantity=$scope.userprofile2[p].quantity;
												   // $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.size=$scope.userprofile2[p].size;
												   // $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color=$scope.userprofile2[p].color;
												   // $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.option=$scope.userprofile2[p].option;  
   
   
                                                  if(angular.isDefined($scope.userprofile2[p].required_field_values.size))
												  {
												  $scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].size=$scope.userprofile2[p].required_field_values.size;
                                                  console.log($scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].size);
                                                  } 
												  if(angular.isDefined($scope.userprofile2[p].required_field_values.color))
												  {
												  $scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].color=$scope.userprofile2[p].required_field_values.color;
												  
												  // $scope.reset_size_list($scope.twotap_builtin_cart,$scope.userprofile2[p].required_field_values.color,-2);
													var i=0;
													var num=-1;
			                                      for(i=0;i<$scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color.length;i++ )
														{
														
														   if($scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[i].value == $scope.userprofile2[p].required_field_values.color)
															{
															  num = i;
															  break;
															}
														}
														$scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.size = $scope.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].required_field_values.color[num].dep.size; 

												  } 
												    if(angular.isDefined($scope.userprofile2[p].required_field_values.option))
													$scope.$parent.twotap_builtin_cart.sites[sikey].add_to_cart[md5pro].option=$scope.userprofile2[p].required_field_values.option;

												  
												 
											  
												
											} 
										}	
									}  
							}
							
							  
							$scope.$parent.twotap_builtin_cart.shipping = $scope.shipping_address;
							$scope.$parent.twotap_builtin_cart.billing = $scope.billing_address;
							$scope.$parent.twotap_builtin_cart.card =$scope.card_details;
					
							
						
							$scope.estimateFunction(response.data,index,$scope.considered_items); // product added to cart now call estimation function
									  if($scope.step==2)
									  {
									  $scope.$parent.tap = 0;
									  $location.path('/scheckout');
									  $route.reload();
									  }	 
								 /////////////////////////////
								 }
								 
							  
							  }
							 
						
						}
					    else
						window.alert("still processing ");
						
						
					   })
		}
 // calculate estimate 
 $scope.estimateFunction = function(data,index,itemlist)
   {
    var site_arraysite_array=[];
	var coupons =[];

	for(var sitekey in data.sites)
        {  
		site_arraysite_array.push(sitekey);              // insert all sites inside an array
		
		}

       var para_json =  { "cart_id": data.cart_id,
	                     "fields_input" :{},
						
						}
		var shoption ="cheapest";
		var cart_by_site;
		var product_key_md5;
		var j;
		
		for(var counter=0;counter<site_arraysite_array.length;counter++) // for one site 
			 {
                 siteskey =site_arraysite_array[counter]; // getting single site
                  coupons =[];  // coupon is array for each site there will be one array
				
				  
				  
				  // if($scope.tap==1)
				  // {
					  
					  // if(index>0)
					  // counter= index;
					  
					  // if($scope.cartDistinctStore[counter].coupon1!="" || $scope.cartDistinctStore[counter].coupon1!=undefined)
					  // coupons.push($scope.cartDistinctStore[counter].coupon1);
						
					  // if($scope.cartDistinctStore[counter].coupon2!="" || $scope.cartDistinctStore[counter].coupon2!=undefined)
					  // coupons.push($scope.cartDistinctStore[counter].coupon2);

					   // if($scope.cartDistinctStore[counter].coupon3!="" || $scope.cartDistinctStore[counter].coupon3!=undefined)
					  // coupons.push($scope.cartDistinctStore[counter].coupon3);
						
					  // if($scope.cartDistinctStore[counter].coupon4!="" || $scope.cartDistinctStore[counter].coupon4!=undefined)
					  // coupons.push($scope.cartDistinctStore[counter].coupon4);
					
					  	// if(angular.isDefined($scope.cartDistinctStore[counter].shoption))
					   // {
					     // shoption = $scope.cartDistinctStore[counter].shoption;
					   // }
					
					// }
				   // else
				   // {
				   if($scope.twotap_builtin_cart.sites[siteskey].coupon1)
							{
								if($scope.twotap_builtin_cart.sites[siteskey].coupon1!="")
								{
								coupons.push($scope.twotap_builtin_cart.sites[siteskey].coupon1);
								
								}
					        }
							if($scope.twotap_builtin_cart.sites[siteskey].coupon2)
							{
								if($scope.twotap_builtin_cart.sites[siteskey].coupon2!="")
								{
								coupons.push($scope.twotap_builtin_cart.sites[siteskey].coupon2);
								
								}
							}	
							
							if($scope.twotap_builtin_cart.sites[siteskey].coupon3)
							{
								if($scope.twotap_builtin_cart.sites[siteskey].coupon3!="")
								{
								coupons.push($scope.twotap_builtin_cart.sites[siteskey].coupon3);
								
								}
							}
							if($scope.twotap_builtin_cart.sites[siteskey].coupon4)
							{
								if($scope.twotap_builtin_cart.sites[siteskey].coupon4!="")
								{
								coupons.push($scope.twotap_builtin_cart.sites[siteskey].coupon4);
								
								}
					        }
				   						
										console.log($scope.twotap_builtin_cart.sites[siteskey].shipping_options);
										
										if(angular.isDefined($scope.twotap_builtin_cart.sites[siteskey].shipping_option))
										shoption = $scope.twotap_builtin_cart.sites[siteskey].shipping_option;
                                        else
										{
										   var found_ship=false;
										   angular.forEach($scope.twotap_builtin_cart.sites[siteskey].shipping_options, function(shipvalue, shipkey) {

										   
										         if(!found_ship)
												 {
												 $scope.twotap_builtin_cart.sites[siteskey].shipping_option=shipkey;
	      										 shoption = $scope.twotap_builtin_cart.sites[siteskey].shipping_option;
												 }
												 if(shipkey=='cheapest')
											      {
												  
													found_ship = true;
												  
												  }
												  else if(shipkey=='default')
											      {
												  
													found_ship = true;
												  
												  }
												  
											   
												
												  
												  
											  });
										}
				   
				   // }
				   
				   var address_user={};
				   
				   
				    if(angular.isDefined($scope.shipping_address))
					address_user = 	{  
								"shipping_address": $scope.shipping_address.address,
								"shipping_city": $scope.shipping_address.city,
								"shipping_state": $scope.shipping_address.state,
								"shipping_country" : $scope.shipping_address.country,
								"shipping_zip": $scope.shipping_address.shipping_zip
								};
					
					
					if(angular.isDefined(shoption))
					{
					
						para_json.fields_input[siteskey] = {
								"noauthCheckout": address_user
							      ,
								  "addToCart": {
										 // product_md5 will be dynamic
								 },
								 "coupons": coupons,
							     "shipping_option" : shoption  
							}
					
					}
					else
					{
					para_json.fields_input[siteskey] = {
								"noauthCheckout": address_user
								,
								  "addToCart": {
										 // product_md5 will be dynamic
								 },
								 "coupons": coupons
							}
					
					
					}
					
					
				  
				    cart_by_site =  data.sites[siteskey].add_to_cart; // each site have single add to cart
				     j=0;  
				    	for(product_key_md5 in cart_by_site) // each cart have multiple product key md5
						{
						para_json.fields_input[siteskey]["addToCart"][product_key_md5] ={};
						   
					
						   for(j=0;j<itemlist.length;j++)
						     {
							    
								 if(itemlist[j].productMD5==product_key_md5)
							       {
								
									if ("quantity" in itemlist[j]["required_field_values"])
									 {
										para_json.fields_input[siteskey]["addToCart"][product_key_md5]["quantity"] = itemlist[j].quantity;
									 }	   
									if ("size" in itemlist[j]["required_field_values"])
									  {
									  para_json.fields_input[siteskey]["addToCart"][product_key_md5]["size"] =itemlist[j]["required_field_values"].size;
									  }
									  if ("color" in itemlist[j]["required_field_values"])
									  para_json.fields_input[siteskey]["addToCart"][product_key_md5]["color"] = itemlist[j]["required_field_values"].color;
							 
									  if("option" in itemlist[j]["required_field_values"])
									  para_json.fields_input[siteskey]["addToCart"][product_key_md5]["option"] =  itemlist[j]["required_field_values"].option;
							 

										itemlist.splice(j, 1);    // remove the item when done to reduce the array

								     break; 
								   
								   
								   
								   }
							 
							 }
						 
						}
			  
			           
			  
			  }

	$http.post("https://api.twotap.com/v1.0/cart/estimates?public_token="+$scope.twotap_public_token, para_json).then(function(response3) { 
		
		var n;
		var siter_id;
		var shipping_method;
		
		if(index>-1) // individual checkout
		{
		
		 siter_id =$scope.cartDistinctStore[index].site_key;
		$scope.cartDistinctStore[index].estimation = response3.data; // used to update individual estimation
		$scope.cartDistinctStore[index].estimationCalled = true; 
        $scope.cartDistinctStore[index].estimates =response3.data.estimates[siter_id];
        
	    if(angular.isDefined($scope.twotap_builtin_cart))
		 $scope.$parent.twotap_builtin_cart.sites[siter_id].estimates =  response3.data.estimates[siter_id];
	
		$scope.$parent.estimated_price_totals =response3.data.estimated_price_totals;
		
		} 
		else
		{
		
		for(n=0;n<$scope.cartDistinctStore.length;n++)
		{
		 siter_id = $scope.cartDistinctStore[n].site_key;
		 $scope.cartDistinctStore[n].estimation = response3.data.estimates[siter_id];
		
		}
		var current_sitevalid_coupons;
		$scope.valid_coupons =0;
		$scope.valid_coupon_store=0;
		var atleast_one_coupon_store=false; // how many store for coupons 
		
		
		for(var p=0;p<site_arraysite_array.length;p++)
		{
		 
		 atleast_one_coupon_store=false;
		 siter_id = site_arraysite_array[p];
		 
		 $scope.twotap_builtin_cart.sites[siter_id].estimates =  response3.data.estimates[siter_id];
		
		 for(var coup in response3.data.coupons[siter_id])
		   {
		     if(response3.data.coupons[siter_id][coup].status=="valid")
		       {
			    $scope.valid_coupons = $scope.valid_coupons+1;
			    atleast_one_coupon_store=true;
			   }
		   }
		  
		   shipping_method = $scope.twotap_builtin_cart.sites[siter_id].shipping_option;
		   
		 
		   $scope.$parent.shipping_chrg[siter_id][shipping_method] = response3.data.estimates[siter_id].prices.shipping_price; 
		   console.log($scope.shipping_chrg[siter_id][shipping_method]);
		   if(atleast_one_coupon_store)
		   {
		   $scope.valid_coupon_store= $scope.valid_coupon_store+1;
		   }
		
		}
		
		$scope.$parent.estimated_price_totals =response3.data.estimated_price_totals;
        console.log(response3.data);
		
		}
		
	
	});
					
   }           
   // stop interval
   $scope.stopFight = function() {
          if (angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;
          }
        };
	  
	  //destroy interval 
	  $scope.$on('$destroy', function() {
          // Make sure that the interval is destroyed too
          $scope.stopFight();
		  $scope.$parent.purchase_button ="";
        });
  // var purchase_check;
  // $scope.stopPurchaseCheck = function() {
          // if (angular.isDefined(purchase_check)) {
            // $interval.cancel(purchase_check);
            // purchase_check = undefined;
          // }
        // };
		
		// purchase operation 
		$scope.twotapPurchase = function()
			 {
				//First check user is logged in to purchase
				if(angular.isDefined($scope.loggedin))
				{ 
				  if($scope.loggedin==0)
				   {
				   
				      	$scope.messageError="Logged in to purchase ";

				       return;
				   
				   }
				
				
				}
				
				else
				{
				$scope.messageError="Logged in to purchase ";

				return;
				}
				
				  if($scope.purchase_complete =="still_processing")  // try to purchase with error 
			      {
			          $scope.messageError=$scope.messageError+"\n Already one purchase ongoing.. /n Current Purchase "+purchase_id;
			           console.log($scope.messageError);
			           return; // internal one purchase going on 
			     }
				
				
				$scope.$parent.purchase_button ="disabled";
				$scope.messageError ="";
				$scope.messageFinal="";
		            //$scope.shipping_countries_support = $scope.twotap_builtin_cart.sites[sikey].shipping_countries_support;
					//$scope.billing_countries_support =$scope.twotap_builtin_cart.sites[sikey].billing_countries_support;
					 
							
				
						
                    var valid= true; 
					var temp_siteid;
			        var b_arr =[];
					var s_arr =[];
					var user_shipping_country = $scope.twotap_builtin_cart.shipping.country;
					var user_billing_country = $scope.twotap_builtin_cart.billing.country; 
					var ind;
					var bind;
                        if(!angular.isDefined($scope.s_array) || !($scope.ck_all))
                          {
						   var tid;
							   for(temp_siteid in $scope.twotap_builtin_cart.sites)
							   {
									ind =-1;
									bind=-1;
									s_arr = $scope.twotap_builtin_cart.sites[temp_siteid].shipping_countries_support;
									b_arr =$scope.twotap_builtin_cart.sites[temp_siteid].billing_countries_support;

									ind= s_arr.indexOf(user_shipping_country);
									if(ind==-1)
									{
									$scope.messageError= $scope.messageError+ "\n your shipping address is not supported by "+$scope.twotap_builtin_cart.sites[temp_siteid].info.name;
									valid = false;
									}
									bind = b_arr.indexOf(user_billing_country);
									if(bind==-1)
									{
									$scope.messageError= $scope.messageError+ "\n your billing address is not supported by "+$scope.twotap_builtin_cart.sites[temp_siteid].info.name;
									valid = false;
									
									}
								
								   
							   }
						   console.log("site array not defined ");
						  }  
						else
						{
						for(var n=0;n<$scope.s_array.length;n++)
							{
								ind =-1;
								bind=-1;
								temp_siteid =  $scope.s_array[n];
								s_arr = $scope.twotap_builtin_cart.sites[temp_siteid].shipping_countries_support;
								b_arr =$scope.twotap_builtin_cart.sites[temp_siteid].billing_countries_support;

								ind= s_arr.indexOf(user_shipping_country);
								if(ind==-1)
								{
								$scope.messageError= $scope.messageError+ "\n your shipping address is not supported by "+$scope.twotap_builtin_cart.sites[temp_siteid].info.name;
								valid = false;
								}
								bind = b_arr.indexOf(user_billing_country);
								if(bind==-1)
								{
								$scope.messageError= $scope.messageError+ "\n your billing address is not supported by "+$scope.twotap_builtin_cart.sites[temp_siteid].info.name;
								valid = false;
								
								}
							}
                          } 
 var purchase_id;
	
 if(valid)   // check whether valid address
   {
	
	$http.post('https://api.twotap.com/v1.0/fields_input_validate',{'shipping_first_name':$scope.twotap_builtin_cart.firstname,'shipping_last_name':$scope.twotap_builtin_cart.lastname, 'shipping_address' : $scope.twotap_builtin_cart.shipping.address,
	'shipping_city': $scope.twotap_builtin_cart.shipping.shipping_city, 'shipping_state': $scope.twotap_builtin_cart.shipping.shipping_state,"shipping_country": $scope.twotap_builtin_cart.shipping.country
	
	}).then(function(resp){ 
			if(resp.data.message=='done')
	        {
			
		
				   $http.post('/purchase',{'product_urls' : requestedItems,'user_cart': $scope.twotap_builtin_cart })
				  .then(function(response){ 
				  
										window.alert("order placed");
										
										$scope.$parent.purchase_complete ="still_processing";	  							
										$scope.details = response.data; 
										 if(response.data.message=="bad_required_fields")
										{
										$scope.messageError=response.data;
										 
										 $scope.$parent.purchase_complete ="failed";
										 $scope.$parent.purchase_button =""; 
										return;
										} 
										 
						$scope.messageFinal =response.data;
										 
										 
					   purchase_id = response.data.purchase_id;
					   $scope.$parent.current_purchase_id =purchase_id;
				
					  // Don't start a new purchase if we there is already purchase processing 
					   if(angular.isDefined(purchase_id))
					   $scope.$parent.purchase_process(purchase_id);
					
					},function(response){ console.log(response.data); 
					
					$scope.messageError=response.data;
					 $scope.$parent.purchase_button ="";
					window.alert($scope.messageError);
					
					});
			
			
			
			}
			else
			{
			   $scope.messageError=resp.data.description;
			   $scope.$parent.purchase_button ="";		
			
			}
	 
	 },function(resp){ 
	 window.alert("input error"); 
	 window.alert(resp.data.description); 
	 
	 
	 })
   
  
        
		
					
	}
	else
	 {
	    
		
		
		$scope.messageError= $scope.messageError+ "\n please change address or remove the store items for successful purchase ";
 
	  
	    
	 
		 $scope.$parent.purchase_button ="";		
		 $scope.$parent.purchase_complete ="failed";
	     window.alert("Failed to place order");
         window.alert($scope.messageError);		 
	 }				
			
					 
	}// purchase end 				
						
					
          // get all site id's				
						// $scope.cartToFilter = function() {
								// storeProducts = [];            // first initialize make it empty
								// return  $scope.twotap_builtin_cart.sites;
							// }
	
						// $scope.filterStores = function(cart) {
							// var storeIsNew = storeProducts.indexOf(cart.info.name) == -1; 
							// // checking the merchant is inside
							// if (storeIsNew) {                                      // means the item not inside
								// storeProducts.push(cart.info.name);
								
							// }
							// return storeIsNew;
						// }

						// $scope.filterStoresX = function(i) {
							
							
							// return $scope.s_array[i];
							 
						// }
		//save product
        $scope.saveUserProduct = function(productId,catalogId, retailer){
               var s_product  = {'productId' : productId,'catalogId':catalogId, 'retailer':retailer};
               $http.post('/update_user_products',s_product)
                     .success(function(data) {
                      
					  $scope.$parent.user_saved_item_id = data; // redefine saved item ids
					  
					  $scope.$parent.saved_item_number = Object.keys(data).length; // redefine saved item ids 
					  
					  if($scope.$parent.saved_item_number>0)
					   {
						
				        
						var multiID ={ 'mid' : $scope.$parent.user_saved_item_id};

					   $http.post('/productUserMultiID',multiID)
							 .success(function(data) {
							 $scope.$parent.user_saved_item =data;

						})
						.error(function(err) {
						  window.alert("Error: " + err);
							}); 
					  }

					 $scope.$parent.deleteFromCart(productId);


			    })
	            .error(function(err) {
	                  window.alert("Error: " + err);
	            });

        }
		
		 $scope.saveUserProductCatId = function(catalogId, retailer){
                            
            $scope.$parent.shoppingbag_cart_changed = true;  
			var s_product  = {'catalogId':catalogId, 'retailer':retailer};
               $http.post('/update_user_products',s_product)
                     .success(function(data) {
                      
					  $scope.$parent.user_saved_item_id = data; // redefine saved item ids
					  $scope.$parent.saved_item_number = Object.keys(data).length; // redefine saved item ids 
					  $scope.$parent.deleteFromCartCatalog(catalogId);
                      console.log($scope.user_saved_item_id); 
					 

					 if($scope.saved_item_number>0)
					   {
						

						var multiID ={ 'mid' : $scope.user_saved_item_id};

					   $http.post('/productUserMulticatalogID',multiID)
							 .success(function(data) {
							 $scope.$parent.user_saved_item =data;

						})
						.error(function(err) {
						 console.log("Error: " + err);
							}); 
					  }


			    })
	            .error(function(err) {
	                  console.log("multi catalogue id Error: " + err);
	            });

        }
		
		$scope.deleteFromCartX = function(productId){
          $scope.$parent.deleteFromCart(productId);
  	       $scope.$parent.getCartItemsJson();
			$scope.$parent.getcartDistinctRetailer();
	    }
		
		$scope.deleteFromCartCatId = function(catalogId){
          $scope.$parent.deleteFromCartCatalog(catalogId);
  	       // $scope.$parent.getCartItemsJson();
		   // $scope.$parent.getcartDistinctRetailer();
	    }

		$scope.reset_size_list = function(complete,col,ind){
			// need to find the index
			var i=0;
			var num=-1;
			for (i=0;i<complete.required_field_values.color.length;i++ )
			{
			
			   if(complete.required_field_values.color[i].value == col)
			    {
				  num = i;
				}
			}
			
			complete.required_field_values.size = complete.required_field_values.color[num].dep.size; 
		  //  console.log(complete.required_field_values.size); 
			complete.image= col;
			 
		}

		  $scope.getcoupon = function(retailer)
		  {
			
			var indexstores =-1;
		    if($scope.loggedin==0 || $scope.loggedin===undefined )
			{
					   window.alert("logged in and subscribe to get coupon");
						$scope.$parent.after_login_location='/shoppingbag';
						
						$("#login-popup").modal("show"); 
					
					
			}
		    else
			{
			 console.log($scope.subscribe_stores);
			 
			 if(retailer=="AMI Clubwear") 
			 $scope.$parent.advertiser_ids=3011689;
			   
			   return $location.path('/mail_notification_full');	
			   
			   // if($scope.subscribe_stores.indexOf(retailer)>-1)
			      // return $location.path('/mail_notification_full');			
                 // else
                   // window.alert("show a popup having check box option");  				
			
			
			}
		  
		  
		  
		  }
          
		  if($scope.step!=2)
		  $scope.twotapCheckoutCart(1);
         
		  //findAndInitCustomSelects();
		  sShoppable.ssCustomScroll.ssCustomScrollbar(); 
		  sShoppable.ssDropwdown.ssSelectDrpdwn();
		  
}])

////////////////////////// controller for shopping bag page /////////////////////////////////////////////////////
SSApp.controller('mailController',['$scope','$http','$anchorScroll','$cookies','$timeout' ,'$route','$routeParams','$location','$interval',function($scope,$http,$anchorScroll,$cookies,$timeout,$route,$routeParams,$location,$interval)
{
//$http.defaults.headers.common['Authorization'] = '009e2fe3b0a2544726515c5da399498248ce0df098ec23233a788f20fefed596554f2048ec61f19daf4cfe907c18eb22d1a2b6f434498897a650f899928bfd1bab';
//var url ="https://linksearch.api.cj.com/v2/link-search?website-id="+ $scope.cj_website_id+"&advertiser-ids=3011689&link-type=Text+Link&promotion-type=coupon&page-number=1&records-per-page=20";

var url ="https://linksearch.api.cj.com/v2/link-search?callback=JSON_CALLBACK&website-id="+ $scope.cj_website_id+"&advertiser-ids=3011689&link-type=Text+Link&promotion-type=coupon&page-number=1&records-per-page=20";


 $scope.$parent.advertiser_ids='3011689';
$http.get('/cj_coupon')
	 // $http.get(url, { headers: { 'authorization':'00d9fb63e7cc3b9d1ca158074cb36009be6ecbb1251c703b229c1ac0a9fb98e08e27b2c1d49706565113db02afe9e4a4026eb0d204eabf439030685ff0be419b1f/00941c5e0bb817a16f3ca9c57bf63d812165c2fd808bcc2e421bf38989762cb016658dcba660f5c7d3bafa383ec6bca7f947c19983570cfb8754683086ac75c701"
	 // }
	 // })
	 .then(function(responseMail) { 
		 console.log("Commission Junction success");	
		 if(responseMail.status>=200 && responseMail.status<300)
		 { 
		 
		   console.log(responseMail.data);
		   var mData =responseMail.data;
		 
		   var x2js = new X2JS();  
            $scope.mailData = x2js.xml_str2json(mData);  
    //$scope.mailData = mData;
		 
		 } 
        }, function errorCallback(responseMail) {
			console.log("Commission Junction error");	

			console.log(responseMail);
      })
	 // calling linkshare api for getting coupons
	 var linkshare_url ="https://api.rakutenmarketing.com/coupon/1.0?category=1%7C3%7C4&network=1";	  

	 $http.get(linkshare_url, { headers: { "authorization":"Bearer 26ab1ed9bb684551aaccaeebe0b648"
	 
	 
	 }
	 }).then(function(responseMail) { 

		 if(responseMail.status>=200 && responseMail.status<300)
		 { 
		 
					console.log("Linkshare success");
	
		 console.log(responseMail.data);
		 
		 
		 } 
        
		}, function errorCallback(responseMail) {
			
			console.log("Linkshare error");
			console.log(responseMail);
      })
	  
	  
	  }])

//http://stackoverflow.com/questions/24134117/no-access-control-allow-origin-header-is-present-on-the-requested-resource-an

SSApp.controller('confirmController',['$scope','$http','addWishList','$route','$routeParams','$location',function($scope,$http,addWishList,$route,$routeParams,$location)
{
 
 	
             	 $scope.$parent.shoppingbag_cart_changed = true; // 
		   
                 $scope.$parent.twotap_builtin_cart = undefined;
                 $scope.$parent.tap=1; 
				 $scope.parent.step=0;

					
			
 
}]);


