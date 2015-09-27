var app = angular.module('cv-webapp', ['ngRoute', 'ngCookies']);

moment.locale('fr');

app.config(['$routeProvider', '$provide', function ($routeProvider, $provide) {
  $provide.decorator('$exceptionHandler', ['JSErrorService', '$delegate', function(JSErrorService, $delegate) {
    return function(exception, cause) {
      JSErrorService.init(exception, cause);
      $delegate(exception, cause);
    };
  }]);
  
  $routeProvider
  .when('/', {
    templateUrl: 'routes/home/home.html'
  })
  .when('/contacts', {
    templateUrl: 'routes/contacts/contacts.html'
  })
  .when('/login/:state/:matchId?/:teamId?', {
    templateUrl: 'routes/login/login.html',
    controller: 'LoginCtrl'
  })
  .when('/account', {
    templateUrl: 'routes/account/account.html',
    controller: 'AccountCtrl'
  })
  .when('/score/:id/:direct?', {
    templateUrl: 'routes/score/score.html',
    controller: 'ScoreCtrl'
  })
  .when('/help/:category', {
    templateUrl: 'routes/help/help.html',
    controller: 'HelpCtrl'
  })
  .when('/championship', {
    templateUrl: 'routes/championship/championship.html',
    controller: 'ChampionshipCtrl'
  })
  .when('/match/:id', {
    templateUrl: 'routes/match/match.html',
    controller: 'MatchCtrl'
  })
  .otherwise({
    redirectTo: '/'
  });
}]);
  
app.controller('GlobalCtrl', ['$scope', 'JSErrorService', function($scope, JSErrorService) {
  $scope.global = {
    errorService: JSErrorService
  };
}])
