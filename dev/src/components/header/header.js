app.directive('header', ['AccountService', function(AccountService) {
  return {
    templateUrl: 'src/components/header/header.html',
    link: function(scope) {
      scope.accountService = AccountService;
      var navMain = $(".navbar-collapse");
      navMain.on("click", "a", null, function () {
        navMain.collapse('hide');
      });
    }
  };
}]);