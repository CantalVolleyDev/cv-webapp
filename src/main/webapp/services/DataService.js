app.factory('DataService', ['$http', 'dataServiceUrl', function ($http, dataServiceUrl) {
  return {
    get: function(route) {
      return $http.get(dataServiceUrl + route);
    }
  }
}]);