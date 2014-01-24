"use strict";

var Sounds = function() {
}


Sounds.prototype.stoneFlipping = function() {
    var sound = new Audio('./audio/stone-flipping.mp3');
    sound.play();
}