'use strict';

chessApp.factory('Rook', function(Piece){
  function Rook(coord,color){
    Piece.apply(this,arguments);      
  }

  Rook.prototype = Object.create(Piece.prototype);

  Rook.prototype.getUnicodeChar = function(){
    if(this.color == Piece.WHITE){
      return '\u2656';
    }else if(this.color == Piece.BLACK){
      return '\u265C';
    }
  }

  Rook.prototype.isLegalMove = function(newCoord){
    if(this.x === newCoord.x || this.y === newCoord.y){
      return true;
    }else{
      return false;
    }
  }


 return Rook;
});