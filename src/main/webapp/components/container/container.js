app.directive('container', ['$http', 'DataService', function($http, DataService) {
  return {
    templateUrl: 'components/container/container.html',
    transclude: true,
    scope: {
      emptyMessage: '@',
      errorMessage: '@',
      route: '=',
      contentData: '='
    },
    link: function(scope, element, attrs, ctrl, transclude) {
      var withData = !angular.isUndefined(attrs.contentData);
      scope.dataLoading = true;
      scope.loadingError = false;
      scope.dataEmpty = false;
      scope.showData = false;
      scope.errorDetails = {};
      
      // Creation d'une transclusion avec le scope de la directive et ajout
      // du contenu calculé dans le document (element data-list)
      transclude(scope, function(clone, scope) {
        var element = angular.element(document.getElementsByClassName('data-list'));
        if (withData)
          element.innerHTML = clone;
        else 
          element.append(clone);
      });

      if (!withData) {
        scope.$watch('route', function (value) {
          scope.data = [];
          scope.dataLoading = true;
          scope.dataEmpty = false;
          DataService.get(value).then(function (result) {
            scope.dataLoading = false;
            scope.data = result;
            scope.dataEmpty = (scope.data.length === 0);
            scope.showData = !scope.dataEmpty;
          }, function (errorResult) {
            scope.dataLoading = false;
            scope.loadingError = true;
            scope.errorDetails = errorResult;
          });  
        });
      } else {
        scope.$watch('contentData', function(value) {
          scope.data = value;
          scope.dataLoading = false;
          if (!angular.isUndefined(value)) {
            scope.dataEmpty = (value.length === 0);
          }
          scope.showData = !scope.dataEmpty;
        });
      }
    }
  };
}]);