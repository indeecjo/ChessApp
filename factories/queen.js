/* global angular:false*/
(function () {
  'use strict';
  angular.module('chess').factory('Queen', function (Piece) {
    function Queen(coord, color) {
      Piece.apply(this, arguments);
    }
    Queen.prototype = Object.create(Piece.prototype);
    Queen.prototype.constructor = Queen;
    Queen.prototype.getUnicodeChar = function () {
      /* if(this.color == Piece.Color.WHITE){
      return '\u2655';
    }else if(this.color == Piece.Color.BLACK){
      return '\u265B';
    }*/
    };

    /**
      * @param <Object> newCoord destination coorinates
      * @return <Boolean> is legal move
      **/
    Queen.prototype.isLegalMove = function (newCoord) {
      if(this.x === newCoord.x || this.y === newCoord.y || Math.abs(this.x - newCoord.x) === Math.abs(this.y - newCoord.y)) {
        return true;
      } else {
        return false;
      }
    };
    return Queen;
  });
})();