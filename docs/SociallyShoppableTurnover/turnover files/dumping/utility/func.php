<?php

function pr($arr)
{
    echo '<pre>';
    print_r($arr);
    echo '</pre>';
}

/**
 * Set Script Time Out to a Higher Duration
 *
 * @return void
 */
function setScriptTimeLimit()
{
    set_time_limit(86400);
    ini_set('memory_limit', '3048M');
    ini_set('max_execution_time', 86400);
    ini_set('max_input_time', 86400);
}//end setScriptTimeLimit()

setScriptTimeLimit();

error_reporting(1);
ini_set('display_errors', 'On');

$bccArr[] = 'mainuljs@gmail.com';
$bccList  = implode(',', $bccArr);

$mailheaders = "MIME-Version: 1.0" . "\r\n";
$mailheaders .= "X-Priority: 1" . "\r\n";
$mailheaders .= "Content-Type: text/html; charset=\"iso-8859-1\"" . "\r\n";
$mailheaders .= "Content-Transfer-Encoding: 7bit" . "\r\n";
$mailheaders .= "From: Shoppable <support@shoppable.com>" . "\r\n";
//$mailheaders .= "Bcc: " . $bccList . "\r\n";
$mailheaders .= "X-Mailer: PHP/" . phpversion() . "\r\n";

define('MAIL_HEADERS', $mailheaders);

//sociallyshoppable2tap@gmail.com
$twoTapTokens[] = [
    'TWOTAP_PUBLIC_TOKEN'  => 'bc35986ded29131f39f1e0b11250c3',
    'TWOTAP_PRIVATE_TOKEN' => '0e3fbb72afd92529c4b521e5884d6857a1d05dd70cc9adbc24',
];

$nowSecond  = date('s');
$tokenIndex = floor($nowSecond/15);

$tokenInAction = $twoTapTokens[0];

putenv('TWOTAP_PUBLIC_TOKEN=' . $tokenInAction['TWOTAP_PUBLIC_TOKEN']);
putenv('TWOTAP_PRIVATE_TOKEN=' . $tokenInAction['TWOTAP_PRIVATE_TOKEN']);

putenv('SEM_KEY=SEM355D844D3BE30F097DCCF5308211FFD13');
putenv('SEM_SECRET=MDdiYWE5ZjRlMjc3ZTI1YTIzOWM3ZTE4NDZkOWZjMWY');

function po($obj)
{
    echo '<pre>';
    print_r(json_decode(json_encode($obj), true));
    echo '</pre>';
}

function pj($str)
{
    echo '<pre>';
    print_r(json_decode($str, true));
    echo '</pre>';
}

function object2Array($object)
{
    return json_decode(json_encode($object), true);
}

function array2Object($object)
{
    return json_decode(json_encode($object));
}

/**
 * @param            $data
 * @param bool|false $exit
 */
function vr($data, $exit = false)
{
    $print = true;
    if (defined('PR_ENABLED') && !PR_ENABLED) {
        $print = false;
    }
    if ($print) {
        echo '<pre>';
        var_export($data);
        echo '</pre>';
    }
    if ($exit) {
        exit;
    }
}

function exeTime()
{
    sleep(1);
    return microtime(true) - $_SERVER["REQUEST_TIME_FLOAT"];
}

/**
 * @param $url
 *
 * @return mixed
 */
function _curl_get($url)
{
    $ch = curl_init($url);

    $agent = 'Mozilla/5.0 (Windows NT 6.2; WOW64; rv:17.0) Gecko/20100101 Firefox/17.0';
    curl_setopt($ch, CURLOPT_USERAGENT, $agent);

    curl_setopt($ch, CURLOPT_REFERER, 'https://www.google.com');
    curl_setopt($ch, CURLOPT_AUTOREFERER, true);

    $dir    = dirname(__FILE__);
    $cookie = $dir . '/cookies/' . md5($_SERVER['REMOTE_ADDR']) . '.txt';

    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);

    curl_setopt($ch, CURLOPT_COOKIEFILE, $cookie);
    curl_setopt($ch, CURLOPT_COOKIEJAR, $cookie);

    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 20);
    curl_setopt($ch, CURLOPT_TIMEOUT, 20); //timeout in seconds

    $data = curl_exec($ch);
    curl_close($ch);
    return $data;
}

