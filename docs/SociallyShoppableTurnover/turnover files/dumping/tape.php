<?php
include_once 'models.php';
use MongoDB\BSON\UTCDateTime;
use MongoDB\BSON\ObjectID;
use TwoTap\Api;

$nowTime   = new UTCDateTime();
$lastHours = new UTCDateTime(strtotime('10minutes')*1000);

$modelProduct       = new pproductprosperents();
$modelTwoTapProduct = new ttwo_tap_products();
$resTwoTapProduct   = $modelTwoTapProduct->find([], ['limit' => 5000, 'skip' => 10000]);


foreach ($resTwoTapProduct as $tapProduct) {
    $tapProduct = json_decode(json_encode($tapProduct));

    $catalogId = $tapProduct->catalogId;

    $product = $tapProduct->two_tap_response;

    $updateProduct = [];
    if (isset($product->description) === true) {
        $updateProduct['description'] = $product->description;
    }
    if (isset($product->price) === true) {
        $updateProduct['price'] = str_replace('$', '', $product->price);
    }
    if (isset($product->title) === true) {
        $updateProduct['title'] = $product->title;
    }
    if (isset($product->required_field_values->color) === true) {
        $colorArr = [];
        foreach ($product->required_field_values->color as $color) {
            $colorArr[] = $color->text;
        }
        $updateProduct['color'] = $colorArr;
    }

    $updateProduct['status']      = $product->status;
    $updateProduct['lastChecked'] = new UTCDateTime();

    pr($catalogId);

    $productUpdated = $modelProduct->updateOne(
        ['catalogId' => $catalogId, 'status' => ['$ne' => 'done']],
        ['$set' => $updateProduct]
    );

    pr($productUpdated);
}
echo exeTime();