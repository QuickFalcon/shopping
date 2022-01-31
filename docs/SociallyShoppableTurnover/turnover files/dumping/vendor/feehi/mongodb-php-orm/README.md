Installation
============



Use composer(recommended)
-------------------------------

Add mongodb-php-orm to the require section of your **composer.json** file:

```js
{
    "require":{
        "feehi/mongodb-php-orm" : "*"
    }
}
```

And run following command to download extension using **composer**:

```bash
$ php composer.phar update
```

Use download archive
----------------------------------

1. Download source archive
2. require 'autoload.php'

Usage
============
1. Modify src/config.php to the correct mongodb config
2. Create model, and save filename like xxx.php
```php
use Feehi\mongo\Model;
class xxx extends Model{    
}
```
3. In controllers
```php
$model = new xxx();
$document = [];
$model->insert($document);
var_dump($model->find());
......
```

