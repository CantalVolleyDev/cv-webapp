app.factory('ScoreDisplayHelper', function() {
  return {
    init: function(data) {
      this.data = data;
      this.initialized = true;
    },
    display4thSet: function() {
      return this.initialized && (this.data.match.sc1 + this.data.match.sc2 > 3);
    },
    display5thSet: function() {
      return this.initialized && (this.data.match.sc1 + this.data.match.sc2 > 4);
    },
    isUserTeam: function(teamId) {
      return this.initialized && (this.data.userTeams.indexOf(teamId) !== -1);
    },
    isUserInMatch: function(teamId, userId) {
      if (this.initialized) {
        if (this.data.match.firstTeam.identifier == teamId) {
          return _.filter(this.data.firstTeamMatchPlayers, function(player) {
            return player.player.identifier === userId;
          }).length > 0;
        } else {
          return _.filter(this.data.secondTeamMatchPlayers, function(player) {
            return player.player.identifier === userId;
          }).length > 0;
        }
      }
      return false;
    }
  };
});