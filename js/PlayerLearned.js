"use strict";

var PlayerLearned = function() {
    this.id = 2;
    this.opponentid = 1;
    
    this.level = 100;
    
    // Learned from PlayerLearning.js using target function method
    this.weights = new Array(3);
    this.weights[0] = new Array(2);
    this.weights[0][0] = 618;
    this.weights[0][1] = 261;
    this.weights[1] = new Array(2);
    this.weights[1][0] = 247;
    this.weights[1][1] = 58;
    this.weights[2] = new Array(2);
    this.weights[2][0] = 29;
    this.weights[2][1] = 2;
};

PlayerLearned.prototype.play = function ( ) {
    
    var scope = this;
    
    setTimeout(makePlay, 100);
    
    function makePlay () {
        var bestx = -1;
        var besty = -1;
        var bestAdvantage = -Number.MIN_VALUE;
        
        for (var i = 0; i < board.cellColumns; i++) {
            for (var j = 0; j < board.cellRows; j++) {
                if (board.cell[i][j].canPlayerPlay(scope.id)) {
                    var boardTmp = board.clone();
                    boardTmp.cell[i][j].playerPlay(scope.id);
                    
                    // Calculate target function
                    var advantageTmp = boardTmp.getCellsByPlayer(scope.id) * scope.weights[0][0] +
                                       boardTmp.getCellsByPlayer(scope.opponentid) * scope.weights[0][1] +
                                       boardTmp.getBorderCellsByPlayer(scope.id) * scope.weights[1][0] +
                                       boardTmp.getBorderCellsByPlayer(scope.opponentid) * scope.weights[1][1] +
                                       boardTmp.get4BorderCellsByPlayer(scope.id) * scope.weights[2][0] +
                                       boardTmp.get4BorderCellsByPlayer(scope.opponentid) * scope.weights[2][1];
                    
                    if (
                        (bestx === -1 && besty === -1) ||
                        (advantageTmp > bestAdvantage/* &&
                         Math.random() <= scope.level*/)
                        ) {
                        bestAdvantage = advantageTmp;
                        bestx = i;
                        besty = j;
                    }
                }
            }
        }
        
        // Make the movement
        if (board.cell[bestx][besty].playerPlay(scope.id)) {
            board.playerPlaying = scope.opponentid;
            board.updateInfo( );
        }
    }
}