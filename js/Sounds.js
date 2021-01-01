"use strict";

var Sounds = function () {
  this.active = false;
};

Sounds.prototype.stoneFlipping = function () {
  if (!this.active) return;
  var sound = new Audio("./audio/stone-flipping.mp3");
  sound.play();
};
