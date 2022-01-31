'use strict';

var toonavatar = require('cartoon-avatar'),
    mongoose = require('mongoose'),
    crypto = require('crypto'),
    Schema = mongoose.Schema,
    AddressSchema = mongoose.model('Address').schema,
    BillingSchema = mongoose.model('Billing').schema,
    ProductQuantitySchema = mongoose.model('ProductQuantity').schema;

var UserSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    default: ''
  },
  salt: {
    type: String
  },
  username: String,
  firstname: String,
  middlename: String,
  lastname: String,
  apt: String,
  address: String,
  address1: String,
  address2: String,
  zip: String,
  city: String,
  state: String,
  country: String,
  phone: String,
  gender: Number,
  birthDay: Date,
  currency: String,
  ssSubscribe: Boolean, //ss_susbscribe
  blog_subscribe: Boolean,
  img_location: {
    type: String,
    default: function() {
      var img = toonavatar.generate_avatar({ gender: this.gender === 2 ? 'm' : 'f' });

      return img;
    }
  },
  userposts: Number,
  usermenMerchantId: [Number],
  userDashboardMerchant: [String],
  usermenMerchant: [String],
  userWomenMerchant: [String],
  userShoesMerchant: [String],
  userAccessoriesMerchant: [String],
  userBeautyMerchant: [String],
  userKidsMerchant: [String],
  userHomeMerchant: [String],
  userGiftsMerchant: [String],
  userLocalMerchant: [String],
  subscribe_stores_coupon: [String],
  subscribe_stores_event: [String],
  shipping: [AddressSchema],
  billing: [BillingSchema],
  cart: [ProductQuantitySchema],
  wishList: [ProductQuantitySchema],
  saved_item: [String],
  saved_item_id: [Schema.Types.ObjectId],
  saved_catalogId: [String],
  timestamp: { type: Date, default: Date.now },
  orderObj: Object,
  purchaseObj: Object,
  mailbox: Object,
  provider: {
    type: String,
    required: 'Provider is required'
  },
  providerData: {},
  additionalProvidersData: {},
  instagramEmail: String,
  roles: {
    type: [{
      type: String,
      enum: ['user', 'admin']
    }],
    default: ['user'],
    required: 'Please provide at least one role'
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  mailChecked: { type: Date, default: Date.now }
  // users_stores :  { dashboard:[String], men:[String], women:[String], kids:[String], beauty:[String],gifts:[String]}
  /* menu_merchants: { type:Array },*/
  // users_stores :  { dashboard:{ type:Array }, men:{ type:Array }, women:{ type:Array }, kids:{ type:Array }, beauty:{ type:Array },gifts:{ type:Array } }                                                    //{men:['ashford','bloomingdale'],women:['ashford'],kids:['ganja']}
}, {
  toObject: { virtuals: true, getters: true },
  toJSON: { virtuals: true, getters: true }
});

UserSchema.virtual('displayName').get(function() {
  return this.firstname + ' ' + this.lastname;
});

UserSchema.statics.findAndModify = function (query, sort, doc, options, callback) {
  return this.collection.findAndModify(query, sort, doc, options, callback);
};

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function (next) {
  if (this.password && this.isModified('password')) {
    this.salt = crypto.randomBytes(16).toString('base64');
    this.password = this.hashPassword(this.password);
  }

  next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function (password) {
  if (this.salt && password) {
    return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64, 'SHA1').toString('base64');
  } else {
    return password;
  }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function (password) {
  return this.password === this.hashPassword(password);
};

mongoose.model('User', UserSchema);
