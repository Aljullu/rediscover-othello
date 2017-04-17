"use strict";

var UI = function () {
    this.playerNames = ["Player 1", "Player 2"];
    this.playerScores = [2, 2];
    this.turn = 0;
    this.offsetLeft = 0;
    this.offsetTop = 0;
    this.campaignLevel = -1;
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
    $("#player" + id + " .name").html('<i class="fa"></i> ' + this.playerNames[id]);
}

UI.prototype.setScore = function (id, score) {
    this.playerScores[id] = score;
}

UI.prototype.writeScore = function (id) {
    $(".player" + id + "-score").html(this.playerScores[id]);
}

UI.prototype.newScore = function (id, score) {
    ui.setScore(id, score);
    ui.writeScore(id);
}

UI.prototype.markTurn = function (id) {
    $("#player" + this.turn).removeClass("plays");
    $("#player" + this.turn + " .fa").removeClass("fa-dot-circle-o");
    this.turn = id;
    $("#player" + this.turn).addClass("plays");
    $("#player" + this.turn + " .fa").addClass("fa-dot-circle-o");
}

UI.prototype.winner = function (id) {

    ui.markTurn(id);
    ui.showMessage("Player " + id + " wins by " + board.getAdvantage(id) + "!");
    if (id === 1) {
        if (this.campaignLevel >= 0) { // we were in campaign mode
            this.campaignLevel++;
            preferences.saveSetting('campaignLevel', this.campaignLevel);
        }
        $("#game-is-over-winner").removeClass('hidden');
        if (this.campaignLevel >= 0) {
            $('.continue-campaign').removeClass('hidden');
        }
        else {
            $('.continue-campaign').addClass('hidden');
        }
        $("#game-is-over-loser").addClass('hidden');
    } else {
        $("#game-is-over-winner").addClass('hidden');
        $('.continue-campaign').addClass('hidden');
        $("#game-is-over-loser").removeClass('hidden');
    }
    ui.showDialog('game-is-over');

    // Make some menu modifications
    $("#resume-game").addClass('hidden');
    $("#start-game").html("Start game");

    ui.saveScore();

    // Timer
    ui.updateTimer();
}

UI.prototype.saveScore = function () {
    // Get info from board
    var cells1 = board.getCellsByPlayer(1),
        cells2 = board.getCellsByPlayer(2),
        advantage = cells1 - cells2;

    // Get date
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    // Get current best scores
    var bestScores = localStorage.getItem('bestScores') ? JSON.parse(localStorage.getItem('bestScores')) : new Array();
    bestScores.push({
        'date': yyyy + '-' + mm + '-' + dd,
        'player1': cells1,
        'player2': cells2,
        'advantage': advantage,
        'duration': Math.round((new Date() - timer) / 1000)
    });

    // Order
    bestScores.sort(function (a, b) {
        return b.advantage - a.advantage;
    });

    // Save
    localStorage.setItem('bestScores', JSON.stringify(bestScores));
}

UI.prototype.showMessage = function (message) {
    console.log(message);
}

var ctx;
var opponent;
var firstGame = true;
var board;

UI.prototype.parseFile = function (response) {
    var responseArray = response.split('\n'),
        mapSettings = [];
    for (var i = 0; i < responseArray.length; i++) {
        responseArray[i] = responseArray[i].split(',');
    }

    for (var i = 0; i < responseArray.length; i++) {
        if (responseArray[i][0] === 'size') {
            mapSettings.cellRows = responseArray[i][1];
            mapSettings.cellColumns = responseArray[i][2];
        } else if (responseArray[i][0] === 'color') {
            mapSettings.color = responseArray[i][1];
            mapSettings.borderColor = responseArray[i][2];
        } else if (responseArray[i][0] === 'startingPoint') {
            mapSettings.startingPointX = responseArray[i][1];
            mapSettings.startingPointY = responseArray[i][2];
        } else if (responseArray[i][0] === 'mapW') {
            mapSettings.mapW = [];
            for (var j = 1; j < responseArray[i].length; j = j+2) {
                mapSettings.mapW.push([responseArray[i][j], responseArray[i][j+1]]);
            }
        } else if (responseArray[i][0] === 'mapB') {
            mapSettings.mapB = [];
            for (var j = 1; j < responseArray[i].length; j = j+2) {
                mapSettings.mapB.push([responseArray[i][j], responseArray[i][j+1]]);
            }
        }
    }
    return mapSettings;
}

