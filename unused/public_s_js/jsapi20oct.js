
var sShoppable = sShoppable || {};

(function($){
  'use strict';
  $(function(){

    var flexslider = { vars:{} };


    // Init the function which will be allow to call function from other file

    // Start SignUp/Login
    // =========================
    var logInMContent = $('#loginPopup .modal-content');
    var body = $('body');


    sShoppable = {
      init: function() {
        sShoppable.ssLogIn();
        sShoppable.ssSignUp();
        sShoppable.ssCustomScrollbar();
        sShoppable.Tab();
        sShoppable.mainSearchTab();
        sShoppable.zoomInOut();
      },
      ssLogIn: function(){
        $('#loginPopup').modal('show')
        logInMContent.css({"right":"-430px"})
        $('#login').css({"right":"0"})
        $('.modal-dialog').removeClass('showVideo');
      },
      ssSignUp: function() {
        $('#loginPopup').modal('show')
        logInMContent.css({"right":"-430px"})
        $('#signup1').css({"right":"0"})
        $('.modal-dialog').removeClass('showVideo');
      },

      // Rating function
      rate: function ($rate) {
        var removeCls = 'h0 h1 h2 h3 h4 h5 h6 h7 h8 h9 r0 r1 r2 r3 r4 r5 r6 r7 r8 r9';
        var hoverCls = 'h0 h1 h2 h3 h4 h5 h6 h7 h8 h9';
        var touchMove = false;
        var rmClassEvent;
        $rate.each(function(){
          var $thisrate = $(this);
          if (screen.width > 767) {
            $(this).find('>div').each(function(i) {
              $(this).mouseenter(function(){
                $(this).parent('.rateis')
                  .removeClass(hoverCls)
                  .addClass('h'+i);
              });
            });
            $(this).hover(
              function() { console.log('over');
                          clearTimeout(rmClassEvent);
                         },
              function(){console.log('out');
                         rmClassEvent = setTimeout(function(){ 
                           $thisrate.removeClass(hoverCls);
                         }, 500);
                        });


            // clicks should be tracked by angular code
            //              if(!dontTrackClick) {
            //                $(this).on('click',function(){
            //                  if ($(this).parent('.rateis').hasClass('r'+i)) {
            //                    $(this).parent('.rateis').removeClass(removeCls);
            //                    $(this).parent('.rateis').addClass('r'+(i-1));
            //                    $(this).parents('.rateis_wrp').find('.ratingValue').val(i);
            //                  } else {
            //                    $(this).parent('.rateis').removeClass(removeCls);
            //                    $(this).parent('.rateis').addClass('r'+i);
            //                    $(this).parents('.rateis_wrp').find('.ratingValue').val(i+1);
            //                  }
            //                });
            //              }
          }else{
            // For mobile
            $(this).find('>div').each(function(i) {
              $(this).hover(function(){
                $(this).parent('.rateis').removeClass(hoverCls);
                $(this).parent('.rateis').addClass('h'+i);
              },function(){
                $(this).parent('.rateis').removeClass(hoverCls);
              });

              if(!dontTrackClick) {
                $(this).on('touchstart',function(){
                  $(this).parents('.rateis_wrp').addClass('zoomedOn');
                  if ($(this).parent('.rateis').hasClass('r'+i)) {
                    $(this).parent('.rateis').removeClass(removeCls);
                    $(this).parent('.rateis').addClass('r'+(i-1));
                    $(this).parent().siblings().removeClass(removeCls);
                    $(this).parent().siblings().addClass('r'+(i-1));
                    $(this).parents('.rateis_wrp').find('.ratingValue').val(i);
                  } else {
                    $(this).parent('.rateis').removeClass(removeCls);
                    $(this).parent('.rateis').addClass('r'+i);
                    $(this).parent().siblings().removeClass(removeCls);
                    $(this).parent().siblings().addClass('r'+i);
                    $(this).parents('.rateis_wrp').find('.ratingValue').val(i+1);
                  }
                });
              }
            });

            $rate.filter('.showRate').on('touchstart',function(){
              $(this).parents('.rateis_wrp').removeClass('zoomedOn');
            });

            $(this).find('>div')
              .on('touchmove', function(evt){
              var touch = evt.originalEvent.touches[0];
              //$(this).parents('.rateis_wrp').addClass('tMoveStart')
              highlightHoveredObject(touch.clientX, touch.clientY);
              touchMove = true;
            })
              .on('touchend',function(){
              if (touchMove) {
                $(this).parents('.rateis_wrp').removeClass('zoomedOn');
              }
              touchMove = false;
            });

            function highlightHoveredObject(x, y) {
              $rate.filter('.mainRateBox').each(function(){
                $(this).find('>div').each(function(j) {
                  // check if is inside boundaries
                  if (!(
                    x <= $(this).offset().left || x >= $(this).offset().left + $(this).outerWidth() ||
                    y <= $(this).parent().offset().top - $(window).scrollTop()  || y >= $(this).parent().offset().top - $(window).scrollTop() + $(this).outerHeight()
                  )) {
                    /*$('.rateis >div').not(this).removeClass('iLarge');
                                  $(this).addClass('iLarge');*/

                    $(this).parent('.rateis').removeClass('r0 r1 r2 r3 r4 r5 r6 r7 r8 r9');
                    $(this).parent('.rateis').addClass('r'+j);
                    $(this).siblings('input').val(j+1);

                    $(this).parent().siblings('').removeClass('r0 r1 r2 r3 r4 r5 r6 r7 r8 r9');
                    $(this).parent().siblings('').addClass('r'+j);
                  }
                });
              });
            }
          }
        });
      },

      ssCustomScrollbar: function(){

        if (screen.width > 767) {


          $.mCustomScrollbar.defaults.scrollButtons.enable = true;


          $(".mCustomScrollbar").mCustomScrollbar({
            theme:"dark",
            callbacks: 	{
              whileScrolling:function(){
                if($('.tab_content_wrap .product-info.showSharePopup,.right_sidebar .product-info.showSharePopup').length) {
                  sShoppable.closeSocialPup();
                }
                if (screen.width < 1025) {
                  $('.shared_icons').parents('.mCustomScrollBox').addClass('scrolling');
                }
              },
              onScroll:function(){
                setTimeout(function() {
                  if (screen.width < 1025){
                    $('.shared_icons').parents('.mCustomScrollBox').removeClass('scrolling');
                  }
                },1000);
              }
            }
          });

        } else {
          $('.mCustomScrollbar').addClass('defaultScroll').removeClass('mCustomScrollbar');
        }


      },

      Tab : function (TabTitleWrap,tabContentWrap) {
        tabContentWrap.find('>div:first').fadeIn(0).addClass('active')
        TabTitleWrap.find('>li:first').addClass('active')
        TabTitleWrap.find('>li').each(function(i){
          $(this).click(function(){

            if( $(this).hasClass('active')) return false
            else{
              TabTitleWrap.find('>li').removeClass('active')
              $(this).addClass('active')
              tabContentWrap.find('>div.active').fadeOut(300)
              tabContentWrap.find('>div.active').removeClass('active')
              tabContentWrap.find('>div').eq(i).fadeIn(300).addClass('active')
              var newHeight = tabContentWrap.find('>div.active').outerHeight()
              tabContentWrap.find('>div.active').parent().animate({height:newHeight},300);
            }
          })
        })
      },

      mainSearchTab : function () {
        $('.searchResult').find('>div:first').fadeIn(0).addClass('active')
        $('.searchCategory').find('>li:first').addClass('active')
        $('.searchCategory').each(function() {
          $(this).find('>li').each(function(i){
            $(this).click(function(){

              if( $(this).hasClass('active')) return false
              else{
                $(this).parent().find('>li').removeClass('active');
                $(this).addClass('active');
                $(this).parent().siblings('.searchResult').find('>div.active').fadeOut(300).removeClass('active')
                $(this).parent().siblings('.searchResult').find('>div').eq(i).fadeIn(300).addClass('active')
                var newHeight = $(this).parent().siblings('.searchResult').find('>div.active').outerHeight()
                $(this).parent().siblings('.searchResult').find('>div.active').parent().animate({height:newHeight},300);

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
      },

      zoomInOut : function () {

        var sliderStage = $('#carouselStage');

        // Start Zoom in zoom out

        var $section = $('#Qview');
        $section.find('.panzoom').panzoom({
          $zoomIn: $section.find(".icn_zoom_plus"),
          $zoomOut: $section.find(".icn_zoom_minus_gray"),
          $zoomRange: $section.find(".zoom-range"),
          $reset: $section.find(".icn_zoom_reset_gray"),

        });

        $(document).on('click', '.s_pro_control', function() {
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
              sliderStage.resize();
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
              sliderStage.resize();
              $('#Qview').removeClass('InitialzSlier')
            },900)
          }

        })


        $('.s_product_stage .close_btn').click(function() {
          $('#Qview').removeClass('fullSactive')
          $('#fullScrnPopup').removeClass('fullScreen')
          $('#Qview').addClass('InitialzSlier')
          setTimeout(function() {
            sliderStage.resize();
            $('#Qview').removeClass('InitialzSlier')
          },900)
        })

        $('.icn_zoom_reset_gray').click(function() {
          if ($(this).parents('li').hasClass('enable')) {
            $('#Qview').removeClass('fullSactive')
            $('#fullScrnPopup').removeClass('fullScreen')
            $('#Qview').addClass('InitialzSlier')
            setTimeout(function() {
              sliderStage.resize();
              $('#Qview').removeClass('InitialzSlier')
            },900)
          }
        })

        // End Zoom in zoom out,
      },

    };


    //  Single product page
    $('.product-item .rateis .white_btn').click(function() {
      var goTo = $(this).attr('href');
      $('html, body').animate({scrollTop: $(goTo).offset().top},500);
      var index = $('#review_thumb').index();   
      $('#StageNavCarousel').flexslider(index);
      $('#carouselStage').flexslider(index);
    });

    if($('.single_product_page').length){
      sShoppable.zoomInOut();
    }


    // Trigger login on click
    $(document).on('click', '.ss_LogIn', function() {
      sShoppable.ssLogIn();
    })

    // Trigger Sign up on click
    $(document).on('click', '.ss_SignUp', function() {
      sShoppable.ssSignUp();
    })



    // Slider
    sShoppable.slider = {

      init: function() {
        sShoppable.slider.stageSlider();
        sShoppable.slider.miniThumbSlider();
        sShoppable.slider.blogPostSlider();
        sShoppable.slider.quickViewSlider();

      },


      stageSlider : function () {

        //var sliderStage = $('#carouselStage');

        $('#carouselStage').flexslider({
          selector		: '.slides >li',
          //sync			: "#StageNavCarousel",
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

        // Home page and Dashboard page slider thumbnails
        if($('.carousel_store1').length){
          // function to add breakpoints
          function getGridSize() {
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


      },

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
            }
          });

          // check grid size on resize event
          $(window).resize(function() {
            var gridSize = getGridSizesmThmb();
            flexslider.vars.minItems = gridSize;
            flexslider.vars.maxItems = gridSize;
          });


        }


      },

      blogPostSlider : function () {
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

      },


      quickViewSlider : function () {
        // Quick view slider
        $('#quickThumb').flexslider({
          selector		: '.q_slide >li',
          //sync			: "#quickThumbNav",
          animation		: "slide",
          controlNav 		: false,
          slideshow		: false,
          useCSS			: false,
        });

        $('#quickThumbNav').flexslider({
          asNavFor: '.quick-carousel',
          selector: '.quick_nav >li',
          //sync	 : "#quickThumb",
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
      }	


    };


    $('#signUp_step1').click(function() {
      gotoStep($('#signup2'),$('#signup1'),  'backward');
    })

    $('#signUp_step2').click(function() {
      gotoStep($('#signup3'),$('#signup2'),  'backward');
    })

    $('#signUp_step3').click(function() {
      gotoStep( $('#signup4'), $('#signup3'),  'backward');
      // Show success message
      setTimeout(function(){ 
        $('#loginPopup').modal('hide');
        //setTimeout(function(){ gotoStep( $('#signupVideo'), $('#signup4'),  'backward');}, 1000);
        $('.modal-dialog').addClass('showVideo'); 
      }, 5000);
      // Show Video After certain time
      setTimeout(function(){
        sShoppable.closeSocialPup();
        $('.modal').modal('hide');
        $('#signupVideo').css({"right":0});
        $('#signup4').css({"right":'430px'});
        $('#loginPopup').modal('show');
      }, 35000);

    })

    $('#okSignIn').click(function() {
      gotoStep($('#login'),$('#signup1'),  'backward');
    })

    $('#signup2 .icon-back-btn').click(function() {
      gotoStep( $('#signup1'), $('#signup2'),  'forward');
    })

    $('#signup3 .icon-back-btn').click(function() {
      gotoStep( $('#signup2'), $('#signup3'),  'forward');
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


    // Add red heart in sort by dropdown
    $(document).on('change', '.defaultSt select', function() {
      $(this).val() == 'Favorites' ? $(this).addClass('fRedHeart') : $(this).removeClass('fRedHeart');
    })





    // ====== Start Social popup  ========= //
    //========================================

    sShoppable.socialPopup = {

      // Triggering social popup
      trigger : function () {

        if (screen.width > 767) {
          $('body').on('click touchstart', '.product-info .shared_icons >li', function (e){ 

            e.stopPropagation();
            var sTTitleWrap = $(this).parent('.shared_icons');
            var thParnts = $(this).parents('.product-info');
            var socialPopup = $(this).parents('.n_thumbnail').length ?  $('#stSocialPopup') : $('#prSocialPopup');
            var sTContentWrap = socialPopup.find('.socialTabContentWrp');

            // Initialize first
            if(!thParnts.hasClass('showSharePopup')){
              thParnts.addClass('showSharePopup')
              body.addClass('bshowingSpopup');
              // Initialize previous record once
              $('.product-info').not(thParnts).removeClass('showSharePopup');
              $('.social_popup').not(socialPopup).removeClass('showSpopup')
              $('#logo').removeClass('showPopupRecomend')

              // For positioning Product popup
              socialPopup.css({"left":sTTitleWrap.offset().left, 'top':(sTTitleWrap.offset().top + sTTitleWrap.outerHeight()), 'height':'auto'}).addClass('showSpopup');
              // right alignment
              if(sTTitleWrap.offset().left  + 90 > ($(window).width()/2) ) {
                socialPopup.css({"left":(sTTitleWrap.offset().left + sTTitleWrap.outerWidth())-socialPopup.outerWidth()})
              }
              // Center alignment
              if((sTTitleWrap.offset().left - ($(window).width()/2 - sTTitleWrap.width()/2)) < 120 && (sTTitleWrap.offset().left - ($(window).width()/2 - sTTitleWrap.width()/2)) > -120 ) {
                socialPopup.css({"left":($(window).width() - socialPopup.outerWidth())/2})
              }						
            }

            if( $(this).hasClass('active')) {
              return false;
            }else{
              // Scroll to top
              $('html, body').animate({scrollTop: sTTitleWrap.offset().top },500);
            } 
          })
        }else{

          // Share function for mobile (get icon bigger on touch hold)
          var touchMove = false;
          var lastPoint, triggerPoint;
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
                touchMove = true;
                sShoppable.closeSocialPup();
              })

              $(this).on('touchstart', function (e) {
                e.stopPropagation();
                $(this).parents('.product-info').find('.zoomed_s_icons').addClass('active');
                $('.product-info .zoomed_s_icons').not($(this).parents('.product-info').find('.zoomed_s_icons')).removeClass('active');
                body.addClass('touchSocialicon')

              }).on('touchend', function (e) {
                e.stopPropagation();
                body.removeClass('touchSocialicon')
                $('.product-info').find('.zoomed_s_icons').removeClass('active');
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



                // Scroll to top
                $('html, body').animate({scrollTop: sTTitleWrap.offset().top },500);
              });
            }) 
          })
        }
      }
    };

    sShoppable.mainSearchTab();
    sShoppable.rate($('.rateis'));

    // Showing Share function in Modal window
    $('.shareInModal').each(function() {
      $(this).find('.shared_icons li').each(function(i) {
        $(this).click(function(e){
          e.stopPropagation();
          $('#prSocialPopup').modal('show');
        })
      })
    })


    // Close Share function Modal
    $('#closePrPopup').click(function() {
      if(socailPupInModal){
        $('#prSocialPopup').modal('hide');
        setTimeout(function() {body.addClass('modal-open')},1000);
      }
    })



    // Close size guide Modal over Quickveiw modal
    $('#closeSizeGd').click(function() {
      $('#size-guide-popup').modal('hide');
      setTimeout(function() {body.addClass('modal-open')},1000);
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

    // For closing social Tab
    $('.social_popup').on('click touchstart',function (e) {
      e.stopPropagation()
    })

    $('.close-popup').click(function(){
      sShoppable.closeSocialPup();
    });

    // Function for close social popup
    sShoppable.closeSocialPup = function() {
      if ($('.social_popup').hasClass('showSpopup')) {
        $('.product-info >.shared_icons >li').removeClass('active')
        $('.social_popup').removeClass('showSpopup'); 
        setTimeout(function(){
          $('.social_popup').removeAttr('style');
          body.removeClass('bshowingSpopup');
          $('.product-info.showSharePopup').removeClass('showSharePopup')
        }, 600);
        // For recomended
        $('#logo').removeClass('showPopupRecomend')
      }
    }


    // Textarea limit counting
    $('.notify_desc .ss_rtg_dtls textarea').keyup(function() {
      var text_length = $(this).val().replace(/[#]/g, "").length;
      $(this).siblings('.txt-limit').find('span').html(text_length)
    });

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


    // Shopping bag

    var savedItemVisited = false;
    var miniCartItem = $('.mini-cart-menu .cart-items');
    var miniCartMenu = $('#miniCartMenu');

    AddClassTo(('.saved_item_info'),'showCart','body')

    $(document).on('click', '.saved_for_later', function(e){
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

    // Click for remove Notification
    ShowPopUp(('.ss_mail_list li .close_btn span'),'popUpshow','.ss_mail_list li .close_btn');

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
    //checkedAll($('.s_result_right_header .s_select_cat label'),'.s_result_right','.s_alphabet_item ul li label');


    // Checked All in Subscription notification

    //checkedAll($('.chekcedAllBtn'),'.checkedAllWrp','.checkThisAll li label');

    // All Store tab
    sShoppable.Tab($('#tabHead'), $('#tabContentWrap'));


    // Top 10 store popup
    ShowPopUp(('.tab_content_top .topTen_list li >div'),'popUpshow','.tab_content_top .topTen_list li');
    ShowPopUp(('.search_result li .store_list li >div'),'popUpshow','.search_result li .store_list li');

    // Go to letter wise store on click calender
    gotoTargetInScroll($('.searchResult .s_result_alphabet li a'),'.s_result_inner','.s_content_list');
    gotoTargetInScroll($('#tabContentWrap .s_result_alphabet li a'),$('#tabContentWrap .search_result'));

    // Clear all selection
    $(document).on('click', '.s_result_action .clear_btn', function () {
      var thsParentIndex = ($(this).parents('.s_result_inner')).index();
      checkbxUnchecked($('.all_customize >li:nth-child('+(thsParentIndex+1)+') .chooseFrm_all label'));
      checkbxUnchecked($(this).parents('.s_result_inner').find('label'));
    })

    /*$('.s_result_action .clear_btn').click(function() {
			var thsParentIndex = ($(this).parents('.s_result_inner')).index();
			checkbxUnchecked($('.all_customize >li:nth-child('+(thsParentIndex+1)+') .chooseFrm_all label'));
			checkbxUnchecked($(this).parents('.s_result_inner').find('label'));
		})*/


    // Search Box open close 
    var searchGotopMb = false;
    $('#searchEng').each(function() {
      $(this).on('click touchstart',function (e) {
        e.stopPropagation();
        $(this).addClass('search_show');
        $('.search_box_input').not(this).removeClass('search_show');
        if(screen.width<768 && !searchGotopMb) {
          $('html, body').animate({scrollTop: $(this).offset().top - 10 },500);
          searchGotopMb =true;
        }
      })

    })

    $('.s_result_action .cancel_btn').click(function(e) {
      e.stopPropagation();
      $(this).parents('.search_box_input').removeClass('search_show');
      body.removeClass('search_open');
      searchGotopMb =false;
    })

    $(document).on('click touchstart',function () {
      $('.search_box_input').removeClass('search_show');
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
          $('.product_group').css({'overflow' : 'hidden', 'height' : $('.product_group').outerHeight()})
          $('.product_group_inner').append(data)
          $('.product_group').animate({'height' : $('.product_group_inner').outerHeight() + 40 }, 500, function(){
            $('.loading .load_more').html('Page 1');
            $(this).css({'overflow':'visible'})
          })
        },
        fail: function(){ $('#card-review-load-more-btn').html('Load More') }
      })
    })



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
    /*if( $('.right_sidebar').length && !$('.dashboard_page').length){
		   	var sidebarRight = $(window).width() - ($('.right_sidebar').offset().left + $('.right_sidebar').width())
		   	var sidebarTop = $('.right_sidebar').offset().top
		   	var sidebarheight = $('.right_sidebar').outerHeight();
			var sidebarwidth = $('.right_sidebar').width();
			$(window).scroll(function () {
				var scroll = $(this).scrollTop();
		   		var sidebarBottom = $('.loading').offset().top - sidebarheight + sidebarTop;

				if (scroll > sidebarTop) {
					$('.right_sidebar').css({'position':'fixed','top':'0','right':sidebarRight,'height':sidebarheight,'width':sidebarwidth});

		  			if( scroll > sidebarBottom){
						$('.right_sidebar').css({'position': 'absolute','top': 'initial', 'right' : 0, 'bottom' : 0 });
					}

				}else{
					$('.right_sidebar').removeAttr('style');
				} 
			});
		}*/


    // Mail box page
    $('.logo_list').each(function() {
      var storeNo = $(this).find('li').length
      if (screen.width > 767) {
        storeNo > 5 ? $(this).addClass('threeDot') : $(this).removeClass('threeDot')
      } else {
        storeNo > 4 ? $(this).addClass('threeDot') : $(this).removeClass('threeDot')
      }
    })

    $(document).on('click','.m_accordion_title',function(e){
      e.preventDefault();
      var logWrpHt = $('.logo_list').height() - 10
      if($(this).parent().hasClass('active')){
        $(this).parent().removeClass('active');
        $(this).siblings('.order_itm_info_grp').slideUp(300);
        $(this).text('See details')
        $(this).parent().find('.logo_list_wrp').animate({'height': 70},300)
      }
      else{
        $(this).parent().addClass('active');
        $(this).siblings('.order_itm_info_grp').slideDown(300);
        $(this).text('Close')
        $(this).parent().find('.logo_list_wrp').animate({'height': logWrpHt},300)
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


      // Customize top ten popup

      $(document).on('touchstart','.custm_t10' ,function() {
        $('#cusTop10Popup').modal('show')
      })





    } // End code for mobile




    // Custom check by Jqeury (Css custom check not showing by jqery attr changed)
    //$('input[type="checkbox"] + label').click(function () {
    $(document).on('click', 'input[type="checkbox"] + label', function() {
      if($(this).hasClass('checked')){
        $(this).removeClass('checked');
        // for share popup accordion
        if($(this).parents('.other_sicn').length) $(this).siblings('.share-box').slideUp(300);
      }else{
        $(this).addClass('checked');
        // for share popup accordion
        if($(this).parents('.other_sicn').length){
          $(this).siblings('.share-box').slideDown(300);
          $('html, body').animate({scrollTop: $(this).offset().top },500);
        } 
      }

    })


    // Enter selected shops in selected queue and  (Checked and Unchecked all From bottom item)
    $(document).on('click', '.s_alphabet_item ul li label', function() {
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


    });


    // Remove selsected item from selected list on left
    $(document).on('click', '.s_current_selection .group_cont li label', function() {
      var thisClass = $(this).parent('li').attr('class');
      checkbxUnchecked($('.s_alphabet_item ul li.'+thisClass+' label'))
      $(this).parent().remove()
    })






    // Enter selected shops in selected queue in Mobile search filter
    $(document).on('click', '.filter_wrap.store_bank .filter_widget label', function() {
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
    });


    // Remove selsected item from selected list on left
    $(document).on('click', '.filter_wrap.selected_store .filter_widget .filter_list label', function() {
      //$('.filter_wrap.selected_store .filter_widget .filter_list label').click(function() {
      var thisClass = $(this).parent('li').attr('class');
      checkbxUnchecked($('.filter_wrap.store_bank .filter_widget li.'+thisClass+' label'))
      $(this).parents('.filter_list').find('li').length == 1 ? $(this).parents('.filter_list').siblings('.filter_title').removeClass('active') : '';

      $(this).parent().remove()
      k = k - 1;
      correspondingItem.find('.filter_title span').html('['+k+']');
    })






    // For safari
    /*if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1){
			if (screen.width < 768) {
				body.addClass('safariMb')
			}else{
				body.addClass('safariDsktp')
			}
		}*/







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
        .on( { 'touchstart' : function() { zoomDisable(); } } )
        .on( { 'touchend' : function() { setTimeout( zoomEnable , 500 ) } } );
    }// End iOS zoom hac





    // Temp code to show client (it can be checked from html)
    //checkbxChecked($('.searchResult label'))

    /*$('.s_content_right .field_row .red_btn').click(function() {
	   		sShoppable.closeSocialPup();
	   		// backend
	   		$('#commonPopup').modal('show');
	   	})*/





  });// End ready function.


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
  /*function checkedAll(parentElm,parentWrp,childElm) {
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

	}*/ // end function


  // Make image large on hover function
  function PopupOnFly(elm) {
    var flyPopUp = $('#flyingPopup')
    var fpopUpTop, fpopUpLeft, fpopUpWth, fpopUpHt
    $(document).on('mouseenter',elm,function(e) {
      e.stopPropagation();
      fpopUpTop = $(this).offset().top - $(window).scrollTop();
      fpopUpLeft = $(this).offset().left;
      fpopUpWth = $(this).width();
      fpopUpHt = $(this).height();
      flyPopUp.html($(this)[0].outerHTML).addClass('showfpopUp')
        .css({'left': fpopUpLeft, 'top': fpopUpTop, 'width': fpopUpWth, 'height': fpopUpHt })
        .animate({'left': fpopUpLeft - fpopUpWth, 'top': fpopUpTop - fpopUpHt, 'width':fpopUpWth*3, 'height':fpopUpHt*3},0);
      $('#fakeOverlay').show();
      flyPopUp.find('>div>div')
        .css({'width':fpopUpWth, 'height':fpopUpHt})
        .animate({'width':fpopUpWth*3, 'height':fpopUpHt*3},0)
    })

    flyPopUp.mouseenter(function(e){e.stopPropagation();})
    flyPopUp.mouseleave(function(){
      flyPopUp.removeClass('showfpopUp').css({'left': fpopUpLeft, 'top': fpopUpTop, 'width': fpopUpWth, 'height': fpopUpHt })
      flyPopUp.find('>div>div').css({'width':fpopUpWth, 'height':fpopUpHt});
    })
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
    elm.click(function(e) {
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

})(jQuery)

// For minimize triggering scroll event
  !function(n){n.extend({debounce:function(n,t,e,u){3==arguments.length&&"boolean"!=typeof e&&(u=e,e=!1);var o;return function(){var r=arguments;u=u||this,e&&!o&&n.apply(u,r),clearTimeout(o),o=setTimeout(function(){e||n.apply(u,r),o=null},t)}},throttle:function(n,t,e){var u,o,r;return function(){o=arguments,r=!0,e=e||this,u||function(){r?(n.apply(e,o),r=!1,u=setTimeout(arguments.callee,t)):u=null}()}}})}(jQuery);
