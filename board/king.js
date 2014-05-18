'use strict';

chessApp.factory('King', function(Piece){
  function King(coord,color){
    Piece.apply(this,arguments);      
  }

  King.prototype = Object.create(Piece.prototype);
  King.prototype.constructor = King;

  King.prototype.getUnicodeChar= function(){
    if(this.color == Piece.WHITE){
      return '\u2654';
    }else if(this.color == Piece.BLACK){
      return '\u265A';
    }
  }



  King.prototype.isLegalMove = function(newCoord){
    if(Math.abs(this.x - newCoord.x) <= 1 && Math.abs(this.y - newCoord.y) <= 1){
      return true;
    }else{
      return false;
    }
  }


 return King;
});


