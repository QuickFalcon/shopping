<?php
include_once 'models.php';
use MongoDB\BSON\UTCDateTime;
use TwoTap\Api;
use Cake\Utility\Hash;

$nowTime   = new UTCDateTime();
$lastHours = new UTCDateTime(strtotime('-72hours')*1000);

$modelBrands = new bbrandprosperents();

$modelBrands   = new bbrandprosperents();
$brandsResults = $modelBrands->find([], ['projection' => ['brand' => 1, '_id' => 0]]);

$brandsResults = object2Array($brandsResults);

$brandsResults = Hash::combine($brandsResults, '{n}.brand', '{n}.brand');


$modelProduct = new sss_products();
$results      = $modelProduct->find([], ['projection' => ['brand' => 1, '_id' => 0]]);

$results = object2Array($results);

$results = Hash::combine($results, '{n}.brand', '{n}.brand');

$results = array_filter($results);

foreach ($results as $res) {
    if (in_array($res, $brandsResults) === false) {
        try {
            $modelBrands->insertOne(
                ['brand' => strtolower(trim($res))]
            );
        } catch (Exception $ex) {
            //pr($ex->getMessage());
        }
    }
}

exit;