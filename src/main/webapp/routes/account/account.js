app.controller('AccountCtrl', ['$scope', 'AccountService', 'DataService', '$location', function ($scope, AccountService, DataService, $location) {
  $scope.account = {
    loading: true,
    service: AccountService,
    matchs: [],
    teams: [],
    sorted: {}
  };
  $scope.disconnect = function () {
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
        } else {
          return match.sc1 + '/' + match.sc2;
        }
      };
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
      $scope.account.sorted.lastMatchs = _.filter($scope.account.matchs, function (match) {
        return match.state === 'V';
      });
      $scope.account.sorted.lateMatchs = _.filter($scope.account.matchs, function (match) {
        return now.isAfter(match.display.momentDate) && match.state === 'C';
      });
      $scope.account.sorted.waitingMatchs = _.filter($scope.account.matchs, function (match) {
        return match.state === 'S';
      });
      $scope.account.loading = false;
    });
  });
}]);