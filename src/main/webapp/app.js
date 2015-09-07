var app = angular.module('cv-webapp', ['ngRoute']);

moment.locale('fr');

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'routes/home/home.html'
  })
  .when('/contacts', {
    templateUrl: 'routes/contacts/contacts.html'
  })
  /*.when('/championship', {
    templateUrl: 'routes/championship/championship.html',
    controller: 'ChampionshipController'
  })*/
  .otherwise({
    redirectTo: '/'
  });
}]);