<?php
include_once 'models.php';
use MongoDB\BSON\UTCDateTime;
use MongoDB\BSON\ObjectID;
use TwoTap\Api;
use Cake\Utility\Hash;

$nowTime    = new UTCDateTime();
$lastHours  = new UTCDateTime(strtotime('-8days')*1000);
$last2Hours = new UTCDateTime(strtotime('-2hours')*1000);

$modelTwoTapSupportedSites = new ttwo_tap_supported_sites();

$apiConfig['test_mode'] = 'fake_confirm';

$apiConfig['finished_product_attributes_format'] = 'flat';

$api = new Api($apiConfig);

$country = 'us';

$supportedSites = $api->utils()->supportedSites($country);

if ($supportedSites !== []) {
    $modelTwoTapSupportedSites->deleteMany([]);
    $modelTwoTapSupportedSites->insertMany($supportedSites);
}

exeTime();

exit;