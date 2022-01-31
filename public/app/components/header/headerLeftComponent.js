var headerLeftComponentModule = angular.module('headerLeftComponentModule', ['blogServiceModule', 'sliderDirectiveModule']);

headerLeftComponentModule.component('headerLeftComponent', {

  templateUrl: 'app/components/header/headerLeftView.html',
  bindings: {

  },
  controller: ['$scope', '$element', '$attrs', 'blogService', function($scope, $element, $attrs, blogService){

    var ctrl = this;
    ctrl.blogs = [];

    // LIFECYCLE HOOKS
    ctrl.$postLink = function(){
      ctrl.getBlogs();
      ctrl.sliderHoverAction();

    }

    // CONTROLLER FUNCTIONS
    ctrl.sliderHoverAction = function(){
      var headerLeftContainer = $element.children(':first'); //get the first child of the component wc is the container
      var blogSlider = $element.find('.blogspot_slider');

      blogSlider.hover(function(){
        headerLeftContainer.addClass('extend');
      }, function(){
        headerLeftContainer.removeClass('extend');
      });
    };

    // get blogs
    ctrl.getBlogs = function(){

      var blogDataPormise = blogService.getBlogs();
      blogDataPormise.then(function(response){
        ctrl.blogs = response.data;
      }, function(response){
        console.log('failed to get the blogs for the header');
      });
    };

  }]
});
