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

var sounds = new Sounds();
var preferences = new Preferences();

function doClick(event) {
    if (gameRunning) {
        // if click on board
        if (pointInRectangle(event.clientX - ui.offsetLeft, event.clientY - ui.offsetTop, 0, 0, board.cellColumns * board.cellWidth, board.cellRows * board.cellHeight)) {
            var cell = board.checkCell(event.clientX - ui.offsetLeft, event.clientY - ui.offsetTop);
            board.playerOnCell(cell[0], cell[1], 1);
        }
    }
}

function doMoveMouse(event) {
    if (gameRunning) {
        // if click on board
        if (pointInRectangle(event.clientX - ui.offsetLeft, event.clientY - ui.offsetTop, 0, 0, board.cellColumns * board.cellWidth, board.cellRows * board.cellHeight)) {
            var cell = board.checkCell(event.clientX - ui.offsetLeft, event.clientY - ui.offsetTop);
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

window.onresize = function(event) {
    ui.drawBoard();
};