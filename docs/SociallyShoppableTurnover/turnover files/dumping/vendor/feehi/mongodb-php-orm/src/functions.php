<?php 

function toArray($result, $type)
{
    $return = [];
    if($type == 1){
        foreach($result as $k => $v){
            $return[$k] = $v;
            if(isset($k['_id'])) $return[$k] = (string) $v['_id'];
        }
    }else{
        foreach($result as $v){
            if(isset($v['_id'])) $v['_id'] = (string) $v['_id'];
            $return[] = $v;
        }
    }
    return $return;
}