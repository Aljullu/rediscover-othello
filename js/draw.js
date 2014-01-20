"use strict";

/*
Sons:
Tirar - http://audiojungle.net/item/football-kick/118439?WT.ac=category_item&WT.seg_1=category_item&WT.z_author=yio
Girar - http://audiojungle.net/item/woosh01stereo/32241?WT.ac=category_item&WT.seg_1=category_item&WT.z_author=yio
Clics menu - http://audiojungle.net/item/3gs-game-sounds/134029?WT.ac=category_item&WT.seg_1=category_item&WT.z_author=ChristianKragh
Victoria - http://audiojungle.net/item/victorytrumpet/54657?WT.ac=category_item&WT.seg_1=category_item&WT.z_author=Paweqq
Derrota - http://audiojungle.net/item/victory-and-failure-effects/1627451?WT.ac=category_item&WT.seg_1=category_item&WT.z_author=Sound-Tricks
*/

var gameRunning = false;

var ui = new UI();
ui.showMenu();

function doClick(event) {
    if (gameRunning) {
        // if click on board
        if (pointInRectangle(event.clientX - offsetLeft, event.clientY - offsetTop, 0, 0, board.cellColumns * board.cellWidth, board.cellRows * board.cellHeight)) {
            var cell = board.checkCell(event.clientX - offsetLeft, event.clientY - offsetTop);
            board.playerOnCell(cell[0], cell[1], 1);
        }
    }
}

function doMoveMouse(event) {
    if (gameRunning) {
        // if click on board
        if (pointInRectangle(event.clientX - offsetLeft, event.clientY - offsetTop, 0, 0, board.cellColumns * board.cellWidth, board.cellRows * board.cellHeight)) {
            var cell = board.checkCell(event.clientX - offsetLeft, event.clientY - offsetTop);
            board.mouseOverCell(cell[0], cell[1], 1);
        }
    }
}

// point x,y | rectangle a,b
function pointInRectangle(x, y, ax, ay, bx, by) {
    if (x > ax && x < bx &&
        y > ay && y < by) return true;
    return false;
}

// TODO move to ui
var offsetLeft, offsetTop;
// save board offsets to handle mouseover and click properly
function calculateOffsets () {
    offsetLeft = document.getElementById("wrapper").offsetLeft;
    offsetTop = document.getElementById("wrapper").offsetTop;
}

window.onresize = function(event) {
    if (gameRunning) {
        var width = Math.min(window.innerWidth, 400), // TODO 400 should not be hardcorded
            height = Math.min(window.innerHeight, 400),
            size = Math.min(width, height);
        
        if (board) board.recalculateSizes(size, size);
        calculateOffsets();
        board.draw();
    }
};