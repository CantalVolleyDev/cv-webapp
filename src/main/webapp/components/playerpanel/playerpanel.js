app.directive('playerPanel', [function() {
  return {
    templateUrl: 'components/playerpanel/playerpanel.html',
    scope: {
      title: '@',
      data: '='
    }
  };
}]);