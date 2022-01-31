<?php
include 'models.php';
use MongoDB\BSON\UTCDateTime;
use MongoDB\BSON\ObjectID;

$lastHours = new UTCDateTime(strtotime('-4days')*1000);
$last1Hour = new UTCDateTime(strtotime('-60minutes')*1000);

$modelProduct = new sss_products();

$products = $modelProduct->find(
    [
        'gender' => ['$exists' => false]
    ],
    [
        'limit'      => 25000,
        'projection' => [
            'category'              => 1,
            'required_field_values' => 1,
        ]
    ]
);

if ($products !== []) {

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

    $modelCronJobs = new ccron_jobs();

    $jobRunning = $modelCronJobs->count(
        [
            '$or' => [
                ['job_done' => ['$exists' => false]],
                ['job_done' => ['$exists' => true, '$ne' => true], 'job_type' => 'color'],
            ]
        ]
    );

    if ($jobRunning > 0) {
        // Set all jobs started 6 hours ago as done.
        $modelCronJobs->updateMany(
            [
                'job_done'   => ['$exists' => true, '$ne' => true],
                'job_type'   => 'color',
                'started_at' => ['$lt' => $last1Hour]
            ],
            ['$set' => ['job_done' => true, 'ended_at' => new UTCDateTime()]]
        );
        die('a previous job is running');
    }


    $newJob['job_type']   = 'color';
    $newJob['job_done']   = false;
    $newJob['started_at'] = new UTCDateTime();

    $jobCreated = $modelCronJobs->insertOne($newJob);

    $nbr_downloaded = 0;
    foreach ($products as $product) {

        $updateProduct = [];

        $updateProduct['gender']       = 9;
        $updateProduct['color_images'] = [];

        if (isset($product->required_field_values->color) === true) {
            $colorImages = [];
            foreach ($product->required_field_values->color as $color) {

                $colorText = str_replace('.', ' ', $color->text);

                $colorImages[$colorText]['image'] = $color->image;
                $colorImages[$colorText]['value'] = $color->value;
            }
            $updateProduct['color_images'] = $colorImages;
        }

        if (isset($product->category) === true) {
            $category = $product->category;

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

        if ($updateProduct != []) {
            $id = new ObjectID($product->_id);
            $modelProduct->updateOne(['_id' => $id], ['$set' => $updateProduct]);
        }
    }

    $jobId = new ObjectID($jobCreated);

    $updateJob['$set']['ended_at'] = new UTCDateTime();
    $updateJob['$set']['job_done'] = true;
    $modelCronJobs->updateOne(['_id' => $jobId], $updateJob);

    $jobUpdated = $modelCronJobs->findOne(['_id' => $jobId]);

    $jobUpdated['started_at'] = $jobUpdated['started_at']->toDateTime();
    $jobUpdated['ended_at']   = $jobUpdated['ended_at']->toDateTime();
    pr($jobUpdated);

    pr($modelProduct->count(['gender' => ['$exists' => false]]));

    $emailBody = '<pre>' . json_encode($jobUpdated, JSON_PRETTY_PRINT) . '</pre>';
    mail('mainuljs@gmail.com', 'Color Cron', $emailBody, $mailheaders);
}

echo exeTime();

