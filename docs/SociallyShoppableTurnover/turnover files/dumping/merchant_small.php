<?php
include_once 'models.php';
use MongoDB\BSON\UTCDateTime;
use Cake\Utility\Hash;

$nowTime = new UTCDateTime();

mail('mainuljs@gmail.com', 'Small Cron', date('Y-m-d H:i:s'), $mailheaders);

// Get list of Stores.
$modelStore = new sstoreprosperents();
$resStore   = $modelStore->find();

pr(count($resStore));

// Get Products for First 100 Brand.
$modelBrand = new bbrandprosperents();

$resBrand      = $modelBrand->find([], ['limit' => 1000]);
$resBrand      = object2Array($resBrand);
$resBrand      = Hash::extract($resBrand, '{n}.brand');
$resBrand      = array_map('strtolower', $resBrand);
$resBrand      = array_map('urlencode', $resBrand);
$resBrandSplit = array_chunk($resBrand, 100);

//Prepare the Post Query with Filters.
$postArr['limit']                 = 1000;
$postArr['page']                  = 1;
$postArr['enableFacets']          = 'brand|category';
$postArr['filterTwoTapSupported'] = 1;
$postArr['api_key']               = '0da1ade1627ce72127d551d52d5b55e7';


// Initiate the Product Model.
$modelProduct = new pproductprosperents();

$counter = 0;

$url = 'http://api.prosperent.com/api/search';
foreach ($resStore as $key => $store) {

    $merchantId = $store->merchantId;

    $merchantProducts = $modelProduct->find(['merchantId' => $merchantId]);

    $merchantProducts = object2Array($merchantProducts);
    $previousProducts = Hash::extract($merchantProducts, '{n}.catalogId');

    $facets['brand']    = [];
    $facets['category'] = [];

    $numberProductsNew = 0;

    $newProducts = [];

    $indexArr['merchantId'] = $merchantId;

    $postArr['filterMerchantId'] = $merchantId;
    for ($ii = 0; $ii < 10; $ii++) {

        $postArr['filterBrand'] = implode('|', $resBrandSplit[$ii]);

        $products = _curl_post_object($url, $postArr);

        if (isset($products->data) && is_scalar($products->data) === false) {

            $facetChunk = object2Array($products->facets);
            foreach ($facetChunk['brand'] as $brand) {
                $facets['brand'][] = $brand;
            }

            foreach ($facetChunk['category'] as $category) {
                $facets['category'][] = $category;
            }

            $numberProductsNew += $products->totalRecordsFound;

            foreach ($products->data as $product) {
                if (in_array($product->catalogId, $previousProducts) === false) {
                    $product->downloadedAt = $nowTime;

                    $product->tapUrl = _curl_get_product_url($product->twoTapProductUrl);
                    $newProducts[]   = $product;
                }
            }
        }
        sleep(1);
    }

    if ($newProducts !== []) {
        try {
            $modelProduct->insertMany($newProducts);
        } catch (Exception $ex) {
            pr($ex->getMessage());
        }
    }

    if ($numberProductsNew > 0) {
        $numberProductsNew += 1;
    }

    $updateData['$set']['facets']      = $facets;
    $updateData['$set']['numProducts'] = $numberProductsNew;
    $updateData['$set']['lastUpdated'] = $nowTime;

    $numDownloaded = $modelProduct->count(['merchantId' => "$merchantId"]);

    $updateData['$set']['numDownloaded'] = $numDownloaded;

    $modelStore->updateOne(['merchantId' => "$merchantId"], $updateData);

    $counter++;
    $indexArr['numProductsNew'] = $numberProductsNew;
    $indexArr['prevProducts']   = count($previousProducts);
    $indexArr['newProducts']    = count($newProducts);
    $indexArr['counter']        = $key;
    pr($indexArr);
}

$elapsed = exeTime();
echo $elapsed;
mail('mainuljs@gmail.com', 'Small Cron', date('Y-m-d H:i:s') . ' elapsed: ' . $elapsed, $mailheaders);
