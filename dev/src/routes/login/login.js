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
    isStatePasswordChange: function() {
      return this.state === 'password';
    },
    getPageTitle: function() {
      if (this.isStateLoginMatch())
        return "Connexion d'un joueur de l'équipe adverse";
      else if (this.isStateUserLogin())
        return "Connexion à votre compte";
      else if (this.isStatePasswordChange())
        return "Changement du mot de passe";
      return "";
    },
    getActionLabel: function() {
      if (this.isStateLoginMatch() || this.isStateUserLogin())
        return "Connexion";
      else
        return "Valider";
    },
    getPasswordLabel: function() {
      if (this.isStatePasswordChange())
        return "Mot de passe actuel";
      return "Mot de passe";
    },
    isCookiesEnabled: function() {
      var cookieEnabled = (navigator.cookieEnabled) ? true : false;
      if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled) { 
        document.cookie = "cookieChecking";
        cookieEnabled = (document.cookie.indexOf("cookieChecking") != -1) ? true : false;
      }
      return (cookieEnabled);
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
    } else if ($scope.login.isStatePasswordChange()) {
      AccountService.changePassword($scope.login.fields.mail, $scope.login.fields.password, 
                                    $scope.login.fields.newPassword, $scope.login.fields.newPasswordConfirm).then(function () {
        $location.path('/account');
      }, function (data) {
        $scope.login.loading = false;
        $scope.login.errorData = data;
      });
    }
  };
  AccountService.promise.then(function () {
    if (AccountService.logged() && $scope.login.isStateUserLogin()) {
      $location.path('/account');
      return;
    }
    if (!AccountService.logged() && ($scope.login.isStatePasswordChange() || $scope.login.isStateLoginMatch())) {
      $location.path('/login');
      return;
    }
    if ($scope.login.isStatePasswordChange()) {
      $scope.login.fields.mail = AccountService.client().mail;
    }
    if (!$scope.login.isCookiesEnabled()) {
      $scope.login.errorData = {
        data: {
          message: 'Les cookies de votre navigateur doivent être activés!'
        }
      };
    }
    $scope.login.loading = false;
  });
}]);