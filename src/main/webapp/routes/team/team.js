app.controller('TeamCtrl', ['$scope', 'AccountService', 'DataService', '$routeParams', 'DefaultDataCtrlProperties', 
function ($scope, AccountService, DataService, $routeParams, DefaultDataCtrlProperties) {
  $scope.team = angular.extend({}, DefaultDataCtrlProperties, {
    isImageDefault: function() {
      return this.data && this.data.seasonTeam && this.data.seasonTeam.imagePath.indexOf('default') !== -1;
    },
    isImagePlayersDefault: function() {
      return this.data && this.data.seasonTeam && this.data.seasonTeam.imagePlayersPath.indexOf('default') !== -1;
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