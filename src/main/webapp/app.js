var app = angular.module('cv-webapp', ['ngRoute', 'ngCookies']);

moment.locale('fr');

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'routes/home/home.html'
  })
  .when('/contacts', {
    templateUrl: 'routes/contacts/contacts.html'
  })
  .when('/login', {
    templateUrl: 'routes/login/login.html',
    controller: 'LoginCtrl'
  })
  .when('/account', {
    templateUrl: 'routes/account/account.html'
  })
  /*.when('/championship', {
    templateUrl: 'routes/championship/championship.html',
    controller: 'ChampionshipController'
  })*/
  .otherwise({
    redirectTo: '/'
  });
}]);