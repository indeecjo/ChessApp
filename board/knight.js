'use strict';

chessApp.factory('Knight', function(Piece){
  function Knight(coord,color){
    Piece.apply(this,arguments);      
  }

  Knight.prototype = Object.create(Piece.prototype);

  Knight.prototype.getUnicodeChar = function(){
    if(this.color == Piece.WHITE){
      return '\u2658';
    }else if(this.color == Piece.BLACK){
      return '\u265E';
    }        
  }

  Knight.prototype.isLegalMove = function(newCoord){
    if((Math.abs(this.x-newCoord.x ) == 1 && Math.abs(this.y-newCoord.y) == 2 )|| (Math.abs(this.x-newCoord.x ) == 2 && Math.abs(this.y-newCoord.y) == 1 )){
      return true;
    }else{
      return false;
    }
  }


 return Knight;
});