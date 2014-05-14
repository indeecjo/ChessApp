'use strict';

var chessApp = angular.module('chess',[]);


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

chessApp.directive('cell', function(Cell) {
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
                if(scope.board.isLegalMove(from,to)){
                  return true;
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