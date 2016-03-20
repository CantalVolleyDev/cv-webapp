var app = angular.module('cv-webapp', ['ngRoute', /*'nemLogging', 'uiGmapgoogle-maps'*/]);

moment.locale('fr');
Dropzone.autoDiscover = false;

app.config(['$routeProvider', '$provide', function ($routeProvider, $provide) {
  $provide.decorator('$exceptionHandler', ['JSErrorService', '$delegate', function(JSErrorService, $delegate) {
    return function(exception, cause) {
      JSErrorService.init(exception, cause);
      $delegate(exception, cause);
    };
  }]);
  
  $routeProvider
  .when('/', {
    templateUrl: 'src/routes/home/home.html'
  })
  .when('/contacts', {
    templateUrl: 'src/routes/contacts/contacts.html'
  })
  .when('/login/:state/:matchId?/:teamId?', {
    templateUrl: 'src/routes/login/login.html',
    controller: 'LoginCtrl'
  })
  .when('/account', {
    templateUrl: 'src/routes/account/account.html',
    controller: 'AccountCtrl'
  })
  .when('/calendar', {
    templateUrl: 'src/routes/matchCalendar/matchCalendar.html',
    controller: 'MatchCalendarCtrl'
  })
  .when('/score/:id/:direct?', {
    templateUrl: 'src/routes/score/score.html',
    controller: 'ScoreCtrl'
  })
  .when('/help/:category', {
    templateUrl: 'src/routes/help/help.html',
    controller: 'HelpCtrl'
  })
  .when('/championship', {
    templateUrl: 'src/routes/championship/championship.html',
    controller: 'ChampionshipCtrl'
  })
  .when('/match/:id', {
    templateUrl: 'src/routes/match/match.html',
    controller: 'MatchCtrl'
  })
  .when('/team/:id', {
    templateUrl: 'src/routes/team/team.html',
    controller: 'TeamCtrl'
  })
  .when('/teamInfos/:id', {
    templateUrl: 'src/routes/teamInfos/teamInfos.html',
    controller: 'TeamInfosCtrl'
  })
  .when('/upload/:id', {
    templateUrl: 'src/routes/upload/upload.html',
    controller: 'UploadCtrl'
  })
  .when('/matchDelay/:id', {
    templateUrl: 'src/routes/matchDelay/matchDelay.html',
    controller: 'MatchDelayCtrl'
  })
  /*.when('/activity', {
    templateUrl: 'src/routes/activity/activity.html'
  })*/
  .otherwise({
    redirectTo: '/'
  });
}]);
  
/*app.config(['uiGmapGoogleMapApiProvider', function(uiGmapGoogleMapApiProvider) {
  uiGmapGoogleMapApiProvider.configure({
    //    key: 'your api key',
    v: '3.17',
    libraries: 'weather,geometry,visualization'
  });
}]);*/

app.controller('GlobalCtrl', ['$scope', 'JSErrorService', function($scope, JSErrorService) {
  $scope.global = {
    errorService: JSErrorService
  };
}]);