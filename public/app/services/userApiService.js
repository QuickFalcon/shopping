// THIS MODULE IS COPIED FROM THE OLD CODE, CONSIDER REFACTORING FURTHER\

var userServiceModule = angular.module('userApiServiceModule', ['ngResource', 'toastr']);

userServiceModule.factory('userApiService', ['$resource', '$window', '$interval', 'toastr', function($resource, $window, $interval, toastr){
  var Users = $resource('/api/users', {}, {
    update: {
      method: 'PUT'
    },
    updatePassword: {
      method: 'POST',
      url: '/api/users/password'
    },
    deleteProvider: {
      method: 'DELETE',
      url: '/api/users/accounts',
      params: {
        provider: '@provider'
      }
    },
    sendPasswordResetToken: {
      method: 'POST',
      url: '/api/auth/forgot'
    },
    resetPasswordWithToken: {
      method: 'POST',
      url: '/api/auth/reset/:token'
    },
    cancelResetPasswordWithToken: {
      method: 'POST',
      url: '/api/auth/reset/:token/cancel'
    },
    emailexist: {
      method: 'POST',
      url: '/api/auth/useremail'
    },
    signup: {
      method: 'POST',
      url: '/api/auth/signup'
    },
    signin: {
      method: 'POST',
      url: '/api/auth/signin'
    },
    checkSocialLogin: {
      method: 'GET',
      url: '/api/checkLogin/:type'
    }
  });

  var callback = null,
      popup = null,
      sendMessage = null;

  // wait for a postMessage from popup
  $window.addEventListener('message', function(ev) {
    if (ev.data.message === 'deliverResult') {
      // close popup
      ev.source.close();
      // cancel any listener
      $interval.cancel(sendMessage);
      callback(ev.data.error || ev.data.result);
    }
  });

  angular.extend(Users, {
    changePassword: function (passwordDetails) {
      return this.updatePassword(passwordDetails).$promise;
    },
    removeSocialAccount: function (provider) {
      return this.deleteProvider({
        provider: provider // api expects provider as a querystring parameter
      }).$promise;
    },
    requestPasswordReset: function (credentials) {
      return this.sendPasswordResetToken(credentials).$promise;
    },
    resetPassword: function (token, passwordDetails) {
      return this.resetPasswordWithToken({
        token: token // api expects token as a parameter (i.e. /:token)
      }, passwordDetails).$promise;
    },
    cancelResetPassword: function (token) {
      return this.cancelResetPasswordWithToken({
        token: token // api expects token as a parameter (i.e. /:token)
      }, {}).$promise;
    },
    userEmailexist: function (credentials) {
      return this.emailexist(credentials).$promise;
    },
    userSignup: function (credentials) {
      return this.signup(credentials).$promise;
    },
    userSignin: function (credentials) {             // f0r sign in
      return this.signin(credentials).$promise;		// sign in function
    },
    checkLogin: function (type) {
      return this.checkSocialLogin({ type: type }).$promise;
    },
    facebookConnect: function (cb) {
      _socialConnect('/api/auth/facebook', 'Facebook Login', cb);
    },
    instagramConnect: function (cb) {
      _socialConnect('/api/auth/instagram', 'Instagram Login', cb);
    },
    twitterConnect: function (cb) {
      _socialConnect('/api/auth/twitter', 'Twitter Login', cb);
    }
  });

  // open popup to connect to social networks
  function _socialConnect(url, title, cb) {
    callback = cb;

    // remove any trace of old connections
    $interval.cancel(sendMessage);
    if (popup) {
      popup.close();
    }

    popup = $window.open(url, title, 'width=500,height=500,toolbar=0,location=0,menubar=0,directories=0,scrollbars=0');

    // send a postMessage request to the popup
    sendMessage = $interval(function() {
      if (!popup) {
        toastr.error('Please allow the popup to open.');
        $interval.cancel(sendMessage);

        return;
      }
      popup.postMessage({ message: 'requestResult' }, '*');
    }, 500);
  }

  return Users;
}]);
