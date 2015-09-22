app.value('DefaultDataCtrlProperties', {
  loading: true,
  data: [],
  fields: {},
  dataIsNotEmpty: function() {
    return angular.isArray(this.data) && this.data.length !== 0;
  },
  displayError: function() {
    return !angular.isUndefined(this.errorData);
  },
  displayData: function(strict) {
    return !this.loading && (!strict || (strict && !this.displayError()));
  }
})