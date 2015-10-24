app.directive('loader', function() {
  return {
    templateUrl: 'components/loader/loader.html',
    scope: {
      label: '@'
    },
    link: function(scope, attrs) {
      if (angular.isUndefined(attrs.label))
        scope.label = "Chargement...";
    }
  };
});