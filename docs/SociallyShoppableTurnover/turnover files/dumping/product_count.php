<?php
include_once 'models.php';
use MongoDB\BSON\UTCDateTime;

// Get list of Stores.
$modelStore = new sstoreprosperents();
$resStore   = $modelStore->find([]);

$totalGrouped = [];

$resStoreHas = [];

foreach ($resStore as $key => $store) {
    if ($store->numProducts <= 0) {
        $totalExpected['lte_0']['m'] += 1;
        $totalExpected['lte_0']['e'] += 1;
    } else {
        if ($store->numProducts <= 1000) {
            $totalExpected['lte_1000']['m'] += 1;
            $totalExpected['lte_1000']['e'] += $store->numProducts;
            $totalExpected['lte_1000']['d'] += $store->numDownloaded;
        } else {
            $totalExpected['gt_1000']['m'] += 1;
            $totalExpected['gt_1000']['e'] += $store->numProducts;
            $totalExpected['gt_1000']['d'] += $store->numDownloaded;
        }

        $totalExpected['total_gt_0']['m'] += 1;
        $totalExpected['total_gt_0']['e'] += $store->numProducts;
        $totalExpected['total_gt_0']['d'] += $store->numDownloaded;

        $temp = [];

        $temp['expected']   = $store->numProducts;
        $temp['downloaded'] = $store->numDownloaded;
        //$temp['lastUpdated'] = $store->lastUpdated->toDateTime();
        $temp['merchant']   = $store->merchant;
        $temp['merchantId'] = $store->merchantId;

        $totalGrouped[] = $temp;
    }
}

pr($totalExpected);

$productModel = new pproductprosperents();

$res = $productModel->count();
pr(['total_downloaded' => $res]);

$res2 = $productModel->count(['available' => true]);
pr(['total_available' => $res2]);

pr($totalGrouped);

exeTime();
