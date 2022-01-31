<?php
include_once 'models.php';
use Cake\Utility\Hash;


$modelTwoTapCatalog = new sss_tap_products();


$modelProductCategories = new sss_categories();


$results = $modelProductCategories->find(
    [],
    [
        'projection' => ['_id' => 0],
        'sort'       => ['categoryId' => 1]
    ]);

pr(array2Object($results));
exit;

$totalUpdated = 0;

foreach ($results as $key => $res) {
    $updated = $modelTwoTapCatalog->updateMany(
        [
            'category' => $res->category
        ],
        ['$set' => ['categoryId' => intval($res->categoryId)]]
    );

    $totalUpdated += $updated;
}
pr($totalUpdated);
exit;


$categories      = [];
$finalCategories = [];

$limit = 30000;

for ($ii = 0; $ii < 40; $ii++) {
    $resTwoTapCatalogs = $modelTwoTapCatalog->find(
        [],
        [
            'offset'     => ($limit*$ii),
            'limit'      => $limit,
            'projection' => ['_id' => 0, 'category' => 1]
        ]
    );

    if ($resTwoTapCatalogs !== []) {
        foreach ($resTwoTapCatalogs as $resTwoTapCatalog) {
            if (trim($resTwoTapCatalog->category) !== '') {
                $categories[$resTwoTapCatalog->category] = $resTwoTapCatalog->category;
            }
        }
    }
}

$counter = 1;
if ($categories !== []) {

    sort($categories);

    foreach ($categories as $category) {

        $temp['category']   = $category;
        $temp['categoryId'] = $counter;
        $finalCategories[]  = $temp;
        $counter++;
    }
}

if ($finalCategories !== []) {
    $modelSsCategories = new sss_categories();

    $modelSsCategories->deleteMany([]);

    $modelSsCategories->insertMany($finalCategories);
}
pr($finalCategories);
exit;


