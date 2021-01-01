"use strict";

var Player = function () {
  this.id = 2;
};

Player.prototype.play = function () {
  var scope = this;

  setTimeout(makePlay, 200);

  function makePlay() {
    var bestx = 0;
    var besty = 0;
    var bestAdvantage = Number.MIN_VALUE;

    for (var i = 0; i < board.cellColumns; i++) {
      for (var j = 0; j < board.cellRows; j++) {
        if (board.cell[i][j].canPlayerPlay(scope.id)) {
          var boardTmp = board.clone();
          boardTmp.cell[i][j].playerPlay(scope.id);
          var advantageTmp = boardTmp.getAdvantage(scope.id);
          if (advantageTmp > bestAdvantage) {
            bestAdvantage = advantageTmp;
            bestx = i;
            besty = j;
          }
        }
      }
    }

    // Make the movement
    if (board.cell[bestx][besty].playerPlay(scope.id)) {
      if (scope.id === 1) board.playerPlaying = 2;
      else board.playerPlaying = 1;
      board.updateInfo();
    }
  }
};

Player.prototype.gameIsOver = function () {
  return;
};
