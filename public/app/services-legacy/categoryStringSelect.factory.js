
// following service will take a string and find out similiar category
UserApp.factory('categorylistSelectFromString',function categorylistSelectFromString($http, $q) {

    return {

    'categorylistFormation': function(all_category,selected_categorylist,lowercaseSelectedKeyWord) {
     
       var defer = $q.defer();
        var tempCat;
        var wildCatReplace =""; // this is replacable string

         var stringCategoryArr =[];
        var new_keyword_sting ="";
        //////////////////////Catagory..........////////////////////
        for (var ct = 0; ct < all_category.length; ct++) {  // array of all categories

            tempCat = angular.lowercase(all_category[ct].category);

            if (lowercaseSelectedKeyWord.indexOf(tempCat) > -1) { // checking whether category is part of search string
                if(selected_categorylist.indexOf(tempCat)<0) { // here same category if smaller that will exist

                    stringCategoryArr.push(tempCat);
                    selected_categorylist.push(tempCat);
                    if(wildCatReplace=="" || tempCat.length>wildCatReplace.length)
                    {

                        wildCatReplace = tempCat;

                    }


                }

            } else if(tempCat.indexOf(lowercaseSelectedKeyWord) > -1) { // checking whether string is part of category
                if(selected_categorylist.indexOf(tempCat)<0) {

                    stringCategoryArr.push(tempCat);
                    selected_categorylist.push(tempCat);
                    if(wildCatReplace=="" || lowercaseSelectedKeyWord.length>wildCatReplace.length) {

                        wildCatReplace = lowercaseSelectedKeyWord;

                    }


                }

            }

            if (ct + 1 == all_category.length) { // all item check end

                if(wildCatReplace.trim()!=""){

                    // $scope.selected_categorylist.push(wildCatReplace);
                    lowercaseSelectedKeyWord = lowercaseSelectedKeyWord.replace(wildCatReplace, '').trim();
                    lowercaseSelectedKeyWord = lowercaseSelectedKeyWord.replace(/  +/g, ' ');
                    var keyStringArrRest = lowercaseSelectedKeyWord.split(" ");
                    // following logic will remove all single letter in search string

                    for(var t=0;t<keyStringArrRest.length;t++ ){

                         if(keyStringArrRest[t].length>1){

                             if(new_keyword_sting==""){

                                 new_keyword_sting = keyStringArrRest[t];
                             } else {

                                 new_keyword_sting = new_keyword_sting + " " +keyStringArrRest[t];

                             }


                         }


                    }


                }


            }


        }

        var result ={lowercaseSelectedKeyWord:new_keyword_sting, selected_categorylist: selected_categorylist, stringCategoryArr : stringCategoryArr  };

        defer.resolve(result);
        return defer.promise;
    }


	};

 })// factory end 



UserApp.factory('categoryNode',function categoryNode($q) {

    return {
        'categoryNodeFromId': function(cid,all_category,selected_categorylist) {
            var defer = $q.defer();


            var fid;
            var temp;
            var matched = false;
            var d ={selected_categorylist:selected_categorylist };

            for(var ind=0;ind<all_category.length;ind++){

                temp = all_category[ind].cid;
                if(temp ==cid ){
                    fid = all_category[ind];
                    matched = true;

                }

                if(ind+1==all_category.length || matched){

                    if(matched){
                        var ctname= fid.category;
                        var iop =selected_categorylist.indexOf(ctname);
                        if(iop>-1){
                            selected_categorylist.splice(iop,1);
                            d.selected_categorylist = selected_categorylist;
                        }
                        d.fid = fid;
                        defer.resolve(d);
                        ind = all_category.length;



                    } else {
                        d.fid = fid;
                        defer.reject(d);
                        ind = all_category.length;
                    }
                }



            }

            return defer.promise;
        }



    };

})// factory end