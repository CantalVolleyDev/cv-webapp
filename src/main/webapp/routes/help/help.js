app.controller('HelpCtrl', ['$scope', '$routeParams', '$location', function($scope, $routeParams, $location) {
  $scope.help = {
    category: undefined,
    categories: [
      {id: 'connect', title: 'Connexion à votre compte'},
      {id: 'score', title: 'Saisie d\'un score'}
    ],
    isCurrent: function(category) {
      if (angular.isUndefined(this.category))
        return false;
      if (angular.isString(category)) {
        return category === this.category.id;
      } else {
        return category.id === this.category.id;
      }
    },
    changeCurrent: function(category) {
      $location.path('/help/' + category.id);
    }
  };
  $scope.help.category = _.find($scope.help.categories, function(category) {
    return category.id === $routeParams.category; 
  });
}]);