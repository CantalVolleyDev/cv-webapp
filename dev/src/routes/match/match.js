app.controller('MatchCtrl', ['$scope', 'DefaultDataCtrlProperties', 'DataService', '$routeParams', 'AccountService', function($scope, DefaultDataCtrlProperties, DataService, $routeParams, AccountService) {
  $scope.match = angular.extend({}, DefaultDataCtrlProperties, {
    urlPostComment: '/matchs/' + $routeParams.id + '/comment',
    urlLoadingComments: '/matchs/' + $routeParams.id + '/comments'
  });
  AccountService.promise.then(function () {
    DataService.get('/matchs/' + $routeParams.id + '/details').then(function (data) {
      $scope.match.data = data;
      var sets = [];
      var display = {
        date: _.capitalize(moment(data.match.date).format('dddd DD MMMM YYYY')),
        dateSmall: moment(data.match.date).format('DD/MM/YYYY')
      };
      var totalGeneral = data.match.firstScore + data.match.secondScore;
      for (var i=0; i<totalGeneral; i++) {
        sets.push({
          firstTeam: data.match['s' + String(i+1) + '1'],
          secondTeam: data.match['s' + String(i+1) + '2']
        });
      }
      display.sets = sets;
      switch ($scope.match.data.match.state) {
        case 'V': 
          if ($scope.match.data.match.forfeit)
            display.stateLabel = 'Forfait';
          else
            display.stateLabel = 'Terminé'; 
          break;
        case 'C': display.stateLabel = 'A venir'; break;
        case 'S': case 'R': display.stateLabel = 'En attente de validation'; break;
        case 'F': display.stateLabel = 'Forfait des deux équipes'; break;
      }
      $scope.match.data.match.display = display;
      $scope.match.loading = false;
    }, function (data) {
      $scope.match.errorData = data;
      $scope.match.loading = false;
    });
  });
}]);