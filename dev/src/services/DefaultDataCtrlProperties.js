app.value('DefaultDataCtrlProperties', {
  loading: true,
  data: [],
  fields: {},
  errorData: undefined, 
  submitSuccessMessage: undefined,
  dataIsNotEmpty: function() {
    return angular.isArray(this.data) && this.data.length !== 0;
  },
  displayError: function() {
    return !this.loading && !angular.isUndefined(this.errorData);
  },
  displayData: function(strict) {
    return !this.loading && (!strict || (strict && !this.displayError()));
  }
})