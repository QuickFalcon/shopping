<?php
use models\Dog;
/**
 * @author wfee
 * @copyright 2016
 */
spl_autoload_register(function($className){
    $webroot = __DIR__;
    $file = $webroot.DIRECTORY_SEPARATOR.str_replace('\\', DIRECTORY_SEPARATOR, $className).'.php';
    if(is_file($file)) require $file;
});
require '../autoload.php';//import feehi mongodb-php-orm
require '../../../autoload.php';//import mongodb-php-library
$model = new Dog();
//$res = $model->insertOne(['name'=>'doge','sex'=>'male','nation'=>'japan']);
//$res = $model->insertMany([['name'=>'doge','sex'=>'male','nation'=>'japan'],['name'=>'aa','sex'=>'female']]);
//$res = $model->deleteOne(['name'=>'doge']);
//$res = $model->deleteMany(['name'=>'doge']);
//$res = $model->updateOne(['name'=>'doge'], ['$set'=>['marriage'=>'no']]);
//$res = $model->updateMany(['name'=>'cc'], ['$set'=>['marriage'=>'yes']]);
$res = $model->find(['name'=>'doge']);
//$res = $model->findOne(['name'=>'doge']);
//$res = $model->distinct('name');
//$res = $model->findOneAndDelete(['name'=>'doge']);
//$res = $model->findOneAndReplace(['name'=>'doge'], ['name'=>'cc','sex'=>'male']);
//$res = $model->findOneAndUpdate(['name'=>'doge'], ['$set'=>['marriage'=>'yes']]);
//$res = $model->__debugInfo();
//$res = $model->__toString();
//$res = $model->count(['name'=>'cc']);
//$res = $model->createIndex(['name'=>1]);
//$res = $model->dropIndex('name');
//$res = $model->dropIndexes();
//$res = $model->listIndexes();
//$res = $model->getCollectionName();
//$res = $model->getDatabaseName();
//$res = $model->getNamespace();
//$res = $model->withOptions();
var_dump($res);
?>