<?php
include_once 'models.php';

$dir    = dirname(__FILE__);
$cookie = $dir . '/cookies/' . md5($_SERVER['REMOTE_ADDR']) . '.txt';

echo $cookie;

if (file_exists($cookie) === false) {
    $content = '';
    $fp      = fopen($cookie, "wb");
    fwrite($fp, $content);
    fclose($fp);
}


$arrUrls[] = 'http://www.kohls.com/product/prd-2663055/womens-tail-berries-n-cream-theda-tennis-tank.jsp';


foreach ($arrUrls as $url) {
    pr($url);
    $result = _get_real_header($url);
    pr($result);
}


echo exeTime();
