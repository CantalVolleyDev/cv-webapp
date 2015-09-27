app.factory('ScoreDisplayHelper', function() {
  return {
    init: function(data, direct) {
      this.data = data;
      this.direct = direct;
      this.enableScoreFlag = false;
      this.enableScoreFlag = this.isScoreEnabled();
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
          return _.find(this.data.firstTeamMatchPlayers, function(player) {
            return player.player.identifier === userId;
          });
        } else {
          return _.find(this.data.secondTeamMatchPlayers, function(player) {
            return player.player.identifier === userId;
          });
        }
      }
      return false;
    },
    isScoreEnabled: function() {
      return this.initialized && ((this.data.match.state !== 'S' && this.data.match.state !== 'R') || this.enableScoreFlag);
    },
    displayRefuse: function() {
      return this.initialized && this.data.match.state !== 'C' && angular.isUndefined(this.direct);
    },
    getRefuseLabel: function() {
      if (!this.initialized)
        return "";
      if (this.displayRefuse() && this.isScoreEnabled()) {
        return "Modifiez maintenant le score puis validez";
      } else {
        return "Refuser le score";
      }
    },
    displayValidAndConfirm: function() {
      return this.initialized && this.data.match.state === 'C';
    },
    getOppositeTeamId: function() {
      if (this.data.userTeams.indexOf(this.data.match.firstTeam.identifier) === -1) {
        if (this.data.userTeams.indexOf(this.data.match.secondTeam.identifier) !== -1) {
          return this.data.match.firstTeam.identifier;
        }
      } else {
        if (this.data.userTeams.indexOf(this.data.match.secondTeam.identifier) === -1) {
          return this.data.match.secondTeam.identifier;
        }
      }
    }
  };
});