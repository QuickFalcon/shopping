<?php

namespace TwoTap;

use GuzzleHttp\Client;

class TwoTapClient {

    /**
     * @const string Production Graph API URL.
     */
    const BASE_API_URL = 'https://api.twotap.com';

    /**
     * @const int The timeout in seconds for a normal request.
     */
    const DEFAULT_REQUEST_TIMEOUT = 60;

    /**
     * @var bool Toggle to use test mode.
     */
    protected $testMode = false;

    /**
     * @var GuzzleHttp\Client HTTP client handler.
     */
    protected $httpClientHandler;

    protected $response;

    public function __construct($config = [])
    {
        $apiUrl = static::BASE_API_URL . '/' . $config['api_version'].'/';

        $this->credentials = [
            'public_token' => $config['public_token'],
            'private_token' => $config['private_token']
        ];

        $this->httpClientHandler = new Client([
            'base_uri' => $apiUrl,
            'timeout'  => static::DEFAULT_REQUEST_TIMEOUT,
            'headers' => [
                'Content-Type'     => 'application/json',
            ],
        ]);
    }

    public function get($url, $params = [])
    {
        $query = array_merge($params, $this->credentials);

        try{
            $this->response = $this->httpClientHandler->request('GET', $url, ['query' => $query]);
        }catch (Exception $e){
            $this->response = $e->getResponse();
            $this->handleError();
        }

        return $this->response->getBody(true);
    }

    public function post($url, $body = [])
    {
        $body = array_merge($body, $this->credentials);

        try{
            $this->response = $this->httpClientHandler->request('POST', $url, ['form_params' => $body]);
        }catch (Exception $e){
            $this->response = $e->getResponse();
            $this->handleError();
        }

        return $this->response->getBody(true);
    }

    /**
     * @throws HttpException
     */
    protected function handleError()
    {
        $body = (string) $this->response->getBody(true);
        $code = (int) $this->response->getStatusCode();
        $content = json_decode($body);
        throw new HttpException(isset($content->message) ? $content->message : 'Request not processed.', $code);
    }

}