<?php
include_once 'models.php';
use Cake\Utility\Hash;

// Get list of Stores.
$modelStore = new sstoreprosperents();
$resStore   = $modelStore->find(['numProducts' => ['$gt' => 0]]);
$resStore   = object2Array($resStore);
$resStore   = Hash::sort($resStore, '{n}.numProducts', 'asc');
$resStore   = Hash::combine($resStore, '{n}.merchantId', '{n}.numProducts');

pr($resStore);
exit;

exeTime();
