app.directive('confirm', function() {
  return {
    templateUrl: 'src/components/confirm/confirm.html',
    scope: {
      message: '='
    }
  };
});