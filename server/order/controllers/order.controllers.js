/* sociallyshoppable2tap@gmail.com
pass: ss123$$!!
public key: bc35986ded29131f39f1e0b11250c3
private key: 0e3fbb72afd92529c4b521e5884d6857a1d05dd70cc9adbc24
*/
'use strict';

var config = require(process.cwd() + '/config'),
    mongoose = require('mongoose'),
    ObjId = require('mongoose').Types.ObjectId,
    User = mongoose.model('User'),
    UserActivity = mongoose.model('UserActivity'),
    Purchase = mongoose.model('Purchase'),
    request = require('request'),
    async = require('async'),
    sendgrid = require(process.cwd() + '/lib/sendgrid'),
    deepcopy = require('deepcopy'),
    Mail = mongoose.model('Mail'),
    auth_data;

exports.updatecheck = function (req, res) {
  var user_id = req.user._id;
  var userid = new ObjId(user_id);
  /* User.update(
              { _id: userid },
              { $set: { cart: [] } })
              .exec(function (err, resultx) {
                if (err || resultx < 1) {
                  console.log('cart update err ' + err + ' ' + resultx);
                  res.end();
                } else {

                  res.end();
                }
              });*/
  var details = { 'user_id': req.user._id,
              'purchase_id': '58df29fa64b879267d924d08',
              'cart_id': '58df29bf3a48d67c3906e360',
              'email': req.user.email,
              'firstname': req.user.firstname,
              'lastname': req.user.lastname };

  var message = {
    'purchase_id': '58df29fa64b879267d924d08',
    'user_id': null,
    'created_at': '2017-03-24T12:38:22.527Z',
    'total_prices': {
      'sales_tax': '$0.00',
      'shipping_price': '$11.99',
      'final_price': '$43.83'
    },
    'destination': 'domestic',
    'test_mode': 'fake_confirm',
    'notes': null,
    'used_profiles': null,
    'pending_confirm': false,
    'sites': {
      '54354ab869702d3290130000': {
        'info': {
          'url': 'ems.com',
          'name': 'EMS',
          'logo': 'https://px.twotap.com/unsafe/https%3A//core.twotap.com/system/sites/logos/536b/4eeb/ce04/fabf/6900/0010/small/536b4eebce04fabf69000010.jpeg%3F1490336482659'
        },
        'prices': {
          'final_price': '$7.34',
          'shipping_price': '$6.99',
          'sales_tax': '$0.00'
        },
        'details': {
          'shipping_estimate': 'SEATTLE SPORTS Bungee Deck Cord, 7/32 in. 3-7 business days'
        },
        'order_id': 'fake_confirm_order_id',
        'products': {
          '90a129137dda1d3ec7eaf64767cda0e2': {
            'original_url': 'http://click.linksynergy.com/link?id=XdSn0e3h3*k&offerid=303281.1722424861&type=15&murl=http%3A%2F%2Fwww.ems.com%2Fseattle-sports-bungee-deck-cord-7and32-in.%2F20385100012.html',
            'clean_url': 'http://www.ems.com/seattle-sports-bungee-deck-cord-7and32-in./20385100012.html',
            'category_attributes': null,
            'status': 'done',
            'required_fields': {
              'quantity': {
                'data': [
                  {
                    'input_type': 'select-one',
                    'input_name': 'INPUT'
                  }
                ]
              },
              'size': {
                'data': [
                  {
                    'input_type': 'select-one',
                    'input_name': 'SELECT'
                  }
                ]
              },
              'color': {
                'data': [
                  {
                    'input_type': 'select-one',
                    'input_name': 'SELECT'
                  }
                ]
              }
            },
            'source': 'cache',
            'required_field_names': [
              'color',
              'size',
              'quantity'
            ],
            'required_field_values': {
              'color': [
                {
                  'weight': '',
                  'value': 'BLACK',
                  'text': 'BLACK',
                  'price': '$0.35',
                  'image': 'http://www.ems.com/on/demandware.static/-/Sites-vestis-master-catalog/default/dw0bb344a6/product/images/1315/661/1315661/1315661_001_main.jpg',
                  'extra_info': 'Free Shipping at $49',
                  'dep': {
                    'size': [
                      {
                        'weight': '',
                        'value': 'NA',
                        'text': 'NA',
                        'price': '$0.35',
                        'image': 'http://www.ems.com/on/demandware.static/-/Sites-vestis-master-catalog/default/dw0bb344a6/product/images/1315/661/1315661/1315661_001_main.jpg',
                        'extra_info': 'Free Shipping at $49'
                      }
                    ]
                  },
                  'alt_images': [
                    'http://www.ems.com/on/demandware.static/-/Sites-vestis-master-catalog/default/dw0bb344a6/product/images/1315/661/1315661/1315661_001_main.jpg'
                  ]
                }
              ]
            },
            'weight': '160',
            'site_categories': [
              'Sporting Goods',
              'Outdoor Recreation',
              'Boating & Water Sports',
              'Boating & Rafting'
            ],
            'categories': [
              'Everything Else'
            ],
            'extra_info': 'Free Shipping at $49',
            'alt_images': [
              'http://www.ems.com/on/demandware.static/-/Sites-vestis-master-catalog/default/dw0bb344a6/product/images/1315/661/1315661/1315661_001_main.jpg'
            ],
            'image': 'http://www.ems.com/on/demandware.static/-/Sites-vestis-master-catalog/default/dw0bb344a6/product/images/1315/661/1315661/1315661_001_main.jpg',
            'description': 'When the deck bungee on your kayak starts to lose its stretch, use this 7/32 in. Bungee Deck Cord from Seattle Sports to replace it.',
            'price': '$0.35',
            'title': 'SEATTLE SPORTS Bungee Deck Cord, 7/32 in.',
            'url': 'http://www.ems.com/seattle-sports-bungee-deck-cord-7and32-in./20385100012.html',
            'input_fields': {
              'quantity': '1',
              'color': 'BLACK',
              'size': 'NA'
            }
          }
        },
        'status': 'done'
      }
    },
    'message': 'done',
    'final_message': "Hi! We've confirmed 2 orders:\n\nEMS total $7.34 vs our initial estimate of $8.11.\n* products: SEATTLE SPORTS Bungee Deck Cord, 7/32 in..\n* delivery estimate: SEATTLE SPORTS Bungee Deck Cord, 7/32 in. 3-7 business days.\n* store order number: fake_confirm_order_id.\n\nDNA Footwear total $36.49 vs our initial estimate of $40.32.\n* products: New Balance Toddler's Vazee Rush V2 Hook And Loop Sneaker - Purple / Pink Zing.\n* delivery estimate: SEATTLE SPORTS Bungee Deck Cord, 7/32 in. 3-7 business days.\n* store order number: fake_confirm_order_id.\n\nTotal $43.83.",
    'purchaseId': '58d5133eabc87f2625902d60',
    'mail_type': 'purchase'
  };

  updateUserInfo(details, req, res, message);

};

