'use strict';
chessApp.factory('King', function(Piece) {
  function King(coord, color) {
    Piece.apply(this, arguments);
    this.castle = King.NO_CASTLE; 
  }
  King.NO_CASTLE = 0;
  King.CASTLE_KING_SIDE = 1;
  King.CASTLE_QUEEN_SIDE = 2;
  King.prototype = Object.create(Piece.prototype);
  King.prototype.constructor = King;
  King.prototype.getUnicodeChar = function() {
    if(this.color == Piece.WHITE) {
      return '\u2654';
    } else if(this.color == Piece.BLACK) {
      return '\u265A';
    }
  }
  King.prototype.isLegalMove = function(newCoord) {
    if(Math.abs(this.x - newCoord.x) <= 1 && Math.abs(this.y - newCoord.y) <= 1) {
      this.castle = King.NO_CASTLE;
      return true;
    } else if(this.x === newCoord.x && this.y - newCoord.y === -2) {
      this.castle = King.CASTLE_KING_SIDE;
      return true;
    } else if(this.x === newCoord.x && this.y - newCoord.y === 2) {
      this.castle = King.CASTLE_QUEEN_SIDE;
      return true;
    } else {
      return false;
    }
  }
  return King;
});