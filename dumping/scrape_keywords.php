<?php
include_once 'models.php';
use Cake\Utility\Hash;
use ForceUTF8\Encoding;
use MongoDB\BSON\UTCDateTime;

$colorItems[] = 'yellow';
$colorItems[] = 'gold';
$colorItems[] = 'orange';
$colorItems[] = 'brown';
$colorItems[] = 'red';
$colorItems[] = 'pink';
$colorItems[] = 'violet';
$colorItems[] = 'fuchsia';
$colorItems[] = 'magenta';
$colorItems[] = 'purple';
$colorItems[] = 'cyan';
$colorItems[] = 'turquoise';
$colorItems[] = 'teal';
$colorItems[] = 'green';
$colorItems[] = 'blue';
$colorItems[] = 'white';
$colorItems[] = 'beige';
$colorItems[] = 'grey';
$colorItems[] = 'indigo';
$colorItems[] = 'black';

$modelSuggestions = new sss_keyword_suggestions();
$modelScraped     = new sss_keyword_scraped();
$modelBrand       = new bbrandprosperents();

$scrapedWords = $modelScraped->find([], ['projection' => ['_id' => 0]]);
$scrapedPrev  = object2Array($scrapedWords);
if ($scrapedPrev !== []) {
    $scrapedPrev = Hash::combine($scrapedPrev, '{n}.keyword', '{n}.keyword');
}

$shopStyle = 'https://www.shopstyle.com/api/v2/site/autocomplete?pid=shopstyle&term=';
$lyst      = 'https://www.lyst.com/api/rothko/modules/search_input/auto_complete/?query=';

$letters = range('a', 'z');

$colorItems = array_merge($colorItems, $letters);

$keywords = [];

$keywordsPrev = $modelSuggestions->find([], ['projection' => ['_id' => 0]]);
$keywordsPrev = object2Array($keywordsPrev);
if ($keywordsPrev !== []) {
    $keywords = Hash::combine($keywordsPrev, '{n}.keyword', '{n}.keyword');
}

$newTerms = [];
foreach ($keywords as $keyword) {
    $exploded = explode(' ', $keyword);
    foreach ($exploded as $item) {
        if (!in_array($item, $scrapedPrev) && strlen($item) > 3) {
            $newTerms[$item] = $item;
        }
    }
}

$brandsPrev = $modelBrand->find([], ['projection' => ['_id' => 0]]);
$brandsPrev = object2Array($brandsPrev);
if ($brandsPrev !== []) {
    $brandsPrev = Hash::combine($brandsPrev, '{n}.brand', '{n}.brand');

    foreach ($brandsPrev as $key => $brand) {
        if (strlen($brand) > 3) {
            foreach ($colorItems as $colorItem) {
                $brandsPrev[$brand . ' ' . $colorItem] = $brand . ' ' . $colorItem;
            }
        }
    }

    $brandsPrev = array_values($brandsPrev);
}

$colorItems = array_merge($colorItems, $brandsPrev);

foreach ($colorItems as $colorItem) {

    $colorItem = strtolower(Encoding::fixUTF8(trim($colorItem)));

    if (in_array($colorItem, $scrapedPrev) === false && strlen($colorItem) >= 3) {

        try {
            $modelScraped->insertOne(['keyword' => $colorItem, 'last_scraped' => new UTCDateTime()]);
        } catch (Exception $ex) {
            $ex->getMessage();
        }

        $shopStyleUrl = $shopStyle . $colorItem;

        $jsonResults = _curl_get($shopStyleUrl);

        $jsonResults = json_decode($jsonResults);

        if (isset($jsonResults->suggestions)) {
            foreach ($jsonResults->suggestions as $suggestion) {
                $keyword = strtolower(Encoding::fixUTF8(trim($suggestion->label)));

                $keywords[$keyword] = $keyword;

                try {
                    $modelSuggestions->insertOne(['keyword' => $keyword]);
                } catch (Exception $ex) {
                    $ex->getMessage();
                }
            }
        }

        $lystUrl     = $lyst . $colorItem;
        $jsonResults = _curl_get($lystUrl);

        $jsonResults = json_decode($jsonResults);

        if (isset($jsonResults->data->query_suggestions)) {
            foreach ($jsonResults->data->query_suggestions as $suggestion) {
                $keyword = strtolower(Encoding::fixUTF8(trim(strip_tags($suggestion->query))));

                $keywords[$keyword] = $keyword;

                try {
                    $modelSuggestions->insertOne(['keyword' => $keyword]);
                } catch (Exception $ex) {
                    $ex->getMessage();
                }
            }
        }
    }
}

if ($keywords !== [] && false) {
    sort($keywords);
    //$modelSuggestions->deleteMany([]);

    $finalKeywords = [];
    foreach ($keywords as $keyword) {
        $temp['keyword'] = $keyword;
        $finalKeywords[] = $temp;
    }
    //$modelSuggestions->insertMany($finalKeywords);
}
pr(count($keywords));
//pr($keywords);

echo exeTime();

exit;