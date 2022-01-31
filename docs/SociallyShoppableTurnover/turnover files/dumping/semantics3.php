<?php
include_once 'models.php';
include_once 'vendor/semantics3/semantics3-php/lib/oauth-php/library/OAuthStore.php';
include_once 'vendor/semantics3/semantics3-php/lib/oauth-php/library/OAuthRequester.php';

$key     = getenv('SEM_KEY');
$secret  = getenv('SEM_SECRET');
$apiBase = 'https://api.semantics3.com/v1/test/';


$requestor = new Semantics3_Products($key, $secret);

$sites[] = 'adidas.com';
$sites[] = 'aldo.com';
$sites[] = 'nike.com';
$sites[] = 'puma.com';


# Build the request
$requestor->products_field('site', $sites);

# Run the request
$results = $requestor->get_products();

# View the results of the request
pr($results);

exit;