function _check_stock($url)
{
    $pageContent = _curl_get($url);

    $dom = new DOMDocument();

    $dom->loadHTML($pageContent);

    $xpath = new DOMXPath($dom);
    foreach ($xpath->query('//script') as $node) {
        $node->parentNode->removeChild($node);
    }

    $pageContent = $dom->saveHTML();

    $pageContent = (strtolower($pageContent));

    $notFoundArr[] = 'not available';
    $notFoundArr[] = 'currently unavailable';
    $notFoundArr[] = 'unavailable';
    $notFoundArr[] = 'out of stock';
    $notFoundArr[] = 'not in stock';
    $notFoundArr[] = 'not found';
    $notFoundArr[] = 'not be found';

    $notFoundStr = implode('|', $notFoundArr);

    $cartArr[] = 'add to cart';
    $cartArr[] = 'add to bag';

    $cartStr = implode('|', $cartArr);

    if (preg_match('(' . $notFoundStr . ')', $pageContent, $matches) === 1) {
        pr($matches);
        return false;
    } else if (preg_match('#(' . $cartStr . ')#i', $pageContent, $matches2) !== 1) {
        return false;
    } else {
        pr($matches2);
        return true;
    }
}

function _curl_get_object($url)
{
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    $data = curl_exec($ch);
    curl_close($ch);
    return json_decode($data);
}

function _curl_get_header_x($url, $proxy = [])
{
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_NOBODY, TRUE);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 20);
    curl_setopt($ch, CURLOPT_TIMEOUT, 20); //timeout in seconds

    $agent = 'Mozilla/5.0 (Windows NT 6.2; WOW64; rv:17.0) Gecko/20100101 Firefox/17.0';
    $agent = 'Googlebot/2.1 (http://www.googlebot.com/bot.html)';
    curl_setopt($ch, CURLOPT_USERAGENT, $agent);

    if (isset($proxy['ip']) === true) {
        curl_setopt($ch, CURLOPT_PROXY, $proxy['ip'] . ':' . $proxy['port']);
        //curl_setopt($ch, CURLOPT_PROXYPORT, $proxy['port']);
    }

    curl_exec($ch);
    $header = curl_getinfo($ch);
    curl_close($ch);
    return $header;
}

function _curl_get_header($url, $proxy = [])
{
    $ch = curl_init($url);

    $agent = 'Mozilla/5.0 (Windows NT 6.2; WOW64; rv:17.0) Gecko/20100101 Firefox/17.0';
    curl_setopt($ch, CURLOPT_USERAGENT, $agent);

    curl_setopt($ch, CURLOPT_REFERER, 'https://www.google.com');
    curl_setopt($ch, CURLOPT_AUTOREFERER, true);

    $dir    = dirname(__FILE__);
    $cookie = $dir . '/cookies/' . md5($_SERVER['REMOTE_ADDR']) . '.txt';

    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    curl_setopt($ch, CURLOPT_COOKIEFILE, $cookie);
    curl_setopt($ch, CURLOPT_COOKIEJAR, $cookie);

    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_NOBODY, TRUE);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10); //timeout in seconds

    if (isset($proxy['ip']) === true) {
        curl_setopt($ch, CURLOPT_PROXY, $proxy['ip']);
        curl_setopt($ch, CURLOPT_PROXYPORT, $proxy['port']);
    }

    curl_exec($ch);
    $header = curl_getinfo($ch);
    curl_close($ch);
    return $header;
}

