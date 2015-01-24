"use strict";

// Cell state
// 0 empty
// 1 player1
// 2 player2
var Board = function(mapSettings) {
    this.cellRows = (mapSettings.cellRows) ? mapSettings.cellRows : preferences.getSetting('cellRows');
    this.cellColumns = (mapSettings.cellColumns) ? mapSettings.cellColumns : preferences.getSetting('cellColumns');

    this.width = 400;
    this.height = 400;

    this.cellHeight = this.height/this.cellRows;
    this.cellWidth = this.width/this.cellColumns;
    this.cellBorder = 1;

    this.color = (mapSettings.color) ? mapSettings.color : preferences.getSetting('boardColor');
    this.borderColor = (mapSettings.borderColor) ? mapSettings.borderColor : preferences.getSetting('boardBorderColor');

    this.startingPointX = (mapSettings.startingPointX) ? mapSettings.startingPointX : preferences.getSetting('startingPointX');
    this.startingPointY = (mapSettings.startingPointY) ? mapSettings.startingPointY : preferences.getSetting('startingPointY');
};

Board.prototype.initialize = function () {
    this.cell = new Array(this.cellColumns);
    for (var i = 0; i < this.cellColumns; i++) {
        this.cell[i] = new Array(this.cellRows);
        
        for (var j = 0; j < this.cellRows; j++) {
            this.cell[i][j] = new Cell(i, j, this);
        }
    }
    
    this.playerPlaying = (preferences.getSetting('start') === 'me') ? 1 : 2;
    
    this.toBePainted = false;

    var x,
        y;
    if (typeof this.startingPointX !== "undefined" && this.startingPointX !== null) {
        x = Math.max(this.startingPointX, 0);
        x = Math.min(x, this.cellColumns - 2);
    }
    else {
        x = this.cellColumns/2 - 1;
    }
    if (typeof this.startingPointY !== "undefined" && this.startingPointY !== null) {
        y = Math.max(this.startingPointY, 0);
        y = Math.min(y, this.cellRows - 2);
    }
    else {
        y = this.cellRows/2 - 1;
    }
    // Don't allow values outside the scope
    this.cell[Math.floor(x)][Math.floor(y)].state = 1;
    this.cell[Math.floor(x)][Math.floor(y+1)].state = 2;
    this.cell[Math.floor(x+1)][Math.floor(y)].state = 2;
    this.cell[Math.floor(x+1)][Math.floor(y+1)].state = 1;

    ui.initialize();
}

Board.prototype.recalculateSizes = function (width, height) {
    this.width = width;
    this.height = height;

    this.cellHeight = this.height/this.cellRows;
    this.cellWidth = this.width/this.cellColumns;
    
    ui.newCanvasSize(width, height);
}

Board.prototype.draw = function () {
    if (this.toBePainted) {
        ctx.fillStyle = this.borderColor;
        ctx.fillRect (0, 0, this.cellColumns*this.cellWidth, this.cellRows*this.cellHeight);
        
        for (var i = 0; i < board.cellColumns; i++) {
            for (var j = 0; j < board.cellRows; j++) {
               this.cell[i][j].draw();
            }
        }
    }
}

// Return x,y position cell
Board.prototype.checkCell = function ( x, y ) {
    
    return [Math.floor( x / this.cellWidth ),
            Math.floor( y / this.cellHeight )];
};

Board.prototype.playerOnCell = function ( x, y ,playerId ) {
    // If it's users turn
    if (this.playerPlaying === 1) {
        // If we can play there
        if (this.cell[x][y].playerPlay( playerId )) {
            this.playerPlaying = 2;
            this.updateInfo( );
        }
    }
};

