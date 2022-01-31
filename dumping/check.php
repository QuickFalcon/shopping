<?php
include_once 'models.php';
use MongoDB\BSON\UTCDateTime;
use MongoDB\BSON\ObjectID;

$lastHours = new UTCDateTime(strtotime('-1day')*1000);
$last1Hour = new UTCDateTime(strtotime('-60minutes')*1000);

$modelProduct = new sss_products();

$products = $modelProduct->find(
    [
        '$or'        => [
            ['last_checked' => ['$exists' => false]],
            ['last_checked' => ['$lte' => $lastHours]]
        ],
        'available'  => true,
        'merchantId' => ['$nin' => ['126799']]
    ],
    [
        'limit'      => 1000,
        'sort'       => ['_id' => 1],
        'projection' => [
            'tapUrl' => 1
        ]
    ]
);

if ($products !== []) {

    $modelCronJobs = new ccron_jobs();

    $jobRunning = $modelCronJobs->count(
        [
            '$or' => [
                ['job_done' => ['$exists' => false]],
                ['job_done' => ['$exists' => true, '$ne' => true], 'job_type' => 'check'],
            ]
        ]
    );

    if ($jobRunning > 0) {
        // Set all jobs started 6 hours ago as done.
        $modelCronJobs->updateMany(
            [
                'job_done'   => ['$exists' => true, '$ne' => true],
                'job_type'   => 'check',
                'started_at' => ['$lt' => $last1Hour]
            ],
            ['$set' => ['job_done' => true, 'ended_at' => new UTCDateTime()]]
        );
        die('a previous job is running');
    }


    $newJob['job_type']       = 'check';
    $newJob['job_done']       = false;
    $newJob['nbr_expected']   = count($products);
    $newJob['nbr_downloaded'] = 0;
    $newJob['nbr_grand']      = 0;
    $newJob['started_at']     = new UTCDateTime();

    $jobCreated = $modelCronJobs->insertOne($newJob);

    $nbr_downloaded = 0;
    $counter        = 0;
    foreach ($products as $product) {
        $counter++;

        if ($counter >= count($proxies)) {
            $counter = 0;
        }

        $url    = strval($product->tapUrl);
        $header = _get_real_header($url);

        $updateStatus = [];
        if (isset($header['http_code']) === true) {
            $updateStatus['http_code'] = $httpCode = intval($header['http_code']);
            $updateStatus['available'] = true;
            if ($httpCode !== 200) {
                $updateStatus['available'] = false;
            } else {
                $checkResult = _check_stock($header['url']);
                if ($checkResult !== true) {
                    $updateStatus['available'] = false;
                }

                $nbr_downloaded++;
            }
            $updateStatus['last_checked'] = new UTCDateTime();

            $id = new ObjectID($product->_id);

            $modelProduct->updateOne(['_id' => $id], ['$set' => $updateStatus]);
        }
    }

    $jobId = new ObjectID($jobCreated);

    $updateJob['$set']['ended_at']       = new UTCDateTime();
    $updateJob['$set']['job_done']       = true;
    $updateJob['$set']['nbr_downloaded'] = $nbr_downloaded;
    $updateJob['$set']['nbr_grand']      = $modelProduct->count(['available' => true]);
    //$updateJob['$set']['not_checked']    = $modelProduct->count(['http_code' => ['$exists' => false]]);
    $modelCronJobs->updateOne(['_id' => $jobId], $updateJob);

    $jobUpdated = $modelCronJobs->findOne(['_id' => $jobId]);

    $jobUpdated['started_at'] = $jobUpdated['started_at']->toDateTime();
    $jobUpdated['ended_at']   = $jobUpdated['ended_at']->toDateTime();
    pr($jobUpdated);

    $emailBody = '<pre>' . json_encode($jobUpdated, JSON_PRETTY_PRINT) . '</pre>';
    mail('mainuljs@gmail.com', 'Check Cron', $emailBody, $mailheaders);
}

echo exeTime();

