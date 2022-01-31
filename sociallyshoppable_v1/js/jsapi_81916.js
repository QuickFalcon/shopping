
var sShoppable = sShoppable || {};







(function($){
	$(function(){

		// Init the function which will be allow to call function from ther file

		// Start SignUp/Login
		// =========================
		var logInMContent = $('#loginPopup .modal-content');

		sShoppable.user = {

			init: function() {
			  sShoppable.user.ssLogIn();
			  sShoppable.user.ssSignUp();
			},
			ssLogIn: function(){
				$('.ss_LogIn').click(function(){
					$('#loginPopup').modal('show')
					logInMContent.css({"right":"-430px"})
					$('#login').css({"right":"0"})
				});
			},
			ssSignUp: function() {
				$('.ss_SignUp').click(function(){
					$('#loginPopup').modal('show')
					logInMContent.css({"right":"-430px"})
					$('#signup1').css({"right":"0"})
				})
			},

		};

		sShoppable.user.ssLogIn()
		sShoppable.user.ssSignUp()



		$('#signUp_step1').click(function() {
	        gotoStep($('#signup2'),$('#signup1'),  'backward');
		})


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
			setTimeout(function(){ logInMContent.not($('#signup1')).css({"right":"-430px"}) }, 600);
		})

		$('#signuptw .icon-back-btn').click(function() {
			gotoStep( $('#signup1'), $('#signuptw'),  'forward');
			setTimeout(function(){ logInMContent.not($('#signup1')).css({"right":"-430px"}) }, 600);
		})


		$('#signUp_step2').click(function() {
			gotoStep( $('#msgAfterSigned'), $('#signup2'),  'backward');
			// Show success message
			setTimeout(function(){ 
				$('#loginPopup').modal('hide');
				gotoStep( $('#videoAfterSigned'), $('#signup2'),  'backward');
				$('.modal-dialog').addClass('showVideo'); 
			 }, 5000);
			// Show Video After certain time
			setTimeout(function(){
				closeSocialPup();
				$('.modal').modal('hide');
				$('#loginPopup').modal('show');
			}, 35000);

		})


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


		// =================
		// End SignUp/Login	

		

	    // Start Custom Scrollbar
	    //========================





		sShoppable.ssCustomScroll = {

			init: function() {
			  sShoppable.ssCustomScroll.ssCustomScrollbar();
			},
			ssCustomScrollbar: function(){

				$.mCustomScrollbar.defaults.scrollButtons.enable = true;


		        $(".mCustomScrollbar").mCustomScrollbar({
		            theme:"dark",
		            callbacks: 	{
								    whileScrolling:function(){
								      if($('.tab_content_wrap .product-info.showSharePopup,.right_sidebar .product-info.showSharePopup').length) closeSocialPup();
								      if (screen.width < 1025) $('.shared_icons').parents('.mCustomScrollBox').addClass('scrolling');
								    },
								    onScroll:function(){
								    	setTimeout(function() {
								    		if (screen.width < 1025) $('.shared_icons').parents('.mCustomScrollBox').removeClass('scrolling');
								    	},1000)
								    }
							  	}

		        });

			},

		};

		//// End custom scrollbar

		sShoppable.ssCustomScroll.ssCustomScrollbar();


	    // End Custom Scrollbar
	    //========================



		sShoppable.sstab = {

			init: function() {
			  sShoppable.sstab.Tab();
			},



		    // Tab Function 
			Tab : function (TabTitleWrap,tabContentWrap) {
				tabContentWrap.find('>div:first').fadeIn(0).addClass('active')
				TabTitleWrap.find('>li:first').addClass('active')
				TabTitleWrap.find('>li').each(function(i){
					$(this).click(function(){

						if( $(this).hasClass('active')) return false
						else{
							TabTitleWrap.find('>li').removeClass('active')
							$(this).addClass('active')
							var oldHeight = tabContentWrap.find('>div.active').outerHeight()
							tabContentWrap.find('>div.active').fadeOut(300)
							tabContentWrap.find('>div.active').removeClass('active')
							tabContentWrap.find('>div').eq(i).fadeIn(300).addClass('active')
							var newHeight = tabContentWrap.find('>div.active').outerHeight()
							tabContentWrap.find('>div.active').parent().css({height:oldHeight}).animate({height:newHeight},300);

							// only for (share popup) share icon active
							var thParnts = $('.product-info.showSharePopup')
							var socialPopup = $(this).parents('.social_popup')
							if(socialPopup.length){
								$('.product-info').find('> .shared_icons > li').removeClass('active')
								thParnts.find('> .shared_icons > li').eq(i).addClass('active')
								$(this).parents('#prSocialPopup').find('.tab_head >li').eq(i).is(':last-child') ? $(this).parents('#prSocialPopup').addClass('uploadThumb') : $(this).parents('#prSocialPopup').removeClass('uploadThumb');
								tmpSocialNotify(thParnts,socialPopup,i)	
							}
						}
					})
				})
			}//End tab

		};







		// End Init function section*/






		var body = $('body');

		// Blogpost annimation
		$('.blogspot_slider').mouseenter(function(){ $(this).parents('.header_left').addClass('extend') })
		$('.header_left').mouseleave(function(){ $(this).removeClass('extend') })

		// Navigation
		// Remove sign up/login and search from nav in desktop
		if(screen.width > 767) {
			$('.main_nav > li:first').remove();
			$('.subnav_wrap ul li.searchIn_nav').remove();
		}
		// For submenu alignment
		$('.main_nav > li').each(function(){
			$(this).index() > 4 ? $(this).find('.subnav_wrap').addClass('alignright') : '';
			!$(this).find('ul').length ? $(this).addClass('noSubmenu') : '';
			// Remove search from desktop
		})

		// Hide Top ten sec without choosen in Desktop
		$('.main_nav .top_ten').each(function() {
			$(this).find('>ul >li').length == 1 ? $(this).addClass('dsktp_hide') : '';
		})

		// Other category in main menu
		var otherInput = $('.main_nav >li.choose_cat .choose_cat_form input')
		if(screen.width > 1024){
		    $('.main_nav >li.choose_cat').dblclick(function(e){
		    	e.stopPropagation()
		    	otherInput.focus()
		    	$(this).hasClass('editThis') ? $(this).removeClass('editThis') : $(this).addClass('editThis');
		    })
		}else{



			$('.main_nav >li.choose_cat').on('touchstart', function (e) {
				e.stopPropagation();
		        var thisItem = $(this);
		        if(!$('#customizeCat').val()) $(this).addClass('editThis');
		        pressTimer = window.setTimeout(function() {
			       thisItem.addClass('editThis');
		    	},1000);
		    }).on('touchend', function () {
		        clearTimeout(pressTimer);
		    });


		    $('.main_nav >li.choose_cat.hideSubmenu .popUp .btn').on('touchstart', function (e) {

		    	$('#customizeCat').val($('#editingCat').val());
		    });

		}














		otherInput.on('click touchstart',function(e) {
			e.stopPropagation();
		})


	    var otherPlaceHolder = otherInput.attr('placeholder');
	    $(document).on('click touchstart',function(){
	    	if(otherInput.val()){
		    	otherInput.parents('.main_nav >li.choose_cat').removeClass('hideSubmenu');
		    	$('.main_nav >li.choose_cat >a').text(otherInput.val()).attr('data-hover',otherInput.val());

	    	}
	    	else{
	    		$('.main_nav >li.choose_cat >a').text(otherPlaceHolder).attr('data-hover',otherPlaceHolder);
	    		otherInput.parents('.main_nav >li.choose_cat').addClass('hideSubmenu');
	    		$('.main_nav >li.choose_cat .subnav_wrap').slideUp(300);
	    		$('.main_nav >li.choose_cat >a').removeClass('active')
	    	}
	    	otherInput.parents($('.main_nav >li.choose_cat')).removeClass('editThis');
	    })





	    // Edit username

	    var userNamePlaceHolder = $('.preview-content .edit_username input').attr('placeholder');
	    $('.preview-content .edit_username input').blur(function(){
	    	if($(this).val()){
		    	$(this).parents('.preview-content .edit_username').removeClass('showCircle');
		    	$(this).val($(this).val())
	    	}
	    	else{
	    		$(this).parents('.preview-content .edit_username').addClass('showCircle');
	    	}
	    })

	    $('.preview-content .edit_username input').keyup(function(){
	    	$(this).parent().addClass('popUpshow');
	    })


	    // Need to remove from backend
	    $('.preview-content .edit_username .popUp .btn').click(function(e){
	    	e.preventDefault()
	    	$(this).parents('.preview-content .edit_username').removeClass('popUpshow');
	    })


		// Blogpost slider in header
		$('.blogspot_slider').flexslider({
			selector		: '.blogSlides >li',
			animation		: "slide",
			controlNav 		: false,
			directionNav	: false,
			slideshow		: true,
			slideshowSpeed	: 3000,
			useCSS			: false,
		});


		var slider1 = $('#carouselStage');

		slider1.flexslider({
			selector		: '.slides >li',
			//sync            : "#StageNavCarousel",
			animation		: "slide",
			controlNav 		: false,
			slideshow		: false,
			useCSS			: false,

			before: function(){
	            $('#Qview').removeClass('InitialzSlier')
			},
			after: function(){
				$('.s_product_stage .slides li.flex-active-slide video').length ? $('.icn_cntrl_media').removeClass('disable') : $('.icn_cntrl_media').addClass('disable')
				
			}
		});


		var flexslider = { vars:{} };

		// Home page and Dashboard page slider thumbnails
		if($('.carousel_store1').length){
			// function to add breakpoints
			function getGridSize() {
				/*return	($('#StageNavCarousel').width() < 600) ? 2 :
						($('#StageNavCarousel').width() < 800) ? 3 : 4;*/
				return $('.home_page').length ? 4 : 3;
			}

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
			    minItems: getGridSize(),
			   	maxItems: getGridSize(),
				start: function(slider){
					flexslider = slider;
					body.removeClass('sliderLoading');
				}
			});

			// check grid size on resize event
			$(window).resize(function() {
				var gridSize = getGridSize();
				flexslider.vars.minItems = gridSize;
				flexslider.vars.maxItems = gridSize;
			});

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
				start: function(slider){
					flexslider = slider;
					body.removeClass('sliderLoading');
				}
			});

		}






		sShoppable.slider = {

			init: function() {
			  sShoppable.slider.miniThumbSlider();
			},



		    // Tab Function 
			miniThumbSlider : function () {

				// Bottom slider in single product
				if($('.mini_thumb_slider').length){



					// function to add breakpoints
					function getGridSizesmThmb() {
						return	($('.mini_thumb_slider').width() < 350) ? 3 : 4;
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
							console.log('Slider loading')
						}
					});

					// check grid size on resize event
					$(window).resize(function() {
						var gridSize = getGridSizesmThmb();
						flexslider.vars.minItems = gridSize;
						flexslider.vars.maxItems = gridSize;
					});


				}


			}

		};

		sShoppable.slider.miniThumbSlider();









	    // Quick view slider
		$('#quickThumb').flexslider({
			selector		: '.q_slide >li',
			//sync            : "#quickThumbNav",
			animation		: "slide",
			controlNav 		: false,
			slideshow		: false,
			useCSS			: false,
		});

		$('#quickThumbNav').flexslider({
			asNavFor: '.quick-carousel',
		    selector: '.quick_nav >li',
		    //sync     : "#quickThumb",
		    animation : "slide",
		    controlNav : false,
		    animationSpeed : 400,
		    animationLoop: false,
		    slideshow : false,
			useCSS	: false,
		    itemWidth : 222,
		    itemMargin: 10,
		    direction  : 'vertical',
		    minItems: 3,
		   	maxItems: 3,
			start: function(slider){
				body.removeClass('sliderLoading');
			}
		});






		// Add red heart in sort by dropdown
		$(document).on('change', '.defaultSt select', function() {
			$(this).val() == 'Favorites' ? $(this).addClass('fRedHeart') : $(this).removeClass('fRedHeart');
		})










	    // ====== Start Social popup  ========= //
	    //========================================
		
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


    	// Triggering social popup
    	if (screen.width > 767) {
		    $('.product-info').each(function() {
				$(this).find('.shared_icons >li').each(function(i){
					/*$(document).on('click touchstart', $(this), function(e) {*/
						
					$(this).on('click touchstart', function (e){
						e.stopPropagation();
						var sTTitleWrap = $(this).parent('.shared_icons');
						var thParnts = $(this).parents('.product-info');
						var socialPopup = $(this).parents('.n_thumbnail').length ?  $('#stSocialPopup') : $('#prSocialPopup');
						var sTContentWrap = socialPopup.find('.socialTabContentWrp');

						//alert('click eee')

						// Initialize first
						if(!thParnts.hasClass('showSharePopup')){
							thParnts.addClass('showSharePopup')
							body.addClass('bshowingSpopup');
							// Initialize previous record once
							$('.product-info').not(thParnts).removeClass('showSharePopup');
						 	$('.social_popup').find('.atAglance li label').removeClass('checked')
							$('.atAglance li').find('input[type="checkbox"]').attr('checked', false);
						 	$('.social_popup').find('.icon').removeClass('activated')
							$('.social_popup').not(socialPopup).removeClass('showSpopup')
		    				$('#logo').removeClass('showPopupRecomend')

	    					// For positioning Product popup
							socialPopup.css({"left":sTTitleWrap.offset().left, 'top':(sTTitleWrap.offset().top + sTTitleWrap.outerHeight()), 'height':'auto'}).addClass('showSpopup');
							// right alignment
							if(sTTitleWrap.offset().left > ($(window).width()/2 + 100) ) {
								socialPopup.css({"left":(sTTitleWrap.offset().left + sTTitleWrap.outerWidth())-socialPopup.outerWidth()})
							}
							// Center alignment
							if((sTTitleWrap.offset().left - ($(window).width()/2 - sTTitleWrap.width()/2)) < 120 && (sTTitleWrap.offset().left - ($(window).width()/2 - sTTitleWrap.width()/2)) > -120 ) {
								socialPopup.css({"left":($(window).width() - socialPopup.outerWidth())/2})
							}						
						}

						// Initial shared,liked,rated
						tmpSocialNotify(thParnts,socialPopup,i)

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
	    }


	    // Showing Share popup in Modal window over quick view
	    $('#qViewShare .shared_icons li').each(function(i){
			$(this).click(function(e){
				e.stopPropagation();
				var thParnts = $('#qViewShare')
				var socialPopup = $('#prSocialPopup')
				tmpSocialNotify(thParnts,socialPopup,i)
				$('#prSocialPopup').modal('show');
			})
	    })

	    // Close Modal over Quickview Modal
	    $('#closePrPopup').click(function() {
			$('#prSocialPopup').modal('hide');
	    	setTimeout(function() {body.addClass('modal-open')},1000);
	    })



	    // Close size guide Modal over Quickveiw modal
	    $('#closeSizeGd').click(function() {
			$('#size-guide-popup').modal('hide');
	    	setTimeout(function() {body.addClass('modal-open')},1000);
	    })


		// Notification update on bottom checkbox (atAglance)
		$('.social_popup').each(function() {
			$(this).find('.atAglance li').each(function(i) {
				$(this).find('label').click(function(e) {
					if( $(this).hasClass('checked')){
						$(this).parents('.social_popup').find('.socialTabHead li').eq(i).find('.icon').removeClass('activated');
						$(this).find('.icon').removeClass('activated');
						
					}
					else{
						$(this).parents('.social_popup').find('.socialTabHead li').eq(i).find('.icon').addClass('activated');
						$(this).find('.icon').addClass('activated');
					}

				})
			})
		})


    	// Footer popup click on Recomended site
    	$('#shareRecomended').on('click',function (e){
    		e.stopPropagation();
    		if($('#logo').hasClass('showPopupRecomend')){
    			$('#logo').removeClass('showPopupRecomend')
    		}
    		else{
				$('.product-info').removeClass('showSharePopup');
				$('.social_popup').removeClass('showSpopup')
    			$('#logo').addClass('showPopupRecomend')
				$('.shared_icons.tab_head li:nth-child(2)').click();
				console.log('click')

    			$('#stSocialPopup').css({"left":($(window).width() - $('#stSocialPopup').outerWidth())/2,'top':($('#logo').offset().top + $('#logo').height() + 2 ),'height':'auto'}).addClass('showSpopup')
    			$('html, body').animate({scrollTop: 0 },500);
    		}
    	})


    	// For social popup inner tab
    	$('.socail_tab_wrap').each(function() {
 			sShoppable.sstab.Tab($(this).find('.socialTabHead'), $(this).find('.socialTabContentWrp'));
    	})


    	// For closing social Tab
		$('.social_popup').on('click touchstart',function (e) {
			e.stopPropagation()
		})

		if (screen.width > 767) {
			$(document).on('click touchstart',function (){
			  	closeSocialPup();
			});
		}

		$('.close-popup').click(function(){
			closeSocialPup();
		});

		// Function for close social popup
		function closeSocialPup() {
			if ($('.social_popup').hasClass('showSpopup')) {
			  	//$('.product-info.showSharePopup').removeClass('showSharePopup')
			  	$('.product-info >.shared_icons >li').removeClass('active')
				$('.social_popup').removeClass('showSpopup'); 
				setTimeout(function(){
					$('.social_popup').css({'left':'initial','right':'initial','top':'initial','height':0})
					body.removeClass('bshowingSpopup');
					$('.product-info.showSharePopup').removeClass('showSharePopup')
				}, 600);
			  	// For recomended
			 	$('#logo').removeClass('showPopupRecomend')
			 	// Remove Popup notification
			 	$('.atAglance li label').removeClass('checked')
				$('.atAglance li').find('input[type="checkbox"]').attr('checked', false);
				$('.social_popup').find('.icon').removeClass('activated')
			}
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

    	// =======================================
		// ======== End Social popup ===========//


		// Search Filter popup
	    AddClassTo(('.left_sidebar .filterHead'),'showFilter','body')

	    $('.filter_tools .close_btn').click(function() {
	    	$(body).removeClass('showFilter')
	    })





		if($('.carousel_store1').length){
			$('.carouselStage_title h1').hover(function(){
				$('#stageCarouselPopup').addClass('open');
			},function(){
				if (!$('#stageCarouselPopup').is(":hover")) {
					$('#stageCarouselPopup').removeClass('open')
				}
				
			})

			$('#stageCarouselPopup').mouseleave(function() {
				$(this).removeClass('open')
			})
			$('#stageCarouselPopup .close-popup').click(function(){$(this).parents('#stageCarouselPopup').removeClass('open')})
		}


		// Placeholder remove on focus
		$('input[placeholder]').on('focus', function () {
		    $(this).data('placeholder', $(this).prop('placeholder')).removeAttr('placeholder')
		}).on('blur', function () {
		    $(this).prop('placeholder', $(this).data('placeholder'));
		});


		
		if(screen.width < 768){
			// Disable custom dropdown for mobile
			/*$('select').each(function(){
				$(this).removeClass('aanSelect').wrap('<div class="defaultSt"></div>');
			})*/

			// Decrease Tab for mobile
			$('.tabHide_mb').remove()
		}

		// calling selects
		//findAndInitCustomSelects();

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



			if ($(window).scrollTop() > 200) {
				$('#scrollToTop').addClass('showScrollbtn')
		    }
		    else {
				$('#scrollToTop').removeClass('showScrollbtn')
		    }





		}
		$(window).scroll($.throttle(handleScroll, 500))




		// Page scroll to top

		$(document).on('click touchstart','#scrollToTop',function(){
			$('html, body').animate({scrollTop: 0 },500);
		})



			



/*		$.mCustomScrollbar.defaults.scrollButtons.enable = true;
		
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
*/



	    // Shopping bag

	    var savedItemVisited = false;
	    var miniCartItem = $('.mini-cart-menu .cart-items');
	    var miniCartMenu = $('#miniCartMenu');

	    AddClassTo(('.saved_item_info'),'showCart','body')

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

	    $(document).on('click', '.shopping_bag .seeItem', function(e) {
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



		PopupOnFly('.product-image.micro');

		// Click on remove item popup
		ShowPopUp(('.decide_link .remove .cancel_btn'),'popUpshow','.decide_link .remove');
		//Click on place Order popup
		ShowPopUp(('.btn.placeOrder'),'popUpshow','.placeOrder_wrap');
		//Click on why estimated popup
		ShowPopUp(('.why_estmted'),'popUpshow','.estimated_dtls');

		// Coupon Code available popup
		ShowPopUp(('.p_code_avail_inner'),'popUpshow','.p_code_avail');

		// Sign out popup
		ShowPopUp(('.signOut'),'popUpshow','.signOutWrp');


		// Add class 'goTarget' to scroll required place
		goToSection($('.goTarget'));

		$('.findCoupon').click(function(e) {
			var thisPromoField = $(this).parents('.checkOut_box').find('.promo_code');
			thisPromoField.slideDown(300);
			thisPromoField.addClass('open');
			//$('#storeSubscribed').modal('show')
			$(this).parents('.p_code_avail').removeClass('popUpshow')
			window.open('social.php#notificationBox', '_blank');
		})

		$('.p_code_avail .p_code_avail_inner').click(function(e) {
			var thisPromoField = $(this).parents('.checkOut_box').find('.promo_code');
			if (thisPromoField.hasClass('open')) $(this).parents('.p_code_avail').removeClass('popUpshow');
			thisPromoField.slideUp(300);
			thisPromoField.removeClass('open')
		})

		$(document).on('click','.subscribeCoupon',function() {
			$('#storeSubscribed').modal('show');
		})



		// Show qucik view popup to Update Item info 
		$(document).on('click','.updateBtn',function(){
			if(screen.width < 1025){
				setTimeout(function() {$('#quick-popup').modal('show')},1000);
			}else{
				$('#quick-popup').modal('show');
			}
		})




	    // End shopping bag

	    // Upload photo popup
	    ShowPopUp(('.uploadPhoto .uploadPhoto_inner'),'popUpshow','.uploadPhoto');
	    $('.upload_cancel').click(function(e) {
	    	e.preventDefault();
	    	$('.uploadPhoto').removeClass('popUpshow');
		})

	    // Account Menu dropdown
	    Accordion('.profile-left .profile-menu >li a');


	    // Checkout Form
	    AddClassTo(('.check_out_page .form_wrap .changeBtn'),'editField','.form_wrap')

	    // Change/update coupon code
	    /*$('.check_out_page .form_wrap .applyBtn').click(function() {
	    	if($(this).parents('.form_wrap').hasClass('enableField')){
	    		$(this).parents('.form_wrap').removeClass('enableField');
	    		$(this).parents('.form_wrap').find('input[type="text"]').attr('disabled',true)
	    		$(this).val('Update')
	    	}else{
	    		$(this).parents('.form_wrap').addClass('enableField');
	    		$(this).parents('.form_wrap').find('input[type="text"]').attr('disabled',false)
	    		$(this).val('Save')
	    	}
	    })*/

	    // Common accordion
	    Accordion('.accordion_title');


	    // Search result filter accordion

    	$('.full_list').hide();
    	$(document).on('click','.f_accordion_title',function(e){
    		var thsSibling = $(this).siblings('.f_accordion_content');
			var fullListHt = thsSibling.find('.full_list').height();
			var TopListHt = thsSibling.find('.top_list').height();
    		e.preventDefault();
    		if($(this).parent().hasClass('active')){
    			$(this).parent().removeClass('active');
    			thsSibling.find('.full_list').fadeOut(300);
    			thsSibling.find('.top_list').fadeIn(0);
				thsSibling.css({height:fullListHt}).animate({height:TopListHt},300);
    		}
    		else{
    			$(this).parent().addClass('active');
    			thsSibling.find('.full_list').fadeIn(0);
    			thsSibling.find('.top_list').fadeOut(0);
				thsSibling.css({height:TopListHt }).animate({height:fullListHt},300);
    		} 
    	})




		// Search Tab
		$('.searchResult').find('>div:first').fadeIn(0).addClass('active')
		$('.searchCategory').find('>li:first').addClass('active')
		$('.searchCategory').each(function() {
			$(this).find('>li').each(function(i){
				$(this).click(function(){

					if( $(this).hasClass('active')) return false
					else{
						$(this).parent().find('>li').removeClass('active');
						$(this).addClass('active');
						var oldHeight = $('.searchResult').find('>div.active').outerHeight()
						$(this).parent().siblings('.searchResult').find('>div.active').fadeOut(300).removeClass('active')
						$(this).parent().siblings('.searchResult').find('>div').eq(i).fadeIn(300).addClass('active')
						console.log(i)
						var newHeight = $(this).parent().siblings('.searchResult').find('>div.active').outerHeight()
						$(this).parent().siblings('.searchResult').find('>div.active').parent().css({height:oldHeight}).animate({height:newHeight},300);

						$('.all_customize >li').removeClass('active');
						$('.all_customize >li:nth-child('+(i+1)+')').addClass('active');

						// Checked all for first choise all
						if ($(this).is('.searchCategory li:first')) {
							checkbxChecked($(this).parent().siblings('.searchResult').find('>div label'))
						}
					}
				})
			})
		})

	    // Current selection click functionality
		$('.all_customize').each(function() {
			$(this).find('>li').each(function(i){
				$(this).find('.goto_all').click(function(){
					if(screen.width < 768){ 
						$('html, body').animate({scrollTop : $(this).parents('.all_customize').offset().top },500);
					}
					if( $(this).parents('li').hasClass('active')) return false
					else{
						$('.all_customize >li').removeClass('active')
						$('.all_customize >li:nth-child('+(i+1)+')').addClass('active')
						var oldHeight = $('.searchResult').find('>div.active').outerHeight()
						$('.searchCategory > li').removeClass('active');
						$('.searchCategory > li').eq(i).addClass('active');
						$('.searchResult').find('>div.active').fadeOut(300).removeClass('active')
						$('.searchResult').find('>div').eq(i).fadeIn(300).addClass('active')
						var newHeight = $('.searchResult').find('>div.active').outerHeight()
						$('.searchResult').find('>div.active').parent().css({height:oldHeight}).animate({height:newHeight},300);
					}
				})

				$(this).find('.chooseFrm_all label').click(function(){
					if( $(this).parents('li').hasClass('active')){}
					else{
						$('.all_customize >li').removeClass('active')
						$('.all_customize >li:nth-child('+(i+1)+')').addClass('active')
						var oldHeight = $('.searchResult').find('>div.active').outerHeight()
						$('.goto_all').removeClass('active')
						$('.all_customize >li:nth-child('+(i+1)+')').find('.goto_all').addClass('active')
						$('.searchCategory > li').removeClass('active');
						$('.searchCategory > li').eq(i).addClass('active');
						$('.searchResult').find('>div.active').fadeOut(300).removeClass('active')
						$('.searchResult').find('>div').eq(i).fadeIn(300).addClass('active')
						var newHeight = $('.searchResult').find('>div.active').outerHeight()
						$('.searchResult').find('>div.active').parent().css({height:oldHeight}).animate({height:newHeight},300);
					}

					if ($(this).hasClass('checked')) {
						checkbxUnchecked( $('.searchResult').find('>div').eq(i).find('.s_result_right label') )

					} else {
						checkbxChecked($('.searchResult').find('>div').eq(i).find('.s_result_right label'))
    					$('.all_customize >li:nth-child('+(i+1)+') .group_cont').html('')
					}
				})
			})
		})

 
	    // Checked All in main search
		checkedAll($('.s_result_right_header .s_select_cat label'),'.s_result_right','.s_alphabet_item ul li label');


	    // Checked All in Subscription notification

		checkedAll($('.chekcedAllBtn'),'.checkedAllWrp','.checkThisAll li label');

	    // All Store tab
	    sShoppable.sstab.Tab($('#tabHead'), $('#tabContentWrap'));


	    // Top 10 store popup
	    ShowPopUp(('.tab_content_top .topTen_list li >div'),'popUpshow','.tab_content_top .topTen_list li');
	    ShowPopUp(('.search_result li .store_list li >div'),'popUpshow','.search_result li .store_list li');

	    // Go to letter wise store on click calender
	    gotoTargetInScroll($('.searchResult .s_result_alphabet li a'),'.s_result_inner','.s_content_list');
	    gotoTargetInScroll($('#tabContentWrap .s_result_alphabet li a'),$('#tabContentWrap .search_result'));

	    // Clear all selection
		$('.s_result_action .clear_btn').click(function() {
			var thsParentIndex = ($(this).parents('.s_result_inner')).index();
			checkbxUnchecked($('.all_customize >li:nth-child('+(thsParentIndex+1)+') .chooseFrm_all label'));
			checkbxUnchecked($(this).parents('.s_result_inner').find('label'));
		})


		// Search Box open close 
		var searchGotopMb = false;
		$('#searchEng').each(function() {
			$(this).on('click touchstart',function (e) {
				e.stopPropagation();
				$(this).addClass('search_show');
				$('.search_box').not(this).removeClass('search_show');
				if(screen.width<768 && !searchGotopMb) {
					$('html, body').animate({scrollTop: $(this).offset().top - 10 },500);
					searchGotopMb =true;
				}
			})

		})

		$('.s_result_action .cancel_btn').click(function(e) {
			e.stopPropagation();
			$(this).parents('.search_box').removeClass('search_show');
			body.removeClass('search_open');
			searchGotopMb =false;
		})

		$(document).on('click touchstart',function () {
			$('.search_box').removeClass('search_show');
			body.removeClass('search_open');
			searchGotopMb =false;
		})



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
						$(this).css({'overflow':'visible'})
					})
				},
				fail: function(){ $('#card-review-load-more-btn').html('Load More') }
			})
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
	          	var getSlierImage = $('.s_product_stage .slides li.flex-active-slide .img_wrap').html()
	          	if($('#Qview').hasClass('fullSactive')){
		            $('#fullScrnPopup .img_wrap').html(getSlierImage);
		            $('#Qview').removeClass('fullSactive')
		            $('#fullScrnPopup').removeClass('fullScreen')
            		$('#Qview').addClass('InitialzSlier')
	            	setTimeout(function() {
						slider1.resize();
	            		$('#Qview').removeClass('InitialzSlier')
	            	},900)

	          	}else{
		            $('#fullScrnPopup .img_wrap').html(getSlierImage);
		            $('#fullScrnPopup').addClass('fullScreen')
		            $('#fullScrnPopup img').removeClass('panzoom')
		            $('#Qview').addClass('fullSactive')
	            	$(this).parents('.s_product_controller_wrap').find('.icn_zoom_reset_gray').parents('li').addClass('enable')
            		$('#Qview').addClass('InitialzSlier')
	            	setTimeout(function() {
						slider1.resize();
	            		$('#Qview').removeClass('InitialzSlier')
	            	},900)
	          	}

	          })


	          $('.s_product_stage .close_btn').click(function() {
	            $('#Qview').removeClass('fullSactive')
	            $('#fullScrnPopup').removeClass('fullScreen')
        		$('#Qview').addClass('InitialzSlier')
            	setTimeout(function() {
					slider1.resize();
            		$('#Qview').removeClass('InitialzSlier')
            	},900)
	          })

	          $('.icn_zoom_reset_gray').click(function() {
	          	if ($(this).parents('li').hasClass('enable')) {
		            $('#Qview').removeClass('fullSactive')
		            $('#fullScrnPopup').removeClass('fullScreen')
	        		$('#Qview').addClass('InitialzSlier')
	            	setTimeout(function() {
						slider1.resize();
	            		$('#Qview').removeClass('InitialzSlier')
	            	},900)
	          	}
	          })

			// End Zoom in zoom out

		}


		// For modal which has Slider
		setTimeout(function(){ $('.sliderInModal').css({'display':'none'}) },500)

		// Modal auto hide after certain Interval
		$( ".autoHide" ).on('shown.bs.modal', function(e){
			setTimeout(function() {
				$('.modal.autoHide').modal('hide');
			},5000)
		});

		// Start Add to bag modal
		$('.othersReltdProduct').hover(function() {
			$(this).parents('.modal').removeClass('autoHide')
		},function() {
			$(this).parents('.modal').addClass('autoHide');
		})




		if($('.othersReltdProduct').length){

			// function to add breakpoints
			function getGridSizeOthrsPr() {
				return	($('.othersReltdProduct').width() < 350) ? 2 : 3;
			}

			$('.othersReltdProduct').flexslider({
			    selector: '.slides >li',
			    animation : "slide",
			    controlNav : false,
			    animationSpeed : 400,
			    animationLoop: false,
			    slideshow : false,
				useCSS	: false,
			    itemWidth : 136,
			    itemMargin: 10,
			    minItems: getGridSizeOthrsPr(),
			    maxItems: getGridSizeOthrsPr(),
				start: function(slider){
					flexslider = slider;
					body.removeClass('sliderLoading');
				}
			});

			// check grid size on resize event
			$(window).resize(function() {
				var gridSize = getGridSizeOthrsPr();
				flexslider.vars.minItems = gridSize;
				flexslider.vars.maxItems = gridSize;
			});


		}

		// End Add to bag modal


	

		Accordion(('.see_detls'),'SEE DETAILS','CLOSE')
		Accordion(('.country_popup_wrp .update_btn'),'Update','Save')


		// Collective page 

		// Open search dropdown
    	$(document).on('click','.collective_search .search_box',function(e) {
    		e.stopPropagation()
    		$(this).parents('.collective_search').addClass('drpdown_show');
    		if(screen.width < 767){
    			$(this).find('input[type="text"]').keyup(function() {
    				if ($(this).val()) {
    					$(this).parents('.collective_search').removeClass('drpdown_show');
    				} else {
    					$(this).parents('.collective_search').addClass('drpdown_show');
    				}
    			})
    		}
    	})





    	// Right sidebar positioning on scrolltop
	   	if( $('.right_sidebar').length && !$('.dashboard_page').length){
		   	var sidebarBottom = $('.loading').offset().top - $('.right_sidebar').outerHeight() + $('.right_sidebar').offset().top;
		   	var sidebarRight = $(window).width() - ($('.right_sidebar').offset().left + $('.right_sidebar').width())
		   	var sidbarTop = $('.right_sidebar').offset().top
		    $(window).scroll(function () {
		        var scroll = $(this).scrollTop();
		        var height = $('.right_sidebar').height();
		        var width = $('.right_sidebar').width();

		        if (scroll > sidbarTop) {
		            $('.right_sidebar').css({'position':'fixed','top':'0','right':sidebarRight,'height':height,'width':width});

		  			if( scroll > sidebarBottom){
			            $('.right_sidebar').css({'position': 'absolute','top': 'initial', 'right' : 0, 'bottom' : 0 });
			        }

		        }else{
		            $('.right_sidebar').css({ 'position': 'relative', 'top':'initial', 'bottom' : 'initial', 'right':'initial'});
		        } 
		    });
	    }


	    // Mail box page
    	$(document).on('click','.m_accordion_title',function(e){
    		e.preventDefault();
    		if($(this).parent().hasClass('active')){
    			$(this).parent().removeClass('active');
    			$(this).siblings('.order_itm_info_grp').slideUp(300);
    			$(this).text('See details')
    		}
    		else{
    			$(this).parent().addClass('active');
    			$(this).siblings('.order_itm_info_grp').slideDown(300);
    			$(this).text('Close')
    		} 
    	})





		// Code for Tab and Mobile

		if (screen.width < 1025) {



		}




	    // Code for Mobile 
	    //===========================================

	   	if(screen.width < 768){

		    // Hamburger menu
		    if($('.main_nav_wrap').length){
		    	AddClassTo(('.hamburger_btn'),'nav_open','body');
			    Accordion(('.main_nav >li.footer_nav >a'));

			    $(document).on('click','#headOverLay',function() {body.removeClass('nav_open')})


		    	$('.main_nav >li >a').click(function(e){
		    		e.preventDefault();
		    		if($(this).siblings('.subnav_wrap').length){
			    		if($(this).parent().hasClass('active')){
			    			$(this).parent().removeClass('active');
			    			$(this).siblings('.subnav_wrap').slideUp(300);
			    		}
			    		else{
			    			$(this).parent().addClass('active');
			    			$(this).siblings('.subnav_wrap').slideDown(300);
			    		} 
		    		}

		    	})


			    Accordion(('.subnav_inner >ul >li'));
		    }


		    // Search open
		    AddClassTo(('.header_left .mb_search'),'search_open','body');



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


			// Share function for mobile (get icon bigger on touch)


	 		/*$('.product-info').each(function() {
				$(this).find('.shared_icons >li').each(function(i){

				$(this).on('touchstart', function (e) {
			    	e.stopPropagation();



			        if(!$(this).parents('.product-info').find('.zoomed_s_icons').hasClass('active')){
			        	$(this).parents('.product-info').find('.zoomed_s_icons').addClass('active');
			        	$('.product-info .zoomed_s_icons').not($(this).parents('.product-info').find('.zoomed_s_icons')).removeClass('active');
			        		closeSocialPup();

			        	
			        }
			        else{

			        	$(this).parents('.product-info').find('.zoomed_s_icons').removeClass('active');

			        	//console.log('else')

			        }
			    });

				}) 
		    })*/

			$(document).on('touchstart', '.shared_icons >li', function(e) {
		    	e.stopPropagation();



		        if(!$(this).parents('.product-info').find('.zoomed_s_icons').hasClass('active')){
		        	$(this).parents('.product-info').find('.zoomed_s_icons').addClass('active');
		        	$('.product-info .zoomed_s_icons').not($(this).parents('.product-info').find('.zoomed_s_icons')).removeClass('active');
		        		closeSocialPup();
		        }
		        else{

		        	$(this).parents('.product-info').find('.zoomed_s_icons').removeClass('active');
		        }
		    });




			// Share function for mobile (get icon bigger on touch hold)
			var touchMove = false;
			var lastPoint, triggerPoint;
			//var lastPointer
	 		$('.product-info').each(function() {
				$(this).find('.zoomed_s_icons >li').each(function(i){


					function highlightHoveredObject(x, y) {
					    $('.product-info .zoomed_s_icons.active >li').each(function(j) {
					      // check if is inside boundaries
					      if (!(
					          x <= $(this).offset().left || x >= $(this).offset().left + $(this).outerWidth() ||
					          y <= $(this).parent().offset().top - $(window).scrollTop()  || y >= $(this).parent().offset().top - $(window).scrollTop() + $(this).outerHeight()
					      )) {
					              
					        $('.zoomed_s_icons >li').removeClass('iLarge');
					        $(this).addClass('iLarge');
					        lastPoint = $(this);
					      }


					      
					    });
					}


					$(this).on('touchmove', function(evt){
					  var touch = evt.originalEvent.touches[0];
					  $(this).parent().addClass('tMoveStart')
					  
					  highlightHoveredObject(touch.clientX, touch.clientY);
					  //console.log($(this).html())
					  touchMove = true;
					})





					$(this).on('touchstart', function (e) {
				    	e.stopPropagation();
				        /*startTime = new Date().getTime();
				        var thisIcon = $(this);
				        pressTimer = window.setTimeout(function() {
					        thisIcon.parent().addClass('zooming');
					        //$('.product-info .shared_icons').not(thisIcon.parent()).removeClass('zooming');
					        closeSocialPup();
				    	},500);*/
				    	body.addClass('touchSocialicon')

				    }).on('touchend', function (e) {
				    	e.stopPropagation();
				        /*endTime = new Date().getTime();
				        shortpress = (endTime - startTime < 500) ? true : false;*/

				    	body.removeClass('touchSocialicon')

				        //if(shortpress){
				        	//$('.product-info .shared_icons').removeClass('zooming');

				        	//console.log(lastPoint)

				        	/*triggerPoint =  $(this).parent().siblings('.shared_icons').find('>li').eq(lastPoint.index());*/


				        	triggerPoint = touchMove ? $(this).parents('.product-info').find('.shared_icons').find('>li').eq(lastPoint.index()) : $(this).parents('.product-info').find('.shared_icons').find('>li').eq(i);
				        	i = triggerPoint.index();

				        	touchMove = false;
				        	$('.zoomed_s_icons >li').removeClass('iLarge');
				        	$('.zoomed_s_icons').removeClass('active tMoveStart');



				        	

							var sTTitleWrap = triggerPoint.parent('.shared_icons');
							var thParnts = triggerPoint.parents('.product-info');
							var socialPopup = triggerPoint.parents('.n_thumbnail').length ?  $('#stSocialPopup') : $('#prSocialPopup');
							var sTContentWrap = socialPopup.find('.socialTabContentWrp');


							// Initialize first
							if(!thParnts.hasClass('showSharePopup')){
								thParnts.addClass('showSharePopup')
								body.addClass('bshowingSpopup');
								// Initialize previous record once
								$('.product-info').not(thParnts).removeClass('showSharePopup');
							 	$('.social_popup').find('.atAglance li label').removeClass('checked')
								$('.atAglance li').find('input[type="checkbox"]').attr('checked', false);
							 	$('.social_popup').find('.icon').removeClass('activated')
								$('.social_popup').not(socialPopup).removeClass('showSpopup')
			    				$('#logo').removeClass('showPopupRecomend')

		    					// For positioning Product popup
								socialPopup.css({"left":sTTitleWrap.offset().left, 'top':(sTTitleWrap.offset().top + sTTitleWrap.outerHeight()), 'height':'auto'}).addClass('showSpopup');
								// right alignment
								if(sTTitleWrap.offset().left > ($(window).width()/2 + 100) ) {
									socialPopup.css({"left":(sTTitleWrap.offset().left + sTTitleWrap.outerWidth())-socialPopup.outerWidth()})
								}
								// Center alignment
								if((sTTitleWrap.offset().left - ($(window).width()/2 - sTTitleWrap.width()/2)) < 120 && (sTTitleWrap.offset().left - ($(window).width()/2 - sTTitleWrap.width()/2)) > -120 ) {
									socialPopup.css({"left":($(window).width() - socialPopup.outerWidth())/2})
								}						
							}

							// Initial shared,liked,rated
							tmpSocialNotify(thParnts,socialPopup,i)

							if( triggerPoint.hasClass('active')) return false
							else{
								$('.product-info').find('.shared_icons').find('li').removeClass('active');
								triggerPoint.addClass('active')
								var oldHeight = sTContentWrap.find('>div.active').outerHeight();
								sTContentWrap.find('.active').fadeOut(300).removeClass('active');
								sTContentWrap.find('>div').eq(i).fadeIn(300).addClass('active')
								var newHeight = sTContentWrap.find('>div.active').outerHeight()
								sTContentWrap.find('>div.active').parent().css({height:oldHeight}).animate({height:newHeight},300);
								
								// for inner tab title active
								socialPopup.find('.tab_head li').removeClass('active');
								socialPopup.find('.tab_head li').eq(i).addClass('active');
								// for showing upload thumbnail on right side in product popup
								if(!triggerPoint.parents('.n_thumbnail').length){
									$('#prSocialPopup').find('.tab_head li').eq(i).is(':last-child') ? $('#prSocialPopup').addClass('uploadThumb') : socialPopup.removeClass('uploadThumb');
								}

								// Scroll to top
								$('html, body').animate({scrollTop: sTTitleWrap.offset().top },500);
							}
				        //}
				        //clearTimeout(pressTimer);
				    });

				}) 
		    })





			$(document).on('touchstart',function (){
			  	closeSocialPup();
	        	$('.product-info .shared_icons').removeClass('active');
	        	$('.zoomed_s_icons').removeClass('active');
			});





			// Search result filter in mobile
			$('.filter_wrap.selected_store .filter_widget').each(function(i) {
				$(this).find('.filter_title').click(function() {
					$('.filter_wrap.store_bank .filter_widget').hide(0)
					$(this).parents('.filter_tools').find('.filter_wrap.store_bank .filter_widget').eq(i).show(0)
					$(this).parents('.filter_tool_inner').addClass('pushLeft')
					//$('.filter_wrap').animate({scrollTop: $('.filter_tools').offset().top },0);
				})
			})

			$('#backToResult').click(function() {
				$(this).parents('.filter_tool_inner').removeClass('pushLeft')
			})







	   	} // End code for mobile




		// Custom check by Jqeury (Css custom check not showing by jqery attr changed)
		$('input[type="checkbox"]').siblings('label').click(function () {
			if($(this).hasClass('checked')){
				$(this).removeClass('checked')
				// for share popup accordion
				if($(this).parents('.other_sicn').length) $(this).siblings('.share-box').slideUp(300);
			}else{
				$(this).addClass('checked')
				// for share popup accordion
				if($(this).parents('.other_sicn').length){
					$(this).siblings('.share-box').slideDown(300);
					$('html, body').animate({scrollTop: $(this).offset().top },500);
				} 
			}

		})


		// Enter selected shops in selected queue and  (Checked and Unchecked all From bottom item)
		$('.s_alphabet_item ul li label').click(function() {
    		var k = 0;
    		var j = 0;
			var selectedStore = '';
    		var thParentIndex = ($(this).parents('.s_result_inner')).index();
			$(this).parents('.s_result_right').find('.s_alphabet_item ul li').each(function(i) {
	    		j = j+1
	    		$(this).addClass(''+'id' + thParentIndex + i+'');
				if ($(this).find('label').hasClass('checked')) {
	    			k=k+1;
					//add get label associated with checkbox
					selectedStore += '<li class="'+'id' + thParentIndex + i+'"><input type="checkbox" checked="checked">'+'<label class="checked">' + $(this).find('label').html() +  '</label> </li>';
				}
			});


	    	if(j==k){
	    		checkbxChecked($(this).parents('.s_result_right').find(' .s_select_cat label'))
	    		checkbxChecked($('.all_customize >li:nth-child('+(thParentIndex+1)+') .chooseFrm_all label'))
				$('.all_customize >li:nth-child('+(thParentIndex+1)+') .group_cont').html('');
	    	}else{
	    		checkbxUnchecked($(this).parents('.s_result_right').find('.s_select_cat label'))
	    		checkbxUnchecked($('.all_customize >li:nth-child('+(thParentIndex+1)+') .chooseFrm_all label'))
				$('.all_customize >li:nth-child('+(thParentIndex+1)+') .group_cont').html(selectedStore);
	    	}

	    	// Remove selsected item from selected list on left
			$('.s_current_selection .group_cont li label').click(function() {
				var thisClass = $(this).parent('li').attr('class');
				checkbxUnchecked($('.s_alphabet_item ul li.'+thisClass+' label'))
				$(this).parent().remove()
			})

		});



		// Enter selected shops in selected queue in Mobile search filter
		$('.filter_wrap.store_bank .filter_widget label').click(function() {
    		var k = 0;
    		var j = 0;
			var selectedStore = '';
    		var thParentIndex = ($(this).parents('.filter_widget')).index();
			$(this).parents('.filter_widget').find('ul li').each(function(i) {
	    		j = j+1;
	    		$(this).addClass(''+'id' + thParentIndex + i+'');
				if ($(this).find('label').hasClass('checked')) {
	    			k=k+1;
					//add get label associated with checkbox
					selectedStore += '<li class="'+'id' + thParentIndex + i+'"><input type="checkbox" checked="checked">'+'<label class="checked">' + $(this).find('label').html() +  '</label> </li>';
				}
			});

			var correspondingItem = $(this).parents('.filter_tools').find('.filter_wrap.selected_store .filter_widget').eq(thParentIndex-1);
			k != 0 ? correspondingItem.find('.filter_title').addClass('active') : correspondingItem.find('.filter_title').removeClass('active');


			correspondingItem.find('.filter_list ul').html(selectedStore);
			correspondingItem.find('.filter_title span').html('['+k+']');



	    	// Remove selsected item from selected list on left
			$('.filter_wrap.selected_store .filter_widget .filter_list label').click(function() {
				var thisClass = $(this).parent('li').attr('class');
				checkbxUnchecked($('.filter_wrap.store_bank .filter_widget li.'+thisClass+' label'))
				$(this).parents('.filter_list').find('li').length == 1 ? $(this).parents('.filter_list').siblings('.filter_title').removeClass('active') : '';

				$(this).parent().remove()
				k = k - 1;
				correspondingItem.find('.filter_title span').html('['+k+']');
				
			})

		});





		// Copy by clicking a button (To execute this add attribute in HTML)
		document.body.addEventListener('click', copy, true);
		// event handler
		function copy(e) {
		    // find target element
		    var 
		      t = e.target,
		      c = t.dataset.copytarget,
		      inp = (c ? document.querySelector(c) : null);
		    // is element selectable?
		    if (inp && inp.select) {
		      // select text
		      inp.select();
		      try {
		        // copy text
		        $(t).text('Copied')
		        setTimeout(function() {$(t).text('Click to copy') }, 5000);
		        document.execCommand('copy');
		        document.select();
		        inp.blur();
		      }
		      catch (err) {
				  if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
				  	alert('Press ctrl+c to copy the link')
				  }
		      }
		      
		    }
		}//End copy




		// Hac for iOS iPhone/ipad to protect zoom on clicking form field
		var $objHead = $( 'head' );

		var zoomDisable = function() {
		    $objHead.find( 'meta[name=viewport]' ).remove();
		    $objHead.prepend( '<meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1, user-scalable=no"/>' );
		};

		var zoomEnable = function() {
		    $objHead.find( 'meta[name=viewport]' ).remove();
		    $objHead.prepend( '<meta name="viewport" content="width=device-width, initial-scale=1">');
		};

		if( navigator.userAgent.length && /iPhone|iPad|iPod/i.test( navigator.userAgent ) ) {
		    $( "input, textarea, select" )
		        .on( { 'touchstart' : function() { zoomDisable() } } )
		        .on( { 'touchend' : function() { setTimeout( zoomEnable , 500 ) } } );
		 }// End iOS zoom hac





	   	// Temp code to show client (it can be checked from html)
	   	//checkbxChecked($('.searchResult label'))

	   	$('.s_content_right .field_row .red_btn').click(function() {
	   		closeSocialPup();
	   		// backend
	   		$('#commonPopup').modal('show');
	   	})




		
	})// End ready function.


	// For checkbox checked
	function checkbxChecked(elm) {
		elm.addClass('checked')
		//elm.click()
		elm.siblings('input[type="checkbox"]').click();
	}
	// For checkbox unchecked
	function checkbxUnchecked(elm) {
		elm.removeClass('checked')
		//elm.click()
		elm.siblings('input[type="checkbox"]').click();
	}

	// Checked All by clicking one checkbox
	function checkedAll(parentElm,parentWrp,childElm) {
	    parentElm.click(function() {
	    	var thisDescent = $(this).parents(parentWrp).find(childElm);
	    	var thParentIndex = ($(this).parents('.s_result_inner')).index();
	    	if($(this).hasClass('checked')){
	    		checkbxUnchecked(thisDescent);
				if($(this).is('.s_result_right_header .s_select_cat label')){
					checkbxUnchecked($('.all_customize >li:nth-child('+(thParentIndex+1)+') .chooseFrm_all label'))
				}

	    	}else{
	    		checkbxChecked(thisDescent);
				if($(this).is('.s_result_right_header .s_select_cat label')){
					checkbxChecked($('.all_customize >li:nth-child('+(thParentIndex+1)+') .chooseFrm_all label'))
					$('.all_customize >li:nth-child('+(thParentIndex+1)+')  .group_cont').html('')
				}
	    	}
	    })

	    // For checked all button from child checking
		$(childElm).siblings('input[type="checkbox"]').change(function() {
			if(!$(this).is('.s_alphabet_item ul li input[type="checkbox"]')){
				var k = 0;
				var j = 0;
				$(this).parents(parentWrp).find(childElm).each(function(i) {
		    		j = j+1
					if ($(this).hasClass('checked')) {
		    			k=k+1;
					}
				});
		    	if(j==k){
		    		checkbxChecked($(this).parents(parentWrp).find(parentElm))
		    	}else{
		    		checkbxUnchecked($(this).parents(parentWrp).find(parentElm))
		    	}
			}
		});

	}


    // Make image large on hover function
    function PopupOnFly(elm) {
    	var flyPopUp = $('#flyingPopup')
    	$(document).on('mouseenter',elm,function(e) {
	    	e.stopPropagation();
	    	flyPopUp.html($(this)[0].outerHTML).addClass('showfpopUp')
	    	.css({"left":$(this).offset().left, 'top':($(this).offset().top - $(window).scrollTop()),'width':$(this).width(),'height':$(this).height() })
	    	$('#fakeOverlay').show();
	    	flyPopUp.find('>div>div').css({'width':$(this).width(),'height':$(this).height()})
	    })

	    flyPopUp.mouseenter(function(e){e.stopPropagation();})
	    flyPopUp.mouseleave(function(){flyPopUp.removeClass('showfpopUp');})
		$('#headOverLay').mouseenter(function() {flyPopUp.removeClass('showfpopUp');})
		$('#fakeOverlay').mouseenter(function() {flyPopUp.removeClass('showfpopUp'); $('#fakeOverlay').hide();})
    }


    function gotoTargetInScroll(elm,elmParents,targetElm) {
		elm.click(function(e) {
	    	e.preventDefault();
	    	var gothere = $(this).attr('href');
	    	elm.not(this).removeClass('active')
	    	$(this).addClass('active')
	    	$(this).parents(elmParents).find(targetElm).mCustomScrollbar('scrollTo', $(gothere));
	    	if (screen.width < 767) {
    			$('html, body').animate({scrollTop: $(targetElm).offset().top  },500);
	    	}
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
    var executeOnce = false; // To stop double click
    function AddClassTo(elm,className,addTo) {
    	$(document).on('click touchstart',elm,function(e) {
    		e.stopPropagation()
    		if (!executeOnce) {
    			executeOnce = true;
	    		if($(this).parents(addTo).hasClass(className)){
	    			$(this).parents(addTo).removeClass(className);
	    			if($(this).is('.changeBtn'))$(this).text('Update');
	    		}else{
	    			$(this).parents(addTo).addClass(className);
	    			if($(this).is('.changeBtn'))$(this).text('Save');
	    		} 
	    		setTimeout(function(){ executeOnce = false; }, 900);
    		}
    	})
    }

    // Show popup function
    function ShowPopUp(elm,className,addTo) {
    	$(document).on('click touchstart',elm,function (e){
    		e.stopPropagation();
    		//e.preventDefault();
    		$(this).parents(addTo).addClass(className);
    		$(elm).not(this).parents(addTo).removeClass(className);
    	})

    	$(document).on('click touchstart','.popUp',function (e){
    		e.stopPropagation();
		})
		
		$(document).on('click touchstart',function (){
			$(addTo).removeClass(className);
		})
    }

    // Accordion function
    function Accordion(elm,deflt,change) {
    	$(document).on('click',elm,function(e){
    		e.preventDefault();
    		if($(this).siblings().length){
	    		if($(this).parent().hasClass('active')){
	    			$(this).parent().removeClass('active');
	    			$(this).siblings().slideUp(300);
	    			$(this).text(deflt)
	    		}
	    		else{
	    			$(this).parent().addClass('active');
	    			$(this).siblings().slideDown(300);
	    			$(this).text(change)
	    		} 
    		}
    	})
    	// Add arrow only if have submenu
    	$(elm).each(function(){if($(this).siblings().length && $(this).parents('.main_nav').length) $(this).addClass('hasSubMenu');})
    }


	// For showing like shared and rated fuction in popup
	function tmpSocialNotify(thParnts,socialPopup,i) {
		if(!$(this).find('.icon').hasClass('activated')){
			socialPopup.find('.socialTabHead li').eq(i).find('.icon').addClass('activated');
			//socialPopup.find('.atAglance li').eq(i).find('input[type="checkbox"]').attr('checked', true);
			//socialPopup.find('.atAglance li').eq(i).find('label').addClass('checked');
			checkbxChecked(socialPopup.find('.atAglance li').eq(i).find('label'))
			socialPopup.find('.atAglance li').eq(i).find('.icon').addClass('activated');
		}

		thParnts.find('.shared_icons >li').each(function(k) {
			if($(this).find('.icon').hasClass('activated')){
				socialPopup.find('.socialTabHead li').eq(k).find('.icon').addClass('activated');	
				//socialPopup.find('.atAglance li').eq(k).find('input[type="checkbox"]').attr('checked', true);
				//socialPopup.find('.atAglance li').eq(k).find('label').addClass('checked');
				checkbxChecked(socialPopup.find('.atAglance li').eq(k).find('label'))
				socialPopup.find('.atAglance li').eq(k).find('.icon').addClass('activated');
			}

		})
	}


    // Tab Function 
	/*function Tab(TabTitleWrap,tabContentWrap) {
		tabContentWrap.find('>div:first').fadeIn(0).addClass('active')
		TabTitleWrap.find('>li:first').addClass('active')
		TabTitleWrap.find('>li').each(function(i){
			$(this).click(function(){

				if( $(this).hasClass('active')) return false
				else{
					TabTitleWrap.find('>li').removeClass('active')
					$(this).addClass('active')
					var oldHeight = tabContentWrap.find('>div.active').outerHeight()
					tabContentWrap.find('>div.active').fadeOut(300)
					tabContentWrap.find('>div.active').removeClass('active')
					tabContentWrap.find('>div').eq(i).fadeIn(300).addClass('active')
					var newHeight = tabContentWrap.find('>div.active').outerHeight()
					tabContentWrap.find('>div.active').parent().css({height:oldHeight}).animate({height:newHeight},300);

					// only for (share popup) share icon active
					var thParnts = $('.product-info.showSharePopup')
					var socialPopup = $(this).parents('.social_popup')
					if(socialPopup.length){
						$('.product-info').find('> .shared_icons > li').removeClass('active')
						thParnts.find('> .shared_icons > li').eq(i).addClass('active')
						$(this).parents('#prSocialPopup').find('.tab_head >li').eq(i).is(':last-child') ? $(this).parents('#prSocialPopup').addClass('uploadThumb') : $(this).parents('#prSocialPopup').removeClass('uploadThumb');
						tmpSocialNotify(thParnts,socialPopup,i)	
					}
				}
			})
		})
	}//End tab*/





	

})(jQuery)

// For minimize triggering scroll event
!function(n){n.extend({debounce:function(n,t,e,u){3==arguments.length&&"boolean"!=typeof e&&(u=e,e=!1);var o;return function(){var r=arguments;u=u||this,e&&!o&&n.apply(u,r),clearTimeout(o),o=setTimeout(function(){e||n.apply(u,r),o=null},t)}},throttle:function(n,t,e){var u,o,r;return function(){o=arguments,r=!0,e=e||this,u||function(){r?(n.apply(e,o),r=!1,u=setTimeout(arguments.callee,t)):u=null}()}}})}(jQuery);

