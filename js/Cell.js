"use strict";

var Cell = function (x, y, board) {
  this.x = x;
  this.y = y;

  this.state = 0;
  this.over = false;

  this.board = board;
};

// Return x,y position cell
Cell.prototype.draw = function () {
  var scope = this;

  // Draw green board
  function drawBoard(ctx, x1, y1, sizeX, sizeY) {
    ctx.fillStyle = board.boardColor;
    ctx.fillRect(x1, y1, sizeX, sizeY);
  }

  // Draw mouse over
  function drawMouseOver(ctx, x1, y1, sizeX, sizeY) {
    var grd = ctx.createRadialGradient(x1, y1, 0, x1 + sizeX, y1 + sizeY, 100);

    if (scope.canPlayerPlay(1)) {
      // correct position
      grd.addColorStop(0, "rgb(25,75,125)");
      grd.addColorStop(1, "rgb(0,50,100)");
    } else {
      // not correct position
      grd.addColorStop(0, "rgb(125,75,25)");
      grd.addColorStop(1, "rgb(100,50,0)");
    }

    ctx.fillStyle = grd;
    ctx.fillRect(x1, y1, sizeX, sizeY);
  }

  // Draw mouse over
  function drawPlayer(ctx, x1c, y1c, radius) {
    var grd = ctx.createRadialGradient(
      x1c,
      y1c,
      radius,
      x1c + radius * 2,
      y1c + radius * 2,
      radius * 2
    );

    if (
      (scope.state === 1 && board.playerColor === "white") ||
      (scope.state === 2 && board.playerColor === "black")
    ) {
      // white player
      grd.addColorStop(0, "#aaa");
      grd.addColorStop(1, "#fff");
    } else {
      // black player
      grd.addColorStop(0, "#000");
      grd.addColorStop(1, "#444");
    }

    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(x1c, y1c, radius - radius / 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  if (this.board.toBePainted) {
    // Starting point
    var x1 = this.board.cellWidth * this.x + this.board.cellBorder;
    var y1 = this.board.cellHeight * this.y + this.board.cellBorder;

    // Cell size
    var sizeX = this.board.cellWidth - this.board.cellBorder * 2;
    var sizeY = this.board.cellHeight - this.board.cellBorder * 2;

    // Purge decimals
    x1 = Math.ceil(x1);
    y1 = Math.ceil(y1);
    sizeX = Math.floor(sizeX);
    sizeY = Math.floor(sizeY);

    drawBoard(ctx, x1, y1, sizeX, sizeY);
    if (this.over) drawMouseOver(ctx, x1, y1, sizeX, sizeY);

    // Draw players
    if (this.state > 0) {
      // Calculate cell center
      var x1c = this.board.cellWidth * (this.x + 0.5);
      var y1c = this.board.cellHeight * (this.y + 0.5);

      // Calculate radius
      var radius = (this.board.cellWidth - this.board.cellBorder * 2) / 2;
      drawPlayer(ctx, x1c, y1c, radius);
    }
  }
};

Cell.prototype.canPlayerPlay = function (player) {
  // Cell is already occupied
  if (this.state !== 0) return false;

  // Get enemy id
  const enemy = player === 2 ? 1 : 2;

  var minx = this.x - 1 < 0 ? 0 : this.x - 1;
  var maxx =
    this.x + 1 > this.board.cellColumns - 1
      ? this.board.cellColumns - 1
      : this.x + 1;
  var miny = this.y - 1 < 0 ? 0 : this.y - 1;
  var maxy =
    this.y + 1 > this.board.cellColumns - 1
      ? this.board.cellColumns - 1
      : this.y + 1;

  if (
    (this.board.cell[minx][this.y].search(player, 4) &&
      this.board.cell[minx][this.y].state === enemy) ||
    (this.board.cell[maxx][this.y].search(player, 2) &&
      this.board.cell[maxx][this.y].state === enemy) ||
    (this.board.cell[this.x][miny].search(player, 1) &&
      this.board.cell[this.x][miny].state === enemy) ||
    (this.board.cell[this.x][maxy].search(player, 3) &&
      this.board.cell[this.x][maxy].state === enemy) ||
    (this.board.cell[maxx][maxy].search(player, 5) &&
      this.board.cell[maxx][maxy].state === enemy) ||
    (this.board.cell[maxx][miny].search(player, 6) &&
      this.board.cell[maxx][miny].state === enemy) ||
    (this.board.cell[minx][miny].search(player, 7) &&
      this.board.cell[minx][miny].state === enemy) ||
    (this.board.cell[minx][maxy].search(player, 8) &&
      this.board.cell[minx][maxy].state === enemy)
  )
    return true;

  return false;
};

Cell.prototype.playerPlay = function (playerId) {
  if (this.canPlayerPlay(playerId) === false) {
    console.error(
      "Error, cell not allowed. Player " +
        playerId +
        " in cell " +
        this.x +
        ", " +
        this.y
    );
    return false;
  }

  this.state = playerId;
  this.draw();

  // Get enemy id
  var enemy = 2;
  if (playerId === 2) enemy = 1;

  var minx = this.x - 1 < 0 ? 0 : this.x - 1;
  var maxx =
    this.x + 1 > this.board.cellColumns - 1
      ? this.board.cellColumns - 1
      : this.x + 1;
  var miny = this.y - 1 < 0 ? 0 : this.y - 1;
  var maxy =
    this.y + 1 > this.board.cellRows - 1
      ? this.board.cellColumns - 1
      : this.y + 1;

  if (this.board.cell[minx][this.y].search(playerId, 4))
    this.board.cell[minx][this.y].propagate(playerId, 4, 0);

  if (this.board.cell[maxx][this.y].search(playerId, 2))
    this.board.cell[maxx][this.y].propagate(playerId, 2, 0);

  if (this.board.cell[this.x][miny].search(playerId, 1))
    this.board.cell[this.x][miny].propagate(playerId, 1, 0);

  if (this.board.cell[this.x][maxy].search(playerId, 3))
    this.board.cell[this.x][maxy].propagate(playerId, 3, 0);

  if (this.board.cell[maxx][maxy].search(playerId, 5))
    this.board.cell[maxx][maxy].propagate(playerId, 5, 0);

  if (this.board.cell[maxx][miny].search(playerId, 6))
    this.board.cell[maxx][miny].propagate(playerId, 6, 0);

  if (this.board.cell[minx][miny].search(playerId, 7))
    this.board.cell[minx][miny].propagate(playerId, 7, 0);

  if (this.board.cell[minx][maxy].search(playerId, 8))
    this.board.cell[minx][maxy].propagate(playerId, 8, 0);

  return true;
};

// Search player tokens in this direction before finding an empty cell
Cell.prototype.search = function (player, direction) {
  if (this.state === player) return true;
  else if (this.state === 0) return false;
  else {
    // Propagate
    switch (direction) {
      case 1:
        if (this.y - 1 < 0) return false;
        return this.board.cell[this.x][this.y - 1].search(player, 1);
      case 2:
        if (this.x + 1 > this.board.cellColumns - 1) return false;
        return this.board.cell[this.x + 1][this.y].search(player, 2);
      case 3:
        if (this.y + 1 > this.board.cellRows - 1) return false;
        return this.board.cell[this.x][this.y + 1].search(player, 3);
      case 4:
        if (this.x - 1 < 0) return false;
        return this.board.cell[this.x - 1][this.y].search(player, 4);
      case 5:
        if (
          this.x + 1 > this.board.cellColumns - 1 ||
          this.y + 1 > this.board.cellRows - 1
        )
          return false;
        return board.cell[this.x + 1][this.y + 1].search(player, 5);
      case 6:
        if (this.x + 1 > this.board.cellColumns - 1 || this.y - 1 < 0)
          return false;
        return board.cell[this.x + 1][this.y - 1].search(player, 6);
      case 7:
        if (this.x - 1 < 0 || this.y - 1 < 0) return false;
        return this.board.cell[this.x - 1][this.y - 1].search(player, 7);
      case 8:
        if (this.x - 1 < 0 || this.y + 1 > this.board.cellRows - 1)
          return false;
        return this.board.cell[this.x - 1][this.y + 1].search(player, 8);
    }
  }
};

Cell.prototype.propagate = function (player, direction, step) {
  // Get enemy id
  var enemy = player === 2 ? 1 : 2;

  if (this.state === enemy) {
    // Change cell data
    this.state = player;

    // Animate it
    var scope = this;
    setTimeout(function () {
      sounds.stoneFlipping();
      scope.draw();
    }, 50 * step + 100);
    step++;

    // Propagate
    switch (direction) {
      case 1:
        if (this.y - 1 < 0) return;
        this.board.cell[this.x][this.y - 1].propagate(player, 1, step);
        break;
      case 2:
        if (this.x + 1 > this.board.cellColumns - 1) return;
        this.board.cell[this.x + 1][this.y].propagate(player, 2, step);
        break;
      case 3:
        if (this.y + 1 > this.board.cellRows - 1) return;
        this.board.cell[this.x][this.y + 1].propagate(player, 3, step);
        break;
      case 4:
        if (this.x - 1 < 0) return;
        this.board.cell[this.x - 1][this.y].propagate(player, 4, step);
        break;
      case 5:
        if (
          this.x + 1 > this.board.cellColumns - 1 ||
          this.y + 1 > board.cellRows - 1
        )
          return;
        return this.board.cell[this.x + 1][this.y + 1].propagate(
          player,
          5,
          step
        );
      case 6:
        if (this.x + 1 > this.board.cellColumns - 1 || this.y - 1 < 0) return;
        return this.board.cell[this.x + 1][this.y - 1].propagate(
          player,
          6,
          step
        );
      case 7:
        if (this.x - 1 < 0 || this.y - 1 < 0) return;
        return this.board.cell[this.x - 1][this.y - 1].propagate(
          player,
          7,
          step
        );
      case 8:
        if (this.x - 1 < 0 || this.y + 1 > board.cellRows - 1) return;
        return this.board.cell[this.x - 1][this.y + 1].propagate(
          player,
          8,
          step
        );
    }
  }
};

Cell.prototype.clone = function () {
  var newCell = new Cell();

  newCell.x = this.x;
  newCell.y = this.y;
  newCell.state = this.state;
  newCell.over = this.over;
  newCell.board = this.board;

  return newCell;
};
