<?php
include_once 'models.php';

$dir       = dirname(__FILE__);
$colorFile = $dir . '/utility/color-names/output/colors_big.json';

$colorJson = file_get_contents($colorFile);

$colors = json_decode($colorJson, true);

foreach ($colors as $key => $color) {
    $colors[$key]['slug'] = slug($color['name']);
}

$colors = array_values($colors);

$modelListOfColors = new llist_of_colors();

$modelListOfColors->deleteMany([]);
$modelListOfColors->insertMany($colors);

//pr($colors);

echo exeTime();