UI.prototype.prepareMap = function () {
    // Set flag to true
    gameRunning = true;

    // Create canvas
    var canvas = document.getElementById('board-canvas');
    canvas.addEventListener("mousedown", doClick, false);
    canvas.addEventListener("mousemove", doMoveMouse, false);
    ctx = canvas.getContext('2d');

    var debug = true;

    if (this.campaignLevel >= 0) {
        if (debug) {
            var mapCode = ['size,8,8\nstartingPoint,1,1',
                           'size,8,8\nmapW,2,2,3,3,4,4,5,5\nmapB,2,5,3,4,4,3,5,2',
                           'size,8,8\nmapW,2,2,3,3,4,4,5,5\nmapB,2,5,3,4,4,3,5,2'];
            ui.startMap(ui.parseFile(mapCode[this.campaignLevel]));
        } else {
            var map = './maps/map' + ('000' + this.campaignLevel).slice(-3) + '.csv';
            $.ajax({
                url: map,
                success: function (response) {
                    ui.startMap(ui.parseFile(response));
                }
            });
        }
    } else {
        ui.startMap([]);
    }
}

UI.prototype.startGame = function () {
    this.campaignLevel = -1;
    $('#campaign-level').html('').addClass('hidden');
    ui.prepareMap();
}

UI.prototype.startCampaign = function () {
    this.campaignLevel = preferences.getSetting('campaignLevel');
    $('#campaign-level').text(parseInt(this.campaignLevel, 10) + 1).removeClass('hidden');
    ui.prepareMap();
}

UI.prototype.startMap = function (mapSettings) {
    board = new Board(mapSettings);
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
    $("#resume-game").removeClass('hidden');
    $("#start-game").html("Start new game");

    ui.startTimer();
}

var timer = 0;
UI.prototype.startTimer = function () {
    timer = new Date();
}

UI.prototype.updateTimer = function () {
    $("#timer").html(Math.round((new Date() - timer) / 1000));
}

UI.prototype.resumeGame = function () {
    ui.showGameBoard();
}

UI.prototype.showMenu = function () {
    $(".game").addClass('hidden');
    $(".dialog").addClass('hidden');
    $(".no-game").removeClass('hidden');
    $("html").removeClass("playing");
}

UI.prototype.showGameBoard = function () {
    $(".no-game").addClass('hidden');
    $(".dialog").addClass('hidden');
    $(".game").removeClass('hidden');
    $("html").addClass("playing");
    ui.drawBoard();
}

UI.prototype.showDialog = function (dialog) {
    $("#" + dialog).removeClass('hidden');
}

UI.prototype.hideDialog = function (dialog) {
    $("#" + dialog).addClass('hidden');
}

