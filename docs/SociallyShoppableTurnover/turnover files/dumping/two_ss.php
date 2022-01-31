<?php
include_once 'models.php';
use MongoDB\BSON\UTCDateTime;
use Cake\Utility\Hash;
use MongoDB\BSON\ObjectID;
use ForceUTF8\Encoding;

$nowTime    = new UTCDateTime();
$lastHours  = new UTCDateTime(strtotime('-6hours')*1000);
$last2Hours = new UTCDateTime(strtotime('-45minutes')*1000);

$modelProduct       = new sss_tap_products();
$modelTwoTapCatalog = new ttwo_tap_full_catalogs();

function process_product($product)
{
    global $modelProduct;

    $updateProduct = object2Array($product);

    $updateProduct['_id'] = $jobId = new ObjectID($updateProduct['_id']);

    if (isset($product->price) === true) {
        $price = str_replace('$', '', $product->price);

        $updateProduct['price']         = floatval($price);
        $updateProduct['price_sale']    = -1.0;
        $updateProduct['current_price'] = floatval($price);

        if (isset($product->original_price) === true) {
            $originalPrice = str_replace('$', '', $product->original_price);

            $updateProduct['price']      = floatval($originalPrice);
            $updateProduct['price_sale'] = floatval($price);
        }
    }

    if (isset($product->title) === true) {
        $updateProduct['keyword'] = $product->title;
    }
    if (isset($product->image) === true) {
        $updateProduct['image_url'] = $product->image;
    }

    if (isset($product->required_field_values->color) === true) {
        $colorArr       = [];
        $colorAltImages = [];
        $colorImages    = [];
        foreach ($product->required_field_values->color as $color) {
            $colorArr[] = $color->text;

            $colorText = str_replace('.', ' ', $color->text);

            $colorImages[$colorText]['image'] = $color->image;
            $colorImages[$colorText]['value'] = $color->value;

            if (isset($color->alt_images) === true) {
                foreach ($color->alt_images as $alt_image) {
                    $colorAltImages[] = $alt_image;
                }
            }
        }
        $updateProduct['color']        = $colorArr;
        $updateProduct['color_images'] = $colorImages;
        $colorAltImages                = array_unique(array_filter($colorAltImages));
        $updateProduct['alt_images']   = $colorAltImages;
    }

    $updateProduct['sales']      = intval($updateProduct['sales']);
    $updateProduct['percentOff'] = floatval($updateProduct['percentOff']);

    $updateProduct['updated_at'] = new UTCDateTime((strtotime($product->updated_at)*1000));

    $updateProduct['catalogId']           = $product->md5;
    $updateProduct['merchant']            = $product->site_name;
    $updateProduct['category']            = object2Array($product->categories)[0];
    $updateProduct['categories_arr']      = explode('~~', $updateProduct['category']);
    $updateProduct['fine_category']       = $updateProduct['categories_arr'][count($updateProduct['categories_arr']) - 1];
    $updateProduct['twoTapProductUrl']    = $product->url;
    $updateProduct['twoTapAffiliateLink'] = $product->url;
    $updateProduct['affiliated_network']  = intval(10);
    $updateProduct['available']           = true;
    $updateProduct['http_code']           = intval(200);

    //$exists = $modelProduct->count(['md5' => $product->md5]);

    $modelProduct->insertOne($updateProduct);
    return 1;
}

$modelCronJobs = new ttwo_tap_jobs();

$jobRunning = $modelCronJobs->count(
    [
        '$or' => [
            ['job_done' => ['$exists' => false]],
            ['job_done' => ['$exists' => true, '$ne' => true], 'job_type' => 'two_ss'],
        ]
    ]
);

if ($jobRunning > 0) {
    // Set all jobs started 6 hours ago as done.
    $reset = $modelCronJobs->updateMany(
        [
            'job_done'   => ['$exists' => true, '$ne' => true],
            'job_type'   => 'two_ss',
            'started_at' => ['$lt' => $last2Hours]
        ],
        ['$set' => ['job_done' => true, 'ended_at' => new UTCDateTime()]]
    );
    die('a previous job is running');
}

$limit = 30000;

for ($ii = 0; $ii < 10; $ii++) {
    $resTwoTapCatalogs = $modelTwoTapCatalog->find(
        [
            'crossed_at' => ['$exists' => false]
        ],
        [
            'offset' => ($limit*$ii),
            'limit'  => $limit,
        ]
    );

    if ($resTwoTapCatalogs !== []) {

        $newJob['job_type']       = 'two_ss';
        $newJob['job_done']       = false;
        $newJob['nbr_downloaded'] = 0;
        $newJob['started_at']     = new UTCDateTime();

        $nbrDownloaded = 0;

        $jobCreated = $modelCronJobs->insertOne($newJob);

        foreach ($resTwoTapCatalogs as $product) {

            $nbrDownloaded += process_product($product);

            $twoId = new ObjectID($product->_id);

            $updateTwoTap['$set']['crossed_at'] = new UTCDateTime();
            $modelTwoTapCatalog->updateOne(['_id' => $twoId], $updateTwoTap);
        }

        $jobId = new ObjectID($jobCreated);

        $updateJob['$set']['job_done']       = true;
        $updateJob['$set']['nbr_downloaded'] = $nbrDownloaded;
        $updateJob['$set']['ended_at']       = new UTCDateTime();
        $modelCronJobs->updateOne(['_id' => $jobId], $updateJob);

        $jobUpdated = $modelCronJobs->findOne(['_id' => $jobId]);

        $jobUpdated['started_at'] = $jobUpdated['started_at']->toDateTime();
        $jobUpdated['ended_at']   = $jobUpdated['ended_at']->toDateTime();
        pr($jobUpdated);
        $emailBody = '<pre>' . json_encode($jobUpdated, JSON_PRETTY_PRINT) . '</pre>';
        mail('mainuljs@gmail.com', 'two_ss Cron', $emailBody, $mailheaders);
    }
}

echo exeTime();
exit;