<?php
include_once 'models.php';
include_once 'utility/Mixpanel.php';

use MongoDB\BSON\UTCDateTime;
use MongoDB\BSON\ObjectID;
use Cake\Utility\Hash;

$api_secret = '3afa788ebdba0365d8d52aa373b5a776';

$mp       = new Mixpanel($api_secret);
$segments = $mp->request(array('segmentation'), array(
    'event'     => 'search',
    'from_date' => date('Y-m-d', strtotime('-365days')),
    'to_date'   => date('Y-m-d'),
    'on'        => 'properties["search_keyword"]',
    'limit'     => '1000'
));

$modelSuggestions = new sss_keyword_suggestions();

$keywords = [];
if (isset($segments->data->values)) {
    foreach ($segments->data->values as $keyword => $dateData) {
        $keyword = strtolower(trim($keyword));
        if (strlen($keyword) <= 40 && is_numeric($keyword) === false) {

            try {
                $modelSuggestions->insertOne(['keyword' => $keyword]);
            } catch (Exception $ex) {
                $ex->getMessage();
            }

            $temp            = [];
            $temp['keyword'] = $keyword;

            foreach ($dateData as $count) {
                $temp['count'] += $count;
            }

            $keywords[$keyword] = $temp;
        }
    }
}

if ($keywords !== []) {
    $keywords = array_values($keywords);
    $keywords = Hash::sort($keywords, '{n}.count', 'desc');

    $modelCronJobs = new ccron_jobs();

    $newJob['job_type']       = 'mixpanel';
    $newJob['job_done']       = false;
    $newJob['nbr_downloaded'] = 0;
    $newJob['started_at']     = new UTCDateTime();

    $nbrDownloaded = 0;

    $jobCreated = $modelCronJobs->insertOne($newJob);

    $modelMixpanel = new mmixpanel_keywords();
    $modelMixpanel->deleteMany([]);

    $modelMixpanel->insertMany($keywords);

    $jobId = new ObjectID($jobCreated);

    $updateJob['$set']['job_done']       = true;
    $updateJob['$set']['nbr_downloaded'] = count($keywords);
    $updateJob['$set']['ended_at']       = new UTCDateTime();
    $modelCronJobs->updateOne(['_id' => $jobId], $updateJob);
    $jobUpdated = $modelCronJobs->findOne(['_id' => $jobId]);

    $jobUpdated['started_at'] = $jobUpdated['started_at']->toDateTime();
    $jobUpdated['ended_at']   = $jobUpdated['ended_at']->toDateTime();
    pr($jobUpdated);

    pr($keywords);
}