app.directive('news', function() {
  return {
    templateUrl: 'src/components/news/news.html',
    scope: {
      newsData: '='
    },
    link: function(scope) {
      scope.newsData.readablePublishDate = moment(scope.newsData.publishDate).format('DD MMMM YYYY, [à] HH:mm');
    }
  };
});