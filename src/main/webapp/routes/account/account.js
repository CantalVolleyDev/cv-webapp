app.controller('AccountCtrl', ['$scope', 'AccountService', 'DataService', '$location', function ($scope, AccountService, DataService, $location) {
  $scope.account = {
    loading: true,
    service: AccountService,
    matchs: [],
    teams: [],
    teamIds: [],
    sorted: {}
  };
  $scope.disconnect = function () {
    $scope.account.loading = true;
    AccountService.logout().then(function () {
      $location.path('/login');
    });
  };
  AccountService.promise.then(function () {
    if (!AccountService.logged()) {
      $location.path('/login');
      return;
    }
    DataService.get('/user/account').then(function (data) {
      $scope.account.matchs = data.matchs;
      $scope.account.teams = data.teams;
      $scope.account.imageExists = data.uploadImage;
      var now = moment();
      var scoreWriter = function(match) {
        if (match.state === 'F') {
          return 'Forfait';
        } else if (match.state == 'V' || match.state == 'S' || match.state == 'R') {
          return match.sc1 + '/' + match.sc2;
        } else {
          return '-';
        }
      };
      $scope.account.teamIds = [];
      _.each($scope.account.teams, function (team) {
        $scope.account.teamIds.push(team.team.identifier);
      });
      _.each($scope.account.matchs, function (match) {
        var momentDate = moment(match.date);
        var played = (match.stamat !== 'C');
        match.display = {
          momentDate: momentDate,
          shortDate: momentDate.format("DD/MM"),
          generalScore: scoreWriter(match),
          firstWinner: (played && match.stamat !== 'F' && match.sc1 > match.sc2),
          secondWinner: (played && match.stamat !== 'F' && match.sc2 > match.sc1)
        };
      })
      $scope.account.sorted.nextMatchs = _.filter($scope.account.matchs, function (match) {
        return now.isBefore(match.display.momentDate) && match.state === 'C';
      });
      $scope.account.sorted.waitingValidationMatchs = _.filter($scope.account.matchs, function (match) {
        return (match.state === 'S' || match.state === 'R') && 
                $scope.account.teamIds.indexOf(match.scoreSettingTeam.identifier) === -1;
      });
      $scope.account.sorted.lateMatchs = _.filter($scope.account.matchs, function (match) {
        return now.isAfter(match.display.momentDate) && match.state === 'C';
      });
      $scope.account.sorted.waitingMatchs = _.filter($scope.account.matchs, function (match) {
        return (match.state === 'S' || match.state === 'R') && 
                $scope.account.teamIds.indexOf(match.scoreSettingTeam.identifier) !== -1;
      });
      $scope.account.loading = false;
    });
  });
}]);