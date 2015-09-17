app.factory('AccountService', ['DataService', '$q', '$cookies', function (DataService, $q, $cookies) {
  var promise = $q.defer();
  var promiseResolved = false;
  var client;
  return {
    promise: promise,
    promiseResolved: function() {
      return promiseResolved;
    },
    logged: function() {
      return !angular.isUndefined(client);
    },
    login: function(mail, password) {
      
    },
    load: function() {
      if (promiseResolved) {
        return promise.promise;
      }
      var tokenCookie = $cookies.get('CvAPIToken');
      if (tokenCookie != null) {
        DataService.post('/retrieve').then(function (data) {
          promiseResolved = true;
          promise.resolve(data);
        }, function (data) {
          promiseResolved = true;
          promise.reject(data);
        });  
      } else {
        promiseResolved = true;
        promise.resolve();
      }
      return promise.promise;
    }
  }
}]);