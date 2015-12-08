app.directive('commentPanel', ['DataService', 'AccountService', function(DataService, AccountService) {
  return {
    templateUrl: 'components/commentpanel/commentpanel.html',
    scope: {
      title: '@',
      data: '=',
      urlPost: '=',
      urlLoading: '=',
      hidePost: '='
    },
    link: function (scope) {
      AccountService.promise.then(function () {
        scope.commentLabel = "Saisissez votre commentaire";
        scope.accountService = AccountService;
        if (!scope.accountService.logged())
          scope.commentLabel = "Vous devez être connecté pour saisir un commentaire";
      });
      scope.submitComment = function() {
        scope.loadingComments = true;
        DataService.post(scope.urlPost, {content: scope.currentComment}).then(function (data) {
          scope.currentComment = '';
          DataService.get(scope.urlLoading).then(function (data) {
            scope.data = data;
            scope.loadingComments = false;  
          }, function (data) {
            scope.loadingComments = false;
            scope.errorData = data;
          });
        }, function (data) {
          scope.loadingComments = false;
          scope.errorData = data;
        });
      }
    }
  };
}]);