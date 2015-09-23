app.controller('ScoreCtrl', ['$scope', 'DefaultDataCtrlProperties', 'AccountService', '$location', 'ScoreDisplayHelper', '$routeParams', 'DataService', function ($scope, DefaultDataCtrlProperties, AccountService, $location, ScoreDisplayHelper, $routeParams, DataService) {
  $scope.score = angular.extend(DefaultDataCtrlProperties, {
    errorDataSubmit: false,
    service: ScoreDisplayHelper,
    updateMatchPlayer: function(teamId, playerId) {
      var array = $scope.score.data.firstTeamMatchPlayers;
      var team = angular.extend({}, $scope.score.data.match.firstTeam);
      if (teamId === $scope.score.data.match.secondTeam.identifier) {
        array = $scope.score.data.secondTeamMatchPlayers;
        team = angular.extend({}, $scope.score.data.match.secondTeam);
      }
      var player = angular.extend({}, _.find($scope.score.data.firstTeamPlayers, function (player) {
        return playerId === player.player.identifier;
      }));
      if ($scope.score.service.isUserInMatch(teamId, playerId)) {
        _.remove(array, function(player) {
          return player.player.identifier === playerId;
        });
      } else {
        array.push({
          match: $scope.score.data.match,
          player: player.player,
          team: team
        });
      }
      console.log($scope.score.data);
    },
    submit: function(directValidation) {
      $scope.score.loading = true;
      $scope.score.errorDataSubmit = false;
      $scope.score.errorData = undefined;
      var matchInfos = {
        match: $scope.score.data.match,
        firstTeamMatchPlayers: $scope.score.data.firstTeamMatchPlayers,
        secondTeamMatchPlayers: $scope.score.data.secondTeamMatchPlayers
      };
      if (matchInfos.match.state === 'C' || matchInfos.match.state === 'R') {
        matchInfos.match.state = 'S';
      } else if (matchInfos.match.state === 'S') {
        matchInfos.match.state = 'V';
      }
      DataService.post('/matchs/' + $routeParams.id + '/submit', matchInfos).then(function (data) {
           
      }, function (data) {
        $scope.score.errorData = data;
        $scope.score.errorDataSubmit = true;
        $scope.score.loading = false;
      });
    },
    displayData: function(strict) {
      if (this.loading || (this.displayError() && !this.errorDataSubmit))
        return false;
      return true;
    }
  });
  AccountService.promise.then(function () {
    DataService.get('/matchs/' + $routeParams.id + '/submitInfos').then(function (data) {
      $scope.score.data = data;
      ScoreDisplayHelper.init(data);
      $scope.score.loading = false;
    }, function (data) {
      $scope.score.errorData = data;
      $scope.score.loading = false;
    });
  });
}]);