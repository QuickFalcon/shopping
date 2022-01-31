<?php

namespace TwoTap\Api;

class Utils
{

    protected $client;

    public function __construct($client)
    {
        $this->client = $client;
    }

    public function fieldsInputValidate($cartId = null, $flatFieldsInput = null)
    {

        $body = [];

        if(!is_null($cartId)){
            $body['cart_id'] = $cartId;
        }

        if(!is_null($flatFieldsInput)){
            $body['flat_fields_input'] = $flatFieldsInput;
        }

        return json_decode($this->client->post('fields_input_validate', $body));
    }

    public function quicky($products = null, $smsConfirmUrl = null, $phone = null, $message = null)
    {
        $params = [];

        if(!is_null($products)){
            $body['products'] = $products;
        }

        if(!is_null($smsConfirmUrl)){
            $body['sms_confirm_url'] = $smsConfirmUrl;
        }

        if(!is_null($phone)){
            $body['phone'] = $phone;
        }

        if(!is_null($message)){
            $body['message'] = $message;
        }

        return json_decode($this->client->get('quicky', $params));
    }

    public function supportedSites($country = null)
    {
        $params = [];

        if(!is_null($country)){
            $body['country'] = $country;
        }

        return json_decode($this->client->get('supported_sites', $params));
    }

    public function coupons()
    {
        return json_decode($this->client->get('coupons'));
    }

}