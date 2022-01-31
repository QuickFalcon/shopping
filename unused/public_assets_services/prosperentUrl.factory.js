

UserApp.factory('prosperentUrlGen',function prosperentUrlGen($http, $q,$location,$cookies) { 

    return {

    'generateUrlForProsperentApi': function(data,scope,pageNo) {
       //scope.selected_sorting ="relevance";        

	   var defer = $q.defer();
          // following function gurlBrandWiseProductCountenerate url for prosperent
        //var pipeEncd = scope.urlencoding("|");
         var pipeEncd = "|";
		   var astrick ="*";
       
	       var astrickEncd =scope.urlencoding(astrick);
      scope.stopclickIntervalForRequest();
      scope.timeGapRequest = 0;
        
        scope.tempgeneratedlink ="";
        scope.urlforloadmore ='';
        scope.similiar_url ="";  
        var generated_url = "";  // this is the url that generate the api request
        var search_operation = 0;
        var group = "";
        var salepriceurle ="1,";
        var saleurlencd = scope.urlencoding(salepriceurle);
        //var group = "&groupBy=productId";
        var count = 0;
        var bcount = 0;
        var ccount = 0;
        var mcount = 0;
        var somekey = false;
        var relevancyThreshold = "";
        scope.select_merchant = ""; // merchant request string
        scope.select_brand ="";
        scope.select_category ="";
        var current_path = $location.path();

   
            if (scope.firsttime.loading == 0 && (current_path == '/search'))  // first time visited make the list empty
            {
                scope.selected_merchantlist = []; // make dashboard selected merchant as empty

            }
           

       // if user click on menu item
        if (scope.justClickedMenu)  {

            scope.selected ="";
            scope.selected_key ="";

             if (angular.isDefined(scope.usermenu)) {
                if (scope.loggedin == 1) {
                    if (scope.usermenu == "dashboard") {
                        if (angular.isDefined(scope.userstoptenDashboard)) {
                            if (scope.userstoptenWomen.length > 0)
                                scope.selected_merchantlist = angular.copy(scope.userstoptenDashboard);
                            else
                                scope.selected_merchantlist = angular.copy(scope.featuredShoplistDashboard);
                        }
                    }


                    else if (scope.usermenu == "women") {
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
                    else if (scope.usermenu == "men") {
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
                    else if (scope.usermenu == "shoes") {
                        if (angular.isDefined(scope.userstoptenShoes)) {
                            if (scope.userstoptenShoes.length > 0)
                                scope.selected_merchantlist = angular.copy(scope.userstoptenShoes);
                            else
                                scope.selected_merchantlist = angular.copy(scope.featuredShoplistShoes);
                        }
                        else
                            scope.selected_merchantlist = angular.copy(scope.featuredShoplistShoes);
                    }

                    else if (scope.usermenu == "accessories") {
                        if (angular.isDefined(scope.userstoptenAccessories)) {
                            if (scope.userstoptenAccessories.length > 0)
                                scope.selected_merchantlist = angular.copy(scope.userstoptenAccessories);
                            else
                                scope.selected_merchantlist = angular.copy(scope.featuredShoplistAccessories);
                        }
                        else
                            scope.selected_merchantlist = angular.copy(scope.featuredShoplistAccessories);
                    }

                    else if (scope.usermenu == "beauty") {
                        if (angular.isDefined(scope.userstoptenBeauty)) {
                            if (scope.userstoptenBeauty.length > 0)
                                scope.selected_merchantlist = angular.copy(scope.userstoptenBeauty);
                            else
                                scope.selected_merchantlist = angular.copy(scope.featuredShoplistBeauty);
                        }
                        else
                            scope.selected_merchantlist = angular.copy(scope.featuredShoplistBeauty);


                    }  // men end
                    else if (scope.usermenu == "kid") {
                        if (angular.isDefined(scope.userstoptenKids)) {
                            if (scope.userstoptenKids.length > 0)
                                scope.selected_merchantlist = angular.copy(scope.userstoptenKids);
                            else
                                scope.selected_merchantlist = angular.copy(scope.featuredShoplistKids);
                        }
                        else
                            scope.selected_merchantlist = angular.copy(scope.featuredShoplistKids);


                    }

                    else if (scope.usermenu == "home") {
                        if (angular.isDefined(scope.userstoptenHome)) {
                            if (scope.userstoptenHome.length > 0)
                                scope.selected_merchantlist = angular.copy(scope.userstoptenHome);
                            else
                                scope.selected_merchantlist = angular.copy(scope.featuredShoplistHome);
                        }
                        else
                            scope.selected_merchantlist = angular.copy(scope.featuredShoplistHome);


                    }

                    else if (scope.usermenu == "gift") {
                        if (angular.isDefined(scope.userstoptenGifts)) {
                            if (scope.userstoptenGifts.length > 0)
                                scope.selected_merchantlist = angular.copy(scope.userstoptenGifts);
                            else
                                scope.selected_merchantlist = angular.copy(scope.featuredShoplistGifts);
                        }
                        else
                            scope.selected_merchantlist = angular.copy(scope.featuredShoplistGifts);

                    }


                    else if (scope.usermenu.trim() == "") {
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
                    if (scope.usermenu == "dashboard") {

                        scope.selected_merchantlist = angular.copy(scope.featuredShoplistDashboard);

                    }
                    else if (scope.usermenu == "home") {

                        scope.selected_merchantlist = angular.copy(scope.featuredShoplistDashboard);

                    }

                    else if (scope.usermenu == "women") {

                        scope.selected_merchantlist = angular.copy(scope.featuredShoplistWomen);

                    }
                    else if (scope.usermenu == "men") {
                        scope.selected_merchantlist = angular.copy(scope.featuredShoplistMen);
                    }
                    else if (scope.usermenu == "shoes") {
                        scope.selected_merchantlist = angular.copy(scope.featuredShoplistShoes);
                    }
                    else if (scope.usermenu == "accessories") {
                        scope.selected_merchantlist = angular.copy(scope.featuredShoplistAccessories);
                    }
                    else if (scope.usermenu == "beauty") {
                        scope.selected_merchantlist = angular.copy(scope.featuredShoplistBeauty);
                    }  // men end
                    else if (scope.usermenu == "kid") {
                        scope.selected_merchantlist = angular.copy(scope.featuredShoplistKids);

                    }

                    else if (scope.usermenu == "home") {
                        scope.selected_merchantlist = angular.copy(scope.featuredShoplistHome);
                    }

                    else if (scope.usermenu == "gift") {
                        scope.selected_merchantlist = angular.copy(scope.featuredShoplistGifts);
                    }

                    else if (scope.usermenu.trim() == "") {
                        scope.selected_merchantlist = angular.copy(scope.featuredShoplistOthers);
                    }
                    else
                        scope.selected_merchantlist = angular.copy(scope.featuredShoplistOthers);


                }


            }// end check whether it is not dashboard
        }

      

        var tempMerchant;
        // global search consider all merchant
        var ty;
        scope.keywordstring ="";
        scope.select_color="";

        var brsim="";
        var tg;
        generated_url ="";
        var kcount =0;
        relevancyThreshold ="&relevancyThreshold=.9"; 

              if(angular.isDefined(scope.selected)&& scope.selected.trim()!="") {
                  generated_url = generated_url + "&query="+scope.urlencoding(scope.selected)+relevancyThreshold;

             }
            else if(angular.isDefined(scope.selected_key) && scope.selected_key.trim()!="" ) // seraching within page
            {
                  generated_url = generated_url + "&query="+scope.urlencoding(scope.selected_key)+relevancyThreshold;
                
            }           

              var lastBrnd;
    
        for (bcount = 0; bcount < scope.selected_brandlist.length; bcount++) {
            lastBrnd = scope.selected_brandlist[bcount];

            lastBrnd = lastBrnd.replace(/\.$/, '');
            brandUrlencode = scope.urlencoding(lastBrnd);
            

            if (bcount == 0)
                scope.select_brand = brandUrlencode;
            else
                scope.select_brand = scope.select_brand + pipeEncd + brandUrlencode;

            if((bcount+1)==scope.selected_brandlist.length && scope.select_brand.trim()!="")
            {
                 //tg= scope.select_brand;
                tg= scope.select_brand;
                brsim ="&filterBrand=" +tg ;
                generated_url = generated_url + brsim ;

            }
        }

        //////////////////////Catagory..........////////////////////
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
        

        if(angular.isDefined(scope.usermenu) && scope.usermenu.trim()!="") 
        tempcategoryhe = scope.usermenu;

        // if user click a menu item or store under top menu and it's mapped data available no need to check selected categorylist
        if ((scope.justClickedMenu||scope.shopcatset|| scope.slidimageclick) && angular.isDefined(scope.usermenu) && scope.usermenu.trim()!='' && angular.isDefined(scope.mapped_cat[tempcategoryhe]) && scope.mapped_cat[tempcategoryhe].length>0 ) {
            temp_map = scope.mapped_cat[tempcategoryhe];
            for(map_count=0;map_count<temp_map.length;map_count++) {
                categoryencode = scope.urlencoding(temp_map[map_count]);
                if(mcount==0)                              // with out anything will happen for first category
                    scope.select_category =categoryencode;
                else
                    scope.select_category = scope.select_category  +pipeEncd+categoryencode+"";

                mcount = 1;
                if((map_count+1)==temp_map.length) {
                    generated_url = generated_url + "&filterCategory=" + scope.select_category;


                }
            }

        }
        // that means we do not find any mapped category
        else if((scope.justClickedMenu||scope.shopcatset|| scope.slidimageclick) && scope.menuClicked != "dashboard" ) {
                if (scope.menuClicked == "women") {
                    var wmn =  scope.urlencoding("*women*")
                    var grl = scope.urlencoding("*girl*"); 
                    
                    if (mcount == 0) {
                        scope.select_category = wmn + pipeEncd+grl;
                        mcount = 1;
                    }
                    else
                        scope.select_category = wmn + pipeEncd+grl+pipeEncd + scope.select_category;

                    scope.similiarpro =  wmn + pipeEncd+grl;

                }


                else if (scope.menuClicked == "men") {
                    var mn =scope.urlencoding("!*women*men*");


                    if (mcount == 0) {
                        scope.select_category = mn ;
                        mcount = 1;
                    }
                    else
                        scope.select_category =  mn + pipeEncd + scope.select_category;

                    scope.similiarpro =  mn;
                }
                else if (scope.menuClicked == "shoes") {
                    if (mcount == 0) {
                        scope.select_category =  scope.urlencoding("*shoe*")+pipeEncd+ scope.urlencoding("*sneakers*")+ pipeEncd+  scope.urlencoding("*boots*")+pipeEncd+ scope.urlencoding("*slippers*")+pipeEncd+ scope.urlencoding("*trainers*")+pipeEncd+ scope.urlencoding("*shoes*");
                        mcount = 1;
                    }
                    else
                        scope.select_category = scope.urlencoding("*shoe*")+pipeEncd+ scope.urlencoding("*sneakers*")+ pipeEncd+  scope.urlencoding("*boots*")+pipeEncd+ scope.urlencoding("*slippers*")+pipeEncd+ scope.urlencoding("*trainers*")+pipeEncd+ scope.urlencoding("*shoes*") +pipeEncd + scope.select_category;

                    scope.similiarpro = scope.urlencoding("*shoe*")+pipeEncd+ scope.urlencoding("*sneakers*")+ pipeEncd+  scope.urlencoding("*boots*")+pipeEncd+ scope.urlencoding("*slippers*")+pipeEncd+ scope.urlencoding("*trainers*")+pipeEncd+ scope.urlencoding("*shoes*");
                }
                else if (scope.menuClicked == "accessories") {
                    
                     
                    if (mcount == 0) {
                        scope.select_category =  scope.urlencoding("*accessory*")+pipeEncd+scope.urlencoding("*accessories*");
                        mcount = 1;
                    }
                    else
                        scope.select_category = scope.urlencoding("*accessory*")+pipeEncd+scope.urlencoding("*accessories*")+pipeEncd + scope.select_category;


                    scope.similiarpro = scope.urlencoding("*accessory*")+pipeEncd+scope.urlencoding("*accessories*");
                }
                else if (scope.menuClicked == "beauty") {
                    if (mcount == 0) {
                        scope.select_category = scope.urlencoding("*beauty*")+pipeEncd+scope.urlencoding("*jewelry*")+pipeEncd+scope.urlencoding("*skin*");
                        mcount = 1;
                    }
                    else
                        scope.select_category = scope.urlencoding("*beauty*")+pipeEncd+scope.urlencoding("*jewelry*")+pipeEncd+scope.urlencoding("*skin*")+pipeEncd + scope.select_category;


                    scope.similiarpro = scope.urlencoding("*beauty*")+pipeEncd+scope.urlencoding("*jewelry*")+pipeEncd+scope.urlencoding("*skin*");
                }


                else if (scope.menuClicked == "kid") {
                    if (mcount == 0) {
                        scope.select_category = scope.urlencoding("*baby*")+pipeEncd+scope.urlencoding("*child*")+pipeEncd+scope.urlencoding("*toddler*")+pipeEncd+scope.urlencoding("*girl*")+pipeEncd+scope.urlencoding("*boy*")+pipeEncd+scope.urlencoding("*kid*");
                        mcount = 1;
                    }
                    else
                        scope.select_category = scope.urlencoding("*baby*")+pipeEncd+scope.urlencoding("*child*")+pipeEncd+scope.urlencoding("*toddler*")+pipeEncd+scope.urlencoding("*girl*")+pipeEncd+scope.urlencoding("*boy*")+pipeEncd+scope.urlencoding("*kid*")+pipeEncd + scope.select_category;

                    scope.similiarpro =cope.urlencoding("*baby*")+pipeEncd+scope.urlencoding("*child*")+pipeEncd+scope.urlencoding("*toddler*")+pipeEncd+scope.urlencoding("*girl*")+pipeEncd+scope.urlencoding("*boy*")+pipeEncd+scope.urlencoding("*kid*");
                }
                else if (scope.menuClicked == "home") {

                    var hw = '';

                    if (mcount == 0) {

                        scope.select_category = scope.urlencoding("*home*")+pipeEncd+scope.urlencoding("*room*")+pipeEncd+scope.urlencoding("*furniture*")+pipeEncd+scope.urlencoding("*kitchen*")+pipeEncd+scope.urlencoding("*light*")+pipeEncd+scope.urlencoding("*curtain*")+pipeEncd+scope.urlencoding("*Utensils*")+pipeEncd+scope.urlencoding("*pan*")+pipeEncd+scope.urlencoding("*pot*")+pipeEncd+scope.urlencoding("*garden*");
                        mcount = 1;
                    }
                    else
                        scope.select_category = scope.urlencoding("*home*")+pipeEncd+scope.urlencoding("*room*")+pipeEncd+scope.urlencoding("*furniture*")+pipeEncd+scope.urlencoding("*kitchen*")+pipeEncd+scope.urlencoding("*light*")+pipeEncd+scope.urlencoding("*curtain*")+pipeEncd+scope.urlencoding("*Utensils*")+pipeEncd+scope.urlencoding("*pan*")+pipeEncd+scope.urlencoding("*pot*")+pipeEncd+scope.urlencoding("*garden*")+pipeEncd + scope.select_category;


                    scope.similiarpro =   scope.urlencoding("*home*")+pipeEncd+scope.urlencoding("*room*")+pipeEncd+scope.urlencoding("*furniture*")+pipeEncd+scope.urlencoding("*kitchen*")+pipeEncd+scope.urlencoding("*light*")+pipeEncd+scope.urlencoding("*curtain*")+pipeEncd+scope.urlencoding("*Utensils*")+pipeEncd+scope.urlencoding("*pan*")+pipeEncd+scope.urlencoding("*pot*")+pipeEncd+scope.urlencoding("*garden*");
                }
                else if (scope.menuClicked == "gift") {


                    if (mcount == 0) {

                        scope.select_category = scope.urlencoding("*gift*");
                        mcount = 1;
                    }
                    else
                        scope.select_category = scope.urlencoding("*gift*")+ pipeEncd+ scope.select_category;

                    scope.similiarpro = scope.urlencoding("*gift*");

                }
                else {

                    if(angular.isDefined(scope.otherMenu) && scope.otherMenu.trim()!='') {
                        if (mcount == 0) {
                            scope.select_category = astrickEncd + scope.urlencoding(scope.otherMenu) + astrickEncd;
                            mcount = 1;
                        }
                        else
                            scope.select_category =astrickEncd + scope.urlencoding(scope.otherMenu) + astrickEncd+pipeEncd + scope.select_category;

                        scope.similiarpro = astrickEncd + scope.urlencoding(scope.otherMenu) + astrickEncd;
                    }
                           
            
                
                }
               if (scope.select_category.trim() !='') {
                var tc= scope.select_category;

                generated_url = generated_url + "&filterCategory=" + tc;
               }

            
            
            }

        else { //  normal selected category list
            var tc;  var tty;
            if(scope.selected_categorylist.length>0) {
                for(ccount=0;ccount<scope.selected_categorylist.length;ccount++) {
                    temp_cat = scope.selected_categorylist[ccount];
                    if(temp_cat.trim()!="" && angular.isDefined(scope.mapped_cat[temp_cat]) && scope.mapped_cat[temp_cat].length>0) {
                
                             temp_map = scope.mapped_cat[temp_cat];
                            for(map_count=0;map_count<temp_map.length;map_count++) {

                                categoryencode = scope.urlencoding(temp_map[map_count]);
                                
                                
                                if(mcount==0)                              // with out anything will happen for first category
                                    scope.select_category =categoryencode;
                                else
                                    scope.select_category = scope.select_category  +pipeEncd+categoryencode+"";

                                mcount = 1;

                            }
                    }
                   else if(temp_cat.trim()!=""){ // when it donot find mapped category
                       
                                tty ="*" +temp_cat+ "*";
                                if(mcount==0)                              // with out anything will happen for first category
                                    scope.select_category = scope.urlencoding(tty);
                                else
                                    scope.select_category = scope.select_category  +pipeEncd+scope.urlencoding(tty);

                                mcount = 1;
                                          
                      
                   }  
                
                    if((ccount+1) == scope.selected_categorylist.length){
                         if (scope.select_category.trim() !="") {
                                tc= scope.select_category;

                                generated_url = generated_url + "&filterCategory=" + tc;
                            }

                    }


                }

            }


        }


         //////////////////// MERCHANT //////////
        // use different array for when user click top merchants

        // scope.selected_merchantlist hold featured shops
        if (scope.globalSearch) {
   
                scope.selected_merchantlist = angular.copy(scope.selected_merchantlistByclick);

                if(scope.selected_merchantlistByclick.length>0) {
                    for (count = 0; count < scope.selected_merchantlistByclick.length; count++) {

                        //tempMerchant = scope.selected_merchantlistByclick[count];
                        merchantUrlencode = scope.urlencoding(scope.selected_merchantlistByclick[count]);
                        if (count == 0)
                            scope.select_merchant = merchantUrlencode;
                        else
                            scope.select_merchant = scope.select_merchant + pipeEncd + merchantUrlencode;

                    }
                }


            var arr_keyword = angular.copy(scope.new_keyword_arr);
            var querystring= "";  
             
            scope.menuClicked = "";
            scope.shopcatset= false;
        }

        else if(current_path == '/dashboard' || current_path == '/' ) { // first time loading

           if(scope.selected_merchantlist.length>0) {
                for (count = 0; count < scope.selected_merchantlist.length; count++) {
                     merchantUrlencode = scope.urlencoding(scope.selected_merchantlist[count]);
                    //merchantUrlencode = scope.selected_merchantlist[count];
                    if (count == 0)
                        scope.select_merchant = merchantUrlencode;
                    else
                        scope.select_merchant = scope.select_merchant + pipeEncd + merchantUrlencode;

                }
            }
            scope.new_keyword_arr =[];
        }
        else {
           	
				scope.selected_merchantlist = angular.copy(scope.selected_merchantlistByclick);
            		
				if(angular.isDefined(scope.selected_merchantlistByclick)&& scope.selected_merchantlistByclick.length>0 ) {
				   

					for (count = 0; count < scope.selected_merchantlistByclick.length; count++) {

						//tempMerchant = scope.selected_merchantlistByclick[count];
						merchantUrlencode = scope.urlencoding(scope.selected_merchantlistByclick[count]);

						if (count == 0)
							scope.select_merchant = merchantUrlencode;
						else
							scope.select_merchant = scope.select_merchant + pipeEncd + merchantUrlencode;

					}

				}
		
		}

        var twotapstr = "&filterTwoTapSupported=1";
        var ty="";
        var merstring="";
    var count_color = scope.color_arr.length;
        var  ocas1;
        var ocas;
        var wco;
        var gw1;
        var gw;
        var owork1;
        var owork;
        var ov1;
        var ov;
        var ocos1;
        var ocos;
        var ocov1;
        var ocov;
        var col_text ="";
        var tempcol;
        var sale_count_url = "";
        var priceurle="";
        var urlencd="";
        var join_str;
        //////////////////// BRAND //////////


        scope.similiarpro ="";

        if(brsim.trim()!='' && angular.isDefined(brsim))
        scope.similiar_url = brsim;
       

         
        var poff;
        var roff;
        //percent wise filter
        if (scope.percent.range[0] != 0.00 && scope.percent.range[1] != 100.00) {

            poff = scope.percent.range[0] + "," + scope.percent.range[1];
            roff = scope.urlencoding(poff);
            generated_url = generated_url +  "&filterPercentOff=" + roff;
            scope.similiar_url =  scope.similiar_url + "&filterPercentOff=" + roff;
        }
        else if (scope.percent.range[0] != 0.00) {
            poff = scope.percent.range[0] + ",";
            roff = scope.urlencoding(poff);
            generated_url = generated_url + "&filterPercentOff=" +roff;
            scope.similiar_url =  scope.similiar_url  + "&filterPercentOff=" + roff;

        }
        else if (scope.percent.range[1] != 100.00) {
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

        var occ_casual="";
        var occ_work="";
        var occ_vacation="";
        var occ_other="";
        //var wco = scope.urlencoding('wear to work');
     
  		var count_ocassion = 0;

	   
	   if(scope.oc_work) 
		count_ocassion = count_ocassion+1;
	    if(scope.oc_casual)
			count_ocassion = count_ocassion+1;
        if(scope.oc_vacation)
		count_ocassion = count_ocassion+1;
        
		if(scope.oc_other)
		count_ocassion = count_ocassion+1;

	

        ocas1  = scope.urlencoding("casual*");
        ocas = pipeEncd+astrickEncd + ocas1;

		wco = scope.urlencoding("wear to work");
       
	    gw1 = wco+ astrickEncd + pipeEncd+ astrickEncd + scope.urlencoding("uniform*");

        gw =pipeEncd+astrickEncd + gw1;


        owork1 = gw1; // without pipe
        owork =gw;// with pipe 

		
		ov1 =  scope.urlencoding("vacation*")+pipeEncd+ scope.urlencoding("*holiday*");

        ov = pipeEncd+ astrickEncd +  ov1;

       // var ocos ="|*valentine*|*hallowen*|*christmas*|*marriage*|*engagement*|*victory*|*eid*|*shabbat*|*Holi*|*Diwali*|*Magha*";
        
        ocos1 =scope.urlencoding("valentine*")+pipeEncd+scope.urlencoding("*hallowen*")+pipeEncd+ scope.urlencoding("*christmas*")+pipeEncd+scope.urlencoding("*marriage*")+pipeEncd+scope.urlencoding("*engagement*")+pipeEncd+scope.urlencoding("*victory*")+pipeEncd+ scope.urlencoding("*eid*") +pipeEncd+ scope.urlencoding("*shabbat*")+pipeEncd+ scope.urlencoding("*Holi*") +pipeEncd+ scope.urlencoding("*Diwali*")+pipeEncd+scope.urlencoding("*Magha*");
        ocos = pipeEncd+ astrickEncd + ocos1;
		ocov = ocos;
		ocov1 = ocos1; // clear 
		
	

        var gb ="";
		scope.ocassionTotalCount = count_ocassion;
        if (scope.color_arr.length>0 && count_ocassion>0) {

		     for(var colindex=0;colindex<scope.color_arr.length;colindex++) {
                if(colindex>0) {
					scope.select_color = scope.select_color + pipeEncd+scope.urlencoding("*"+scope.color_arr[colindex] +"*");
				    tempcol = scope.urlencoding("*"+scope.color_arr[colindex] +"*");
                    ocas1 =ocas1 +pipeEncd + tempcol + scope.urlencoding("casual*");
					ov1 = ov1 +pipeEncd + tempcol +scope.urlencoding("vacation*")+pipeEncd+tempcol+ scope.urlencoding("holiday*");
					gw1 = gw1 +pipeEncd + tempcol + wco+ astrickEncd + pipeEncd+ tempcol +  scope.urlencoding("uniform*");

				
				}                
				else { 
			      scope.select_color = scope.urlencoding("*"+scope.color_arr[colindex] +"*");
                  tempcol = scope.urlencoding("*"+scope.color_arr[colindex] +"*");
				   ocas1  = tempcol + scope.urlencoding("casual*");
					ov1 =  tempcol +scope.urlencoding("vacation*")+pipeEncd+tempcol+ scope.urlencoding("holiday*");
					gw1 = tempcol + wco+ astrickEncd + pipeEncd+ tempcol +  scope.urlencoding("uniform*");
					ocos1 =tempcol + scope.urlencoding("valentine*")+pipeEncd+tempcol+scope.urlencoding("hallowen*")+pipeEncd+tempcol+ scope.urlencoding("christmas*")+pipeEncd+tempcol+scope.urlencoding("marriage*")+pipeEncd+tempcol+scope.urlencoding("engagement*")+pipeEncd+tempcol+scope.urlencoding("victory*")+pipeEncd+tempcol+ scope.urlencoding("eid*") +pipeEncd+ tempcol+scope.urlencoding("shabbat*")+pipeEncd+ tempcol+ scope.urlencoding("Holi*") +pipeEncd+tempcol+ scope.urlencoding("Diwali*")+pipeEncd+tempcol+scope.urlencoding("Magha*");

				}  
			    
				if(colindex+1==scope.color_arr.length) {
						ocas = pipeEncd+ ocas1;
						ov = pipeEncd+   ov1;
						gw =pipeEncd+ gw1;
						owork1 = gw1; // without pipe
						owork =gw;// with pipe 

					   // var ocos ="|*valentine*|*hallowen*|*christmas*|*marriage*|*engagement*|*victory*|*eid*|*shabbat*|*Holi*|*Diwali*|*Magha*";
						
						ocos = pipeEncd+ ocos1;
						ocov = ocos;
						ocov1 = ocos1; // clear 
					
				}
				
			
			}
		
		    occ_casual = generated_url + "&filterKeyword="+ ocas1; // casual
            occ_vacation = generated_url +"&filterKeyword="+ ov1 ; // vacation
            occ_work = generated_url + "&filterKeyword=" + owork1; //work
            occ_other = generated_url + "&filterKeyword="+ ocov1; // other
		  //  gb ="&groupBy=productId";

		
		}
        else if(scope.color_arr.length>0 ) {

            for(var colindex=0;colindex<scope.color_arr.length;colindex++) {
                if(colindex>0) {
                    scope.select_color = scope.select_color + pipeEncd+scope.urlencoding("*"+scope.color_arr[colindex] +"*");
                
                    tempcol = scope.urlencoding("*"+scope.color_arr[colindex] +"*");
                    ocas1 =ocas1 +pipeEncd + tempcol + scope.urlencoding("casual*");
                    ov1 = ov1 +pipeEncd + tempcol +scope.urlencoding("vacation*")+pipeEncd+tempcol+ scope.urlencoding("holiday*");
                    gw1 = gw1 +pipeEncd + tempcol + wco+ astrickEncd + pipeEncd+ tempcol +  scope.urlencoding("uniform*");



                }                
                else
                { 
                  scope.select_color = scope.urlencoding("*"+scope.color_arr[colindex] +"*");
                    
                    tempcol = scope.urlencoding("*"+scope.color_arr[colindex] +"*");
                    ocas1  = tempcol + scope.urlencoding("casual*");
                    ov1 =  tempcol +scope.urlencoding("vacation*")+pipeEncd+tempcol+ scope.urlencoding("holiday*");
                    gw1 = tempcol + wco+ astrickEncd + pipeEncd+ tempcol +  scope.urlencoding("uniform*");
                    ocos1 =tempcol + scope.urlencoding("valentine*")+pipeEncd+tempcol+scope.urlencoding("hallowen*")+pipeEncd+tempcol+ scope.urlencoding("christmas*")+pipeEncd+tempcol+scope.urlencoding("marriage*")+pipeEncd+tempcol+scope.urlencoding("engagement*")+pipeEncd+tempcol+scope.urlencoding("victory*")+pipeEncd+tempcol+ scope.urlencoding("eid*") +pipeEncd+ tempcol+scope.urlencoding("shabbat*")+pipeEncd+ tempcol+ scope.urlencoding("Holi*") +pipeEncd+tempcol+ scope.urlencoding("Diwali*")+pipeEncd+tempcol+scope.urlencoding("Magha*");
 
                

                }  
                
                if(colindex+1==scope.color_arr.length) {
                        ocas = pipeEncd+ ocas1;
                        ov = pipeEncd+   ov1;
                        gw =pipeEncd+ gw1;
                        owork1 = gw1; // without pipe
                        owork =gw;// with pipe 

                       // var ocos ="|*valentine*|*hallowen*|*christmas*|*marriage*|*engagement*|*victory*|*eid*|*shabbat*|*Holi*|*Diwali*|*Magha*";
                        
                        ocos = pipeEncd+ ocos1;
                        ocov = ocos;
                        ocov1 = ocos1; // clear 
             
                }
                
            
            }

            occ_casual = generated_url + "&filterKeyword="+ ocas1; // casual
            occ_vacation = generated_url +"&filterKeyword="+ ov1 ; // vacation
            occ_work = generated_url + "&filterKeyword=" + owork1; //work
            occ_other = generated_url + "&filterKeyword="+ ocov1; // other
            //gb ="&groupBy=productId";

        }    
        else {
            occ_casual = generated_url + "&filterKeyword=" +astrickEncd+ ocas1; // casual
            occ_vacation = generated_url +"&filterKeyword=" +astrickEncd+ov1 ; // vacation
            occ_work = generated_url + "&filterKeyword=" +astrickEncd+ owork1; //work
            occ_other = generated_url + "&filterKeyword=" +astrickEncd+ ocov1; // other
            //gb ="&groupBy=productId";

        }


        if (scope.keywordstring.trim() !='') { // since already something infront then every one will come back with some thing

            if (angular.isDefined(scope.oc_casual) && scope.oc_casual) {
                //   generated_url = generated_url + ocas;
                scope.urlForSuggestion = scope.urlForSuggestion + ocas;
                scope.similiar_url =  scope.similiar_url  + ocas;
                scope.keywordstring =  scope.keywordstring + ocas;

            }


            if (angular.isDefined(scope.oc_work) &&  scope.oc_work) {
                //   generated_url = generated_url + owork;
                scope.urlForSuggestion = scope.urlForSuggestion + owork;
                scope.similiar_url =  scope.similiar_url  + owork;
                scope.keywordstring =  scope.keywordstring + owork;
            }

            if (angular.isDefined(scope.oc_vacation) && scope.oc_vacation) {
                scope.urlForSuggestion = scope.urlForSuggestion + ov;
                scope.similiar_url =  scope.similiar_url + ov;
                scope.keywordstring =  scope.keywordstring + ov;
            }


            if (angular.isDefined(scope.oc_other) && scope.oc_other) {

                scope.urlForSuggestion = scope.urlForSuggestion + ocov;
                scope.similiar_url =  scope.similiar_url  + ocov;
                scope.keywordstring =  scope.keywordstring + ocov;
            }


        } // key wordstring not empty color is there

        else  // 
        {

            if (angular.isDefined(scope.oc_casual) && scope.oc_casual) {

                somekey = true;
                scope.urlForSuggestion = scope.urlForSuggestion + "&filterKeyword="+astrickEncd+ocas1;
                scope.similiar_url =  scope.similiar_url  + "&filterKeyword="+astrickEncd+ocas1;
                scope.keywordstring =  scope.keywordstring + ocas1;
                console.log("I am here 1");

                if (angular.isDefined(scope.oc_vacation) && scope.oc_vacation) {
                    scope.urlForSuggestion = scope.urlForSuggestion + ov;
                    scope.similiar_url =  scope.similiar_url + ov;

                    scope.keywordstring =  scope.keywordstring + ov;
                    console.log("I am here 2");
                }


                if (angular.isDefined(scope.oc_work) &&  scope.oc_work) {

                    scope.urlForSuggestion = scope.urlForSuggestion + owork;
                    scope.similiar_url =  scope.similiar_url  + owork; 
                    scope.keywordstring =  scope.keywordstring + owork;
                    console.log("I am here 3");
                }

                if (angular.isDefined(scope.oc_other) && scope.oc_other) {

                    scope.urlForSuggestion = scope.urlForSuggestion + ocov;
                    scope.similiar_url =  scope.similiar_url  + ocov;
                    scope.keywordstring =  scope.keywordstring + ocov;
                    console.log("I am here 4");


                }



            } // oc casual true
            else  // oc casual false  key wordstring empty
            {
                if (angular.isDefined(scope.oc_vacation) && scope.oc_vacation) {
                    scope.urlForSuggestion = scope.urlForSuggestion +"&filterKeyword="+astrickEncd+ ov1;
                    scope.similiar_url =  scope.similiar_url + "&filterKeyword="+astrickEncd+ov1;
                    scope.keywordstring =  scope.keywordstring + ov1;

                    if (angular.isDefined(scope.oc_work) &&  scope.oc_work) {

                        somekey = true;
                        scope.urlForSuggestion = scope.urlForSuggestion + owork;
                        scope.similiar_url =  scope.similiar_url  +owork;
                        scope.keywordstring =  scope.keywordstring + owork;
                
                    }

                    if (angular.isDefined(scope.oc_other) && scope.oc_other) {
                        somekey = true;
                        scope.urlForSuggestion = scope.urlForSuggestion + ocov;
                        scope.similiar_url =  scope.similiar_url  + ocov;
                        scope.keywordstring =  scope.keywordstring + ocov;

                    }
                }
                else  // oc casual false oc vacation false
                {


                    if (angular.isDefined(scope.oc_work) &&  scope.oc_work) {

                        somekey = true;
                        scope.urlForSuggestion = scope.urlForSuggestion + "&filterKeyword="+astrickEncd+owork1;
                        scope.similiar_url =  scope.similiar_url  + "&filterKeyword="+astrickEncd+owork1;
                        scope.keywordstring =  scope.keywordstring + owork1;
                        console.log("I am here 8");


                        if (angular.isDefined(scope.oc_other) && scope.oc_other) {

                            scope.urlForSuggestion = scope.urlForSuggestion + ocov;
                            scope.similiar_url =  scope.similiar_url  + ocov;
                            scope.keywordstring =  scope.keywordstring + ocov;
                            console.log("I am here 9");


                        }
                    }
                    else if (angular.isDefined(scope.oc_other) && scope.oc_other) {
                        somekey = true;
                        scope.urlForSuggestion = scope.urlForSuggestion + "&filterKeyword="+astrickEncd+ocov1;
                        scope.similiar_url =  scope.similiar_url  + "&filterKeyword="+astrickEncd+ocov1;
                        scope.keywordstring =  scope.keywordstring + ocov1;
                        console.log("I am here 10");

                    } // oc other and oc vacation

                }// oc work else end
            } // oc casual else

        } // color end
        
        // use cost range for filter
        // does suggestion and price range have relation
      
      
         

   
        
        if(scope.select_color.trim() !='' && scope.keywordstring.trim() !='') {
            
            join_str =scope.keywordstring;
		
			fkeyword = "&filterKeyword="+ join_str;
           // group ="&groupBy=productId";

        }
        else if(scope.select_color.trim() !='') {

            fkeyword = "&filterKeyword="+ scope.select_color;


        }
        else if(scope.keywordstring.trim() !='') {
         
            fkeyword = "&filterKeyword="+astrickEncd+ scope.keywordstring;

        }
        
         generated_url = generated_url + fkeyword;
         var groupMerchant = angular.copy(generated_url);
        if (scope.select_merchant.trim()!="") {
            ty = scope.select_merchant;
            generated_url = generated_url + "&filterMerchant=" + ty; // just begin
            merstring ="&filterMerchant=" + ty;
          
        }
            var pricestring ="";


  
    
        if (scope.cost.range[0] != 0.00 && scope.cost.range[1] != 1000000.00) {

            priceurle = scope.cost.range[0] + "," + scope.cost.range[1];
            urlencd =scope.urlencoding(priceurle);
            pricestring = "&filterPrice=" + urlencd;


            generated_url = generated_url + "&filterPrice=" + urlencd;

         
            scope.urlForSuggestion = scope.urlForSuggestion + "&filterPrice=" + urlencd;
            scope.similiar_url =  scope.similiar_url +  "&filterPrice=" + urlencd;
        }

        else if (scope.cost.range[0] != 0.00)    // lower limit changed 2500 to upper
        {

            priceurle = scope.cost.range[0] + ",";
            urlencd =scope.urlencoding(priceurle);
            pricestring = "&filterPrice=" + urlencd;

            generated_url = generated_url + "&filterPrice=" + urlencd;

          
            scope.urlForSuggestion = scope.urlForSuggestion + "&filterPrice=" +urlencd;
            scope.similiar_url =  scope.similiar_url + "&filterPrice=" +urlencd;

        }

        else if (scope.cost.range[1] != 1000000.00) // upper limit changed
        {

            priceurle = "," + scope.cost.range[1];
            urlencd =scope.urlencoding(priceurle);
            pricestring = "&filterPrice=" + urlencd;
            generated_url = generated_url + "&filterPrice=" + urlencd;
            
            scope.urlForSuggestion = scope.urlForSuggestion + "&filterPrice=" + urlencd;
            scope.similiar_url =  scope.similiar_url + "&filterPrice=" + urlencd;
        }

    
         var saleUrle= "";


     if (scope.saleOffer) {
            
            saleUrle= "&filterPriceSale="+saleurlencd; 
            generated_url = generated_url + "&filterPriceSale="+saleurlencd;
   
            scope.urlForSuggestion = scope.urlForSuggestion + "&filterPriceSale="+saleurlencd;
            scope.similiar_url =  scope.similiar_url + "&filterPriceSale="+saleurlencd;
            sale_count_url = generated_url;
  
        }
        else
        {

            sale_count_url = generated_url+ "&filterPriceSale="+saleurlencd;
            
        } 
         
            var sby = ""; // for sort by string 

        
        if (scope.selected_sorting.trim() != "" && angular.isDefined(scope.selected_sorting)) {
             // sby = "&sortBy="+ scope.urlencoding(scope.selected_sorting);
              sby = "&sortBy="+ scope.selected_sorting;
       
        } 


            occ_casual = occ_casual + merstring+pricestring+saleUrle+ twotapstr;
            occ_work = occ_work + merstring+pricestring+saleUrle+ twotapstr;
            occ_vacation = occ_vacation +merstring+pricestring+saleUrle+twotapstr;
            occ_other = occ_other + merstring+pricestring+saleUrle+ twotapstr;
             groupMerchant = groupMerchant+ fkeyword+ pricestring+saleUrle+ twotapstr;
            generated_url = generated_url + twotapstr;

            sale_count_url = sale_count_url + twotapstr; 

        //scope.selected_sorting ="groupCount desc";

        var temp_url = generated_url;
       


        sale_count_url = "limit=10&page=1"+ sale_count_url + sby;

        occ_casual = "limit=2&page=1"+occ_casual + gb + sby;
        occ_work = "limit=2&page=1"+occ_work + gb + sby;
        occ_vacation = "limit=2&page=1"+occ_vacation +gb +sby;
        occ_other = "limit=2&page=1"+occ_other +gb+ sby;
       
        var tempGenerated = angular.copy(generated_url);
      
         
        if(scope.selected_brandlist.length>0 && scope.selected_brandlist.length<1000) 
        scope.urlBrandWiseProductCount = "limit=1000&page=1" + tempGenerated + "&groupBy=brand&sortBy="+scope.urlencoding("brand asc");
        else  
        {
            scope.urlBrandWiseProductCount ="limit=1000&page=1" +tempGenerated+ "&groupBy=brand&sortBy="+scope.urlencoding("brand asc");
            if(scope.brand_string_arr.length>0){
            scope.urlBrandWiseProductCountArr[0] ="limit=200&page=1" +tempGenerated+ scope.brand_string_arr[0]+ "&limit=200&groupBy=brand&sortBy="+scope.urlencoding("brand asc");
            scope.urlBrandWiseProductCountArr[1] ="limit=200&page=1" +tempGenerated+ scope.brand_string_arr[1]+ "&limit=200&groupBy=brand&sortBy="+scope.urlencoding("brand asc");
            scope.urlBrandWiseProductCountArr[2] ="limit=200&page=1" +tempGenerated+ scope.brand_string_arr[2]+ "&limit=200&groupBy=brand&sortBy="+scope.urlencoding("brand asc");
            scope.urlBrandWiseProductCountArr[3] ="limit=200&page=1" +tempGenerated+ scope.brand_string_arr[3]+ "&limit=200&groupBy=brand&sortBy="+scope.urlencoding("brand asc");
            scope.urlBrandWiseProductCountArr[4] ="limit=200&page=1"+tempGenerated+ scope.brand_string_arr[4]+ "&groupBy=brand&sortBy="+scope.urlencoding("brand asc");

            }
        }   

        scope.urlMerchantWiseProductCount = "limit=1000&page=1" +groupMerchant+ "&groupBy=merchantId&sortBy=merchant";

        var loadmurl = angular.copy(generated_url);

        generated_url = "limit=" + scope.limit+ "&page=" + pageNo + generated_url  +  group + sby;
        //scope.urlBrandWiseProductCount = generated_url+ scope.brand_string+ "&limit=1000&page=1&groupBy=brand&sortBy="+scope.urlencoding("brand asc");
		
        scope.urlforloadmore = "limit=" + scope.limit+loadmurl+  group + sby;




        if (search_operation == 1) {
            scope.extendedurl = "&query=" + scope.urlencoding(scope.selected) + scope.urlForSuggestion + "&limit=100&page=1&groupBy=productId&sortBy=keyword";

        }
        else
            scope.extendedurl = scope.urlForSuggestion + "&limit=100&page=1&groupBy=productId&sortBy=keyword";

        scope.CurrentPage = pageNo;

        scope.sale_count_url = sale_count_url;
        scope.occ_casual = occ_casual;
        scope.occ_vacation = occ_vacation;
        scope.occ_work = occ_work;
        scope.occ_other = occ_other;

        scope.tempgeneratedlink = generated_url;
        // it is counting and tracking time difference between two clicks
        // mainly useful in search result page
        
        var tempStoreData = angular.copy(scope.similiar_url); 
        scope.storchosensimiliar_url = twotapstr + tempStoreData;
        scope.similiar_url  = twotapstr +  merstring + scope.similiar_url;
        if (scope.firsttime.loading == 0) // if it is single prodycr oage we will not cookie store chosen similiar 
            console.log('OK');
        else
        {
            $cookies.put('similiar',scope.similiar_url);
            $cookies.put('storchosensimiliar',scope.storchosensimiliar_url);

        }

        defer.resolve(generated_url);
        return defer.promise;
    }


	};

 })// factory end 
