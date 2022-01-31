'use strict';

var config = require(process.cwd() + '/config'),
    multer = require('multer'),
    request = require('request'),
    mongoose = require('mongoose'),
    SocialPhoto = mongoose.model('SocialPhoto'),
    fs = require('fs');

exports.processUpload = processUpload;
exports.processImport = processImport;
exports.saveProfilePhoto = saveProfilePhoto;
exports.saveProductPhoto = saveProductPhoto;

function processUpload(req, res, next) {
  var storage = multer.diskStorage({
    destination: process.cwd() + '/public' + config.uploads.imageUpload.dest,
    filename: function(req, file, cb) {
      var extension = file.originalname.replace(/^.+\./, '');

      cb(null, file.fieldname + '-' + Date.now() + '.' + extension);
    }
  });

  var upload = multer({ storage: storage }).single('image');
  var profileUploadFileFilter = require(process.cwd() + '/config/lib/multer').imageUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = profileUploadFileFilter;

  upload(req, res, function (uploadError) {
    if (uploadError) { return next(uploadError); }

    res.locals.filename = req.file.filename;
    next();
  });
}

function processImport(req, res, next) {
  if (!req.query || !req.query.url) { return next('No Image'); }

  var filename = req.query.url.replace(/^.*\/(.*)\.jpg.*/, '$1.jpg');

  request
    .get(req.query.url)
    .pipe(fs.createWriteStream(process.cwd() + '/public' + config.uploads.imageUpload.dest + filename))
    .on('error', next)
    .on('finish', function (err) {
      if (err) { return next(err); }

      res.locals.filename = filename;
      next();
    });
}

function saveProfilePhoto(req, res, next) {
  if (!res.locals.filename) { return; }

  var oldPhoto = req.user.img_location;

  req.user.img_location = config.uploads.imageUpload.dest + res.locals.filename;
  req.user
    .save()
    .then(() => res.send({ img: req.user.img_location }))
    .catch(next);

  if (oldPhoto !== req.user.img_location) {
    // unlink old photo
    fs.unlink(process.cwd() + '/public' + oldPhoto, function(err) {
      if (err) {
        console.error('Error deleting photo', err);
      }
    });
  }
}

function saveProductPhoto(req, res, next) {
  if (!res.locals.filename) { return; }

  var imgUrl = config.uploads.imageUpload.dest + res.locals.filename;

  var photo = new SocialPhoto({
    catalogId: req.params.catalogId,
    user: req.user._id,
    photo: imgUrl
  });

  photo
    .save()
    .then(() => res.send(photo))
    .catch(next);
}
