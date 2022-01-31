<?php
include_once 'models.php';

if ($_POST) {
    pr($_POST);
    exit;
}

?>
    <div>
        <form action="" method="post" enctype="multipart/form-data">
            <input type="file" name="csv_to_process"/>
            <input type="text" name="title"/>
            <input type="submit" value="Submit" name="submit"/>
        </form>
    </div>
<?php

// Get list of Stores.
$modelProducts = new sss_products();


echo exeTime();
