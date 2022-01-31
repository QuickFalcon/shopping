'use strict';

var config = require(process.cwd() + '/config'),
    sendgrid = require('sendgrid')(config.sendgrid.apiKey),
    helper = require('sendgrid').mail,
    mathjs = require('mathjs'),
    ejs = require('ejs');

exports.send = function(email, cb) {
  var emailObj = new sendgrid.Email(email);

  return sendgrid.send(emailObj, cb);
};

exports.sendTemplate = function(options, req) {
  var template; 
  options.data.product.image_url = options.currentSliderImg;
    console.log(options.data.product);

     if(options.noThumbnail){
		 template = options.template || 'generic_withoutimage';
	 }
	 else
	  template = options.template || 'generic';

  var secure = (config.secure && config.secure.ssl === true) ? 's' : '';
  options.data.domain = req.app.get('domain') || 'http' + secure + '://' + req.headers.host;

  return new Promise(function(res, rej) {
    ejs.renderFile(process.cwd() + '/views/mail/' + template + '.html', options.data, function(err, htmlMail) {
      if (err) { return rej(err); }
       
      

		   var from = new helper.Email(config.sendgrid.from);
      

	  
	  var to = new helper.Email(options.to);
      var content = new helper.Content('text/html', htmlMail);
      var mail = new helper.Mail(from, options.subject, to, content);

      if (options.replyTo) {
        mail.setReplyTo(new helper.Email(options.replyTo));
      }

      var request = sendgrid.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
      });

      return sendgrid.API(request)
        .then(res)
        .catch(rej);
    });
  });
};

/**
 * Send order mail
 */

exports.sendcronimagemail = function(emailbody) {
  var from_email = new helper.Email('system@sociallyshoppable.com');
 // var to_email = new helper.Email('rajib_2002bd@yahoo.com');

  var to_email = new helper.Email('rv@sociallyshoppable.com');

  var subject = 'Cron result!';
  var content = new helper.Content('text/plain', emailbody);
  var mail = new helper.Mail(from_email, subject, to_email, content);

  var sg = require('sendgrid')(config.sendgrid.apiKey);
  var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  });

  sg.API(request, function(error, response) {
    if (error) { console.log(error); }
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
  });
};

