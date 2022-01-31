<?php
include_once 'models.php';
use MongoDB\BSON\ObjectID;
use Cake\Utility\Hash;

$modelSsSupportedSites     = new sss_supported_sites();
$modelTwoTapSupportedSites = new ttwo_tap_supported_sites();

$modelStoreProsperents = new sstoreprosperents();
$modelProduct          = new sss_products();

$resTwoTapSupportedSites = $modelTwoTapSupportedSites->find(
    [],
    ['projection' => ['_id' => 0]]
);
$resTwoTapSupportedSites = object2Array($resTwoTapSupportedSites);
$resTwoTapSupportedSites = Hash::combine($resTwoTapSupportedSites, '{n}.url', '{n}');

$resStoreProsperents = $modelStoreProsperents->find(
    [],
    ['projection' => ['_id' => 0, 'domain' => 1, 'merchantId' => 1, 'merchant' => 1]]
);

if ($resStoreProsperents !== []) {
    $modelSsSupportedSites->deleteMany([]);
    $matchedSites = [];

    foreach ($resStoreProsperents as $store) {
        if (isset($resTwoTapSupportedSites[$store->domain]) === true) {
            $matchedSite               = $resTwoTapSupportedSites[$store->domain];
            $matchedSite['merchantId'] = $store->merchantId;
            $matchedSite['merchant']   = $store->merchant;
            $matchedSite['count']      = $modelProduct->count(['merchantId' => $store->merchantId, 'available' => true]);
            $matchedSites[]            = $matchedSite;
        }
    }

    if ($matchedSites !== []) {
        $modelSsSupportedSites->insertMany($matchedSites);

        pr($matchedSites);
    }
}

exeTime();

exit;