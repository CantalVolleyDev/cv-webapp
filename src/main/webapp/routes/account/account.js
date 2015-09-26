app.controller('AccountCtrl', ['$scope', 'AccountService', 'DataService', '$location', 'MatchDataFormatter', function ($scope, AccountService, DataService, $location, MatchDataFormatter) {
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
      $scope.account.teamIds = [];
      _.each($scope.account.teams, function (team) {
        $scope.account.teamIds.push(team.team.identifier);
      });
      MatchDataFormatter.formatList($scope.account.matchs);
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