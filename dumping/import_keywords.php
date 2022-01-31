<?php
include_once 'models.php';
use Cake\Utility\Hash;
use ForceUTF8\Encoding;

if ($_FILES['csv']['name']) {
    $csvString = $_FILES['csv']['tmp_name'];
    $csvItems  = csv_to_array($csvString, "	");

    $finalItems = [];

    foreach ($csvItems as $csvItem) {
        $csvItem = array_values($csvItem);
        $keyword = trim(Encoding::fixUTF8($csvItem[1]));
        if ($keyword !== '') {
            $finalItems[] = trim(Encoding::fixUTF8($csvItem[1]));
        }
    }

    pr($finalItems);

    exit;

    echo '<pre>';
    var_dump($csvArray[0]);

    echo $csvArray[0]['Keyword'];

    pr($csvArray[0]['Keyword']);
    pr($csvArray[0]['Currency']);
    pr($csvArray[0]);
    exit;

    if (isset($csvArray[0]['Keyword']) === true) {
        echo 'here';
        exit;
        $csvArray = Hash::extract($csvArray, '{n}.Keyword');
    }
    pr($csvArray);
    exit;
}

?>
    <div>
        <form action="" method="post" enctype="multipart/form-data">
            <input type="file" name="csv"/>
            <input type="submit" value="Submit"/>
        </form>
    </div>
<?php

// Get list of Stores.
$modelProducts = new sss_products();


echo exeTime();
