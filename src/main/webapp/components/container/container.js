app.directive('container', ['$http', 'DataService', function($http, DataService) {
  return {
    templateUrl: 'components/container/container.html',
    transclude: true,
    scope: {
      emptyMessage: '@',
      errorMessage: '@',
      route: '@'
    },
    link: function(scope, element, attrs, ctrl, transclude) {
      scope.dataLoading = true;
      scope.loadingError = false;
      scope.dataEmpty = false;
      scope.showData = false;
      scope.data = [];
      scope.errorDetails = {};
      // Creation d'une transclusion avec le scope de la directive et ajout
      // du contenu calculé dans le document (element data-list)
      transclude(scope, function(clone, scope) {
        angular.element(document.getElementsByClassName('data-list')).append(clone);
      });

      DataService.get(scope.route).then(function (result) {
        scope.dataLoading = false;
        scope.data = result.data;
        scope.dataEmpty = (scope.data.length === 0);
        scope.showData = !scope.dataEmpty;
      }, function (errorResult) {
        scope.dataLoading = false;
        scope.loadingError = true;
        scope.errorDetails = errorResult;
      });
    }
  };
}]);