exports.purchase = function (req, res) {

  var title;
  var sesid;
  if (req.user) {
    if (req.user.gender === 1) {
      title = 'Mrs';
    } else {
      title = 'Mr';
    }

    sesid = new ObjId(req.user._id);

  } else {
    console.log('login to purchase');
    res.end();

    return;
  }

  var userCart = req.body.user_cart;
  var cartid = userCart.cart_id;
  var productUrls = []; // passing urls of products to twotap
  var siteIdArr = [], // site array id
      siteskey,
      siteskey_purchase,
      cartBySite,
      paraJson,
      count,
      soption,
      coupons = [],
      affliatedJson = {}; // plain json object way 1

  // constructing array of sites id
  Object.keys(userCart.sites).forEach(function(skey) {
    siteskey = skey;
    siteIdArr.push(skey);              // insert all sites inside an array
  });

  // "products": userCart.productUrls, // required product urlS IS AN ARRAY OF PRODUCT URL

  paraJson = {
    'cart_id': cartid,
    'fields_input': {},
     'products' : productUrls,
    'affiliate_links': affliatedJson,
    'confirm': {
      'method': 'http',
      'http_confirm_url': config.twotap.http_confirm_url,
      'http_update_url': config.twotap.http_finished_url
    },
    'test_mode': 'fake_confirm'
  };

  var afflink,
      gifCard = [],
      gcard,
      gpin,
      indz = 0;
  // var setupPurchaseInputField = function(siteskey_purchase,productKeyMd5) {
    // siteskey = siteskey_purchase;
    // paraJson.affiliate_links[siteskey][productKeyMd5] = {};     // way 1 aff link
     // // para_json.affiliate_links[indz] = {};
     // // para_json.affiliate_links[indz][siteskey] = {};    // way 3 array of affiliated links

     // // cart_prod_md5_arr
    // paraJson.fields_input[siteskey].addToCart[productKeyMd5] = {};

     // afflink =userCart.sites[siteskey]["add_to_cart"][productKeyMd5].affiliate_links;
   // // afflink = userCart.sites[siteskey].add_to_cart[productKeyMd5].original_url;

    // paraJson.affiliate_links[siteskey][productKeyMd5] = afflink; // way 1 aff link assign
   // // para_json.affiliate_links[indz][siteskey][pmd5] =afflink;  // way 3 for affiliate links insert into array

     // // passing user defined variables
    // if ('input_fields' in cartBySite[productKeyMd5]) {
      // paraJson.fields_input[siteskey].addToCart[productKeyMd5] = cartBySite[productKeyMd5].input_fields;
      // console.log('I am using required values from input fields');

    // } else {

      // if ('quantity' in cartBySite[productKeyMd5]) {
        // paraJson.fields_input[siteskey].addToCart[productKeyMd5].quantity = userCart.sites[siteskey].add_to_cart[productKeyMd5].quantity;
      // }
      // if ('size' in cartBySite[productKeyMd5]) {
        // paraJson.fields_input[siteskey].addToCart[productKeyMd5].size = cartBySite[productKeyMd5].size;
      // }
      // if ('color' in cartBySite[productKeyMd5]) {
        // paraJson.fields_input[siteskey].addToCart[productKeyMd5].color = userCart.sites[siteskey].add_to_cart[productKeyMd5].color;
      // }
      // if ('option' in cartBySite[productKeyMd5]) {
        // paraJson.fields_input[siteskey].addToCart[productKeyMd5].option = userCart.sites[siteskey].add_to_cart[productKeyMd5].option;
      // }
    // }

    // productUrls.push(userCart.sites[siteskey].add_to_cart[productKeyMd5].url);
    // indz += 1;
  // };

   // for loop
 // purchase api call back  end

  async.waterfall([

    function(callback) {
                // arg1 now equals 'three'
      for (count = 0; count < siteIdArr.length; count += 1) {

        siteskey = siteIdArr[count]; // getting single site
        soption = userCart.sites[siteskey].shipping_option;
        coupons = [];
        gifCard = [];

        if (userCart.sites[siteskey].gift_cards_number && userCart.sites[siteskey].gift_cards_pin && userCart.sites[siteskey].gift_cards_number !== '' && userCart.sites[siteskey].gift_cards_pin !== '') {
          gcard = userCart.sites[siteskey].gift_cards_number;
          gpin = userCart.sites[siteskey].gift_cards_pin;
          gifCard[0] = {};
          gifCard[0].number = gcard;
          gifCard[0].pin = gpin;
        }

        if (userCart.sites[siteskey].coupon1 && userCart.sites[siteskey].coupon1 !== '') {
          coupons.push(userCart.sites[siteskey].coupon1);
        }
        if (userCart.sites[siteskey].coupon2 && userCart.sites[siteskey].coupon2 !== '') {
          coupons.push(userCart.sites[siteskey].coupon2);
        }

        if (userCart.sites[siteskey].coupon3 && userCart.sites[siteskey].coupon3 !== '') {
          coupons.push(userCart.sites[siteskey].coupon3);
        }
        if (userCart.sites[siteskey].coupon4 && userCart.sites[siteskey].coupon4 !== '') {
          coupons.push(userCart.sites[siteskey].coupon4);
        }

        if (req.body.common_shipping) {
          if (coupons.length > 0) {
            paraJson.fields_input[siteskey] = {
              'noauthCheckout': {
                'email': userCart.shipping.email,
                'shipping_title': title,
                'shipping_first_name': userCart.shipping.firstname,
                'shipping_last_name': userCart.shipping.lastname,
                'shipping_address': userCart.shipping.address1 + ' ' + userCart.shipping.address2,
                'shipping_city': userCart.shipping.city,
                'shipping_state': userCart.shipping.state,
                'shipping_country': userCart.shipping.country,
                'shipping_zip': userCart.shipping.zip,
                'shipping_telephone': userCart.shipping.phone
              },
              'addToCart': {
						// product_md5 will be dynamic
              },
              'coupons': coupons,
              'shipping_option': soption
            };
          }
          else {
            paraJson.fields_input[siteskey] = {
              'noauthCheckout': {
                'email': userCart.shipping.email,
                'shipping_title': title,
                'shipping_first_name': userCart.shipping.firstname,
                'shipping_last_name': userCart.shipping.lastname,
                'shipping_address': userCart.shipping.address1 + ' ' + userCart.shipping.address2,
                'shipping_city': userCart.shipping.city,
                'shipping_state': userCart.shipping.state,
                'shipping_country': userCart.shipping.country,
                'shipping_zip': userCart.shipping.zip,
                'shipping_telephone': userCart.shipping.phone

              },
              'addToCart': {
						// product_md5 will be dynamic
              },
              'shipping_option': soption
            };
          }
        }
        else if (coupons.length > 0) {
          paraJson.fields_input[siteskey] = {
            'noauthCheckout': {
              'email': userCart.sites[siteskey].shipping.email,
              'shipping_title': title,
              'shipping_first_name': userCart.sites[siteskey].shipping.firstname,
              'shipping_last_name': userCart.sites[siteskey].shipping.lastname,
              'shipping_address': userCart.sites[siteskey].shipping.address1 + ' ' + userCart.sites[siteskey].shipping.address2,
              'shipping_city': userCart.sites[siteskey].shipping.city,
              'shipping_state': userCart.sites[siteskey].shipping.state,
              'shipping_country': userCart.sites[siteskey].shipping.country,
              'shipping_zip': userCart.sites[siteskey].shipping.zip,
              'shipping_telephone': userCart.sites[siteskey].shipping.phone

            },
            'addToCart': {
					  // product_md5 will be dynamic
            },
            'coupons': coupons,
            'shipping_option': soption
          };
        }
        else {
          paraJson.fields_input[siteskey] = {
            'noauthCheckout': {
              'email': userCart.sites[siteskey].shipping.email,
              'shipping_title': title,
              'shipping_first_name': userCart.sites[siteskey].shipping.firstname,
              'shipping_last_name': userCart.sites[siteskey].shipping.lastname,
              'shipping_address': userCart.sites[siteskey].shipping.address,
              'shipping_city': userCart.sites[siteskey].shipping.city,
              'shipping_state': userCart.sites[siteskey].shipping.state,
              'shipping_country': userCart.sites[siteskey].shipping.country,
              'shipping_zip': userCart.sites[siteskey].shipping.zip,
              'shipping_telephone': userCart.sites[siteskey].shipping.phone
            },
            'addToCart': {
					  // product_md5 will be dynamic
            },
            'shipping_option': soption
          };
        }

        if (req.body.common_billing) {
          paraJson.fields_input[siteskey].noauthCheckout.billing_title = title;
          paraJson.fields_input[siteskey].noauthCheckout.billing_first_name = userCart.billing.firstname;
          paraJson.fields_input[siteskey].noauthCheckout.billing_last_name = userCart.billing.lastname;
          paraJson.fields_input[siteskey].noauthCheckout.billing_address = userCart.billing.address1 + ' ' + userCart.billing.address2;
          paraJson.fields_input[siteskey].noauthCheckout.billing_city = userCart.billing.city;
          paraJson.fields_input[siteskey].noauthCheckout.billing_state = userCart.billing.state;
          paraJson.fields_input[siteskey].noauthCheckout.billing_country = userCart.billing.country;
          paraJson.fields_input[siteskey].noauthCheckout.billing_zip = userCart.billing.zip;
          paraJson.fields_input[siteskey].noauthCheckout.billing_telephone = userCart.billing.phone;
          paraJson.fields_input[siteskey].noauthCheckout.card_type = userCart.card.card_type;
          paraJson.fields_input[siteskey].noauthCheckout.card_name = userCart.card.name;
          paraJson.fields_input[siteskey].noauthCheckout.card_number = userCart.card.card_number;

          paraJson.fields_input[siteskey].noauthCheckout.expiry_date_year = userCart.card.year;
          paraJson.fields_input[siteskey].noauthCheckout.expiry_date_month = userCart.card.month;
          paraJson.fields_input[siteskey].noauthCheckout.cvv = userCart.card.cvv;

        }
        else {
          paraJson.fields_input[siteskey].noauthCheckout.billing_title = title;
          paraJson.fields_input[siteskey].noauthCheckout.billing_first_name = userCart.sites[siteskey].billing.firstname;
          paraJson.fields_input[siteskey].noauthCheckout.billing_last_name = userCart.sites[siteskey].billing.lastname;
          paraJson.fields_input[siteskey].noauthCheckout.billing_address = userCart.sites[siteskey].billing.address1 + ' ' + userCart.sites[siteskey].billing.address2;
          paraJson.fields_input[siteskey].noauthCheckout.billing_city = userCart.sites[siteskey].billing.city;
          paraJson.fields_input[siteskey].noauthCheckout.billing_state = userCart.sites[siteskey].billing.state;
          paraJson.fields_input[siteskey].noauthCheckout.billing_country = userCart.sites[siteskey].billing.country;
          paraJson.fields_input[siteskey].noauthCheckout.billing_zip = userCart.sites[siteskey].billing.zip;
          paraJson.fields_input[siteskey].noauthCheckout.billing_telephone = userCart.sites[siteskey].billing.phone;

          paraJson.fields_input[siteskey].noauthCheckout.card_type = userCart.sites[siteskey].card.card_type;
          paraJson.fields_input[siteskey].noauthCheckout.card_name = userCart.sites[siteskey].card.name;
          paraJson.fields_input[siteskey].noauthCheckout.card_number = userCart.sites[siteskey].card.card_number;
          paraJson.fields_input[siteskey].noauthCheckout.expiry_date_year = userCart.sites[siteskey].card.year;
          paraJson.fields_input[siteskey].noauthCheckout.expiry_date_month = userCart.sites[siteskey].card.month;
          paraJson.fields_input[siteskey].noauthCheckout.cvv = userCart.sites[siteskey].card.cvv;

        }

        paraJson.affiliate_links[siteskey] = {}; // site one by one way 1
				// reading content inside add to cart <<>>site wise
        if (gifCard.length > 0) {
          paraJson.fields_input[siteskey].gift_cards = gifCard;
        }

        cartBySite = userCart.sites[siteskey].add_to_cart; // each site have single add to cart
        siteskey_purchase = siteskey;
				// making an array of product by sites assign quantity as well
				// Object.keys(cartBySite).forEach(addToCart);
				// Object.keys(cartBySite).forEach(setupPurchaseInputField);
        for (var productKeyMd5 in userCart.sites[siteskey].add_to_cart) {
          siteskey = siteskey_purchase;
          paraJson.affiliate_links[siteskey][productKeyMd5] = {};     // way 1 aff link
         // para_json.affiliate_links[indz] = {};
         // para_json.affiliate_links[indz][siteskey] = {};    // way 3 array of affiliated links

         // cart_prod_md5_arr
          paraJson.fields_input[siteskey].addToCart[productKeyMd5] = {};

          afflink = userCart.sites[siteskey].add_to_cart[productKeyMd5].affiliate_links;
		  // afflink = userCart.sites[siteskey].add_to_cart[productKeyMd5].original_url;

          paraJson.affiliate_links[siteskey][productKeyMd5] = afflink; // way 1 aff link assign
			   // para_json.affiliate_links[indz][siteskey][pmd5] =afflink;  // way 3 for affiliate links insert into array

				 // passing user defined variables
          if ('input_fields' in cartBySite[productKeyMd5]) {
            paraJson.fields_input[siteskey].addToCart[productKeyMd5] = cartBySite[productKeyMd5].input_fields;
            console.log('I am using required values from input fields');

          }

            if ('quantity' in cartBySite[productKeyMd5]) {
              paraJson.fields_input[siteskey].addToCart[productKeyMd5].quantity = userCart.sites[siteskey].add_to_cart[productKeyMd5].quantity;
            }
            if ('size' in cartBySite[productKeyMd5]) {
              paraJson.fields_input[siteskey].addToCart[productKeyMd5].size = cartBySite[productKeyMd5].size;
            }

          if('color' in cartBySite[productKeyMd5]){


              paraJson.fields_input[siteskey].addToCart[productKeyMd5].color = userCart.sites[siteskey].add_to_cart[productKeyMd5].color;
            }
            if ('option' in cartBySite[productKeyMd5]) {
              paraJson.fields_input[siteskey].addToCart[productKeyMd5].option = userCart.sites[siteskey].add_to_cart[productKeyMd5].option;
            }


          productUrls.push(userCart.sites[siteskey].add_to_cart[productKeyMd5].url);
          indz += 1;
        }


      }
      callback(null, paraJson, productUrls);
    },
    function(paraJson,productUrls, callback) {
      paraJson.products = productUrls;
      request({
        url: 'https://api.twotap.com/v1.0/purchase?public_token=' + config.twotap.publicToken,
        json: paraJson,
        method: 'POST'
      }, function (err, respond, body) {
        var data = JSON.stringify(body); // convert to json object
        var purchaseData = JSON.parse(data);
        if (!err) {

          if (purchaseData.message === 'bad_required_fields') {
            purchaseData.status = 'failed! Because Required fields are bad!';
            console.log('bad_required_fields');
            callback(null, purchaseData);

          } else {

            if (status === 'failed') {
              purchaseData.status = 'failed';
              callback(null, purchaseData);

            } else {
              purchaseData.status = status;
              config.purchaselist.push({
                'user_id': req.user._id,
                'purchase_id': purchaseData.purchase_id,
                'cart_id': cartid,
                'email': req.user.email,
                'firstname': req.user.firstname,
                'lastname': req.user.lastname
              }); // pushing inside array to verify true request

              var purchaseId = purchaseData.purchase_id;
              var status = purchaseData.message;

              var newPurchase = new Purchase({
                user_id: req.user._id,
                email: req.user.email,
                purchase_id: purchaseId,
                status: status,
                cart_id: cartid,
                firstname: req.user.firstname,
                lastname: req.user.lastname

              });

              newPurchase.save(function (err) {
                if (err) {
                  console.log('data save not possible');
                  callback(null, purchaseData); }

              });
              var orderArr = {};
              var mailArr = {};
              User.find({ _id: sesid }, function (errUser, profiledataU) {

                if (errUser) {
                  console.log(err);
                  callback(null, purchaseData);

                } else {

                  var myObjPro = profiledataU[0];

                  if (myObjPro.orderObj != null) {

                    orderArr = myObjPro.orderObj;
                    orderArr[purchaseId] = paraJson;
                  } else {
                    console.log('there is no previous order history  ');
                    orderArr[purchaseId] = paraJson;
                  }

                  if (myObjPro.mailbox != null) {

                    mailArr = profiledataU[0].mailbox;
                  }

                  var currentTimestamp = Math.round(Date.now() / 1000),
                      singleMail = paraJson;

                  singleMail.purchaseId = purchaseId;
                  singleMail.mail_type = 'order';
                  singleMail.userCart = userCart;

                  var mailObj = new Mail({
                    to: req.user.email,
                    from: 'ss@sociallyshoppable.com',
                    subject: 'Order ',
                    directMail: true,
                    text: 'We got your order',
                    mail_type: 'order',
                    mail_object: singleMail,
                    user: req.user._id

                  });

                  mailObj.save();

                  mailArr[currentTimestamp] = singleMail;

                  User.update(
						  { _id: sesid },
						  { $set: { mailbox: mailArr, orderObj: orderArr } })
						  .exec(function (err, resultx) {

    if (err || resultx < 1) {
      console.log('cart update err ' + err + ' ' + resultx);

    } else {
      console.log('Order updated');
    }
    callback(null, purchaseData);

  }); // user update end
                } // else end
              });
            }
          }
        } else {
          console.log('purchase request error' + err);
          callback(null, purchaseData);

        }
      });
    }

  ], function (err1, purchaseData) {
    if (err1) {
      res.end();

      return next(err1);
    }

    res.send(purchaseData);

  });

};

