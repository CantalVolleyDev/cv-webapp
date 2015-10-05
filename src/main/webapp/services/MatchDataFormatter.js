app.factory('MatchDataFormatter', [function() {
  return {
    format: function(match) {
      var momentDate = moment(match.date);
      var played = (match.state !== 'C');
      match.display = {
        momentDate: momentDate,
        shortDate: momentDate.format("DD/MM"),
        longDate: _.capitalize(momentDate.format("dddd DD/MM/YYYY [à] HH[h]mm")),
        generalScore: this.writeScore(match),
        firstWinner: (played && match.state !== 'F' && match.sc1 > match.sc2),
        secondWinner: (played && match.state !== 'F' && match.sc2 > match.sc1),
        waitingValidation: (played && (match.state === 'S' || match.state === 'R')),
        played: played,
        ended: (match.state === 'V' || match.state === 'F'),
        scoreDetail: this.writeScoreDetail(match),
        teamWaiting: this.writeTeamWaiting(match)
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
    },
    writeScoreDetail: function(match) {
      var detail = match.s11 + '-' + match.s12 + ', ' + match.s21 + '-' + match.s22 + ', ' + match.s31 + '-' + match.s32;
      var total = match.sc1 + match.sc2;
      if (total > 3) {
        detail += ', ' + match.s41 + '-' + match.s42;
        if (total > 4)
          detail += ', ' + match.s51 + '-' + match.s52;
      }
      return detail;
    },
    writeTeamWaiting: function(match) {
      if (match.state !== 'S' && match.state !== 'R')
        return "";
      if (match.scoreSettingTeam.identifier == match.firstTeam.identifier) {
        return match.secondTeam.label;
      } else return match.firstTeam.label;
    }
  }
}]);