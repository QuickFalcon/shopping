var validatorsServiceModule = angular.module('validatorsServiceModule', []);

validatorsServiceModule.factory('validatorsService', [function(){
  return {
    determinePasswordStrength: function(pass){
      var tests = 0;
      var result = {};

      // length
      if (pass && pass.length > 4) {
        tests += 1;
      }

      // number
      if (pass && pass.match(/\d/)) {
        tests += 1;
      }

      // upper and lower case (test them is separate regexs)
      if (pass && pass.match(/[a-z]/)) {
        tests += 1;
      }

      switch (tests) {
        case 0:
          result.name = 'weak';
          result.value = '0%';
          break;
        case 1:
          result.name = 'weak';
          result.value = '33%';
          break;
        case 2:
          result.name = 'medium';
          result.value = '66%';
          break;
        case 3:
          result.name = 'strong';
          result.value = '100%';
          break;
      }
      return result;
    },
  }
}])
