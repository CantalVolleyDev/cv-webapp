app.directive('matchPanel', [function() {
  return {
    templateUrl: 'components/matchpanel/matchpanel.html',
    scope: {
      title: '@',
      data: '='
    }
  };
}]);