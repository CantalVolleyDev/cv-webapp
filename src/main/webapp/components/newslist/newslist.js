app.directive('newsList', [function() {
  return {
    templateUrl: 'components/newslist/newslist.html',
    link: function(scope) {
      scope.newsList = {
        currentPage: 1
      };
      scope.nextPage = function() {
        scope.newsList.currentPage + 1;
      };
    }
  };
}]);