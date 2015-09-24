app.directive('confirm', function() {
  return {
    templateUrl: 'components/confirm/confirm.html',
    scope: {
      message: '='
    }
  };
});