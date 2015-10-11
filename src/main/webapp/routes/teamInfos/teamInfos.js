app.controller('TeamInfosCtrl', ['$scope', '$location', 'AccountService', 'DataService', '$routeParams', 'DefaultDataCtrlProperties', 
function ($scope, $location, AccountService, DataService, $routeParams, DefaultDataCtrlProperties) {
  $scope.teamInfos = angular.extend({}, DefaultDataCtrlProperties, {
    days: [
      {id: 0, label: 'Lundi', current:false},
      {id: 1, label: 'Mardi', current:false},
      {id: 2, label: 'Mercredi', current:false},
      {id: 3, label: 'Jeudi', current:false},
      {id: 4, label: 'Vendredi', current:false}
    ],
    changeCurrent: function(day) {
      _.each(this.days, function(aDay) { aDay.current=false; });
      day.current=true;
    },
    commitChange: function() {
      $scope.teamInfos.loading = true;
      var newDate = moment("2015-10-12");
      newDate.add($scope.teamInfos.days.indexOf(_.find($scope.teamInfos.days, 'current')), 'days');
      newDate.hour($scope.teamInfos.datePickerData.hours);
      newDate.minutes($scope.teamInfos.datePickerData.minutes);
      var updated = $scope.teamInfos.data.seasonTeam;
      updated.date = newDate.format("YYYY-MM-DD[T]HH:mm");
      DataService.put('/teams/' + $routeParams.id, updated).then(function (data) {
        $location.path('/account');
        $scope.teamInfos.loading = false;
      }, function (data) {
        $scope.teamInfos.errorData = data;
        $scope.teamInfos.loading = false;
      });
    }
  });
  
  AccountService.promise.then(function () {  
    DataService.get('/teams/' + $routeParams.id + '/updateInfos').then(function (data) {
      $scope.teamInfos.data = data;
      var date = moment(data.seasonTeam.date);
      var dayIndex = date.weekday();
      $scope.teamInfos.changeCurrent($scope.teamInfos.days[dayIndex]);
      $scope.teamInfos.datePickerData = {
        hours: date.format("HH"),
        minutes: date.format("mm")
      };
      $scope.teamInfos.loading = false;
    }, function (data) {
      $scope.teamInfos.errorData = data;
      $scope.teamInfos.loading = false;
    });
  }, function (data) {
    $scope.teamInfos.errorData = data;
    $scope.teamInfos.loading = false;
  });
}]);