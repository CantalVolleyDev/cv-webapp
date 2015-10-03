app.directive('newsList', [function() {
  return {
    templateUrl: 'components/newslist/newslist.html',
    link: function(scope) {
      scope.newsList = {
        currentPage: 1
      };
      scope.nextPage = function() {
        scope.newsList.currentPage = scope.newsList.currentPage + 1;
        scope.newsList.currentRouteUrl = '/news?published=true&limitTo=4&page=' + scope.newsList.currentPage;
      };
      scope.previousPage = function() {
        if (scope.newsList.currentPage == 1)
          return;
        scope.newsList.currentPage = scope.newsList.currentPage - 1;
        scope.newsList.currentRouteUrl = '/news?published=true&limitTo=4&page=' + scope.newsList.currentPage;
      };
      scope.isPreviousEnabled = function() {
        return scope.newsList.currentPage > 1;
      };
      scope.isNextEnabled = function() {
        return true;
      };
      scope.newsList.currentRouteUrl = '/news?published=true&limitTo=4&page=' + scope.newsList.currentPage;
    }
  };
}]);