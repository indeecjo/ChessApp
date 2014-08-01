/* global angular:false*/
(function () {
  'use strict';
  angular.module('chess').factory('King', function (Piece) {
    function King(coord, color) {
      Piece.apply(this, arguments);
      this.castle = King.CastleStatus.NO_CASTLE;
    }

    King.CastleStatus = Object.freeze( {
      NO_CASTLE : 'NO_CASTLE',
      CASTLE_KING_SIDE : 'CASTLE_KING_SIDE',
      CASTLE_QUEEN_SIDE : 'CASTLE_QUEEN_SIDE'
    });
    
    King.prototype = Object.create(Piece.prototype);
    King.prototype.constructor = King;
    
    King.prototype.getUnicodeChar = function () {
      if(this.color == Piece.WHITE) {
        return '\u2654';
      } else if(this.color == Piece.BLACK) {
        return '\u265A';
      }
    };

     /**
      * @param <Object> newCoord destination coorinates
      * @return <Boolean> is legal move
      **/
    King.prototype.isLegalMove = function (newCoord) {
      if(Math.abs(this.x - newCoord.x) <= 1 && Math.abs(this.y - newCoord.y) <= 1) {
        this.castle = King.CastleStatus.NO_CASTLE;
        return true;
      } else if(this.x === newCoord.x && this.y - newCoord.y === -2) {
        this.castle = King.CastleStatus.CASTLE_KING_SIDE;
        return true;
      } else if(this.x === newCoord.x && this.y - newCoord.y === 2) {
        this.castle = King.CastleStatus.CASTLE_QUEEN_SIDE;
        return true;
      } else {
        return false;
      }
    };
    return King;
  });
})();