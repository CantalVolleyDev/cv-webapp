app.controller('ChampionshipCtrl', ['$scope', 'DefaultDataCtrlProperties', 'DataService', 'MatchDataFormatter', function($scope, DefaultDataCtrlProperties, DataService, MatchDataFormatter) {
  $scope.championship = angular.extend({}, DefaultDataCtrlProperties, {
    changeCurrentCompetition: function(competition) {
      $scope.championship.currentCompetition = competition;
      localStorage.setItem("X-Cv-CurrentCompetition", competition.identifier);
      if (competition.championships.length > 0) {
        this.changeCurrentChampionship(competition.championships[0]);
      }
    },
    changeCurrentChampionship: function(championship) {
      var identifier = championship.identifier;
      $scope.championship.loadingChampionship = true;
      DataService.get('/championships/' + identifier + '/rankings').then(function (data) {
        $scope.championship.currentChampionship = data;
        //$scope.championship.currentChampionship.matchs = _.sortByAll(data.matchs, ['order', 'date', 'firstTeam']);
        MatchDataFormatter.formatList($scope.championship.currentChampionship.matchs);
        $scope.championship.currentChampionship.matchsByDays = _.groupBy(data.matchs, function(m) {
          return m.step;
        });
        localStorage.setItem("X-Cv-CurrentChampionship", identifier);
        $scope.championship.loadingChampionship = false;
      });
    }
  });
  DataService.get('/competitions?season=current&fillChampionships=true').then(function (data) {
    $scope.championship.data = data;
    if ($scope.championship.dataIsNotEmpty()) {
      var currentCompetition = parseInt(localStorage.getItem("X-Cv-CurrentChampionship"), 10);
      if (!angular.isUndefined(currentCompetition)) {
        currentCompetition = _.find($scope.championship.data, {identifier: currentCompetition});
      }
      if (angular.isUndefined(currentCompetition)) {
        currentCompetition = $scope.championship.data[0];
      }
      $scope.championship.changeCurrentCompetition(currentCompetition);
    }
    $scope.championship.loading = false;
  });
}]);