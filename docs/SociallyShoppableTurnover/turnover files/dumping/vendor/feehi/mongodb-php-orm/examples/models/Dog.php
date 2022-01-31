<?php
namespace models;
use Feehi\Model;
class Dog extends Model{
    
    public function beforeInsert(&$data)
    {
        $data['nation'] = 'usaaaaaaaaaaaac';
    }
   /** 
    public function beforeDelete(&$data)
    {
        $data = [
            '_id' => new \MongoDB\BSON\ObjectID('56ab0d714242b52510006f3f'),
        ];
    }**/

}