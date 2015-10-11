app.directive('datepicker', [function() {
  return {
    templateUrl: 'components/datepicker/datepicker.html',
    scope: {
      contentData: '='
    },
    link: function(scope, element, attrs, ctrl) {
      scope.datepicker = {
        hours: 0,
        minutes: 0,
      };
      scope.datepickerFunctions = {
        increaseHours: function() { 
          var nextValue = parseInt(scope.datepicker.hours) + 1;
          if (nextValue > 23)
            scope.datepicker.hours = "00";
          else {
            var value = "";
            if (nextValue < 10)
              value += "0";
            scope.datepicker.hours = (value + String(nextValue)); 
          }
        },
        increaseMinutes: function() { 
          var nextValue = parseInt(scope.datepicker.minutes) + 5;
          if (nextValue > 59)
            scope.datepicker.minutes = "00";
          else {
            var value = "";
            if (nextValue < 10)
              value += "0";
            scope.datepicker.minutes = (value + String(nextValue));
          }
        },
        decreaseHours: function() { 
          var nextValue = parseInt(scope.datepicker.hours) - 1;
          if (nextValue < 0)
            scope.datepicker.hours = "23";
          else {
            var value = "";
            if (nextValue < 10)
              value += "0";
            scope.datepicker.hours = (value + String(nextValue));
          }
        },
        decreaseMinutes: function() { 
          var nextValue = parseInt(scope.datepicker.minutes) - 5;
          if (nextValue < 0)
            scope.datepicker.minutes = "55";
          else {
            var value = "";
            if (nextValue < 10)
              value += "0";
            scope.datepicker.minutes = (value + String(nextValue));
          }
        }
      };
      scope.$watch('contentData', function(value) {
        if (angular.isUndefined(value))
          return;
        scope.datepicker = value;
      });
    }
  };
}]);