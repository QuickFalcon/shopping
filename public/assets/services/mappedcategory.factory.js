

UserApp.factory('mappedcategorylist',function mappedcategorylist($http, $q) { 

    return {

    'mappedlist': function(categorylist,mapped_cat,mapped_cat_id) {
     
       var defer = $q.defer();
        //////////////////////Catagory..........////////////////////
        var j = "";
        var temp_cat;
        var temp_map;           // mapping category temp variable
        var temp_map_id;
        var map_count = 0;
        var categoryVal;     // category encoded temporary variable
        var categoryidVal;
        // for instance we already mapped this then why do we use string search
        var tempcategoryhe;
        // following means user clicking menu if mapped data available it will take data from
        // there
  
 //  normal selected category list
            var tc; 
            var tty;
            var cat_arr =[];
            var cat_arr_id=[];
                for(ccount=0;ccount<categorylist.length;ccount++) {
                    temp_cat = categorylist[ccount];
                    if(temp_cat.trim()!="" && angular.isDefined(mapped_cat[temp_cat]) && mapped_cat[temp_cat].length>0) {
                
                             temp_map = mapped_cat[temp_cat];
                             temp_map_id = mapped_cat_id[temp_cat];

                        for(map_count=0;map_count<temp_map_id.length;map_count++) {

                                categoryidVal =  temp_map_id[map_count];

                                 if(cat_arr_id.indexOf(categoryidVal)<0)  // check whether it is already inside
                                   cat_arr_id.push(categoryidVal);
                            }
                    }
                   else if(temp_cat.trim()!=""){ // when it donot find mapped category
                            if(cat_arr.indexOf(temp_cat)<0)
                            cat_arr.push(temp_cat);
                      
                   }  
                
                }

        var result ={mapped_regex:cat_arr,mapped_cid: cat_arr_id  };

        defer.resolve(result);
        return defer.promise;
    }


	};

 })// factory end 
