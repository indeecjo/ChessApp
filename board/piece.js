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

  Piece.prototype.getCoordinates = function(){
    return {x:this.x,y: this.y};
  }

  Piece.prototype.getOppositeColor = function(){
    if(this.color === Piece.WHITE){
      return Piece.BLACK;
    }
    if(this.color === Piece.BLACK){
      return Piece.WHITE;
    }
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
        //element.html(piece.getUnicodeChar());        
        element.prop('pieceObj',piece);        
        element.addClass(piece.color + '-' + piece.constructor.name.toLowerCase());
        element.draggable({
          containment: "#chess_board",
          revert:"invalid",
          cursor: "pointer"
        });      
      }
    }
  }
});