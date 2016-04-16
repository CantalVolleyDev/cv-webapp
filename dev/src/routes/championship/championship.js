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
      var self = this;
      var identifier = championship.identifier;
      $scope.championship.loadingChampionship = true;
      DataService.get('/championships/' + identifier + '/rankings').then(function (data) {
        $scope.championship.currentChampionship = data;
        //$scope.championship.currentChampionship.matchs = _.sortByAll(data.matchs, ['order', 'date', 'firstTeam']);
        MatchDataFormatter.formatList($scope.championship.currentChampionship.matchs);
        $scope.championship.currentChampionship.matchsByDays = _.groupBy(data.matchs, function(m) {
          return m.step;
        });
        if ($scope.championship.currentChampionship.type === 'CUP') {
          var size = parseInt(_.max(_.keys($scope.championship.currentChampionship.matchsByDays)), 10);
          var steps = [];
          var getLabel = function(level) {
            switch (level) {
              case 1: return "Finale";
              case 2: return "Demi finales";
              case 3: return "Quart de finales";
              case 4: return "Huitièmes de finales";
              default: break;
            }
          };
          var step, displayStep;
          for (var i = size; i != 0; i --) {
            step = {
              label: getLabel(i),
              id: i
            };
            if (steps.length == 0) {
              step.current = true;
              displayStep = step;
            }
            steps.push(step);
          }    
          $scope.championship.currentChampionship.steps = steps;
          self.changeCurrentCupStep(displayStep);
        }
        localStorage.setItem("X-Cv-CurrentChampionship", identifier);
        $scope.championship.loadingChampionship = false;
      });
    },
    changeCurrentCupStep: function(step) {
      var matchs = $scope.championship.currentChampionship.matchsByDays[step.id];
      if (angular.isUndefined(matchs))
        matchs = [];
      $scope.championship.currentChampionship.displayMatchs = matchs;
      _.each($scope.championship.currentChampionship.steps, function (aStep) {
        aStep.current = false;
      });
      step.current = true;
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