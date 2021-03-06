<?php
$params = array(
    array('c[]', 'United+States')
);

$params_x = array(
    array('ac', 'on'), //all countries [remove line below to exclude. don't forget to remove this line if at least one country excluded]
    array('c[]', 'Angola'),
    array('c[]', 'Argentina'),
    array('c[]', 'Armenia'),
    array('c[]', 'Austria'),
    array('c[]', 'Bangladesh'),
    array('c[]', 'Belgium'),
    array('c[]', 'Brazil'),
    array('c[]', 'Canada'),
    array('c[]', 'Chile'),
    array('c[]', 'China'),
    array('c[]', 'Colombia'),
    array('c[]', 'Czech+Republic'),
    array('c[]', 'Ecuador'),
    array('c[]', 'France'),
    array('c[]', 'Germany'),
    array('c[]', 'Hong+Kong'),
    array('c[]', 'India'),
    array('c[]', 'Indonesia'),
    array('c[]', 'Iran'),
    array('c[]', 'Israel'),
    array('c[]', 'Italy'),
    array('c[]', 'Kenya'),
    array('c[]', 'Korea,+Republic+of'),
    array('c[]', 'Latvia'),
    array('c[]', 'Malaysia'),
    array('c[]', 'Mexico'),
    array('c[]', 'Netherlands'),
    array('c[]', 'Netherlands+Antilles'),
    array('c[]', 'New+Zealand'),
    array('c[]', 'Norway'),
    array('c[]', 'Panama'),
    array('c[]', 'Paraguay'),
    array('c[]', 'Puerto+Rico'),
    array('c[]', 'Reunion'),
    array('c[]', 'Romania'),
    array('c[]', 'Russian+Federation'),
    array('c[]', 'Saudi+Arabia'),
    array('c[]', 'Slovenia'),
    array('c[]', 'South+Africa'),
    array('c[]', 'Spain'),
    array('c[]', 'Sweden'),
    array('c[]', 'Switzerland'),
    array('c[]', 'Taiwan'),
    array('c[]', 'Thailand'),
    array('c[]', 'Trinidad+and+Tobago'),
    array('c[]', 'Turkey'),
    array('c[]', 'United+Arab+Emirates'),
    array('c[]', 'United+Kingdom'),
    array('c[]', 'United+States'),
    array('c[]', 'Venezuela'),
    array('c[]', 'Viet+Nam'),
    array('allPorts', '1'),
    array('p', ''), //exclude this ports, comma separated string, if none - empty string
    // array('pr[]', 0), //Protocol - HTTP [remove any of lines below to exclude]
    // array('pr[]', 1), //Protocol - HTTPS
    array('pr[]', 2), //Protocol - SOCKS4/SOCKS5
    // array('a[]', 0), //Anonymity Level - None [remove any of lines below to exclude]
    // array('a[]', 1), //Anonymity Level - Low
    // array('a[]', 2), //Anonymity Level - Medium
    // array('a[]', 3), //Anonymity Level - High
    array('a[]', 4), //Anonymity Level - High + KA
    //array('pl', 'off'), //Planetlab include: "on"  Otherwise comment out
    // array('sp[]', 1), //Speed - slow [remove any of lines below to exclude]
    // array('sp[]', 2), //Speed - medium
    array('sp[]', 3), //Speed - fast
    // array('ct[]', 1), //Connection time - slow [remove any of lines below to exclude]
    // array('ct[]', 2), //Connection time - medium
    array('ct[]', 3), //Connection time - fast
    array('s', 0), //Sort by: 0 - Date tested, 1 - Response time, 2 - Connection time, 3 - Country A-Z
    array('o', 0), // Order: 0 - ASC, 1 - DESC
    array('pp', 3), //Per page: 0 - 10, 1 - 25, 2 - 50, 3 - 100
    array('sortBy', 'date') //Sort by: "date" - Date tested, "response_time" - Response time, "connection_time" - Connection time, "country" - Country A-Z
);