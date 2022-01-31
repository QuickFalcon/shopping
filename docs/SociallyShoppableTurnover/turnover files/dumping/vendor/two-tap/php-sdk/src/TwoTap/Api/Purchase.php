<?php

namespace TwoTap\Api;

class Purchase
{

    protected $client;

    public function __construct($client)
    {
            $this->client = $client;
    }

    public function create($cartId = null, $fieldsInput = null, $affiliateLinks = null, $confirm = null, $products = null, $notes = null, $testMode = null, $locale = null)
    {

        $body = [];

        if(!is_null($cartId)){
            $body['cart_id'] = $cartId;
        }

        if(!is_null($fieldsInput)){
            $body['fields_input'] = $fieldsInput;
        }

        if(!is_null($affiliateLinks)){
            $body['affiliate_links'] = $affiliateLinks;
        }

        if(!is_null($confirm)){
            $body['confirm'] = $confirm;
        }

        if(!is_null($products)){
            $body['products'] = $products;
        }

        if(!is_null($notes)){
            $body['notes'] = $notes;
        }

        if(!is_null($testMode)){
            $body['test_mode'] = $testMode;
        }

        if(!is_null($locale)){
            $body['locale'] = $locale;
        }

        return json_decode($this->client->post('purchase', $body));
    }

    public function status($purchaseId = null, $testMode = null)
    {

        $params = [];

        if(!is_null($purchaseId)){
            $params['purchase_id'] = $purchaseId;
        }

        if(!is_null($testMode)){
            $params['test_mode'] = $testMode;
        }

        return json_decode($this->client->get('purchase/status', $params));
    }

    public function history($since = null)
    {

        $params = [];

        if(!is_null($since)){
            $params['since'] = $since;
        }

        return json_decode($this->client->get('purchase/history', $params));
    }

    public function confirm($purchaseId = null, $testMode = null)
    {

        $body = [];

        if(!is_null($purchaseId)){
            $body['purchase_id'] = $purchaseId;
        }

        if(!is_null($testMode)){
            $body['test_mode'] = $testMode;
        }

        return json_decode($this->client->post('purchase/confirm', $body));
    }

}