// $$$$ server site scripting this one is hit back url
exports.confirm = function (req, res) {

// var purchaseId = "59008fc4d916b47ee51b5c85";
  var purchaseId = req.body.purchase_id;
  var valid = false;
  // find out the user who use the request and then find whether any user
  // from system has same user id and purchase id
  // using following code we are watching whether purchase id is valid one
  if (!req.body.unique_token) { // that means he come from api call
    var purchase_item;
    var pid = new ObjId(purchaseId);

    Purchase.find({ purchase_id: pid })
	.exec(function (err, data) {
  if (err) {
    console.log(err);
    res.end();

  } else {

    if (data && data.length > 0) {

      var passingdata = data[0];
      confirm_twotap(req, res, passingdata);

    } else {

      console.log('no such item inside cart and purchase id');
      res.end();
    }

  }

});

	/*
    for (var jk = 0; jk < config.purchaselist.length; jk += 1) {
      purchase_item = config.purchaselist[jk];
      if (purchase_item.purchase_id === purchaseId) {
        jk = config.purchaselist.length;

        confirm_twotap(req, res, purchase_item);
        valid = true;

        break;
      }

	}

    if (!valid) {
      console.log('no such request from this web site . so confirm failed');
      res.end();
    } */
  } else {

    confirm_twotap(req, res, null);
  }
};

