app.controller('AccountCtrl', ['$scope', 'AccountService', '$location', function ($scope, AccountService, $location) {
  $scope.account = {
    loading: true,
    service: AccountService
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
    $scope.account.loading = false;
  });
}]);