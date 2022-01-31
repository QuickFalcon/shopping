'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    sendgrid = require(process.cwd() + '/lib/sendgrid'),
    async = require('async'),
    crypto = require('crypto');

// var smtpTransport = nodemailer.createTransport(config.mailer.options);

/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = function (req, res, next) {
  console.log('forgot?');
  async.waterfall([
    // Generate random token
    function (done) {
      crypto.randomBytes(20, function (err, buffer) {
        var token = buffer.toString('hex');

        done(err, token);
      });
    },
    // Lookup user by email
    function (token, done) {
      if (req.body.email) {
        // User.findOne({
          // email: req.body.email.toLowerCase()
        // }, '-salt -password', function (err, user) {

	   User.findOne({
          email: req.body.email
        }, function (err, user) {
		  	  console.log("I am here");
		  console.log(user);

		  if (err || !user) {
            return next({ status: 400, message: 'No account with that e-mail has been found', code: 'noEmail' });
          } else if (user.provider !== 'local') {
            return next({ status: 400, message: 'It seems like you signed up using your ' + user.provider + ' account' });
          } else {
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

            user.save(function (err) {
              done(err, token, user);
            });
          }
        });
      } else {
        return next({ status: 400, message: 'E-mail field must not be blank' });
      }
    },
    function (token, user, done) {
      // send the email (not on the tasks for speed)
      // https://sendgrid.com/docs/ui/analytics-and-reporting/click-tracking-html-best-practices/
      sendgrid.sendTemplate({
        to: user.email,
        subject: 'Password Reset - Socially Shoppable',
        template: 'reset-password',
        currentSliderImg: process.cwd() + '/views/mail/images/logo.jpg',
        data: {
          linkReset: req.get('origin') + '/#!/?cancel=true&resetToken=' + token,
          // link: req.get('origin') + '/#!/?resetToken=' + token,
          // link: req.get('origin') + '/#!/?resetToken=' + token + '&t=' + btoa(user.email),
          link: req.get('origin') + '/#!/?resetToken=' + token + '&t=' + Buffer.from(user.email).toString('base64'),
          origin: req.get('origin'),
          displayName: user.displayName,
          product: {}
        }
      }, req).catch(function(err) {
        next(err);
      })
      .then(function(res) { done(null, res); });
    }
  ], function (err) {
    if (err) {
      return next(err);
    }

    return res.send('E-mail sent');
  });
  //////////////////////////////

  User.findOne({
    email: req.body.email
  }, function (err, user) {
    console.log('I am here');
    console.log(user);
  });

};

/**
 * Reset password GET from email token
 */
exports.validateResetToken = function (req, res) {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, function (err, user) {
    if (err || !user) {
      return res.redirect('/password/reset/invalid');
    }

    res.redirect('/password/reset/' + req.params.token);
  });
};

/**
 * Reset password POST from email token
 */
exports.reset = function (req, res, next) {
  // Init Variables
  var passwordDetails = req.body;

  async.waterfall([

    function (done) {
      User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
          $gt: Date.now()
        }
      }, function (err, user) {
        if (!err && user) {
          user.password = passwordDetails.newPassword;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          user.save(function (err) {
            if (err) {
              return next(err);
            }
            req.login(user, function (err) {
              if (err) {
                res.status(400).send(err);
              } else {
                // Remove sensitive data before return authenticated user
                user.password = undefined;
                user.salt = undefined;

                res.json(user);

                done(err, user);
              }
            });
          });
        } else {
          return next({ status: 400, message: 'Password reset token is invalid or has expired.' });
        }
      });
    }], function (err) {
    if (err) {
      return next(err);
    }
  });
};

/**
 * Cancel Reset password POST from email token
 */
exports.cancelReset = function (req, res, next) {
  async.waterfall([

    function (done) {
      User.findOne({
        resetPasswordToken: req.params.token
      }, function (err, user) {
        if (!err && user) {
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          user.save(function (err) {
            if (err) {
              return next(err);
            }
            req.login(user, function (err) {
              if (err) {
                res.status(400).send(err);
              } else {
                // Remove sensitive data before return authenticated user
                user.password = undefined;
                user.salt = undefined;

                res.json(user);

                done(err, user);
              }
            });
          });
        } else {
          return next({ status: 400, message: 'Password reset token is invalid or has expired.' });
        }
      });
    }], function (err) {
    if (err) {
      return next(err);
    }
  });
};

/**
 * Change Password
 */
exports.changePassword = function (req, res, next) {
  // Init Variables
  var passwordDetails = req.body;

  if (req.user) {
    if (passwordDetails.newPassword) {
      User.findById(req.user.id, function (err, user) {
        if (!err && user) {
          if (user.authenticate(passwordDetails.currentPassword)) {
            if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
              user.password = passwordDetails.newPassword;

              user.save(function (err) {
                if (err) {
                  return next(err);
                }
                req.login(user, function (err) {
                  if (err) {
                    return next({ status: 400, message: err });
                  } else {
                    res.send({
                      message: 'Password changed successfully'
                    });
                  }
                });
              });
            } else {
              return next({ status: 400, message: 'Passwords do not match' });
            }
          } else {
            return next({ status: 400, message: 'Current password is incorrect' });
          }
        } else {
          return next({ status: 400, message: 'User is not found' });
        }
      });
    } else {
      return next({ status: 400, message: 'Please provide a new password' });
    }
  } else {
    return next({ status: 400, message: 'User is not signed in' });
  }
};
