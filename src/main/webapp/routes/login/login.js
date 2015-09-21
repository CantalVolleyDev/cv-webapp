app.controller('LoginCtrl', ['$scope', 'AccountService', '$location', function ($scope, AccountService, $location) {
  $scope.login = {
    loading: true,
    fields: {mail: 'j.touzy@qualiac.com', password: ''},
    errorData: undefined,
    displayError: function () {
      return !this.loading && !angular.isUndefined(this.errorData);
    }
  };
  $scope.log = function () {
    $scope.login.loading = true;
    AccountService.login($scope.login.fields.mail, $scope.login.fields.password).then(function () {
      $location.path('/account');
    }, function (data) {
      $scope.login.fields.password = '';
      $scope.login.loading = false;
      $scope.login.errorData = data;
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