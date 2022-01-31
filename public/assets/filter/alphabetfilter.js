UserApp.filter('startWithOther', function () {
    return function (items) {
        if (items == undefined) return;
        var filtered = [];
        var letterMatch = new RegExp("^[a-zA-Z]+$");

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (!letterMatch.test(item.merchant.substring(0, 1))) {
                filtered.push(item);
            }
        }
        return filtered;
    };
});



angular.module('alphabetFilter', []).filter('cfilter', function () {
    return function (input, letter) {
        if (input == undefined) return;
        var groups = [];
        var item;
        var letterMatch = new RegExp(letter, 'i');



        for (var i = 0; i < input.length; i++) {
            item = input[i];
            if (letterMatch.test(item.merchant.substring(0, 1)))
                groups.push(item);
        }
        return groups;
    }
});


UserApp.filter('startWithOtherBrand', function () {
    return function (items) {
        if (items == undefined) return;
        var filtered = [];
        var letterMatch = new RegExp("^[a-zA-Z]+$");

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.brand != null) {
                if (!letterMatch.test(item.brand.substring(0, 1))) {
                    filtered.push(item);
                }
            }

        }
        return filtered;
    };
});


UserApp.filter('bfilter', function () {
    return function (input, letter) {
        if (input == undefined) return;
        var groups = [];
        var item;
        var letterMatch = new RegExp(letter, 'i');



        for (var i = 0; i < input.length; i++) {
            item = input[i];
            if (item.brand != null) {
                if (letterMatch.test(item.brand.substring(0, 1)))
                    groups.push(item);
            }
        }
        return groups;
    }
});




UserApp.filter('ultimatefilter', function () {
    return function (input) {
        if (input == undefined)
            return;
        var groups = {'a':[],'b':[],'c':[]  };
        var item;
        var letterMatchA = new RegExp('a', 'i');
        var letterMatchB = new RegExp('b', 'i');
        var letterMatchC = new RegExp('c', 'i');


        for (var i = 0; i < input.length; i++) {
            item = input[i];
            if (item.brand != null) {
                if (letterMatchA.test(item.brand.substring(0, 1)))
                    groups.a.push(item);
                else if(letterMatchB.test(item.brand.substring(0, 1))){

                    groups.b.push(item);
                }
                else if(letterMatchC.test(item.brand.substring(0, 1))){

                    groups.c.push(item);
                }

            }
        }
        console.log(groups);
        return groups;
    }
});



UserApp.filter('startWithOtherCategpry', function () {
    return function (items) {
        var filtered = [];
        var letterMatch = new RegExp("^[a-zA-Z]+$");
        if (items == undefined) return;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (!letterMatch.test(item.category.substring(0, 1))) {
                filtered.push(item);
            }
        }
        return filtered;
    };
});


UserApp.filter('catfilter', function () {
    return function (input, letter) {
        var groups = [];
        var item;
        var letterMatch = new RegExp(letter, 'i');

        if (input == undefined) return;

        for (var i = 0; i < input.length; i++) {
            item = input[i];
            if (letterMatch.test(item.category.substring(0, 1)))
                groups.push(item);
            //scope.alphabet =true;
        }
        return groups;
    }
});

UserApp.filter('lookForImage', function () {
    return function (item, color_arr, color_images) {
        if (color_arr.length > 0) {
            for (var i = 0; i < color_arr.length; i++) {
                for (var color_key in color_images) {
                    var color_key_lower = color_key.toLowerCase();
                    if (color_key_lower.indexOf(color_arr[i]) > -1) {
                        item = color_images[color_key].image;
                        break;
                    }
                }
            }
        }
        return item;
    };
});

UserApp.filter("removeDups", function(){
  return function(data) {
      var result = [];
	  var arr=[];
      var key = {};
      if(angular.isUndefined(data))
		  return;
	  
	  for(var i=0; i<data.length; i++) {
        var val = data[i];
		var temp= val.user['_id'];
		
		if(arr.indexOf(temp)<0) {
         
		 arr.push(temp);
          result.push(val);
        }
      }
      if(result.length > 0) {
        return result;
      }
    
    return data;
  }
})

UserApp.filter('orderObjectBy', function () {
    return function (items, field, reverse) {
        var filtered = [];
        angular.forEach(items, function (item) {
            filtered.push(item);
        });
        filtered.sort(function (a, b) {
            return (a[field] > b[field] ? 1 : -1);
        });
        if (reverse) filtered.reverse();
        return filtered;
    };
});
// For rendering for loop type in ng-repeat
UserApp.filter('range', function() {
    return function(input, total) {
        total = parseInt(total);
        for (var i=0; i<total; i++) {
            input.push(i);
        }
        return input;
    };
});

UserApp.filter('makePositive', function() {
    return function(num) {
      
	  return Math.ceil(num);
    };
});


