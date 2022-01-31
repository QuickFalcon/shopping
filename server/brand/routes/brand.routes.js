'use strict';

/**
 * Module dependencies
 */
var brand = require('../controllers/brand.controllers');

module.exports = function (app) {

  app.route('/get_cmn_brands') // get brand list
    .post(brand.getCmnBrands);

  app.route('/get_brand_search')
    .post(brand.getBrandSearch);
  app.route('/get_brand_search_specific')
    .post(brand.getBrandSearchSpecific);

  app.route('/get_brandList_cache')
    .post(brand.getBrandListCache);

  app.route('/brand_delete_all')
    .post(brand.brandDeleteAll);

  app.route('/brand_delete_specific')
    .post(brand.brandDeleteSpecific);

  app.route('/brand_update')
    .post(brand.brandUpdate);

  // define upload brand table from text file
  app.route('/get_all_brand_from_text')
    .post(brand.getAllBrandFromText);

  app.route('/sync_brands_add')
    .post(brand.syncBrandsAdd);
};
