<?php
include_once 'models.php';
use MongoDB\BSON\UTCDateTime;
use Cake\Utility\Hash;
use MongoDB\BSON\ObjectID;
use ForceUTF8\Encoding;

$nowTime    = new UTCDateTime();
$lastHours  = new UTCDateTime(strtotime('-6hours')*1000);
$last2Hours = new UTCDateTime(strtotime('-45minutes')*1000);

$modelProduct       = new sss_products();
$modelTwoTapCatalog = new ttwo_tap_catalogs();

function process_product($product)
{
    global $modelProduct;

    $updateProduct = [];
    if (isset($product->description) === true) {
        $updateProduct['description'] = $product->description;
    }
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
    if (isset($product->required_field) === true) {
        $updateProduct['required_field'] = $product->required_field;
    }
    if (isset($product->required_fields) === true) {
        $newProduct['required_fields'] = $product->required_fields;
    }
    if (isset($product->required_field_names) === true) {
        $updateProduct['required_field_names'] = $product->required_field_names;
    }
    if (isset($product->required_field_values) === true) {
        $updateProduct['required_field_values'] = $product->required_field_values;
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

    $updateProduct['site_id']         = $product->site_id;
    $updateProduct['site_name']       = $product->site_name;
    $updateProduct['site_categories'] = $product->site_categories;
    $updateProduct['all_categories']  = $product->all_categories;
    $updateProduct['md5']             = $product->md5;

    $updateProduct['sales']      = intval($updateProduct['sales']);
    $updateProduct['percentOff'] = floatval($updateProduct['percentOff']);


    //$updateProduct['last_checked'] = new UTCDateTime();
    $updateProduct['updated_at'] = new UTCDateTime((strtotime($product->updated_at)*1000));

    pr($updateProduct);

    $exists = $modelProduct->count(['md5' => $product->md5]);

    $counter = 0;
    if ($exists > 0) {

        //$modelProduct->updateOne(['md5' => $product->md5], ['$set' => $updateProduct]);
        $counter++;
    }
    return $counter;
}

$modelCronJobs = new ttwo_tap_jobs();

$jobRunning = $modelCronJobs->count(
    [
        '$or' => [
            ['job_done' => ['$exists' => false]],
            ['job_done' => ['$exists' => true, '$ne' => true], 'job_type' => 'two_pros'],
        ]
    ]
);

if ($jobRunning > 0) {
    // Set all jobs started 6 hours ago as done.
    $reset = $modelCronJobs->updateMany(
        [
            'job_done'   => ['$exists' => true, '$ne' => true],
            'job_type'   => 'two_pros',
            'started_at' => ['$lt' => $last2Hours]
        ],
        ['$set' => ['job_done' => true, 'ended_at' => new UTCDateTime()]]
    );
    die('a previous job is running');
}

$resTwoTapCatalogs = $modelTwoTapCatalog->find(
    [
        'crossed_at' => ['$exists' => false]
    ],
    [
        'limit'      => 5,
        'projection' => ['_id' => 0]
    ]
);

if ($resTwoTapCatalogs !== []) {

    $newJob['job_type']       = 'two_pros';
    $newJob['job_done']       = false;
    $newJob['nbr_downloaded'] = 0;
    $newJob['started_at']     = new UTCDateTime();

    $nbrDownloaded = 0;

    $jobCreated = $modelCronJobs->insertOne($newJob);

    foreach ($resTwoTapCatalogs as $product) {

        $nbrDownloaded += process_product($product);

        $updateTwoTap['$set']['crossed_at'] = new UTCDateTime();
        //$modelTwoTapCatalog->updateOne(['url' => $tapUrl], $updateTwoTap);
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
    mail('mainuljs@gmail.com', 'Two_Pros Cron', $emailBody, $mailheaders);
}

echo exeTime();
exit;