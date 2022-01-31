<?php
include_once 'models.php';
use MongoDB\BSON\UTCDateTime;
use Cake\Utility\Hash;
use MongoDB\BSON\ObjectID;

$nowTime    = new UTCDateTime();
$lastHours  = new UTCDateTime(strtotime('-1minutes')*1000);
$last2Hours = new UTCDateTime(strtotime('-2hours')*1000);

// Get list of Stores.
$modelProduct = new pproductprosperents();
$resProduct   = $modelProduct->find(
    [
        'available' => ['$exists' => false],
        '$or'       => [
            ['lastChecked' => ['$exists' => false]],
            ['lastChecked' => ['$exists' => true, '$lt' => $lastHours]],
        ]
    ],
    [
        'limit'      => 500000,
        'projection' => [
            '_id'         => 0,
            'catalogId'   => 1,
            'tapUrl'      => 1,
            'available'   => 1,
            'lastChecked' => 1
        ]
    ]
);

$resProduct = object2Array($resProduct);

pr(['all' => count($resProduct)]);


$productsUrlFormatted = Hash::combine($resProduct, '{n}.tapUrl', '{n}.catalogId');

$productUrls = array_keys($productsUrlFormatted);

$productUrls = array_unique(array_filter($productUrls));

pr(['unique' => count($productUrls)]);

if ($productUrls !== []) {

    $modelTapJobs = new ttwo_tap_jobs();

    $jobTapRunning = $modelTapJobs->count(
        [
            '$or' => [
                ['job_done' => ['$exists' => false]],
                ['job_done' => ['$exists' => true, '$ne' => true], 'job_type' => 'scroll'],
            ]
        ]
    );

    if ($jobTapRunning > 0) {
        die('a scroll job is running');
    }

    $modelCronJobs = new ccron_jobs();

    $jobRunning = $modelCronJobs->count(
        [
            '$or' => [
                ['job_done' => ['$exists' => false]],
                ['job_done' => ['$exists' => true, '$ne' => true], 'job_type' => 'cross'],
            ]
        ]
    );

    if ($jobRunning > 0) {
        // Set all jobs started 6 hours ago as done.
        $modelCronJobs->updateMany(
            [
                'job_done'   => ['$exists' => true, '$ne' => true],
                'job_type'   => 'cross',
                'started_at' => ['$lt' => $last2Hours]
            ],
            ['$set' => ['job_done' => true, 'ended_at' => new UTCDateTime()]]
        );
        die('a previous job is running');
    }


    $newJob['job_type']       = 'cross';
    $newJob['job_done']       = false;
    $newJob['nbr_expected']   = count($productUrls);
    $newJob['nbr_downloaded'] = 0;
    $newJob['started_at']     = new UTCDateTime();

    $jobCreated = $modelCronJobs->insertOne($newJob);

    $modelTwoTapCatalog = new ttwo_tap_catalogs();

    $matchedProducts = $modelTwoTapCatalog->find(
        ['url' => ['$in' => $productUrls]]
    );

    pr(['matched' => count($matchedProducts)]);

    $nbrDownloaded = 0;

    $productNotMatched = Hash::combine($resProduct, '{n}.catalogId', '{n}.catalogId');

    if ($matchedProducts !== []) {
        foreach ($matchedProducts as $product) {
            if (isset($productsUrlFormatted[$product->url]) === true) {
                $catalogId = $productsUrlFormatted[$product->url];

                $updateProduct = [];
                if (isset($product->description) === true) {
                    $updateProduct['description'] = $product->description;
                }
                if (isset($product->price) === true) {
                    $price = str_replace('$', '', $product->price);

                    $updateProduct['price']         = floatval($price);
                    $updateProduct['price_sale']    = floatval($price);
                    $updateProduct['current_price'] = floatval($price);

                    if (isset($product->original_price) === true) {
                        $originalPrice = str_replace('$', '', $product->original_price);

                        $updateProduct['price'] = floatval($originalPrice);
                    }
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

                $updateProduct['available']   = true;
                $updateProduct['lastChecked'] = new UTCDateTime();
                $updateProduct['updated_at']  = new UTCDateTime((strtotime($product->updated_at)*1000));

                $productUpdated = $modelProduct->updateMany(
                    ['tapUrl' => $product->url],
                    ['$set' => $updateProduct]
                );

                $nbrDownloaded++;

                unset($productNotMatched[$catalogId]);
            }
        }
    }

    $updateProduct                = [];
    $updateProduct['available']   = false;
    $updateProduct['lastChecked'] = new UTCDateTime();

    $productNotMatched = array_values($productNotMatched);

    $modelProduct->updateMany(['catalogId' => ['$in' => $productNotMatched]], ['$set' => $updateProduct]);

    $jobId = new ObjectID($jobCreated);

    $updateJob['$set']['ended_at']       = new UTCDateTime();
    $updateJob['$set']['job_done']       = true;
    $updateJob['$set']['nbr_downloaded'] = $nbrDownloaded;
    $modelCronJobs->updateOne(['_id' => $jobId], $updateJob);

    $jobUpdated = $modelCronJobs->findOne(['_id' => $jobId]);

    $jobUpdated['started_at'] = $jobUpdated['started_at']->toDateTime();
    $jobUpdated['ended_at']   = $jobUpdated['ended_at']->toDateTime();
    pr($jobUpdated);

    $elapsed = exeTime();
    echo $elapsed;

    $emailBody = '<pre>' . json_encode($jobUpdated, JSON_PRETTY_PRINT) . '</pre>';
    mail('mainuljs@gmail.com', 'Cross Cron', $emailBody, $mailheaders);
}
exit;