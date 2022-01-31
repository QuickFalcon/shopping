<?php

namespace TwoTap;

use TwoTap\Api\Cart;
use TwoTap\Api\PickupOptions;
use TwoTap\Api\Product;
use TwoTap\Api\Purchase;
use TwoTap\Api\Utils;
use TwoTap\Api\Wallet;
use TwoTap\TwoTapClient;
use Exception;

class Api
{
    /**
    * @const string Version number of the TwoTap PHP SDK.
    */
    const VERSION = '0.1-dev';

    /**
    * @const string The name of the environment variable that contains the public token.
    */
    const PUBLIC_TOKEN_ENV_NAME = 'TWOTAP_PUBLIC_TOKEN';

    /**
    * @const string The name of the environment variable that contains the private token.
    */
    const PRIVATE_TOKEN_ENV_NAME = 'TWOTAP_PRIVATE_TOKEN';

    /**
    * @var FacebookClient The Facebook client service.
    */
    protected $client;

    /**
     * @var string The api version
     */
    public $apiVersion;

    public function __construct(array $config = [])
    {
        $config = array_merge([
            'public_token' => getenv(static::PUBLIC_TOKEN_ENV_NAME),
            'private_token' => getenv(static::PRIVATE_TOKEN_ENV_NAME),
            'api_version' => 'v1.0',
            'test_mode' => false,
        ], $config);

        if (!$config['public_token']) {
            throw new Exception('Required "public_token" key not supplied in config and could not find fallback environment variable "' . static::PUBLIC_TOKEN_ENV_NAME . '"');
        }

        if (!$config['private_token']) {
            throw new Exception('Required "private_token" key not supplied in config and could not find fallback environment variable "' . static::PRIVATE_TOKEN_ENV_NAME . '"');
        }

        $this->client = new TwoTapClient($config);
        $this->apiVersion = $config['api_version'];
    }

    /**
     * @return Product
     */
    public function product()
    {
        return new Product($this->client);
    }

    /**
     * @return Cart
     */
    public function cart()
    {
        return new Cart($this->client);
    }

    /**
     * @return Purchase
     */
    public function purchase()
    {
        return new Purchase($this->client);
    }

    /**
     * @return Utils
     */
    public function utils()
    {
        return new Utils($this->client);
    }

    /**
     * @return PickupOptions
     */
    public function pickupOptions()
    {
        return new PickupOptions($this->client);
    }

    /**
     * @return Wallet
     */
    public function wallet()
    {
        return new Wallet($this->client);
    }

}