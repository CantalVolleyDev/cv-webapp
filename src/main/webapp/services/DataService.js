app.factory('DataService', ['$http', 'dataServiceUrl', '$log', '$q', function ($http, dataServiceUrl, $log, $q) {
  return {
    get: function(route) {
      var defer = $q.defer();
      var url = dataServiceUrl + route;
      //$log.info('GET ' + url);
      var http = $http.get(url);
      http.then(function (data) {
        defer.resolve(data.data);
      }, function (data) {
        defer.reject(data);
      });
      return defer.promise;
    },
    post: function(route, parameters) {
      var defer = $q.defer();
      var url = dataServiceUrl + route;
      var params = angular.toJson(parameters);
      //$log.info('POST ' + url + ' | ' + params);
      var http = $http.post(url, params);
      http.then(function (data) {
        defer.resolve(data.data);
      }, function (data) {
        defer.reject(data);
      });
      return defer.promise;
    }
  }
}]);