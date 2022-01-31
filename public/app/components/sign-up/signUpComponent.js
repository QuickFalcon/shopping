var signUpComponentModule = angular.module('signUpComponentModule', ['ngMessages', 'userApiServiceModule', 'validatorsDirectiveModule', 'validatorsServiceModule', 'positionElementDirectiveModule', 'toastr']);

signUpComponentModule.component('signUpComponent', {
  templateUrl: 'app/components/sign-up/signUpView.html',
  bindings: {
    eventsScope: '<',
    onInitializeUser: '&'
  },
  controller: ['$scope', '$element', '$attrs', 'userApiService', 'validatorsService', 'toastr', function($scope, $element, $attrs, userApiService, validatorsService, toastr){
    var ctrl = this;

    // models
    ctrl.forms = [];
    ctrl.initialEmail = '';
    ctrl.emailExist = false;
    ctrl.passwordStrength = {};

    ctrl.forgotPasswordEmail = '';

    // sign up vars
    ctrl.signUpDetails = {
      email: '',
      firstname: '',
      lastname: '',
      password: '',
      confirmPassword: '',
      zip: '',
      gender: '',
      ssSubscribe: true
    };

    // sign in vars
    ctrl.signInDetails = {
      email: '',
      password: '',
      remember: false
    };

    // LIFECYCLE HOOKS
    ctrl.$onInit = function(){
      // BINDINGS SHOULD BE REALIZED FIRST OR ELSE IT WILL BE UNDEFINED
      // LISTEN FOR EVENTS BROADCAST BY COMPONENTS

      ctrl.initializeUser = function(data){
        ctrl.onInitializeUser({data: data});
      };
    };

    ctrl.$postLink = function(){
      ctrl.eventsScope.$on('showSignUpModalEvent', function(event, callback){
        ctrl.showSignUpModal();
        });

      ctrl.eventsScope.$on('showLoginModalEvent', function(event, callback){
        ctrl.showLoginModal();
        });

        // watch for change
        //scope.$watch('signUp.password', this.passwordStrength);
    };

    // CONTROLLERS

    ctrl.determinePasswordStrength = function(pass){
      var result = validatorsService.determinePasswordStrength(pass);
      ctrl.passwordStrength.name = result.name;
      ctrl.passwordStrength.value = result.value;
    };

    ctrl.showSignUpModal = function(){
      ctrl.resetFormData();

      angular.element('#loginPopup .modal-content')
          .hide()
          .css({"right": "-430px"});
      angular.element('#signup1')
          .show()
          .css({"right": "0"});
      angular.element('#loginPopup').modal('show');
      angular.element('.modal-dialog').removeClass('showVideo');
    };

    ctrl.showLoginModal = function(){
      ctrl.resetFormData();

      angular.element('#loginPopup .modal-content')
          .hide()
          .css({"right": "-430px"});
      angular.element('#login')
          .show()
          .css({"right": "0"});
      angular.element('#loginPopup').modal('show');
      angular.element('.modal-dialog').removeClass('showVideo');
    };

    ctrl.goToStep = function(to, from, direction){
      var toForm = angular.element(to);
      var fromForm = angular.element(from);

      toForm.show();

      if (direction === 'forward') {
        toForm.animate({ right: 0 }, 500);
        ctrl.overflowHide = true;
        fromForm.animate({ right: '-430px' }, 500, function () {
          ctrl.overflowHide = false;
          fromForm.click(); // not sure if this is needed -- old code
          fromForm.hide();
        });
      } else {
        toForm.animate({ right: 0 }, 500);
        ctrl.overflowHide = true;
        fromForm.animate({ right: '430px' }, 500, function () {
          ctrl.overflowHide = false;
          fromForm.click(); // not sure if this is needed -- old code
          fromForm.hide();
        });
      }
    };

    ctrl.checkEmailIfExistOnSignUp = function(form){

      ctrl.forms.push(form);
      ctrl.emailExist = false;
      if (form.$invalid) { return; }

      userApiService.userEmailexist({ email: ctrl.initialEmail }).then(function (data) {
          if (data.exist === 'No') {
            ctrl.goToStep('#signup2', '#signup1', 'backward');
          } else {
            ctrl.emailExist = true;
          }
        },function(response){
          console.log('Checking for the email failed');
        });
    };

    ctrl.signUp = function(form){
      ctrl.forms.push(form);
      if (form.$invalid || ctrl.passwordStrength.name !== 'strong') return;

      ctrl.overflowHide = true;
      userApiService
        .userSignup(ctrl.signUpDetails)
        .then(function(data) {
          // bad bad hack
          //angular.element('body').scope().initializeUser(data);
          ctrl.onInitializeUser({data: data});
          ctrl.goToStep('#signup3', '#signup2', 'backward');
        })
        .catch(function(response) {
          if (response.data.code === 'mailRegistered') {
            form.mail.$invalid = true;
            form.mail.$error[err.data.code] = true;
            return;
          }
          toastr.error(response.data.message, 'There was an error while registering');
        });
    };

    ctrl.checkEmailIfExistOnResetPassword = function(form){
      ctrl.forms.push(form);
      if (form.$invalid) { return; }


    };

    ctrl.signIn = function(form){
      ctrl.forms.push(form);

      if (form.$invalid) { return; }

      //scope.clearCustomValidationError(form.email);
      //scope.clearCustomValidationError(form.password);

      userApiService
          .userSignin(ctrl.signInDetails)
          .then(function (data) {

            ctrl.onInitializeUser({data: data});
            angular.element('#loginPopup').modal('hide');
          }, function(response) {

            if (response.data.code === 'wrongPassword') {
              form.password.$invalid = true;
              form.password.$error[response.data.code] = true;
            }
          });
    };

    ctrl.resetFormData = function(){
      ctrl.initialEmail = '';

      ctrl.signUpDetails = {
        email: '',
        firstname: '',
        lastname: '',
        password: '',
        confirmPassword: '',
        zip: '',
        gender: '',
        ssSubscribe: true
      };

      ctrl.signInDetails = {
        email: '',
        password: '',
        remember: false
      };

      ctrl.forms && ctrl.forms.forEach(function(form) {
        form.$setPristine();
      });

      ctrl.forms = [];
    };

    ctrl.clearCustomValidationError = function(field) {
      ['mailRegistered', 'wrongPassword', 'noEmail'].forEach(function(err) {
        delete field.$error[err];
      });

      //field.$validate();
    };

    ctrl.facebookConnect = function(){
      userApiService.facebookConnect(function(result) {

        if (!result) {
          vm.connected.facebook = true;
        }
        // since it's not an angular call, we need to refresh the scope
        $scope.$apply();
      });
    };
  }]
});
