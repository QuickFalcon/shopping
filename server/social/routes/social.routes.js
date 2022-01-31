'use strict';

/**
 * Module dependencies
 */
var social = require('../controllers/social.controllers');

module.exports = function (app) {

  // main product search
  app.route('/product/:catalogId/social')
    .get(social.getProductSocialAllShare)  // retrive all share
    .post(social.saveProductSocialShare);

  app.route('/product/:catalogId/likes')
    .get(social.getProductSocialLikes); // retrive all likes

  app.route('/getMyfavourites')
    .post(social.getMyfavourites); // retrive all likes

  app.route('/getMyReviewed')
    .post(social.getMyReviewed); // retrive all likes

  app.route('/getMyMailed')
    .post(social.getMyMailed); // retrive all likes

  app.route('/getMySentMails')
    .post(social.getMySentMails); // retrive all likes

  app.route('/getHashtag')
    .post(social.getHashtag); // retrive all likes

  app.route('/updateSentEmail')
    .post(social.updateSentEmail); // delete a sent email

  app.route('/updateReceiveEmail')
        .post(social.updateReceiveEmail); // delete a sent email

  app.route('/delReceiveEmail')
        .post(social.delReceiveEmail); // delete a sent email

  app.route('/getMyReceiveMails')
    .post(social.getMyReceiveMails); // retrive all likes

  app.route('/updateReadFlag')
      .post(social.updateReadFlag); // retrive all likes

  app.route('/updateReadFlagByid')
        .post(social.updateReadFlagByid); // retrive all likes

  app.route('/countunReadFlag')
      .post(social.countunReadFlag); // retrive all likes

};
