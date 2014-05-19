'use strict';

chessApp.factory('Cell',function(){
  function Cell(coord,piece){    
    this.x = coord.x;
    this.y = coord.y;
    this.piece = piece;
  }

 Cell.prototype.toString = function(){
  if(piece){
    return piece.getUnicodeChar();
  }
  return x + ':' + y;
 }

  return Cell;
});



chessApp.directive('cell', function(Cell,Move) {
  return {
      restrict: 'AE',      
      link: function(scope,element,attrs){          
          var cellCoord = { x:scope.cell.x,
                    y:scope.cell.y};          
          element.droppable({ 
              greedy:true ,           
              cursor: 'auto',
              accept:function(obj){                 
                if(typeof obj.context.pieceObj === "undefined"){
                  return false;
                }
                var from = {x:obj.context.pieceObj.x ,y:obj.context.pieceObj.y};
                var to = cellCoord;
                var movingPiece = obj.context.pieceObj;
                var move = new Move(from,to,movingPiece);
                if(scope.board.isLegalMove(move) ){
                  if(!scope.board.isKingUnderAttackAfterMove(move)){
                    return true;
                  }
                }
                return false;
              },
              drop:function(event,ui) {                
                var piece = ui.draggable.context.pieceObj;                
                var oldCoord = {x:piece.x,y:piece.y};                
                scope.board.move(piece,oldCoord,cellCoord);                                
                if(piece.promoteMe){
                  $( "#promoteDialog" ).dialog("open");
                  $('.ui-dialog-titlebar button').hide();                  
                }
                scope.$apply();                             
              }
          });
        }
  }
});
