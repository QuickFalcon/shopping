<?php
include_once 'models.php';
use MongoDB\BSON\UTCDateTime;
use MongoDB\BSON\ObjectID;
use ForceUTF8\Encoding;

$nowTime    = new UTCDateTime();
$lastHours  = new UTCDateTime(strtotime('-6hours')*1000);
$last2Hours = new UTCDateTime(strtotime('-45minutes')*1000);

$modelProduct       = new sss_products();
$modelPros          = new pproductprosperents();
$modelTwoTapCatalog = new ttwo_tap_catalogs();

function process_product($pros)
{
    global $modelProduct;
    global $modelPros;
    global $modelTwoTapCatalog;

    $exists = $modelProduct->count(['catalogId' => $pros->catalogId]);

    $counter = 0;
    if ($exists <= 0) {

        $pros->tapUrl = _curl_get_product_url($pros->twoTapProductUrl);
        $pros->tapUrl = Encoding::fixUTF8($pros->tapUrl);

        $cleanTapUrl = clean_http($pros->tapUrl);

        $cleanTapUrl = Encoding::fixUTF8($cleanTapUrl);

        $possibleUrls[] = 'http://' . $cleanTapUrl;
        $possibleUrls[] = 'https://' . $cleanTapUrl;

        $product = $modelTwoTapCatalog->findOne(
            ['url' => ['$in' => $possibleUrls], 'crossed_at' => ['$exists' => false]],
            ['projection' => ['_id' => 0]]
        );

        $product = array2Object($product);

        if (isset($product->md5) === true) {
            $newProduct = object2Array($pros);
            if (isset($product->description) === true) {
                $newProduct['description'] = $product->description;
            }

            $price                       = floatval($pros->price);
            $newProduct['price']         = $price;
            $newProduct['price_sale']    = -1.0;
            $newProduct['current_price'] = $price;
            if (floatval($pros->price_sale) > 0) {
                $newProduct['price_sale']    = floatval($pros->price_sale);
                $newProduct['current_price'] = $newProduct['price_sale'];
            }

            if (isset($product->price) === true) {
                $price = floatval(str_replace('$', '', $product->price));

                $newProduct['price']         = $price;
                $newProduct['price_sale']    = -1.0;
                $newProduct['current_price'] = $price;
            }

            if (isset($product->original_price) === true) {
                $originalPrice = floatval(str_replace('$', '', $product->original_price));

                $newProduct['price']          = $originalPrice;
                $newProduct['price_sale']     = $price;
                $newProduct['original_price'] = $originalPrice;
            }

            if (isset($product->discount_price) === true) {
                $newProduct['discount_price'] = floatval($product->discount_price);
            }

            if (isset($product->title) === true) {
                $newProduct['keyword'] = $product->title;
            }
            if (isset($product->required_field) === true) {
                $newProduct['required_field'] = $product->required_field;
            }
            if (isset($product->required_fields) === true) {
                $newProduct['required_fields'] = $product->required_fields;
            }
            if (isset($product->required_field_names) === true) {
                $newProduct['required_field_names'] = $product->required_field_names;
            }
            if (isset($product->required_field_values) === true) {
                $newProduct['required_field_values'] = $product->required_field_values;
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
                $newProduct['color']        = $colorArr;
                $newProduct['color_images'] = $colorImages;
                $colorAltImages             = array_unique(array_filter($colorAltImages));
                $newProduct['alt_images']   = $colorAltImages;
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
                        $newProduct['gender'] = 2;
                        continue;
                    }
                }

                foreach ($mGenders as $gender) {
                    if (stripos($category, $gender) !== false) {
                        $newProduct['gender'] = 1;
                        continue;
                    }
                }
            }

            $newProduct['site_id']         = $product->site_id;
            $newProduct['site_name']       = $product->site_name;
            $newProduct['site_categories'] = $product->site_categories;
            $newProduct['all_categories']  = $product->all_categories;
            $newProduct['md5']             = $product->md5;
            $newProduct['tapUrl']          = Encoding::fixUTF8($product->url);

            $newProduct['sales']      = intval($newProduct['sales']);
            $newProduct['percentOff'] = floatval($newProduct['percentOff']);

            $newProduct['crossed_at'] = new UTCDateTime();
            $newProduct['updated_at'] = new UTCDateTime((strtotime($product->updated_at)*1000));
            $newProduct['available']  = false;

            try {
                pr($newProduct['md5']);
                $modelProduct->insertOne($newProduct);
                $counter = 1;
            } catch (Exception $ex) {
                pr($ex->getMessage());
            }

            $updateTwoTap['$set']['crossed_at'] = new UTCDateTime();
            $modelTwoTapCatalog->updateOne(['md5' => $product->md5], $updateTwoTap);
            $modelPros->updateOne(['catalogId' => $pros->catalogId], $updateTwoTap);
        }
    }

    $updatePros['$set']['crossed_at'] = new UTCDateTime();
    $modelPros->updateOne(['catalogId' => $pros->catalogId], $updatePros);

    return $counter;
}

$modelCronJobs = new ttwo_tap_jobs();

$jobRunning = $modelCronJobs->count(
    [
        '$or' => [
            ['job_done' => ['$exists' => false]],
            ['job_done' => ['$exists' => true, '$ne' => true], 'job_type' => 'pros_tap_ss'],
        ]
    ]
);

if ($jobRunning > 0) {
    // Set all jobs started 6 hours ago as done.
    $reset = $modelCronJobs->updateMany(
        [
            'job_done'   => ['$exists' => true, '$ne' => true],
            'job_type'   => 'pros_tap_ss',
            'started_at' => ['$lt' => $last2Hours]
        ],
        ['$set' => ['job_done' => true, 'ended_at' => new UTCDateTime()]]
    );
    die('a previous job is running');
}

$resProducts = $modelPros->find(
    [
        'crossed_at' => ['$exists' => false]
    ],
    [
        'limit'      => 50000,
        'projection' => ['_id' => 0]
    ]
);

if ($resProducts !== []) {

    $newJob['job_type']       = 'pros_tap_ss';
    $newJob['job_done']       = false;
    $newJob['nbr_expected']   = count($resProducts);
    $newJob['nbr_downloaded'] = 0;
    $newJob['started_at']     = new UTCDateTime();

    $nbrDownloaded = 0;

    $jobCreated = $modelCronJobs->insertOne($newJob);

    foreach ($resProducts as $pros) {
        $nbrDownloaded += process_product($pros);
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
    mail('mainuljs@gmail.com', 'pros_tap_ss Cron', $emailBody, $mailheaders);
}

echo exeTime();
exit;