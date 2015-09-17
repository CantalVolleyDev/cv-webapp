app.factory('DataService', ['$http', 'dataServiceUrl', function ($http, dataServiceUrl) {
  return {
    get: function(route) {
      return $http.get(dataServiceUrl + route);
    },
    post: function(route) {
      return $http.post(dataServiceUrl + route);
    }
  }
}]);