angular.module('SSApp').directive('blogComponent', ['$http', '$route', '$routeParams', '$location', '$timeout', function($http, $route, $routeParams, $location, $timeout){
  return {
    restrict: 'E',
    templateUrl: 'assets/directive/components/account/blogView.html',
    link: function(scope, element, attrs){
      scope.linkedPro = {};
      scope.loadDone = true;
      // scope.linkedProLoading = false;
      scope.currentpage = 1;
      scope.loadMoreClicked = false;
      scope.matchTarget = 1;
      scope.$parent.addTobagPossible = true;
    	scope.$parent.ck_all = true;

      var getLinkedPro = function(pgNo) {
        scope.loadDone = false;
        // scope.linkedProLoading = true;
        $http({
          method: 'GET',
          url: '/blogData/' + pgNo
        }).then(function successCallback(response) {

          console.log(response);
          scope.linkedPro = angular.merge(scope.linkedPro, response.data.products);
          scope.loadDone = true;
          if (pgNo === 1) {
            scope.totalLinkPro = response.data.pagination.total;
            scope.linkProNumPages = Math.ceil(scope.totalLinkPro / 200);
          }
        }, function errorCallback() {
          console.log('Data not found');
        });
      };

      getLinkedPro(1);

      scope.lnkProLoadMore = function($event, pageNo) {
        // scope.blogPgNumber=pgNo;
        var gothere = '#targetNo' + pageNo;
        var gotherePrev = '#targetNo' + (pageNo - 1);
        scope.loadMoreClicked = true;
        scope.activePage = pageNo;
        scope.maxIndex = pageNo * 200;

        // Going on position which is already loaded
        if ($('#targetNo' + (pageNo)).length && $(gothere).length) {
          // console.log('got there without load')
          $('html, body').animate({ scrollTop: $(gothere).offset().top }, 700);
        }

        // After loading one page Next page will start loaded
        scope.$watch('loadDone', function () {
          if (pageNo > scope.currentpage && scope.loadDone) {
            scope.currentpage += 1;
            getLinkedPro(scope.currentpage);
          }

          // Going on position after loading
          $timeout(function () {
            if (pageNo === scope.currentpage && scope.loadDone) {
              if ($(gothere).length) {
                $('html, body').animate({ scrollTop: $(gothere).offset().top }, 700);
              } else {
                $('html, body').animate({ scrollTop: $(gotherePrev).offset().top }, 700);
              }
            }
            scope.matchTarget = 2;
          }, 500);

        });
      };

      scope.productPageNo = function (indexNo, proLimit) {
        if (indexNo === 0) {
          return Math.ceil((indexNo + 1) / proLimit);
        } else {
          return Math.ceil((indexNo + 1) / proLimit) + 1;
        }
      };

      scope.currentLinkedPro = function (linkedProIndex) {
        scope.ProRecommended = scope.linkedPro[linkedProIndex].recommended_by;
      };

      scope.current_limit = 3;
      scope.viewPagination = function (direction) {
        if (scope.current_limit < scope.linkProNumPages && direction === 'next') scope.current_limit += 3;
        if (scope.current_limit >= 6 && direction === 'prev') scope.current_limit -= 3;
      };
    },
  };
}]);
