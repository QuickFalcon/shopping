<?php
include_once 'models.php';
use MongoDB\BSON\UTCDateTime;
use Cake\Utility\Hash;

$nowTime     = new UTCDateTime();
$last24Hours = new UTCDateTime(strtotime('-1day')*1000);

// Get list of Stores.
$modelStore = new sstoreprosperents();
$resStore   = $modelStore->find();

$resStore = object2Array($resStore);

// Initiate the Product Model.
$modelProduct = new pproductprosperents();

foreach ($resStore as $key => $store) {

    $merchantId = $store['merchantId'];

    $merchantProducts = $modelProduct->count(['merchantId' => $merchantId]);

    $updateData['$set']['numDownloaded'] = $merchantProducts;

    $modelStore->updateOne(['merchantId' => "$merchantId"], $updateData);

    $indexArr['numProducts']         = $store['numProducts'];
    $indexArr['numProductsInserted'] = $merchantProducts;
    $indexArr['counter']             = $key;
    pr($indexArr);
}

exeTime();
