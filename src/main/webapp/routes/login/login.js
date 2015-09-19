app.controller('LoginCtrl', ['$scope', 'AccountService', '$location', function ($scope, AccountService, $location) {
  $scope.login = {
    loading: true,
    fields: {mail: 'j.touzy@qualiac.com', password: ''}
  };
  $scope.log = function () {
    AccountService.login($scope.login.fields.mail, $scope.login.fields.password).then(function () {
      $location.path('/account');
    });
  };
  AccountService.promise.then(function () {
    if (AccountService.logged()) {
      $location.path('/account');
      return;
    }
    $scope.login.loading = false;
  });
}]);