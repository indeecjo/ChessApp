'use strict';

chessApp.factory('Board',function(Pawn,Piece,Cell,Rook,King,Bishop,Queen,Knight){ 

  function Board(){            
    //this.initNewGame();    
    this.playerToMoveColor = Board.WHITE_TO_MOVE;
    this.blackCanCastleKingSide = true;
    this.blackCanCastleQueenSide = true;
    this.whiteCanCastleKingSide = true;
    this.whiteCanCastleQueenSide = true;
    this.boardMatrix = [];
    //this.readBoardMatrixFromFEN('r1b1kb1r/pppppppp/8/8/8/8/PPPPPPPP/R1B1KB1R');
    this.readBoardMatrixFromFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
  }

  Board.WHITE_TO_MOVE = 1;
  Board.BLACK_TO_MOVE = -1;



  Board.prototype.readBoardMatrixFromFEN = function(strFen){
    this.boardMatrix = [];
    var arrFen = strFen.split('/');
    for(var lineIndex=0; lineIndex < arrFen.length; lineIndex++){
      var line = arrFen[lineIndex];
      this.boardMatrix[lineIndex] = [];
      var rowIndex = 0;
      for(var i=0;i<line.length;i++){
        var curChar = line[i];
        var color,coord,newCell,newPiece = undefined;                
        coord = {x:lineIndex,y:rowIndex};
        if (!isNaN(curChar * 1)){ // if curChar is numeric
          for(var x=0;x < (curChar*1);x++){
            coord = {x:lineIndex,y:rowIndex};
            this.boardMatrix[lineIndex][rowIndex] = new Cell(coord);
            rowIndex++;
          }
        }
        else{
          if(curChar === curChar.toUpperCase()){
            color = Piece.WHITE;
          }else{
            color = Piece.BLACK;
          }
          curChar = curChar.toUpperCase();
          if(curChar === 'P'){
            newPiece = new Pawn(coord,color);
          }else if(curChar === 'R'){
            newPiece = new Rook(coord,color);
          }else if(curChar === 'K'){
            newPiece = new King(coord,color);
          }else if(curChar === 'B'){
            newPiece = new Bishop(coord,color);
          }else if(curChar === 'Q'){
            newPiece = new Queen(coord,color);
          }else if(curChar === 'N'){
            newPiece = new Knight(coord,color);
          }
          this.boardMatrix[lineIndex][rowIndex] = new Cell(coord,newPiece);
          rowIndex++;
        }       
      }
    }
  }

  Board.prototype.coordinatesPieceGoesOver = function(from,to){    
    var result = [];
    if(from.x === to.x){
      for(var i = Math.min(from.y,to.y) + 1; i < Math.max(from.y,to.y); i++){
        result.push({x:from.x,y:i});        
      }
      return result;
    }
    else if(from.y === to.y){
      for(var i = Math.min(from.x,to.x) + 1; i < Math.max(from.x,to.x); i++){
        result.push({x:i,y:from.y});        
      }
      return result;
    }
    else if(Math.abs(from.x - to.x) !== Math.abs(from.y - to.y)){
      return [];
    }else{
      debugger;
      var i = from.x;
      var j = from.y;
      var xDirection = this.direction(from.x,to.x);
      var yDirection = this.direction(from.y,to.y);
      i += xDirection;
      j += yDirection;
      while(i != to.x && j != to.y){
        result.push({x:i,y:j});
        i += xDirection;
        j += yDirection;
      }
      return result;
    }
  }

  Board.prototype.direction = function(a,b){
    return ( (b-a) / Math.abs(b-a) ) ;
  }

  Board.prototype.isLegalMove = function(from,to){        
    if(typeof this.boardMatrix[from.x][from.y] === "undefined" || typeof this.boardMatrix[from.x][from.y].piece === "undefined" ){
      return false;
    }  
    var movingPiece = this.boardMatrix[from.x][from.y].piece;    
    if((movingPiece.color === Piece.WHITE && this.playerToMoveColor === Board.BLACK_TO_MOVE )|| (movingPiece.color === Piece.BLACK && this.playerToMoveColor === Board.WHITE_TO_MOVE) ){
      return false;      
    }
    var takenPiece = this.boardMatrix[to.x][to.y].piece;
    if(typeof takenPiece !== "undefined"){
      if(takenPiece.color === movingPiece.color){
        return false;
      }
    }    
    if(movingPiece.isLegalMove(to,this.boardMatrix) == false){
      return false;
    }
    var coodrinatesOfCells = this.coordinatesPieceGoesOver(from,to);
    var that = this;
    var allCellsFree = true;
    angular.forEach(coodrinatesOfCells,function(cell){
      if(typeof that.boardMatrix[cell.x][cell.y].piece !== "undefined"){
        allCellsFree = false;
      }
    });
    return allCellsFree;
    return true;
  }

  Board.prototype.move = function(piece,from,to){
    this.removeCanBeTakenEnPassantProperty(piece.color);
    this.playerToMoveColor *= -1; // SWITCH COLOR 
    this.boardMatrix[from.x][from.y] = new Cell(from);    
    piece.move(to);
    this.boardMatrix[to.x][to.y] = new Cell(to,piece);
    if(piece.intendToTakeEnPassant){
      this.removeEnPassantPiece(piece);      
    }
  }

  Board.prototype.removeCanBeTakenEnPassantProperty = function(movingPieceColor){
    for(var i=0;i<8;i++){
      for(var j=0;j<8;j++){
        var piece = this.boardMatrix[i][j].piece;
        if(typeof piece !== "undefined"){
          if(piece.color !== movingPieceColor){
            piece.canBeTakenEnPassant = false;            
          }
        }
      }
    }
  }

  Board.prototype.removeEnPassantPiece = function(movedPiece){
    var newCoord;
    if(movedPiece.color === Piece.WHITE){
      newCoord = {x:movedPiece.x+1,y:movedPiece.y};        
    }else{
      newCoord = {x:movedPiece.x-1,y:movedPiece.y};        
    }
    this.boardMatrix[newCoord.x][newCoord.y] = new Cell(newCoord);
  }  

  return Board;
});

chessApp.controller('BoardCtrl',function($scope,Board){  
    $scope.board = new Board();  
    $('#promoteDialog').dialog({
      draggable:false,
      resizable:false,
      closeOnEscape:false,
      modal: true,
      autoOpen: false,
      show: {
        effect: "blind",
        duration: 1000
      },
      hide: {
        effect: "explode",
        duration: 1000
      },
      buttons:{
        Rook:function(){
           $( this ).dialog( "close" );
        },
        Bishop:function(){
           $( this ).dialog( "close" );
        },
        Knight:function(){
           $( this ).dialog( "close" );
        },
        Queen:function(){
           $( this ).dialog( "close" );
        }

      }

    });
})
