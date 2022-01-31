

UserApp.factory('uniqueProductGroupFactoryBrand',function uniqueProductGroupFactoryBrand($q) { 

    return {

	 'uniqueProductGroupPropertyBrand': function(productB) {
        var defer = $q.defer();
        var newBList=[];
        var temListLengthB=0;
        var productBLength= productB.length
        var tempproductB;
        var foundB;
        var counter =0;
        if(productBLength>0) {
        tempproductB= angular.copy(productB[0]);
        tempproductB.groupCount =1;  

		newBList.push(tempproductB);
        if(productBLength<=1) {
			defer.resolve(newBList);

		} else {
          for(var i=1;i<productBLength;i++ ) {
           foundB=false;   
           tempproductB= angular.copy(productB[i]);
            temListLengthB = newBList.length; 
            for(var k =0;k<temListLengthB;k++) {
                    counter =0;
               
                    if(newBList[k].brand==tempproductB.brand) {
                        counter =  newBList[k].groupCount;
                        newBList[k].groupCount =counter +1;
                        foundB=true;
                        k = temListLengthB;
                    }
                   if(!foundB && k+1==temListLengthB ) {
                        tempproductB.groupCount =1;
                        newBList.push(tempproductB);
                    }
            
                }
            
             
             
              if((i+1) >=productBLength) {
                 defer.resolve(newBList);

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
