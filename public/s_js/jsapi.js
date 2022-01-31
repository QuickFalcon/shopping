/* eslint-disable */
var sShoppable = sShoppable || {};
(function ($) {
    "use strict";
    var $document = $(document), $window = $(window);
    $document.ready(function () {
        // Init the function which will be allow to call function from other file
        // Start SignUp/Login
        // =========================
        var flexslider = { vars: {} },
            $body = $('body'),
            $loginPopupOverlay = $('#loginPopup');
        // var $popupModal = $loginPopupOverlay.find('.modal-content'); // Doesn't work well with angularized elements
        console.log('jsapi');
        (function loginOverlayCloseEvent() {
            function closeHandler() {
                console.log('login overlay close event');
                $loginPopupOverlay.trigger('close.login.modal');
            }
            $loginPopupOverlay.on('hidden.bs.modal', closeHandler); // https://getbootstrap.com/docs/3.3/javascript/#modals-events
        }());
        sShoppable = {
            init: function () {
                sShoppable.ssLogIn();
                sShoppable.ssSignUp();
                sShoppable.zoomInOut();
            },
            $loginPopupOverlay: $loginPopupOverlay,
            ssLogIn: function () {
                $loginPopupOverlay.find('.modal-content')
                    // .hide()
                    .addClass('hide')
                    .css({"right": "-430px"})
                    .scope().vm.resetForms();
                $('#login')
                    // .show()
                    .removeClass('hide')
                    .css({"right": "0"});
                $loginPopupOverlay.modal('show');
                $('.modal-dialog').removeClass('showVideo');
            },
            ssSignUp: function () {
                $loginPopupOverlay.find('.modal-content')
                    // .hide()
                    .addClass('hide')
                    .css({"right": "-430px"})
                    .scope().vm.resetForms();
                $('#signup1')
                    // .show()
                    .removeClass('hide')
                    .css({"right": "0"});
                $loginPopupOverlay.modal('show');
                $('.modal-dialog').removeClass('showVideo');
            },
            zoomInOut: function () {
                var sliderStage = $('#carouselStage');
                $document.on('click', '.icn_cntrl_full', function () {
                    var getSlierImage = $('.s_product_stage .slides li.flex-active-slide .img_wrap').html()
                    if ($('#Qview').hasClass('fullSactive')) {
                        $('.fullScrnPopup .img_wrap').html(getSlierImage);
                        $('#Qview').removeClass('fullSactive')
                        $('.fullScrnPopup').removeClass('fullScreen')
                        $('#Qview').addClass('InitialzSlier')
                        setTimeout(function () {
                            sliderStage.resize();
                            $('#Qview').removeClass('InitialzSlier')
                        }, 900)
                    } else {
                        $('.fullScrnPopup .img_wrap').html(getSlierImage);
                        $('.fullScrnPopup').addClass('fullScreen')
                        $('.fullScrnPopup img').removeClass('panzoom')
                        $('#Qview').addClass('fullSactive')
                        $(this).parents('.s_product_controller_wrap').find('.icn_zoom_reset_gray').parents('li').addClass('enable')
                        $('#Qview').addClass('InitialzSlier')
                        setTimeout(function () {
                            sliderStage.resize();
                            $('#Qview').removeClass('InitialzSlier')
                        }, 900)
                    }
                });
                $document.on('click', '.s_product_stage .close_btn', function () {
                    $('#Qview').removeClass('fullSactive')
                    $('.fullScrnPopup').removeClass('fullScreen')
                    $('#Qview').addClass('InitialzSlier')
                    setTimeout(function () {
                        sliderStage.resize();
                        $('#Qview').removeClass('InitialzSlier')
                    }, 900)
                });
                $document.on('click', '.icn_zoom_reset_gray', function () {
                    if ($(this).parents('li').hasClass('enable')) {
                        $('#Qview').removeClass('fullSactive')
                        $('.fullScrnPopup').removeClass('fullScreen')
                        $('#Qview').addClass('InitialzSlier')
                        setTimeout(function () {
                            sliderStage.resize();
                            $('#Qview').removeClass('InitialzSlier')
                        }, 900);
                    }
                });
                // End Zoom in zoom out,
            },
        };
        //  Single product page
        $('.product-item .rateis .white_btn').click(function () {
            var goTo = $(this).attr('href'), index = $('#review_thumb').index();
            $('html, body').animate({ scrollTop: $(goTo).offset().top }, 500);
            $('#StageNavCarousel').flexslider(index);
            $('#carouselStage').flexslider(index);
        });
        if ($('.single_product_page').length) {
            sShoppable.zoomInOut();
        }
        // Trigger login on click
        $document.on('click', '.ss_LogIn', function () {
            sShoppable.ssLogIn();
        });
        // Trigger Sign up on click
        $document.on('click', '.ss_SignUp', function () {
            sShoppable.ssSignUp();
        });

        // // Blogpost annimation -- Transferred to headerLeftComponent
        // $('.blogspot_slider').mouseenter(function () {
        //     $(this).parents('.header_left').addClass('extend')
        // })
        // $('.header_left').mouseleave(function () {
        //     $(this).removeClass('extend')
        // });

        // Navigation
        // Remove sign up/login and search from nav in desktop
        if (screen.width > 767) {
            $('.main_nav > li:first').remove();
            $('.subnav_wrap ul li.searchIn_nav').remove();
        }
        // For submenu alignment
        $('.main_nav > li').each(function () {
            var $this = $(this);
            if ($this.index() > 4) {
                $this.find('.subnav_wrap').addClass('alignright');
            }
            if (!$this.find('ul').length) {
                $this.addClass('noSubmenu');
            }
            // Remove search from desktop
        });
        // Hide Top ten sec without choosen in Desktop
        $('.main_nav .top_ten').each(function () {
            var $this = $(this);
            if ($this.find('>ul >li').length == 1) {
                $this.addClass('dsktp_hide');
            }
        });
        // Edit username
        /*var userNamePlaceHolder = $('.preview-content .edit_username input').attr('placeholder');
        $document.on('blur', '.preview-content .edit_username input', function () {
            var $this = $(this);
            //$('.preview-content .edit_username input').blur(function(){
            if ($this.val()) {
                $this.parents('.preview-content .edit_username').removeClass('showCircle');
                $this.val($this.val())
            } else {
                $this.parents('.preview-content .edit_username').addClass('showCircle');
            }
        });
        $document.on('keyup', '.preview-content .edit_username input', function () {
            $(this).parent().addClass('popUpshow');
        });
        // Need to remove from backend
        $('.preview-content .edit_username .popUp .btn').click(function (e) {
            e.preventDefault()
            $(this).parents('.preview-content .edit_username').removeClass('popUpshow');
        });*/
        // Search Filter popup
        // AddClassTo(('.left_sidebar .filterHead'),'showFilter','body');
        $('.filter_tools .close_btn').click(function () {
            $body.removeClass('showFilter');
        });
        if ($('.carousel_store1').length) {
            $('.carouselStage_title h1').hover(function () {
                $('#stageCarouselPopup').addClass('open');
            }, function () {
                if (!$('#stageCarouselPopup').is(":hover")) {
                    $('#stageCarouselPopup').removeClass('open');
                }

            });
            $('#stageCarouselPopup').mouseleave(function () {
                $(this).removeClass('open');
            });
            $('#stageCarouselPopup .close-popup').click(function () {
                $(this).parents('#stageCarouselPopup').removeClass('open');
            });
        }
        // Placeholder remove on focus
        $('input[placeholder]').on('focus', function () {
            var $this = $(this);
            $this.data('placeholder', $this.prop('placeholder')).removeAttr('placeholder');
        }).on('blur', function () {
            var $this = $(this);
            $this.prop('placeholder', $this.data('placeholder'));
        });
        // Fire event on scroll
        var scrollEnabled = true;
        $window.on('scroll', function (event) {
            if (scrollEnabled) {
                $('#flyingPopup').removeClass('showfpopUp');
                if ($window.scrollTop() > 200) {
                    $('#scrollToTop').addClass('showScrollbtn');
                } else {
                    $('#scrollToTop').removeClass('showScrollbtn');
                }
                scrollEnabled = false;
                return setTimeout((function () {
                    scrollEnabled = true;
                }), 500);
            }
        });
        // Page scroll to top
        $document.on('click touchstart', '#scrollToTop', function () {
            $('html, body').animate({scrollTop: 0}, 500);
        });
        // Shopping bag
        var savedItemVisited = false;
        var miniCartItem = $('.mini-cart-menu .cart-items');
        var miniCartMenu = $('#miniCartMenu');
        AddClassTo(('.saved_item_info'), 'showCart', 'body')
        $document.on('click', '.saved_for_later', function (e) {
            if ($body.hasClass('showCart') && !savedItemVisited) {
                miniCartItem.mCustomScrollbar('scrollTo', $('#mini-saved-items'));
                savedItemVisited = true;
            } else if ($body.hasClass('showCart') && savedItemVisited) {
                $body.removeClass('showCart');
                savedItemVisited = false;
            } else {
                $body.addClass('showCart');
                miniCartItem.mCustomScrollbar('scrollTo', $('#mini-saved-items'));
                savedItemVisited = true;
            }
        });
        $document.on('click', '.shopping_bag .seeItem', function (e) {
            var $this = $(this);
            e.preventDefault()
            var $itemWrap = $this.parents('.item-wrap').find('.child-items');
            if ($itemWrap.hasClass('open')) {
                $itemWrap.removeClass('open');
                $this.text('SEE ITEMS');
            } else {
                $itemWrap.addClass('open');
                $this.text('CLOSE');
                miniCartItem.mCustomScrollbar('scrollTo', $this.parents('.item-wrap'));
            }
        });
        PopupOnFly('#miniCartMenu ul.child-items > li > div.product-image.micro');
        // Click for remove Notification
        ShowPopUp(('.ss_mail_list li .close_btn span'), 'popUpshow', '.ss_mail_list li .close_btn');
        // Click on remove item popup
        ShowPopUp(('.decide_link .remove .cancel_btn'), 'popUpshow', '.decide_link .remove');
        //Click on place Order popup
        ShowPopUp(('.btn.placeOrder'), 'popUpshow', '.placeOrder_wrap');
        //Click on why estimated popup
        ShowPopUp(('.why_estmted'), 'popUpshow', '.estimated_dtls');
        // Coupon Code available popup
        ShowPopUp(('.p_code_avail_inner'), 'popUpshow', '.p_code_avail');
        // Sign out popup
        ShowPopUp(('.signOut'), 'popUpshow', '.signOutWrp');
        // Add class 'goTarget' to scroll required place
        //goToSection($('.goTarget'));
        $('.findCoupon').click(function (e) {
            var $this = $(this);
            var thisPromoField = $this.parents('.checkOut_box').find('.promo_code');
            thisPromoField.slideDown(300);
            thisPromoField.addClass('open');
            //$('#storeSubscribed').modal('show')
            $this.parents('.p_code_avail').removeClass('popUpshow')
            window.open('social.php#notificationBox', '_blank');
        });
        $('.p_code_avail .p_code_avail_inner').click(function (e) {
            var $this = $(this), thisPromoField = $this.parents('.checkOut_box').find('.promo_code');
            if (thisPromoField.hasClass('open')) { $this.parents('.p_code_avail').removeClass('popUpshow'); }
            thisPromoField.slideUp(300);
            thisPromoField.removeClass('open');
        });
        $document.on('click', '.subscribeCoupon', function () {
            $('#storeSubscribed').modal('show');
        });
        // Show qucik view popup to Update Item info
        $document.on('click', '.updateBtn', function () {
            if (screen.width < 1025) {
                setTimeout(function () {
                    $('#quick-popup').modal('show')
                }, 1000);
            } else {
                $('#quick-popup').modal('show');
            }
        });
        // End shopping bag
        // Account Menu dropdown
        Accordion('.profile-left .profile-menu >li a');
        // Checkout Form
        AddClassTo(('.check_out_page .form_wrap .changeBtn'), 'editField', '.form_wrap')
        // Common accordion
        Accordion('.accordion_title');
        // Search result filter accordion
        $('.full_list').hide();
        $document.on('click', '.f_accordion_title', function (e) {
            var $this = $(this),
                $parent = $this.parent(),
                thsSibling = $this.siblings('.f_accordion_content'),
                fullListHt = thsSibling.find('.full_list').height(),
                TopListHt = thsSibling.find('.top_list').height();
            e.preventDefault();
            if ($parent.hasClass('active')) {
                $parent.removeClass('active');
                thsSibling.find('.full_list').fadeOut(300);
                thsSibling.find('.top_list').fadeIn(0);
                thsSibling.css({height: fullListHt}).animate({height: TopListHt}, 300);
            } else {
                $parent.addClass('active');
                thsSibling.find('.full_list').fadeIn(0);
                thsSibling.find('.top_list').fadeOut(0);
                thsSibling.css({height: TopListHt}).animate({height: fullListHt}, 300);
            }
        });
        // Close size guide Modal over Quickveiw modal
        $document.on('click', '#closeSizeGd', function () {
            $('#size-guide-popup').modal('hide');
            setTimeout(function () {
                if ($('#quick-popup').hasClass('.in')) { $body.addClass('modal-open'); }
            }, 1000);
        });
        // Modal auto hide after certain Interval
        $(".autoHide").on('shown.bs.modal', function (e) {
            setTimeout(function () {
                $('.modal.autoHide').modal('hide');
            }, 5000)
        });
        // Start Add to bag modal
        $('.othersReltdProduct').hover(function () {
            //$(this).parents('.modal').removeClass('autoHide')
        }, function () {
            //$(this).parents('.modal').addClass('autoHide');
        });
        Accordion(('.see_detls'), 'SEE DETAILS', 'CLOSE')
        Accordion(('.country_popup_wrp .update_btn'), 'Update', 'Save')
        // Collective page
        // Open search dropdown
        $document.on('click', '.collective_search .search_box', function (e) {
            var $this = $(this);
            e.stopPropagation();
            $this.parents('.collective_search').addClass('drpdown_show');
            if (screen.width < 767) {
                $this.find('input[type="text"]').keyup(function () {
                    if ($this.val()) {
                        $this.parents('.collective_search').removeClass('drpdown_show');
                    } else {
                        $this.parents('.collective_search').addClass('drpdown_show');
                    }
                });
            }
        });
        // Mail box page
        $('.logo_list').each(function () {
            var $this = $(this), storeNo = $this.find('li').length;
            if (screen.width > 767) {
                storeNo > 5 ? $this.addClass('threeDot') : $this.removeClass('threeDot');
            } else {
                storeNo > 4 ? $this.addClass('threeDot') : $this.removeClass('threeDot');
            }
        });
        $document.on('click', '.m_accordion_title', function (e) {
            var $this = $(this), $parent = $this.parent(), logWrpHt = $('.logo_list').height() - 10;
            e.preventDefault();
            if ($parent.hasClass('active')) {
                $parent.removeClass('active');
                $this.siblings('.order_itm_info_grp').slideUp(300);
                $this.text('See details')
                $parent.find('.logo_list_wrp').animate({'height': 70}, 300)
            } else {
                $parent.addClass('active');
                $this.siblings('.order_itm_info_grp').slideDown(300);
                $this.text('Close')
                $parent.find('.logo_list_wrp').animate({'height': logWrpHt}, 300)
            }
        });
        // Code for Mobile
        //===========================================
        if (screen.width < 768) {
            // Hamburger menu
            if ($('.main_nav_wrap').length) {
                AddClassTo(('.hamburger_btn'), 'nav_open', 'body');
                Accordion(('.main_nav >li.footer_nav >a'));
                $document.on('click', '#headOverLay', function () {
                    $body.removeClass('nav_open')
                });
                $('.main_nav >li >a').click(function (e) {
                    var $this = $(this), $parent = $this.parent();
                    e.preventDefault();
                    if ($this.siblings('.subnav_wrap').length) {
                        if ($parent.hasClass('active')) {
                            $parent.removeClass('active');
                            $this.siblings('.subnav_wrap').slideUp(300);
                        } else {
                            $parent.addClass('active');
                            $this.siblings('.subnav_wrap').slideDown(300);
                        }
                    }
                });
                Accordion(('.subnav_inner >ul >li'));
            }
            // Search open
            //AddClassTo(('.header_left .mb_search'),'search_open','body');
            // Show sign up/Login popup in mobile
            if ($('.home_page').length) {
                var hasBeenTrigged = false;
                var handleScrollmb = function () {
                    if ($document.scrollTop() >= 500 && !hasBeenTrigged) {
                        $body.addClass('scrolling');
                        hasBeenTrigged = true;
                    }
                };
                $window.scroll($.throttle(handleScrollmb, 500));
            }
            $('.signIn_popup_inner .close_btn').click(function () {
                $body.removeClass('scrolling');
            });
            $('.signIn_signUp a').click(function () {
                $body.removeClass('scrolling');
            });
            // Add class to body for mobile style
            if ($('.profile-left').length) { $body.addClass('withSideMenu'); }
            if ($('.profile-content .tab_content_top .search_box').length) { $body.addClass('storeSearch'); }
        } // End code for mobile
        // Enter selected shops in selected queue in Mobile search filter
        $document.on('click', '.filter_wrap.store_bank .filter_widget label', function () {
            var k = 0, j = 0, selectedStore = '';
            var $this = $(this), $parents = $this.parents('.filter_widget'), thParentIndex = $parents.index();
            $parents.find('ul li').each(function (i) {
                j = j + 1;
                $this.addClass('' + 'id' + thParentIndex + i + '');
                if ($this.find('label').hasClass('checked')) {
                    k = k + 1;
                    //add get label associated with checkbox
                    selectedStore += '<li class="' + 'id' + thParentIndex + i + '"><input type="checkbox" checked="checked">' + '<label class="checked">' + $this.find('label').html() + '</label> </li>';
                }
            });
            var correspondingItem = $this.parents('.filter_tools').find('.filter_wrap.selected_store .filter_widget').eq(thParentIndex - 1);
            if (k != 0) {
                correspondingItem.find('.filter_title').addClass('active');
            } else {
                correspondingItem.find('.filter_title').removeClass('active');
            } 
            correspondingItem.find('.filter_list ul').html(selectedStore);
            correspondingItem.find('.filter_title span').html('[' + k + ']');
        });
        // Remove selsected item from selected list on left
        $document.on('click', '.filter_wrap.selected_store .filter_widget .filter_list label', function () {
            //$('.filter_wrap.selected_store .filter_widget .filter_list label').click(function() {
            var $this = $(this), thisClass = $this.parent('li').attr('class');
            checkbxUnchecked($('.filter_wrap.store_bank .filter_widget li.' + thisClass + ' label'));
            $this.parents('.filter_list').find('li').length == 1 ? $this.parents('.filter_list').siblings('.filter_title').removeClass('active') : '';
            $this.parent().remove();
            k = k - 1;
            correspondingItem.find('.filter_title span').html('[' + k + ']');
        });
        // Copy by clicking a button (To execute this add attribute in HTML)
        document.body.addEventListener('click', copy, true);
        // event handler
        function copy(e) {
            // find target element
            var t = e.target,
                c = t.dataset.copytarget,
                inp = (c ? document.querySelector(c) : null);
            // is element selectable?
            if (inp && inp.select) {
                // select text
                inp.select();
                try {
                    // copy text
                    $(t).text('Copied')
                    setTimeout(function () {
                        $(t).text('Click to copy');
                    }, 5000);
                    document.execCommand('copy');
                    document.select();
                    inp.blur();
                } catch (err) {
                    if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
                        alert('Press ctrl+c to copy the link');
                    }
                }
            }
        }//End copy
        // Hac for iOS iPhone/ipad to protect zoom on clicking form field
        var $objHead = $('head');
        var zoomDisable = function () {
            $objHead.find('meta[name=viewport]').remove();
            $objHead.prepend('<meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1, user-scalable=no"/>');
        };
        var zoomEnable = function () {
            $objHead.find('meta[name=viewport]').remove();
            $objHead.prepend('<meta name="viewport" content="width=device-width, initial-scale=1">');
        };
        if (navigator.userAgent.length && /iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            $("input, textarea, select")
                .on({
                    'touchstart': function () {
                        zoomDisable();
                    }
                })
                .on({
                    'touchend': function () {
                        setTimeout(zoomEnable, 500);
                    }
                });
        } // End iOS zoom hac
    }); // End ready function.
    // Make image large on hover function
    function PopupOnFly(elm) {
        var flyPopUp = $('#flyingPopup').detach(),
            fpopUpTop,
            fpopUpLeft,
            fpopUpWth,
            fpopUpHt,
            target,
            $target;
        flyPopUp.on('click', 'div.product-image a.quick-product', function (e) {
            e.preventDefault();
            e.stopPropagation();
            // console.log($target[0].outerHTML);
            // console.log($target.find('a.quick-product')[0]);
            $target.find('> .p_image_innner a.quick-product').trigger('click');
        });
        $document.on('mouseenter', elm, function (e) {
            console.log('mouseenter document');
            var $this = $(this), offset = $this.offset(), anchor, outerHTML = $.data(this, 'outerHTML');
            // console.log(this);
            e.stopPropagation();
            if (!outerHTML) {
                outerHTML = this.outerHTML;
                $.data(this, 'outerHTML', outerHTML);
            }
            $target = $this;
            // console.log(this);
            if (target !== this) {
                target = this;
                // appending new elements or content on an element (with css transitions) while on ->
                // mouseenter will trigger the event multiple times, preventing mouseleave to trigger, ->
                // hence the target guard conditional (possible bug on chrome)
                flyPopUp.html(outerHTML);
                $this.append(flyPopUp);
            }
            fpopUpTop = offset.top - $window.scrollTop();
            fpopUpLeft = offset.left;
            fpopUpWth = $this.width();
            fpopUpHt = $this.height();
            flyPopUp
                .addClass('showfpopUp')
                .css({'left': fpopUpLeft, 'top': fpopUpTop, 'width': fpopUpWth, 'height': fpopUpHt})
                .stop()
                .animate({
                    'left': fpopUpLeft - fpopUpWth,
                    'top': fpopUpTop - fpopUpHt,
                    'width': fpopUpWth * 3,
                    'height': fpopUpHt * 3
                }, 0);
            anchor = flyPopUp.find('a.quick-product')[0];
            anchor.removeAttribute('data-toggle');
            anchor.removeAttribute('data-target');
            anchor.removeAttribute('ng-click');
            $('#fakeOverlay').show();
            // flyPopUp
                // .find('>div>div')
                // .css({ 'width': fpopUpWth, 'height': fpopUpHt })
                // .animate({ 'width': fpopUpWth * 3, 'height': fpopUpHt * 3}, 0);
        });
        $document.on('mouseleave', elm, function (e) {
            console.log('mouseleave document');
            flyPopUp.removeClass('showfpopUp').css({
                'left': fpopUpLeft,
                'top': fpopUpTop,
                'width': fpopUpWth,
                'height': fpopUpHt
            });
        });
        $('#headOverLay').on('mouseenter', function () {
            flyPopUp.removeClass('showfpopUp');
        });
        $('#fakeOverlay').mouseenter(function () {
            flyPopUp.removeClass('showfpopUp');
            $('#fakeOverlay').hide();
        });
    }
    // Add class function
    var executeOnce = false; // To stop double click
    function AddClassTo(elm, className, addTo) {
        $document.on('click touchstart', elm, function (e) {
            var $this = $(this), $parents = $this.parents(addTo);
            e.stopPropagation();
            if (!executeOnce) {
                executeOnce = true;
                if ($parents.hasClass(className)) {
                    $parents.removeClass(className);
                    if ($this.is('.changeBtn')) { $this.text('Update'); }
                } else {
                    $parents.addClass(className);
                    if ($this.is('.changeBtn')) { $this.text('Save'); }
                }
                setTimeout(function () {
                    executeOnce = false;
                }, 900);
            }
        });
    }
    // Show popup function
    function ShowPopUp(elm, className, addTo) {
        $document.on('click touchstart', elm, function (e) {
            console.log('click')
            e.stopPropagation();
            //e.preventDefault();
            $(this).parents(addTo).addClass(className);
            $(elm).not(this).parents(addTo).removeClass(className);
        });
        $document.on('click touchstart', '.popUp', function (e) {
            e.stopPropagation();
        });
        $document.on('click touchstart', function () {
            $(addTo).removeClass(className);
        });
    }
    // Accordion function
    function Accordion(elm, deflt, change) {
        $document.on('click', elm, function (e) {
            var $this = $(this), $parent = $this.parent(), $siblings = $this.siblings();
            e.preventDefault();
            console.log('hhhhhhh');
            if ($siblings.length) {
                if ($parent.hasClass('active')) {
                    $parent.removeClass('active');
                    $siblings.slideUp(300);
                    $this.text(deflt);
                } else {
                    $parent.addClass('active');
                    $siblings.slideDown(300);
                    $this.text(change);
                }
            }
        });
        // Add arrow only if have submenu
        $(elm).each(function () {
            var $this = $(this);
            if ($this.siblings().length && $this.parents('.main_nav').length) { $this.addClass('hasSubMenu'); }
        });
    }
    // // Are you familiar to IIFE ( http://bit.ly/iifewdb ) ?
    function FbButtonLoad() {
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }
    $window.load(function () {
        $('#ssVideo').attr('src', 'https://www.youtube.com/embed/sUbbXUmlfvE');
        FbButtonLoad();
        console.log('youtube loaded');
    });
})(jQuery);