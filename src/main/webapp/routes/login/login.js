app.controller('LoginCtrl', ['$scope', 'AccountService', '$location', '$routeParams', 'DefaultDataCtrlProperties', function ($scope, AccountService, $location, $routeParams, DefaultDataCtrlProperties) {
  $scope.login = angular.extend({}, DefaultDataCtrlProperties, {
    fields: {mail: '', password: ''},
    state: $routeParams.state,
    isStateUserLogin: function () {
      return this.state === 'user';
    },
    isStateLoginMatch: function () {
      return this.state === 'match';
    },
    getPageTitle: function() {
      if (this.isStateLoginMatch())
        return "Connexion d'un joueur de l'équipe adverse";
      else if (this.isStateUserLogin())
        return "Connexion à votre compte";
      return "";
    }
  });
  $scope.log = function () {
    $scope.login.loading = true;
    if ($scope.login.isStateUserLogin()) {
      AccountService.login($scope.login.fields.mail, $scope.login.fields.password).then(function () {
        $location.path('/account');
      }, function (data) {
        $scope.login.fields.password = '';
        $scope.login.loading = false;
        $scope.login.errorData = data;
      });  
    } else if ($scope.login.isStateLoginMatch()) {
      AccountService.loginForValidation($scope.login.fields.mail, $scope.login.fields.password, 
                                        $routeParams.matchId, $routeParams.teamId).then(function () {
        $location.path('/score/' + $routeParams.matchId + '/direct');
      }, function (data) {
        $scope.login.fields.password = '';
        $scope.login.loading = false;
        $scope.login.errorData = data;
      })
    }
  };
  AccountService.promise.then(function () {
    if (AccountService.logged() && $scope.login.isStateUserLogin()) {
      $location.path('/account');
      return;
    }
    $scope.login.loading = false;
  });
}]);