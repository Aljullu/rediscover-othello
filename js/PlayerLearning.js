"use strict";

var PlayerLearning = function () {
  this.id = 1;

  this.weights = new Array(3);
  for (var i = 0; i < this.weights.length; i++) {
    this.weights[i] = new Array(2);
    this.weights[i][0] = 0;
    this.weights[i][1] = 0;
  }

  this.variables = new Array(3);
  for (var i = 0; i < this.variables.length; i++) {
    this.variables[i] = new Array(2);
    this.variables[i][0] = 0;
    this.variables[i][1] = 0;
  }

  this.learningRate = 0.0001;
};

PlayerLearning.prototype.play = function () {
  /* variables[0][0] = stones PlayerLearning
   * variables[0][1] = stones opponent
   * variables[1][0] = stones PlayerLearning in the borders
   * variables[1][1] = stones opponent in the borders
   * variables[2][0] = stones PlayerLearning in the 4-borders
   * variables[2][1] = stones opponent in the 4-borders
   */

  var scope = this;

  setTimeout(makePlay, 100);

  function makePlay() {
    var bestx = 0;
    var besty = 0;
    var bestAdvantage = Number.MIN_VALUE;

    for (var i = 0; i < board.cellColumns; i++) {
      for (var j = 0; j < board.cellRows; j++) {
        if (board.cell[i][j].canPlayerPlay(scope.id)) {
          var boardTmp = board.clone();
          boardTmp.cell[i][j].playerPlay(scope.id);
          var advantageTmp =
            boardTmp.getCellsByPlayer(1) * scope.weights[0][0] +
            boardTmp.getCellsByPlayer(2) * scope.weights[0][1] +
            boardTmp.getBorderCellsByPlayer(1) * scope.weights[1][0] +
            boardTmp.getBorderCellsByPlayer(2) * scope.weights[1][1] +
            boardTmp.get4BorderCellsByPlayer(1) * scope.weights[2][0] +
            boardTmp.get4BorderCellsByPlayer(2) * scope.weights[2][1];
          if (advantageTmp > bestAdvantage /*&& Math.random() < .9*/) {
            bestAdvantage = advantageTmp;
            bestx = i;
            besty = j;
          }
        }
      }
    }

    // Make the movement
    if (board.cell[bestx][besty].playerPlay(scope.id)) {
      scope.variables[0][0] += board.getCellsByPlayer(1);
      scope.variables[0][1] += board.getCellsByPlayer(2);
      scope.variables[1][0] += board.getBorderCellsByPlayer(1);
      scope.variables[1][1] += board.getBorderCellsByPlayer(2);
      scope.variables[2][0] += board.get4BorderCellsByPlayer(1);
      scope.variables[2][1] += board.get4BorderCellsByPlayer(2);
      if (scope.id === 1) board.playerPlaying = 2;
      else board.playerPlaying = 1;
      board.updateInfo();
    }
  }
};

PlayerLearning.prototype.gameIsOver = function () {
  // Reward is the difference between stones
  var reward = board.getAdvantage(this.id);

  this.weights[0][0] += this.learningRate * this.variables[0][0] * reward;
  this.weights[0][1] += this.learningRate * this.variables[0][1] * reward;
  this.weights[1][0] += this.learningRate * this.variables[1][0] * reward;
  this.weights[1][1] += this.learningRate * this.variables[1][1] * reward;
  this.weights[2][0] += this.learningRate * this.variables[2][0] * reward;
  this.weights[2][1] += this.learningRate * this.variables[2][1] * reward;
  console.log(this.weights);
  ui.startGame();
};
