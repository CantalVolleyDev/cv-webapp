app.controller('ScoreCtrl', ['$scope', 'DefaultDataCtrlProperties', 'AccountService', '$location', 'ScoreDisplayHelper', '$routeParams', 'DataService', function ($scope, DefaultDataCtrlProperties, AccountService, $location, ScoreDisplayHelper, $routeParams, DataService) {
  $scope.score = angular.extend({}, DefaultDataCtrlProperties, {
    errorDataSubmit: false,
    service: ScoreDisplayHelper,
    enableScoreFlag: true,
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
    },
    submit: function(directValidation) {
      var self = this;
      self.loading = true;
      self.errorDataSubmit = false;
      self.errorData = undefined;
      var matchInfos = {
        match: self.data.match,
        firstTeamMatchPlayers: self.data.firstTeamMatchPlayers,
        secondTeamMatchPlayers: self.data.secondTeamMatchPlayers,
        userTeams: self.data.userTeams
      };
      var message;
      if (self.data.userTeams.length === 2) {
        matchInfos.match.state === 'V';
        message = "Match validé avec succès.";
      } else {
        if (matchInfos.match.state === 'C' || matchInfos.match.state === 'R') {
          matchInfos.match.state = 'S';
          message = "Score du match saisi avec succès : Le match sera validé lorsque l'équipe adverse aura confirmé le score.";
          matchInfos.match.scoreSetter = {
            identifier: self.data.userTeams[0];
          };
        } else if (matchInfos.match.state === 'S') {
          matchInfos.match.state = 'V';
          message = "Match validé avec succès.";
        }
      }
      DataService.post('/matchs/' + $routeParams.id + '/submit', matchInfos).then(function (data) {
        self.submitSuccessMessage = message;
        self.loading = false;
      }, function (data) {
        self.errorData = data;
        self.errorDataSubmit = true;
        self.loading = false;
      });
    },
    refuse: function() {
      this.enableScoreFlag = true;
    },
    displayData: function(strict) {
      if (this.loading || (this.displayError() && !this.errorDataSubmit) || this.displaySuccess())
        return false;
      return true;
    },
    displaySuccess: function() {
      if (this.loading || this.displayError() || angular.isUndefined($scope.score.submitSuccessMessage))
        return false;
      return true;
    },
    isScoreEnabled: function() {
      return (this.service.isScoreEnabled() && this.enableScoreFlag);
    }
  });
  AccountService.promise.then(function () {
    DataService.get('/matchs/' + $routeParams.id + '/submitInfos').then(function (data) {
      $scope.score.data = data;
      ScoreDisplayHelper.init(data);
      $scope.score.enableScoreFlag = ScoreDisplayHelper.isScoreEnabled();
      $scope.score.loading = false;
    }, function (data) {
      $scope.score.errorData = data;
      $scope.score.loading = false;
    });
  });
}]);