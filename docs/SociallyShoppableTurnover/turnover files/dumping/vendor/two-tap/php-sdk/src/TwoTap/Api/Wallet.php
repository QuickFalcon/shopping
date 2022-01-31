<?php

namespace TwoTap\Api;

class Wallet
{

    protected $client;

    public function __construct($client)
    {
        $this->client = $client;
    }

    public function userToken($userKey = null)
    {
        $body = [];

        if(!is_null($userKey)){
            $body['user_key'] = $userKey;
        }

        return json_decode($this->client->post('wallet/user_token', $body));
    }

    public function retrieve($userToken = null, $filterFieldTypes = null, $filterGroupIds = null)
    {
        $body = [];

        if(!is_null($userToken)){
            $body['user_token'] = $userToken;
        }

        if(!is_null($filterFieldTypes)){
            $body['filter_field_types'] = $filterFieldTypes;
        }

        if(!is_null($filterGroupIds)){
            $body['filter_group_ids'] = $filterGroupIds;
        }

        return json_decode($this->client->post('wallet/retireve', $body));
    }

    public function store($userToken = null, $fieldType = null, $groupId = null, $fields = null)
    {
        $body = [];

        if(!is_null($userToken)){
            $body['user_token'] = $userToken;
        }

        if(!is_null($fieldType)){
            $body['field_type'] = $fieldType;
        }

        if(!is_null($groupId)){
            $body['group_id'] = $groupId;
        }

        if(!is_null($fields)){
            $body['fields'] = $fields;
        }

        return json_decode($this->client->post('wallet/retireve', $body));
    }

    public function delete($userToken = null, $fieldType = null, $fieldGroupId = null)
    {
        $body = [];

        if(!is_null($userToken)){
            $body['user_token'] = $userToken;
        }

        if(!is_null($fieldType)){
            $body['field_type'] = $fieldType;
        }

        if(!is_null($fieldGroupId)){
            $body['field_group_id'] = $fieldGroupId;
        }

        return json_decode($this->client->post('wallet/delete', $body));
    }

    public function meta($metaFields = null, $fieldType = null, $expiresIn = null)
    {
        $body = [];

        if(!is_null($metaFields)){
            $body['meta_fields'] = $metaFields;
        }

        if(!is_null($fieldType)){
            $body['field_type'] = $fieldType;
        }

        if(!is_null($expiresIn)){
            $body['expires_in'] = $expiresIn;
        }

        return json_decode($this->client->post('wallet/meta', $body));
    }
}