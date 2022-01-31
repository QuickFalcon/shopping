'use strict';

(function(window, $, undefined) {

    window.PhotoController = function() {
        var that = this;
        var $el = null;
        var this_data = {};
        var $img = null;
        var $review_link = null;

        this.init = function(data) {
            this_data = $.extend(true, this_data, data);
        };

        var clone = function($tmp) {
            $el = $tmp.clone();
            $img = $el.find('.product-item__image img');
            $review_link = $el.find('.review-link');
        };

        this.render = function($tmp) {
            clone($tmp);
            $img.prop('src', this_data.PhotoUrl);
            $review_link.prop('href', this_data.ReviewUrl)
            return $el;
        };

    };

    window.PhotoListController = function() {
        var that = this;
        var $loadingEl = null;
        var $gridEl = null;
        var $photo_template = null;
        var photoAjaxUrl = '';
        var isLoading = false;

        this.init = function($list, $loading, $photoTmp, getPhotosUrl) {
            $loadingEl = $loading;
            $gridEl = $list;
            $photo_template = $photoTmp;
            photoAjaxUrl = getPhotosUrl;

            bindEvent();

            return this;
        };

        this.getData = function() {
            console.log('Start Load');

            isLoading = true;
            $loadingEl.addClass('loading');

            // FAKE TIME
            setTimeout(callAjaxGetPhoto, 2000);

            /* //- USE THIS FOR RELEASE
            callAjaxGetPhoto();
            */

        };

        var callAjaxGetPhoto = function() {
            $.ajax({
                method: 'POST',
                url: photoAjaxUrl,
                dataType: 'text json',
                contentType: 'application/json; charset=utf-8',
                success: function(response) {

                    if (response && response.status == 'success') {
                        $loadingEl.removeClass('loading');

                        var newData = response.data;
                        renderMoreItems(newData);
                    } else {
                        return false;
                    }

                    isLoading = false;

                    console.log('End Load');
                },
                error: function(xhr) {
                    console.log(xhr);
                }
            });
        };

        var renderMoreItems = function(dataList) {
            var dataLength = dataList.length;

            var i = 0;

            renderOneItem(dataList, i, dataLength);
        };

        var renderOneItem = function (dataList, i, max) {
            var photoControl = new PhotoController();
            photoControl.init(dataList[i]);
            var $item = photoControl.render($photo_template);

            $item.imagesLoaded().done( function() {
                $gridEl
                    .append($item)
                    .masonry('appended', $item)
                    .masonry();
            });

            if (i < max-1) {
                renderOneItem(dataList, ++i, max);
            }
        };

        var bindEvent = function() {

            $(window).scroll(function() {
                var scrollY = $(window).scrollTop();
                var detectShowMorePos = $loadingEl.offset().top + $loadingEl.height();
                var windowHeight = $(window).height();

                if (detectShowMorePos <= scrollY + windowHeight && !isLoading) {
                    that.getData();
                }
            });

        };

    };

    var photoListControl = new PhotoListController();
    photoListControl.init($('.products-grid'), $('.button-loading'), $('.photo-template .products-grid__item'), dataUrl);

})(window, jQuery);
