'use strict';

var config = require(process.cwd() + '/config'),
    fs = require('fs'),
    gm = require('gm'),
    FB = require('fb'),
    Twitter = require('twitter'),
    Instagram = require('instagram-private-api').V1,
    mongoose = require('mongoose'),
    objectId = mongoose.Types.ObjectId,
    sendgrid = require(process.cwd() + '/lib/sendgrid'),
    _ = require('lodash'),
    SocialPhoto = mongoose.model('SocialPhoto'),
    Mail = mongoose.model('Mail'),
    Like = mongoose.model('Like'),
    Comment = mongoose.model('Comment'),
    Rate = mongoose.model('Rate'),
    prosperent = require(process.cwd() + '/server/lib/prosperent'),
    request = require('request'),
    slugify = require('slugify');

var download = function(uri, filename, callback) {
  request.head(uri, function(err, res, body) {
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

exports.saveProductSocialShare = function (req, res, next) {
  if (!req.user) { return next('User not logged in'); }

  var sessid = objectId(req.user._id);

  var query = {
    catalogId: req.params.catalogId,
    user: sessid
  };
  var complete = {};

  getProduct(req.params.catalogId, config.domain)  // need to be database base
    .then(function(product) {
      if (!product) {

        console.log('no data');

        return next('Product not found.'); }

      var shareTypes = req.body.shareTypes;

      console.log('ssShare');

      console.log(req.body.ssShare);

      console.log('sharetypes');

      console.log(shareTypes);

      console.log('facebook share ');

      console.log(req.body.fbShare);

      console.log('Twitter share ');

      console.log(req.body.twShare);

      console.log('Instagram share ');

      console.log(req.body.insShare);

      console.log('Initial one ');

      console.log(req.body.initial);

      // main switch
      function socialPhoto() {
        if (!req.body.ssShare) {
          complete.rate = true;
          complete.like = true;
          complete.mail = true;

          return Promise.resolve();
        }

        // save the primary photo
        return SocialPhoto
          .update(query, { $set: { primary: false } }, { multi: true })
          .then(() => SocialPhoto.update({ _id: objectId(req.body.thumbnail) }, { primary: true }))
          .then(() => { complete.photo = true; });
      }

      socialPhoto()
      .then(function() {
        // save the rate

        if (!req.body.ssShare) {
          complete.collective = true;

          return;
        }

        else if (!req.body.initial.rate && !shareTypes.collective) {
          complete.collective = true;

          return;

        }
        else if (req.body.initial.rate && !shareTypes.collective) { // remove the like
          return Rate
          .remove(query)
          .then(() => {
            complete.rate = true;

            return Comment.remove(query)
            .then(() => { complete.collective = true; });

          });

        }
        else {  // when new rate is given
          var rate = {
            rate: req.body.rate
          };

          return Rate
          .findOneAndUpdate(query, _.assign(rate, query), { upsert: true, new: true })
          .then(function(val) {

            if (req.body.comment) {
              var comment = {
                comment: req.body.comment,
                rateId: val._id,
                rateVal: req.body.rate
              };

              return Comment
                .update(query, _.assign(comment, query), { upsert: true, new: true })
                .then(() => { complete.collective = true; });
            }
          });
        }

      })
      .then(function() {
        // save the like
        if (!req.body.ssShare) {
          complete.like = true;

          return;
        }

        else if (!req.body.initial.like && !shareTypes.like) {
          complete.like = true;

          return;

        }
        else if (req.body.initial.like && !shareTypes.like) { // remove the like
          return Like
          .remove(query)
          .then(() => { complete.like = true; });

        }
        else {
          var like = {
            catalogId: req.params.catalogId

          };

          return Like
          .update(query, _.assign(like, query), { upsert: true, new: true })
          .then(() => { complete.like = true; });
        }

      })
      .then(function() {
        // send the mail
        if (!req.body.ssShare || !shareTypes.mail) {
          complete.mail = true;

          return;
        }

        var mail = req.body.mail;

        if (mail.to && mail.subject && mail.message) {
          var tos = mail.to.split(/[,;]/);

          if (tos.length) {
            var tasks = [];
            tos.forEach(function(to) {
              var data = {
                content: mail.message,
                domain: config.domain
              };

              data.product = product;

              sendgrid.sendTemplate({
                to: to,
                replyTo: mail.from,
                subject: mail.subject,
                data: data,
                noThumbnail: req.body.noThumbnail,
                currentSliderImg: req.body.currentSliderImg
              }, req).catch(function(err) {
                console.error('Error sending the email:', err);
              });

              // save the object
              var mailObj = new Mail(_.assign({
                to: to,
                from: mail.from,
                subject: mail.subject,
                text: mail.message
              }, query));

              tasks.push(mailObj.save());
            });

            return Promise
              .all(tasks)
              .then(() => { complete.mail = true; });

          }
        }
      })
      .then(function() {
        // facebook Share
        if (!req.body.fbShare) {
          complete.facebook = true;

          return;
        }

        // check if can share on facebook
        return new Promise(function(pRes, pCatch) {
          FB.options({
            appId: config.facebook.clientID,
            appSecret: config.facebook.clientSecret,
            accessToken: req.user.additionalProvidersData.facebook.accessToken
          });
// picture: config.domain + '/',
                        // caption: product.merchant.merchant,

          var post = {
            type: 'link',
            message: req.body.facebook ? req.body.facebook.message : '',
            name: product.keyword,
            picture: req.body.fbcurrentSimage,
            description: product.brand,
            caption: product.merchant,
            link: product.url
          };

          FB.api('me/feed', 'post', post, function (response) {
            if (!response || response.error) {
              return pCatch('Facebook ' + response.error.message);
            }
            var mailfbObj = new Mail(_.assign({
              directMail: false,
              sharetype: 'facebook',
              subject: 'facebook share'
            }, query));

            mailfbObj.save();

            complete.facebook = true;

            return pRes(response);
          });
        });
      })

      .then(function() {
        // twitter share
        if (!req.body.twShare) {
          complete.twitter = true;

          return;
        }

        // check if can share on twitter
        return new Promise(function(pRes, pCatch) {
          var client = new Twitter({
            consumer_key: config.twitter.clientID,
            consumer_secret: config.twitter.clientSecret,
            access_token_key: req.user.additionalProvidersData.twitter.accessToken,
            access_token_secret: req.user.additionalProvidersData.twitter.refreshToken
          });

          var post = { status: '' };

          if (req.body.twitter) {
            post.status = req.body.twitter.message + ' - ';
          }
          post.status += encodeURI(product.url);

          var img_loc;
          if (req.body.twuserUploadedImage) {

            img_loc = process.cwd() + '/public' + req.body.twcurrentSimage;

				  //  img_loc =  req.body.twcurrentSimage;

            console.log(img_loc);

            var data = require('fs').readFileSync(img_loc);

            client.post('media/upload', { media: data }, function(error, media, response) {

              if (!error) {

							// If successful, a media object will be returned.
                console.log(media);

                var tep;
                if (req.body.twitter) {
                  tep = req.body.twitter.message + ' - ';
                }
                tep += encodeURI(product.url);

                var status = {
                  status: tep,
                  media_ids: media.media_id_string // Pass the media id string
                };

                client.post('statuses/update', status, function(error, tweet, response) {
                  if (!error) {
                    console.log(tweet);
                    var mailTwObj = new Mail(_.assign({
                      directMail: false,
                      sharetype: 'twitter',
                      subject: 'twitter share'
                    }, query));

                    mailTwObj.save();

                    complete.twitter = true;

                    return pRes(tweet);

                  } else {

                    return pCatch('Twitter: ' + (error[0] && error[0].message));

                  }

                });

              }
            });

          } else {
            img_loc = req.body.twcurrentSimage;

            var imageName = 't' + req.user.email + '.jpg';
            download(img_loc, imageName, function() {
              var newimage = process.cwd() + '/' + imageName;
              var data = require('fs').readFileSync(newimage);

								/*
								    client.post('statuses/update', post, function(error, tweet) {
									if (error) {
									  console.error(error);

									  return pCatch('Twitter: ' + (error[0] && error[0].message));
									}

									 var mailTwObj = new Mail(_.assign({
										directMail : false,
										sharetype : 'twitter',
										subject: 'twitter share',
									  }, query));

									  mailTwObj.save();

									complete.twitter = true;

									return pRes(tweet);
								  }); */

              client.post('media/upload', { media: data }, function(error, media, response) {

                if (!error) {

							// If successful, a media object will be returned.

                  var tep;
                  if (req.body.twitter) {
                    tep = req.body.twitter.message + ' - ';
                  }
                  tep += encodeURI(product.url);
                  var status = {
                    status: tep,
                    media_ids: media.media_id_string // Pass the media id string
                  };

                  client.post('statuses/update', status, function(error, tweet, response) {
                    if (!error) {
                      var mailTwObj = new Mail(_.assign({
                        directMail: false,
                        sharetype: 'twitter',
                        subject: 'twitter share'
                      }, query));

                      mailTwObj.save();

                      complete.twitter = true;

                      return pRes(tweet);

                    } else {
                      return pCatch('Twitter: ' + (error[0] && error[0].message));

                    }

                  });

                }
              }); // image upload on twitter

            });
          } // else loop end

		   // Make post request on media endpoint. Pass file data as media parameter

        });
      })

      .then(function() {
        // instagram share
        if (!req.body.insShare) {
          complete.instagram = true;

          return;
        }

        return new Promise(function(pRes, pCatch) {

          var instaCredentials = {
            email: (req.body.instagram && req.body.instagram.email) || undefined,
            password: (req.body.instagram && req.body.instagram.password) || undefined
          };

          req.user.instagramEmail = instaCredentials.email || req.user.instagramEmail;
          var device = new Instagram.Device(req.body.instagram.email);
          var storage = new Instagram.CookieFileStorage(process.cwd() + '/cookies/' + req.body.instagram.email + '.json');

          var message = (req.body.instagram && req.body.instagram.message) || '';
         // return Instagram.Session.create(device, storage, req.user.instaCredentials.email, req.body.instagram.password)

          return Instagram.Session.create(device, storage, req.body.instagram.email, req.body.instagram.password)
		   .then(function(session) {
   		// Now you have a session, we can follow / unfollow, anything...
        // And we want to follow Instagram official profile

     var img_loc;
     img_loc = req.body.incurrentSimage;
     if (req.body.inuserUploadedImage) {

       img_loc = process.cwd() + '/public' + req.body.instagramimage;

       Instagram.Upload
                    .photo(session, img_loc)
                    .then((upload) => Instagram.Media.configurePhoto(session, upload.params.uploadId, message + ' ' + product.url))
                    .then(() => {
                      complete.instagram = true;
                      req.user.save(pRes, pCatch);
                      var fname = process.cwd() + '/cookies/' + req.body.instagram.email + '.json';
						// fs.unlink(fname);
                      var mailInsobj = new Mail(_.assign({
                        directMail: false,
                        sharetype: 'instagram',
                        subject: 'Instagram share'
                      }, query));

                      mailInsobj.save();

                    }).catch((error1) => { pCatch('Instagram ' + error1 && error1.message); });

     } else {
       var imageName = req.body.instagram.email + '.png';
       download(img_loc, imageName, function() {

         var newimage = process.cwd() + '/' + imageName;

         Instagram.Upload
										.photo(session, newimage)
										.then((upload) => Instagram.Media.configurePhoto(session, upload.params.uploadId, message + ' ' + product.url))
										.then(() => {
  complete.instagram = true;
  req.user.save(pRes, pCatch);

  var mailInsObj = new Mail({
    subject: 'Instagram share',
    directMail: false,
    sharetype: 'Instagram',
    catalogId: req.params.catalogId,
    user: sessid
  });
  mailInsObj.save(function (ierr) {
    if (ierr) { console.log(ierr); }
    console.log('instagram thing saved successfully');

  });

  var fname = process.cwd() + '/cookies/' + req.body.instagram.email + '.json';
											// fs.unlink(fname);
  fs.unlink(newimage);

}).catch((error1) => {

  var fname = process.cwd() + '/cookies/' + req.body.instagram.email + '.json';
								        //  fs.unlink(fname);
  pCatch('Instagram ' + error1 && error1.message); });

       });

     }

   }).catch((error) => { pCatch('Instagram ' + error && error.message); });

             // var newImg = process.cwd() + '/tmp' + req.body.currentSliderImg + '.jpg';
             // newImg =  process.cwd() + '/uploads/images/image-1492390842783.jpg';
			  // gm(process.cwd() + '/public' + req.user.img_location)
                // .resize(1080, 1080)
                // .noProfile()
                // .setFormat('jpg')
                // .write(newImg, function (err) {
                  // if (err) { return pCatch(err); }
                  // Instagram.Upload
                    // .photo(session, newImg)
                    // .then((upload) => Instagram.Media.configurePhoto(session, upload.params.uploadId, message + ' ' + product.url))
                    // .then(() => {
                        // complete.instagram = true;
                        // req.user.save(pRes, pCatch);

                    // })

                // });

			// .then(function(session) {
              // // resize the images
			  // var img_loc = '/uploads/images/image-1492390842783.jpg';
              // var newImg = process.cwd() + '/tmp' + req.user.img_location + '.jpg';
              // newImg =  process.cwd() + '/uploads/images/image-1492390842783.jpg';
			  // gm(process.cwd() + '/public' + req.user.img_location)
                // .resize(1080, 1080)
                // .noProfile()
                // .setFormat('jpg')
                // .write(newImg, function (err) {
                  // if (err) { return pCatch(err); }
                  // Instagram.Upload
                    // .photo(session, newImg)
                    // .then((upload) => Instagram.Media.configurePhoto(session, upload.params.uploadId, message + ' ' + product.url))
                    // .then(() => {
                      // fs.unlink(newImg, () => {
                        // complete.instagram = true;
                        // req.user.save(pRes, pCatch);
                      // });
                    // })
                    // .catch((error) => { pCatch('Instagram ' + error && error.message); });
                // });
            // })
            // .catch((error) => { pCatch('Instagram ' + error && error.message); });
        });
      })
      .then(() => { res.send(complete); })
      .catch((error) => {
        res.status(400);
        res.send({ complete, error });
      });
    })
    .catch(next);
};
// this has limit

// /// out dated //////////
/*
exports.getProductSocialShare = function (req, res, next) {

  var filter = { catalogId: req.params.catalogId };

  var gets = [
    Like.find(filter, 'user')
    .populate('user', 'firstname lastname displayName img_location')
    .limit(50)
    .sort({ updatedAt: -1 }),
    Rate.aggregate([
      { $match: filter },
      { $group: { _id: null, average: { $avg: '$rate' }, count: { $sum: 1 } } }
    ]),
    Comment.find(filter, 'user rate comment updatedAt')
    .populate('rate', 'rate')
    .populate('user', 'firstname lastname displayName img_location')
    .sort({ updatedAt: -1 }),
    SocialPhoto.find(filter, 'user photo primary')
    .populate('user', 'firstname lastname displayName img_location')
    .sort({ updatedAt: -1 })
  ];

  Promise
    .all(gets)
    .then((values) => {

      res.send({
        likes: values[0],
        rate: values[1][0],
        comments: values[2],
        photos: values[3]
      }); }

	)
    .catch(next);
}; */
// this do not have any limit

exports.getProductSocialAllShare = function (req, res, next) {
  // var limit = req.body.limit;
  if (req.user) {
    var sessid = objectId(req.user._id);
    var filter = { catalogId: req.params.catalogId };
    var userfilter = { user: sessid, catalogId: req.params.catalogId };
    var idx = sessid;

    var commentfilter = { catalogId: req.params.catalogId, user: { $ne: idx } };

	// sesid = new ObjId(req.user._id);
    var gets = [

      Like.find(filter, 'user')
    .populate('user', 'firstname lastname displayName img_location')
     .limit(50)
    .sort({ updatedAt: -1 }),
      Rate.find(filter, 'user rate')
     .populate('user', 'firstname lastname displayName img_location'),
      Comment.find(commentfilter, 'user rate comment updatedAt rateVal')
    .populate('rate', 'rate')
    .populate('user', 'firstname lastname displayName img_location')
    .sort({ updatedAt: -1 }),
      SocialPhoto.find(filter, 'user photo primary')
    .populate('user', 'firstname lastname displayName img_location')
    .sort({ updatedAt: -1 }),
      Mail.find(filter, 'user')
    .populate('user', 'firstname lastname displayName _id')
    .sort({ updatedAt: -1 }),
      Like.findOne(userfilter, 'user'),
      Rate.findOne(userfilter, 'rate'),
      Comment.findOne(userfilter, 'user comment updatedAt rateVal'),
      SocialPhoto.find(userfilter, 'user photo primary')
    .sort({ updatedAt: -1 }),
      Mail.findOne(userfilter, 'user')
    .limit(1)

    ];

    Promise
    .all(gets)
    .then((values) => {

      var likeUser = false;
      var reviewUser = false;
      var commentUser = false;
      var mailUser = false;
      var photoUser = false;
      var comment = null;
      var rate = null;
      if (values[5]) {
        likeUser = true;
      }
      if (values[6]) {
        reviewUser = true;
        rate = values[6].rate;

      }
      if (values[7]) {
        reviewUser = true;
        comment = values[7].comment;

      }
      if (values[8]) {
        if (values[8].length > 0)
          photoUser = true;
      }

      if (values[9]) {

        mailUser = true;
      }

      res.send({
        likes: values[0],
        rateDetails: values[1],
        comments: values[2],
        photos: values[3],
        shares: values[4],
        likeUser: likeUser,
        reviewUser: reviewUser,
        commentUser: commentUser,
        photoUser: photoUser,
        mailUser: mailUser,
        rate: rate,
        comment: comment,
        UserPhoto: values[8] // user photo

      }); }

	)
    .catch(next);

  } else {

    var filter = { catalogId: req.params.catalogId };

    var gets = [
      Like.find(filter, 'user')
    .populate('user', 'firstname lastname displayName img_location')
     .limit(50)
    .sort({ updatedAt: -1 }),
      Rate.find(filter, 'user rate')
     .populate('user', 'firstname lastname displayName img_location'),
      Comment.find(filter, 'user rate comment updatedAt rateVal')
    .populate('rate', 'rate')
    .populate('user', 'firstname lastname displayName img_location')
    .sort({ updatedAt: -1 }),
      SocialPhoto.find(filter, 'user photo primary')
    .populate('user', 'firstname lastname displayName img_location')
    .sort({ updatedAt: -1 }),
      Mail.find(filter, 'user')
    .populate('user', 'firstname lastname displayName _id')
    .sort({ updatedAt: -1 })

    ];

    Promise
    .all(gets)
    .then((values) => {

      res.send({

        likes: values[0],
        rateDetails: values[1],
        comments: values[2],
        photos: values[3],
        shares: values[4]
      }); }

	)
    .catch(next);

  }

};

exports.getProductSocialLikes = function (req, res, next) {
  Like.find({ catalogId: req.params.catalogId }, 'user')
    .populate('user', 'firstname lastname displayName img_location')
    .sort({ updatedAt: -1 })
    .then((likes) => {
      res.send(likes);

    })
    .catch(next);
};

exports.getMyfavourites = function (req, res, next) {

  if (req.user) {
    var sessid = objectId(req.user._id);
    var userfilter = { user: sessid };

    var lquery = Like
    .find(userfilter)
     .select({
       _id: 0,
       catalogId: 1

     });

    lquery.exec(function (err, data) {   // run query to find data result
      if (err) {
        console.log(err);
        res.end();

        return next(err);
      }
      res.send(data);

    });

  }
  else {

    console.log('sign in to fix');
    res.end();

  }

};

exports.getMyReviewed = function (req, res, next) {

  if (req.user) {
    var sessid = objectId(req.user._id);
    var userfilter = { user: sessid };

    var lquery = Rate
			.find(userfilter)
			 .select({
   _id: 0,
   catalogId: 1

 });

    lquery.exec(function (err, data) {   // run query to find data result
      if (err) {
        console.log(err);
        res.end();

        return next(err);
      }
      res.send(data);

    });

  }
  else {

    console.log('sign in to fix');
    res.end();

  }

};

exports.getMyMailed = function (req, res, next) {

  if (req.user) {
    var sessid = objectId(req.user._id);

    var userfilter = { user: sessid };
    var lquery = Mail
			.find(userfilter).select({
  _id: 0,
  catalogId: 1

});

    lquery.exec(function (err, data) {   // run query to find data result
      if (err) {
        console.log(err);
        res.end();

        return next(err);
      }
      res.send(data);

    });

  }
  else {

    console.log('sign in to fix');
    res.end();

  }

};
exports.getMySentMails = function (req, res, next) {

  if (req.user) {
    var sessid = objectId(req.user._id);

    var userfilter = { user: sessid, directMail: true, del: { $ne: true }, $and: [{ mail_type: { $ne: 'order' } }, { mail_type: { $ne: 'purchase' } }] };
    var lquery = Mail
			.find(userfilter).sort('-createdAt');

    lquery.exec(function (err, data) {   // run query to find data result
      if (err) {
        console.log(err);
        res.end();

        return next(err);
      }
      res.send(data);

    });

  }
  else {

    console.log('sign in to fix');
    res.end();

  }

};

exports.getMyReceiveMails = function (req, res, next) {

  if (req.user) {
    var sessid = objectId(req.user._id);

    var userfilter = { to: req.user.email, directMail: true, receiverdel: { $ne: true } };
    var lquery = Mail
			.find(userfilter).sort('-createdAt');

    lquery.exec(function (err, data) {   // run query to find data result
      if (err) {
        console.log(err);
        res.end();

        return next(err);
      }
      res.send(data);

    });

  }
  else {

    console.log('sign in to fix');
    res.end();

  }

};

exports.updateReadFlag = function (req, res, next) {
  if (req.user) {
    var sessid = objectId(req.user._id);
    var lquery = Mail
            .update({ to: req.user.email, directMail: true, read: { $ne: true }, $and: [{ mail_type: { $ne: 'order' } }, { mail_type: { $ne: 'purchase' } }]
            }, { $set: { read: true } });

    lquery.exec(function (err, data) {   // run query to find data result
      if (err) {
        console.log(err);
        res.end();

        return next(err);
      }
      console.log(data);
      res.send(data);

    });

  }
  else {

    console.log('sign in to fix');
    res.end();

  }

};

exports.updateReadFlagByid = function (req, res, next) {
  if (req.user) {
    var mailid = objectId(req.body.mailid);
    var lquery = Mail
            .update({ _id: mailid
            }, { $set: { read: true } });

    lquery.exec(function (err, data) {   // run query to find data result
      if (err) {
        console.log(err);
        res.end();

        return next(err);
      }
      console.log(data);
      res.send(data);

    });

  }
  else {

    console.log('sign in to fix');
    res.end();

  }

};

exports.countunReadFlag = function (req, res, next) {
  if (req.user) {
    var lquery = Mail
            .find({ to: req.user.email, directMail: true, read: { $ne: true }, receiverdel: { $ne: true } }, '_id').count();

    lquery.exec(function (err, result) {
      if (!err) {
        res.json({ 'count': result });
      } else {
        res.end();
      }

    });

  }
  else {

    console.log('sign in to fix');
       // res.end();

  }

};
exports.delReceiveEmail = function (req, res, next) {

  if (req.user) {
    var mid = objectId(req.body.id);

    console.log(req.body.id);
    var lquery = Mail
            .remove({ _id: mid });

    lquery.exec(function (err, data) {   // run query to find data result
      if (err) {
        console.log(err);
        res.end();

        return next(err);
      }
      console.log(data);
      res.send(data);

    });

  }
  else {

    console.log('sign in to fix');
    res.end();

  }

};

exports.updateReceiveEmail = function (req, res, next) {

  if (req.user) {
    var sessid = objectId(req.user._id);
    var mid = objectId(req.body.id);

    var lquery = Mail
            .update({ user: sessid, _id: mid }, { $set: { receiverdel: true } });

    lquery.exec(function (err, data) {   // run query to find data result
      if (err) {
        console.log(err);
        res.end();

        return next(err);
      }
      console.log(data);
      res.send(data);

    });

  }
  else {

    console.log('sign in to fix');
    res.end();

  }

};

exports.updateSentEmail = function (req, res, next) {

  if (req.user) {
    var sessid = objectId(req.user._id);
    var mid = objectId(req.body.id);

    var userfilter = { user: sessid, id: mid };
    var lquery = Mail
			.update({ user: sessid, _id: mid }, { $set: { del: true } });

    lquery.exec(function (err, data) {   // run query to find data result
      if (err) {
        console.log(err);
        res.end();

        return next(err);
      }
      console.log(data);
      res.send(data);

    });

  }
  else {

    console.log('sign in to fix');
    res.end();

  }

};

exports.getHashtag = function (req, res, next) {

  var skey;
  var searchkey;
  if (req.body.keyword) {
    searchkey = req.body.keyword;
    skey = searchkey.replace(/-/g, ' ');  // replace '-' from search query otherwise keyword ignored

    var tkey = skey;
    var searchquery = {
      $text: { $search: tkey }   // pass text search query
    };
  }

  var lquery = Comment
			.find(searchquery,
            { score: { $meta: 'textScore' } })
			 .select({
   _id: 0,
   catalogId: 1

 });

  lquery.exec(function (err, data) {   // run query to find data result
    if (err) {
      console.log(err);
      res.end();

      return next(err);
    }
    res.send(data);

  });

};

function getProduct(catalogId, domain) {
  var product = {};
  if (!catalogId) {
    return Promise.resolve();
  }

  return prosperent.getByCatalogId(catalogId)
    .then(function (res) {
      product = res;

      return prosperent.getMerchantByCatalogId(res.merchant);
    })
    .then(function (merchant) {
      product.merchant = merchant;
    //  product.url = domain + '/#!/SOC/' + product.catalogId + '/' + slugify(product.keyword);
      product.url = 'http://gitlab.sociallyshoppable.com/#!/SOC/' + product.catalogId + '/' + slugify(product.keyword);

      return product;
    });
}

