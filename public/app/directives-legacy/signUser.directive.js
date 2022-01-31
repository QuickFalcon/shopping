/* global socialPopup, toastr, sShoppable */
'use strict';

(function() {
  angular.module('SSApp').directive('signUser', SignUserDirective);

  SignUserDirective.$inject = ['$timeout', 'UserService', '$location', '$route', 'toastr'];

  function SignUserDirective($timeout, UserService, $location, $route, toastr) {
    return {
      restrict: 'A',
      templateUrl: '/partials/s_user/sign.html', /*template for sign part*/
      controllerAs: 'vm',
      scope: {
      },
      link: function(scope) {
        var vm = scope.vm = {
        };

        resetForms();

        vm.signStep1 = signStep1;
        vm.signupFn = signupFn;
        vm.signinFn = signinFn;
        vm.forgotPassword = forgotPassword;
        vm.resetPassword = resetPassword;
        vm.goToStep = goToStep;
        vm.facebookConnect = facebookConnect;
        vm.instagramConnect = instagramConnect;
        vm.twitterConnect = twitterConnect;
        vm.clearPostValidationError = clearPostValidationError;
        vm.resetForms = resetForms;

        // watches
        scope.$watch('vm.confirm_password', _passwordStrength);
        scope.$watch('vm.signup.lastname', _removeSpaces);

        // check if it's a password reset
        $timeout(function() {
          if ($location.search().resetToken) {
            if ($location.search().cancel) {
              UserService
                  .cancelResetPassword($location.search().resetToken)
                  .then(function() {
                    toastr.success('Password reset link deactivated.');
                  });

              return;
            }

            angular.element('.login-link').click();
            goToStep('#forgotpassReset', '', 'backward');
            scope.overflowHide = false;
          }
        });

        function signStep1 (form) {
          vm.forms.push(form);
          vm.emailExist = false;
          if (form.$invalid) { return; }

          UserService
            .userMailexist({ email: vm.initialemail })
            .then(function (data) {
              if (data.exist === 'No') {
                vm.goToStep('#signup2', '#signup1', 'backward');
              } else {
                vm.emailExist = true;
              }
            });
        }

        function signupFn (form) {
          vm.forms.push(form);

          if (form.$invalid || vm.passwordStrength.text !== 'strong') { return; }
          scope.overflowHide = true;

          UserService
            .userSignup(vm.signup)
            .then(function(data) {
              // bad bad hack
              angular.element('body').scope().initializeUser(data);
              goToStep('#signup3', '#signup2', 'backward');
            })
            .catch(function(err) {
              if (err.data.code === 'mailRegistered') {
                form.mail.$invalid = true;
                form.mail.$error[err.data.code] = true;
                return;
              }
              toastr.error(err.data.message, 'There was an error while registering');
            });
        }

        // ------------Login check from sign in click----------------------
        function signinFn(form) {
          vm.forms.push(form);
          console.log(form);
          
		  
		  if(angular.isDefined(form.email))
          clearPostValidationError(form.email);

          if(angular.isDefined(form.password))
            clearPostValidationError(form.password);
          //form.password.$validate();

          if (form.$invalid) { return; }

          UserService
              .userSignin(vm.signin)
              .then(function (data) {


                // bad bad hack
                angular.element('body').scope().initializeUser(data);
                angular.element('#loginPopup').modal('hide');
				
				
              })
              .catch(function(err) {
                if (err.data.code === 'wrongPassword') {
                  form.password.$invalid = true;
                  form.password.$error[err.data.code] = true;
                  toastr.error('Wrong Password');

                  return;
                }

                toastr.error('Login failed');
              });
        }

        function forgotPassword(form) {
          vm.forms.push(form);
          clearPostValidationError(form.email);
          form.email.$validate();

          if (form.$invalid) { return; }

          UserService
              .requestPasswordReset(vm.forgot)
              .then(function () {
                vm.goToStep('#forgotpassSentmail', '#forgotpassEntrMail', 'backward');
              })
              .catch(function(err) {
                if (err.data.code === 'noEmail') {
                  form.email.$invalid = true;
                  form.email.$error[err.data.code] = true;

                  return;
                }

                toastr.error(err.data.message);
              });
        }

        function resetPassword(form) {
          vm.forms.push(form);

          if (form.$invalid || vm.passwordStrength.text !== 'strong') { return; }

          UserService
              .resetPassword($location.search().resetToken, vm.resetPass)
              .then(function () {
                vm.goToStep('#forgotpassResetDone', '#forgotpassReset', 'backward');
              })
              .catch(function(err) {
                toastr.error(err.data.message);
              });
        }

        function goToStep(toStep, fromStep, direction) {
          var $toStep = angular.element(toStep);
          var $fromStep = angular.element(fromStep);

          $toStep.show();

          if (direction === 'forward') {
            $toStep.animate({ right: 0 }, 500);
            scope.overflowHide = true;
            $fromStep.animate({ right: '-430px' }, 500, function () {
              scope.overflowHide = false;
              $(fromStep).click();
              $fromStep.hide();
            });
          } else {
            $toStep.animate({ right: 0 }, 500);
            scope.overflowHide = true;
            $fromStep.animate({ right: '430px' }, 500, function () {
              scope.overflowHide = false;
              $(fromStep).click();
              $fromStep.hide();
            });
          }
        }

        function facebookConnect() {
          UserService.facebookConnect(function(result) {

            if (!result) {
              vm.connected.facebook = true;
            }

            // since it's not an angular call, we need to refresh the scope
            scope.$apply();
          });
        }

        function instagramConnect() {
          UserService.instagramConnect(function(result) {

            if (!result) {
              vm.connected.instagram = true;
            }

            // since it's not an angular call, we need to refresh the scope
            scope.$apply();
          });
        }

        function twitterConnect() {
          UserService.twitterConnect(function(result) {

            if (!result) {
              vm.connected.twitter = true;
            }

            // since it's not an angular call, we need to refresh the scope
            scope.$apply();
          });
        }

        function resetForms() {
          vm.signin = {};
          vm.forgot = {};
          vm.signup = {};
          vm.resetPass = {};
          vm.connected = {};
          vm.initialemail = '';
          vm.confirm_password = '';
          vm.passwordStrength = {
            text: 'weak',
            value: '0%'
          };

          // this is not perfect, but it's the best i could remember now
          vm.forms && vm.forms.forEach(function(form) {
            form.$setPristine();
          });

          vm.forms = [];
        }

        function clearPostValidationError(field) {
          ['mailRegistered', 'wrongPassword', 'noEmail'].forEach(function(err) {
            delete field.$error[err];
          });

          field.$validate();
        }

        function _passwordStrength(pass) {
          var tests = 0;

          console.log(pass);

          // length
          if (pass && pass.length > 4) {
            tests += 1;
          }

          // number
          if (pass && pass.match(/\d/)) {
            tests += 1;
          }

          // upper and lower case (test them is separate regexs)
          if (pass && pass.match(/[a-z]/)) {
            tests += 1;
          }

          switch (tests) {
            case 0:
              vm.passwordStrength.text = 'weak';
              vm.passwordStrength.value = '0%';
              break;
            case 1:
              vm.passwordStrength.text = 'weak';
              vm.passwordStrength.value = '33%';
              break;
            case 2:
              vm.passwordStrength.text = 'medium';
              vm.passwordStrength.value = '66%';
              break;
            case 3:
              vm.passwordStrength.text = 'strong';
              vm.passwordStrength.value = '100%';
              break;
          }
        }

        function _removeSpaces(val) {
          if (!val) { return; }

          vm.signup.lastname = val.replace(' ', '');
        }
      }
    };
  }

  angular.module('SSApp').directive('elmCenter', function() {
    return {
      link: function(scope, elem) {
        elem.parents('.popup-container').click(function () {
          if (screen.width > 767) {
            var elmHt = elem.outerHeight();
            elem.attr('style', 'margin-top: ' + (-elmHt / 2) + 'px');
          }
        });
      }
    };
  });
}());