UI.prototype.drawBoard = function () {
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

UI.prototype.newCanvasSize = function (w, h) {
    $("#board-canvas").attr("height", h).attr("width", w);
}

// save board offsets to handle mouseover and click properly
UI.prototype.calculateOffsets = function () {
    this.offsetLeft = $("#board")[0].offsetLeft;
    this.offsetTop = $("#board")[0].offsetTop;
}

UI.prototype.showBestScores = function () {
    if (localStorage.getItem('bestScores')) {
        var bestScores = JSON.parse(localStorage.getItem('bestScores'));
        $(".best-scores-table").html("<tr><th>Date</th><th>Potins</th><th>Duration</th></tr>");
        for (var i = 0; i < bestScores.length; i++) {
            $(".best-scores-table").append("<tr><td>" + bestScores[i].date + "</td><td>" + bestScores[i].player1 + "-" + bestScores[i].player2 + " (" + bestScores[i].advantage + ")</td><td>" + bestScores[i].duration + "s.</td></tr>");
        }
        $(".best-scores-empty").addClass('hidden');
        $(".best-scores-table").removeClass('hidden');
    } else {
        $(".best-scores-empty").removeClass('hidden');
        $(".best-scores-table").addClass('hidden');
    }
    ui.showDialog('best-scores');
}

UI.prototype.hideBestScores = function () {
    ui.hideDialog('best-scores');
}

UI.prototype.showPreferences = function () {
    var color = preferences.getSetting('color');
    $("#preferences-color").val(color);
    var start = preferences.getSetting('start');
    $("#preferences-start").val(start);
    var boardColor = preferences.getSetting('boardColor');
    $("#preferences-table-color").val(boardColor);
    var boardBorderColor = preferences.getSetting('boardBorderColor');
    $("#preferences-table-border-color").val(boardBorderColor);
    var cellRows = preferences.getSetting('cellRows');
    $("#preferences-cellRows").val(cellRows);
    var cellColumns = preferences.getSetting('cellColumns');
    $("#preferences-cellColumns").val(cellColumns);
    var startingPointX = preferences.getSetting('startingPointX');
    $("#preferences-startingPointX").val(startingPointX);
    var startingPointY = preferences.getSetting('startingPointY');
    $("#preferences-startingPointY").val(startingPointY);

    ui.updateStartingPointVisualization();

    $("#different-starting-point").change(ui.updateStartingPointVisualization);

    ui.showDialog('preferences');
}

UI.prototype.hidePreferences = function () {
    ui.hideDialog('preferences');
}

UI.prototype.savePreferences = function () {
    this.hidePreferences();

    var colorSelect = document.getElementById("preferences-color");
    var color = colorSelect.options[colorSelect.selectedIndex].value;
    preferences.saveSetting('color', color);

    var startSelect = document.getElementById("preferences-start");
    var start = startSelect.options[startSelect.selectedIndex].value;
    preferences.saveSetting('start', start);

    var boardColorInput = document.getElementById("preferences-table-color");
    var boardColor = boardColorInput.value;
    preferences.saveSetting('boardColor', boardColor);

    var boardBorderColorInput = document.getElementById("preferences-table-border-color");
    var boardBorderColor = boardBorderColorInput.value;
    preferences.saveSetting('boardBorderColor', boardBorderColor);

    var cellRowsInput = document.getElementById("preferences-cellRows");
    var cellRows = cellRowsInput.value;
    preferences.saveSetting('cellRows', cellRows);

    var cellColumnsInput = document.getElementById("preferences-cellColumns");
    var cellColumns = cellColumnsInput.value;
    preferences.saveSetting('cellColumns', cellColumns);

    var startingPointXInput = document.getElementById("preferences-startingPointX");
    var startingPointX = startingPointXInput.value;
    preferences.saveSetting('startingPointX', startingPointX);

    var startingPointYInput = document.getElementById("preferences-startingPointY");
    var startingPointY = startingPointYInput.value;
    preferences.saveSetting('startingPointY', startingPointY);

    if (!$("#different-starting-point").is(":checked")) {
        preferences.saveSetting('startingPointX', null);
        preferences.saveSetting('startingPointY', null);
    }
}

UI.prototype.updateStartingPointVisualization = function () {
    if ($("#different-starting-point").is(":checked")) {
        $("#preferences-startingPoint").removeClass("hidden");
        if ($("#preferences-startingPointX").val() === "") {
            $("#preferences-startingPointX").val(Math.floor($("#preferences-cellRows").val() / 2));
        }
        if ($("#preferences-startingPointY").val() === "") {
            $("#preferences-startingPointY").val(Math.floor($("#preferences-cellColumns").val() / 2));
        }
    } else {
        $("#preferences-startingPoint").addClass("hidden");
    }
}
