<?php
include_once 'models.php';
use MongoDB\BSON\UTCDateTime;
use TwoTap\Api;
use Cake\Utility\Hash;

$nowTime   = new UTCDateTime();
$lastHours = new UTCDateTime(strtotime('-72hours')*1000);

$modelBrands = new bbrandprosperents();

$results = $modelBrands->find([], ['projection' => ['_id' => 0]]);


foreach ($results as $res) {
    $modelBrands->updateMany(
        ['brand' => $res->brand],
        ['$set' => ['brand' => strtolower(trim($res->brand))]]
    );
}

pr($results);
exit;


$modelProduct = new sss_products();
$results      = $modelProduct->find([], ['projection' => ['brand' => 1, '_id' => 0]]);


$results = object2Array($results);

$results = Hash::combine($results, '{n}.brand', '{n}.brand');

$results = array_filter($results);

pr(count($results));
pr($results);
exit;

foreach ($results as $res) {
    $modelProduct->updateMany(
        ['brand' => $res],
        ['$set' => ['brand' => strtolower(trim($res))]]
    );
}

pr(count($results));
pr($results);
exit;