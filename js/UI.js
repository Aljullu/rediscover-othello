"use strict";

var UI = function() {
    this.playerNames = ["Player 1", "Player 2"];
    this.playerScores = [2,2];
    this.turn = 0;
    this.offsetLeft = 0;
    this.offsetTop = 0;
}

UI.prototype.initialize = function () {
    ui.writePlayerName(0);
    ui.writePlayerName(1);
    ui.writeScore(0);
    ui.writeScore(1);
    ui.markTurn(0);
    ui.drawBoard();
}

UI.prototype.setPlayerName = function (id, name) {
    this.playerNames[id] = name;
}

UI.prototype.writePlayerName = function (id) {
    $("#player"+id+" .name").html('<i class="fa"></i> ' + this.playerNames[id]);
}

UI.prototype.setScore = function (id, score) {
    this.playerScores[id] = score;
}

UI.prototype.writeScore = function (id) {
    $(".player"+id+"-score").html(this.playerScores[id]);
}

UI.prototype.newScore = function (id, score) {
    ui.setScore(id, score);
    ui.writeScore(id);
}

UI.prototype.markTurn = function (id) {
    $("#player"+this.turn).removeClass("plays");
    $("#player"+this.turn+" .fa").removeClass("fa-dot-circle-o");
    this.turn = id;
    $("#player"+this.turn).addClass("plays");
    $("#player"+this.turn+" .fa").addClass("fa-dot-circle-o");
}

UI.prototype.winner = function (id) {
    ui.markTurn(id);
    ui.showMessage("Player "+id+" wins by " + board.getAdvantage(id) + "!");
    if (id === 1) {
        $("#game-is-over-winner").show();
        $("#game-is-over-loser").hide();
    }
    else {
        $("#game-is-over-winner").hide();
        $("#game-is-over-loser").show();
    }
    ui.showDialog('game-is-over');
    
    // Make some menu modifications
    $("#resume-game").hide();
    $("#start-game").html("Start game");
    
    // Timer
    ui.updateTimer();
}

UI.prototype.showMessage = function (message) {
    console.log(message);
}

var ctx;
var opponent;
var firstGame = true;
var board;

UI.prototype.startGame = function() {
    // Set flag to true
    gameRunning = true;
    
    // Create canvas
    var canvas = document.getElementById('board-canvas');
    canvas.addEventListener("mousedown", doClick, false);
    canvas.addEventListener("mousemove", doMoveMouse, false);
    ctx = canvas.getContext('2d');
    
    // Create game stuff
    board = new Board();
    board.initialize();
    board.toBePainted = true;
    board.draw();
    if (firstGame) {
        opponent = new PlayerLearned();
        firstGame = false;
    }
    board.updateInfo();
    
    // Show game board
    ui.showGameBoard();
    ui.calculateOffsets();
    
    // Make some menu modifications
    $("#resume-game").show();
    $("#start-game").html("Start new game");
    
    ui.startTimer();
}

var timer = 0;
UI.prototype.startTimer = function() {
    timer = new Date();
}

UI.prototype.updateTimer = function() {
    $("#timer").html(Math.round((new Date() - timer)/1000));
}

UI.prototype.resumeGame = function() {
    ui.showGameBoard();
}

UI.prototype.showMenu = function() {
    $(".game").hide();
    $(".dialog").hide();
    $(".no-game").show();
}

UI.prototype.showGameBoard = function() {
    $(".no-game").hide();
    $(".dialog").hide();
    $(".game").show();
    ui.drawBoard();
}

UI.prototype.showDialog = function(dialog) {
    $("#"+dialog).show();
}

UI.prototype.hideDialog = function(dialog) {
    $("#"+dialog).hide();
}

UI.prototype.drawBoard = function() {
    if (gameRunning) {
        var width = Math.min(window.innerWidth, 400), // TODO 400 should not be hardcorded
            height = Math.min(window.innerHeight, 400),
            size = Math.min(width, height);
        
        if (board) board.recalculateSizes(size, size);
        ui.newCanvasSize(size, size);
        ui.calculateOffsets();
        board.draw();
    }
}

UI.prototype.newCanvasSize = function(w,h) {
    $("#board-canvas").attr("height",h).attr("width",w);
}

// save board offsets to handle mouseover and click properly
UI.prototype.calculateOffsets = function () {
    this.offsetLeft = $("#board")[0].offsetLeft;
    this.offsetTop = $("#board")[0].offsetTop;
}

UI.prototype.showPreferences = function() {
    var color = preferences.getSetting('color');
    $("#preferences-color").val(color);
    var start = preferences.getSetting('start');
    $("#preferences-start").val(start);
    var tableColor = preferences.getSetting('tableColor');
    $("#preferences-table-color").val(tableColor);
    var tableBorderColor = preferences.getSetting('tableBorderColor');
    $("#preferences-table-border-color").val(tableBorderColor);
    var cellRows = preferences.getSetting('cellRows');
    $("#preferences-cellRows").val(cellRows);
    var cellColumns = preferences.getSetting('cellColumns');
    $("#preferences-cellColumns").val(cellColumns);
    
    ui.showDialog('preferences');
}

UI.prototype.savePreferences = function() {
    ui.hideDialog('preferences');
    
    var colorSelect = document.getElementById("preferences-color");
    var color = colorSelect.options[colorSelect.selectedIndex].value;
    preferences.saveSetting('color', color);
    
    var startSelect = document.getElementById("preferences-start");
    var start = startSelect.options[startSelect.selectedIndex].value;
    preferences.saveSetting('start', start);
    
    var tableColorInput = document.getElementById("preferences-table-color");
    var tableColor = tableColorInput.value;
    preferences.saveSetting('tableColor', tableColor);
    
    var tableBorderColorInput = document.getElementById("preferences-table-border-color");
    var tableBorderColor = tableBorderColorInput.value;
    preferences.saveSetting('tableBorderColor', tableBorderColor);
    
    var cellRowsInput = document.getElementById("preferences-cellRows");
    var cellRows = cellRowsInput.value;
    preferences.saveSetting('cellRows', cellRows);
    
    var cellColumnsInput = document.getElementById("preferences-cellColumns");
    var cellColumns = cellColumnsInput.value;
    preferences.saveSetting('cellColumns', cellColumns);
}