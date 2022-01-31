'use strict';

var socialPopup = socialPopup || {};

(function ($) {
  $(function () {


    var body = $('body');


    socialPopup = {

      init: function () {
        socialPopup.trigger();
      },


      // Rating function
      rate: function ($rate) {
        var removeCls = 'h0 h1 h2 h3 h4 h5 h6 h7 h8 h9 r0 r1 r2 r3 r4 r5 r6 r7 r8 r9';
        var hoverCls = 'h0 h1 h2 h3 h4 h5 h6 h7 h8 h9';
        var touchMove = false;
        var rmClassEvent;
        $rate.each(function () {
          var $thisrate = $(this);
          if (screen.width > 767) {
            $(this).find('>div').each(function (i) {
              $(this).mouseenter(function () {
                $(this).parent('.rateis')
                  .removeClass(hoverCls)
                  .addClass('h' + i);
              });
            });
            $(this).hover(
              function () {
                clearTimeout(rmClassEvent);
              },
              function () {
                rmClassEvent = setTimeout(function () {
                  $thisrate.removeClass(hoverCls);
                }, 500);
              });
          } else {
            // For mobile
            $(this).find('>div').each(function (i) {
              $(this).hover(function () {
                $(this).parent('.rateis').removeClass(hoverCls);
                $(this).parent('.rateis').addClass('h' + i);
              }, function () {
                $(this).parent('.rateis').removeClass(hoverCls);
              });

              //if(!dontTrackClick) {
              $(this).on('touchstart', function () {
                $(this).parents('.rateis_wrp').addClass('zoomedOn');
                if ($(this).parent('.rateis').hasClass('r' + i)) {
                  $(this).parent('.rateis').removeClass(removeCls);
                  $(this).parent('.rateis').addClass('r' + (i - 1));
                  $(this).parent().siblings().removeClass(removeCls);
                  $(this).parent().siblings().addClass('r' + (i - 1));
                  $(this).parents('.rateis_wrp').find('.ratingValue').val(i);
                } else {
                  $(this).parent('.rateis').removeClass(removeCls);
                  $(this).parent('.rateis').addClass('r' + i);
                  $(this).parent().siblings().removeClass(removeCls);
                  $(this).parent().siblings().addClass('r' + i);
                  $(this).parents('.rateis_wrp').find('.ratingValue').val(i + 1);
                }
              });
              //}
            });

            $rate.filter('.showRate').on('touchstart', function () {
              $(this).parents('.rateis_wrp').removeClass('zoomedOn');
            });

            $(this).find('>div')
              .on('touchmove', function (evt) {
                var touch = evt.originalEvent.touches[0];
                //$(this).parents('.rateis_wrp').addClass('tMoveStart')
                objectHighlightRate(touch.clientX, touch.clientY);
                touchMove = true;
              })
              .on('touchend', function () {
                if (touchMove) {
                  $(this).parents('.rateis_wrp').removeClass('zoomedOn');
                }
                touchMove = false;
              });

            var objectHighlightRate = function (x, y) {
              $rate.filter('.mainRateBox').each(function () {
                $(this).find('>div').each(function (j) {
                  // check if is inside boundaries
                  if (!(
                      x <= $(this).offset().left || x >= $(this).offset().left + $(this).outerWidth() ||
                      y <= $(this).parent().offset().top - $(window).scrollTop() || y >= $(this).parent().offset().top - $(window).scrollTop() + $(this).outerHeight()
                    )) {
                    /*$('.rateis >div').not(this).removeClass('iLarge');
                     $(this).addClass('iLarge');*/

                    $(this).parent('.rateis').removeClass('r0 r1 r2 r3 r4 r5 r6 r7 r8 r9');
                    $(this).parent('.rateis').addClass('r' + j);
                    $(this).siblings('input').val(j + 1);

                    $(this).parent().siblings('').removeClass('r0 r1 r2 r3 r4 r5 r6 r7 r8 r9');
                    $(this).parent().siblings('').addClass('r' + j);
                  }
                });
              });
            }
          }
        });
      },

      // Triggering social popup
      trigger: function () {

        if (screen.width > 767) {
          $('body').on('click touchstart', '.product-info .shared_icons >li', function (e) {

            e.stopPropagation();
            var sTTitleWrap = $(this).parent('.shared_icons');
            var thParnts = $(this).parents('.product-info');
            var socialPopup = $(this).parents('.n_thumbnail').length ? $('#stSocialPopup') : $('#prSocialPopup');
            var sTContentWrap = socialPopup.find('.socialTabContentWrp');

            // Initialize first
            if (!thParnts.hasClass('showSharePopup')) {
              thParnts.addClass('showSharePopup')
              body.addClass('bshowingSpopup');
              // Initialize previous record once
              $('.product-info').not(thParnts).removeClass('showSharePopup');
              $('.social_popup').not(socialPopup).removeClass('showSpopup')
              $('#logo').removeClass('showPopupRecomend')

              // For positioning Product popup
              socialPopup.css({
                "left": sTTitleWrap.offset().left,
                'top': (sTTitleWrap.offset().top + sTTitleWrap.outerHeight()),
                'height': 'auto'
              }).addClass('showSpopup');
              // right alignment
              if (sTTitleWrap.offset().left + 90 > ($(window).width() / 2)) {
                socialPopup.css({"left": (sTTitleWrap.offset().left + sTTitleWrap.outerWidth()) - socialPopup.outerWidth()})
              }
              // Center alignment
              if ((sTTitleWrap.offset().left - ($(window).width() / 2 - sTTitleWrap.width() / 2)) < 120 && (sTTitleWrap.offset().left - ($(window).width() / 2 - sTTitleWrap.width() / 2)) > -120) {
                socialPopup.css({"left": ($(window).width() - socialPopup.outerWidth()) / 2})
              }
            }

            if ($(this).hasClass('active')) {
              return false;
            } else {
              // Scroll to top
              $('html, body').animate({scrollTop: sTTitleWrap.offset().top}, 500);
            }
          })
        } else {

          // Share function for mobile (get icon bigger on touch hold)
          var touchMove = false;
          var lastPoint, triggerPoint;

          var objectHighlight = function (x, y) {
            $('.product-info .zoomed_s_icons.active >li').each(function (j) {
              // check if is inside boundaries
              if (!(
                  x <= $(this).offset().left || x >= $(this).offset().left + $(this).outerWidth() ||
                  y <= $(this).parent().offset().top - $(window).scrollTop() || y >= $(this).parent().offset().top - $(window).scrollTop() + $(this).outerHeight()
                )) {
                $('.zoomed_s_icons >li').removeClass('iLarge');
                $(this).addClass('iLarge');
                lastPoint = $(this);
              }
            });
          }

          $(document).on('touchmove', '.zoomed_s_icons >li', function (evt) {
            evt.stopPropagation();
            var touch = evt.originalEvent.touches[0];
            $(this).parent().addClass('tMoveStart')
            objectHighlight(touch.clientX, touch.clientY);
            touchMove = true;
            socialPopup.closed();
          })

          $(document).on('touchstart', '.zoomed_s_icons >li', function (e) {
            e.stopPropagation();
            $(this).parents('.product-info').find('.zoomed_s_icons').addClass('active');
            $('.product-info .zoomed_s_icons').not($(this).parents('.product-info').find('.zoomed_s_icons')).removeClass('active');
            body.addClass('touchSocialicon')

          })

          $(document).on('touchend', '.zoomed_s_icons >li', function (e) {
            e.stopPropagation();
            body.removeClass('touchSocialicon')
            $('.product-info').find('.zoomed_s_icons').removeClass('active');
            triggerPoint = touchMove ? lastPoint : $(this);
            var indx = triggerPoint.index();
            touchMove = false;
            $('.zoomed_s_icons >li').removeClass('iLarge');
            $('.zoomed_s_icons').removeClass('active tMoveStart');

            var sTTitleWrap = triggerPoint.parents('.product-info').find('.shared_icons');
            var thParnts = triggerPoint.parents('.product-info');
            var socialPopup = triggerPoint.parents('.n_thumbnail').length ? $('#stSocialPopup') : $('#prSocialPopup');
            var sTContentWrap = socialPopup.find('.socialTabContentWrp');
            sTTitleWrap.find('>li').eq(indx).click();

            // Initialize first
            if (!thParnts.hasClass('showSharePopup')) {
              thParnts.addClass('showSharePopup')
              body.addClass('bshowingSpopup');
              // Initialize previous record once
              $('.product-info').not(thParnts).removeClass('showSharePopup');
              $('.social_popup').not(socialPopup).removeClass('showSpopup')
              $('#logo').removeClass('showPopupRecomend')

              // For positioning Product popup
              socialPopup.css({
                "left": sTTitleWrap.offset().left,
                'top': (sTTitleWrap.offset().top + sTTitleWrap.outerHeight()),
                'height': 'auto'
              }).addClass('showSpopup');
              // right alignment
              if (sTTitleWrap.offset().left > ($(window).width() / 2 + 100)) {
                socialPopup.css({"left": (sTTitleWrap.offset().left + sTTitleWrap.outerWidth()) - socialPopup.outerWidth()})
              }
              // Center alignment
              if ((sTTitleWrap.offset().left - ($(window).width() / 2 - sTTitleWrap.width() / 2)) < 120 && (sTTitleWrap.offset().left - ($(window).width() / 2 - sTTitleWrap.width() / 2)) > -120) {
                socialPopup.css({"left": ($(window).width() - socialPopup.outerWidth()) / 2})
              }
            }

            // Scroll to top
            $('html, body').animate({scrollTop: sTTitleWrap.offset().top}, 500);
          });
        }
      },

      // Function for close social popup
      closed: function () {
        if ($('.social_popup').hasClass('showSpopup')) {
          $('.product-info >.shared_icons >li').removeClass('active')
          $('.social_popup').removeClass('showSpopup');
          setTimeout(function () {
            $('.social_popup').removeAttr('style');
            body.removeClass('bshowingSpopup');
            $('.product-info.showSharePopup').removeClass('showSharePopup')
          }, 600);
          // For recomended
          $('#logo').removeClass('showPopupRecomend')
        }
      }

    }; // End social popup trigger

    // Close social popup in mobile
    $(document).on('touchstart',function (){
      if(screen.width <=767) socialPopup.closed();
    });


    //socialPopup.mainSearchTab();
    socialPopup.rate($('.rateis'));

    // Showing Share function in Modal window
    $('.shareInModal').each(function () {
      $(this).find('.shared_icons li').each(function (i) {
        $(this).click(function (e) {
          e.stopPropagation();
          $('#prSocialPopup').modal('show');
        })
      })
    })


    // Close Share function Modal
    $('#closePrPopup').click(function () {
      if (socailPupInModal) {
        $('#prSocialPopup').modal('hide');
        setTimeout(function () {
          body.addClass('modal-open')
        }, 1000);
      }
    })


    // Footer popup click on Recomended site
    $('#shareRecomended').on('click', function (e) {
      e.stopPropagation();
      if ($('#logo').hasClass('showPopupRecomend')) {
        $('#logo').removeClass('showPopupRecomend')
      }
      else {
        $('.product-info').removeClass('showSharePopup');
        $('.social_popup').removeClass('showSpopup')
        $('#logo').addClass('showPopupRecomend')
        $('.shared_icons.tab_head li:nth-child(2)').click();

        $('#stSocialPopup').css({
          "left": ($(window).width() - $('#stSocialPopup').outerWidth()) / 2,
          'top': ($('#logo').offset().top + $('#logo').height() + 2 ),
          'height': 'auto'
        }).addClass('showSpopup')
        $('html, body').animate({scrollTop: 0}, 500);
      }
    })

    // For closing social Tab
    $('.social_popup').on('click touchstart', function (e) {
      e.stopPropagation()
    })

    $('.close-popup').click(function () {
      socialPopup.closed();
    });


    // Textarea limit counting
    $('.notify_desc .ss_rtg_dtls textarea').keyup(function () {
      var text_length = $(this).val().replace(/[#]/g, "").length;
      $(this).siblings('.txt-limit').find('span').html(text_length)
    });


  });

})(jQuery)
