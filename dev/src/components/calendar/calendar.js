app.directive('calendar', [function() {
  return {
    templateUrl: 'src/components/calendar/calendar.html',
    scope: {
      data: '='
      /*urlPost: '=',
      urlLoading: '='*/
    },
    link: function (scope) {
      function _changeCurrent() {
        var day = moment(scope.calendar.year + "-" + scope.calendar.month + "-01", "YYYY-MM-DD");
        scope.calendar.label = _.capitalize(day.format("MMMM YYYY"));
        scope.calendar.firstDay = day.clone();
        day.day(1);
        scope.calendar.weeks = [];
        
        var currentWeek = {id: NaN};
        while (true) {
          if ((day.month()+1) != scope.calendar.month && day.isAfter(scope.calendar.firstDay) && day.day() === 1) {
            break;
          }
          if (currentWeek.id != day.week()) {
            currentWeek = {id: day.week(), days: []};
            scope.calendar.weeks.push(currentWeek);
          }
          currentWeek.days.push({
            id: day.date(), 
            selected: day.isSame(scope.data, 'day'),
            date: day.clone()
          });
          day.add(1, 'days');
        }
      }
      scope.calendar = {
        days: moment.weekdaysShort().slice(1,7).concat(moment.weekdaysShort().slice(0,1)),
        month: 10,
        year: 2015,
        label: '',
        weeks: [],
        firstDay: moment("2015-10-01", "YYYY-MM-DD"),
        nextMonth: function() {
          scope.calendar.firstDay.add(1, 'M');
          scope.calendar.month = scope.calendar.firstDay.month()+1;
          scope.calendar.year = scope.calendar.firstDay.year();
          _changeCurrent();
        },
        previousMonth: function() {
          scope.calendar.firstDay.subtract(1, 'M');
          scope.calendar.month = scope.calendar.firstDay.month()+1;
          scope.calendar.year = scope.calendar.firstDay.year();
          _changeCurrent();
        }
      };
      scope.changeCurrentValue = function(weekDay) {
        scope.calendar.month = weekDay.date.month()+1;
        scope.calendar.year = weekDay.date.year();
        scope.data = weekDay.date;
        _.each(scope.calendar.weeks, function(week) {
          _.each(week.days, function(days) {
            days.selected = false;
          });
        });
        weekDay.selected = true;
      };
      scope.$watch('data', function(newValue) {
        if (!angular.isUndefined(newValue)) {
          if (!moment.isMoment(newValue))
            newValue = moment(newValue);
          scope.calendar.month = newValue.month()+1;
          scope.calendar.year = newValue.year();
          _changeCurrent();
        }
      });
    }
  };
}]);