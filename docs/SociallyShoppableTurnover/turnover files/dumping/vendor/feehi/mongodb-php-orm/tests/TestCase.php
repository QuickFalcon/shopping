<?php

use Feehi\mongo\Model;

abstract class TestCase extends \PHPUnit_Framework_TestCase
{
    protected function getConfig()
    {
        return [
            'uri' => "mongodb://192.168.1.20:27017",
            'uriOptions' => ['readPreference' => 'secondaryPreferred'],
            'driverOptions' => [],
            'db' => "tests",
        ];
    }
    
    protected function getModel()
    {
        $config = $this->getConfig();
        return new Model($config);
    }
}
