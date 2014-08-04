/* global: angular:false*/
(function () {
  'use strict';
  angular.module('chess').factory('Rook', function (Piece) {
    function Rook(coord, color) {
      Piece.apply(this, arguments);
    }
    Rook.prototype = Object.create(Piece.prototype);
    Rook.prototype.constructor = Rook;
    Rook.prototype.getUnicodeChar = function () {
      /* if(this.color == Piece.Color.WHITE){
      return '\u2656';
    }else if(this.color == Piece.Color.BLACK){
      return '\u265C';
    }*/
    };

    /**
      * @param <Object> newCoord destination coorinates
      * @return <Boolean> is legal move
      **/
    Rook.prototype.isLegalMove = function (newCoord) {
      if(this.x === newCoord.x || this.y === newCoord.y) {
        return true;
      } else {
        return false;
      }
    };
    return Rook;
  });
})();