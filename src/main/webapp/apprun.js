app.run(['$http', 'AccountService', function($http, AccountService) {
  $http.defaults.headers.common['Content-Type'] = 'application/json';
  $http.defaults.withCredentials = true;
  AccountService.load();
}]);