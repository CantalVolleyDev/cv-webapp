app.controller('MatchCalendarCtrl', ['$scope', 'DataService', 'MatchDataFormatter', 'DefaultDataCtrlProperties', 
function ($scope, DataService, MatchDataFormatter, DefaultDataCtrlProperties) {
  $scope.matchCalendar = angular.extend({}, DefaultDataCtrlProperties, {
    currentDate: moment(),
    displayableDate: moment().format('DD/MM/YYYY'),
    matchList: [],
    matchLoading: true
  });
  $scope.$watch('matchCalendar.currentDate', function (date) {
    $scope.matchCalendar.matchLoading = true;
    $scope.matchCalendar.displayableDate = date.format('DD/MM/YYYY');
    DataService.get('/matchs/byDate?date=' + date.format('YYYY-MM-DD')).then(function (data) {
      MatchDataFormatter.formatList(data);
      $scope.matchCalendar.matchList = data;
      $scope.matchCalendar.matchLoading = false;
    }, function (data) {
      $scope.matchCalendar.errorData = data;
      $scope.matchCalendar.matchLoading = false;
    });  
  });
}]);