app.controller('ScoreCtrl', ['$scope', 'DefaultDataCtrlProperties', 'AccountService', '$location', 'ScoreDisplayHelper', '$routeParams', 'DataService', function ($scope, DefaultDataCtrlProperties, AccountService, $location, ScoreDisplayHelper, $routeParams, DataService) {
  $scope.score = angular.extend({}, DefaultDataCtrlProperties, {
    errorDataSubmit: false,
    service: ScoreDisplayHelper,
    updateMatchPlayer: function(teamId, playerId) {
      var array = $scope.score.data.firstTeamMatchPlayers;
      var arrayPlayers = $scope.score.data.firstTeamPlayers;
      var team = angular.extend({}, $scope.score.data.match.firstTeam);
      if (teamId === $scope.score.data.match.secondTeam.identifier) {
        array = $scope.score.data.secondTeamMatchPlayers;
        arrayPlayers = $scope.score.data.secondTeamPlayers;
        team = angular.extend({}, $scope.score.data.match.secondTeam);
      }
      var player = angular.extend({}, _.find(arrayPlayers, function (player) {
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
        userTeams: self.data.userTeams,
        submitterComment: self.data.submitterComment
      };
      var saveInfos = {
        matchState: matchInfos.match.state
      };
      if (self.data.userTeams.length === 2) {
        matchInfos.match.state === 'V';
      } else {
        if (matchInfos.match.state === 'C') {
          matchInfos.match.state = 'S';
        } else if (matchInfos.match.state === 'S' || matchInfos.match.state === 'R') {
          if (ScoreDisplayHelper.enableScoreFlag)
            matchInfos.match.state = 'R';
          else
            matchInfos.match.state = 'V';
        }
      }
      DataService.post('/matchs/' + $routeParams.id + '/submit', matchInfos).then(function (data) {
        if (directValidation) {
          $location.path('/login/match/' + $routeParams.id + '/' + $scope.score.service.getOppositeTeamId());
        }
        self.submitSuccessMessage = "Match validé avec succès.";
        self.loading = false;
      }, function (data) {
        self.errorData = data;
        self.errorDataSubmit = true;
        self.loading = false;
        self.data.match.state = saveInfos.matchState;
      });
    },
    refuse: function() {
      ScoreDisplayHelper.enableScoreFlag = true;
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
    }
  });
  AccountService.promise.then(function () {
    DataService.get('/matchs/' + $routeParams.id + '/submitInfos').then(function (data) {
      $scope.score.data = data;
      ScoreDisplayHelper.init(data, $routeParams.direct);
      $scope.score.loading = false;
    }, function (data) {
      $scope.score.errorData = data;
      $scope.score.loading = false;
    });
  });
}]);