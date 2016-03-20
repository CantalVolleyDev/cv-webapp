app.directive('playerPanel', [function() {
  return {
    templateUrl: 'src/components/playerpanel/playerpanel.html',
    scope: {
      title: '@',
      data: '='
    }
  };
}]);