<?php
include_once 'models.php';
use MongoDB\BSON\UTCDateTime;
use MongoDB\BSON\ObjectID;
use TwoTap\Api;
use Cake\Utility\Hash;

$nowTime    = new UTCDateTime();
$lastHours  = new UTCDateTime(strtotime('-8days')*1000);
$last2Hours = new UTCDateTime(strtotime('-2hours')*1000);

$modelProduct = new pproductprosperents();

$resProduct = $modelProduct->find(
    [
        '$or' => [
            ['status' => ['$exists' => false]],
            ['status' => ['$exists' => true, '$nin' => ['done', 'failed', 'unknown_url']]],
        ],
        '$or' => [
            ['lastChecked' => ['$exists' => false]],
            ['lastChecked' => ['$exists' => true, '$lt' => $lastHours]],
        ]
    ],
    [
        'limit'      => 560,
        'projection' => [
            '_id'              => 0,
            'catalogId'        => 1,
            'twoTapProductUrl' => 1,
            'status'           => 1,
            'lastChecked'      => 1
        ]
    ]
);

if (count($resProduct) > 0) {
    $modelCronJobs = new ccron_jobs();

    $jobRunning = $modelCronJobs->count(
        [
            '$or' => [
                ['job_done' => ['$exists' => false]],
                ['job_done' => ['$exists' => true, '$ne' => true], 'job_type' => 'two'],
            ]
        ]
    );

    if ($jobRunning > 0) {
        // Set all jobs started 6 hours ago as done.
        $modelCronJobs->updateMany(
            [
                'job_done'   => ['$exists' => true, '$ne' => true],
                'job_type'   => 'two',
                'started_at' => ['$lt' => $last2Hours]
            ],
            ['$set' => ['job_done' => true, 'ended_at' => new UTCDateTime()]]
        );
        die('a previous job is running');
    }


    $newJob['job_type']   = 'two';
    $newJob['job_done']   = false;
    $newJob['started_at'] = new UTCDateTime();

    $jobCreated = $modelCronJobs->insertOne($newJob);


    $resProduct = object2Array($resProduct);

    $resProductChunk = array_chunk($resProduct, 35);

    $apiConfig['test_mode'] = 'fake_confirm';

    $apiConfig['finished_product_attributes_format'] = 'flat';

    $tokenIndex = 0;

    $results = [];

    foreach ($resProductChunk as $key => $productChunk) {
        if ($key > 0 && ($key%4) === 0) {
            sleep(31);
            $tokenIndex = 0;
        }

        $tokenInAction = $twoTapTokens[$tokenIndex];
        $tokenIndex++;

        putenv('TWOTAP_PUBLIC_TOKEN=' . $tokenInAction['TWOTAP_PUBLIC_TOKEN']);
        putenv('TWOTAP_PRIVATE_TOKEN=' . $tokenInAction['TWOTAP_PRIVATE_TOKEN']);

        $products = Hash::combine($productChunk, '{n}.twoTapProductUrl', '{n}.catalogId');

        $api = new Api($apiConfig);

        $cart = $api->cart()->create(array_keys($products));

        $results[] = $cart;

        if (isset($cart->cart_id) === true) {
            if ($cart->message !== 'has_failures') {
                $newTwoTapJob['cart_id']     = $cart->cart_id;
                $newTwoTapJob['products']    = $products;
                $newTwoTapJob['api_key']     = $tokenInAction;
                $newTwoTapJob['message']     = $cart->message;
                $newTwoTapJob['description'] = $cart->description;
                $newTwoTapJob['created_at']  = new UTCDateTime();

                $modelTwoTapJob = new ttwo_tap_jobs();

                $jobId = $modelTwoTapJob->insertOne($newTwoTapJob);

                if ($jobId !== false) {
                    $modelProduct->updateMany(
                        ['catalogId' => ['$in' => array_values($products)]],
                        ['$set' => ['lastChecked' => new UTCDateTime()]]
                    );
                }
            }
        }
        sleep(31);
    }

    $jobId = new ObjectID($jobCreated);

    $updateJob['$set']['ended_at'] = new UTCDateTime();
    $updateJob['$set']['job_done'] = true;
    $modelCronJobs->updateOne(['_id' => $jobId], $updateJob);

    $jobUpdated = $modelCronJobs->findOne(['_id' => $jobId]);

    $jobUpdated['started_at'] = $jobUpdated['started_at']->toDateTime();
    $jobUpdated['ended_at']   = $jobUpdated['ended_at']->toDateTime();

    $nowTimeEncoded = json_encode($jobUpdated, JSON_PRETTY_PRINT);
    pr($results);
    $emailBody = '<pre>' . $nowTimeEncoded . json_encode($results, JSON_PRETTY_PRINT) . '</pre>';
    mail('mainuljs@gmail.com', 'Cart Cron', $emailBody, $mailheaders);
}

echo exeTime();