/* global socialPopup, toastr, sShoppable, FB, CSPhotoSelector */
'use strict';

(function() {
  angular.module('SSApp').directive('photoUpload', ['$timeout', 'Upload', 'toastr', 'UserService', '$http', photoUploadDirective]);

  function photoUploadDirective($timeout, Upload, toastr, User, $http) {
    return {
      restrict: 'E',
      // require: 'ngModel',
      templateUrl: 'partials/social/photoUpload.html',
      controllerAs: 'vm',
      scope: {
        type: '@',
        changed: '&',
        catalogId: '=?',
        allow: '=?'
      },
      link: function(scope, elem) {
        var vm = scope.vm = {};

        vm.allow = scope.allow || ['upload', 'facebook'];

        // api fns
        vm.getFromLibrary = getFromLibrary;
        vm.getFacebookPhoto = getFacebookPhoto;
        vm.uploadPhoto = uploadPhoto;
        vm.isTypeAllowed = isTypeAllowed;

        // fns
        function getFromLibrary() {
          // need to protect this clicks
     
          $timeout(function() {
            elem.find('.uploadPhotoInput').click();
          });
        }

        function uploadPhoto(file, invalidFiles) {
          if (!file && invalidFiles) { toastr.error('The file you tried to upload is not valid.'); }
          if (!file) { return; }

          Upload.upload({
            url: _generateUrl(),
            data: {
              image: file
            }
          }).then(_updatePhoto, function (response) {
            toastr.error(response.data, 'There was a problem with your photo');
          });
        }

        function getFacebookPhoto() {
          function statusChangeCallback(response) {
            if (response.status === 'connected') {
              getPhoto();
            } else {
              FB.login(function() {
                FB.getLoginStatus(statusChangeCallback);
              });
            }
          }

          function getPhoto() {
            FB.api('/me/picture?type=large', function(res) {
              $http({
                method: 'GET',
                url: _generateUrl(),
                params: { url: res.data.url }
              })
                .then(_updatePhoto, function (response) {
                  toastr.error(response.data, 'There was a problem with your photo');
                });
            });
          }

          FB.getLoginStatus(statusChangeCallback);
        }

        function isTypeAllowed(type) {
          return vm.allow.indexOf(type) !== -1;
        }

        function _updatePhoto(response) {
          scope.changed({ photo: response.data || response });
          // ngModel.$setViewValue(response.img || response.data.img);
          // ngModel.$render();
          // // need to protect this clicks
          // $timeout(function() {
          //   angular.element('body').click();
          // });
          // toastr.success('Photo updated');
        }

        function _generateUrl() {
          var uploadUrl = '/upload/';
          if (scope.catalogId) {
            uploadUrl += scope.catalogId + '/';
          }
          uploadUrl += scope.type;

          return uploadUrl;
        }
      }
    };
  }
}());
