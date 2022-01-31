'use strict';

(function () {
    var ssApp = angular.module('SSApp');
    var flexslider = {vars: {}};

    // Directive for tab
    ssApp.directive('ssTab', function () {
        return {
            restrict: 'A',
            controllerAs: 'ss',
            link: function (scope) {
                var ss = scope.ss = {
                    activeTab: 1
                };
                // api
                ss.changeTab = changeTab;

                function changeTab(tab) {
                    ss.activeTab = tab;
                }
            }
        };
    });

// scroll directive
    /* ssApp.directive('mcustomScroll', function ($log) {
     return {
     restrict: 'A',
     scope: {
     config: '&mcustomScroll'
     },
     link: function postLink(scope, iElement, iAttrs, controller, transcludeFn) {
     var config = scope.config();
     //$log.debug('config: ', config);
     // create scroll elemnt
     var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
     var ua = window.navigator.userAgent;
     var msie = ua.indexOf("MSIE ");
     if(screen.width > 768 && (isFirefox || msie > 0)){
     iElement.mCustomScrollbar({
     autoHideScrollbar: config.autoHide,
     theme: config.theme,
     advanced: {
     updateOnImageLoad: true
     },
     scrollButtons: {
     enable: true
     }

     /!*callbacks: {
     whileScrolling: function () {
     if ($('.tab_content_wrap .product-info.showSharePopup,.right_sidebar .product-info.showSharePopup').length) {
     socialPopup.closed();
     }
     if (screen.width < 1025) {
     $('.shared_icons').parents('.mCustomScrollBox').addClass('scrolling');
     }
     },
     onScroll: function () {
     setTimeout(function () {
     if (screen.width < 1025) {
     $('.shared_icons').parents('.mCustomScrollBox').removeClass('scrolling');
     }
     }, 1000);
     }
     }*!/

     });
     // the live options object
     //var mObject = elem.data('mCS');
     //$log.debug('elem: ', mObject.opt);
     }
     }
     };
     }); */


    // Slider directive

    ssApp.directive('blogSlider', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, iElement) {
                scope.$watch('bloginfo', function () {
                    if (scope.bloginfo.length) {
                        $timeout(function () {
                            iElement.flexslider({
                                selector: '.blogSlides >li',
                                animation: 'slide',
                                controlNav: false,
                                directionNav: false,
                                slideshow: true,
                                slideshowSpeed: 3000,
                                useCSS: false
                            });
                        }, 600);
                    }
                });
            }
        };
    });


    // Stage slider
    ssApp.directive('stageSlider', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, iElement) {
                var stageNavUL = $('#StageNavCarousel .stage_nav');
                scope.$watchGroup(['sliderlist', 'alt_images'], function () {
                    if (typeof scope.alt_images !== 'undefined') {
                        console.log(iElement);
                        iElement.removeData('flexslider');
                        console.log('removed flexslider');
                    } else {
                        console.log('alt_images is empty');
                    }
                    if (typeof scope.sliderlist !== 'undefined') {
                        $timeout(function () {
                            var spCarouselStageData = $('#spCarouselStage').html();
                            // console.log(spCarouselStageData);
                            // console.log(iElement);
                            iElement.removeData('flexslider');
                            // $('#carouselStage').html(spCarouselStageData);
                            iElement.html(spCarouselStageData);
                            iElement.flexslider({
                                sync: '#StageNavCarousel',
                                animation: 'slide',
                                controlNav: false,
                                slideshow: false,
                                useCSS: false,
                                start: function(slider){
                                    iElement.removeClass('sliderLoading');
                                },
                                after: function () {
                                    if (stageNavUL.find('>li:first.flex-active-slide').length) stageNavUL.css('margin-left', '0');
                                }
                            });
                        }, 250);
                    } else {
                        console.log('sliderlist is empty');
                    }
                });
            }
        };
    });



    // Stage slider
    ssApp.directive('storeSlider', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, iElement) {
                scope.$watchGroup(['currentstore'], function () {
                    if (typeof scope.currentstore !== 'undefined') {
                        $timeout(function () {
                            iElement.flexslider({
                                sync: '#StageNavCarousel',
                                animation: 'slide',
                                controlNav: false,
                                slideshow: false,
                                useCSS: false,
                                start: function(slider){
                                    iElement.removeClass('sliderLoading');
                                }
                            });
                        }, 250);
                    }
                });
            }
        };
    });



    // Single product slider
    ssApp.directive('adoptSlider', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, iElement) {
                var stageNavUL = $('#StageNavCarousel .stage_nav');
                scope.$watchGroup(['product.merged_images'], function () {
                    //var adoptSldrData = $('#adoptSliderData').html();
                    //if (typeof scope.product.merged_images !== 'undefined') iElement.removeData('flexslider');
                    //$('.adoptSlider').html(adoptSldrData);
                    if (typeof scope.product.merged_images !== 'undefined') {
                        $timeout(function () {
                            //var adoptSldrData = $('#adoptSliderData').html();
                            //$('.adoptSlider').html(adoptSldrData);
                            iElement.flexslider({
                                sync: '#StageNavCarousel',
                                animation: 'slide',
                                controlNav: false,
                                slideshow: false,
                                useCSS: false,
                                before: function () {
                                    $('#Qview').removeClass('InitialzSlier');
                                },
                                after: function () {
                                    $('.s_product_stage .slides li.flex-active-slide video').length ? $('.icn_cntrl_media').removeClass('disable') : $('.icn_cntrl_media').addClass('disable');
                                    if (stageNavUL.find('>li:first.flex-active-slide').length) stageNavUL.css('margin-left', '0');
                                }
                            });
                        }, 600);
                    }
                });
            }
        };
    });



    ssApp.directive('thumbSlider', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, iElement) {
                // function to add breakpoints
                function getGridSize() {
                    return $('.home_page').length ? 4 : 3;
                }

                scope.$watch('sliderlist', function () {
                    if (typeof scope.sliderlist !== 'undefined') {
                        $timeout(function () {
                            var spStageNavCarouselData = $('#spStageNavCarousel').html();
                            iElement.removeData('flexslider');
                            $('#StageNavCarousel').html(spStageNavCarouselData);

                            iElement.flexslider({
                                asNavFor: '#carouselStage',
                                selector: '.stage_nav >li',
                                animation: 'slide',
                                controlNav: false,
                                animationSpeed: 400,
                                animationLoop: false,
                                slideshow: false,
                                useCSS: false,
                                itemWidth: 222,
                                itemMargin: 10,
                                minItems: getGridSize(),
                                maxItems: getGridSize()
                            });
                        }, 1000);

                    }
                })
                // check grid size on resize event
                $(window).resize(function () {
                    var gridSize = getGridSize();
                    flexslider.vars.minItems = gridSize;
                    flexslider.vars.maxItems = gridSize;
                });
            }
        };
    });

    ssApp.directive('thumbSliderstore', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, iElement) {
                // function to add breakpoints
                function getGridSizePr() {
                    return ($('.carousel_st_product2').width() < 300) ? 3 :
                        ($('.carousel_st_product2').width() < 450) ? 4 : 5;
                }

                scope.$watch('similiaritems.length', function () {
                    if (typeof scope.similiaritems !== 'undefined') {
                        $timeout(function () {
                            iElement.flexslider({
                                selector: '.stage_nav >li',
                                animation: 'slide',
                                controlNav: false,
                                animationSpeed: 400,
                                animationLoop: false,
                                slideshow: false,
                                useCSS: false,
                                itemWidth: 87,
                                itemMargin: 16,
                                minItems: getGridSizePr(),
                                maxItems: getGridSizePr()
                            });
                        }, 1000);
                        // check grid size on resize event
                        $(window).resize(function () {
                            var gridSize = getGridSizePr();
                            flexslider.vars.minItems = gridSize;
                            flexslider.vars.maxItems = gridSize;
                        });

                    }
                })

            }
        };
    });

    ssApp.directive('thumbSliderdetails', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, iElement) {
                scope.$watchGroup(['product.image_url', 'alt_images'], function () {
                    var spThumbSliderData = $('#spThumbSlider').html();
                    iElement.removeData('flexslider');
                    $('#StageNavCarousel').html(spThumbSliderData);
                    $timeout(function () {
                        iElement.flexslider({
                            asNavFor: '#carouselStage',
                            selector: '.stage_nav >li',
                            animation: 'slide',
                            controlNav: false,
                            animationSpeed: 400,
                            animationLoop: false,
                            slideshow: false,
                            useCSS: false,
                            itemWidth: 78,
                            itemMargin: 16
                        });
                    }, 500)
                    // }
                });
            }
        };
    });

    ssApp.directive('minithumbSlider', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, iElement) {
                // function to add breakpoints
                function getGridSizesmThmb() {
                    return ($('.mini_thumb_slider').width() < 350) ? 3 : 4;
                }

                scope.$watchGroup(['recentItemsx', 'similiaritems'], function () {
                    if (typeof scope.recentItemsx !== 'undefined') {
                        $timeout(function () {
                            iElement.flexslider({
                                selector: '.stage_nav >li',
                                animation: 'slide',
                                controlNav: false,
                                animationSpeed: 400,
                                animationLoop: false,
                                slideshow: false,
                                useCSS: false,
                                itemWidth: 87,
                                itemMargin: 16,
                                minItems: getGridSizesmThmb(),
                                maxItems: getGridSizesmThmb()
                            });
                        }, 1000);
                    }
                })
                // check grid size on resize event
                $(window).resize(function () {
                    var gridSize = getGridSizesmThmb();
                    flexslider.vars.minItems = gridSize;
                    flexslider.vars.maxItems = gridSize;
                });
            }
        };
    });
    // Quick view slider
    ssApp.directive('quickviewSlider', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, iElement) {
                scope.$watch('current_product.alt_images', function () {
                    if (typeof scope.current_product.alt_images !== 'undefined') {
                        $timeout(function () {
                            iElement.flexslider({
                                selector: '.q_slide >li',
                                sync: '#quickThumbNav',
                                animation: 'slide',
                                controlNav: false,
                                slideshow: false,
                                useCSS: false
                            });
                        }, 1000);
                    }
                });
            }
        };
    });

    ssApp.directive('quickviewSlidernav', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, iElement) {
                scope.$watch('current_product.alt_images', function () {
                    if (typeof scope.current_product.alt_images !== 'undefined') {
                        $timeout(function () {
                            iElement.flexslider({
                                asNavFor: '.quick-carousel',
                                selector: '.quick_nav >li',
                                // sync: "#quickThumb",
                                animation: 'slide',
                                controlNav: false,
                                animationSpeed: 400,
                                animationLoop: false,
                                slideshow: false,
                                useCSS: false,
                                itemWidth: 222,
                                itemMargin: 10,
                                direction: 'vertical',
                                minItems: 3,
                                maxItems: 3
                            });
                        }, 1000);
                    }
                });
                $('body').on('hidden.bs.modal', '.modal', function () {
                    $(this).removeData('bs.modal');
                    scope.current_product.alt_images = undefined;
                });
            }
        };
    });

    // Related products slider
    ssApp.directive('relatedprSlider', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, iElement) {
                // function to add breakpoints
                function getGridSizeOthrsPr() {
                    return ($('.othersReltdProduct').width() < 350) ? 2 : 3;
                }

                scope.$watch('cartpopupsimiliaritems.length', function () {
                    if (typeof scope.cartpopupsimiliaritems !== 'undefined') {
                        scope.hideafterLoad = false;
                        // console.log('Enable modal' + scope.cartpopupsimiliaritems.length)
                        iElement.removeData('flexslider');
                        $timeout(function () {
                            iElement.flexslider({
                                selector: '.slides >li',
                                animation: 'slide',
                                controlNav: false,
                                animationSpeed: 400,
                                animationLoop: false,
                                slideshow: false,
                                useCSS: false,
                                itemWidth: 136,
                                itemMargin: 10,
                                minItems: getGridSizeOthrsPr(),
                                maxItems: getGridSizeOthrsPr(),
                                start: function () {
                                    scope.hideafterLoad = true;
                                    // console.log('Disable modal')
                                }
                            });
                        }, 2000);
                    }
                });
                // check grid size on resize event
                $(window).resize(function () {
                    var gridSize = getGridSizeOthrsPr();
                    flexslider.vars.minItems = gridSize;
                    flexslider.vars.maxItems = gridSize;
                });
            }
        };
    });

    // Class toggle with element (one click class add and next click removed)
    // add in html like >>  ng-class="{'className': fnName}" ng-click="fnName = !fnName"
    /* ssApp.directive('toggleCls', function() {
     return {scope: true};
     }); */

})();