exports.sendgridEmail = function (userDetails, message, userObj) {

  var producttext = '';
  var skey;
  var purchaseId = userDetails.purchase_id; // this userdetails purchase an item
  var user_id = userDetails.user_id;

  var status;
  var site_Key = [];
  var pro;
  // parsedData= JSON.parse(message);

  for (skey in message.sites) {
    site_Key.push(skey);
  }

  var orderObj = userObj.orderObj[purchaseId];

  var itemprice;
  var itemprice_sub;
  var itemprice_number;
  var itemprice_number_total;
  var subtotal_store = 0;
  var subtotal_storez = 0;
  var subtotal_full = 0;
  var subtotal;
  var htmltext;

  var toptext = '<!doctype html public "- / /w3c / /dtd xhtml 1.0 strict / /en" "http: / /www.w3.org /tr /xhtml1 /dtd /xhtml1-strict.dtd">' + '\n' +
      '<html xmlns="http://www.w3.org/1999/xhtml">' + '\n' +
      '<head>' + '\n' +
      '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>' + '\n' +
      '<meta name="HandheldFriendly" content="true"/>' + '\n' +
      '<meta name="MobileOptimized" content="320"/>' + '\n' +
      '<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"/>' + '\n' +
      '<title>Socially Shoppable :: </title>' + '\n' +
      '<style type="text/css">' + '\n' +
      'table{border-spacing:0;border-collapse:collapse;}' + '\n' +
      'img{display:block;border:0;vertical-align:middle}' + '\n' +
      'a img{border:0;margin:0;}' + '\n' +
      'table td{border-collapse:collapse;mso-line-height-rule:exactly;}' + '\n' +
      'td.grey a{color:#3e3833;text-decoration:none}' + '\n' +
      'body{-webkit-text-size-adjust:100%;margin:0;padding:0;background:#ffffff;color:#3e3833;font-family:Arial, Helvetica, sans-serif;font-weight:400}' + '\n' +

      '@media only screen and (min-width:560px)  and (max-width:635px){' + '\n' +
      'table[class="ss_container"]{min-width:0 !important;width:550px !important ;}' + '\n' +
      'table[class="ss_container_inner"]{min-width:0 !important;width:530px !important;}' + '\n' +
      'table[class="ss_wrap100"]{max-width:50% !important;min-width:0 !important;width: 50% !important}' + '\n' +
      'img[class="img100"]{width:100%;height:auto}' + '\n' +
      '}' + '\n' +

      '@media only screen and (max-width:559px){' + '\n' +
      'table[class="ss_container"]{min-width:0 !important;width:100% !important;}' + '\n' +
      'table[class="ss_container_inner"]{min-width:0 !important;width:90%;text-align:center}' + '\n' +
      'table[class="hide"],td[class="hide"],img[class="hide"]{display:none !important;}' + '\n' +
      'img[class="img100"]{width:100%;height:auto }' + '\n' +
      'img[class="ss_logo"]{width:85%;height:auto }' + '\n' +
      'td[class="ss_imgCenter"],td[class="center"]{ text-align:center !important;}' + '\n' +
      'td[class="ss_imgCenter"] a img{ float:none !important; clear:both}' + '\n' +
      'table[class="ss_wrap100"],table[class="tbss_wrap100"],table[class="blss_wrap100"]{max-width:100% !important;min-width:0 !important;width: 100% !important}' + '\n' +
      'td[class="pad0"]{padding: 0 !important}' + '\n' +
      'td[class="padR0"]{padding-right: 0 !important}' + '\n' +
      'td[class="padT20"]{padding-top:20px !important;padding-left: 0 !important}' + '\n' +
      '}' + '\n' +
      '</style>' + '\n' +
      '</head>' + '\n' +
      '<body>' + '\n' +
      '<table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" bgcolor="#ffffff">' + '\n' +
      '<tr>' + '\n' +
      '<td align="center">' + '\n' +
      '<table border="0" cellpadding="0" cellspacing="0" width="636" style="min-width:636px;" class="ss_container">' + '\n' +
      '<tr>' + '\n' +
      '<td valign="top">' + '\n' +
      '<table border="0" cellpadding="0" cellspacing="0" width="636" style="min-width:636px" align="center" class="ss_container_inner">' + '\n' +
      '<tr>' + '\n' +
      '<td style="text-align:center;padding-top:50px"><a href="" style="text-decoration:none"><img src="http://104.236.166.98/images/logo.png" width="305"  alt="" style="display:inline;border:0;max-width:305px" class="ss_logo"></a></td>' + '\n' +
      '</tr>' + '\n' +
      '<tr><td height="33">&nbsp;</td></tr>' + '\n' +
      '<tr><td style="font-size:25px;line-height:30px; font-weight:700;font-family:PT Sans,trebuchet ms, sans-serif;text-align:center; color:#69666d;">Order Confirmation</td></tr>' + '\n' +
      '<tr><td height="33">&nbsp;</td></tr>' + '\n' +
      '<tr><td style="font-size:16px;line-height:22px; font-weight:700;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d;">Dear ' + userDetails.firstname + ',</td></tr>' + '\n' +
      '<tr><td height="10" style="line-height:10px;font-size:10px"></td></tr>' + '\n' +
      '<tr><td style="font-size:13px;line-height:18px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d;">Thank you for your order ' + purchaseId + '. <!-- As soon as your order is shipped, you will receive an email confirming the shipment along with the tracking number. -->' + '\n';
  if (message.destination == 'domestic')
    toptext = toptext + ' Shortly, you will receive emails directly from the retailers. To cancel or amend an order you will need to contact directly with retailer</td></tr> ' + '\n';
  else
    toptext = toptext + ' You will receive emails from twotap. This may cause a day for processing international orders. To cancel or amend an order you will need to contact  <a href="mailto:support@twotap.com?Subject=Update%20Order%20' + purchaseId + '" target="_blank">support@twotap.com </a> with purchase ID. ' + purchaseId + '</td></tr>\n';

  toptext = toptext + '<tr><td height="10" style="line-height:10px;font-size:10px"></td></tr>';

  // var gradtotaltext ='
  // <tr>
  // <td>
  // <table border="0" cellpadding="0" cellspacing="0" width="100%">
  // <tr>
  // <td width="120" style="font-size:13px;line-height:18px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d; ">Subtotal </td>
  // <td style="font-size:13px;line-height:18px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d;">$'+mathjs.round(subtotal_store, 3)+'</td>
  // </tr>
  // <tr>
  // <td width="120" style="font-size:13px;line-height:18px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d;">Shipping cost</td>
  // <td style="font-size:13px;line-height:18px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d;">'+message.total_prices.shipping_price+'</td>
  // </tr>
  // <tr>
  // <td width="120" style="font-size:13px;line-height:18px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d;">Tax </td>
  // <td style="font-size:13px;line-height:18px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d;">$'+total_tax+'</td>
  // </tr>
  // <tr>
  // <td width="120" style="font-size:13px;line-height:18px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#c71617;">Total </td>
  // <td style="font-size:13px;line-height:18px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#c71617;">'+message.total_prices.final_price+'</td>
  // </tr>
  // </table>
  // </td>
  // </tr>';

  htmltext = '<tr><td height="20"></td></tr>' + '\n';

  for (skey in message.sites) {

    subtotal_store = 0;
    subtotal_storez = 0;

    htmltext = htmltext + '<tr> <!-- Start store --> <!-- Repeat -->' + '\n' +
      '<td>' + '\n' +
      '<table border="0" cellpadding="0" cellspacing="0" width="100%">' + '\n' +
      '<tr><td height="7" style="line-height:7px;font-size:7px;background:#000000"></td></tr>' + '\n' +
      '<tr><td height="1" style="line-height:1px;font-size:1px;background:#ffffff"></td></tr>' + '\n' +
      '<tr><td height="2" style="line-height:2px;font-size:2px;background:#c71617"></td></tr>' + '\n' +

      '<tr>' + '\n' +
      '<td align="center">' + '\n' +
      '<table border="0" cellpadding="0" cellspacing="0" width="100%">' + '\n' +
      '<tr>' + '\n' +
      '<td valign="center" style="border-bottom:1px solid #e5e5e5;padding:10px 0">' + '\n' +
      '<!--[if (gte mso 9)|(IE)]>' + '\n' +
      '<table width="100%" cellpadding="0" cellspacing="0" border="0">' + '\n' +
      '<tr>' + '\n' +
      '<td width="274">' + '\n' +
      '<![endif]-->' + '\n' +
      '<table border="0" cellpadding="0" width="100%" cellspacing="0" align="left" style="max-width:180px" class="ss_wrap100">' + '\n' +
      '<tr>' + '\n' +
      '<td align="left" valign="middle" style="padding-top:15px"><a href="' + message.sites[skey].info.url + '"> <img src="' + message.sites[skey].info.logo + '" title="' + message.sites[skey].info.name + '" alt="" width="100" style="display:inline;border:0;" alt=""></a></td>' + '\n' +

      '</tr>' + '\n' +
      '<tr><td style="font-size:13px;line-height:22px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d;"><span style="font-weight:700;font-size:16px">ORDER :</span>  <br>' + message.sites[skey].order_id + '</td></tr>' + '\n' +
      '</table>' + '\n' +
      '<!--[if (gte mso 9)|(IE)]>' + '\n' +
      '</td>' + '\n' +
      '<![endif]-->' + '\n' +

      '<!--[if (gte mso 9)|(IE)]>' + '\n' +
      '<td width="346">' + '\n' +
      '<![endif]-->' + '\n' +
      '<table border="0" cellpadding="0" width="100%" cellspacing="0" align="left" valign="top" style="max-width:456px;" class="ss_wrap100">' + '\n' +
      '<tr>' + '\n' +
      '<td align="center" valign="top" style="padding-right:10px;width:60%" class="padT20">' + '\n' +
      '<table width="100%" cellpadding="0" cellspacing="0" border="0">' + '\n' +
      '<tr><td style="font-size:16px;line-height:22px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left;font-weight: 700; color:#69666d;">PAYMENT INFO</td></tr>' + '\n' +
      '<tr><td style="font-size:13px;line-height:18px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d;">' + '\n' +
      orderObj.fields_input[skey].noauthCheckout.billing_first_name + ' ' + orderObj.fields_input[skey].noauthCheckout.billing_last_name + '<br>' + '\n' +
      orderObj.fields_input[skey].noauthCheckout.billing_address + '<br>' + '\n' +
      orderObj.fields_input[skey].noauthCheckout.billing_city + ', ' + orderObj.fields_input[skey].noauthCheckout.billing_state + '<br>\n' +

      '</td></tr>' + '\n' +
      '</table>' + '\n' +

      '</td>' + '\n' +
      '<td align="center" valign="top" style="width:40%" class="padT20">' + '\n' +

      '<table width="100%" cellpadding="0" cellspacing="0" border="0">' + '\n' +
      '<tr><td style="font-size:16px;line-height:22px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d;font-weight:700">SHIPPING INFO</td></tr>' + '\n' +
      '<tr><td style="font-size:13px;line-height:18px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d;">' + '\n' +
      orderObj.fields_input[skey].noauthCheckout.shipping_first_name + ' ' + orderObj.fields_input[skey].noauthCheckout.shipping_last_name + '<br>' + '\n' +
      orderObj.fields_input[skey].noauthCheckout.shipping_address + '<br>' + '\n' +
      orderObj.fields_input[skey].noauthCheckout.shipping_city + ', ' + orderObj.fields_input[skey].noauthCheckout.shipping_state + '<br>\n' +
      '</td></tr>' + '\n' +
      '</table>' + '\n' +
      '</td>' + '\n' +
      '</tr>' + '\n' +
      '</table>' + '\n' +
      '<!--[if (gte mso 9)|(IE)]>' + '\n' +
      '</td>' + '\n' +
      '</tr>' + '\n' +
      '</table>' + '\n' +
      '<![endif]-->' + '\n' +
      '</td>' + '\n' +
      '</tr>' + '\n' +
      '</table>' + '\n' +
      '</td>' + '\n' +
      '</tr>' + '\n' +
      '<tr> <!-- Start Product -->' + '\n' +
      '<td>' + '\n' +
      '<table border="0" cellpadding="0" cellspacing="0" width="100%">' + '\n';

    producttext = '';

    for (pro in message.sites[skey].products) {
      producttext = producttext + '<tr> <!-- Repeat -->' + '\n' +
        '<td align="center">' + '\n' +
        '<table border="0" cellpadding="0" cellspacing="0" width="100%">' + '\n' +
        '<tr>' + '\n' +
        '<td valign="center" style="padding:10px 0">' + '\n' +
        '<!--[if (gte mso 9)|(IE)]>' + '\n' +
        '<table width="100%" cellpadding="0" cellspacing="0" border="0">' + '\n' +
        '<tr>' + '\n' +
        '<td width="274">' + '\n' +
        '<![endif]-->' + '\n' +
        '<table border="0" cellpadding="0" width="100%" cellspacing="0" align="left" style="max-width:180px" class="ss_wrap100">' + '\n' +
        '<tr>' + '\n' +
        '<td align="left" valign="middle" width="150"><img src="' + message.sites[skey].products[pro].image + '" alt="" width="100" style="display:inline;border:0;" alt=""></td>' + '\n' +
        '</tr>' + '\n' +
        '</table>' + '\n' +
        '<!--[if (gte mso 9)|(IE)]>' + '\n' +
        '</td>' + '\n' +
        '<![endif]-->' + '\n' +

        '<!--[if (gte mso 9)|(IE)]>' + '\n' +
        '<td width="346">' + '\n' +
        '<![endif]-->' + '\n' +
        '<table border="0" cellpadding="0" width="100%" cellspacing="0" align="left" valign="top" style="max-width:456px;" class="ss_wrap100">' + '\n' +
        '<tr>' + '\n' +
        '<td align="center" valign="top" style="padding-right:10px;width:60%" class="padT20">' + '\n' +
        '<table width="100%" cellpadding="0" cellspacing="0" border="0">' + '\n' +
        '<tr>' + '\n' +
        '<td align="center" valign="top" style="padding-right:10px;" class="padR0">' + '\n' +
        '<table width="100%" cellpadding="0" cellspacing="0" border="0">' + '\n' +
        '<tr><td style="font-size:16px;line-height:22px;font-weight: 700; font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d;">' + message.sites[skey].products[pro].title + '</td></tr>' + '\n' +
        '<tr><td style="font-size:13px;line-height:18px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d;">' + orderObj.userCart.sites[skey].add_to_cart[pro].brand + '</td></tr>' + '\n' +
        '<tr><td style="font-size:13px;line-height:18px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d;">Web ID : <br> ' + orderObj.userCart.sites[skey].add_to_cart[pro].catalogId + '</td></tr>' + '\n';

      if (message.sites[skey].products[pro].input_fields.hasOwnProperty('size')) {
        producttext = producttext + '<tr><td style="font-size:13px;line-height:18px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d;">Size : ' + message.sites[skey].products[pro].input_fields.size + '</td></tr>' + '\n';

      }
      if (message.sites[skey].products[pro].input_fields.hasOwnProperty('color')) {
        producttext = producttext + '<tr><td style="font-size:13px;line-height:18px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d;">Color :<img src="' + message.sites[skey].products[pro].input_fields.color + '" width="20" height="20" style="display:inline;padding-left:8px"></td></tr>' + '\n';

      }

      // <tr><td style="font-size:13px;line-height:18px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d;padding-top:10px"><span>Promotion ( 40% off ! )</span> <span style="color:#c71617">- $50</span></td></tr>
      producttext = producttext + '</table>' + '\n' +
        '</td>' + '\n' +
        '</tr>' + '\n' +
        '</table>' + '\n' +

        '</td>' + '\n' +
        '<td align="center" valign="top" style="width:40%" class="padT20">' + '\n' +

        '<table width="100%" cellpadding="0" cellspacing="0" border="0">' + '\n' +
        '<tr><td style="font-size:13px;line-height:22px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d;">Qty : ' + message.sites[skey].products[pro].input_fields.quantity;
      if (message.sites[skey].products[pro].status == 'done')
        producttext = producttext + '<span style="padding-left:10px">In stock</span>';
      else
        producttext = producttext + '<span style="padding-left:10px">Out of stock</span>';

      producttext = producttext + '</td></tr>' + '\n';

      producttext = producttext + '<tr><td style="font-size:13px;line-height:22px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d">Price : $';

      itemprice = message.sites[skey].products[pro].price;
      itemprice_sub = itemprice.slice(1);
      itemprice_number = parseFloat(itemprice_sub);
      itemprice_number_total = itemprice_number * message.sites[skey].products[pro].input_fields.quantity;

      producttext = producttext + mathjs.round(itemprice_number_total, 3);

      if (message.sites[skey].products[pro].status == 'done') // will consider only when
      {
        subtotal_full = subtotal_full + itemprice_number_total;
        subtotal_store = subtotal_store + itemprice_number_total;
      }

      producttext = producttext + '</td></tr>\n' +
        '</table>' + '\n' +
        '</td>' + '\n' +
        '</tr>' + '\n' +
        '</table>' + '\n' +
        '<!--[if (gte mso 9)|(IE)]>' + '\n' +
        '</td>' + '\n' +
        '</tr>' + '\n' +
        '</table>' + '\n' +
        '<![endif]-->' + '\n' +
        '</td>' + '\n' +
        '</tr>' + '\n' +
        '</table>' + '\n' +
        '</td>' + '\n' +
        '</tr>' + '\n';

    }// product for end

    htmltext = htmltext + producttext;
    var sales_tax_store = 0;
    var coupon_value_splice;

    if (message.sites[skey].prices.hasOwnProperty('sales_tax')) {

      console.log('sales tax available ');

    }
    else {
      console.log(message.sites[skey].prices);
      var final_price_store = message.sites[skey].prices.final_price; // get final price
      var final_price_store_splice = final_price_store.slice(1);      // remove $ sign
      var final_price_store_number = parseFloat(final_price_store_splice); // convert to number

      var shipping_price_store = message.sites[skey].prices.shipping_price;

      var shipping_price_store_slice;

      if (shipping_price_store == 'FREE!' || shipping_price_store == 'FREE')
        shipping_price_store_slice = 0;
      else
        shipping_price_store_slice = shipping_price_store.slice(1);  // remove dollar sign

      var shipping_price_store_num = parseFloat(shipping_price_store_slice);

      if (message.sites[skey].prices.hasOwnProperty('coupon_value')) {
        coupon_value_splice = message.sites[skey].prices.coupon_value.slice(1);
        var coupon_value_store_num = parseFloat(coupon_value_splice);

        sales_tax_store = final_price_store_number + coupon_value_store_num - subtotal_store - shipping_price_store_num;

      }
      else {
        sales_tax_store = final_price_store_number - subtotal_store - shipping_price_store_num;
      }

      message.sites[skey].prices.sales_tax = '$' + mathjs.round(sales_tax_store, 3);

    }

    subtotal_storez = mathjs.round(subtotal_store, 3);

    htmltext = htmltext + '</table>' + '\n' +
      '</td>' + '\n' +
      '</tr> <!-- End store -->' + '\n' +
      '<!-- End Product -->' + '\n' +
      '<tr><td height="20"></td></tr>' + '\n' +
      '<tr>' + '\n' +
      '<td align="center">' + '\n' +
      '<table border="0" cellpadding="0" cellspacing="0" width="100%">' + '\n' +
      '<tr>' + '\n' +
      '<td valign="center" style="padding:10px 0">' + '\n' +
      '<!--[if (gte mso 9)|(IE)]>' + '\n' +
      '<table width="100%" cellpadding="0" cellspacing="0" border="0">' + '\n' +
      '<tr>' + '\n' +
      '<td width="274">' + '\n' +
      '<![endif]-->' + '\n' +
      '<table border="0" cellpadding="0" width="100%" cellspacing="0" align="left" style="max-width:410px" class="ss_wrap100">' + '\n' +
      '<tr><td style="font-size:13px;line-height:18px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d;">' + '\n' +
      'Note : For customer protection all order are subject for review. On occasion this may cause a slightly delay in processing your order.' + '\n';

    if (orderObj.fields_input[skey].noauthCheckout.shipping_country = 'United States of America') {
      htmltext = htmltext + 'You will receive emails directly from the retailer ' + message.sites[skey].info.name + '.  To cancel or amend an order you will need to contact <a href="' + message.sites[skey].info.url + '" target="_blank">' + message.sites[skey].info.name + ' </a> directly using order id ' + message.sites[skey].order_id + '\n';
    }
    else
      htmltext = htmltext + 'It might take 1 day for process international order. You will receive emails from the twotap. To cancel or amend an order you will need to contact <a href="mailto:support@twotap.com?Subject=Order%20' + purchaseId + '" target="_blank">support@twotap.com </a> using purchase id ' + purchaseId + '\n';

    htmltext = htmltext + 'Your patient is greatly appreciated \n';
    htmltext = htmltext + ' For other question please visit the <a href="http://104.236.166.98/#!/help" target="_blank" style="color:#69666d;text-decoration:underline">help section</a> on our website or contact our <a href="mailto:rv@sociallyshoppable.com?Subject=Order%20' + purchaseId + '" target="_top" style="color:#69666d;text-decoration:underline">Customer Service Department</a></td></tr>' + '\n' +
      '<tr><td height="20"></td></tr>' + '\n' +
      '<tr><td style="font-size:13px;line-height:18px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d;"> </td></tr>' + '\n' +

      '</table>' + '\n' +
      '<!--[if (gte mso 9)|(IE)]>' + '\n' +
      '</td>' + '\n' +
      '<![endif]-->' + '\n' +

      '<!--[if (gte mso 9)|(IE)]>' + '\n' +
      '<td width="346">' + '\n' +
      '<![endif]-->' + '\n' +
      '<table border="0" cellpadding="0" width="100%" cellspacing="0" align="left" valign="top" style="max-width:26px;" class="hide">' + '\n' +
      '<tr><td width="26" style="font-size:20px;line-height:20px">&nbsp;</td></tr>' + '\n' +
      '</table>' + '\n' +
      '<!--[if (gte mso 9)|(IE)]>' + '\n' +
      '</td>' + '\n' +
      '</tr>' + '\n' +
      '</table>' + '\n' +
      '<![endif]-->' + '\n' +

      '<!--[if (gte mso 9)|(IE)]>' + '\n' +
      '<td width="346">' + '\n' +
      '<![endif]-->' + '\n' +
      '<table border="0" cellpadding="0" width="100%" cellspacing="0" align="left" valign="top" style="max-width:200px;" class="ss_wrap100">' + '\n' +
      '<tr>' + '\n' +
      '<td align="center" valign="top" style="padding-right:10px" class="padT20">' + '\n' +
      '<table width="100%" cellpadding="0" cellspacing="0" border="0">' + '\n' +
      '<tr>' + '\n' +
      '<td width="120" style="font-size:13px;line-height:22px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d;">Subtotal </td>' + '\n' +
      '<td style="font-size:13px;line-height:22px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d;">$' + subtotal_storez + '</td>' + '\n' +
      '</tr>' + '\n' +
      '<tr>' + '\n' +
      '<td width="120" style="font-size:13px;line-height:22px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d;">Shipping cost</td>' + '\n' +
      '<td style="font-size:13px;line-height:22px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d;">' + message.sites[skey].prices.shipping_price + '</td>' + '\n' +
      '</tr>' + '\n' +
      '<tr>' + '\n' +
      '<td width="120" style="font-size:13px;line-height:22px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d;">Tax </td>' + '\n' +
      '<td style="font-size:13px;line-height:22px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d;">' + message.sites[skey].prices.sales_tax + '</td>' + '\n' +
      '</tr>' + '\n';

    if (message.sites[skey].prices.hasOwnProperty('coupon_value')) {
      htmltext = htmltext + '<tr>' + '\n' +
        '<td width="120" style="font-size:13px;line-height:22px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d;">Coupon </td>' + '\n' +
        '<td style="font-size:13px;line-height:22px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d;">-' + message.sites[skey].prices.coupon_value + '</td>' + '\n' +
        '</tr>' + '\n';
    }
    htmltext = htmltext + '<tr>' + '\n' +
      '<td width="120" style="font-size:13px;line-height:22px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d;">Total </td>' + '\n' +
      '<td style="font-size:13px;line-height:22px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d;">' + message.sites[skey].prices.final_price + '</td>' + '\n' +
      '</tr>' + '\n' +

      '</table>' + '\n' +

      '</td>' + '\n' +

      '</tr>' + '\n' +
      '</table>' + '\n' +
      '<!--[if (gte mso 9)|(IE)]>' + '\n' +
      '</td>' + '\n' +
      '</tr>' + '\n' +
      '</table>' + '\n' +
      '<![endif]-->' + '\n' +
      '</td>' + '\n' +
      '</tr>' + '\n' +
      '</table>' + '\n' +
      '</td>' + '\n' +
      '</tr>' + '\n' +
      '<tr><td height="20"></td></tr>' + '\n' +
      '</table>' + '\n' +
      '</td>' + '\n' +
      '</tr> <!-- End store -->' + '\n';

  }

  var s_tax;
  var s_tax_slice;
  var total_tax;
  var tax_available = false;
  var sub = false;
  var total_ship;
  var tp;
  if (message.total_prices.hasOwnProperty('subtotal')) {

    subtotal_full = message.total_prices.subtotal.slice(1);
    sub = true;
  }

  if (message.total_prices.hasOwnProperty('sales_tax')) // WHEN SUB TOTAL NOT THERE WE CAN USE SALES TAX TO GET SUBTOTAL
  {

    s_tax = message.total_prices.sales_tax;
    s_tax_slice = s_tax.slice(1);
    total_tax = parseFloat(s_tax_slice);
    tax_available = true;

    tp = message.total_prices.final_price;
    var j = tp.slice(1);
    var total = parseFloat(j);

    var shippingx = message.total_prices.shipping_price;
    var shipping_slice;
    if (shippingx == 'FREE!' || shippingx == 'FREE')
      shipping_slice = 0;
    else
      shipping_slice = shippingx.slice(1);

    total_ship = parseFloat(shipping_slice);

    if (message.total_prices.hasOwnProperty('coupon_value'))
      console.log('use total price please '); // when coupon there use calculation to show subtotal
    else if (tax_available)                  // when coupon not available and tax is there
    {

      if (!sub)			 // use deduction if already subotal from api  not  available and there we can use
      {                  // coupon not available as well
        subtotal = total - total_tax - total_ship;
        subtotal_full = mathjs.round(subtotal, 3);

      }
    }

  }
  else // WHEN SALES TAX AND SUB TOTAL BOTH UNAVAILABLE
  {

    tp = message.total_prices.final_price;
    var j = tp.slice(1);
    var total = parseFloat(j);

    var shippingx = message.total_prices.shipping_price;
    var shipping_slice;
    if (shippingx == 'FREE!' || shippingx == 'FREE')
      shipping_slice = 0;
    else
      shipping_slice = shippingx.slice(1);

    total_ship = parseFloat(shipping_slice);

    if (message.total_prices.hasOwnProperty('coupon_value')) {
      console.log('use total price please '); // when coupon there use calculation to show subtotal
      var tot_splice_coupon = message.total_prices.coupon_value.slice(1);
      var tot_coupon_num = parseFloat(tot_splice_coupon);
      total_tax = total + tot_coupon_num - total_ship - subtotal_full;
    }
    else
      total_tax = total - total_ship - subtotal_full;

    if (!sub)
      subtotal_full = mathjs.round(subtotal_full, 3);

  }

  var total_taxz;
  if (message.total_prices.hasOwnProperty('sales_tax')) {

    total_taxz = message.total_prices.sales_tax;
  }
  else
    total_taxz = '$' + mathjs.round(total_tax, 3);

  var gradtotaltext = '<tr>' + '\n' +
      '<td>' + '\n' +
      '<table border="0" cellpadding="0" cellspacing="0" width="100%">' + '\n' +
      '<tr>' + '\n' +
      '<td width="120" style="font-size:13px;line-height:18px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d; ">Subtotal </td>' + '\n' +
      '<td style="font-size:13px;line-height:18px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d;">$' + subtotal_full + '</td>' + '\n' +
      '</tr>' + '\n' +
      '<tr>' + '\n' +
      '<td width="120" style="font-size:13px;line-height:18px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d;">Shipping cost</td>' + '\n' +
      '<td style="font-size:13px;line-height:18px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d;">' + message.total_prices.shipping_price + '</td>' + '\n' +
      '</tr>' + '\n' +
      '<tr>' + '\n' +
      '<td width="120" style="font-size:13px;line-height:18px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d;">Tax </td>' + '\n' +
      '<td style="font-size:13px;line-height:18px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d;">' + total_taxz + '</td>' + '\n' +
      '</tr>' + '\n';
  if (message.total_prices.hasOwnProperty('coupon_value'))
    gradtotaltext = gradtotaltext + '<tr>' + '\n' +
      '<td width="120" style="font-size:13px;line-height:18px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#c71617;">Coupon </td>' + '\n' +
      '<td style="font-size:13px;line-height:18px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#c71617;">-' + message.total_prices.coupon_value + '</td>' + '\n' +
      '</tr>' + '\n';

  gradtotaltext = gradtotaltext + '<tr>' + '\n' +
    '<td width="120" style="font-size:13px;line-height:18px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#c71617;">Total </td>' + '\n' +
    '<td style="font-size:13px;line-height:18px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#c71617;">' + message.total_prices.final_price + '</td>' + '\n' +
    '</tr>' + '\n' +
    '</table>' + '\n' +
    '</td>' + '\n' +
    '</tr>' + '\n';
  htmltext = toptext + gradtotaltext + htmltext;

  htmltext = htmltext + '<tr><td height="5" style="line-height:5px;font-size:5px;background:#000000"></td></tr>' + '\n' +
    '<tr><td height="20"></td></tr>' + '\n' +
    '<tr><td style="font-size:13px;line-height:18px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d;">Summary : ' + message.final_message + '</td></tr>' + '\n' +
    '<tr><td height="20"></td></tr>' + '\n' +
    '<tr><td style="font-size:13px;line-height:18px;font-family:PT Sans,trebuchet ms, sans-serif;text-align:left; color:#69666d;">Note : To cancel or amend a domestic order(within US) you will need to contact the retailer directly, whereas to cancel or amend International(outside US) order you will need to contact support@twotap.com. Please review individual store return policy for Domestic order. Socially Shoppable will not take any responsibility for any problem. If there is a payment problem, or the order cannot be placed due to a technical issue, please email <a href="mailto:rajib_2002bd@yahoo.com?Subject=Issue%20Order%20' + purchaseId + '" target="_top" style="color:#69666d;text-decoration:underline">SS TEAM</a> and we will look into it with immediate action.</td></tr>' + '\n' +
    '<tr><td height="40"></td></tr>' + '\n' +

    '<tr>' + '\n' +
    '<td align="center">' + '\n' +
    '<table border="0" cellpadding="0" width="100%" cellspacing="0" align="center" valign="top" style="max-width:220px;">' + '\n' +
    '<tr><td style="font-size:13px;font-weight: 700; line-height:18px;font-family:PT Sans,trebuchet ms, sans-serif;background:#000000;color:#ffffff;text-align:center"><a href="http://104.236.166.98/#!/confirmation_placed_view/' + purchaseId + '/' + user_id + '" style="display: block;padding:5px 10px; text-decoration:none;color:#ffffff">VIEW DETAILS</a> </td></tr>' + '\n' +
    '</table>' + '\n' +
    '</td>' + '\n' +
    '</tr>' + '\n' +
    '<tr><td height="44">&nbsp;</td></tr>' + '\n' +

    '<!--// End Footer -->' + '\n' +
    '<tr><td height="44">&nbsp;</td></tr>' + '\n' +
    '<tr><td style="display:none;white-space:nowrap; line-height:1px;font-size:15px;color:#ffffff;mso-hide:all">' + '\n' +
    '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -' + '\n' +
    '</td></tr>' + '\n' +
    '</table>' + '\n' +
    '</td>' + '\n' +
    '</tr>' + '\n' +
    '</table>' + '\n' +
    '</td>' + '\n' +
    '</tr>' + '\n' +
    '</table>' + '\n' +
    '</body>' + '\n' +
    '</html>' + '\n';

  var from_email = new helper.Email('logistics@sociallyshoppable.com');
  var to_email = new helper.Email(userDetails.email);
  var subject = 'Purchase Confirmation';
  var content = new helper.Content('text/html', htmltext);
  var mail = new helper.Mail(from_email, subject, to_email, content);
  var sg = require('sendgrid')(config.sendgrid.apiKey);

  var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  });

   sg.API(request, function(error, response) {
    console.log(response.statusCode);

  });
  var from_email2 = new helper.Email(config.assistant.email);
  var to_email2 = new helper.Email(config.admin.email);
  var subject2 = 'Admin Notification : New purchase By '+ userDetails.email;
  var mail2 = new helper.Mail(from_email2, subject2, to_email2, content);

  var request2 = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail2.toJSON()
  });
  
  
  sg.API(request2, function(error, response) {
    console.log(response.statusCode);

  });

	/*
  console.log('sendgrid user email '+userDetails.email);
  var email = new sendgrid.Email({
    to: userDetails.email,
    from: 'logistics@sociallyshoppable.com',
    subject: 'Purchase Information',
    text: message.final_message + '\n' +
    'Purchase Details : ' + message.purchase_data + '\n\n SS Team',
    html: htmltext
  });

  sendgrid.send(email, function (err, json) {
    if (err) {
      return console.error(err);
    }
    console.log("email send to user");
    console.log(json);

  });

  var email_order = new sendgrid.Email({
    to: 'rajib_2002bd@yahoo.com',
    from: 'logistics@sociallyshoppable.com',
    subject: 'Purchase Information',
    text: message.final_message + '\n\n ' +
    ' Your Purchase Id ' + userDetails.purchase_id + '\n' +
    ' To view your order use this link http://104.236.166.98/#!/confirmation_placed_view/' + userDetails.purchase_id + '\n\n' +
    ' Note : To cancel or amend a domestic order(within US) you will need to contact the retailer directly, using above retailer provided order id,+ \n whereas to cancel or amend International(outside US) order you will need to contact support@twotap.com using ' + userDetails.purchase_id + ' ID.\n Please review individual store return policy for Domestic order. Socially Shoppable will not take any responsibility for any problem. If there is a payment problem, or the order cannot be placed due to a technical issue, please email customercare@ss.com and we will look into it with immediate action.' + '\n\n' +
    ' Thanks - Socially Shoppable Team'

  });

  sendgrid.send(email_order, function (err, json) {
    if (err) {
      return console.error(err);
    }
    console.log("email send to admin");
    console.log(json);

  });

  */

};
