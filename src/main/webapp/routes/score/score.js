app.controller('ScoreCtrl', ['$scope', 'AccountService', '$location', function ($scope, AccountService, $location) {
  $scope.score = {
    loading: true,
    fields: {sc1: 0, sc2: 0}
  };
  
  $scope.display4thSet = function() {
    return $scope.score.fields.sc1 + $scope.score.fields.sc2 > 3;
  };
  $scope.display5thSet = function() {
    return $scope.score.fields.sc1 + $scope.score.fields.sc2 > 4;
  };
  
  AccountService.promise.then(function () {
    if (!AccountService.logged()) {
      $location.path('/login');
      return;
    }
    $scope.score.loading = false;
  });
}]);