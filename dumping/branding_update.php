<?php
include_once 'models.php';
use MongoDB\BSON\UTCDateTime;
use Cake\Utility\Hash;
use MongoDB\BSON\ObjectID;

$nowTime   = new UTCDateTime();
$lastHours = new UTCDateTime(strtotime('-72hours')*1000);

$modelBrands = new bbrandprosperents();

$modelBrands   = new bbrandprosperents();
$brandsResults = $modelBrands->find([]);


foreach ($brandsResults as $res) {

    $id = new ObjectID($res->_id);

    $updateData = [];

    $updateData['brand'] = strtolower(trim($res->brand));

    $char = $updateData['brand'][0];

    if (is_numeric($char) === true || ctype_alpha($char) === false) {
        $char = '#';
    }

    $updateData['pack'] = $char;
    if (isset($res->numProducts)) {
        $updateData['is_featured'] = true;
    }

    try {
        $modelBrands->updateOne(['_id' => $id], ['$set' => $updateData]);
    } catch (Exception $ex) {
        pr($ex->getMessage());
    }
}

exit;