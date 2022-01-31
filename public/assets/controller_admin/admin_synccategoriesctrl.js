// synchronize categories 


SSApp.controller('syncCategoriesCtrl', ['$scope', '$http', '$filter','$location', function ($scope, $http, $filter,$location) {
    $scope.customCategoryList = [];
	 $scope.allcategory ={};
	 $scope.catForEdit={};

	$scope.category_track ={};
    var final_cid = 0;
    $scope.lmt = 7546;
    $scope.editable = true;
    $scope.prosper_categorylist = [];
    $scope.prosper_categorylist_id = [];
    $scope.prosperSelectedCatagoryIndex = [];
    
    var path = $location.path();
    
	
	$scope.totalRecordsAvailable=7546;
	$scope.CurrentPage =0;
	 $scope.numPages =   Math.ceil(($scope.totalRecordsAvailable) / ($scope.lmt));
   
    $scope.pageChangedCategory = function() {
	$scope.get_categories_prosper_cache();
	
	}


    // getting categories from csv files	and  make a tree of prosper category
    // outdated idea
    $scope.sync_categories = function () {
        $http.post('/category_delete_All')  //call to retrieve data
        .success(function(data) {
        $http.post('/get_all_catagories_from_csv')  //call to retrieve data
            .success(function (data) {
                window.alert("successful sync operation");

            }).error(function (err) {
            console.log(" SOrry error " + err);
        });
          console.log(data);

        }).error(function(err) {
        console.log(" SOrry error " + err);
        });

    }
    // copy catagories from csv straight forward and make csv
    $scope.sync_categories_prosper = function () {

        $http.post('/category_delete_prosper')  //call to retrieve data
            .success(function (data) {

                $http.post('/catagories_from_csv_straight_forward')  //call to retrieve data
                    .success(function (data) {
                        window.alert("successful sync operation");
                        $scope.lmt = 10000;
                        $scope.get_categories_prosper_cache();
                    }).error(function (err) {
                    console.log(" Sorry error " + err);
                });


            }).error(function (err) {
            console.log(" SOrry error " + err);
            $http.post('/catagories_from_csv_straight_forward')  //call to retrieve data
                .success(function (data) {
                    window.alert("successful sync operation");
                    $scope.lmt = 10000;
                    $scope.get_categories_prosper_cache();
                }).error(function (err) {
                console.log(" Sorry error " + err);
            });


        });





    }

    $scope.delete_categories_prosper = function () {
        $http.post('/category_delete_prosper')  //call to retrieve data
            .success(function (data) {

                window.alert(data);
                $scope.prosperent_catList = null;
            }).error(function (err) {
            console.log(" SOrry error " + err);
        });

    }

    // get all categories from database
    $scope.get_categories_prosper = function () {
	   
        var lt = {limit: $scope.lmt}
        $http.post('/get_catagory_straight_forward', lt)  //call to retrieve data
            .success(function (data) {
                $scope.prosperent_catList = data;
				console.log(data);

            }).error(function (err) {
            console.log(" Sorry error " + err);
        });
    }
    /*imp get category data from cache */
    $scope.get_categories_prosper_cache = function () {
        var lt = {limit: $scope.lmt, page: $scope.CurrentPage };

        $scope.loaddone = false;
        $http.post('/get_categoryList_cache',lt)
		.success(function (data){
            $scope.loaddone = true;

            $scope.prosperent_catList = data;
            $scope.CurrentPage =$scope.CurrentPage + 1;
			  var temp;
              for(var i=0;i<data.length;i++) {
			     $scope.allcategory[data[i].category] = false;
			     $scope.category_track[data[i].category] = data[i].category;
			     if((i+1) ==data.length) {
				    for(var j=0;j<$scope.prosper_categorylist.length;j++) {
					   var temp = $scope.prosper_categorylist[j];
					   $scope.allcategory[temp] = true;
					
					}
				 
				 }
			  
			  }
			  
            }).error(function (err) {
            console.log(" SOrry error " + err);
            $scope.loaddone = true;
			});
    }


    // change limit
    $scope.change_limit = function () {
       
	   if($scope.lmt)
	   {
	     $scope.get_categories_prosper_cache();
         $scope.numPages =   Math.ceil(($scope.totalRecordsAvailable) / ($scope.lmt));
       }
       else
	   {
	   
	     window.alert("Please assign a limit");
	   
	   }
	   
	
	}


    // All custom categories from database


    /*
    $scope.get_all_custom_category = function () {
        $http.post('/get_all_custom_category')  //call to retrieve data
            .success(function (data) {
                var x = 0;
                var parent_count1 = 0;
                var parent_level2_count = 0;
                var parent_level3_count = 0;
                var parent_level4_count = 0;
                var parent_level5_count = 0;
                var data_level1 = [];
                var data_level2 = [];
                var data_level3 = [];
                var data_level4 = [];
                var data_level5 = [];
                $scope.TotalCategoriesSubCategories = data.length;
                final_cid = 0;
                // data has been splitted level wise

                $scope.datacustomCategoryList = data;
                $scope.customCategoryList = [];


                for (x = 0; x < $scope.TotalCategoriesSubCategories; x++) {

                    if (data[x]['level'] == 1) {

                        $scope.customCategoryList[parent_count1] = data[x];
                        data[x].categoryList = [];
                        data_level1[parent_count1] = angular.copy(data[x]);
                        parent_count1 = parent_count1 + 1;
                    }
                    else if (data[x].level == 2) {
                        data[x].categoryList = [];
                        data_level2[parent_level2_count] = angular.copy(data[x]);
                        parent_level2_count = parent_level2_count + 1;
                    }
                    else if (data[x].level == 3) {
                        data[x].categoryList = [];
                        data_level3[parent_level3_count] =angular.copy(data[x]);
                        parent_level3_count = parent_level3_count + 1;
                    }
                    else if (data[x].level == 4) {
                        data[x].categoryList = [];
                        data_level4[parent_level4_count] = angular.copy(data[x]);
                        parent_level4_count = parent_level4_count + 1;
                    }
                    else if (data[x].level == 5) {
                        data[x].categoryList = [];
                        data_level5[parent_level5_count] = angular.copy(data[x]);
                        parent_level5_count = parent_level5_count + 1;
                    }


                }

                final_cid = data[$scope.TotalCategoriesSubCategories - 1].cid;
                var y = 0;
                var parent;
                if (parent_level2_count > 0) {


                    for (y = 0; y < data_level2.length; y++) {
                        parent = data_level2[y].parent;

                        // parent cid , array of parent , data object
                        $scope.relate_parent_child(parent, data_level1, data_level2[y]);


                    }

                }
                if (parent_level3_count > 0) {


                    for (y = 0; y < data_level3.length; y++) {
                      var parent3 = data_level3[y].parent;

                        // parent cid , array of parent , data object
                        $scope.relate_parent_child(parent3, data_level2, data_level3[y]);


                    }

                }
                if (parent_level4_count > 0) {


                    for (y = 0; y < data_level4.length; y++) {
                      var parent4 = data_level4[y].parent;
                        // parent cid , array of parent , data object

                        $scope.relate_parent_child(parent4, data_level3, data_level4[y]);


                    }

                }
                if (parent_level5_count > 0) {


                    for (y = 0; y < data_level5.length; y++) {
                        var parent5 = data_level5[y].parent;
                        // parent cid , array of parent , data object
                        console.log(data_level5[y].category);
                        $scope.relate_parent_child(parent5, data_level4, data_level5[y]);


                    }

                }


            }).error(function (err) {
            console.log(" sorry category can not be get " + err);
        });

    }
*/
    // relate parent child category



    $scope.get_all_custom_category = function () {
        $scope.customCategoryList = [];
        $scope.parentcustomCategoryList = [];
        $http.post('/get_all_custom_category')  //call to retrieve data
            .success(function (data) {

                $scope.all_category = angular.copy(data);
                var x;
                var parent_count1 = 0;
                var parent_level2_count = 0;
                var parent_level3_count = 0;
                var parent_level4_count = 0;
                var parent_level5_count = 0;
                var data_level1 = [];
                var data_level2 = [];
                var data_level3 = [];
                var data_level4 = [];
                var data_level5 = [];
                $scope.TotalCategoriesSubCategories = data.length;


                final_cid = 0;
                // data has been splitted level wise
                var y = 0;
                var yz = 0;
                var yza = 0;
                var yzb = 0;
                var parent;
                var data_temp;
                var caty;
                // first make level wise array of category
                for (x = 0; x < data.length; x++) {
                    data_temp = data[x];
                    data[x].categoryList = [];
                    if (data[x].level == 1) {
                        data_level1[parent_count1] = data[x];  // this is array of first level
                        $scope.customCategoryList.push(data[x]);
                        parent_count1 = parent_count1 + 1;
                    }
                    else if (data[x].level == 2) {
                        data_level2[parent_level2_count] = data[x];
                        parent_level2_count = parent_level2_count + 1;
                    }
                    else if (data[x].level == 3) {
                        data_level3[parent_level3_count] = data[x];
                        parent_level3_count = parent_level3_count + 1;
                    }
                    else if (data[x].level == 4) {
                        data_level4[parent_level4_count] = data[x];
                        parent_level4_count = parent_level4_count + 1;
                    }
                    else if (data[x].level == 5) {
                        data_level5[parent_level5_count] = data[x];
                        parent_level5_count = parent_level5_count + 1;
                    }

                    if (data.length == x + 1) {
                        $scope.parentcustomCategoryList = angular.copy($scope.customCategoryList);
                        $scope.totalCategories = parent_count1;
                        if (parent_level2_count > 0) {
                            for (y = 0; y < data_level2.length; y++) {
                                parent = data_level2[y].parent;
                                relate_parent_child(parent, data_level1, data_level2[y]);
                                if (y + 1 == data_level2.length) {
                                    if (parent_level3_count > 0) {
                                        for (yz = 0; yz < data_level3.length; yz++) {
                                            parent = data_level3[yz].parent;
                                            // parent cid , array of parent , data object
                                            relate_parent_child(parent, data_level2, data_level3[yz]);
                                            if (yz + 1 == data_level3.length) {
                                                if (parent_level4_count > 0) {
                                                    for (yza = 0; yza < data_level4.length; yza++) {
                                                        parent = data_level4[yza].parent;
                                                        // parent cid , array of parent , data object
                                                        relate_parent_child(parent, data_level3, data_level4[yza]);
                                                        if (yza + 1 == data_level4.length) {
                                                            if (parent_level5_count > 0) {
                                                                for (yzb = 0; yzb < data_level5.length; yzb++) {
                                                                    parent = data_level5[yzb].parent;
                                                                    // parent cid , array of parent , data object
                                                                    relate_parent_child(parent, data_level4, data_level5[yzb]);
                                                                }
                                                            }
                                                        }
                                                    } //
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                var new_cid = data.length - 1;

                final_cid = data[new_cid].cid;
            }).error(function (err) {
            console.log(" sorry category can not be get " + err);
        });
    }


    $scope.custom_category = function () {
        $scope.customCategoryList = [];
        $scope.parentcustomCategoryList = [];
        $http.post('/get_all_custom_category')  //call to retrieve data
            .success(function (data) {

                $scope.all_category = angular.copy(data);
                var x;
                var parent_count1 = 0;
                var parent_level2_count = 0;
                var parent_level3_count = 0;
                var parent_level4_count = 0;
                var parent_level5_count = 0;
                var data_level1 = [];
                var data_level2 = [];
                var data_level3 = [];
                var data_level4 = [];
                var data_level5 = [];
                $scope.TotalCategoriesSubCategories = data.length;


                final_cid = 0;
                // data has been splitted level wise
                var y = 0;
                var yz = 0;
                var yza = 0;
                var yzb = 0;
                var parent;
                var data_temp;
                var caty;
                // first make level wise array of category
                for (x = 0; x < data.length; x++) {
                    data_temp = data[x];
                    data[x].categoryList = [];
                    if (data[x].level == 1) {
                        data_level1[parent_count1] = data[x];  // this is array of first level
                        $scope.customCategoryList.push(data[x]);
                        parent_count1 = parent_count1 + 1;
                    }
                    else if (data[x].level == 2) {
                        data_level2[parent_level2_count] = data[x];
                        parent_level2_count = parent_level2_count + 1;
                    }
                    else if (data[x].level == 3) {
                        data_level3[parent_level3_count] = data[x];
                        parent_level3_count = parent_level3_count + 1;
                    }
                    else if (data[x].level == 4) {
                        data_level4[parent_level4_count] = data[x];
                        parent_level4_count = parent_level4_count + 1;
                    }
                    else if (data[x].level == 5) {
                        data_level5[parent_level5_count] = data[x];
                        parent_level5_count = parent_level5_count + 1;
                    }

                    if (data.length == x + 1) {
                        $scope.parentcustomCategoryList = angular.copy($scope.customCategoryList);
                        $scope.totalCategories = parent_count1;
                        if (parent_level2_count > 0) {
                            for (y = 0; y < data_level2.length; y++) {
                                parent = data_level2[y].parent;
                                relate_parent_child(parent, data_level1, data_level2[y]);
                                if (y + 1 == data_level2.length) {
                                    if (parent_level3_count > 0) {
                                        for (yz = 0; yz < data_level3.length; yz++) {
                                            parent = data_level3[yz].parent;
                                            // parent cid , array of parent , data object
                                            relate_parent_child(parent, data_level2, data_level3[yz]);
                                            if (yz + 1 == data_level3.length) {
                                                if (parent_level4_count > 0) {
                                                    for (yza = 0; yza < data_level4.length; yza++) {
                                                        parent = data_level4[yza].parent;
                                                        // parent cid , array of parent , data object
                                                        relate_parent_child(parent, data_level3, data_level4[yza]);
                                                        if (yza + 1 == data_level4.length) {
                                                            if (parent_level5_count > 0) {
                                                                for (yzb = 0; yzb < data_level5.length; yzb++) {
                                                                    parent = data_level5[yzb].parent;
                                                                    // parent cid , array of parent , data object
                                                                    relate_parent_child(parent, data_level4, data_level5[yzb]);
                                                                }
                                                            }
                                                        }
                                                    } //
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                var new_cid = data.length - 1;

                final_cid = data[new_cid].cid;
            }).error(function (err) {
            console.log(" sorry category can not be get " + err);
        });
    }



    // Category Parent child relation ship function
    function relate_parent_child(parent, arr, obj) {
        var l = 0;
        for (l = 0; l < arr.length; l++) {
            if (arr[l]['cid'] == parent) {
                arr[l]['categoryList'].push(obj);

            }
        }
    }


    $scope.pcatList = $scope.prosperent_catList;
    $scope.selectFiltered = function (searchKey) {
        
		var l = 0;
        var temp; 
		
			if(angular.isDefined(searchKey))
			$scope.prosperent_catListx = $filter('filter')($scope.prosperent_catList, {category: searchKey.category});
            else
             $scope.prosperent_catListx = $scope.prosperent_catList;
			
		
        if ($scope.selFilter) {
            
		
			
			console.log($scope.prosperent_catListx); 
			for (l = 0; l < $scope.prosperent_catListx.length; l++)
               {
                temp= $scope.prosperent_catListx[l].category
				$scope.allcategory[temp] =true;
			  
               }        
		
		}
        else {

            for (l = 0; l < $scope.prosperent_catListx.length; l++) {
   			    temp= $scope.prosperent_catListx[l].category
				$scope.allcategory[temp] =false;
             } 
		
		}

    }
    $scope.selectedCategoryListObj = [];
    var temcatId;
     $scope.changeCategoryList= function(catObj,val){
         temcatId = catObj.categoryId;
         var matched = false;
         var catid;
       if(val) {

           if (angular.isDefined($scope.selectedCategoryListObj)){
               if ($scope.selectedCategoryListObj.length > 0) {
                   for (var i = 0; i < $scope.selectedCategoryListObj.length; i++) {


                       if (temcatId == $scope.selectedCategoryListObj[i].categoryId) {

                           matched = true;
                           console.log("already this is inside");
                           break;
                       }


                       if (i + 1 == $scope.selectedCategoryListObj.length) {


                           if (!matched) {

                               console.log("new item need to push");
                               $scope.selectedCategoryListObj.push(catObj);
                               $scope.prosper_categorylist.push(catObj.category);

                               $scope.prosper_categorylist_id.push(catObj.categoryId);

                               catid = catObj.categoryId;
                               $scope.catForEdit[catid] = true;

                           }

                       }


                   }

               }
               else {

                   $scope.selectedCategoryListObj.push(catObj);
                   $scope.prosper_categorylist.push(catObj.category);

                   $scope.prosper_categorylist_id.push(catObj.categoryId);
                   catid = catObj.categoryId;
                   $scope.catForEdit[catid] = true;


               }
           }    else {
               $scope.selectedCategoryListObj =[];
               $scope.prosper_categorylist =[];
               $scope.prosper_categorylist_id =[];
               $scope.selectedCategoryListObj.push(catObj);
               $scope.prosper_categorylist.push(catObj.category);

               $scope.prosper_categorylist_id.push(catObj.categoryId);
               catid = catObj.categoryId;
               $scope.catForEdit[catid] = true;


           }



       }
       else {

           for(var i=0;i<$scope.selectedCategoryListObj.length;i++ ) {



               if (temcatId == $scope.selectedCategoryListObj[i].categoryId) {

                   matched = true;

                   $scope.selectedCategoryListObj.splice(i, 1);
                   $scope.prosper_categorylist.splice(i, 1);
                   $scope.prosper_categorylist_id.splice(i, 1);

                   catid = catObj.categoryId;
                   $scope.catForEdit[catid] = false;


               }


           }


       }


     };
    // removing item from selected list
    $scope.changeCategoryListSelected = function (categoryObj, catbool) {

        var temCatid = categoryObj.categoryId;

        //var index = $scope.prosper_categorylist.indexOf(categoryObj.category);
        var temSelectObjId;
        $scope.allcategory[temCatid] = catbool;
        $scope.catForEdit[temCatid] = catbool;
		
		if (!catbool) {




                for(var i=0;i<$scope.selectedCategoryListObj.length;i++ ) {

                    console.log($scope.selectedCategoryListObj[i].categoryId);
                    console.log(temCatid);

                    temSelectObjId = $scope.selectedCategoryListObj[i].categoryId;

                    if(temSelectObjId == temCatid) {

                       console.log("I am heere");

                        $scope.selectedCategoryListObj.splice(i, 1);
                        $scope.prosper_categorylist.splice(i, 1);
                        $scope.prosper_categorylist_id.splice(i, 1);




                    }


                }


            }



		}
		




/*
    $scope.changeCategoryList = function (catObj, obj, index) {

         var index=-1;
        var indexId =-1;
         if(angular.isDefined($scope.prosper_categorylist))
         index = $scope.prosper_categorylist.indexOf(catObj.category);

        if(angular.isDefined($scope.prosper_categorylist_id))
            indexId = $scope.prosper_categorylist_id.indexOf(catObj.categoryId);




        if (!obj) {
   

      
            if (index > -1) {
                $scope.prosper_categorylist.splice(index, 1);
            }

            if (indexId > -1) {
                $scope.prosper_categorylist_id.splice(indexId, 1);
            }

            $scope.catForEdit[catObj.category] = false;

		
		}

        else if (obj) {
            

			$scope.catForEdit[catObj.category] = true;
			if (index > -1) {
			    console.log('already there');

			}
			else
			{
		    
			$scope.prosper_categorylist.push(catObj.category);
            $scope.prosper_categorylist_id.push(catObj.categoryId);
			
			}  
           
        }
    };

    */

    $scope.refresh_category = function () {
        $scope.editable = true;
        $scope.parentId = -1;
        $scope.level = 1;
        $scope.category_name = "";
        var n = 0;
        var x;
	   $scope.allcategory ={};
	   $scope.catForEdit={};

        $scope.prosper_categorylist = [];
        $scope.prosper_categorylist_id = [];


        $scope.selectedCategoryListObj =[];
        $scope.current_category ={};

    }


    //////////////////////// CREATE CATEGORY //////////////////////////


    $scope.create_custom_category = function (category_name,categoryobjList) {


        if(!(angular.isDefined(category_name))){
            window.alert("enter some value");
            return;

        }
        if(category_name.trim()==""){
            window.alert("enter some value");
            return;

        }

        $scope.editable = true;
        $scope.parentId = -1;
        $scope.level = 1;
        var cat = {'cat_title': category_name};
        var j = 0;
        cat.parent = -1;
        cat.level = 1;
        var count = 0;
        var multiple_parent;
        var k = 0;
        var l = 0;
        var m = 0;
        var leng = 0;
        var sublist;
        if($scope.default_parent) {

            count =1;

        }


        if (angular.isDefined($scope.customCategoryList))
            leng = $scope.customCategoryList.length;

        // find any parents there and we are not using default
        if (leng > 0 && (!$scope.default_parent)) {

            // find out some of the properties such as who is the parent
            for (j = 0; j < leng; j++) {

                if ($scope.customCategoryList[j]['IsTrue']) {

                    cat.parent = $scope.customCategoryList[j]['cid'];
                    cat.level = $scope.customCategoryList[j]['level'] + 1;

                    count++;
                    j = leng;
                }


                else if ($scope.customCategoryList[j]['categoryList'].length > 0) {
                    sublist = $scope.customCategoryList[j]['categoryList'];

                    for (k = 0; k < sublist.length; k++) {
                        if (sublist[k]['IsTrue']) {

                            cat.parent = sublist[k]['cid'];
                            cat.level = sublist[k]['level'] + 1;
                            count++;
                            multiple_parent = multiple_parent + "," + category_name;

                                k = angular.copy(sublist.length);


                        }
                        else if (sublist[k]['categoryList'].length > 0) {

                            sublist_level3 = sublist[k]['categoryList'];

                            for (l = 0; l < sublist_level3.length; l++) {
                                if (sublist_level3[l]['IsTrue']) {

                                    cat.parent = sublist_level3[l]['cid'];
                                    cat.level = sublist_level3[l]['level'] + 1;
                                    count++;

                                        l = angular.copy(sublist_level3.length);
                                        k = angular.copy(sublist.length);

                                } // checked level 3 to define level 4
                                else if (sublist_level3[l]['categoryList'].length > 0) {
                                    sublist_level4 = sublist_level3[l]['categoryList'];
                                    for (m = 0; m < sublist_level4.length; m++) {
                                        if (sublist_level4[m]['IsTrue']) {

                                            cat.parent = sublist_level4[m]['cid'];
                                            cat.level = sublist_level4[m]['level'] + 1;
                                            count++;
                                            multiple_parent = multiple_parent + "," + category_name;

                                                m = angular.copy(sublist_level4[m].length);
                                                l = angular.copy(sublist_level3.length);
                                                k = angular.copy(sublist.length);
                                                



                                        }


                                    }
                                }
                            }
                        }


                    }
                }
                if (count >= 1) {
                    break;

                }




            }
        }
        
        // when check custom category parent  
        if (count > 1)
            window.alert("Error : you are trying to make show same sub category under multiple category " + multiple_parent);
        else {
        
            //cat.cid = final_cid + 1;
            var j = 0;
            var cat_arr = [];
            var cat_arr_id =[];

			cat.prosper_categorylist =  angular.copy($scope.prosper_categorylist);
            cat.prosperent_categories_id =  angular.copy($scope.prosper_categorylist_id);
            $http.post('/create_custom_category', cat)  //call to retrieve data
                .success(function (data) {
                    $scope.editable = true;
                    $scope.get_all_custom_category();
                }).error(function (err) {
                console.log(" sorry can not created " + err);
            });
        }
    }

    $scope.create_custom_mapping = function (category_name,categoryobjList) {


        if(!(angular.isDefined(category_name))){
            window.alert("enter some value");
            return;

        }
        if(category_name.trim()==""){
            window.alert("enter some value");
            return;

        }

        $scope.editable = true;
        $scope.parentId = -9;
        $scope.level = 0;
        var cat = {'cat_title': category_name};
        var j = 0;
        cat.parent = -9;
        cat.level = 0;
        var count = 0;
        var multiple_parent;
        var k = 0;
        var l = 0;
        var m = 0;
        var leng = 0;
        var sublist;






            //cat.cid = final_cid + 1;
            var j = 0;
            var cat_arr = [];
            var cat_arr_id =[];

            cat.prosper_categorylist =  angular.copy($scope.prosper_categorylist);
            cat.prosperent_categories_id =  angular.copy($scope.prosper_categorylist_id);
            $http.post('/create_custom_category', cat)  //call to retrieve data
                .success(function (data) {
                    $scope.editable = true;
                    //$scope.get_all_custom_category();
                }).error(function (err) {
                console.log(" sorry can not created " + err);
            });

    }


    $scope.setParentRoot = function () {
        if(!(angular.isDefined($scope.selectedCategoryListObj)))
            return;
        else if(!(angular.isDefined($scope.category_name))){

            return;

        } else if($scope.category_name.trim()==''){
            return;
        }






        if($scope.default_parent) {



            $http.post('/get_custom_category_parent', {cid:$scope.current_category.cid }).success(function (data) {


                if(data.length> 0) {

                    $scope.editable = false;

                    window.alert("move or delete the child first! then again click edit of the category!");

                }
                else {
                    $scope.current_category.level = 1;
                    $scope.current_category.parent = -1;
                    $scope.parentId = -1;
                    $scope.level = 1;

                }



            })






        } else if(!($scope.default_parent)) {
            $scope.editable = true;


        }


    }

    // get all custom categories
    $scope.setParent = function (cate) {



        if(!(angular.isDefined($scope.category_name))){

           return;

       } else if($scope.category_name.trim()==''){
           return;
       }




        if (cate.IsTrue) {

                 $scope.default_parent = false;

            /*
            if ($scope.current_category.cid == cate.cid) {
                    window.alert("a node can not be parent of own self");
                    cate.IsTrue = false;
                }
                else
                    */
            if (cate.level > 4) {
                window.alert("currently we are working with level 4 ");
                cate.IsTrue = false;
              }
                //  if($scope.current_category.cid == cate.parent) {
                //        window.alert("a child can not be parent of it's parent");
                //        cate.IsTrue = false;
                //    }
                //
                // else {  }

                      if(angular.isDefined($scope.current_category.cid)) {

                          $http.post('/get_custom_category_parent', {cid: $scope.current_category.cid}).then(function (data) {

                                  console.log(data);
                                  if (data.length > 0) {

                                      $scope.editable = false;

                                      window.alert("move or delete the child first! then again click edit");
                                      console.log(data);
                                  }
                                  else {
                                      $scope.current_category.parent = cate.cid;
                                      $scope.current_category.level = cate.level + 1;
                                      $scope.parentId = cate.cid;
                                      $scope.level = $scope.current_category.level;
                                  }


                              },
                              function (errx) {

                                  $scope.current_category.parent = cate.cid;
                                  $scope.current_category.level = cate.level + 1;


                                  $scope.parentId = cate.cid;
                                  $scope.level = $scope.current_category.level;



                              })

                      } else {

                          $scope.current_category.parent = cate.cid;
                          $scope.current_category.level = cate.level + 1;

                          $scope.parentId = cate.cid;
                          $scope.level = $scope.current_category.level;
                          $scope.editable = true;
                      }



            } else {

            $scope.editable = true;

        }




    }

    $scope.loaddoneEdit = true;
    /////////////////////// EDIT CATEGORY ///////////////////////////
    $scope.edit_category = function (cat) {
        cat.IsTrue = false;
        $scope.loaddoneEdit = false;
        $scope.editable = true;
        $scope.default_parent = false;

        $http.post('/get_custom_category_cid', cat)  //call to retrieve data
            .success(function (data) {

                $scope.current_category = data.currentCat[0];

                $scope.category_name = data.currentCat[0].category;
                $scope.selectedCategoryListObj = data.arrObj;
                $scope.parentId = data.currentCat[0].parent;
                $scope.level = data.currentCat[0].level;

                $scope.prosper_categorylist = [];
                $scope.prosper_categorylist_id = [];

                $scope.prosper_categorylist = data.category;
                $scope.prosper_categorylist_id = data.categoryId;

                easyProsperCategoryList(data.currentCat[0].prosperent_categories,data.currentCat[0].prosperent_categories_id);
            
                $scope.editable = true;
                $scope.loaddoneEdit = true;

            }).error(function (err) {
               $scope.loaddoneEdit = true;

            console.log(" sorry can not created " + err);
        });


    }


    $scope.edit_custom_category = function () {
          console.log($scope.current_category);
                if ($scope.editable) {

                    var l = 0;
                $scope.current_category.category = $scope.category_name;
                $scope.current_category.prosperent_categories = [];
                $scope.current_category.prosperent_categories_id = [];

               // $scope.current_category.parent = $scope.parentId;
               // $scope.current_category.level = $scope.level;
                $scope.current_category.prosperent_categories = $scope.prosper_categorylist;
                $scope.current_category.prosperent_categories_id = $scope.prosper_categorylist_id;

                $http.post('/update_custom_category', $scope.current_category)  //call to retrieve data
                    .success(function (data) {

                        window.alert("successful update");
                        $scope.parentId = -1;
                        $scope.level = 1;
                        $scope.get_all_custom_category();

                    })

            } else {


                window.alert("please refresh it");
                }

    }
    // defining which are child of this
    function buildProsperCategoryList(arra1) {
        var j = 0;
        var k = 0;
        var ind;
        $scope.prosper_categorylist = [];
        $scope.prosper_categorylist_id =[];
        $scope.prosperSelectedCatagoryIndex = [];
        if (arra1.length > 0) {
            for (j_selected = 0; j_selected < arra1.length; j_selected++) {

                for (k = 0; k < $scope.prosperent_catList.length; k++) {

                    if (arra1[j_selected] == $scope.prosperent_catList[k].category) {

                        $scope.prosper_categorylist.push($scope.prosperent_catList[k]);
                        $scope.prosperSelectedCatagoryIndex[j_selected] = k;

                    }


                }

            }

            for (ind = 0; ind < $scope.prosper_categorylist.length; ind++) {
                $scope.prosper_categorylist[ind].IsTrue = true;

            }
        }
    }

	function easyProsperCategoryList(arra1,arr2) {
		
		var j = 0;
        var k = 0;
        var ind;
        var temp;

          $scope.allcategory ={};
		  $scope.catForEdit={};
		if (arr2.length > 0) {
            for (j= 0; j < arr2.length; j++) {

                temp = arr2[j];
		       $scope.allcategory[temp] =true;
			   $scope.catForEdit[temp] = true;
			}

            // for (ind = 0; ind < $scope.prosper_categorylist.length; ind++) {
                // $scope.prosper_categorylist[ind].IsTrue = true;

            // }
        }
    }


    // delete category
    $scope.dCatg = function (cat) {
        $scope.clearSelected();
        $scope.default_parent = false;

        $http.post('/delete_custom_category', cat)  //call to retrieve data
            .success(function (data) {

                if (data.message == 'success') {

                    $scope.get_all_custom_category();

                }
                else
                    window.alert(data.message);
            })
    }

    // unselect all categories
    $scope.clearSelected = function () {
        $scope.prosper_categorylist_id = [];
        $scope.prosper_categorylist = [];
        $scope.allcategory ={};
        $scope.selectedCategoryListObj =[];
        $scope.catForEdit = {};
        $scope.editable = true;



    }

    if(path=='/mappedword') {

       $scope.get_wordmappin_category();

    } else {


        $scope.get_all_custom_category();

    }


    if(path!='/manageCustomCategories')
     $scope.get_categories_prosper_cache();

	 
	 
}]);

SSApp.controller('mapCategoriesCtrl', ['$scope', '$http', '$filter','$location', function ($scope, $http, $filter,$location) {
    $scope.customCategoryList = [];
	 $scope.allcategory ={};
	 $scope.catForEdit={};
     $scope.mapped_word =[];
	$scope.category_track ={};
    var final_cid = 0;
    $scope.lmt = 7546;
    $scope.editable = true;
    $scope.prosper_categorylist = [];
    $scope.prosper_categorylist_id = [];
    $scope.prosperSelectedCatagoryIndex = [];
    
    var path = $location.path();
    
	
	$scope.totalRecordsAvailable=7546;
	$scope.CurrentPage =0;
	 $scope.numPages =   Math.ceil(($scope.totalRecordsAvailable) / ($scope.lmt));
   
    $scope.pageChangedCategory = function() {
	$scope.get_categories_prosper_cache();
	
	}


    // getting categories from csv files	and  make a tree of prosper category
    // outdated idea
    $scope.sync_categories = function () {
        $http.post('/category_delete_All')  //call to retrieve data
        .success(function(data) {
        $http.post('/get_all_catagories_from_csv')  //call to retrieve data
            .success(function (data) {
                window.alert("successful sync operation");

            }).error(function (err) {
            console.log(" SOrry error " + err);
        });
          console.log(data);

        }).error(function(err) {
        console.log(" SOrry error " + err);
        });

    }
    // copy catagories from csv straight forward and make csv
    $scope.sync_categories_prosper = function () {

        $http.post('/category_delete_prosper')  //call to retrieve data
            .success(function (data) {

                $http.post('/catagories_from_csv_straight_forward')  //call to retrieve data
                    .success(function (data) {
                        window.alert("successful sync operation");
                        $scope.lmt = 10000;
                        $scope.get_categories_prosper_cache();
                    }).error(function (err) {
                    console.log(" Sorry error " + err);
                });


            }).error(function (err) {
            console.log(" SOrry error " + err);
            $http.post('/catagories_from_csv_straight_forward')  //call to retrieve data
                .success(function (data) {
                    window.alert("successful sync operation");
                    $scope.lmt = 10000;
                    $scope.get_categories_prosper_cache();
                }).error(function (err) {
                console.log(" Sorry error " + err);
            });


        });


    }

    $scope.delete_categories_prosper = function () {
        $http.post('/category_delete_prosper')  //call to retrieve data
            .success(function (data) {

                window.alert(data);
                $scope.prosperent_catList = null;
            }).error(function (err) {
            console.log(" SOrry error " + err);
        });

    }

    // get all categories from database
    $scope.get_categories_prosper = function () {
	   
        var lt = {limit: $scope.lmt}
        $http.post('/get_catagory_straight_forward', lt)  //call to retrieve data
            .success(function (data) {
                $scope.prosperent_catList = data;
				console.log(data);

            }).error(function (err) {
            console.log(" Sorry error " + err);
        });
    }
    /*imp get category data from cache */
    $scope.get_categories_prosper_cache = function () {
        var lt = {limit: $scope.lmt, page: $scope.CurrentPage };

        $scope.loaddone = false;
        $http.post('/get_categoryList_cache',lt)
		.success(function (data){
            $scope.loaddone = true;

            $scope.prosperent_catList = data;
            $scope.CurrentPage =$scope.CurrentPage + 1;
			  var temp;
              for(var i=0;i<data.length;i++) {
			     $scope.allcategory[data[i].category] = false;
			     $scope.category_track[data[i].category] = data[i].category;
			     if((i+1) ==data.length) {
				    for(var j=0;j<$scope.prosper_categorylist.length;j++) {
					   var temp = $scope.prosper_categorylist[j];
					   $scope.allcategory[temp] = true;
					
					}
				 
				 }
			  
			  }
			  
            }).error(function (err) {
            console.log(" SOrry error " + err);
            $scope.loaddone = true;
			});
    }


    // change limit
    $scope.change_limit = function () {
       
	   if($scope.lmt)
	   {
	     $scope.get_categories_prosper_cache();
         $scope.numPages =   Math.ceil(($scope.totalRecordsAvailable) / ($scope.lmt));
       }
       else
	   {
	   
	     window.alert("Please assign a limit");
	   
	   }
	   
	
	}


    // All custom categories from database



    // relate parent child category

    $scope.get_wordmappin_category = function () {

        $http.post('/get_mapped_words')  //call to retrieve data
            .success(function (data) {
			$scope.mapped_word = angular.copy(data);
              
            })

        $http.post('/get_all_custom_category')  //call to retrieve data
            .success(function (data) {

                $scope.all_category = angular.copy(data);

            })
    }

  


    $scope.custom_category = function () {
        $scope.customCategoryList = [];
        $scope.parentcustomCategoryList = [];
        $http.post('/get_all_custom_category')  //call to retrieve data
            .success(function (data) {

                $scope.all_category = angular.copy(data);
                var x;
                var parent_count1 = 0;
                var parent_level2_count = 0;
                var parent_level3_count = 0;
                var parent_level4_count = 0;
                var parent_level5_count = 0;
                var data_level1 = [];
                var data_level2 = [];
                var data_level3 = [];
                var data_level4 = [];
                var data_level5 = [];
                $scope.TotalCategoriesSubCategories = data.length;


                final_cid = 0;
                // data has been splitted level wise
                var y = 0;
                var yz = 0;
                var yza = 0;
                var yzb = 0;
                var parent;
                var data_temp;
                var caty;
                // first make level wise array of category
                for (x = 0; x < data.length; x++) {
                    data_temp = data[x];
                    data[x].categoryList = [];
                    if (data[x].level == 1) {
                        data_level1[parent_count1] = data[x];  // this is array of first level
                        $scope.customCategoryList.push(data[x]);
                        parent_count1 = parent_count1 + 1;
                    }
                    else if (data[x].level == 2) {
                        data_level2[parent_level2_count] = data[x];
                        parent_level2_count = parent_level2_count + 1;
                    }
                    else if (data[x].level == 3) {
                        data_level3[parent_level3_count] = data[x];
                        parent_level3_count = parent_level3_count + 1;
                    }
                    else if (data[x].level == 4) {
                        data_level4[parent_level4_count] = data[x];
                        parent_level4_count = parent_level4_count + 1;
                    }
                    else if (data[x].level == 5) {
                        data_level5[parent_level5_count] = data[x];
                        parent_level5_count = parent_level5_count + 1;
                    }

                    if (data.length == x + 1) {
                        $scope.parentcustomCategoryList = angular.copy($scope.customCategoryList);
                        $scope.totalCategories = parent_count1;
                        if (parent_level2_count > 0) {
                            for (y = 0; y < data_level2.length; y++) {
                                parent = data_level2[y].parent;
                                relate_parent_child(parent, data_level1, data_level2[y]);
                                if (y + 1 == data_level2.length) {
                                    if (parent_level3_count > 0) {
                                        for (yz = 0; yz < data_level3.length; yz++) {
                                            parent = data_level3[yz].parent;
                                            // parent cid , array of parent , data object
                                            relate_parent_child(parent, data_level2, data_level3[yz]);
                                            if (yz + 1 == data_level3.length) {
                                                if (parent_level4_count > 0) {
                                                    for (yza = 0; yza < data_level4.length; yza++) {
                                                        parent = data_level4[yza].parent;
                                                        // parent cid , array of parent , data object
                                                        relate_parent_child(parent, data_level3, data_level4[yza]);
                                                        if (yza + 1 == data_level4.length) {
                                                            if (parent_level5_count > 0) {
                                                                for (yzb = 0; yzb < data_level5.length; yzb++) {
                                                                    parent = data_level5[yzb].parent;
                                                                    // parent cid , array of parent , data object
                                                                    relate_parent_child(parent, data_level4, data_level5[yzb]);
                                                                }
                                                            }
                                                        }
                                                    } //
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                var new_cid = data.length - 1;

                final_cid = data[new_cid].cid;
            }).error(function (err) {
            console.log(" sorry category can not be get " + err);
        });
    }



    // Category Parent child relation ship function
    


    $scope.pcatList = $scope.prosperent_catList;
    $scope.selectFiltered = function (searchKey) {
        
		var l = 0;
        var temp; 
		
			if(angular.isDefined(searchKey))
			$scope.prosperent_catListx = $filter('filter')($scope.prosperent_catList, {category: searchKey.category});
            else
             $scope.prosperent_catListx = $scope.prosperent_catList;
			
		
        if ($scope.selFilter) {
            
		
			
			console.log($scope.prosperent_catListx); 
			for (l = 0; l < $scope.prosperent_catListx.length; l++)
               {
                temp= $scope.prosperent_catListx[l].category
				$scope.allcategory[temp] =true;
			  
               }        
		
		}
        else {

            for (l = 0; l < $scope.prosperent_catListx.length; l++) {
   			    temp= $scope.prosperent_catListx[l].category
				$scope.allcategory[temp] =false;
             } 
		
		}

    }
    $scope.selectedCategoryListObj = [];
    var temcatId;
     $scope.changeCategoryList= function(catObj,val){
         temcatId = catObj.categoryId;
         var matched = false;
         var catid;
       if(val) {

           if (angular.isDefined($scope.selectedCategoryListObj)){
               if ($scope.selectedCategoryListObj.length > 0) {
                   for (var i = 0; i < $scope.selectedCategoryListObj.length; i++) {


                       if (temcatId == $scope.selectedCategoryListObj[i].categoryId) {

                           matched = true;
                           console.log("already this is inside");
                           break;
                       }


                       if (i + 1 == $scope.selectedCategoryListObj.length) {


                           if (!matched) {

                               console.log("new item need to push");
                               $scope.selectedCategoryListObj.push(catObj);
                               $scope.prosper_categorylist.push(catObj.category);

                               $scope.prosper_categorylist_id.push(catObj.categoryId);

                               catid = catObj.categoryId;
                               $scope.catForEdit[catid] = true;

                           }

                       }


                   }

               }
               else {

                   $scope.selectedCategoryListObj.push(catObj);
                   $scope.prosper_categorylist.push(catObj.category);

                   $scope.prosper_categorylist_id.push(catObj.categoryId);
                   catid = catObj.categoryId;
                   $scope.catForEdit[catid] = true;


               }
           }    else {
               $scope.selectedCategoryListObj =[];
               $scope.prosper_categorylist =[];
               $scope.prosper_categorylist_id =[];
               $scope.selectedCategoryListObj.push(catObj);
               $scope.prosper_categorylist.push(catObj.category);

               $scope.prosper_categorylist_id.push(catObj.categoryId);
               catid = catObj.categoryId;
               $scope.catForEdit[catid] = true;


           }



       }
       else {

           for(var i=0;i<$scope.selectedCategoryListObj.length;i++ ) {



               if (temcatId == $scope.selectedCategoryListObj[i].categoryId) {

                   matched = true;

                   $scope.selectedCategoryListObj.splice(i, 1);
                   $scope.prosper_categorylist.splice(i, 1);
                   $scope.prosper_categorylist_id.splice(i, 1);

                   catid = catObj.categoryId;
                   $scope.catForEdit[catid] = false;


               }


           }


       }


     };
    // removing item from selected list
    $scope.changeCategoryListSelected = function (categoryObj, catbool) {

        var temCatid = categoryObj.categoryId;

        //var index = $scope.prosper_categorylist.indexOf(categoryObj.category);
        var temSelectObjId;
        $scope.allcategory[temCatid] = catbool;
        $scope.catForEdit[temCatid] = catbool;
		
		if (!catbool) {




                for(var i=0;i<$scope.selectedCategoryListObj.length;i++ ) {

                    console.log($scope.selectedCategoryListObj[i].categoryId);
                    console.log(temCatid);

                    temSelectObjId = $scope.selectedCategoryListObj[i].categoryId;

                    if(temSelectObjId == temCatid) {

                       console.log("I am heere");

                        $scope.selectedCategoryListObj.splice(i, 1);
                        $scope.prosper_categorylist.splice(i, 1);
                        $scope.prosper_categorylist_id.splice(i, 1);




                    }


                }


            }



		}
		




/*
    $scope.changeCategoryList = function (catObj, obj, index) {

         var index=-1;
        var indexId =-1;
         if(angular.isDefined($scope.prosper_categorylist))
         index = $scope.prosper_categorylist.indexOf(catObj.category);

        if(angular.isDefined($scope.prosper_categorylist_id))
            indexId = $scope.prosper_categorylist_id.indexOf(catObj.categoryId);




        if (!obj) {
   

      
            if (index > -1) {
                $scope.prosper_categorylist.splice(index, 1);
            }

            if (indexId > -1) {
                $scope.prosper_categorylist_id.splice(indexId, 1);
            }

            $scope.catForEdit[catObj.category] = false;

		
		}

        else if (obj) {
            

			$scope.catForEdit[catObj.category] = true;
			if (index > -1) {
			    console.log('already there');

			}
			else
			{
		    
			$scope.prosper_categorylist.push(catObj.category);
            $scope.prosper_categorylist_id.push(catObj.categoryId);
			
			}  
           
        }
    };

    */

    $scope.refresh_category = function () {
        $scope.editable = true;
        $scope.parentId = -9;
        $scope.level = 0;
        $scope.category_name = "";
        var n = 0;
        var x;
	   $scope.allcategory ={};
	   $scope.catForEdit={};

        $scope.prosper_categorylist = [];
        $scope.prosper_categorylist_id = [];


        $scope.selectedCategoryListObj =[];
        $scope.current_category ={};

    }


    //////////////////////// CREATE CATEGORY //////////////////////////


    $scope.create_custom_category = function (category_name,categoryobjList) {


        if(!(angular.isDefined(category_name))){
            window.alert("enter some value");
            return;

        }
        if(category_name.trim()==""){
            window.alert("enter some value");
            return;

        }

        $scope.editable = true;
        $scope.parentId = -1;
        $scope.level = 1;
        var cat = {'cat_title': category_name};
        var j = 0;
        cat.parent = -1;
        cat.level = 1;
        var count = 0;
        var multiple_parent;
        var k = 0;
        var l = 0;
        var m = 0;
        var leng = 0;
        var sublist;
        if($scope.default_parent) {

            count =1;

        }


        if (angular.isDefined($scope.customCategoryList))
            leng = $scope.customCategoryList.length;

        // find any parents there and we are not using default
        if (leng > 0 && (!$scope.default_parent)) {

            // find out some of the properties such as who is the parent
            for (j = 0; j < leng; j++) {

                if ($scope.customCategoryList[j]['IsTrue']) {

                    cat.parent = $scope.customCategoryList[j]['cid'];
                    cat.level = $scope.customCategoryList[j]['level'] + 1;

                    count++;
                    j = leng;
                }


                else if ($scope.customCategoryList[j]['categoryList'].length > 0) {
                    sublist = $scope.customCategoryList[j]['categoryList'];

                    for (k = 0; k < sublist.length; k++) {
                        if (sublist[k]['IsTrue']) {

                            cat.parent = sublist[k]['cid'];
                            cat.level = sublist[k]['level'] + 1;
                            count++;
                            multiple_parent = multiple_parent + "," + category_name;

                                k = angular.copy(sublist.length);


                        }
                        else if (sublist[k]['categoryList'].length > 0) {

                            sublist_level3 = sublist[k]['categoryList'];

                            for (l = 0; l < sublist_level3.length; l++) {
                                if (sublist_level3[l]['IsTrue']) {

                                    cat.parent = sublist_level3[l]['cid'];
                                    cat.level = sublist_level3[l]['level'] + 1;
                                    count++;

                                        l = angular.copy(sublist_level3.length);
                                        k = angular.copy(sublist.length);

                                } // checked level 3 to define level 4
                                else if (sublist_level3[l]['categoryList'].length > 0) {
                                    sublist_level4 = sublist_level3[l]['categoryList'];
                                    for (m = 0; m < sublist_level4.length; m++) {
                                        if (sublist_level4[m]['IsTrue']) {

                                            cat.parent = sublist_level4[m]['cid'];
                                            cat.level = sublist_level4[m]['level'] + 1;
                                            count++;
                                            multiple_parent = multiple_parent + "," + category_name;

                                                m = angular.copy(sublist_level4[m].length);
                                                l = angular.copy(sublist_level3.length);
                                                k = angular.copy(sublist.length);
                                                



                                        }


                                    }
                                }
                            }
                        }


                    }
                }
                if (count >= 1) {
                    break;

                }




            }
        }
        
        // when check custom category parent  
        if (count > 1)
            window.alert("Error : you are trying to make show same sub category under multiple category " + multiple_parent);
        else {
        
            //cat.cid = final_cid + 1;
            var j = 0;
            var cat_arr = [];
            var cat_arr_id =[];

			cat.prosper_categorylist =  angular.copy($scope.prosper_categorylist);
            cat.prosperent_categories_id =  angular.copy($scope.prosper_categorylist_id);
            $http.post('/create_custom_category', cat)  //call to retrieve data
                .success(function (data) {
                    $scope.editable = true;
                    $scope.get_all_custom_category();
                }).error(function (err) {
                console.log(" sorry can not created " + err);
            });
        }
    }

    $scope.create_custom_mapping = function (category_name,categoryobjList) {


        if(!(angular.isDefined(category_name))){
            window.alert("enter some value");
            return;

        }
        if(category_name.trim()==""){
            window.alert("enter some value");
            return;

        }

        $scope.editable = true;
        $scope.parentId = -9;
        $scope.level = 0;
        var cat = {'cat_title': category_name};
        var j = 0;
        cat.parent = -9;
        cat.level = 0;
        var count = 0;
        var multiple_parent;
        var k = 0;
        var l = 0;
        var m = 0;
        var leng = 0;
        var sublist;






            //cat.cid = final_cid + 1;
            var j = 0;
            var cat_arr = [];
            var cat_arr_id =[];

            cat.prosper_categorylist =  angular.copy($scope.prosper_categorylist);
            cat.prosperent_categories_id =  angular.copy($scope.prosper_categorylist_id);
            $http.post('/create_custom_category', cat)  //call to retrieve data
                .success(function (data) {
                    $scope.editable = true;
                    $scope.get_wordmappin_category();
                }).error(function (err) {
                console.log(" sorry can not created " + err);
            });

    }


    $scope.setParentRoot = function () {
        if(!(angular.isDefined($scope.selectedCategoryListObj)))
            return;
        else if(!(angular.isDefined($scope.category_name))){

            return;

        } else if($scope.category_name.trim()==''){
            return;
        }






        if($scope.default_parent) {



            $http.post('/get_custom_category_parent', {cid:$scope.current_category.cid }).success(function (data) {


                if(data.length> 0) {

                    $scope.editable = false;

                    window.alert("move or delete the child first! then again click edit of the category!");

                }
                else {
                    $scope.current_category.level = 1;
                    $scope.current_category.parent = -1;
                    $scope.parentId = -1;
                    $scope.level = 1;

                }



            })






        } else if(!($scope.default_parent)) {
            $scope.editable = true;


        }


    }

    // get all custom categories
    

    $scope.loaddoneEdit = true;
    /////////////////////// EDIT CATEGORY ///////////////////////////
    $scope.edit_category = function (cat) {
        cat.IsTrue = false;
        $scope.loaddoneEdit = false;
        $scope.editable = true;
        $scope.default_parent = false;

        $http.post('/get_custom_category_cid', cat)  //call to retrieve data
            .success(function (data) {

                $scope.current_category = data.currentCat[0];

                $scope.category_name = data.currentCat[0].category;
                $scope.selectedCategoryListObj = data.arrObj;
                $scope.parentId = data.currentCat[0].parent;
                $scope.level = data.currentCat[0].level;

                $scope.prosper_categorylist = [];
                $scope.prosper_categorylist_id = [];

                $scope.prosper_categorylist = data.category;
                $scope.prosper_categorylist_id = data.categoryId;

                easyProsperCategoryList(data.currentCat[0].prosperent_categories,data.currentCat[0].prosperent_categories_id);
            
                $scope.editable = true;
                $scope.loaddoneEdit = true;

            }).error(function (err) {
               $scope.loaddoneEdit = true;

            console.log(" sorry can not created " + err);
        });


    }


    $scope.edit_custom_category = function () {
          console.log($scope.current_category);
                if ($scope.editable) {

                    var l = 0;
                $scope.current_category.category = $scope.category_name;
                $scope.current_category.prosperent_categories = [];
                $scope.current_category.prosperent_categories_id = [];

               // $scope.current_category.parent = $scope.parentId;
               // $scope.current_category.level = $scope.level;
                $scope.current_category.prosperent_categories = $scope.prosper_categorylist;
                $scope.current_category.prosperent_categories_id = $scope.prosper_categorylist_id;

                $http.post('/update_custom_category', $scope.current_category)  //call to retrieve data
                    .success(function (data) {

                        window.alert("successful update");
                        $scope.parentId = -9;
                        $scope.level = 0;
                    $scope.get_wordmappin_category();

                    })

            } else {


                window.alert("please refresh it");
                }

    }
    // defining which are child of this
    function buildProsperCategoryList(arra1) {
        var j = 0;
        var k = 0;
        var ind;
        $scope.prosper_categorylist = [];
        $scope.prosper_categorylist_id =[];
        $scope.prosperSelectedCatagoryIndex = [];
        if (arra1.length > 0) {
            for (j_selected = 0; j_selected < arra1.length; j_selected++) {

                for (k = 0; k < $scope.prosperent_catList.length; k++) {

                    if (arra1[j_selected] == $scope.prosperent_catList[k].category) {

                        $scope.prosper_categorylist.push($scope.prosperent_catList[k]);
                        $scope.prosperSelectedCatagoryIndex[j_selected] = k;

                    }


                }

            }

            for (ind = 0; ind < $scope.prosper_categorylist.length; ind++) {
                $scope.prosper_categorylist[ind].IsTrue = true;

            }
        }
    }

	function easyProsperCategoryList(arra1,arr2) {
		
		var j = 0;
        var k = 0;
        var ind;
        var temp;

          $scope.allcategory ={};
		  $scope.catForEdit={};
		if (arr2.length > 0) {
            for (j= 0; j < arr2.length; j++) {

                temp = arr2[j];
		       $scope.allcategory[temp] =true;
			   $scope.catForEdit[temp] = true;
			}

            // for (ind = 0; ind < $scope.prosper_categorylist.length; ind++) {
                // $scope.prosper_categorylist[ind].IsTrue = true;

            // }
        }
    }


    // delete category
    $scope.dCatg = function (cat) {
        $scope.clearSelected();
        $scope.default_parent = false;

        $http.post('/delete_custom_category', cat)  //call to retrieve data
            .success(function (data) {

                if (data.message == 'success') {

                    $scope.get_wordmappin_category();

                }
                else
                    window.alert(data.message);
            })
    }

    // unselect all categories
    $scope.clearSelected = function () {
        $scope.prosper_categorylist_id = [];
        $scope.prosper_categorylist = [];
        $scope.allcategory ={};
        $scope.selectedCategoryListObj =[];
        $scope.catForEdit = {};
        $scope.editable = true;



    }


       $scope.get_wordmappin_category();




    


    if(path!='/manageCustomCategories')
     $scope.get_categories_prosper_cache();

	 
	 
}]);