exports.finish = function (req, res) {

  var message = req.body,
      purchaseId = req.body.purchase_id,
      purchase_item,
      found = false,
      jk;

    // send email about the purchase
  var pid = new ObjId(purchaseId);

  Purchase.find({ purchase_id: pid })
	.exec(function (err, data) {
  if (err) {
    console.log(err);

  } else {

    if (data && data.length > 0) {

      var passingdata = data[0];
      updateUserInfo(passingdata, req, res, message); // update and sending message

    } else {

      console.log('no such item inside cart and purchase id');
      res.end();
    }

  }

});

/*
 for (jk = 0; jk < config.purchaselist.length; jk += 1) {
    purchase_item = config.purchaselist[jk];

    if (purchase_item.purchase_id === purchaseId) {

      jk = config.purchaselist.length;

      updateUserInfo(purchase_item, req, res, message); // update and sending message
      found = true;
      break;

    }

    if (jk + 1 === config.purchaselist.length) {

      if (!found) {
        console.log('no such id present');
      }
    }

  } */
  res.end();

  // example POST API callback:
  // POST http://an_url/callback

  // encoded JSON body arguments:
  // purchase_id
  // sites {
  // [site_id] {
  // order_id: 'order id'
  // status: 'done or failed'
  // status_messages: [ 'An array of messages in case of failures' ]
  // }
  // }
};