function disguise_curl($url)
{
    $ch = curl_init();

    // setup headers - used the same headers from Firefox version 2.0.0.6
    // below was split up because php.net said the line was too long. :/
    $header[0] = "Accept: text/xml,application/xml,application/xhtml+xml,";
    $header[0] .= "text/html;q=0.9,text/plain;q=0.8,image/png,*/*;q=0.5";
    $header[]  = "Cache-Control: max-age=0";
    $header[]  = "Connection: keep-alive";
    $header[]  = "Keep-Alive: 300";
    $header[]  = "Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7";
    $header[]  = "Accept-Language: en-us,en;q=0.5";
    $header[]  = "Pragma: "; //browsers keep this blank.

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.2.3) Gecko/20100401 Firefox/3.6.3');
    curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
    curl_setopt($ch, CURLOPT_REFERER, 'http://www.google.com');
    curl_setopt($ch, CURLOPT_ENCODING, 'gzip,deflate');
    curl_setopt($ch, CURLOPT_AUTOREFERER, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $html = curl_exec($ch); //execute the curl command
    if (!$html) {
        echo "cURL error number:" . curl_errno($ch);
        echo "cURL error:" . curl_error($ch);
        exit;
    }

    curl_close($ch); //close the connection

    return $html; //and finally, return $html
}

function _get_real_header($url, $proxy = [])
{
    if (stripos($url, 'redirect.php') !== false) {
        $url = _curl_get_product_url($url);
    }

    $header = _curl_get_header($url, $proxy);
    if (isset($header['redirect_url']) === true && $header['redirect_url'] !== '') {
        $header = _get_real_header($header['redirect_url'], $proxy);
    }
    return $header;
}

function clean_http($url)
{
    return str_replace(['https://', 'http://'], '', $url);
}

/**
 * @param      $url
 * @param      $postData
 * @param bool $extraInfo
 *
 * @return mixed
 */
function _curl_get_product_url($url)
{
    $productUrl = $url;

    $productLinkArr = explode('url=http', $url);
    if (isset($productLinkArr[1]) === true) {
        $productUrl = 'http' . trim(urldecode($productLinkArr[1]));
    }

    $productLinkArr = explode('url=http', $productUrl);
    if (isset($productLinkArr[1]) === true) {
        $productUrl = 'http' . trim(urldecode($productLinkArr[1]));
    }

    if (stripos($productUrl, 'tracking.searchmarketing') !== false) {
        $header     = _get_real_header($productUrl);
        $productUrl = @$header['url'];
    }
    $productUrl = strtok($productUrl, '?');


    return $productUrl;
}

/**
 * @param      $url
 * @param      $postData
 * @param bool $extraInfo
 *
 * @return mixed
 */
function _curl_post_object($url, $postData, $extraInfo = false)
{
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_POST, TRUE);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    $result = curl_exec($ch);
    if ($extraInfo) {
        $final_data['response_code'] = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $final_data['header']        = curl_getinfo($ch);
        $final_data['error']         = curl_error($ch);
        $final_data['response']      = $result;
        return $final_data;
    }
    return json_decode($result);
}

function slug($string, $replacement = '-')
{
    $string            = strtolower($string);
    $quotedReplacement = preg_quote($replacement, '/');

    $merge = array(
        '/[^\s\p{Zs}\p{Ll}\p{Lm}\p{Lo}\p{Lt}\p{Lu}\p{Nd}]/mu'              => ' ',
        '/[\s\p{Zs}]+/mu'                                                  => $replacement,
        sprintf('/^[%s]+|[%s]+$/', $quotedReplacement, $quotedReplacement) => '',
    );

    $map = transliteration() + $merge;
    return preg_replace(array_keys($map), array_values($map), $string);
}

