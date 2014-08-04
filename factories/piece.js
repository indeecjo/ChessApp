/* global angular:false*/
(function () {
  'use strict';
  angular.module('chess').factory('Piece', function () {
    function Piece(coord, color) {
      this.x = coord.x;
      this.y = coord.y;
      this.color = color;
    }
    Piece.prototype.move = function (newCoord) {
      this.x = newCoord.x;
      this.y = newCoord.y;
    };
    Piece.prototype.getCoordinates = function () {
      return {
        x: this.x,
        y: this.y
      };
    };
    Piece.prototype.getOppositeColor = function () {
      if(this.color === Piece.Color.WHITE) {
        return Piece.Color.BLACK;
      }
      if(this.color === Piece.Color.BLACK) {
        return Piece.Color.WHITE;
      }
    };
    Piece.Color = Object.freeze({
      WHITE : 'white',
      BLACK : 'black'  
    });    
    return Piece;
  });
})();