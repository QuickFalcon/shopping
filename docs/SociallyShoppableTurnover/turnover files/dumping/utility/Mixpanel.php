<?php

/*
 * PHP library for Mixpanel data API -- http://www.mixpanel.com/
 * Requires PHP 5.2 with JSON
 */

class Mixpanel
{
    private $api_url = 'https://mixpanel.com/api';

    private $version = '2.0';

    private $api_secret;


    public function __construct($api_secret)
    {
        $this->api_secret = $api_secret;
    }


    public function request($methods, $params, $format = 'json')
    {
        // $end_point is an API end point such as events, properties, funnels, etc.
        // $method is an API method such as general, unique, average, etc.
        // $params is an associative array of parameters.
        // See http://mixpanel.com/api/docs/guides/api/

        $params['format'] = $format;

        $param_query = '';
        foreach ($params as $param => &$value) {
            if (is_array($value))
                $value = json_encode($value);
            $param_query .= '&' . urlencode($param) . '=' . urlencode($value);
        }

        $uri         = '/' . $this->version . '/' . join('/', $methods) . '/';
        $request_url = $uri . '?' . $param_query;

        $headers     = array("Authorization: Basic " . base64_encode($this->api_secret));
        $curl_handle = curl_init();
        curl_setopt($curl_handle, CURLOPT_URL, $this->api_url . $request_url);
        curl_setopt($curl_handle, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($curl_handle, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($curl_handle, CURLOPT_CONNECTTIMEOUT, 2);
        curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl_handle, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($curl_handle, CURLOPT_SSL_VERIFYHOST, 0);
        $data = curl_exec($curl_handle);
        curl_close($curl_handle);

        return json_decode($data);
    }
}

// Example usage
// $api_secret = 'your secret';
//
// $mp = new Mixpanel($api_secret);
// $data = $mp->request(array('events', 'properties'), array(
//     'event' => 'pages',
//     'name' => 'page',
//     'type' => 'unique',
//     'unit' => 'day',
//     'interval' => '20',
//     'limit' => '20'
// ));
//
// var_dump($data);