app.controller('ChampionshipCtrl', ['$scope', 'DefaultDataCtrlProperties', 'DataService', 'MatchDataFormatter', function($scope, DefaultDataCtrlProperties, DataService, MatchDataFormatter) {
  $scope.championship = angular.extend({}, DefaultDataCtrlProperties, {
    changeCurrentCompetition: function(competition) {
      $scope.championship.currentCompetition = competition;
      if (competition.championships.length > 0) {
        if (competition.championships.length === 1) {
          this.changeCurrentChampionship(competition.championships[0]);
        }
      }
    },
    changeCurrentChampionship: function(championship) {
      var identifier = championship.identifier;
      $scope.championship.loadingChampionship = true;
      DataService.get('/championships/' + identifier + '/rankings').then(function (data) {
        $scope.championship.currentChampionship = data;
        $scope.championship.currentChampionship.matchs = _.sortByAll(data.matchs, ['date', 'firstTeam']);
        MatchDataFormatter.formatList($scope.championship.currentChampionship.matchs);
        $scope.championship.currentChampionship.matchsByDays = _.groupBy(data.matchs, function(m) {
          return m.step;
        });
        $scope.championship.loadingChampionship = false;
      });
    }
  });
  DataService.get('/competitions?season=current&fillChampionships=true').then(function (data) {
    $scope.championship.data = data;
    if ($scope.championship.dataIsNotEmpty()) {
      $scope.championship.changeCurrentCompetition($scope.championship.data[0]);
    }
    $scope.championship.loading = false;
  });
}]);

/*var ChampionshipController = function ($scope, $timeout) {
  $scope.championship = {
    dataLoading: true,
    teams: [
      {team: 'Fox', points: 0, play: 0, win: 0, loose: 0, loose3By2: 0, pointsFor: 0, pointsAgainst: 0},
      {team: 'Fox', points: 0, play: 0, win: 0, loose: 0, loose3By2: 0, pointsFor: 0, pointsAgainst: 0},
      {team: 'Fox', points: 0, play: 0, win: 0, loose: 0, loose3By2: 0, pointsFor: 0, pointsAgainst: 0},
      {team: 'Fox', points: 0, play: 0, win: 0, loose: 0, loose3By2: 0, pointsFor: 0, pointsAgainst: 0},
      {team: 'Fox', points: 0, play: 0, win: 0, loose: 0, loose3By2: 0, pointsFor: 0, pointsAgainst: 0},
      {team: 'Fox', points: 0, play: 0, win: 0, loose: 0, loose3By2: 0, pointsFor: 0, pointsAgainst: 0},
      {team: 'Fox', points: 0, play: 0, win: 0, loose: 0, loose3By2: 0, pointsFor: 0, pointsAgainst: 0}
    ],
    matchsByDays: [
      {
        day: 1, 
        matchs: [
          {
            date: 'Lun. 14/11/2015', firstTeam: 'Fox', secondTeam: 'Alouettes', 
            score: '3-2', scoreDetail: '25-13, 25-14, 15-25, 16-25, 15-13'
          },
          {
            date: 'Mar. 17/11/2015', firstTeam: 'Raptors', secondTeam: 'Alouettes', 
            score: '3-1', scoreDetail: '25-13, 25-14, 25-23'
          },
          {
            date: 'Lun. 14/11/2015', firstTeam: 'Fox', secondTeam: 'Alouettes', 
            score: '3-2', scoreDetail: '25-13, 25-14, 15-25, 16-25, 15-13'
          },
          {
            date: 'Mar. 17/11/2015', firstTeam: 'Raptors', secondTeam: 'Alouettes', 
            score: '3-1', scoreDetail: '25-13, 25-14, 25-23'
          }
        ]
      },
      {
        day: 2, 
        matchs: [
          {
            date: 'Lun. 14/11/2015', firstTeam: 'Fox', secondTeam: 'Alouettes', 
            score: '3-2', scoreDetail: '25-13, 25-14, 15-25, 16-25, 15-13'
          },
          {
            date: 'Mar. 17/11/2015', firstTeam: 'Raptors', secondTeam: 'Alouettes', 
            score: '3-1', scoreDetail: '25-13, 25-14, 25-23'
          },
          {
            date: 'Lun. 14/11/2015', firstTeam: 'Fox', secondTeam: 'Alouettes', 
            score: '3-2', scoreDetail: '25-13, 25-14, 15-25, 16-25, 15-13'
          },
          {
            date: 'Mar. 17/11/2015', firstTeam: 'Raptors', secondTeam: 'Alouettes', 
            score: '3-1', scoreDetail: '25-13, 25-14, 25-23'
          }
        ]
      },
      {
        day: 3, 
        matchs: [
          {
            date: 'Lun. 14/11/2015', firstTeam: 'Fox', secondTeam: 'Alouettes', 
            score: '3-2', scoreDetail: '25-13, 25-14, 15-25, 16-25, 15-13'
          },
          {
            date: 'Mar. 17/11/2015', firstTeam: 'Raptors', secondTeam: 'Alouettes', 
            score: '3-1', scoreDetail: '25-13, 25-14, 25-23'
          },
          {
            date: 'Lun. 14/11/2015', firstTeam: 'Fox', secondTeam: 'Alouettes', 
            score: '3-2', scoreDetail: '25-13, 25-14, 15-25, 16-25, 15-13'
          },
          {
            date: 'Mar. 17/11/2015', firstTeam: 'Raptors', secondTeam: 'Alouettes', 
            score: '3-1', scoreDetail: '25-13, 25-14, 25-23'
          }
        ]
      },
      {
        day: 4, 
        matchs: [
          {
            date: 'Lun. 14/11/2015', firstTeam: 'Fox', secondTeam: 'Alouettes', 
            score: '3-2', scoreDetail: '25-13, 25-14, 15-25, 16-25, 15-13'
          },
          {
            date: 'Mar. 17/11/2015', firstTeam: 'Raptors', secondTeam: 'Alouettes', 
            score: '3-1', scoreDetail: '25-13, 25-14, 25-23'
          },
          {
            date: 'Lun. 14/11/2015', firstTeam: 'Fox', secondTeam: 'Alouettes', 
            score: '3-2', scoreDetail: '25-13, 25-14, 15-25, 16-25, 15-13'
          },
          {
            date: 'Mar. 17/11/2015', firstTeam: 'Raptors', secondTeam: 'Alouettes', 
            score: '3-1', scoreDetail: '25-13, 25-14, 25-23'
          }
        ]
      },
      {
        day: 5, 
        matchs: [
          {
            date: 'Lun. 14/11/2015', firstTeam: 'Fox', secondTeam: 'Alouettes', 
            score: '3-2', scoreDetail: '25-13, 25-14, 15-25, 16-25, 15-13'
          },
          {
            date: 'Mar. 17/11/2015', firstTeam: 'Raptors', secondTeam: 'Alouettes', 
            score: '3-1', scoreDetail: '25-13, 25-14, 25-23'
          },
          {
            date: 'Lun. 14/11/2015', firstTeam: 'Fox', secondTeam: 'Alouettes', 
            score: '3-2', scoreDetail: '25-13, 25-14, 15-25, 16-25, 15-13'
          },
          {
            date: 'Mar. 17/11/2015', firstTeam: 'Raptors', secondTeam: 'Alouettes', 
            score: '3-1', scoreDetail: '25-13, 25-14, 25-23'
          }
        ]
      }
    ]
  };
  
  $timeout(function () {
    $scope.championship.dataLoading = false;
  }, 2000);
};

app.controller('ChampionshipController', ['$scope', '$timeout', ChampionshipController]);*/