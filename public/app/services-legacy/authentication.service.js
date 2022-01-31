'use strict';

(function () {
  angular
    .module('SSApp')
    .factory('Authentication', Authentication);

  Authentication.$inject = ['$window'];

  function Authentication($window) {
    var auth = {
      user: $window.user
    };


    return auth;
  }
}());
