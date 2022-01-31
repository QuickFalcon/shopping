
;(function($){
	$(function(){

		var body = $('body');


		// Blogpost annimation
		$('.blogspot_slider').mouseenter(function(){ $(this).parents('.header_left').addClass('extend') })
		$('.header_left').mouseleave(function(){ $(this).removeClass('extend') })

		// Navigation
		$('.main_nav > li').each(function(){
			$(this).index() >= $('.main_nav > li').length/2 ? $(this).find('.subnav_wrap').addClass('alignright') : '';
		})

		// For subnav heart
		/*$('.subnav_wrap ul.top_ten li a').each(function(){
		 !$.trim( $(this).html() ).length ? $(this).parent('li').addClass('no_choose') : '';
		})*/

		// Home Slider 

		$('#carouselStage').flexslider({
			selector		: '.slides >li',
			//sync            : "#StageNavCarousel",
			animation		: "slide",
			controlNav 		: false,
			slideshow		: false,
			useCSS			: false
		});


		var flexslider = { vars:{} };


		if($('.carousel_store1').length){
			// function to add breakpoints
			/*function getGridSize() {
				return	($('#StageNavCarousel').width() < 600) ? 2 :
						($('#StageNavCarousel').width() < 3) ? 3 : 4;
			}*/

			$('#StageNavCarousel').flexslider({
				asNavFor: '#carouselStage',
			    selector: '.stage_nav >li',
			    animation : "slide",
			    controlNav : false,
			    animationSpeed : 400,
			    animationLoop: false,
			    slideshow : false,
				useCSS	: false,
			    itemWidth : 222,
			    itemMargin: 10,
			    //minItems: getGridSize(),
			   // maxItems: getGridSize(),
				start: function(slider){
					//flexslider = slider;
					body.removeClass('sliderLoading');
				}
			});

			/*// check grid size on resize event
			$(window).resize(function() {
				var gridSize = getGridSize();
				flexslider.vars.minItems = gridSize;
				flexslider.vars.maxItems = gridSize;
			});*/

		}

		// Store chosen slider
		
		if($('.carousel_st_product2').length){
			// function to add breakpoints
			function getGridSizePr() {
				return	($('#StageNavCarousel').width() < 300) ? 3 :
						($('#StageNavCarousel').width() < 450) ? 4 : 5;
			}

			$('#StageNavCarousel').flexslider({
			    selector: '.stage_nav >li',
			    animation : "slide",
			    controlNav : false,
			    animationSpeed : 400,
			    animationLoop: false,
			    slideshow : false,
				useCSS	: false,
			    itemWidth : 87,
			    itemMargin: 16,
			    minItems: getGridSizePr(),
			    maxItems: getGridSizePr(),
				start: function(slider){
					flexslider = slider;
					body.removeClass('sliderLoading');
				}
			});

			// check grid size on resize event
			$(window).resize(function() {
				var gridSize = getGridSizePr();
				flexslider.vars.minItems = gridSize;
				flexslider.vars.maxItems = gridSize;
			});

		}

		// Single product slider
		
		if($('.s_product_stage_nav').length){
			// function to add breakpoints
			/*function getGridSizesPr() {
				return	($('#StageNavCarousel').width() < 300) ? 3 :
						($('#StageNavCarousel').width() < 450) ? 4 : 5;
			}*/

			$('#StageNavCarousel').flexslider({
				asNavFor: '#carouselStage',
			    selector: '.stage_nav >li',
			    animation : "slide",
			    controlNav : false,
			    animationSpeed : 400,
			    animationLoop: false,
			    slideshow : false,
				useCSS	: false,
			    itemWidth : 78,
			    itemMargin: 16,
			    //minItems: getGridSizesPr(),
			    //maxItems: getGridSizesPr(),
				start: function(slider){
					flexslider = slider;
					body.removeClass('sliderLoading');
				}
			});

			// check grid size on resize event
			/*$(window).resize(function() {
				var gridSize = getGridSizesPr();
				flexslider.vars.minItems = gridSize;
				flexslider.vars.maxItems = gridSize;
			});*/

		}

		// Bottom slider in single product
		if($('.mini_thumb_slider').length){


			// function to add breakpoints
			function getGridSizesmThmb() {
				return	($('.mini_thumb_slider').width() < 350) ? 3 : 4;
						//($('#StageNavCarousel').width() < 350) ? 3 : 4;
			}

			$('.mini_thumb_slider').flexslider({
			    selector: '.stage_nav >li',
			    animation : "slide",
			    controlNav : false,
			    animationSpeed : 400,
			    animationLoop: false,
			    slideshow : false,
				useCSS	: false,
			    itemWidth : 87,
			    itemMargin: 16,
			    minItems: getGridSizesmThmb(),
			    maxItems: getGridSizesmThmb(),
				start: function(slider){
					flexslider = slider;
					body.removeClass('sliderLoading');
				}
			});

			// check grid size on resize event
			$(window).resize(function() {
				var gridSize = getGridSizesmThmb();
				flexslider.vars.minItems = gridSize;
				flexslider.vars.maxItems = gridSize;
			});



		}







		/*$('.quick-thumb-carousel').flexslider({
			selector		: '.quick_nav >li',
			//manualControls	: '.stage_nav > li',
			direction: 'vertical',
			itemHeight : 97,
		        itemMargin: 7,
		        minItems: 4,
		        maxItems: 4,
		        controlNav : false,

			animation		: "slide",
			slideshow		: false,
			useCSS			: false
		});
*/





	    // Quick view carousel
	    var quickConnector = function(itemNavigationThumb, carouselStageQuick) {
	        return carouselStageQuick.jcarousel('items').eq(itemNavigationThumb.index());
	    };

	    // Setup the carousels. Adjust the options for both carousels here.
	    var carouselStageQuick = $('.quick-carousel').jcarousel({
	        wrap: 'circular',
	    });
	    var carouselNavigationThumb = $('.quick-thumb-carousel').jcarousel({
	        vertical: true,
	        wrap: 'circular'
	    });

	    // We loop through the items of the navigation carousel and set it up
	    // as a control for an item from the stage carousel.
	    carouselNavigationThumb.jcarousel('items').each(function() {
	        var item = $(this);

	        // This is where we actually connect to items.
	        var target = quickConnector(item, carouselStageQuick);

	        item
	            .on('jcarouselcontrol:active', function() {
	                carouselNavigationThumb.jcarousel('scrollIntoView', this);
	                item.addClass('active');
	            })
	            .on('jcarouselcontrol:inactive', function() {
	                item.removeClass('active');
	            })
	            .jcarouselControl({
	                target: target,
	                carousel: carouselStageQuick
	            });
	    });

	    $('.quick-prev')
	        .on('jcarouselcontrol:active', function() {
	            $(this).removeClass('inactive');
	        })
	        .on('jcarouselcontrol:inactive', function() {
	            $(this).addClass('inactive');
	        })
	        .jcarouselControl({
	            target: '-=1'
	        });

	    $('.quick-next')
	        .on('jcarouselcontrol:active', function() {
	            $(this).removeClass('inactive');
	        })
	        .on('jcarouselcontrol:inactive', function() {
	            $(this).addClass('inactive');
	        })
	        .jcarouselControl({
	            target: '+=1'
	        });
	    $('.quick-thumb-prev')
	        .on('jcarouselcontrol:active', function() {
	            $(this).removeClass('inactive');
	        })
	        .on('jcarouselcontrol:inactive', function() {
	            $(this).addClass('inactive');
	        })
	        .jcarouselControl({
	            target: '-=3'
	        });

	    $('.quick-thumb-next')
	        .on('jcarouselcontrol:active', function() {
	            $(this).removeClass('inactive');
	        })
	        .on('jcarouselcontrol:inactive', function() {
	            $(this).addClass('inactive');
	        })
	        .jcarouselControl({
	            target: '+=3'
	        });

	    // Blogspot content slider
	    $('.blogspot_slider').jcarousel({
	            wrap: 'circular'
	        })
	        .jcarouselAutoscroll({
	            interval: 3000,
	            target: '+=1',
	            autostart: true
	        });


	    // ====== Start Social popup  ========= //
		
		$('.thumb_viewer_wrap').flexslider({
			selector		: '.slides >li',
			animation		: "slide",
			controlNav 		: false,
			slideshow		: false,
			useCSS			: false,
			start: function(slider) {
				$('.total-slides').text(slider.count);
			},
			after: function(slider) {
				$('.current-slide').text(slider.currentSlide+1);
			}

		});

		// Social Accordion 

		$('.product_group .col_3').each(function(){
			$(this).index()%4 >1 ? $(this).find('.social_popup').addClass('alignleft') : '';
		})

    	$('.other_sicn label').click(function(e){
    		e.preventDefault();
    		if($(this).siblings().length){
	    		if($(this).parent().hasClass('active')){
	    			$(this).parent().removeClass('active');
	    			$(this).siblings('.share-box').slideUp(300);
	    			$(this).siblings('input[type="checkbox"]').prop('checked', false);
	    			//$('html, body').animate({scrollTop: $(this).parents('.social_popup_wrap').offset().top + $(this).parents('.social_popup_wrap').height() },500);
	    			//$('html, body').animate({scrollTop: $(this).siblings().prop("scrollHeight") },500);
	    			//$(this).prop("scrollHeight")
	    		}
	    		else{
	    			$(this).parent().addClass('active');
	    			$(this).siblings('.share-box').slideDown(300);
	    			$(this).siblings('input[type="checkbox"]').prop('checked', true)
	    			//$('html, body').animate({scrollTop: $(this).prop("scrollHeight") },500);
	    			$('html, body').animate({scrollTop: $(this).offset().top },500);

	    		} 
    		}
    	})

    	Accordion($('.s_content_details .sharelist-btn'))



	    Tab($('.socialTabHead'), $('.socialTabContentWrp'));

		var sTTitleWrap = $('.product-info >.shared_icons');
		var sTContentWrap = $('.socialTabContentWrp')
		sTContentWrap.find('>div:first').fadeIn(0).addClass('active')
		sTContentWrap.parents('.product-info').find(sTTitleWrap).find('li').each(function(i){
			$(this).click(function(e){
				e.stopPropagation()
				if( $(this).hasClass('active')) return false
				else{
					sTTitleWrap.find('li').removeClass('active')
					$(this).addClass('active')
					var oldHeight = sTContentWrap.find('>div.active').outerHeight()
					sTContentWrap.find('.active').fadeOut(300)
					sTContentWrap.find('.active').removeClass('active')
					sTContentWrap.find('>div').eq(i).fadeIn(300).addClass('active')
					var newHeight = sTContentWrap.find('>div.active').outerHeight()
					sTContentWrap.find('>div.active').parent().css({height:oldHeight}).animate({height:newHeight},300);
					$('.product-info >.shared_icons').not(this).parents('.product-info').removeClass('showSharePopup');
					$(this).parents('.product-info').hasClass('showSharePopup') ? '': $(this).parents('.product-info').addClass('showSharePopup')
					// for inner tab title active
					$(this).parents('.product-info').find('.social_popup_wrap .tab_head li').removeClass('active');
					$(this).parents('.product-info').find('.social_popup_wrap .tab_head li').eq(i).addClass('active');
					// for showing upload thumbnail on right side
					$(this).parents('.product-info').find('.social_popup_wrap .tab_head li').eq(i).is(':last-child') ? $(this).parents('.product-info').addClass('upload-thumb') : $(this).parents('.product-info').removeClass('upload-thumb');

					// Scroll to top
					$('html, body').animate({scrollTop: sTTitleWrap.offset().top },500);


				}
			})
		})

		$('.social_popup').click(function(e) {
			e.stopPropagation()
		})

		$(document).click(function(){
		  $('.product-info').removeClass('showSharePopup')
		  $('.product-info >.shared_icons >li').removeClass('active')
		});

		$('.close-popup').click(function(){
		  $('.product-info').removeClass('showSharePopup')
		  $('.product-info >.shared_icons >li').removeClass('active')
		});

		// Textarea limit counting
	    $('.notify_desc .ss_rtg_dtls textarea').keyup(function() {
	        var text_length = $(this).val().replace(/[#]/g, "").length;
	        $(this).siblings('.txt-limit').find('span').html(text_length)
	    });

	    // Rating function
    	$('.rateis >div').each(function(i){
			$(this).hover(function(){
				$(this).parent('.rateis').removeClass('h0 h1 h2 h3 h4 h5 h6 h7 h8 h9');
				$(this).parent('.rateis').addClass('h'+i);
			},function(){
				$(this).parent('.rateis').removeClass('h0 h1 h2 h3 h4 h5 h6 h7 h8 h9');
			})

			$(this).click(function(){
				$(this).parent('.rateis').removeClass().addClass('rateis');
				$(this).parent('.rateis').addClass('r'+i);
				$(this).siblings('input').val(i+1)
			})

		})




		// ======== End Social popup ===========//





		//console.log(currentSlide)


	    // Flag change

	    /*$('.flag_select ul li').click(function(){
		    var contryFlag = $('flag_us')
		    $('.flag_select ul li').parents('.flag_select').find('.show_flag').addClass(contryFlag);

	    	contryFlag = $(this).attr('class')
	    	console.log(contryFlag)
	    	$(this).parents('.flag_select').find('.show_flag').addClass(contryFlag);
	    })*/



		// Start SignUp/Login
		if ($('#loginPopup').length) {
			var popupList = $('.popup-list');
			var signUpFb = $('.login-popup #signupfb');
			var logIn = $('.login-popup #login')
			$('.login-link').click(function(){
				logIn.css('display','block');
				signUpFb.css('display','none');
				popupList.removeClass('signup-window')
				popupList.addClass('login-window');
				//popupList.css({"left":"-430px"})
				screen.width < 768  ? popupList.css({"left":"-300px"}) : popupList.css({"left":"-430px"})
			});
			$('.signup-link').click(function(){
				logIn.css('display','block');
				signUpFb.css('display','block');
				popupList.removeClass('login-window')
				popupList.addClass('signup-window');
				popupList.css({"left":"0"})
			})


			$('#signUp_step1').click(function() {
	            $("#signup2").show(); 
	            goto('#signup2', this);
	            $("#signup").hide();
			})

			$('#signUp_step2').click(function() {
		        signUpFb.show();
		        goto('#signupfb', this);
			})

			$('#okSignIn').click(function() {
		        logIn.show();
		        goto('#login', this);
			})

			$('.icon-back-btn').click(function() { goto('#signup1', this);})
			$('#loginWithTw').click(function() { goto('#signuptw', this); })
			$('#loginWithFb').click(function() { goto('#signupfb', this); })

		    function goto(id, t) {
		        //animate to the div id.
		        $(".popup-list").animate({
		            "left": -($(id).position().left)
		        }, 600);
		    }

		}// End SignUp/Login


		// Subscribe popup at stage carousel
		if($('.carousel_store1').length){
			$('.carouselStage_title h1').hover(function(){
				$(this).addClass('open');
			},function(){
				$(this).removeClass('open')
			})
			$('.stage-carousel-popup .close-popup').click(function(){$('.carouselStage_title h1').removeClass('open')})
		}

		// Placeholder remove on focus
		$('input[placeholder]').on('focus', function () {
		    $(this).data('placeholder', $(this).prop('placeholder')).removeAttr('placeholder')
		}).on('blur', function () {
		    $(this).prop('placeholder', $(this).data('placeholder'));
		});


		// Disable custom dropdown for mobile
		if(screen.width < 768){
			$('select').each(function(){
				$(this).find('option').length > 3 ? $(this).removeClass('aanSelect').wrap('<div class="defaultSt"></div>') : '';
			})
		}

		// calling selects
		findAndInitCustomSelects();

		// Close select dropdown on scroll
	    var old_scroll_top = $(window).scrollTop();
		var handleScroll = function(){
			var newScroll = $(window).scrollTop();
			if(newScroll > old_scroll_top){
				if((newScroll - old_scroll_top)>=100) {
					$(".customDropdown ul").removeClass("opened");
					old_scroll_top = newScroll; 
				} 
				
			}
			else{

				if((old_scroll_top - newScroll)>=100 ){
					$(".customDropdown ul").removeClass("opened");
					old_scroll_top = newScroll; 
				} 
			}
		}
		$(window).scroll($.throttle(handleScroll, 500))


		$.mCustomScrollbar.defaults.scrollButtons.enable = true;
		
	    // set custom scrollbar 
	    if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1){
	    	//body.addClass('safari')
	        $(".mCustomScrollbar").mCustomScrollbar({
	            theme:"dark",
	            mouseWheel:{ scrollAmount: 200 },
	            keyboard:{ scrollAmount:20 }
	        });

	    }
	    else{

	        $(".mCustomScrollbar").mCustomScrollbar({
	            theme:"dark",
	            //keyboard:{ scrollAmount: 20 }
	        });
	    }

		/*if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1){
	    	//body.addClass('safari')
	        $(".mCustomScrollbar").mCustomScrollbar({
	            theme:"dark",
	            mouseWheel:{ scrollAmount: 200 },
	            keyboard:{ scrollAmount:20 },
	            callbacks:{
				      onTotalScroll: function(){ 
						//$('html, body').animate({scrollTop: $('.mCustomScrollbar').prop("scrollHeight") + 250 },500);
				      },
				      onTotalScrollBack: function(){ 
						//$('html, body').animate({scrollTop: $('.mCustomScrollbar').offset().top + 250 },500);
				      }
				}
	        });

	    }
	    else{
	        $(".mCustomScrollbar").mCustomScrollbar({
	            theme:"dark",
	            //keyboard:{ scrollAmount: 20 },
	            callbacks:{
				      onTotalScroll: function(){ 
						//if($(this).hasClass('scrollToPos'))$('html, body').animate({scrollTop: $(this).prop("scrollHeight") - 180 },500);
				      },
				      onTotalScrollBack: function(){ 
						//if($(this).hasClass('scrollToPos'))$('html, body').animate({scrollTop: $(this).offset().top  },500);
				      }
				}
	        });
	    }*/	    


	    // Shopping bag

	    var savedItemVisited = false;
	    var miniCartItem = $('.mini-cart-menu .cart-items');
	    var miniCartMenu = $('#miniCartMenu');

	    AddClassTo($('.saved_item_info'),'showCart','body')

	    $('.saved_for_later').click(function() {
	    	if( body.hasClass('showCart') && !savedItemVisited ){
	    		miniCartItem.mCustomScrollbar('scrollTo', $('#mini-saved-items'));
	    		savedItemVisited = true;
	    	}
	    	else if(body.hasClass('showCart') && savedItemVisited){
	    		body.removeClass('showCart');
	    		savedItemVisited = false;
	    	}
	    	else{
	    		body.addClass('showCart');
	    		miniCartItem.mCustomScrollbar('scrollTo', $('#mini-saved-items'));
	    		savedItemVisited = true;
	    	}
	    })

	    $('#headOverLay').click(function() {
	    	body.removeClass('showCart');
	    })


	    $('.shopping_bag .seeItem').click(function (e) {
	    	e.preventDefault()
	    	var $itemWrap = $(this).parents('.item-wrap').find('.child-items');

	    	if($itemWrap.hasClass('open')){
	    		$itemWrap.removeClass('open');
	    		$(this).text('SEE ITEMS');
	    	}
	    	else{
	    		$itemWrap.addClass('open');
	    		$(this).text('CLOSE');
            	miniCartItem.mCustomScrollbar('scrollTo', $(this).parents('.item-wrap'));	    		
	    	}
	    })



		PopupOnFly($('.product-image.micro'));
		//PopupOnFly($('.recentview_list li .image_wrap'));

		// Click on remove item
		ShowPopUp($('.decide_link .remove'),'popUpshow','.decide_link');
		//Click on place Order
		ShowPopUp($('.btn.placeOrder'),'popUpshow','.placeOrder_wrap');




		goToSection($('.recent_view.saved .bottom_link a'));
		goToSection($('.link-save-item'));


	    // End shopping bag

	    // Edit profile popup
	    ShowPopUp($('.preview-edit .edit'),'popUpshow','.preview-edit');

	    // Account Menu dropdown
	    Accordion($('.profile-left .profile-menu >li a'));


	    // Checkout Form

	    AddClassTo($('.check_out_page .form_wrap .changeBtn'),'editField','.form_wrap')

		// Search Tab
	    Tab($('#searchCategory'), $('#searchResult'));

	    // All Store tab
	    Tab($('#tabHead'), $('#tabContentWrap'));

	    


	    // Top 10 store popup
	    ShowPopUp($('.tab_content_top .topTen_list li >div'),'popUpshow','.tab_content_top .topTen_list li');
	    ShowPopUp($('.search_result li .store_list li >div'),'popUpshow','.search_result li .store_list li');

	    // Go to letter wise store on click calender
	    gotoTargetInScroll($('#searchResult .s_result_alphabet li a'),$('#searchResult .s_content_list'));
	    gotoTargetInScroll($('#tabContentWrap .s_result_alphabet li a'),$('#tabContentWrap .search_result'));

	    // Load more function
		$('.loading').click(function(e){
			e.preventDefault()
			$(this).find('.load_more').html('Loading..')
			$.ajax({
				url: 'load-more-results.php',
				cache:false,
				success: function(data) {
					$('.product_group').css({'overflow' : 'hidden', 'height' : $('.product_group').height()})
					$('.product_group_inner').append(data)
					$('.product_group').animate({'height' : $('.product_group_inner').height() }, 500, function(){
						$('.loading .load_more').html('Page 1')
					})
				},
				fail: function(){ $('#card-review-load-more-btn').html('Load More') }
			})
		})	    


	    // Code for Mobile 
	    //===========================================

	    //if(screen.width < 768){

		    // Hamburger menu
		    if($('.main_nav_wrap').length){
		    	AddClassTo($('.hamburger_btn'),'nav_open','body');
			    Accordion($('.main_nav >li >a'));
		    }

		    // Search open
		    AddClassTo($('.header_left .mb_search'),'search_open','body');


			/*$(window).scroll(function(){
				if(($(window).scrollTop()) > 200){ body.addClass('scrolling')} 
			})*/

		if(screen.width < 768){ // Remove later

			var hasBeenTrigged = false;
		    var handleScrollmb = function() {
		        if ($(this).scrollTop() >= 150 && !hasBeenTrigged) {
		            body.addClass('scrolling')
		            hasBeenTrigged = true;
		        }
		    };
		    $(window).scroll($.throttle(handleScrollmb, 500))		


			$('.signIn_popup_inner .close_btn').click(function(){
				body.removeClass('scrolling')
			})

			$('.signIn_signUp a').click(function(){
				body.removeClass('scrolling')
			})


			// Profile Menu
			Accordion($('.profile-left h3'));



		} // Remove later

	    //} // End code for mobile




	    // Optional code
	    //========================

	    $('.main_nav >li.choose_cat input').blur(function(){
	    	var chooseCat = $(this).parents('.choose_cat');
	    	$(this).val() ? chooseCat.addClass('show_subnav') : chooseCat.removeClass('show_subnav');
	    	if(screen.width < 768) chooseCat.find($('.subnav_wrap')).slideToggle(300); 
	    })



	    /*$('.notS_out a').click(function(){
	        $("#login-popup").modal("show");
	        $('.login-popup #login').css('display','block');
	        $('.popup-list').addClass('login-window');
	        $('.popup-list').css({"left":"-430px"})
	        
	       // return $location.path('/'); 
	    })*/


		// Search Box open close 
		$('#searchEng').click(function(e) {
			e.stopPropagation();
			body.addClass('search_show');
		})
		$(document).click(function() {
			body.removeClass('search_show search_open');
		})

		
	})// End ready function.



    // Make image large on hover function
    function PopupOnFly(elm) {
    	var flyPopUp = $('#flyingPopup')
	    elm.mouseenter(function(e){
	    	e.stopPropagation();
	    	flyPopUp.html($(this)[0].outerHTML).addClass('showfpopUp')
	    	.css({"left":$(this).offset().left, 'top':($(this).offset().top - $(window).scrollTop()),'width':$(this).width(),'height':$(this).height() })
	    })
	    flyPopUp.mouseleave(function(){
	    	flyPopUp.removeClass('showfpopUp');
	    })
		$('#headOverLay').mouseenter(function() {
			flyPopUp.removeClass('showfpopUp');
		})

    }

    function gotoTargetInScroll(elm,targetWrap) {
		elm.click(function(e) {
	    	e.preventDefault();
	    	var gothere = $(this).attr('href');
	    	targetWrap.mCustomScrollbar('scrollTo', $(gothere));
	    })
    }

    /*function AddClassOnHover(elm,className,addTo) {
		elm.hover(function(){
			addTo.addClass(className);
		},function(){
			addTo.removeClass(className)
		})
    }*/



	// Scroll to section on click
	function goToSection(elm) {
		elm.click(function() {
			var goTo = $(this).attr('href');
			$('html, body').animate({scrollTop: $(goTo).offset().top},500);
		});
	}


    // Add class function
    function AddClassTo(elm,className,addTo) {
    	elm.click(function(e){
    		e.stopPropagation()
    		if($(this).parents(addTo).hasClass(className)){
    			$(this).parents(addTo).removeClass(className);
    			if($(this).is('.changeBtn'))$(this).text('Change');
    		}else{
    			$(this).parents(addTo).addClass(className);
    			if($(this).is('.changeBtn'))$(this).text('Update');
    		} 
    	})
    }

    // Show popup function
    function ShowPopUp(elm,className,addTo) {
    	elm.click(function(e){
    		e.stopPropagation();
    		e.preventDefault();
    		$(this).parents(addTo).addClass(className);
    		elm.not(this).parents(addTo).removeClass(className);
    	})
		$(document).click(function() {
			$(addTo).removeClass(className);
		})
    }

    // Accordion function
    function Accordion(elm) {
    	elm.click(function(e){
    		e.preventDefault();
    		if($(this).siblings().length){
	    		if($(this).parent().hasClass('active')){
	    			$(this).parent().removeClass('active');
	    			$(this).siblings().slideUp(300);
	    		}
	    		else{
	    			$(this).parent().addClass('active');
	    			$(this).siblings().slideDown(300);
	    		} 
    		}
    	})
    }

    // Tab Function
	function Tab(TabTitleWrap,tabContentWrap) {
		tabContentWrap.find('>div:first').fadeIn(0).addClass('active')
		tabContentWrap.siblings(TabTitleWrap).find('>li:first').addClass('active')
		tabContentWrap.siblings(TabTitleWrap).find('>li').each(function(i){
			$(this).click(function(){
				if( $(this).hasClass('active')) return false
				else{
					TabTitleWrap.find('>li').removeClass('active')
					$(this).addClass('active')
					var oldHeight = tabContentWrap.find('>div.active').outerHeight()
					tabContentWrap.find('.active').fadeOut(300)
					tabContentWrap.find('.active').removeClass('active')
					tabContentWrap.find('>div').eq(i).fadeIn(300).addClass('active')
					var newHeight = tabContentWrap.find('>div.active').outerHeight()
					tabContentWrap.find('>div.active').parent().css({height:oldHeight}).animate({height:newHeight},300);
					// only for (share popup) share icon active
					$(this).parents('.product-info').find('> .shared_icons > li').removeClass('active')
					$(this).parents('.product-info').find('> .shared_icons > li').eq(i).addClass('active')
				}
			})
		})
	}//End tab



	// Custom Select
	function findAndInitCustomSelects(){
		var $customSelectInputArr = $('select.aanSelect')
		if($customSelectInputArr.length){
			$customSelectInputArr.each(function(i){
				handleCustomSelectIssues( $(this), i );
			})
		}
	} // findAndInitCustomSelects() ends
	
	function handleCustomSelectIssues( $customSelectInput, customInputItemNo){
		var selectOptions = ''
		$customSelectInput.find('option').each(function(i){
			$(this).data('index',i)
			selectOptions+='<li'+ (($(this).attr('selected') == true ) ? ' class="selected"' : '') +'>'+$(this).text()+'</li>'
		})

		$customSelectInput.after('<div class="customDropdown"><div class="ul-head"><div class="txtContainer">'+$('select.aanSelect:eq('+customInputItemNo+') option:selected').text()+'</div><div class="customDropdownArrow"></div></div>'+((selectOptions != '') ? ('<ul>'+selectOptions+'</ul>') : '')+'</div>')

		// To add customscrollbar
		if($customSelectInput.find('option').length > 6){
			$customSelectInput.each(function () {$(this).siblings('.customDropdown').find('ul').addClass('mCustomScrollbar')})
		}
		
		var $customSelectDiv = $('div.customDropdown').eq(customInputItemNo)
		var $customSelectDiv_ul = $customSelectDiv.find('ul')
		$customSelectDiv.find('div.ul-head').click(function(e){
			e.stopPropagation();
			$customSelectDiv_ul.hasClass('opened') ? $customSelectDiv_ul.removeClass('opened') : $customSelectDiv_ul.addClass('opened');
			$('div.ul-head').not(this).siblings('ul').removeClass('opened');
		})
		
		$customSelectDiv.find('li').each(function(i){
			var $this_li = $(this);
			$this_li.click(function(e){
				e.stopPropagation()
				// remove and add the selected class
				$customSelectDiv_ul.find('li.selected').removeClass('selected');
				$this_li.addClass('selected');
				// Remove previously selected option and set the newly selected option
				$customSelectInput.find('option[selected="selected"]').removeAttr('selected');
				$customSelectInput.find('option:eq('+i+')').attr('selected', true);
				// hide the open options
				$customSelectDiv_ul.removeClass('opened');
				// Replacing the selected text of the upper span
				$customSelectDiv.find('div.txtContainer').html( $this_li.text());
			})
		})

		$(document).click(function() { $(".customDropdown ul").removeClass("opened") })

	} // Ending Function handleCustomSelectIssues
	// Custom Select Ends



	

})(jQuery)

// For minimize triggering scroll event
!function(n){n.extend({debounce:function(n,t,e,u){3==arguments.length&&"boolean"!=typeof e&&(u=e,e=!1);var o;return function(){var r=arguments;u=u||this,e&&!o&&n.apply(u,r),clearTimeout(o),o=setTimeout(function(){e||n.apply(u,r),o=null},t)}},throttle:function(n,t,e){var u,o,r;return function(){o=arguments,r=!0,e=e||this,u||function(){r?(n.apply(e,o),r=!1,u=setTimeout(arguments.callee,t)):u=null}()}}})}(jQuery);
