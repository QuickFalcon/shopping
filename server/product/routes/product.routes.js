'use strict';

/**
 * Module dependencies
 */
var product = require('../controllers/product.controllers');
var productDb = require('../controllers/productDb.controllers');

module.exports = function (app) {

  // main product search
  // app.route('/product_apisearch')
    // .post(product.productApisearch);

  // app.route('/product_apisearch_correct')
    // .post(product.productApisearchCorrect);

  // app.route('/product_apisearch_main')
    // .post(product.productApisearchMain);

  // app.route('/productApisearchInterval')
    // .post(product.productApisearchInterval);

  // app.route('/product_apiTrend')
    // .post(product.productApisearchTrend);

  // app.route('/wp_product_apisearch/:path')
   // .get(product.wpproductApisearch);

  // app.route('/product_apisearch_productcount')
    // .post(product.productApisearchProductcount);

  // app.route('/catalogapi/:item')
    // .get(product.catalogApisearch);

  // app.route('/product/:item')
    // .get(product.productItem);

  // app.route('/productmultiple/:pid')
    // .get(product.productmultiple);

  // app.route('/suggestion/:sugpath')
    // .get(product.suggestions);

  // app.route('/autocomplete')
    // .get(product.autocomplete);

  // app.route('/autosuggestion')
    // .get(product.autosuggestion);

  // app.route('/catalog_pro_sync/:item')
    // .get(product.catalogProSync);

  // app.route('/productoriginalurl')
    // .post(productDb.productoriginalurl);

  app.route('/productslist/:fullpath')
    .get(productDb.productslistfullpath);

  app.route('/productcount')
    .post(productDb.productcount);

  app.route('/productResult')
    .post(productDb.productResult);



  app.route('/productResultCount')
    .post(productDb.productResultCount);



  app.route('/productResultByCatalogId')
    .post(productDb.productResultByCatalogId);



  app.route('/productUserMulticatalogID')
    .post(productDb.productUserMulticatalogID);

  app.route('/ProductProsperentUpdate')
    .post(productDb.ProductProsperentUpdate);

/*
  app.route('/productlistuser')
    .post(productDb.productlistuser);
*/
  app.route('/productsync')
    .post(productDb.productsync);

  app.route('/productsingleuser/:item')
    .get(productDb.productsingleuser);

  app.route('/productcolor')
    .post(productDb.productcolor);

  app.route('/productcolorname')
    .post(productDb.productcolorname)
    .get(productDb.productcolorname2);

  app.route('/productcolorname/:colcode')
    .get(productDb.productcolornamecolcode);

  app.route('/product_delete_All')
    .post(productDb.productDeleteAll);

  app.route('/sync_products_add')
    .post(productDb.syncProductsAdd);

  app.route('/product_save')
    .post(productDb.productSave);

  app.route('/product_save_multiple')
    .post(productDb.productSaveMultiple);

  app.route('/product_update')
    .post(productDb.productUpdate);

  app.route('/product_update_social')
    .post(productDb.ProductProsperentSocialUpdate);

  app.route('/like_update')
    .post(productDb.likeUpdate);

  app.route('/product_delete/:product_id')
    .delete(productDb.productDelete);
/*
  app.route('/productSuggestion')
    .post(productDb.productSuggestion);
 */
  app.route('/productResultGroupBrand')
    .post(productDb.productResultGroupBrand);

  app.route('/brandInsert')
     .get(productDb.brandInsert);

  app.route('/productResultGroupMerchant')
    .post(productDb.productResultGroupMerchant);

};
