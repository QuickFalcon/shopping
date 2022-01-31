<?php
include_once 'models.php';
use MongoDB\BSON\UTCDateTime;
use MongoDB\BSON\ObjectID;
use TwoTap\Api;
use Cake\Utility\Hash;

$nowTime    = new UTCDateTime();
$lastHours  = new UTCDateTime(strtotime('-8days')*1000);
$last2Hours = new UTCDateTime(strtotime('-2hours')*1000);

$modelTwoTapJobs = new ttwo_tap_jobs();

$jobRunning = $modelTwoTapJobs->count(
    [
        '$or' => [
            ['job_done' => ['$exists' => false]],
            ['job_done' => ['$exists' => true, '$ne' => true], 'job_type' => 'scroll'],
        ]
    ]
);

if ($jobRunning > 0) {
    // Set all jobs started 6 hours ago as done.
    $modelTwoTapJobs->updateMany(
        [
            'job_done'   => ['$exists' => true, '$ne' => true],
            'job_type'   => 'scroll',
            'started_at' => ['$lt' => $last2Hours]
        ],
        ['$set' => ['job_done' => true, 'ended_at' => new UTCDateTime()]]
    );
    die('a previous job is running');
}

$modelSsSupportedSites = new sss_supported_sites();
$resSsSupportedSites   = $modelSsSupportedSites->find(
    ['merchantId' => ['$nin' => ['126799']]],
    ['projection' => ['_id' => 0, 'id' => 1]]
);
$resSsSupportedSites   = object2Array($resSsSupportedSites);
$resSsSupportedSites   = Hash::extract($resSsSupportedSites, '{n}.id');

$modelTwoTapCatalog = new ttwo_tap_catalogs();

$apiConfig['test_mode'] = 'fake_confirm';

$apiConfig['finished_product_attributes_format'] = 'flat';

$api = new Api($apiConfig);

$filter = [];
if ($resSsSupportedSites !== []) {
    $filter['site_ids'] = $resSsSupportedSites;
}
$size = 5000;

$response = $api->product()->scroll($filter, $size);

if (isset($response->message) && $response->message === 'done') {

    $total    = $response->total;
    $scrollId = $response->scroll_id;

    $newJob['job_type']       = 'scroll';
    $newJob['job_done']       = false;
    $newJob['nbr_expected']   = $total;
    $newJob['nbr_downloaded'] = 0;
    $newJob['started_at']     = new UTCDateTime();

    $jobCreated = $modelTwoTapJobs->insertOne($newJob);

    if ($response->products !== []) {

        $modelTwoTapCatalog->deleteMany([]);

        try {
            $modelTwoTapCatalog->insertMany($response->products);
        } catch (Exception $ex) {
            pr($ex->getMessage());
        }

        $loop = floor($total/$size);
        //$loop = 3;

        for ($ii = 0; $ii < $loop; $ii++) {
            $response = $api->product()->scroll($filter, $size, $scrollId);

            if (isset($response->message) && $response->message === 'done') {

                $scrollId = $response->scroll_id;

                if ($response->products !== []) {
                    try {
                        $modelTwoTapCatalog->insertMany($response->products);
                    } catch (Exception $ex) {
                        pr($ex->getMessage());
                    }
                }
            }
        }
    }

    $nbrDownloaded = $modelTwoTapCatalog->count();

    $jobId = new ObjectID($jobCreated);

    $updateJob['$set']['ended_at']       = new UTCDateTime();
    $updateJob['$set']['job_done']       = true;
    $updateJob['$set']['nbr_downloaded'] = $nbrDownloaded;
    $modelTwoTapJobs->updateOne(['_id' => $jobId], $updateJob);

    $jobUpdated = $modelTwoTapJobs->findOne(['_id' => $jobId]);

    $jobUpdated['started_at'] = $jobUpdated['started_at']->toDateTime();
    $jobUpdated['ended_at']   = $jobUpdated['ended_at']->toDateTime();
    pr($jobUpdated);

    $elapsed = exeTime();
    echo $elapsed;

    $emailBody = '<pre>' . json_encode($jobUpdated, JSON_PRETTY_PRINT) . '</pre>';
    mail('mainuljs@gmail.com', 'Scroll Cron', $emailBody, $mailheaders);
}

exeTime();

exit;