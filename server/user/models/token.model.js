'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    UserToken;

var UserTokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },   // id of user who involved in this activity
  token: { type: String }
});

UserTokenSchema.statics.saveNew = function (token, userId, fn) {
  var userTokenObj = new UserToken({ token: token, userId: userId });
  userTokenObj.save(fn);
};

UserTokenSchema.statics.consume = function (token, fn) {
  UserToken
    .findOne({ token: token })
    .populate('userId')
    .exec()
    .then(function(token) {
      if (!token) { return fn(); }
      var user = token.userId;

      token
        .remove()
        .then(function() {
          fn(null, user);
        })
        .catch(fn);
    })
    .catch(fn);
};

UserToken = mongoose.model('UserToken', UserTokenSchema);
