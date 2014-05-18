'use strict';

chessApp.factory('Piece',function(){
  function Piece(coord,color){    
    this.x = coord.x;
    this.y = coord.y;
    this.color = color;
  }

  Piece.prototype.move = function(newCoord){
    this.x = newCoord.x;
    this.y = newCoord.y;
  }

  Piece.WHITE = 'white';
  Piece.BLACK = 'black';

  return Piece;
});


chessApp.directive('piece', function() {
  return {    
    restrict: 'AE',    
    link: function(scope, element, attr) {
      var piece  = scope.cell.piece;      
      if(typeof piece !== "undefined"){      
        element.html(piece.getUnicodeChar());        
        element.prop('pieceObj',piece);
        element.draggable({
          containment: "#chess_board",
          revert:"invalid",
          cursor: "pointer"
        });      
      }
    }
  }
});


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

chessApp.factory('Bishop', function(Piece){
  function Bishop(coord,color){
    Piece.apply(this,arguments);      
  }

  Bishop.prototype = Object.create(Piece.prototype);

  Bishop.prototype.getUnicodeChar= function(){
    if(this.color == Piece.WHITE){
      return '\u2657';
    }else if(this.color == Piece.BLACK){
      return '\u265D';
    }
  }

  Bishop.prototype.isLegalMove = function(newCoord){
    var xDist = Math.abs(this.x - newCoord.x);
    var yDist = Math.abs(this.y - newCoord.y);
    return (xDist === yDist);
  }

   Bishop.prototype.direction = function(a,b){
    return ( (a-b) / Math.abs(a-b) ) ;
  }

 return Bishop;
});

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

chessApp.factory('Queen', function(Piece){
  function Queen(coord,color){
    Piece.apply(this,arguments);      
  }

  Queen.prototype = Object.create(Piece.prototype);

  Queen.prototype.getUnicodeChar = function(){
    if(this.color == Piece.WHITE){
      return '\u2655';
    }else if(this.color == Piece.BLACK){
      return '\u265B';
    }    
  }

  Queen.prototype.isLegalMove = function(newCoord){
    if(this.x === newCoord.x || this.y === newCoord.y || Math.abs(this.x - newCoord.x) === Math.abs(this.y - newCoord.y)){
      return true;
    }else{
      return false;
    }
  }


 return Queen;
});

chessApp.factory('King', function(Piece){
  function King(coord,color){
    Piece.apply(this,arguments);      
  }

  King.prototype = Object.create(Piece.prototype);

  King.prototype.getUnicodeChar= function(){
    if(this.color == Piece.WHITE){
      return '\u2654';
    }else if(this.color == Piece.BLACK){
      return '\u265A';
    }
  }

  King.prototype.isLegalMove = function(newCoord){
    if(this.x - newCoord.x <= 1 && this.y - newCoord.y <= 1){
      return true;
    }else{
      return false;
    }
  }


 return King;
});



