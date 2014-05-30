"use strict";

var Preferences = function() {
    this.color = localStorage.getItem("color") ? localStorage.getItem("color") : "white";
}

Preferences.prototype.saveSetting = function(setting, value) {
    this[setting] = value;
    localStorage.setItem(setting, value);
}

Preferences.prototype.getSetting = function(setting) {
    return this[setting];
}