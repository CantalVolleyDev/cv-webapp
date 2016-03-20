app.controller('TeamCtrl', ['$scope', 'AccountService', 'DataService', '$routeParams', 'DefaultDataCtrlProperties', 'MatchDataFormatter', /*'uiGmapGoogleMapApi',*/
function ($scope, AccountService, DataService, $routeParams, DefaultDataCtrlProperties, MatchDataFormatter/*, uiGmapGoogleMapApi*/) {
  $scope.team = angular.extend({}, DefaultDataCtrlProperties, {
    isImageDefault: function() {
      return this.data && this.data.seasonTeam && this.data.seasonTeam.imagePath.indexOf('default') !== -1;
    },
    isImagePlayersDefault: function() {
      return this.data && this.data.seasonTeam && this.data.seasonTeam.imagePlayersPath.length === 0;
    },
    urlPostComment: '/teams/' + $routeParams.id + '/comment',
    urlLoadingComments: '/teams/' + $routeParams.id + '/comments'
  });
  
  AccountService.promise.then(function () {  
    DataService.get('/teams/' + $routeParams.id + '/details').then(function (data) {
      $scope.team.data = data;
      var manager = _.find(data.players, function(player) {
        return player.manager;
      }); 
      manager.player.mail = (manager.player.mail || 'Non renseigné');
      manager.player.phone = (manager.player.phone || 'Non renseigné');
      $scope.team.data.display = {
        managers: [manager],
        manager: manager,
        date: moment(data.seasonTeam.date).format("[Le] dddd [à] HH[h]mm")
      };
      _.each($scope.team.data.lastMatchs, function(match) {
        MatchDataFormatter.format(match);
      });
      
      /*uiGmapGoogleMapApi.then(function (maps) {
        var coords = { latitude: 44.913238, longitude: 2.437945 };
        $scope.team.map = {
          center: coords, 
          zoom: 17,
          options: {
            mapTypeControl: false,
            overviewMapControl: false,
            panControl: false,
            scaleControl: false,
            scrollwheel: false,
            rotateControl: false
          },
          marker: {
            coords: coords,
            id: $scope.team.data.seasonTeam.gym.identifier
          }
        };
      });*/
      
      $scope.team.loading = false;
    }, function (data) {
      $scope.team.errorData = data;
      $scope.team.loading = false;
    });
  }, function (data) {
    $scope.team.errorData = data;
    $scope.team.loading = false;
  });
}]);