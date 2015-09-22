app.controller('ScoreCtrl', ['$scope', 'DefaultDataCtrlProperties', 'AccountService', '$location', 'ScoreDisplayHelper', '$routeParams', 'DataService', function ($scope, DefaultDataCtrlProperties, AccountService, $location, ScoreDisplayHelper, $routeParams, DataService) {
  $scope.score = angular.extend({service: ScoreDisplayHelper}, DefaultDataCtrlProperties);
  AccountService.promise.then(function () {
    DataService.get('/matchs/' + $routeParams.id + '/submitInfos').then(function (data) {
      $scope.score.data = data;
      ScoreDisplayHelper.init(data);
      $scope.score.loading = false;
    }, function (data) {
      $scope.score.errorData = data;
      $scope.score.loading = false;
    });
  });
}]);