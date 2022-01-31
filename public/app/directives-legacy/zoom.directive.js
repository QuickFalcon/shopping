/* global socialPopup, toastr */
'use strict';

(function() {
  angular.module('SSApp').directive('zoomIt', function zoom() {
    return {
      restrict: 'A',
      controllerAs: 'vm',
      link: function(scope) {

        scope.$watchGroup(['product.image_url','alt_images'],function () {
          if(typeof scope.product == 'undefined')return;
          var $section = $('#Qview');
          $section.find('.panzoom').panzoom({
            $zoomIn: $section.find(".icn_zoom_plus"),
            $zoomOut: $section.find(".icn_zoom_minus_gray"),
            $zoomRange: $section.find(".zoom-range"),
            $reset: $section.find(".icn_zoom_reset_gray"),
          });
        })

        scope.vm.zoomBtnActive = function () {
          scope.vm.zoomRange = $('.zoom-range').val();
        }

      }
    };
  });








}());
