app.controller('MatchDelayCtrl', ['$scope', '$location', 'AccountService', 'DataService', '$routeParams', 'DefaultDataCtrlProperties', 
function ($scope, $location, AccountService, DataService, $routeParams, DefaultDataCtrlProperties) {
  $scope.matchDelay = angular.extend({}, DefaultDataCtrlProperties, {
    commitChange: function() {
      $scope.matchDelay.loading = true;
      var updated = $scope.matchDelay.data;
      updated.date.hour($scope.matchDelay.display.datePickerData.hours);
      updated.date.minutes($scope.matchDelay.display.datePickerData.minutes);
      updated.date = updated.date.format("YYYY-MM-DD[T]HH:mm");
      DataService.put('/matchs/' + $routeParams.id + '/updateInfos', updated).then(function (data) {
        $location.path('/account');
        $scope.matchDelay.loading = false;
      }, function (data) {
        $scope.matchDelay.errorData = data;
        $scope.matchDelay.loading = false;
      });
    }
  });
  AccountService.promise.then(function () {  
    DataService.get('/matchs/' + $routeParams.id + '/updateInfos').then(function (data) {
      $scope.matchDelay.data = data;
      var date = moment($scope.matchDelay.data.date);
      $scope.matchDelay.display = {
        datePickerData: {
          hours: date.format("HH"),
          minutes: date.format("mm")
        }
      };
      $scope.matchDelay.loading = false;
    }, function (data) {
      $scope.matchDelay.errorData = data;
      $scope.matchDelay.loading = false;
    });
  }, function (data) {
    $scope.matchDelay.errorData = data;
    $scope.matchDelay.loading = false;
  });
}]);