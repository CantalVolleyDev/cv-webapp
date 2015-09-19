app.directive('header', ['AccountService', function(AccountService) {
  return {
    templateUrl: 'components/header/header.html',
    link: function(scope) {
      scope.accountService = AccountService;
    }
  };
}]);