'use strict';

/**
 * Module dependencies
 */
var category = require('../controllers/category.controllers');

module.exports = function (app) {
  
  app.route('/get_category_twotap') // category for twotap
      .post(category.getCategoryTwotap);


  app.route('/category/:cat')
    .get(category.categoryApi);

  app.route('/autosuggestioncat/:cat')
    .get(category.autosuggestion);
  // get category list from cache otherwise make cache
  app.route('/get_categoryList_cache')
    .post(category.getCategoryListCache);

  app.route('/get_level_one_category')
    .post(category.getLevelOneCategory);

  app.route('/get_category_child')
    .post(category.getCategoryChild);

  app.route('/get_category_det')
    .post(category.getCategoryDet);

  app.route('/get_catagory_straight_forward')
    .post(category.getCatagoryStraightForward);

  app.route('/category_delete_prosper')
    .post(category.categoryDeleteProsper);

  app.route('/create_custom_category')
    .post(category.createCustomCategory);

  app.route('/get_all_custom_category')
    .post(category.getAllCustomCategory);

  app.route('/get_mapped_words')
    .post(category.getMappedWords);	
  



  app.route('/get_custom_category_cid')
    .post(category.getCustomCategoryCid);

  app.route('/get_custom_category_parent')
    .post(category.getCustomCategoryParent);

  app.route('/update_custom_category_parent')
      .post(category.updateCustomCategoryParent);

  app.route('/delete_custom_category')
    .post(category.deleteCustomCategory);

  app.route('/update_custom_category')
    .post(category.updateCustomCategory);

  app.route('/get_all_catagories_from_csv')
    .post(category.getAllCatagoriesFromCsv);
  // store inside categoryprosperentsyncs collection
  app.route('/catagories_from_csv_straight_forward')
    .post(category.catagoriesFromCsvStraightForward);

  app.route('/category_delete_All')
    .post(category.categoryDeleteAll);
};
