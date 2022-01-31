
UserApp.service('searchService', function($http, $q,$location,$cookies) { return {

    'generateUrlForProsperentApi': function(data,scope,pageNo) {
        var defer = $q.defer();

          // following function generate url for prosperent
        scope.timeGapRequest = 0;
        scope.stopclickIntervalForRequest();
        scope.tempgeneratedlink ="";
        scope.urlforloadmore ='';
        scope.similiar_url ="";  
        var generated_url = "";  // this is the url that generate the api request
        var search_operation = 0;
        var group = "";

        //var group = "&groupBy=productId";
        var count = 0;
        var bcount = 0;
        var ccount = 0;
        var mcount = 0;
        var somekey = false;
        var relevancyThreshold = "";
        scope.select_merchant = ""; // merchant request string

        var current_path = $location.path();

        if (current_path == '/' || current_path == '/dashboard') {

            console.log("path home");

        }
        else {
            if (scope.firsttime.loading == 0 && (current_path == '/search'))  // first time visited make the list empty
            {
                scope.selected_merchantlist = []; // make dashboard selected merchant as empty

            }


        }

        // if user click on menu item
        if (scope.justClickedMenu)  {


            if (!angular.isDefined(scope.usermenu)) {                 //usermenu value has not assigned
                console.log("search will run on its own way")

            }

            else {
                if (scope.loggedin == 1) {
                    if (scope.usermenu == 'dashboard') {
                        if (angular.isDefined(scope.userstoptenDashboard)) {
                            if (scope.userstoptenWomen.length > 0)
                                scope.selected_merchantlist = angular.copy(scope.userstoptenDashboard);
                            else
                                scope.selected_merchantlist = angular.copy(scope.featuredShoplistDashboard);
                        }
                    }


                    else if (scope.usermenu == 'women') {
                        if (angular.isDefined(scope.userstoptenWomen)) {
                            if (scope.userstoptenWomen.length > 0)
                                scope.selected_merchantlist = angular.copy(scope.userstoptenWomen);
                            else {
                                scope.selected_merchantlist = angular.copy(scope.featuredShoplistWomen);

                            }
                        }
                        else {
                            scope.selected_merchantlist = angular.copy(scope.featuredShoplistWomen);

                        }
                    }
                    else if (scope.usermenu == 'men') {
                        if (angular.isDefined(scope.userstoptenMen)) {
                            if (scope.userstoptenMen.length > 0) {
                                scope.selected_merchantlist = angular.copy(scope.userstoptenMen);
                            }
                            else {
                                scope.selected_merchantlist = angular.copy(scope.featuredShoplistMen);
                            }

                        }
                        else {
                            scope.selected_merchantlist = angular.copy(scope.featuredShoplistMen);
                            //z =scope.featuredShoplistMen;
                        }
                    }  // men end
                    else if (scope.usermenu == 'shoes') {
                        if (angular.isDefined(scope.userstoptenShoes)) {
                            if (scope.userstoptenShoes.length > 0)
                                scope.selected_merchantlist = angular.copy(scope.userstoptenShoes);
                            else
                                scope.selected_merchantlist = angular.copy(scope.featuredShoplistShoes);
                        }
                        else
                            scope.selected_merchantlist = angular.copy(scope.featuredShoplistShoes);
                    }

                    else if (scope.usermenu == 'accessories') {
                        if (angular.isDefined(scope.userstoptenAccessories)) {
                            if (scope.userstoptenAccessories.length > 0)
                                scope.selected_merchantlist = angular.copy(scope.userstoptenAccessories);
                            else
                                scope.selected_merchantlist = angular.copy(scope.featuredShoplistAccessories);
                        }
                        else
                            scope.selected_merchantlist = angular.copy(scope.featuredShoplistAccessories);
                    }

                    else if (scope.usermenu == 'beauty') {
                        if (angular.isDefined(scope.userstoptenBeauty)) {
                            if (scope.userstoptenBeauty.length > 0)
                                scope.selected_merchantlist = angular.copy(scope.userstoptenBeauty);
                            else
                                scope.selected_merchantlist = angular.copy(scope.featuredShoplistBeauty);
                        }
                        else
                            scope.selected_merchantlist = angular.copy(scope.featuredShoplistBeauty);


                    }  // men end
                    else if (scope.usermenu == 'kid') {
                        if (angular.isDefined(scope.userstoptenKids)) {
                            if (scope.userstoptenKids.length > 0)
                                scope.selected_merchantlist = angular.copy(scope.userstoptenKids);
                            else
                                scope.selected_merchantlist = angular.copy(scope.featuredShoplistKids);
                        }
                        else
                            scope.selected_merchantlist = angular.copy(scope.featuredShoplistKids);


                    }

                    else if (scope.usermenu == 'home') {
                        if (angular.isDefined(scope.userstoptenHome)) {
                            if (scope.userstoptenHome.length > 0)
                                scope.selected_merchantlist = angular.copy(scope.userstoptenHome);
                            else
                                scope.selected_merchantlist = angular.copy(scope.featuredShoplistHome);
                        }
                        else
                            scope.selected_merchantlist = angular.copy(scope.featuredShoplistHome);


                    }

                    else if (scope.usermenu == 'gift') {
                        if (angular.isDefined(scope.userstoptenGifts)) {
                            if (scope.userstoptenGifts.length > 0)
                                scope.selected_merchantlist = angular.copy(scope.userstoptenGifts);
                            else
                                scope.selected_merchantlist = angular.copy(scope.featuredShoplistGifts);
                        }
                        else
                            scope.selected_merchantlist = angular.copy(scope.featuredShoplistGifts);

                    }


                    else if (scope.usermenu == '') {
                        if (angular.isDefined(scope.userstoptenLocal)) {
                            if (scope.userstoptenLocal.length > 0)
                                scope.selected_merchantlist = angular.copy(scope.userstoptenLocal);
                            else
                                scope.selected_merchantlist = angular.copy(scope.featuredShoplistOthers);
                        }
                        else
                            scope.selected_merchantlist = angular.copy(scope.featuredShoplistOthers);

                    }

                    else {
                        if (angular.isDefined(scope.userstoptenLocal)) {
                            if (scope.userstoptenLocal.length > 0)
                                scope.selected_merchantlist = angular.copy(scope.userstoptenLocal);
                            else
                                scope.selected_merchantlist = angular.copy(scope.featuredShoplistOthers);
                        }
                        else
                            scope.selected_merchantlist = angular.copy(scope.featuredShoplistOthers);

                    }


                }
                else {
                    if (scope.usermenu == 'dashboard') {

                        scope.selected_merchantlist = angular.copy(scope.featuredShoplistDashboard);

                    }
                    else if (scope.usermenu == 'home') {

                        scope.selected_merchantlist = angular.copy(scope.featuredShoplistDashboard);

                    }

                    else if (scope.usermenu == 'women') {

                        scope.selected_merchantlist = angular.copy(scope.featuredShoplistWomen);

                    }
                    else if (scope.usermenu == 'men') {
                        scope.selected_merchantlist = angular.copy(scope.featuredShoplistMen);
                    }
                    else if (scope.usermenu == 'shoes') {
                        scope.selected_merchantlist = angular.copy(scope.featuredShoplistShoes);
                    }
                    else if (scope.usermenu == 'accessories') {
                        scope.selected_merchantlist = angular.copy(scope.featuredShoplistAccessories);
                    }
                    else if (scope.usermenu == 'beauty') {
                        scope.selected_merchantlist = angular.copy(scope.featuredShoplistBeauty);
                    }  // men end
                    else if (scope.usermenu == 'kid') {
                        scope.selected_merchantlist = angular.copy(scope.featuredShoplistKids);

                    }

                    else if (scope.usermenu == 'home') {
                        scope.selected_merchantlist = angular.copy(scope.featuredShoplistHome);
                    }

                    else if (scope.usermenu == 'gift') {
                        scope.selected_merchantlist = angular.copy(scope.featuredShoplistGifts);
                    }

                    else if (scope.usermenu == '') {
                        scope.selected_merchantlist = angular.copy(scope.featuredShoplistOthers);
                    }
                    else
                        scope.selected_merchantlist = angular.copy(scope.featuredShoplistOthers);


                }


            }// end check whether it is not dashboard
        }

        //////////////////// MERCHANT //////////
        // use different array for when user click top merchants

        // scope.selected_merchantlist hold featured shops

        var tempMerchant;
        // global search consider all merchant
        var ty;
        scope.keywordstring ="";
        scope.select_color="";

        var brsim="";
        var tg;
        
        
        if (scope.globalSearch) {
            scope.selected_merchantlist = angular.copy(scope.selected_merchantlistByclick);

            if(scope.selected_merchantlistByclick) {
                for (count = 0; count < scope.selected_merchantlistByclick.length; count++) {

                    tempMerchant = scope.selected_merchantlistByclick[count];
                    //scope.prosearch[tempMerchant] = true;
                    merchantUrlencode = scope.selected_merchantlistByclick[count];
                    if (count == 0)
                        scope.select_merchant = merchantUrlencode;
                    else
                        scope.select_merchant = scope.select_merchant + "|" + merchantUrlencode;

                }
            }


            var arr_keyword = angular.copy(scope.new_keyword_arr);


            if(scope.new_keyword_arr.length>0) {
                for(var keyIndex=0;keyIndex<scope.new_keyword_arr.length;keyIndex++)    {

                    if( keyIndex==0) {
                        ty = "*"+scope.new_keyword_arr[keyIndex]+"*";
                    }
                    else {

                        ty = ty+"|"+scope.new_keyword_arr[keyIndex]+"*";
                    }
                }
                scope.keywordstring = ty;


            }

            scope.menuClicked = "";
            scope.shopcatset= false;
        }

        else if(current_path == '/dashboard' || current_path == '/' ) {


            if(scope.selected_merchantlist) {
                for (count = 0; count < scope.selected_merchantlist.length; count++) {
                    // merchantUrlencode = scope.urlencoding(scope.selected_merchantlist[count]);
                    merchantUrlencode = scope.selected_merchantlist[count];
                    if (count == 0)
                        scope.select_merchant = merchantUrlencode;
                    else
                        scope.select_merchant = scope.select_merchant + "|" + merchantUrlencode;

                }
            }
            scope.selected ="";
            scope.new_keyword_arr =[];
        }
        else {
            scope.selected_merchantlist = angular.copy(scope.selected_merchantlistByclick);
            

            if(angular.isDefined(scope.selected_merchantlistByclick)&& scope.selected_merchantlistByclick.length>0 ) {
               

                for (count = 0; count < scope.selected_merchantlistByclick.length; count++) {

                    tempMerchant = scope.selected_merchantlistByclick[count];
                    merchantUrlencode = scope.selected_merchantlistByclick[count];
                    // merchantUrlencode = scope.urlencoding(scope.selected_merchantlistByclick[count]);
                    scope.prosearch[tempMerchant] = true;

                    if (count == 0)
                        scope.select_merchant = merchantUrlencode;
                    else
                        scope.select_merchant = scope.select_merchant + "|" + merchantUrlencode;

                }

            }


            if(angular.isDefined(scope.new_keyword_arr) && scope.new_keyword_arr.length>0) {

                for(var keyIndex=0;keyIndex<scope.new_keyword_arr.length;keyIndex++)    {

                    if( keyIndex==0) {
                        ty = "*"+scope.new_keyword_arr[keyIndex]+"*";
                    }
                    else {

                        ty = ty+scope.new_keyword_arr[keyIndex]+"*";
                    }
                }
                scope.keywordstring = ty;

            }
            else if(angular.isDefined(scope.selected_key) && scope.selected_key.trim()!='' ) // seraching within page
            {

                scope.searchforstring = scope.selected_key;
                scope.new_keyword_arr = [];

                var keysArray = scope.selected_key.split(" ");

                for(var ky=0;ky<keysArray.length;ky++) {

                    if(keysArray[ky].trim()!="") {
                        scope.new_keyword_arr.push(keywordarr[k]);
                    }

                    if(ky+1==keysArray.length){  // constructing

                        for(var keyIndex=0;keyIndex<scope.new_keyword_arr.length;keyIndex++)    {

                            if( keyIndex==0) {
                                ty = "*"+scope.new_keyword_arr[keyIndex]+"*";
                            }
                            else {

                                ty = ty+scope.new_keyword_arr[keyIndex]+"*";
                            }
                        }
                        scope.keywordstring = ty;

                    }

                }
            }
        }

        generated_url = "filterTwoTapSupported=1";
       // generated_url = "&filterTwoTapSupported=1&imageMaskDomain=http://sociallyshoppable.com";
        var twotapstr = "filterTwoTapSupported=1";
        var ty;
        var merstring="";
        if (count > 0) {
            ty = scope.urlencoding(scope.select_merchant);
            generated_url = generated_url + "&filterMerchant=" + ty; // just begin
            merstring ="&filterMerchant=" + ty;

        }
        //////////////////// BRAND //////////
            
    
        for (bcount = 0; bcount < scope.selected_brandlist.length; bcount++) {

            brandUrlencode = scope.selected_brandlist[bcount];
            console.log(bcount);
            if (bcount == 0)
                scope.select_brand = brandUrlencode;
            else
                scope.select_brand = scope.select_brand + "|" + brandUrlencode;

            if((bcount+1)==scope.selected_brandlist.length)
            {
                tg= scope.urlencoding(scope.select_brand);
                brsim ="&filterBrand=" +tg ;
                generated_url = generated_url + brsim ;

            }
        }

        scope.similiarpro ="";

        if(brsim.trim()!='' && angular.isDefined(brsim))
        scope.similiar_url = brsim;
        var j = "";
        var temp_cat;
        var temp_map;           // mapping category temp variable
        var map_count = 0;
        var categoryencode;     // category encoded temporary variable

        // for instance we already mapped this then why do we use string search
        var tempcategoryhe;
        // following means user clicking menu if mapped data available it will take data from
        // there
        var mappinghappenfromadmin =false;   // if no category mapped then mappning happen from admin remain 
        var temp_cat;
        tempcategoryhe = scope.usermenu;

        // if user click a menu item or store under top menu and it's mapped data available
        if ((scope.justClickedMenu||scope.shopcatset|| scope.slidimageclick) && angular.isDefined(scope.usermenu) && scope.usermenu!='' && angular.isDefined(scope.mapped_cat[tempcategoryhe]) && scope.mapped_cat[tempcategoryhe].length>0 ) {
            temp_map = scope.mapped_cat[tempcategoryhe];
            for(map_count=0;map_count<temp_map.length;map_count++) {
                categoryencode = temp_map[map_count];
                if(mcount==0)                              // with out anything will happen for first category
                    scope.select_category =categoryencode;
                else
                    scope.select_category = scope.select_category  +"|"+categoryencode+"";

                mcount = 1;
                if((map_count+1)==temp_map.length) {
                    generated_url = generated_url + "&filterCategory=" + scope.urlencoding(scope.select_category);


                }
            }

        }


        else {

            if(scope.selected_categorylist.length>0) {
                for(ccount=0;ccount<scope.selected_categorylist.length;ccount++) {
                    temp_cat = scope.selected_categorylist[ccount];
                    if(angular.isDefined(scope.mapped_cat[temp_cat]) && scope.mapped_cat[temp_cat].length>0) {
                
                             temp_map = scope.mapped_cat[temp_cat];
                            for(map_count=0;map_count<temp_map.length;map_count++) {

                                categoryencode = temp_map[map_count];
                                
                                
                                if(mcount==0)                              // with out anything will happen for first category
                                    scope.select_category =categoryencode;
                                else
                                    scope.select_category = scope.select_category  +"|"+categoryencode+"";

                                mcount = 1;

                            }
                    }
                   else{ // when it donot find mapped category
                       
                                if(mcount==0)                              // with out anything will happen for first category
                                    scope.select_category ="*" +temp_cat+ "*";
                                else
                                    scope.select_category = scope.select_category  +"|*"+temp_cat+"*";

                                mcount = 1;
                                               
                      
                   }  
                
                }

            }

            if (scope.menuClicked != "" && scope.menuClicked != "dashboard" && angular.isDefined(scope.menuClicked)) {
                if (scope.menuClicked == 'women') {
                    var wmn = scope.urlencoding('women');
                    var grl = scope.urlencoding('girl');

                    if (mcount == 0) {
                        scope.select_category = "*" + wmn + "*|*"+grl+"*";
                        mcount = 1;
                    }
                    else
                        scope.select_category = "*" + wmn + "*|*"+grl+"*" + scope.select_category;


                    scope.similiarpro = "*" + wmn + "*|*"+grl+"*";

                }


                else if (scope.menuClicked == 'men') {
                    var mn = scope.urlencoding(' men');


                    if (mcount == 0) {
                        scope.select_category = "*" + mn + "*";
                        mcount = 1;
                    }
                    else
                        scope.select_category = "*" + mn + "*|" + scope.select_category;

                    scope.similiarpro = "*" + mn + "*";
                }
                else if (scope.menuClicked == 'shoes') {
                    if (mcount == 0) {
                        scope.select_category = "shoes*|*sneakers*|*boots*|*slippers|*trainers*|*shoe*";
                        mcount = 1;
                    }
                    else
                        scope.select_category = "shoes*|*sneakers*|*boots*|*slippers*|*trainers*|*shoes*|" + scope.select_category;

                    scope.similiarpro = "shoes*|*sneakers*|*boots*|*slippers|*trainers*|*shoe*";
                }
                else if (scope.menuClicked == 'accessories') {
                    if (mcount == 0) {
                        scope.select_category = "accessory*|*accessories*";
                        mcount = 1;
                    }
                    else
                        scope.select_category = "accessory*|*accessories*|" + scope.select_category;


                    scope.similiarpro = "accessory*|*accessories*";
                }
                else if (scope.menuClicked == 'beauty') {
                    if (mcount == 0) {
                        scope.select_category = "*beauty*|*jewelry*|*skin*";
                        mcount = 1;
                    }
                    else
                        scope.select_category = "*beauty*|*jewelry*|*skin*|" + scope.select_category;


                    scope.similiarpro = "*beauty*|*jewelry*|*skin*";
                }


                else if (scope.menuClicked == 'kid') {
                    if (mcount == 0) {
                        scope.select_category = "*baby*|*child*|*toddler*|*girl*|*boy*|*kid*";
                        mcount = 1;
                    }
                    else
                        scope.select_category = "*baby*|*child*|*toddler*|*girl*|*boy*|*kid*|" + scope.select_category;

                    scope.similiarpro = "*baby*|*child*|*toddler*|*girl*|*boy*|*kid*";
                }
                else if (scope.menuClicked == 'home') {

                    var hw = '';

                    if (mcount == 0) {

                        scope.select_category = "*home & kitchen*|*room*|*furniture*|*kitchen*|*light*|*curtain*|*Utensils*|*pan*|*pot*|*garden*";
                        mcount = 1;
                    }
                    else
                        scope.select_category = "*home & kitchen*|*room|*furniture*|*kitchen*|*light*|*curtain*|*Utensils*|*pan*|*pot*|*garden*|" + scope.select_category;


                    scope.similiarpro =   "*home & kitchen*|*room*|*furniture*|*kitchen*|*light*|*curtain*|*Utensils*|*pan*|*pot*|*garden*";
                }
                else if (scope.menuClicked == 'gift') {


                    if (mcount == 0) {

                        scope.select_category = "*gift*";
                        mcount = 1;
                    }
                    else
                        scope.select_category = "*gift*|" + scope.select_category;

                    scope.similiarpro = "*gift*";

                }
                else {

                    if(angular.isDefined(scope.otherMenu) && scope.otherMenu.trim!='') {
                        if (mcount == 0) {
                            scope.select_category = "*" + scope.otherMenu + "*";
                            mcount = 1;
                        }
                        else
                            scope.select_category = "*" + scope.otherMenu + "*|" + scope.select_category;

                        scope.similiarpro = "*" + scope.otherMenu + "*";
                    }
                }
            }


            var tc;
            if (mcount > 0) {
                tc= scope.urlencoding(scope.select_category);

                generated_url = generated_url + "&filterCategory=" + tc;
            }

        }


        var poff;
        var roff;
        //percent wise filter
        if (scope.percent.range[0] != 0.00 && scope.percent.range[1] != 100.00) {

            poff = scope.percent.range[0] + "," + scope.percent.range[1];
            roff = scope.urlencoding(poff);
            generated_url = generated_url +  "&filterPercentOff=" + roff;
            scope.similiar_url =  scope.similiar_url + "&filterPercentOff=" + roff;
        }
        else if (scope.percent.range[0] != 0.00)
        {
            poff = scope.percent.range[0] + ",";
            roff = scope.urlencoding(poff);
            generated_url = generated_url + "&filterPercentOff=" +roff;
            scope.similiar_url =  scope.similiar_url  + "&filterPercentOff=" + roff;

        }
        else if (scope.percent.range[1] != 100.00) // upper limit changed
        {
            poff = ","+ scope.percent.range[1];
            roff = scope.urlencoding(poff);
            generated_url = generated_url + "&filterPercentOff=" + roff;

            scope.similiar_url =  scope.similiar_url  + "&filterPercentOff=" + roff;

        }

        // check is there any sale offer running

        //scope.similiar_url =  scope.similiar_url  + "&filterTwoTapSupported=1";


        // generated_url =generated_url+ "&enableFulldata=true&enableQuerySuggestion=true&enableFacets=true&imageSize=250x250";


        scope.urlForSuggestion = angular.copy(generated_url);
        var fkeyword ="";

        var occ_casual;
        var occ_work;
        var occ_vacation;
        var occ_other;
        //var wco = scope.urlencoding('wear to work');
        var wco = "wear to work";

        var ocas = scope.urlencoding("|*casual*");
        var  ocas1  = scope.urlencoding("*casual*");

        var gw ="|*"+wco+"*|*uniform*";
        var owork = scope.urlencoding(gw);


        var gw1 = "*"+wco+"*|*uniform*";
        var owork1 = scope.urlencoding(gw1);

        var ov = scope.urlencoding("|*vacation*|*holiday*");
        var ov1 =  scope.urlencoding("*vacation*|*holiday*");

        var ocos ="|*valentine*|*hallowen*|*christmas*|*marriage*|*engagement*|*victory*|*eid*|*shabbat*|*Holi*|*Diwali*|*Magha*";
        var ocov = scope.urlencoding(ocos);
        var ocos1 ="*valentine*|*hallowen*|*christmas*|*marriage*|*engagement*|*victory*|*eid*|*shabbat*|*Holi*|*Diwali*|*Magha*";
        var ocov1 = scope.urlencoding(ocos1); // clear 


        if (scope.color_arr.length>0) {
            for(var colindex=0;colindex<scope.color_arr.length;colindex++) {
                if(colindex>0)
                    scope.select_color = scope.select_color + "|*"+scope.color_arr[colindex] +"*"
                else
                    scope.select_color = "*"+scope.color_arr[colindex] +"*"
            }
            somekey = true;
            scope.urlForSuggestion = scope.urlForSuggestion + "&filterKeyword=" + scope.urlencoding(scope.select_color);
            scope.similiar_url =  scope.similiar_url  + "&filterKeyword=" +  scope.urlencoding(scope.select_color);

            occ_casual = generated_url + "&filterKeyword="+ scope.urlencoding(scope.select_color) + ocas1; // casual
            occ_vacation = generated_url +"&filterKeyword="+ scope.urlencoding(scope.select_color) +ov1 ; // vacation
            occ_work = generated_url + "&filterKeyword=" + scope.urlencoding(scope.select_color) + owork1; //work
            occ_other = generated_url + "&filterKeyword="+ scope.urlencoding(scope.select_color) + ocov1; // other


            // scope.keywordstring = scope.select_color;
        }
        else
        {
            occ_casual = generated_url + "&filterKeyword=" + ocas1; // casual
            occ_vacation = generated_url +"&filterKeyword=" +ov1 ; // vacation
            occ_work = generated_url + "&filterKeyword=" + owork1; //work
            occ_other = generated_url + "&filterKeyword=" + ocov1; // other

        }



        if (scope.keywordstring !='') { // since already something infront then every one will come back with some thing

            if (angular.isDefined(scope.oc_casual) && scope.oc_casual) {
                //   generated_url = generated_url + ocas;
                scope.urlForSuggestion = scope.urlForSuggestion + ocas;
                scope.similiar_url =  scope.similiar_url  + ocas;
                scope.keywordstring =  scope.keywordstring + "|*casual*";

            }


            if (angular.isDefined(scope.oc_work) &&  scope.oc_work) {
                //   generated_url = generated_url + owork;
                scope.urlForSuggestion = scope.urlForSuggestion + owork;
                scope.similiar_url =  scope.similiar_url  + owork;
                scope.keywordstring =  scope.keywordstring + "|*"+wco+"*|*uniform*";
            }

            if (angular.isDefined(scope.oc_vacation) && scope.oc_vacation) {
                scope.urlForSuggestion = scope.urlForSuggestion + ov;
                scope.similiar_url =  scope.similiar_url + ov;

                scope.keywordstring =  scope.keywordstring + "|*vacation*|*holiday*";

            }


            if (angular.isDefined(scope.oc_other) && scope.oc_other) {

                scope.urlForSuggestion = scope.urlForSuggestion + ocov;
                scope.similiar_url =  scope.similiar_url  + ocov;
                scope.keywordstring =  scope.keywordstring + "|*valentine*|*hallowen*|*christmas*|*marriage*|*engagement*|*victory*|*eid*|*shabbat*|*Holi*|*Diwali*|*Magha*";
            }


        } // key wordstring not empty color is there

        else  // no color
        {

            if (angular.isDefined(scope.oc_casual) && scope.oc_casual) {

                somekey = true;
                scope.urlForSuggestion = scope.urlForSuggestion + "&filterKeyword="+ocas1;
                scope.similiar_url =  scope.similiar_url  + "&filterKeyword="+ocas1;
                scope.keywordstring =  scope.keywordstring + "*casual*";
                console.log("I am here 1");

                if (angular.isDefined(scope.oc_vacation) && scope.oc_vacation) {
                    scope.urlForSuggestion = scope.urlForSuggestion + ov;
                    scope.similiar_url =  scope.similiar_url + ov;

                    scope.keywordstring =  scope.keywordstring + "|*vacation*|*holiday*";
                    console.log("I am here 2");
                }


                if (angular.isDefined(scope.oc_work) &&  scope.oc_work) {

                    scope.urlForSuggestion = scope.urlForSuggestion + owork;
                    scope.similiar_url =  scope.similiar_url  + owork;
                    scope.keywordstring =  scope.keywordstring + "|*"+wco+"*|*uniform*";
                    console.log("I am here 3");
                }

                if (angular.isDefined(scope.oc_other) && scope.oc_other) {

                    scope.urlForSuggestion = scope.urlForSuggestion + ocov;
                    scope.similiar_url =  scope.similiar_url  + ocov;
                    scope.keywordstring =  scope.keywordstring + "|*valentine*|*hallowen*|*christmas*|*marriage*|*engagement*|*victory*|*eid*|*shabbat*|*Holi*|*Diwali*|*Magha*";
                    console.log("I am here 4");


                }



            } // oc casual true
            else  // oc casual false  key wordstring empty
            {
                if (angular.isDefined(scope.oc_vacation) && scope.oc_vacation) {
                    scope.urlForSuggestion = scope.urlForSuggestion + ov;
                    scope.similiar_url =  scope.similiar_url + ov;
                    scope.keywordstring =  scope.keywordstring + "|*vacation*|*holiday*";
                    console.log("I am here 5");
                    if (angular.isDefined(scope.oc_work) &&  scope.oc_work) {

                        somekey = true;
                        scope.urlForSuggestion = scope.urlForSuggestion + "&filterKeyword="+owork1;
                        scope.similiar_url =  scope.similiar_url  + "&filterKeyword="+owork1;
                        scope.keywordstring =  scope.keywordstring + "*"+wco+"*|*uniform*";
                
                    }

                    if (angular.isDefined(scope.oc_other) && scope.oc_other) {
                        somekey = true;
                        scope.urlForSuggestion = scope.urlForSuggestion + ocov;
                        scope.similiar_url =  scope.similiar_url  + ocov;
                        scope.keywordstring =  scope.keywordstring + "|*valentine*|*hallowen*|*christmas*|*marriage*|*engagement*|*victory*|*eid*|*shabbat*|*Holi*|*Diwali*|*Magha*";

                    }
                }
                else  // oc casual false oc vacation false
                {


                    if (angular.isDefined(scope.oc_work) &&  scope.oc_work) {

                        somekey = true;
                        scope.urlForSuggestion = scope.urlForSuggestion + "&filterKeyword="+owork1;
                        scope.similiar_url =  scope.similiar_url  + "&filterKeyword="+owork1;
                        scope.keywordstring =  scope.keywordstring + "*"+wco+"*|*uniform*";
                        console.log("I am here 8");


                        if (angular.isDefined(scope.oc_other) && scope.oc_other) {

                            scope.urlForSuggestion = scope.urlForSuggestion + ocov;
                            scope.similiar_url =  scope.similiar_url  + ocov;
                            scope.keywordstring =  scope.keywordstring + "|*valentine*|*hallowen*|*christmas*|*marriage*|*engagement*|*victory*|*eid*|*shabbat*|*Holi*|*Diwali*|*Magha*";
                            console.log("I am here 9");


                        }
                    }
                    else if (angular.isDefined(scope.oc_other) && scope.oc_other) {
                        somekey = true;
                        scope.urlForSuggestion = scope.urlForSuggestion + "&filterKeyword="+ocov1;
                        scope.similiar_url =  scope.similiar_url  + "&filterKeyword="+ocov1;
                        scope.keywordstring =  scope.keywordstring + "*valentine*|*hallowen*|*christmas*|*marriage*|*engagement*|*victory*|*eid*|*shabbat*|*Holi*|*Diwali*|*Magha*";
                        console.log("I am here 10");

                    } // oc other and oc vacation

                }// oc work else end
            } // oc casual else

        } // color end



        
        var sale_count_url = "";


        // use cost range for filter
        // does suggestion and price range have relation
        var priceurle;
        var urlencd;
        if (scope.cost.range[0] != 0.00 && scope.cost.range[1] != 1000000.00) {

            priceurle = scope.cost.range[0] + "," + scope.cost.range[1];
            urlencd =scope.urlencoding(priceurle);

            generated_url = generated_url + "&filterPrice=" + urlencd;

            occ_casual = occ_casual + "&filterPrice=" + urlencd;
            occ_work = occ_work + "&filterPrice=" + urlencd;
            occ_vacation = occ_vacation + "&filterPrice="+ urlencd;
            occ_other = occ_other + "&filterPrice=" + urlencd;
            scope.urlForSuggestion = scope.urlForSuggestion + "&filterPrice=" + urlencd;
            scope.similiar_url =  scope.similiar_url +  "&filterPrice=" + urlencd;
        }

        else if (scope.cost.range[0] != 0.00)    // lower limit changed 2500 to upper
        {

            priceurle = scope.cost.range[0] + ",";
            urlencd =scope.urlencoding(priceurle);

            generated_url = generated_url + "&filterPrice=" + urlencd;

            occ_casual = occ_casual + "&filterPrice=" + urlencd;
            occ_work = occ_work + "&filterPrice=" + urlencd;
            occ_vacation = occ_vacation + "&filterPrice=" + urlencd;
            occ_other = occ_other + "&filterPrice=" + urlencd;
            scope.urlForSuggestion = scope.urlForSuggestion + "&filterPrice=" +urlencd;
            scope.similiar_url =  scope.similiar_url + "&filterPrice=" +urlencd;

        }

        else if (scope.cost.range[1] != 1000000.00) // upper limit changed
        {

            priceurle = "," + scope.cost.range[1];
            urlencd =scope.urlencoding(priceurle);

            generated_url = generated_url + "&filterPrice=" + urlencd;
            occ_casual = occ_casual + "&filterPrice=" + urlencd;
            occ_work = occ_work + "&filterPrice=" + urlencd;
            occ_vacation = occ_vacation + "&filterPrice=" + urlencd;
            occ_other = occ_other + "&filterPrice=" + urlencd;
            scope.urlForSuggestion = scope.urlForSuggestion + "&filterPrice=" + urlencd;
            scope.similiar_url =  scope.similiar_url + "&filterPrice=" + urlencd;
        }


        var salepriceurle;
        var saleurlencd;
        salepriceurle ="1,";
        saleurlencd = scope.urlencoding(salepriceurle);


        if (scope.saleOffer) {
            generated_url = generated_url + "&filterPriceSale="+saleurlencd;

            sale_count_url = generated_url;


            occ_casual = occ_casual + "&filterPriceSale="+saleurlencd;
            occ_work = occ_work + "&filterPriceSale="+saleurlencd;
            occ_vacation = occ_vacation + "&filterPriceSale="+saleurlencd;
            occ_other = occ_other + "&filterPriceSale="+saleurlencd;
            scope.urlForSuggestion = scope.urlForSuggestion + "&filterPriceSale="+saleurlencd;
            scope.similiar_url =  scope.similiar_url + "&filterPriceSale="+saleurlencd;


        }
        else {
            sale_count_url = generated_url + "&filterPriceSale="+saleurlencd;

        }

        console.log(scope.keywordstring);
        if(scope.select_color !='' && scope.keywordstring !='') {

            fkeyword = "&filterKeyword="+scope.urlencoding(scope.select_color)+scope.urlencoding(scope.keywordstring);

        }
        else if(scope.select_color !='') {

            fkeyword = "&filterKeyword="+scope.urlencoding(scope.select_color);


        }
        else if(scope.keywordstring !='') {
            fkeyword = "&filterKeyword="+scope.urlencoding(scope.keywordstring);

        }
        generated_url = generated_url + fkeyword;
        sale_count_url = sale_count_url + fkeyword;

        //scope.selected_sorting ="groupCount desc";

        var temp_url = generated_url;
        var sby = ""; // for sort by string 

        // tt = scope.urlencoding(scope.selected_sorting)
        // scope.selected_sorting ="";

        if (scope.selected_sorting != "" && angular.isDefined(scope.selected_sorting)) {
            sby = "&sortBy="+ scope.selected_sorting;
        }
        sale_count_url = sale_count_url + "&limit=10&page=1"+sby;

        occ_casual = occ_casual + "&limit=2&page=1"+sby;
        occ_work = occ_work + "&limit=2&page=1"+sby;
        occ_vacation = occ_vacation +"&limit=2&page=1"+sby;
        occ_other = occ_other + "&limit=2&page=1"+sby;
        generated_url = generated_url + relevancyThreshold + "&limit=" + scope.limit + "&page=" + pageNo + group + sby;


        scope.urlforloadmore =generated_url + relevancyThreshold + "&limit=" + scope.limit;


        //  when searching with keyword / query enable facets


        if (search_operation == 1) {
            scope.extendedurl = "&query=" + scope.urlencoding(scope.selected) + scope.urlForSuggestion + "&limit=100&page=1&groupBy=productId&sortBy=keyword";

        }
        else
            scope.extendedurl = scope.urlForSuggestion + "&limit=100&page=1&groupBy=productId&sortBy=keyword";

        scope.CurrentPage = pageNo;
        //  it can distinguish request from where

        scope.sale_count_url = sale_count_url;
        scope.occ_casual = occ_casual;
        scope.occ_vacation = occ_vacation;
        scope.occ_work = occ_work;
        scope.occ_other = occ_other;

      


        //  window.alert(scope.firsttime.loading);
        scope.firsttime.loading = 1;
        // scope.globalSearch = false;
        //scope.prosperentSearchUrl = generated_url;


        scope.tempgeneratedlink = generated_url;
        // it is counting and tracking time difference between two clicks
        // mainly useful in search result page
        scope.storchosensimiliar_url = twotapstr + scope.similiar_url;
        scope.similiar_url  = twotapstr +  merstring + scope.similiar_url;
        if (scope.firsttime.loading == 0 && current_path.indexOf("SOC")>-1) // if it is single prodycr oage we will not cookie store chosen similiar 
            console.log('OK');
        else
        {
            $cookies.put('similiar',scope.similiar_url);
            $cookies.put('storchosensimiliar',scope.storchosensimiliar_url);

        }
    
        defer.resolve("success");
        return defer.promise;
    },
    
    

     'searchOperationProsperent': function(link) {
        var defer = $q.defer();
        $http.post('product_apisearch', link).then(function successCallback(resp) {
            defer.resolve(resp.data);
        }, function errorCallback(err) {
            defer.reject(err);
        });
        return defer.promise;
    },

  



}});
