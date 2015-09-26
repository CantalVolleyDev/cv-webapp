app.factory('MatchDataFormatter', [function() {
  return {
    format: function(match) {
      var momentDate = moment(match.date);
      var played = (match.state !== 'C');
      match.display = {
        momentDate: momentDate,
        shortDate: momentDate.format("DD/MM"),
        generalScore: this.writeScore(match),
        firstWinner: (played && match.state !== 'F' && match.sc1 > match.sc2),
        secondWinner: (played && match.state !== 'F' && match.sc2 > match.sc1),
        waitingValidation: (played && (match.state === 'S' || match.state === 'R'))
      };
    },
    formatList: function(matchList) {
      _.each(matchList, function(match) {
        this.format(match);
      }, this);
    },
    writeScore: function(match) {
      if (match.state === 'F') {
        return 'Forfait';
      } else if (match.state == 'V' || match.state == 'S' || match.state == 'R') {
        if (match.forfeit)
          return 'Forfait';
        return match.sc1 + '/' + match.sc2;
      } else {
        return '-';
      }
    }
  }
}]);