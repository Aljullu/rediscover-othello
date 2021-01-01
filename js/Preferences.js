"use strict";

var Preferences = function () {
    this.playerColor = localStorage.getItem("playerColor") || "white";
    this.start = localStorage.getItem("start") || "me";
    this.boardColor = localStorage.getItem("boardColor") || "#003200";
    this.boardBorderColor = localStorage.getItem("boardBorderColor") || "#002800";
    this.cellRows = localStorage.getItem("cellRows") || 8;
    this.cellColumns = localStorage.getItem("cellColumns") || 8;
    this.startingPointX = localStorage.getItem("statingPointX") || null;
    this.startingPointX = localStorage.getItem("statingPointY") || null;
    this.campaignLevel = localStorage.getItem("campaignLevel") || 0;
}

Preferences.prototype.saveSetting = function (setting, value) {
    this[setting] = value;
    localStorage.setItem(setting, value);
}

Preferences.prototype.getSetting = function (setting) {
    return this[setting];
}