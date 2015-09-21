app.directive('alert', function() {
  return {
    templateUrl: 'components/alert/alert.html',
    scope: {
      errorData: '='
    },
    link: function(scope) {
      scope.display = {collapsed: true};
      scope.$watch('errorData', function (value) {
        scope.error = {};
        if (!angular.isUndefined(value)) {
          if (value.status) {
            scope.error.status = value.status;
          }
          if (value.data) {
            var data = value.data;
            scope.error.data = data;
            if (data.message) {
              scope.error.message = data.message; 
            }
          }
        }
      });
    }
  };
});