// following confirmation code from two tap git
function confirm_twotap(req, res, purchase_item) {

  var testMode = req.body.test_mode;

  var purchaseId = req.body.purchase_id;

  request({
    url: 'https://api.twotap.com/v1.0/purchase/confirm?private_token=' + config.twotap.privateToken,
    json: { 'purchase_id': purchaseId, 'test_mode': testMode },
    method: 'POST'
  }, function (err) {
    if (err) {
      var message = 'As confirmation is not proceeded, purchase is not done ';
      console.log(err);
      // sendgrid.sendgridEmail(purchase_item, message, {}); // need to updated
      res.end();

    } else {
      console.log('confrimed correctly');
      res.end();
    }
  });
}

function updateUserInfo(detailsInfo, req, res, message) {
  console.log(detailsInfo);
  var purchaseId = message.purchase_id, // this userdetails purchase an item
      site_Key = [],
      parsedData,
      user_cart,
      cart_by_site,
      successful_pmd5 = [], // twotap cart
      unsuccessful_md5 = [], // twotap failed item from purchase status
      final_cart = [], // database cart
      tempMd5,
      myObj;

  var userid = new ObjId(detailsInfo.user_id);
  var order_arr = {};
  var purchase_arr = {};
  var mail_arr = {};
  var currentOrder = purchaseId;

  var purchaseCallbackData = message;
  // ask for purchase status to see any failed thing is there
  request({
    url: 'https://api.twotap.com/v1.0/purchase/status?public_token=' + config.twotap.publicToken + '&purchase_id=' + purchaseId + '&test_mode=fake_confirm',
    method: 'GET'
  }, function (err, reponse, body) {

    if (err) {
    //  sendgrid.sendgridEmail(detailsInfo, message, {});

      console.log(err);
      console.log('purchase status check failure line 595');

      return;
    }

    parsedData = JSON.parse(body); // purchase status data

    Object.keys(parsedData.sites).forEach(function(sk) {
      site_Key.push(sk);
    });

    var tempsitekey,
        unsuccessfulListObj = [];

    // var md5Each = function(fail_md5) {
      // unsuccessful_md5.push(parsedData.sites[tempsitekey].failed_to_add_to_cart[fail_md5]);
      // unsuccessfulListObj.push(fail_md5);
    // };

    var orulfailed;
    var s_md5 = [];

	// run a loop to get success and failed list
    for (var tsitekey in parsedData.sites) {
      myObj = parsedData.sites[tsitekey];
      if (myObj.failed_to_add_to_cart) {
      //  Object.keys(myObj.failed_to_add_to_cart).forEach(setupinputfieldfailed);
        for (var fail_md5 in myObj.failed_to_add_to_cart) {
          unsuccessful_md5.push(fail_md5);

        }
      }
      else {

        for (var suc_md5 in myObj.products) {

          if (myObj.products[suc_md5].status == 'done')
            s_md5.push(suc_md5); // make a list of success items
          else
			unsuccessful_md5.push(suc_md5);

        }

      }
    }
    // this should be over all cart id
    request({
      url: 'https://api.twotap.com/v1.0/cart/status?public_token=' + config.twotap.publicToken + '&cart_id=' + detailsInfo.cart_id + '&test_mode=fake_confirm',
      method: 'GET'
    }, function (errst, reponset, cartResult) {

      if (errst) {
        console.log('cart status return error' + errst);

        return;
      }

      user_cart = JSON.parse(cartResult);

	  // construct array of all items

        /* construct array of md5 using the cart */
	  /*

    */

      User.find({ _id: userid }, function (errprofiledata, profiledataU) {

        if (errprofiledata) {
          console.log(errprofiledata);

          return;
        } else {

          var myObjPro = profiledataU[0];
          final_cart = profiledataU[0].cart; // all cart data

          if (myObjPro.orderObj !== null && myObjPro.orderObj) {
            order_arr = profiledataU[0].orderObj; // order array to null hotey parey

            for (var sitesOrd in order_arr[purchaseId].userCart.sites) {

              for (var mdProd in order_arr[purchaseId].userCart.sites[sitesOrd].add_to_cart) {

                if (purchaseCallbackData.sites.hasOwnProperty(sitesOrd)) {
                  if (purchaseCallbackData.sites[sitesOrd].products.hasOwnProperty(mdProd)) {
                    if (purchaseCallbackData.sites[sitesOrd].products[mdProd].status === 'done') {
                      order_arr[purchaseId].userCart.sites[sitesOrd].add_to_cart[mdProd].orderstatus = 'OrderPlaced';

                    } else {
                      order_arr[purchaseId].userCart.sites[sitesOrd].add_to_cart[mdProd].orderstatus = purchaseCallbackData.sites[sitesOrd].products[mdProd].status;

                    } // else end
                  } // if end

                } // property end

              }// md5
            }
          } else {
            for (var sitesOrd in purchaseCallbackData.sites) {
              for (var mdProd in purchaseCallbackData.sites[sitesOrd].products) {
                console.log('I am there ');
                order_arr[purchaseId] = {};
                order_arr[purchaseId].userCart = {};
                order_arr[purchaseId].userCart.sites = {};
                order_arr[purchaseId].userCart.sites[sitesOrd] = {};
                order_arr[purchaseId].userCart.sites[sitesOrd].add_to_cart = {};
                order_arr[purchaseId].userCart.sites[sitesOrd].add_to_cart[mdProd] = {};
                if (purchaseCallbackData.sites[sitesOrd].products[mdProd].status === 'done') {
                  order_arr[purchaseId].userCart.sites[sitesOrd].add_to_cart[mdProd].orderstatus = 'OrderPlaced';
                } else {
                  order_arr[purchaseId].userCart.sites[sitesOrd].add_to_cart[mdProd].orderstatus = purchaseCallbackData.sites[sitesOrd].products[mdProd].status;
                }
              }

            }
          }

          if (myObjPro.purchaseObj !== null && myObjPro.purchaseObj) {
            purchase_arr = profiledataU[0].purchaseObj;
          }

          if (myObjPro.mailbox !== null && myObjPro.mailbox) {
            mail_arr = profiledataU[0].mailbox;
          }

          var current_timestamp = Math.round(Date.now() / 1000);
          var single_mail = message;

          single_mail.purchaseId = purchaseId;
          single_mail.mail_type = 'purchase';

          purchase_arr[purchaseId] = message;
          mail_arr[current_timestamp] = single_mail;

          var tj;

          var success_pro;
          var useremail = detailsInfo.email;
          var mailObj = new Mail({
            to: useremail,
            from: 'ss@sociallyshoppable.com',
            subject: 'Purchase Confirmation',
            directMail: true,
            text: 'We are sending purchase confirmation',
            mail_type: 'purchase',
            mail_object: single_mail,
            user: detailsInfo.user_id
          });

          mailObj.save();

/*
          for (var ixn = 0; ixn < successful_pmd5.length; ixn += 1) {

            success_pro = successful_pmd5[ixn];// take first index
               console.log("Printing successful cart items ");

			console.log(success_pro);

			for (var k = 0; k < final_cart.length; k += 1) {
              tj = final_cart[k].productMD5;
               console.log("Printing user cart items ");

			   console.log(tj);

              if (tj == success_pro) { // md5 may be not matched later
                console.log("Splice going on");
                final_cart.splice(k, 1);      // make array of which is not done

                break;
              }

            }
          }
		   } */
         /* for (var ixn = 0; ixn < s_md5.length; ixn += 1) {
            success_pro = s_md5[ixn];// take first index
            for (var k = 0; k < final_cart.length; k += 1) {
              tj = final_cart[k].productMD5;
              console.log('Printing user cart items ');
              console.log(tj);

              if (tj == success_pro) { // md5 may be not matched later
                console.log('Splice going on');
                final_cart.splice(k, 1);      // make array of which is not done

                break;
              }
            }
          }  */
          var purchase_success;
          var pruchaseurl = '';
          var carturl = '';
          for (var sitesOrd in purchaseCallbackData.sites) {
            for (var mdProd in purchaseCallbackData.sites[sitesOrd].products) {

              if (purchaseCallbackData.sites[sitesOrd].products[mdProd].status === 'done') {
                pruchaseurl = purchaseCallbackData.sites[sitesOrd].products[mdProd].original_url;
                for (var k = 0; k < final_cart.length; k += 1) {
                  carturl = final_cart[k].chkout_url;

                  if (carturl == pruchaseurl) { // md5 may be not matched later
                    console.log('Splice going on');
                    final_cart.splice(k, 1);      // make array of which is not done

                    break;
                  }
                }

              }
            }

          }

          var count = 0; var ty = true;
          var interval = setInterval(function () {

            count += 20000;

            if (count > 20000 && ty) {

              ty = false;

              User.update(
				  { _id: userid },
				  { $set: { cart: final_cart, orderObj: order_arr, purchaseObj: purchase_arr, mailbox: mail_arr } },
				   { new: true })
				  .exec(function (err, resultx) {
    if (err || resultx < 1) {
      console.log('cart update err ' + err + ' ' + resultx);

    } else {

      console.log(resultx);

      sendgrid.sendgridEmail(detailsInfo, message, myObjPro); // myObjPro means full user data

    }
  });

              clearInterval(interval);

            }

          }, 20000, 'wait');

        }
      }); // find the user having same details
    });
  });
}
