app.factory('JSErrorService', [function() {
  var errorTransform =  function(exception) {
    return {
      status: 'JavaScript',
      data: {
        message: exception.message,
        cause: exception
      }
    }
  };
  return {
    error: false,
    init: function(exception, cause) {
      this.exception = exception;
      this.cause = cause;
      this.error = true;
      this.transformedError = errorTransform(exception);
    }
  }
}]);