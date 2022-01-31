

UserApp.factory('uniqueProductGroupFactory',function uniqueProductGroupFactory($q) { 

    return {

    
     'uniqueProductGroupProperty': function(products,property) {
        var defer = $q.defer();
    
        var newList=[];
        var temListLength=0;
        var productLength= products.length
        var tempProduct;
        var found;
        var counter =0;
        if(productLength>0) {
        tempProduct=angular.copy(products[0]);
        tempProduct.groupCount = 1;
		newList.push(tempProduct);
        if(productLength<=1) {
			 defer.resolve(newList);
			
		} else {
		for(var i=1;i<productLength;i++ ) {
           found=false;   
           tempProduct= angular.copy(products[i]);
            temListLength = newList.length; 
            for(var k =0;k<temListLength;k++) {
                    counter =0;
               
                    if(newList[k][property]==tempProduct[property]) {
                        counter =  newList[k].groupCount;
                        newList[k].groupCount =counter +1;
                        found=true;
                        k = temListLength;
                    }
                   if(!found && k+1==temListLength ) {
                        tempProduct.groupCount =1;
                        newList.push(tempProduct);
                    }
            
                }
            
             
             
              if((i+1) >=productLength) {
                 defer.resolve(newList);

              }
          }
		}
		
		
		}
        else
          defer.reject('empty');

         return defer.promise;


    }
	

   

	};

 })
