<?php 

namespace Feehi\mongo;

use MongoDB\Client;

class Connection extends Client{
    
    private static $_instance;
    
    public function __construct($uri , $uriOptions, $driverOptions)
    {
        parent::__construct($uri , $uriOptions, $driverOptions);
    }
    
    public function getInstance($config)
    {
        if( !(self::$_instance instanceOf self) ){
            $client = new self($config['uri'], $config['uriOptions'], $config['driverOptions']);
            $config['db'] ? $config['db'] : 'default';
            self::$_instance = $client->selectDatabase($config['db']);
        }
        return self::$_instance;
    }
}