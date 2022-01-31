<?php

use Feehi\mongo\Model;
require 'TestCase.php';
/**
 * Unit tests for the Model class.
 */
class ModelTest extends \TestCase
{
    
    public function testConstructor()
    {
        $this->assertInstanceOf('Feehi\mongo\Model', $this->getModel());
    }
    
    public function testInsertOne()
    {
        $document = [
            'name' => 'feehi',
            'language' => 'php'
        ];
        $this->assertStringMatchesFormat('%s' ,$this->getModel()->insertOne($document));
    }
    
    public function testInsertMany()
    {
        $documents = [
            [
                'name111' => 'feehi111',
                'language111' => 'php111',
            ],
            [
                'name222' => 'feehi222',
                'language222' => 'node.js222'
            ],
            [
                'name333' => 'feehi333'
            ]
        ];
        $this->assertArrayHasKey('0' ,$this->getModel()->insertMany($documents));
    }
    
    public function testDeleteOne()
    {
        $filter = [
            'name111' => 'feehi111',
        ];
        $this->assertTrue($this->getModel()->deleteOne($filter));
    }
    
    public function testDeleteMany()
    {
        $filter = [
            'name111' => 'feehi111',
        ];
        $this->assertTrue($this->getModel()->deleteMany($filter));
    }
    
    public function testUpdateOne()
    {
        $this->assertTrue($this->getModel()->updateOne(['name222'=>'feehi222'], ['$set'=>['language222'=>'nodejs']]));
    }
    
    public function testUpdateMany()
    {
        $this->assertTrue($this->getModel()->updateMany(['name222'=>'feehi222'], ['$set'=>['language222'=>'nodejs']]));
    }
    
    public function testFind()
    {
        $this->assertArrayHasKey('0', $this->getModel()->find(['name222'=>'feehi222']));
    }
    
    public function testFindOne()
    {
        $this->assertArrayHasKey('_id', $this->getModel()->findOne(['name222'=>'feehi222']));
    }
    
    public function testFindOneAndDelete()
    {
        $this->assertArrayHasKey('_id', $this->getModel()->findOneAndDelete(['name222'=>'feehi222']));
    }
    
    public function testFindOneAndReplace()
    {
        $replace = [
            'name333' => 'feehi333',
            'job' => 'programmer'
        ];
        $this->assertArrayHasKey('_id', $this->getModel()->findOneAndReplace(['name333'=>'feehi333'], $replace));
    }
    
    public function testFindOneAndUpdate()
    {
        $this->assertArrayHasKey('_id', $this->getModel()->findOneAndUpdate(['name333'=>'feehi333'], ['$set'=>['name333'=>'feehi888']]));
    }
}
