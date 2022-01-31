<?php
include_once 'models.php';
use MongoDB\BSON\UTCDateTime;
use MongoDB\BSON\ObjectID;
use ForceUTF8\Encoding;

$lastHours = new UTCDateTime(strtotime('-1day')*1000);
$last1Hour = new UTCDateTime(strtotime('-60minutes')*1000);

$modelProduct = new sss_products();

$products = $modelProduct->find(
    [
        //'last_checked' => ['$lte' => $lastHours],
        //'available'    => true,
        'merchantId' => ['$nin' => ['126799']]
    ],
    [
        'limit'      => 50000,
        //'skip'       => 100000,
        'sort'       => ['_id' => -1],
        'projection' => [
            'twoTapProductUrl' => 1,
            'tapUrl'           => 1
        ]
    ]
);

if ($products !== []) {

    $modelCronJobs = new ccron_jobs();

    $jobRunning = $modelCronJobs->count(
        [
            '$or' => [
                ['job_done' => ['$exists' => false]],
                ['job_done' => ['$exists' => true, '$ne' => true], 'job_type' => 'tap_url'],
            ]
        ]
    );

    if ($jobRunning > 0) {
        // Set all jobs started 6 hours ago as done.
        $modelCronJobs->updateMany(
            [
                'job_done'   => ['$exists' => true, '$ne' => true],
                'job_type'   => 'tap_url',
                'started_at' => ['$lt' => $last1Hour]
            ],
            ['$set' => ['job_done' => true, 'ended_at' => new UTCDateTime()]]
        );
        die('a previous job is running');
    }

    $newJob['job_type']   = 'tap_url';
    $newJob['job_done']   = false;
    $newJob['started_at'] = new UTCDateTime();

    $jobCreated = $modelCronJobs->insertOne($newJob);

    foreach ($products as $product) {
        $updateStatus = [];

        $tapUrl = _curl_get_product_url($product->twoTapProductUrl);

        $tapUrl = _get_real_header($tapUrl);

        $updateStatus['tapUrl'] = Encoding::fixUTF8($tapUrl);

        if ($product->tapUrl != $tapUrl) {
            pr($product->twoTapProductUrl);
            pr($product->tapUrl);
            pr($tapUrl);
            pr('=====');
        }

        $id = new ObjectID($product->_id);

        $modelProduct->updateOne(['_id' => $id], ['$set' => $updateStatus]);
    }

    $jobId = new ObjectID($jobCreated);

    $updateJob['$set']['ended_at'] = new UTCDateTime();
    $updateJob['$set']['job_done'] = true;
    $modelCronJobs->updateOne(['_id' => $jobId], $updateJob);

    $jobUpdated = $modelCronJobs->findOne(['_id' => $jobId]);

    $jobUpdated['started_at'] = $jobUpdated['started_at']->toDateTime();
    $jobUpdated['ended_at']   = $jobUpdated['ended_at']->toDateTime();
    pr($jobUpdated);

    $emailBody = '<pre>' . json_encode($jobUpdated, JSON_PRETTY_PRINT) . '</pre>';
    mail('mainuljs@gmail.com', 'Tap_URL Cron', $emailBody, $mailheaders);
}

echo exeTime();