function transliteration()
{

    return array(
        '/À|Á|Â|Ã|Å|Ǻ|Ā|Ă|Ą|Ǎ/'           => 'A',
        '/Æ|Ǽ/'                           => 'AE',
        '/Ä/'                             => 'Ae',
        '/Ç|Ć|Ĉ|Ċ|Č/'                     => 'C',
        '/Ð|Ď|Đ/'                         => 'D',
        '/È|É|Ê|Ë|Ē|Ĕ|Ė|Ę|Ě/'             => 'E',
        '/Ĝ|Ğ|Ġ|Ģ|Ґ/'                     => 'G',
        '/Ĥ|Ħ/'                           => 'H',
        '/Ì|Í|Î|Ï|Ĩ|Ī|Ĭ|Ǐ|Į|İ|І/'         => 'I',
        '/Ĳ/'                             => 'IJ',
        '/Ĵ/'                             => 'J',
        '/Ķ/'                             => 'K',
        '/Ĺ|Ļ|Ľ|Ŀ|Ł/'                     => 'L',
        '/Ñ|Ń|Ņ|Ň/'                       => 'N',
        '/Ò|Ó|Ô|Õ|Ō|Ŏ|Ǒ|Ő|Ơ|Ø|Ǿ/'         => 'O',
        '/Œ/'                             => 'OE',
        '/Ö/'                             => 'Oe',
        '/Ŕ|Ŗ|Ř/'                         => 'R',
        '/Ś|Ŝ|Ş|Ș|Š/'                     => 'S',
        '/ẞ/'                             => 'SS',
        '/Ţ|Ț|Ť|Ŧ/'                       => 'T',
        '/Þ/'                             => 'TH',
        '/Ù|Ú|Û|Ũ|Ū|Ŭ|Ů|Ű|Ų|Ư|Ǔ|Ǖ|Ǘ|Ǚ|Ǜ/' => 'U',
        '/Ü/'                             => 'Ue',
        '/Ŵ/'                             => 'W',
        '/Ý|Ÿ|Ŷ/'                         => 'Y',
        '/Є/'                             => 'Ye',
        '/Ї/'                             => 'Yi',
        '/Ź|Ż|Ž/'                         => 'Z',
        '/à|á|â|ã|å|ǻ|ā|ă|ą|ǎ|ª/'         => 'a',
        '/ä|æ|ǽ/'                         => 'ae',
        '/ç|ć|ĉ|ċ|č/'                     => 'c',
        '/ð|ď|đ/'                         => 'd',
        '/è|é|ê|ë|ē|ĕ|ė|ę|ě/'             => 'e',
        '/ƒ/'                             => 'f',
        '/ĝ|ğ|ġ|ģ|ґ/'                     => 'g',
        '/ĥ|ħ/'                           => 'h',
        '/ì|í|î|ï|ĩ|ī|ĭ|ǐ|į|ı|і/'         => 'i',
        '/ĳ/'                             => 'ij',
        '/ĵ/'                             => 'j',
        '/ķ/'                             => 'k',
        '/ĺ|ļ|ľ|ŀ|ł/'                     => 'l',
        '/ñ|ń|ņ|ň|ŉ/'                     => 'n',
        '/ò|ó|ô|õ|ō|ŏ|ǒ|ő|ơ|ø|ǿ|º/'       => 'o',
        '/ö|œ/'                           => 'oe',
        '/ŕ|ŗ|ř/'                         => 'r',
        '/ś|ŝ|ş|ș|š|ſ/'                   => 's',
        '/ß/'                             => 'ss',
        '/ţ|ț|ť|ŧ/'                       => 't',
        '/þ/'                             => 'th',
        '/ù|ú|û|ũ|ū|ŭ|ů|ű|ų|ư|ǔ|ǖ|ǘ|ǚ|ǜ/' => 'u',
        '/ü/'                             => 'ue',
        '/ŵ/'                             => 'w',
        '/ý|ÿ|ŷ/'                         => 'y',
        '/є/'                             => 'ye',
        '/ї/'                             => 'yi',
        '/ź|ż|ž/'                         => 'z',
    );
}

/**
 * @link http://gist.github.com/385876
 */
function csv_to_array($filename = '', $delimiter = ',')
{
    if (!file_exists($filename) || !is_readable($filename))
        return FALSE;

    $header = NULL;
    $data   = array();
    if (($handle = fopen($filename, 'r')) !== FALSE) {
        while (($row = fgetcsv($handle, 1000, $delimiter)) !== FALSE) {
            if (!$header)
                $header = $row;
            else
                $data[] = @array_combine($header, $row);
        }
        fclose($handle);
    }
    return $data;
}
