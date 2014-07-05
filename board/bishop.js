'use strict';
chessApp.factory('Bishop', function(Piece) {
  function Bishop(coord, color) {
    Piece.apply(this, arguments);
  }
  Bishop.prototype = Object.create(Piece.prototype);
  Bishop.prototype.constructor = Bishop;
  Bishop.prototype.getUnicodeChar = function() {
   if(this.color == Piece.WHITE) {
      return '\u2657';
    } else if(this.color == Piece.BLACK) {
      return '\u265D';
    }
  }
  Bishop.prototype.isLegalMove = function(newCoord) {
    var xDist = Math.abs(this.x - newCoord.x);
    var yDist = Math.abs(this.y - newCoord.y);
    return(xDist === yDist);
  }
  Bishop.prototype.direction = function(a, b) {
    return((a - b) / Math.abs(a - b));
  }
  return Bishop;
});