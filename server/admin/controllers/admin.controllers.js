'use strict';

var mongoose = require('mongoose'),
    Admin = mongoose.model('Admin'),
    sendgrid = require(process.cwd() + '/lib/sendgrid'); // File System

exports.adminRegistration = function (req, res, next) {
  Admin.create({
    username: req.body.email,
    password: req.body.password,
    fullname: req.body.full_name,
    address: req.body.address,
    city: req.body.city,
    phone: req.body.phone,
    email: req.body.email,
    gender: req.body.gender
  }, function (err) {

    if (err) {
      console.log(err);
      res.send(err);
    } else {
      sendgrid.send({
        to: req.body.email,
        from: 'system@sociallyshoppable.com',
        subject: 'Admin Registration Successful',
        text: 'Hi \n\n You are now appointed as admin in socially shoppable'
      }, function (err2) {
        if (err2) { 
		
		res.send(err2);
		return next(err2); }
      });
      console.log('success registration as admin');
      res.send();
    }
  });
};
