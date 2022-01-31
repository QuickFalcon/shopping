'use strict';

(function( window, $, undefined ) {


	var $productsGrid = $('.products-grid');
	$productsGrid.masonry({
		itemSelector: '.products-grid__item',
		//columnWidth: 170,
		gutter: 25
	});


	$productsGrid.imagesLoaded().progress( function() {
		$productsGrid.masonry('layout');
	});



})( window, jQuery );