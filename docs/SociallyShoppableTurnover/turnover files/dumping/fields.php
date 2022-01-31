<?php
include_once 'models.php';

// Get list of Stores.
$modelProducts = new sss_products();
$resProducts   = $modelProducts->find(
    ['required_field_names' => ['$exists' => true]],
    ['projection' => ['_id' => 0, 'required_field_names' => 1]]
);

$insertData  = [];
$finalFields = [];
if ($resProducts !== []) {

    $modelFields = new sss_fields();

    $modelFields->deleteMany([]);

    foreach ($resProducts as $resProduct) {
        foreach ($resProduct->required_field_names as $field) {
            $finalFields[$field] = $field;
        }
    }

    if ($finalFields !== []) {
        foreach ($finalFields as $finalField) {
            $temp         = [];
            $temp['name'] = $finalField;
            $insertData[] = $temp;
        }
        $modelFields->insertMany($insertData);
    }
}

pr($insertData);
echo exeTime();
