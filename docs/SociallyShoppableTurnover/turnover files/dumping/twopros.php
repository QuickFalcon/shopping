<?php
include_once 'models.php';
use MongoDB\BSON\UTCDateTime;
use MongoDB\BSON\ObjectID;
use ForceUTF8\Encoding;

$nowTime    = new UTCDateTime();
$lastHours  = new UTCDateTime(strtotime('-6hours')*1000);
$last2Hours = new UTCDateTime(strtotime('-45minutes')*1000);

$modelProduct       = new sss_products();
$modelTwoTapCatalog = new ttwo_tap_catalogs();

function process_product($product, $pros)
{
    global $modelProduct;
    global $modelTwoTapCatalog;

    $exists = $modelProduct->count(['md5' => $product->md5]);

    $counter = 0;
    if ($exists <= 0) {

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

        try {
            $modelProduct->insertOne($newProduct);
            $counter = 1;
        } catch (Exception $ex) {
            pr($ex->getMessage());
        }
    }

    $updateTwoTap['$set']['crossed_at'] = new UTCDateTime();
    $modelTwoTapCatalog->updateOne(['md5' => $product->md5], $updateTwoTap);

    return $counter;
}

$modelCronJobs = new ttwo_tap_jobs();

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
    $reset = $modelCronJobs->updateMany(
        [
            'job_done'   => ['$exists' => true, '$ne' => true],
            'job_type'   => 'cross',
            'started_at' => ['$lt' => $last2Hours]
        ],
        ['$set' => ['job_done' => true, 'ended_at' => new UTCDateTime()]]
    );
    die('a previous job is running');
}

$rawTwoTapCatalogs = $modelTwoTapCatalog->find(
    [
        'crossed_at' => ['$exists' => false]
    ],
    [
        'limit'      => 1000,
        'projection' => [
            '_id' => 0
        ]
    ]
);


if ($rawTwoTapCatalogs !== []) {

    $resTwoTapCatalogs = [];
    foreach ($rawTwoTapCatalogs as $rawTwoTapCatalog) {
        $resTwoTapCatalogs[clean_http($rawTwoTapCatalog->url)] = $rawTwoTapCatalog;
    }

    $newJob['job_type']       = 'cross';
    $newJob['job_done']       = false;
    $newJob['nbr_expected']   = count($resTwoTapCatalogs);
    $newJob['nbr_downloaded'] = 0;
    $newJob['nbr_matched']    = 0;
    $newJob['started_at']     = new UTCDateTime();

    $nbrDownloaded = 0;

    $jobCreated = $modelCronJobs->insertOne($newJob);

    //Prepare the Post Query with Filters.
    $postArr                          = [];
    $postArr['limit']                 = 1000;
    $postArr['page']                  = 1;
    $postArr['relevancyThreshold']    = 0.7;
    $postArr['filterTwoTapSupported'] = true;
    $postArr['enableFullData']        = false;
    $postArr['format']                = 'json';
    $postArr['api_key']               = '0da1ade1627ce72127d551d52d5b55e7';

    $url = 'http://api.prosperent.com/api/search';

    $numberMatched = 0;

    foreach ($resTwoTapCatalogs as $resTwoTapCatalog) {
        $postArr['query'] = urlencode($resTwoTapCatalog->title);

        $products = _curl_post_object($url, $postArr);

        $extraUrls = [];

        if (isset($products->data) && $products->data !== []) {
            foreach ($products->data as $pros) {

                $pros->tapUrl    = _curl_get_product_url($pros->twoTapProductUrl);
                $pros->tapUrl    = Encoding::fixUTF8($pros->tapUrl);
                $pros->available = false;

                $cleanTapUrl = clean_http($pros->tapUrl);

                if (isset($resTwoTapCatalogs[$cleanTapUrl]) === true) {
                    $product       = $extraProducts[$cleanTapUrl];
                    $nbrDownloaded += process_product($product, $pros);

                    $numberMatched++;
                } else {
                    $extraUrls[] = 'http://' . $cleanTapUrl;
                    $extraUrls[] = 'https://' . $cleanTapUrl;
                }
            }
        }

        if ($extraUrls !== []) {
            $extraUrlsChunk = array_chunk($extraUrls, 1000);
            foreach ($extraUrlsChunk as $urlChunk) {
                try {
                    $extraRawProducts = $modelTwoTapCatalog->find(
                        ['url' => ['$in' => $urlChunk], 'crossed_at' => ['$exists' => false]],
                        [
                            'projection' => [
                                '_id'   => 0,
                                'url'   => 1,
                                'title' => 1,
                                'md5'   => 1
                            ]
                        ]);
                } catch (Exception $ex) {
                    pr($ex->getMessage());
                }

                if ($extraRawProducts !== []) {

                    $extraProducts = [];
                    foreach ($extraRawProducts as $key => $extraRawProduct) {
                        $extraProducts[clean_http($extraRawProduct->url)] = $extraRawProduct;
                    }

                    if (isset($products->data) && $products->data !== []) {
                        foreach ($products->data as $pros) {
                            $pros->tapUrl    = _curl_get_product_url($pros->twoTapProductUrl);
                            $pros->tapUrl    = Encoding::fixUTF8($pros->tapUrl);
                            $pros->available = false;

                            $extraCleanTapUrl = clean_http($pros->tapUrl);

                            if (isset($extraProducts[$extraCleanTapUrl]) === true) {
                                $product       = $extraProducts[$extraCleanTapUrl];
                                $nbrDownloaded += process_product($product, $pros);

                                $numberMatched++;
                            }
                        }
                    }
                }
            }
        }

        $updateTwoTap['$set']['crossed_at'] = new UTCDateTime();
        $modelTwoTapCatalog->updateOne(['md5' => $resTwoTapCatalog->md5], $updateTwoTap);
    }

    $notCrossed = $modelTwoTapCatalog->count(['crossed_at' => ['$exists' => false]]);

    $jobId = new ObjectID($jobCreated);

    $updateJob['$set']['job_done']       = true;
    $updateJob['$set']['nbr_downloaded'] = $nbrDownloaded;
    $updateJob['$set']['nbr_matched']    = $numberMatched;
    $updateJob['$set']['ended_at']       = new UTCDateTime();
    $updateJob['$set']['not_crossed']    = $notCrossed;
    $modelCronJobs->updateOne(['_id' => $jobId], $updateJob);

    $jobUpdated = $modelCronJobs->findOne(['_id' => $jobId]);

    $jobUpdated['started_at'] = $jobUpdated['started_at']->toDateTime();
    $jobUpdated['ended_at']   = $jobUpdated['ended_at']->toDateTime();
    pr($jobUpdated);
    $emailBody = '<pre>' . json_encode($jobUpdated, JSON_PRETTY_PRINT) . '</pre>';
    mail('mainuljs@gmail.com', 'TwoPros Cron', $emailBody, $mailheaders);
}

echo exeTime();
exit;