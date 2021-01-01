"use strict";

var Player = function () {
  this.id = 2;
};

Player.prototype.play = function () {
  var scope = this;

  setTimeout(makePlay, 200);

  function makePlay() {
    var bestX = 0;
    var bestY = 0;
    var bestAdvantage = Number.MIN_VALUE;

    for (var i = 0; i < board.cellColumns; i++) {
      for (var j = 0; j < board.cellRows; j++) {
        if (board.cell[i][j].canPlayerPlay(scope.id)) {
          var boardTmp = board.clone();
          boardTmp.cell[i][j].playerPlay(scope.id);
          var advantageTmp = boardTmp.getAdvantage(scope.id);
          if (advantageTmp > bestAdvantage) {
            bestAdvantage = advantageTmp;
            bestX = i;
            bestY = j;
          }
        }
      }
    }

    // Make the movement
    if (board.cell[bestX][bestY].playerPlay(scope.id)) {
      if (scope.id === 1) board.playerPlaying = 2;
      else board.playerPlaying = 1;
      board.updateInfo();
    }
  }
};

Player.prototype.gameIsOver = function () {
  return;
};
