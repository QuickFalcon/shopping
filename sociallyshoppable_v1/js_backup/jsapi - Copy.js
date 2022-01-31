(function($){
	$(function(){

		var body = $('body');


		// Blogpost annimation
		$('.blogspot_slider').mouseenter(function(){ $(this).parents('.header_left').addClass('extend') })
		$('.header_left').mouseleave(function(){ $(this).removeClass('extend') })

		// Navigation
		$('.main_nav > li').each(function(){
			$(this).index() > 4/*= $('.main_nav > li').length/2*/ ? $(this).find('.subnav_wrap').addClass('alignright') : '';
			!$(this).find('ul').length ? $(this).addClass('noSubmenu') : '';
			// Remove search from desktop
			if(screen.width > 767 )$('.subnav_wrap ul li.searchIn_nav').remove();
		})

		// Hide Top ten sec without choosen in Desktop
		$('.main_nav .top_ten').each(function() {
			$(this).find('>ul >li').length == 1 ? $(this).addClass('dsktp_hide') : '';
		})

		// Other category in main menu
	    $('.main_nav >li.choose_cat').dblclick(function(){
	    	$(this).hasClass('editThis') ? $(this).removeClass('editThis') : $(this).addClass('editThis');
	    })

	    var otherPlaceHolder = $('.main_nav >li.choose_cat input').attr('placeholder');
	    $('.main_nav >li.choose_cat input').blur(function(){
	    	if($(this).val()){
		    	$(this).parents($('.main_nav >li.choose_cat')).removeClass('hideSubmenu');
		    	$('.main_nav >li.choose_cat >a').text($(this).val()).attr('data-hover',$(this).val())
	    	}
	    	else{
	    		$('.main_nav >li.choose_cat >a').text(otherPlaceHolder).attr('data-hover',otherPlaceHolder);
	    		$(this).parents($('.main_nav >li.choose_cat')).addClass('hideSubmenu');
	    	}
	    	$(this).parents($('.main_nav >li.choose_cat')).removeClass('editThis');
	    })

	    // Account page menu


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
			    //move :  1,
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
			}

			/*function getGridSizesmThmb() {
				return	($('.mini_thumb_slider').width() < 250) ? 2 :
						($('.mini_thumb_slider').width() < 350) ? 3 : 4;
			}*/

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


		// Share accordion in social 
    	$('.other_sicn label').click(function(e){
    		e.preventDefault();
    		if($(this).siblings().length){
	    		if($(this).parent().hasClass('active')){
	    			$(this).parent().removeClass('active');
	    			$(this).siblings('.share-box').slideUp(300);
	    			$(this).siblings('input[type="checkbox"]').prop('checked', false);
	    		}
	    		else{
	    			$(this).parent().addClass('active');
	    			$(this).siblings('.share-box').slideDown(300);
	    			$(this).siblings('input[type="checkbox"]').prop('checked', true)
	    			$('html, body').animate({scrollTop: $(this).offset().top },500);

	    		} 
    		}
    	})

	   

		// Social popup positioning for different device
		var prdtConWidth = $('.tab_content_wrap .product_group').length ? $('.tab_content_wrap').outerWidth() : $('.product_group').outerWidth()
		$('.product_group').each(function(){
			$(this).find('.col_3').each(function(i){
				var totalElm = $(this).length;
				if(prdtConWidth > 923){
					$(this).index()%4 >1 ? $(this).find('.product-info').addClass('alignLft') : '';
					if(totalElm % 4 == 2){
						$(this).index() === totalElm - 1 ? $(this).find('.product-info').addClass('alignLft') : '';
					}
					if(totalElm % 4 == 3){
						$(this).index() === totalElm - 2 ? $(this).find('.product-info').addClass('alignCenter') : '';
					}
				} 
				if(prdtConWidth > 690 && prdtConWidth <= 923  ){
					$(this).index()%3 >1 ? $(this).find('.product-info').addClass('alignLft') : '';
					$(this).index()%3 ==1 ? $(this).find('.product-info').addClass('alignCenter') : '';
					if(totalElm % 3 == 1){
						$(this).index() === totalElm - 1 ? $(this).find('.product-info').addClass('alignCenter') : '';
					}
				} 
				if(prdtConWidth <= 690  ){$(this).index()%2 == 1 ? $(this).find('.product-info').addClass('alignLft') : '';} 
			})

		})




	    $('.product-info').each(function() {
			$(this).find('.shared_icons >li').each(function(i){
				$(this).click(function(e){
					e.stopPropagation();
					var sTTitleWrap = $(this).parent('.shared_icons');
					var thParnts = $(this).parents('.product-info');
					var socialPopup = $(this).parents('.n_thumbnail').length ?  $('#stSocialPopup') : $('#prSocialPopup');
					var sTContentWrap = socialPopup.find('.socialTabContentWrp');
					// Initialize first
					$('.product-info').removeClass('showSharePopup');
					$('.social_popup').removeClass('showSpopup')
    				$('#logo').removeClass('showPopupRecomend')
    				// For positioning Product popup
					if(!thParnts.hasClass('showSharePopup')){
						thParnts.addClass('showSharePopup')
						socialPopup.css({"left":sTTitleWrap.offset().left, 'top':(sTTitleWrap.offset().top + sTTitleWrap.outerHeight()), 'height':'auto'}).addClass('showSpopup');
						/*if(thParnts.hasClass('alignLft')){
							socialPopup.css({"right":$(window).width() - (sTTitleWrap.offset().left + sTTitleWrap.outerWidth()),'left':'auto'})
						}
						if(thParnts.hasClass('alignCenter')){
							socialPopup.css({"left":($(window).width() - socialPopup.outerWidth())/2})
						}*/

						if(sTTitleWrap.offset().left > ($(window).width()/2 + 120) ) {
							socialPopup.css({"right":$(window).width() - (sTTitleWrap.offset().left + sTTitleWrap.outerWidth()),'left':'auto'})
							console.log('right')
						}

						if((sTTitleWrap.offset().left - ($(window).width()/2 - sTTitleWrap.width()/2)) < 120 && (sTTitleWrap.offset().left - ($(window).width()/2 - sTTitleWrap.width()/2)) > -120 ) {
							socialPopup.css({"left":($(window).width() - socialPopup.outerWidth())/2})
							console.log('center')
						}						
					}
					
					// For positioning store popup
					/*if($(this).parents('.n_thumbnail').length){
						if(sTTitleWrap.offset().left > $(window).width()/2) {
							socialPopup.css({"right":$(window).width() - (sTTitleWrap.offset().left + sTTitleWrap.outerWidth()),'left':'auto'})
						}

						if(sTTitleWrap.offset().left = ($(window).width()/2 - sTTitleWrap.width()/2) ) {
							socialPopup.css({"left":($(window).width() - socialPopup.outerWidth())/2})
						}


					}*/

					if( $(this).hasClass('active')) return false
					else{
						$('.product-info').find('.shared_icons').find('li').removeClass('active')
						$(this).addClass('active')
						var oldHeight = sTContentWrap.find('>div.active').outerHeight();
						sTContentWrap.find('.active').fadeOut(300).removeClass('active');
						sTContentWrap.find('>div').eq(i).fadeIn(300).addClass('active')
						var newHeight = sTContentWrap.find('>div.active').outerHeight()
						sTContentWrap.find('>div.active').parent().css({height:oldHeight}).animate({height:newHeight},300);
						

						// for inner tab title active
						socialPopup.find('.tab_head li').removeClass('active');
						socialPopup.find('.tab_head li').eq(i).addClass('active');
						// for showing upload thumbnail on right side in product popup
						if(!$(this).parents('.n_thumbnail').length){
							$('#prSocialPopup').find('.tab_head li').eq(i).is(':last-child') ? $('#prSocialPopup').addClass('uploadThumb') : socialPopup.removeClass('uploadThumb');
						}

						// Scroll to top
						$('html, body').animate({scrollTop: sTTitleWrap.offset().top },500);
					}
				})

				
			}) 

			
	    })



    	// Footer popup click on Recomended site
    	$('#shareRecomended').click(function(e){
    		e.stopPropagation();
    		if($('#logo').hasClass('showPopupRecomend')){
    			$('#logo').removeClass('showPopupRecomend')
    		}

    		else{
				$('.product-info').removeClass('showSharePopup');
				$('.social_popup').removeClass('showSpopup')
    			$('#logo').addClass('showPopupRecomend')
    			$('#stSocialPopup').css({"left":($(window).width() - $('#stSocialPopup').outerWidth())/2,'top':($('#logo').offset().top + $('#logo').height() + 2 ),'height':'auto'}).addClass('showSpopup')
    			$('html, body').animate({scrollTop: 0 },500);
    		}
    	})


    	// For every social popup
    	$('.socail_tab_wrap').each(function() {
 			Tab($(this).find('.socialTabHead'), $(this).find('.socialTabContentWrp'));
    	})


    	// For closing social
		$('.social_popup').click(function(e) {
			e.stopPropagation()
		})

		$(document).click(function(){
		  	closeSocialPup();
		});

		$('.close-popup').click(function(){
			closeSocialPup();
		});

		// Function for close social popup
		function closeSocialPup() {
		  	$('.product-info').removeClass('showSharePopup')
		  	$('.product-info >.shared_icons >li').removeClass('active')
			$('.social_popup').removeClass('showSpopup') 
			setTimeout(function(){$('.social_popup').css({'left':'initial','right':'initial','top':'initial','height':0})}, 600);
		  	// For recomended
		 	$('#logo').removeClass('showPopupRecomend')
		}

		// Textarea limit counting
	    $('.notify_desc .ss_rtg_dtls textarea').keyup(function() {
	        var text_length = $(this).val().replace(/[#]/g, "").length;
	        $(this).siblings('.txt-limit').find('span').html(text_length)
	    });

	    // Rating function
    	$('.rateis').each(function(){
    		$(this).find('>div').each(function(i) {
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
		})


		// ======== End Social popup ===========//


		// Filter popup

		

	    AddClassTo($('.left_sidebar .filterHead'),'showFilter','body')

	    $('.filter_tools .close_btn').click(function() {
	    	$(body).removeClass('showFilter')
	    })



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
			$('.login-link').click(function(){
				$('.modal-content').css({"right":"-430px"})
				$('#login').css({"right":"0"})
			});
			$('.signup-link').click(function(){
				$('.modal-content').css({"right":"-430px"})
				$('#signup1').css({"right":"0"})
			})


			$('#signUp_step1').click(function() {
	            gotoStep($('#signup2'),$('#signup1'),  'backward');
			})

			/*$('#signUp_step2').click(function() {
	            gotoStep($('#signupfb'),$('#signup2'),  'backward')
			})*/


			$('#loginWithTw').click(function() { 
				gotoStep($('#signuptw'),$('#signupfb'),  'backward');
			})

			$('#loginWithFb').click(function() { 
				gotoStep( $('#signupfb'), $('#signuptw'),  'forward');
			})

			$('#okSignIn').click(function() {
		        gotoStep($('#login'),$('#signup1'),  'backward');
			})

			$('#signup2 .icon-back-btn').click(function() {
				gotoStep( $('#signup1'), $('#signup2'),  'forward');
			})

			$('#signupfb .icon-back-btn').click(function() {
				gotoStep( $('#signup1'), $('#signupfb'),  'forward');
				setTimeout(function(){ $('.modal-content').not($('#signup1')).css({"right":"-430px"}) }, 600);
			})

			$('#signuptw .icon-back-btn').click(function() {
				gotoStep( $('#signup1'), $('#signuptw'),  'forward');
				setTimeout(function(){ $('.modal-content').not($('#signup1')).css({"right":"-430px"}) }, 600);
			})

			$('#signUp_step2').click(function() {
				gotoStep( $('#videoAfterSigned'), $('#signup2'),  'backward');
				$('.modal-dialog').addClass('showVideo');
			})



		}

		function gotoStep($toStep, $fromStep, direction){
			if(direction == 'forward'){
				$toStep.animate({"right":0}, 500)
				$fromStep.animate({"right":'-430px'}, 500)
			}
			else{
				$toStep.animate({"right":0}, 500)
				$fromStep.animate({"right":'430px'}, 500)
			}
		}



		// End SignUp/Login














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


		
		if(screen.width < 768){
			// Disable custom dropdown for mobile
			$('select').each(function(){
				$(this).find('option').length > 3 ? $(this).removeClass('aanSelect').wrap('<div class="defaultSt"></div>') : '';
			})

			// Decrease Tab for mobile
			$('.tabHide_mb').remove()
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

			// Remove flying popup

			$('#flyingPopup').removeClass('showfpopUp');
		}
		$(window).scroll($.throttle(handleScroll, 500))



		// Add heart with favorite in sort by
		addHeartInDropdown($('.select_product_cat.with_favorite'))
			



		$.mCustomScrollbar.defaults.scrollButtons.enable = true;
		
	    // set custom scrollbar 
	    if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1){
	        $(".mCustomScrollbar").mCustomScrollbar({
	            theme:"dark",
	            mouseWheel:{ scrollAmount: 200 },
	            keyboard:{ scrollAmount:20 },
	            callbacks: 	{
							    whileScrolling:function(){
							      if($('.tab_content_wrap .product-info.showSharePopup').length) closeSocialPup();
							    }
						  	}
	        });

	    }
	    else{

	        $(".mCustomScrollbar").mCustomScrollbar({
	            theme:"dark",
	            callbacks: 	{
							    whileScrolling:function(){
							      if($('.tab_content_wrap .product-info.showSharePopup').length) closeSocialPup()
							    }
						  	}

	        });
	    }




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




		//goToSection($('.recent_view.saved .bottom_link a'));
		//goToSection($('.link-save-item'));
		// Add class 'goTarget' to scroll required place
		goToSection($('.goTarget'));


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
						$('.loading .load_more').html('Page 1');
						$(this).css({'overflow' : 'visible'})
					})
				},
				fail: function(){ $('#card-review-load-more-btn').html('Load More') }
			})
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



		// Single product

		if($('.single_product_page').length){

			$('.product-item .rateis .white_btn').click(function() {
				var goTo = $(this).attr('href');
				$('html, body').animate({scrollTop: $(goTo).offset().top},500);
				var index = $('#review_thumb').index();   
				$('#StageNavCarousel').flexslider(index);
				$('#carouselStage').flexslider(index);

			});


			// Start Zoom in zoom out



	          var $section = $('#Qview');
	          $section.find('.panzoom').panzoom({
	            $zoomIn: $section.find(".icn_zoom_plus"),
	            $zoomOut: $section.find(".icn_zoom_minus_gray"),
	            $zoomRange: $section.find(".zoom-range"),
	            $reset: $section.find(".icn_zoom_reset_gray"),

	            
	          });

	          $('.s_pro_control').click(function() {
	              console.log($('.zoom-range').val())
	              if($('.zoom-range').val() == .4){
	                $('.icn_zoom_minus_gray').addClass('disable')
	              }
	              else{$('.icn_zoom_minus_gray').removeClass('disable')}
	              if($('.zoom-range').val() == 5){
	                $('.icn_zoom_plus').addClass('disable')
	              }
	              else{$('.icn_zoom_plus').removeClass('disable')}
	              if($('.zoom-range').val() == 1){
	                $('.icn_zoom_reset_gray').addClass('disable')
	              }
	              else{$('.icn_zoom_reset_gray').removeClass('disable')}
	          })

	          $('.icn_cntrl_full').click(function() {

	            $('#fullScrnPopup').append($('.s_product_stage .slides li.flex-active-slide').html()).addClass('fullScreen')
	            $('#fullScrnPopup img').removeClass('panzoom')

	          })

	 

	          $('#fullScrnPopup .close_btn').click(function() {

	          	$('#fullScrnPopup').removeClass('fullScreen')
	          })

			// End Zoom in zoom out


		}


	






	    // Code for Mobile 
	    //===========================================

	   	if(screen.width < 768){

		    // Hamburger menu
		    if($('.main_nav_wrap').length){
		    	AddClassTo($('.hamburger_btn'),'nav_open','body');
			    Accordion($('.main_nav >li >a'));
			    Accordion($('.subnav_inner >ul >li'));
		    }


		    // Search open
		    AddClassTo($('.header_left .mb_search'),'search_open','body');



			// Show sign up/Login popup in mobile
			if($('.home_page').length){
				var hasBeenTrigged = false;
			    var handleScrollmb = function() {
			        if ($(this).scrollTop() >= 500 && !hasBeenTrigged) {
			            body.addClass('scrolling')
			            hasBeenTrigged = true;
			        }
			    };
			    $(window).scroll($.throttle(handleScrollmb, 500))	
			}



			$('.signIn_popup_inner .close_btn').click(function(){
				body.removeClass('scrolling')
			})

			$('.signIn_signUp a').click(function(){
				body.removeClass('scrolling')
			})


			// Add class to body for mobile style

			if($('.profile-left').length) body.addClass('withSideMenu')
			if($('.profile-content .tab_content_top .search_box').length) body.addClass('storeSearch')

			// Decrease Tab in mobile






	   	} // End code for mobile







		
	})// End ready function.



    // Make image large on hover function
    function PopupOnFly(elm) {
    	var flyPopUp = $('#flyingPopup')
	    elm.mouseenter(function(e){
	    	e.stopPropagation();
	    	flyPopUp.html($(this)[0].outerHTML).addClass('showfpopUp')
	    	.css({"left":$(this).offset().left, 'top':($(this).offset().top - $(window).scrollTop()),'width':$(this).width(),'height':$(this).height() })
	    	$('#fakeOverlay').show();
	    })

	    flyPopUp.mouseleave(function(){flyPopUp.removeClass('showfpopUp');})
		$('#headOverLay').mouseenter(function() {flyPopUp.removeClass('showfpopUp');})
		$('#fakeOverlay').mouseenter(function() {flyPopUp.removeClass('showfpopUp'); $('#fakeOverlay').hide();})
    }

    function gotoTargetInScroll(elm,targetWrap) {
		elm.click(function(e) {
	    	e.preventDefault();
	    	var gothere = $(this).attr('href');
	    	targetWrap.mCustomScrollbar('scrollTo', $(gothere));
	    })
    }


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
    	// Add arrow only if have submenu
    	elm.each(function(){if($(this).siblings().length) $(this).addClass('hasSubMenu');})
    }

    // Tab Function
	function Tab(TabTitleWrap,tabContentWrap) {
		tabContentWrap.find('>div:first').fadeIn(0).addClass('active')
		tabContentWrap.siblings(TabTitleWrap).find('>li:first').addClass('active')

		// Only for Recomended(share popup)
		/*$('#logo').find(tabContentWrap).find('>div').fadeOut(0).removeClass('active')
		$('#logo').find(TabTitleWrap).find('>li').removeClass('active')
		$('#logo').find(tabContentWrap).find('>div:nth-child(2)').fadeIn(0).addClass('active')
		$('#logo').find(tabContentWrap).siblings(TabTitleWrap).find('>li:nth-child(2)').addClass('active')*/

		tabContentWrap.siblings(TabTitleWrap).find('>li').each(function(i){
			$(this).click(function(){
				if( $(this).hasClass('active')) return false
				else{
					TabTitleWrap.find('>li').removeClass('active')
					$(this).addClass('active')
					var oldHeight = $(this).parent(TabTitleWrap).siblings(tabContentWrap).find('>div.active').outerHeight()
					tabContentWrap.find('.active').fadeOut(300)
					tabContentWrap.find('.active').removeClass('active')
					$(this).parent(TabTitleWrap).siblings(tabContentWrap).find('>div').eq(i).fadeIn(300).addClass('active')
					var newHeight = $(this).parent(TabTitleWrap).siblings(tabContentWrap).find('>div.active').outerHeight()
					$(this).parent(TabTitleWrap).siblings(tabContentWrap).find('>div.active').parent().css({height:oldHeight}).animate({height:newHeight},300);

					// only for (share popup) share icon active
					$('.product-info').find('> .shared_icons > li').removeClass('active')
					$('.product-info.showSharePopup').find('> .shared_icons > li').eq(i).addClass('active')
					$(this).parents('#prSocialPopup').find('.tab_head li').eq(i).is(':last-child') ? $(this).parents('#prSocialPopup').addClass('uploadThumb') : $(this).parents('#prSocialPopup').removeClass('uploadThumb');
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

				// Only for Add heart with favorite in sort by
				addHeartInDropdown($('.select_product_cat.with_favorite'))

			})
		})

		$(document).click(function() { $(".customDropdown ul").removeClass("opened") })

	} // Ending Function handleCustomSelectIssues
	// Custom Select Ends

	// Add Heart with dropdown
	function addHeartInDropdown(elm) {
		elm.each(function() {
			var selectedCat = $(this).find('.customDropdown div.txtContainer');
			selectedCat.text() == 'Favorites' ? selectedCat.addClass('fRedHeart') : selectedCat.removeClass('fRedHeart');
			$(this).find('.customDropdown ul li').each(function() {
				$(this).text() == 'Favorites' ? $(this).addClass('fRedHeart') : '';
			})
		})
	}



	

})(jQuery)

// For minimize triggering scroll event
!function(n){n.extend({debounce:function(n,t,e,u){3==arguments.length&&"boolean"!=typeof e&&(u=e,e=!1);var o;return function(){var r=arguments;u=u||this,e&&!o&&n.apply(u,r),clearTimeout(o),o=setTimeout(function(){e||n.apply(u,r),o=null},t)}},throttle:function(n,t,e){var u,o,r;return function(){o=arguments,r=!0,e=e||this,u||function(){r?(n.apply(e,o),r=!1,u=setTimeout(arguments.callee,t)):u=null}()}}})}(jQuery);
