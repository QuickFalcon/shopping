'use strict';

(function( window, $, undefined ) {

    var $productsGrid = $('.products-grid');
    if($('.collective_page').length){
        $productsGrid.masonry({
            itemSelector: '.products-grid__item',
            columnWidth: 170,
            gutter: 27
        });
    }

    if($('.single_product_page').length){
        $productsGrid.masonry({
            itemSelector: '.products-grid__item',
            columnWidth: 160,
            gutter: 24
        });
    }

    $productsGrid.imagesLoaded().progress( function() {
        $productsGrid.masonry('layout');
    });

    // slider
    /*var $richRelevantSlidrs = $('.rich-relevant__slider');
    $richRelevantSlidrs.each(function() {
        var $this = $(this);

        $this.bxSlider({
            minSlides: 2,
            maxSlides: 4,
            moveSlides: 1,
            slideWidth: 99,
            infiniteLoop: false,
            hideControlOnEnd: true,
            pager: false
        });
    });*/

})( window, jQuery );