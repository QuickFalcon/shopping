angular.module('SSApp').directive('headerRightComponent', ['$timeout', function($timeout){
    return {
        restrict: 'E',
        templateUrl: '/assets/directive/components/header/headerRightView.html',
        link: function (scope, element, attrs) {
            $timeout(function () {
                $('ul.flag_list li').click(function(e){ 
                    var selectedFlag = $(this).attr("class");
                    var currentFlag = $('#id_flag').attr("class");
                    $('#id_flag').removeClass(currentFlag);
                    $('#id_flag').addClass('s_flag');
                    scope.flag = selectedFlag;
                    switch(selectedFlag){
                        case 'flag_au':
                            scope.currency = '$ AUD';
                        break;
                        case 'flag_ca':
                            scope.currency = 'C$ CAD'
                        break;
                        case 'flag_de':
                            scope.currency = '€ EUR';
                        break;
                        case 'flag_eu':
                            scope.currency = '€ EUR';
                        break;
                        case 'flag_fr':
                            scope.currency = '€ EUR';
                        break;
                        case 'flag_jp':
                            scope.currency = '¥ JPY';
                        break;
                        case 'flag_nz':
                            scope.currency = '$ NZD';
                        break;
                        case 'flag_uk':
                            scope.currency = '£ GBP';
                        break;
                        case 'flag_us':
                            scope.currency = '$ USD';
                        break;
                    }
                });
            }, 0,false);
            jQuery(document).ready(function ($) {
                var $body = $('body');
                $('#headOverLay').on('click', function () {
                    $body.removeClass('showCart');
                });
            });
        }
    };
}]);