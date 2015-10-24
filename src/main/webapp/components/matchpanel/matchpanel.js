app.directive('matchPanel', ['$location', function($location) {
  return {
    templateUrl: 'components/matchpanel/matchpanel.html',
    scope: {
      title: '@',
      data: '=',
      important: '=',
      showDetails: '=',
      openDetails: '=',
      default: '=',
      teamDisplay: '='
    },
    link: function(scope) {
      scope.matchClick = function(match) {
        if (scope.openDetails) {
          $location.path('/match/' + match.identifier);
        } else {
          $location.path('/score/' + match.identifier);
        }
      };
      scope.isDisplayWinner = function(match) {
        if (!scope.teamDisplay)
          return false;
        if (match.display.firstWinner && scope.teamDisplay == match.firstTeam.identifier)
          return true;
        if (match.display.secondWinner && scope.teamDisplay == match.secondTeam.identifier)
          return true;
        return false;
      },
      scope.isDisplayLooser = function(match) {
        if (!scope.teamDisplay)
          return false;
        if (match.display.firstWinner && scope.teamDisplay != match.firstTeam.identifier)
          return true;
        if (match.display.secondWinner && scope.teamDisplay != match.secondTeam.identifier)
          return true;
        return false;
      }
    }
  };
}]);