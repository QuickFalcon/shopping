<?php

namespace Feehi\mongo;

use Feehi\mongo\Connection;
use Feehi\mongo\exception\Exception;

class Model{
    
    protected $db;
    protected $tableName;
    protected $collection;
    
    public function __construct($config = '')
    {
        if($config == ''){
            $config = require __dir__.DIRECTORY_SEPARATOR."config.php";
        }
        $this->db = Connection::getInstance($config);
        $this->tableName = $this->tableName();
        $this->collection = $this->db->selectCollection($this->tableName);
    }
    
    protected function tableName()
    {
        $className = strtolower(get_class($this));
        if(strpos($className, '\\') !==0){
            return substr($className, strrpos($className, '\\')+1);
        }
    }
    
    public function beforeInsert(&$data)
    {
    }

    final public function insertOne($document, array $options = [])
    {
        $this->beforeInsert($document);
        if(!is_array($document) && !is_object($document)) throw new Exception("parameter one must be array or object");
        return $this->afterInsert($this->collection->insertOne($document, $options));
    }
    
    final public function insertMany(array $documents, array $options=[])
    {
        $this->beforeInsert($document);
        return $this->afterInsert($this->collection->insertMany($documents, $options));
    }
    
    public function afterInsert($data)
    {
        if($data->isAcknowledged() === false) return false;
        if( method_exists($data, 'getInsertedId') ){
            return (string) $data->getInsertedId();
        }else{
            $ids = $data->getInsertedIds();
            $return = [];
            foreach($ids as $v){
                $return[] = (string) $v;
            }
            return $return;
        }
        
    }
    
    public function beforeDelete(&$data)
    {
        
    }
    
    final public function deleteOne(array $filter, array $options=[])
    {
        $this->beforeDelete($filter);
        return $this->afterDelete($this->collection->deleteOne($filter, $options));
    }
    
    final public function deleteMany(array $filter, array $options=[])
    {
        $this->beforeDelete($filter);
        return $this->afterDelete($this->collection->deleteMany($filter, $options));
    }
    
    public function afterDelete($data)
    {
        return $data->isAcknowledged();
    }
    
    public function beforeUpdate(&$filter, &$update)
    {
        
    }

    final public function updateOne($filter, $update, array $options=[])
    {
        $this->beforeUpdate($filter, $update);
        return $this->afterUpdate($this->collection->updateOne($filter, $update, $options));
    }
    
    final public function updateMany($filter, $update, array $options=[])
    {
        $this->beforeUpdate($filter, $update);
        return $this->afterUpdate($this->collection->updateMany($filter, $update, $options));
    }
    
    public function afterUpdate($data)
    {
        return $data->isAcknowledged();
    }
    
    public function beforeFind(&$data)
    {
        
    }
    
    final public function find(array $filter=[], array $options=[])
    {
        $this->beforeFind($filter);
        return $this->afterFind($this->collection->find($filter, $options), 2);
    }
    
    final public function findOne(array $filter=[], array $options=[])
    {
        $this->beforeFind($filter);
        return $this->afterFind($this->collection->findOne($filter, $options), 1);
    }
    
    public function afterFind($data, $type)
    {
        return toArray($data, $type);
    }
    
    final public function distinct($fieldName, $filter=[], array $options=[])
    {
        $result = $this->collection->distinct($fieldName, $filter, $options);
    }
    
    final public function findOneAndDelete($filter=[], array $options=[])
    {
        $result = $this->collection->findOneAndDelete($filter, $options);
        return toArray($result, 1);
    }
    
    final public function findOneAndReplace($filter, $replacement, array $options=[])
    {
        $result = $this->collection->findOneAndReplace($filter, $replacement, $options);
        return toArray($result, 1);
    }
    
    final public function findOneAndUpdate($filter, $update, array $optons=[])
    {
        $result = $this->collection->findOneAndUpdate($filter, $update, $optons);
        return toArray($result, 1);
    }
    
    final public function __debugInfo()
    {
        return $this->collection->__debugInfo();
    }
    
    final public function __toString()
    {
        return $this->collection->__toString();
    }
    
    final public function aggregate(array $pipeline, array $options=[])
    {
        return $this->collection->aggregate($pipeline, $options);
    }
    
    final public function bulkWrite(array $operations, array $options=[])
    {
        return $this->collection->bulkWrite($operations, $options);
    }
    
    final public function count($filter=[], array $options=[])
    {
        return $this->collection->count($filter, $options);
    }
    
    final public function createIndex($key, array $options=[])
    {
        return $this->collection->createIndex($key, $options);
    }
    
    final public function createIndexes(array $indexes)
    {
        return $this->collection->createIndexes($indexes);
    }
    
    final public function dropIndex($indexName, array $options=[])
    {
        return $this->collection->dropIndex($indexName, $options);
    }
    
    final public function dropIndexes(array $options=[])
    {
        return $this->collection->dropIndexes($options);
    }
    
    final public function listIndexes(array $options=[])
    {
        return $this->collection->listIndexes();
    }
    
    final public function getCollectionName()
    {
        return $this->collection->getCollectionName();
    }
    
    final public function getDatabaseName()
    {
        return $this->collection->getDatabaseName();
    }
    
    final public function getNamespace()
    {
        return $this->collection->getNamespace();
    }
    
    final public function withOptions(array $options=[])
    {
        return $this->collection->withOptions($options);
    }
    
    final public function getDb()
    {
        return $this->db;
    }
    
    final public function getCollection()
    {
        return $this->collection;
    }
    
}