app.factory('DataService', ['$http', 'dataServiceUrl', '$log', function ($http, dataServiceUrl, $log) {
  return {
    get: function(route) {
      $log.info('GET ' + dataServiceUrl + route);
      return $http.get(dataServiceUrl + route);
    },
    post: function(route, parameters) {
      $log.info('POST ' + dataServiceUrl + route);
      $log.info(parameters);
      return $http.post(dataServiceUrl + route, angular.toJson(parameters));
    }
  }
}]);