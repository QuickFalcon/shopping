var utilityFilterModule = angular.module('utilityFilterModule', []);

utilityFilterModule.filter('range', [function() {
    return function(input, total) {
        total = parseInt(total);
        for (var i=0; i<total; i++) {
            input.push(i);
        }
        return input;
    };
}]);

// convert num to positive
utilityFilterModule.filter('makePositive', [function(){
  return function(input){
    return Math.ceil(input);
  }
}]);
