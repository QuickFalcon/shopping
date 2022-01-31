angular.module('SSApp').directive('navigationComponent', ['$timeout','$location','$route',function ($timeout,$location,$route){
    return {
        restrict: 'E',
        templateUrl: 'assets/directive/components/navigation/navigationView.html',
        link: function (scope) {
            var $document = jQuery(document),
                $parent_li = $('.main_nav > li.choose_cat'),
                $anchor = $parent_li.find('a.encircle-red'),
                original_anchor_text = $anchor.text();
            // Other category in main menu
            var otherInput = $('.main_nav > li.choose_cat .choose_cat_form input'), updateName = $parent_li.find('div.popUp div.btn.update_name');
            var otherPlaceHolder = otherInput.attr('placeholder');
            updateName.on('click touchstart', function (event) {
                event.stopPropagation();
            });
            function confirm(event) {
                // console.log(event.type);
                switch (event.type) {
                case 'keydown':
                    // console.log(event.which);
                    if (event.which !== 13) {
                        break;
                    }
                    /* falls through */
                case 'click':
                    /* falls through */
                case 'touchstart':
                    if (otherInput.val()) {
                        // $parent_li.removeClass('hideSubmenu');
                        $anchor.text(otherInput.val()).attr('data-hover', otherInput.val());
                    } else {
                        $anchor.text(otherPlaceHolder).attr('data-hover', otherPlaceHolder);
                        // $parent_li.addClass('hideSubmenu');
                        $('.main_nav >li.choose_cat .subnav_wrap').slideUp(300);
                        $anchor.removeClass('active')
                    }
                    $parent_li.removeClass('hideSubmenu').removeClass('editThis');
                    otherInput.off('keydown', confirm);
                    updateName.off('click touchstart', confirm);
                    $document.off('click touchstart', confirm);
                    break;
                }
            }
            if (screen.width > 1024) {
                (function () {
                    var clicks = 0,
                        timer_id = -1,
                        is_timer_set = false;
                    function resetClicks() {
                        clicks = 0;
                        is_timer_set = false;
                        console.log('RESET CLICKS');
                    }
                    console.log($('.main_nav > li.choose_cat'));
                    $parent_li.on('click', 'a.encircle-red', function (e) {
                        clicks += 1;
                        if (clicks >= 2) {
                            e.stopPropagation();
                            console.log('double click');
                            // otherInput.focus();
                            $parent_li.addClass('hideSubmenu').toggleClass('editThis');
                            // setTimeout(function () {
                                // otherInput.trigger('focus');
                                // otherInput[0].select();
                            // }, 100);
                            requestAnimationFrame(function () {
                                requestAnimationFrame(function () {
                                    otherInput.trigger('focus');
                                    otherInput[0].select();
                                });
                            });
                            otherInput.on('keydown', confirm);
                            updateName.on('click touchstart', confirm);
                            $document.on('click touchstart', confirm);
                            clicks = 0;
                            if (is_timer_set) {
                                clearTimeout(timer_id);
                                is_timer_set = false;
                            }
                        } else {
                            if (!is_timer_set) {
                                timer_id = setTimeout(resetClicks, 250);
                                is_timer_set = true;
                            }
                            scope.menuCategorySearchApi('others');
                        }
                    });
                }());
                // $('.main_nav > li.choose_cat').on('dblclick', function (e) {
                    // console.log('double click');
                    // e.stopPropagation();
                    // otherInput.focus();
                    // $(this).toggleClass('editThis');
                // });
            } else {
                $parent_li.on('touchstart', function (e) {
                    var pressTimer, $this = $(this);
                    e.stopPropagation();
                    if (!$('#customizeCat').val()) { $this.addClass('editThis'); }
                    pressTimer = window.setTimeout(function () {
                        $this.addClass('editThis');
                    }, 1000);
                }).on('touchend', function () {
                    clearTimeout(pressTimer);
                });
                $('.main_nav >li.choose_cat.hideSubmenu .popUp .btn').on('touchstart', function (e) {
                    $('#customizeCat').val($('#editingCat').val());
                });
            }
            otherInput.on('click touchstart', function (e) {
                e.stopPropagation();
            });
            /////////////////////////////////////////////////
            $timeout(function () {
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
                }
            }, 0, false);
        },
    };
}]);