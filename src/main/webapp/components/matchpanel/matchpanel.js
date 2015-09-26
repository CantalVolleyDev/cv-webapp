app.directive('matchPanel', ['$location', function($location) {
  return {
    templateUrl: 'components/matchpanel/matchpanel.html',
    scope: {
      title: '@',
      data: '=',
      important: '=',
      showDetails: '=',
      openDetails: '='
    },
    link: function(scope) {
      scope.matchClick = function(match) {
        if (scope.openDetails) {
          $location.path('/match/' + match.identifier);
        } else {
          $location.path('/score/' + match.identifier);
        }
      };
    }
  };
}]);