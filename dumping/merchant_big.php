<?php
exit;
include_once 'models.php';
use MongoDB\BSON\UTCDateTime;
use Cake\Utility\Hash;
use MongoDB\BSON\ObjectID;
use ForceUTF8\Encoding;

$nowTime    = new UTCDateTime();
$lastHours  = new UTCDateTime(strtotime('-3hours')*1000);
$last2Hours = new UTCDateTime(strtotime('-2hours')*1000);

$modelProduct = new pproductprosperents();

// Get list of Stores.
$modelStore = new sstoreprosperents();
$resStore   = $modelStore->find(
    [
        'merchantId'  => ['$nin' => ['126799']],
        'numProducts' => ['$exists' => true, '$gt' => 0],
        '$or'         => [
            ['lastUpdated' => ['$exists' => false]],
            ['lastUpdated' => ['$exists' => true, '$lt' => $lastHours]],
        ]
    ],
    [
        'limit'      => 20,
        'projection' => [
            '_id'           => 0,
            'merchantId'    => 1,
            'lastUpdated'   => 1,
            'numProducts'   => 1,
            'numDownloaded' => 1,
        ]
    ]
);

if (count($resStore) > 0) {
    $resStoreArr     = object2Array($resStore);
    $merchants       = Hash::extract($resStoreArr, '{n}.merchantId');
    $expectedCount   = Hash::apply($resStoreArr, '{n}.numProducts', 'array_sum');
    $downloadedCount = Hash::apply($resStoreArr, '{n}.numDownloaded', 'array_sum');

    $modelCronJobs = new ccron_jobs();

    $jobRunning = $modelCronJobs->count(
        [
            '$or' => [
                ['job_done' => ['$exists' => false]],
                ['job_done' => ['$exists' => true, '$ne' => true], 'job_type' => 'big'],
            ]
        ]
    );

    if ($jobRunning > 0) {
        // Set all jobs started 6 hours ago as done.
        $modelCronJobs->updateMany(
            [
                'job_done'   => ['$exists' => true, '$ne' => true],
                'job_type'   => 'big',
                'started_at' => ['$lt' => $last2Hours]
            ],
            ['$set' => ['job_done' => true, 'ended_at' => new UTCDateTime()]]
        );
        die('a previous job is running');
    }


    $newJob['job_type']       = 'big';
    $newJob['job_done']       = false;
    $newJob['merchants']      = $merchants;
    $newJob['nbr_expected']   = $expectedCount;
    $newJob['nbr_downloaded'] = $downloadedCount;
    $newJob['nbr_new']        = 0;
    $newJob['started_at']     = new UTCDateTime();

    $jobCreated = $modelCronJobs->insertOne($newJob);

    // Get Products for First 100 Brand.
    $modelBrand = new bbrandprosperents();

    $resBrand      = $modelBrand->find([], ['limit' => 1000]);
    $resBrand      = object2Array($resBrand);
    $resBrand      = Hash::extract($resBrand, '{n}.brand');
    $resBrand      = array_map('strtolower', $resBrand);
    $resBrand      = array_map('urlencode', $resBrand);
    $resBrandSplit = array_chunk($resBrand, 100);

    $url = 'http://api.prosperent.com/api/search';

    $nbr_downloaded = 0;
    $nbr_new        = 0;
    // Loop through the store list
    foreach ($resStore as $key => $store) {
        $merchantId = $store->merchantId;

        $facets['brand']    = [];
        $facets['category'] = [];

        $numNew      = 0;
        $numProducts = $store->numProducts;

        $previousProducts = $modelProduct->find(
            ['merchantId' => "$merchantId"],
            ['projection' => ['_id' => 0, 'catalogId' => 1]]
        );

        if ($previousProducts !== []) {
            $previousProducts = Hash::extract($previousProducts, '{n}.catalogId');
        }

        //Prepare the Post Query with Filters.
        $postArr                          = [];
        $postArr['limit']                 = 1000;
        $postArr['page']                  = 1;
        $postArr['enableFacets']          = 'brand|category';
        $postArr['filterTwoTapSupported'] = 1;
        $postArr['api_key']               = '0da1ade1627ce72127d551d52d5b55e7';
        $postArr['filterMerchantId']      = $merchantId;

        // If number of products is less than 1000
        if ($store->numProducts <= 1000) {
            pr('total < 1000');
            $numProducts = 0;
            for ($ii = 0; $ii < 10; $ii++) {
                $postArr['filterBrand'] = implode('|', $resBrandSplit[$ii]);

                $products = _curl_post_object($url, $postArr);

                if (isset($products->data) && is_scalar($products->data) === false) {
                    foreach ($products->data as $product) {
                        if (in_array($product->catalogId, $previousProducts) === false) {
                            $product->tapUrl       = _curl_get_product_url($product->twoTapProductUrl);
                            $product->downloadedAt = $nowTime;
                            $newProducts[]         = $product;
                        }
                    }

                    $facetChunk = object2Array($products->facets);
                    foreach ($facetChunk['brand'] as $brand) {
                        $facets['brand'][$brand['extendedFieldValue']] = $brand;
                    }

                    foreach ($facetChunk['category'] as $category) {
                        $facets['category'][$category['extendedFieldValue']] = $category;
                    }

                    $numProducts += $products->totalRecordsFound;
                }
                sleep(1);
            }
        } else {
            $numProducts = 0;
            pr('total > 1000');
            if (isset($store->facets->brand) && is_scalar($store->facets) === false && count($store->facets->brand) > 0) {
                foreach ($store->facets->brand as $brand) {
                    $postArr['filterBrand'] = urlencode($brand->extendedFieldValue);
                    if ($brand->count > 1000) {
                        pr('brand > 1000');
                        foreach ($store->facets->category as $category) {
                            $postArr['filterCategory'] = urlencode($category->extendedFieldValue);

                            $products = _curl_post_object($url, $postArr);
                            if (isset($products->data) && is_scalar($products->data) === false) {
                                foreach ($products->data as $product) {
                                    if (in_array($product->catalogId, $previousProducts) === false) {
                                        $product->tapUrl       = _curl_get_product_url($product->twoTapProductUrl);
                                        $product->downloadedAt = $nowTime;
                                        $newProducts[]         = $product;
                                    }
                                }

                                $facetChunk = object2Array($products->facets);
                                foreach ($facetChunk['brand'] as $brand) {
                                    $facets['brand'][$brand['extendedFieldValue']] = $brand;
                                }

                                foreach ($facetChunk['category'] as $category) {
                                    $facets['category'][$category['extendedFieldValue']] = $category;
                                }

                                $numProducts += $products->totalRecordsFound;
                            }
                            sleep(1);
                        }
                    } else {
                        pr('brand < 1000');
                        $products = _curl_post_object($url, $postArr);

                        if (isset($products->data) && is_scalar($products->data) === false) {
                            foreach ($products->data as $product) {
                                if (in_array($product->catalogId, $previousProducts) === false) {
                                    $product->tapUrl       = _curl_get_product_url($product->twoTapProductUrl);
                                    $product->downloadedAt = $nowTime;
                                    $newProducts[]         = $product;
                                }
                            }

                            $facetChunk = object2Array($products->facets);
                            foreach ($facetChunk['brand'] as $brand) {
                                $facets['brand'][$brand['extendedFieldValue']] = $brand;
                            }

                            foreach ($facetChunk['category'] as $category) {
                                $facets['category'][$category['extendedFieldValue']] = $category;
                            }

                            $numProducts += $products->totalRecordsFound;
                        }
                    }
                    sleep(1);
                }
            } else {
                $numProducts = 0;
                pr('facets reloading');
                for ($ii = 0; $ii < 10; $ii++) {
                    $postArr['filterBrand'] = implode('|', $resBrandSplit[$ii]);

                    $products = _curl_post_object($url, $postArr);

                    if (isset($products->data) && is_scalar($products->data) === false) {
                        foreach ($products->data as $product) {
                            if (in_array($product->catalogId, $previousProducts) === false) {
                                $product->tapUrl       = _curl_get_product_url($product->twoTapProductUrl);
                                $product->downloadedAt = $nowTime;
                                $newProducts[]         = $product;
                            }
                        }

                        $facetChunk = object2Array($products->facets);
                        foreach ($facetChunk['brand'] as $brand) {
                            $facets['brand'][$brand['extendedFieldValue']] = $brand;
                        }

                        foreach ($facetChunk['category'] as $category) {
                            $facets['category'][$category['extendedFieldValue']] = $category;
                        }

                        $numProducts += $products->totalRecordsFound;
                    }
                    sleep(1);
                }
            }
        }

        if ($newProducts !== []) {
            foreach ($newProducts as $product) {
                try {
                    $modelProduct->insertOne($product);
                    $numNew++;
                } catch (Exception $ex) {
                    //pr($ex->getMessage());
                }
            }
        }

        $updateData = [];

        $updateData['$set']['lastUpdated'] = new UTCDateTime();

        $numDownloaded = $modelProduct->count(['merchantId' => "$merchantId"]);

        $nbr_downloaded += $numDownloaded;

        $updateData['$set']['numDownloaded'] = $numDownloaded;
        $updateData['$set']['numProducts']   = $numProducts;
        $updateData['$set']['facets']        = $facets;

        $modelStore->updateOne(['merchantId' => "$merchantId"], $updateData);

        $indexArr['merchantId']    = $merchantId;
        $indexArr['counter']       = $key;
        $indexArr['numProducts']   = $numProducts;
        $indexArr['numDownloaded'] = $numDownloaded;
        $indexArr['numNew']        = $numNew;;
        //pr($indexArr);
    }

    $jobId = new ObjectID($jobCreated);

    $updateJob['$set']['ended_at']       = new UTCDateTime();
    $updateJob['$set']['job_done']       = true;
    $updateJob['$set']['nbr_downloaded'] = $nbr_downloaded;
    $updateJob['$set']['nbr_new']        = $nbr_new;
    $modelCronJobs->updateOne(['_id' => $jobId], $updateJob);

    $jobUpdated = $modelCronJobs->findOne(['_id' => $jobId]);

    $jobUpdated['started_at'] = $jobUpdated['started_at']->toDateTime();
    $jobUpdated['ended_at']   = $jobUpdated['ended_at']->toDateTime();
    pr($jobUpdated);

    $elapsed = exeTime();
    echo $elapsed;

    $emailBody = '<pre>' . json_encode($jobUpdated, JSON_PRETTY_PRINT) . '</pre>';
    mail('mainuljs@gmail.com', 'Big Cron', $emailBody, $mailheaders);
}