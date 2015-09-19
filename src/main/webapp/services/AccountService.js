app.factory('AccountService', ['DataService', '$q', '$cookies', function (DataService, $q, $cookies) {
  var promise = $q.defer();
  var promiseResolved = false;
  var client;
  return {
    promise: promise.promise,
    promiseResolved: function() {
      return promiseResolved;
    },
    logged: function() {
      return !angular.isUndefined(client);
    },
    login: function(mail, password) {
      var defer = $q.defer();
      DataService.post('/user/login', {mail: mail, password: password}).then(function (data) {
        client = data.data;
        defer.resolve(data.data);
      }, function (data) {
        defer.reject(data);
      });
      return defer.promise;
    },
    logout: function() {
      var defer = $q.defer();
      DataService.post('/user/logout').then(function (data) {
        client = undefined;
        defer.resolve(data.data);
      }, function (data) {
        defer.reject(data);
      });
      return defer.promise;
    },
    load: function() {
      if (promiseResolved) {
        return promise.promise;
      }
      DataService.post('/user/retrieve').then(function (data) {
        promiseResolved = true;
        client = data.data;
        promise.resolve(data.data);
      }, function (data) {
        promiseResolved = true;
        promise.reject(data);
      });  
      return promise.promise;
    }
  }
}]);