<?php
include_once 'models.php';
use Cake\Utility\Hash;


$modelProductProducts   = new sss_products();
$modelProductCategories = new ccategoryprosperentsyncs();

$results = $modelProductCategories->find(
    [],
    [
        'projection' => ['_id' => 0]
    ]);


$totalUpdated = 0;

foreach ($results as $key => $res) {
    $updated = $modelProductProducts->updateMany(
        [
            '$or'      => [
                ['categoryId' => ['$exists' => false]],
                ['categoryId' => ['$exists' => true, '$lte' => 0]],
            ],
            'category' => $res->category
        ],
        ['$set' => ['categoryId' => intval($res->categoryId)]]
    );

    $totalUpdated += $updated;
}
pr($totalUpdated);
exit;