Board.prototype.updateInfo = function ( ) {
    
    var areThereFreeCells = false;
    var noMoreMoves = false;
    
    var score1 = 0;
    var score2 = 0;
    for (var i = 0; i < this.cellColumns; i++) {
        for (var j = 0; j < this.cellRows; j++) {
           if (this.cell[i][j].state === 1) score1++;
           else if (this.cell[i][j].state === 2) score2++;
           else areThereFreeCells = true;
        }
    }
    
    if (!this.canPlayerPlay(this.playerPlaying)) {
        ui.showMessage("Player " + this.playerPlaying + " cannot move, he looses his turn.");
        this.playerPlaying = (this.playerPlaying === 1) ? 2 : 1;
        if (!this.canPlayerPlay(this.playerPlaying)) {
            ui.showMessage("Player " + this.playerPlaying + " cannot move either. The game is over.");
            noMoreMoves = true;
        }
    }
    
    if (!areThereFreeCells || noMoreMoves) {
        if (score1 > score2) board.win(1);
        else if (score2 > score1) board.win(2);
        else board.win(0);
    }
    else if (this.playerPlaying === 2) {
        ui.markTurn(1);
        opponent.play();
    }
    else {
        ui.markTurn(0);
    }
    
    ui.newScore(0,score1);
    ui.newScore(1,score2);
    //ui.showMessage("Advantage: " + this.getAdvantage(1));
};

Board.prototype.getAdvantage = function ( player ) {
    var score1 = 0;
    var score2 = 0;
    for (var i = 0; i < this.cellColumns; i++) {
        for (var j = 0; j < this.cellRows; j++) {
           if (this.cell[i][j].state === 1) score1++;
           else if (this.cell[i][j].state === 2) score2++;
        }
    }
    
    if (player === 1) return score1-score2;
    else return score2-score1;
}

Board.prototype.canPlayerPlay = function ( playerId ) {
    for (var i = 0; i < this.cellColumns; i++) {
        for (var j = 0; j < this.cellRows; j++) {
           if (this.cell[i][j].canPlayerPlay(playerId)) {
               return true;
           }
        }
    }
    return false;
}

Board.prototype.win = function ( playerId ) {
    ui.winner(playerId);
}

Board.prototype.mouseOverCell = function ( x, y ) {
    
    for (var i = 0; i < this.cellColumns; i++) {
        for (var j = 0; j < this.cellRows; j++) {
            if (this.cell[i][j].over) {
                this.cell[i][j].over = false;
                this.cell[i][j].draw();
            }
        }
    }
    
    this.cell[x][y].over = true;
    this.cell[x][y].draw();
};

// TODO join with uploadInfo
Board.prototype.getCellsByPlayer = function ( playerId ) {
    
    var counter = 0;
    
    for (var i = 0; i < this.cellColumns; i++) {
        for (var j = 0; j < this.cellRows; j++) {
            if (this.cell[i][j].state === playerId) {
                counter++;
            }
        }
    }
    
    return counter;
};

// TODO join with uploadInfo
Board.prototype.getBorderCellsByPlayer = function ( playerId ) {
    
    var counter = 0;
    
    for (var i = 0; i < this.cellColumns; i++) {
        if (this.cell[i][0].state === playerId) {
            counter++;
        }
        if (this.cell[i][this.cellRows - 1].state === playerId) {
            counter++;
        }
    }
    for (var j = 0; j < this.cellRows; j++) {
        if (this.cell[0][j].state === playerId) {
            counter++;
        }
        if (this.cell[this.cellColumns - 1][j].state === playerId) {
            counter++;
        }
    }
    
    return counter;
};

// TODO join with uploadInfo
Board.prototype.get4BorderCellsByPlayer = function ( playerId ) {
    
    var counter = 0;
    
    if (this.cell[0][0].state === playerId) {
        counter++;
    }
    if (this.cell[0][this.cellRows - 1].state === playerId) {
        counter++;
    }
    if (this.cell[this.cellColumns - 1][this.cellRows - 1].state === playerId) {
        counter++;
    }
    if (this.cell[this.cellColumns - 1][0].state === playerId) {
        counter++;
    }
    
    return counter;
};

Board.prototype.clone = function ( ) {
    
    var newBoard = new Board([]);

    newBoard.cellRows = this.cellRows;
    newBoard.cellColumns = this.cellColumns;

    newBoard.cellHeight = this.cellHeight;
    newBoard.cellWidth = this.cellWidth;
    newBoard.cellBorder = this.cellBorder;
    
    newBoard.cell = new Array(newBoard.cellColumns);
    for (var i = 0; i < newBoard.cellColumns; i++) {
        newBoard.cell[i] = new Array(newBoard.cellRows);
        
        for (var j = 0; j < newBoard.cellRows; j++) {
            newBoard.cell[i][j] = this.cell[i][j].clone();
            newBoard.cell[i][j].board = newBoard;
        }
    }
    
    newBoard.playerPlaying = this.playerPlaying;
    
    return newBoard;
};
