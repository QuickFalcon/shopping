<?php
include_once 'models.php';
use MongoDB\BSON\UTCDateTime;
use MongoDB\BSON\ObjectID;
use TwoTap\Api;

$nowTime   = new UTCDateTime();
$lastHours = new UTCDateTime(strtotime('10minutes')*1000);

$modelTwoTapJob = new ttwo_tap_jobs();

$twoTapJobs = $modelTwoTapJob->find(
    [
        'created_at' => [
            '$lt' => $lastHours
        ],
        'message'    => 'still_processing'
    ],
    ['limit' => 20]
);

if ($twoTapJobs !== []) {

    $modelCronJobs = new ccron_jobs();

    $jobRunning = $modelCronJobs->count(
        [
            '$or' => [
                ['job_done' => ['$exists' => false]],
                ['job_done' => ['$exists' => true, '$ne' => true], 'job_type' => 'tap'],
            ]
        ]
    );

    if ($jobRunning > 0) {
        // Set all jobs started 6 hours ago as done.
        $modelCronJobs->updateMany(
            [
                'job_done'   => ['$exists' => true, '$ne' => true],
                'job_type'   => 'tap',
                'started_at' => ['$lt' => $last2Hours]
            ],
            ['$set' => ['job_done' => true, 'ended_at' => new UTCDateTime()]]
        );
        die('a previous job is running');
    }


    $newJob['job_type']   = 'tap';
    $newJob['job_done']   = false;
    $newJob['started_at'] = new UTCDateTime();

    $nbrExpected   = 0;
    $nbrDownloaded = 0;

    $newJob['nbr_expected']   = $nbrExpected;
    $newJob['nbr_downloaded'] = $nbrDownloaded;

    $jobCreated = $modelCronJobs->insertOne($newJob);

    $modelProduct = new pproductprosperents();

    $modelTwoTapProduct = new ttwo_tap_products();

    $apiConfig['test_mode'] = 'fake_confirm';

    $apiConfig['finished_product_attributes_format'] = 'flat';

    $results = [];

    foreach ($twoTapJobs as $key => $twoTapJob) {

        $nbrExpected += count($twoTapJob->products);

        putenv('TWOTAP_PUBLIC_TOKEN=' . $twoTapJob->api_key->TWOTAP_PUBLIC_TOKEN);
        putenv('TWOTAP_PRIVATE_TOKEN=' . $twoTapJob->api_key->TWOTAP_PRIVATE_TOKEN);

        $api = new Api($apiConfig);

        $status = $api->cart()->status($twoTapJob->cart_id);

        $nbrDone = 0;

        if (isset($status->sites) === true) {
            if ($status->message !== 'still_processing') {
                foreach ($status->sites as $site) {
                    if (isset($site->add_to_cart) === true) {
                        foreach ($site->add_to_cart as $product) {
                            if (isset($twoTapJob->products[$product->original_url]) === true) {
                                $catalogId = $twoTapJob->products[$product->original_url];

                                $updateProduct = [];
                                if ($product->status === 'done') {
                                    $newTwoTapProduct['catalogId']        = $catalogId;
                                    $newTwoTapProduct['two_tap_response'] = $product;

                                    $exists = $modelTwoTapProduct->count(['catalogId' => $catalogId]);

                                    if ($exists > 0) {
                                        $newTwoTapProduct['updated_at'] = new UTCDateTime();
                                        $modelTwoTapProduct->updateOne(
                                            ['catalogId' => $catalogId],
                                            ['$set' => $newTwoTapProduct]
                                        );
                                    } else {
                                        try {
                                            $newTwoTapProduct['created_at'] = new UTCDateTime();
                                            $modelTwoTapProduct->insertOne($newTwoTapProduct);
                                        } catch (Exception $ex) {
                                            //pr($ex->getMessage());
                                        }
                                    }

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
                                    $nbrDone++;
                                    $nbrDownloaded++;
                                }

                                $updateProduct['status']      = $product->status;
                                $updateProduct['lastChecked'] = new UTCDateTime();

                                $productUpdated = $modelProduct->updateOne(
                                    ['catalogId' => $catalogId],
                                    ['$set' => $updateProduct]
                                );
                            }
                        }
                    }
                    if (isset($site->failed_to_add_to_cart) === true) {
                        foreach ($site->failed_to_add_to_cart as $product) {
                            if (isset($twoTapJob->products[$product->original_url]) === true) {
                                $catalogId = $twoTapJob->products[$product->original_url];

                                $updateProduct = [];

                                $updateProduct['status']      = $product->status;
                                $updateProduct['lastChecked'] = new UTCDateTime();

                                $productUpdated = $modelProduct->updateOne(
                                    ['catalogId' => $catalogId],
                                    ['$set' => $updateProduct]
                                );
                            }
                        }
                    }
                }
            }
        }
        if (isset($status->unknown_urls) === true) {
            foreach ($status->unknown_urls as $url) {
                if (isset($twoTapJob->products[$url]) === true) {
                    $catalogId = $twoTapJob->products[$url];

                    $updateProduct = [];

                    $updateProduct['status']      = 'unknown_url';
                    $updateProduct['lastChecked'] = new UTCDateTime();

                    $productUpdated = $modelProduct->updateOne(
                        ['catalogId' => $catalogId],
                        ['$set' => $updateProduct]
                    );
                }
            }
        }
        $updateJob['message']     = $status->message;
        $updateJob['description'] = $status->description;
        $updateJob['updated_at']  = new UTCDateTime();
        $updateJob['nbr_done']    = $nbrDone;

        $modelTwoTapJob->updateOne(
            ['_id' => new ObjectID($twoTapJob->_id)],
            ['$set' => $updateJob]
        );

        $updateJob['updated_at'] = $updateJob['updated_at']->toDateTime();

        pr($updateJob);
        $results[] = $updateJob;

        sleep(12);
    }

    $jobId = new ObjectID($jobCreated);

    $updateCronJob['$set']['ended_at']       = new UTCDateTime();
    $updateCronJob['$set']['job_done']       = true;
    $updateCronJob['$set']['nbr_expected']   = $nbrExpected;
    $updateCronJob['$set']['nbr_downloaded'] = $nbrDownloaded;
    $modelCronJobs->updateOne(['_id' => $jobId], $updateCronJob);

    $CronJobUpdated = $modelCronJobs->findOne(['_id' => $jobId]);

    $CronJobUpdated['started_at'] = $CronJobUpdated['started_at']->toDateTime();
    $CronJobUpdated['ended_at']   = $CronJobUpdated['ended_at']->toDateTime();

    $nowTimeEncoded = json_encode($CronJobUpdated, JSON_PRETTY_PRINT);
    $emailBody      = '<pre>' . $nowTimeEncoded . json_encode($results, JSON_PRETTY_PRINT) . '</pre>';
    mail('mainuljs@gmail.com', 'Tap Cron', $emailBody, $mailheaders);
}

echo exeTime();