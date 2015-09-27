app.factory('AccountService', ['DataService', '$q', '$cookies', function (DataService, $q, $cookies) {
  var promise = $q.defer();
  var promiseResolved = false;
  var client;
  
  var userLogin = function (url, object, currentClient) {
    var defer = $q.defer();
    DataService.post(url, object).then(function (data) {
      if (currentClient) {
        client = data;
      }
      defer.resolve(data);
    }, function (data) {
      defer.reject(data);
    });
    return defer.promise;
  };
  
  return {
    promise: promise.promise,
    client: function() {
      return client;
    },
    promiseResolved: function() {
      return promiseResolved;
    },
    logged: function() {
      return !angular.isUndefined(client);
    },
    login: function(mail, password) {
      return userLogin('/user/login', {mail: mail, password: password}, true);
    },
    loginForValidation: function(mail, password, matchId, teamId) {
      return userLogin('/user/loginForValidation', {
        mail: mail,
        password: password,
        matchId: matchId,
        teamId: teamId
      }, false);
    },
    logout: function() {
      var defer = $q.defer();
      DataService.post('/user/logout').then(function (data) {
        client = undefined;
        defer.resolve(data);
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
        if (data === "") {
          client = undefined;
        } else {
          client = data;  
        }
        promise.resolve(data);
      }, function (data) {
        promiseResolved = true;
        promise.reject(data);
      });  
      return promise.promise;
    }
  }
}]);