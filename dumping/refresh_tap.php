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

function process_product($pros)
{
    global $modelProduct;
    global $modelTwoTapCatalog;


    $product = $modelTwoTapCatalog->findOne(
        ['md5' => $pros->md5],
        ['projection' => ['_id' => 0]]
    );

    $product = array2Object($product);

    if (isset($product->md5) === true) {
        $updateProduct = [];
        if (isset($product->description) === true) {
            $updateProduct['description'] = $product->description;
        }

        $price                          = floatval($pros->price);
        $updateProduct['price']         = $price;
        $updateProduct['price_sale']    = -1.0;
        $updateProduct['current_price'] = $price;
        if (floatval($pros->price_sale) > 0) {
            $updateProduct['price_sale']    = floatval($pros->price_sale);
            $updateProduct['current_price'] = $updateProduct['price_sale'];
        }

        if (isset($product->price) === true) {
            $price = floatval(str_replace('$', '', $product->price));

            $updateProduct['price']         = $price;
            $updateProduct['price_sale']    = -1.0;
            $updateProduct['current_price'] = $price;
        }

        if (isset($product->original_price) === true) {
            $originalPrice = floatval(str_replace('$', '', $product->original_price));

            $updateProduct['price']          = $originalPrice;
            $updateProduct['price_sale']     = $price;
            $updateProduct['original_price'] = $originalPrice;
        }

        if (isset($product->discount_price) === true) {
            $updateProduct['discount_price'] = floatval($product->discount_price);
        }

        if (isset($product->title) === true) {
            $updateProduct['keyword'] = $product->title;
        }
        if (isset($product->required_field) === true) {
            $updateProduct['required_field'] = $product->required_field;
        }
        if (isset($product->required_fields) === true) {
            $updateProduct['required_fields'] = $product->required_fields;
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

        $wGenders   = [];
        $wGenders[] = ' woman ';
        $wGenders[] = ' women ';
        $wGenders[] = ' womens ';
        $wGenders[] = ' girl ';
        $wGenders[] = ' girls ';
        $wGenders[] = ' female ';

        $mGenders   = [];
        $mGenders[] = ' man ';
        $mGenders[] = ' men ';
        $mGenders[] = ' mens ';
        $mGenders[] = ' boy ';
        $mGenders[] = ' boys ';
        $mGenders[] = ' male ';

        if (isset($pros->category) === true) {
            $category = $pros->category;

            foreach ($wGenders as $gender) {
                if (stripos($category, $gender) !== false) {
                    $updateProduct['gender'] = 2;
                    continue;
                }
            }

            foreach ($mGenders as $gender) {
                if (stripos($category, $gender) !== false) {
                    $updateProduct['gender'] = 1;
                    continue;
                }
            }
        }

        $updateProduct['site_id']         = $product->site_id;
        $updateProduct['site_name']       = $product->site_name;
        $updateProduct['site_categories'] = $product->site_categories;
        $updateProduct['all_categories']  = $product->all_categories;
        $updateProduct['md5']             = $product->md5;
        $updateProduct['tapUrl']          = Encoding::fixUTF8($product->url);
        $updateProduct['crossed_at']      = new UTCDateTime();

        try {
            $modelProduct->updateOne(['md5' => $product->md5], ['$set' => $updateProduct]);
            $counter = 1;
        } catch (Exception $ex) {
            pr($ex->getMessage());
        }

        $updateTwoTap['$set']['crossed_at'] = new UTCDateTime();
        $modelTwoTapCatalog->updateOne(['md5' => $product->md5], $updateTwoTap);
    }


    return $counter;
}

$modelCronJobs = new ttwo_tap_jobs();

$jobRunning = $modelCronJobs->count(
    [
        '$or' => [
            ['job_done' => ['$exists' => false]],
            ['job_done' => ['$exists' => true, '$ne' => true], 'job_type' => 'refresh_tap'],
        ]
    ]
);

if ($jobRunning > 0) {
    // Set all jobs started 6 hours ago as done.
    $reset = $modelCronJobs->updateMany(
        [
            'job_done'   => ['$exists' => true, '$ne' => true],
            'job_type'   => 'refresh_tap',
            'started_at' => ['$lt' => $last2Hours]
        ],
        ['$set' => ['job_done' => true, 'ended_at' => new UTCDateTime()]]
    );
    //die('a previous job is running');
}

$resProducts = $modelProduct->find(
    [
        'current_price' => ['$exists' => false]
    ],
    [
        'projection' => ['_id' => 0, 'md5' => 1, 'price' => 1, 'price_sale' => 1]
    ]
);

pr(count($resProducts));

if ($resProducts !== []) {

    $newJob['job_type']       = 'refresh_tap';
    $newJob['job_done']       = false;
    $newJob['nbr_downloaded'] = 0;
    $newJob['started_at']     = new UTCDateTime();

    $nbrDownloaded = 0;

    $jobCreated = $modelCronJobs->insertOne($newJob);

    foreach ($resProducts as $pros) {
        $nbrDownloaded += process_product($pros);

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
    mail('mainuljs@gmail.com', 'Refresh_tap Cron', $emailBody, $mailheaders);
}

echo exeTime();
exit;