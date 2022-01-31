'use strict';

/**
 * Module dependencies
 */
var store = require('../controllers/store.controllers');

module.exports = function (app) {

  app.route('/add_storesyncignorelist')
    .post(store.addStoreSyncIgnorelist);

  app.route('/del_storesyncignorelist')
    .post(store.delStoreSyncIgnorelist);

  app.route('/getAllProsperentStore')
  .post(store.getAllProsperentStore);

  app.route('/getAllTwotapStore')
  .post(store.getAllTwotapStore);

  app.route('/getCommonStoreCsv')
  .post(store.getCommonStoreCsv);
   // import from database
  app.route('/get_storelist_api_database')
    .get(store.storelistapidatabase);

  app.route('/get_storeList_cache')
    .get(store.getStoreListCache);

  app.route('/get_storelistSyncImage')
    .get(store.storelistSyncImage);

  app.route('/get_storesyncignorelist')
  .get(store.getStoreSyncIgnorelist);

  app.route('/get_storelistCSV')
    .get(store.storelistCSV);

   // get details store data
  app.route('/get_storelistSlider')
    .post(store.storelistSlider);

  app.route('/store_save')
    .post(store.storeSave);

  app.route('/store_update')
    .post(store.storeUpdate);

  app.route('/store_get/:storeid')
    .get(store.storeGet);

  app.route('/get_cmn_merchants')
  .post(store.getCmnMerchants);

  app.route('/common_mer_delete_All')
    .get(store.commonMerDeleteAll);

  app.route('/store_delete_All')
    .get(store.storeDeleteAll);

  app.route('/get_supported_merchants')
  .post(store.getSupportedMerchants);

  app.route('/get_top_stores')
    .get(store.getTopStores);

  // app.route('/get_feature_store/:menuItem')
    // .get(store.getFeatureStore);

  app.route('/import_TwotapStore_CSV')
    .post(store.importTwotapStoreCSV);

  app.route('/storelist')
    .post(store.storelist);

  app.route('/sync_stores_add')
    .post(store.syncStoresAdd);

  app.route('/sync_stores_add_common')
    .post(store.syncStoresAddCommon);

  // app.route('/feature_store_save')
    // .post(store.featureStoreSave);

  app.route('/store_delete/:storeid')
    .delete(store.storeDelete);

  app.route('/merchants_apisearch')
    .get(store.merchantsApisearch);

  app.route('/merchant/:merchant')
    .get(store.merchant);

};

