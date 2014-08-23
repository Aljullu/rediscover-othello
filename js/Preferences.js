"use strict";

var Preferences = function() {
    this.color = localStorage.getItem("color") ? localStorage.getItem("color") : "white";
    this.start = localStorage.getItem("start") ? localStorage.getItem("start") : "me";
    this.tableColor = localStorage.getItem("tableColor") ? localStorage.getItem("tableColor") : "#003200";
    this.tableBorderColor = localStorage.getItem("tableBorderColor") ? localStorage.getItem("tableBorderColor") : "#002800";
    this.cellRows = localStorage.getItem("cellRows") ? localStorage.getItem("cellRows") : 8;
    this.cellColumns = localStorage.getItem("cellColumns") ? localStorage.getItem("cellColumns") : 8;
}

Preferences.prototype.saveSetting = function(setting, value) {
    this[setting] = value;
    localStorage.setItem(setting, value);
}

Preferences.prototype.getSetting = function(setting) {
    return this[setting];
}