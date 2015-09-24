app.directive('matchPanel', ['$location', function($location) {
  return {
    templateUrl: 'components/matchpanel/matchpanel.html',
    scope: {
      title: '@',
      data: '='
    },
    link: function(scope) {
      scope.matchClick = function(match) {
        $location.path('/score/' + match.identifier);
      };
    }
  };
}]);