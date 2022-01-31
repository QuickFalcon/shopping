<?php
include_once 'models.php';
include_once 'utility/hma/proxylist.class.php';

$list = new ProxyList();
$list->set_error_separator("<br/>");
$proxies = $list->get();

if (count($proxies) > 0 && false) {

    unset($proxies['listUrl']);

    $modelProxies = new sss_proxies();
    $modelProxies->deleteMany([]);
    $modelProxies->insertMany($proxies);
} else {
    $proxies = [];
}

pr($proxies);