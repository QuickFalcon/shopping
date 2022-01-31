<?php
return [
    'uri'             => "mongodb://localhost:27017",
    'uriOptions'      => ['readPreference' => 'secondaryPreferred'],
    'driverOptions'   => [],
    'db'              => "ss",
    "socketTimeoutMS" => 100000000
];