'use strict';


chessApp.controller('BoardCtrl',function($scope,Board){  
    window.MY_SCOPE = $scope;
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
          var boardScope = angular.element('#board_ctrl').scope();
          boardScope.board.promotePawn(Board.ROOK);          
          boardScope.$apply();
           $( this ).dialog( "close" );
        },
        Bishop:function(){
          var boardScope = angular.element('#board_ctrl').scope();
          boardScope.board.promotePawn(Board.BISHOP);          
          boardScope.$apply();
           $( this ).dialog( "close" );
        },
        Knight:function(){
          var boardScope = angular.element('#board_ctrl').scope();
          boardScope.board.promotePawn(Board.KNIGHT);          
          boardScope.$apply();           
           $( this ).dialog( "close" );
        },
        Queen:function(){
          var boardScope = angular.element('#board_ctrl').scope();
          boardScope.board.promotePawn(Board.QUEEN);          
          boardScope.$apply();
           $( this ).dialog( "close" );
        }

      }

    });
})

chessApp.factory('Board',function(Pawn,Piece,Cell,Rook,King,Bishop,Queen,Knight,Move){ 

  function Board(){            
    //this.initNewGame();    
    this.playerToMoveColor = Board.WHITE_TO_MOVE;
    this.canCastleKingSide = {};
    this.canCastleKingSide[Piece.WHITE] = true;
    this.canCastleKingSide[Piece.BLACK] = true;
    this.canCastleQueenSide = {};    
    this.canCastleQueenSide[Piece.WHITE] = true;
    this.canCastleQueenSide[Piece.BLACK] = true;
    this.boardMatrix = [];
    //this.readBoardMatrixFromFEN('r1b1kb1r/pppppppp/8/8/8/8/PPPPPPPP/R1B1KB1R');
    //this.readBoardMatrixFromFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
    this.readBoardMatrixFromFEN('rnbqkbnr/8/8/8/8/8/8/R3K2R');
    //this.readBoardMatrixFromFEN('rnbqkbnr/8/8/8/8/8/8/RNBQKBNR');
  }

  Board.WHITE_TO_MOVE = 1;
  Board.BLACK_TO_MOVE = -1;
  Board.ROOK = 'R';
  Board.QUEEN = 'Q';
  Board.BISHOP = 'B';
  Board.PAWN = 'P';
  Board.KNIGHT = 'N';
  Board.KING = 'K';



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
          if(curChar === Board.PAWN){
            newPiece = new Pawn(coord,color);
          }else if(curChar === Board.ROOK){
            newPiece = new Rook(coord,color);
          }else if(curChar === Board.KING){
            newPiece = new King(coord,color);
          }else if(curChar === Board.BISHOP){
            newPiece = new Bishop(coord,color);
          }else if(curChar === Board.QUEEN){
            newPiece = new Queen(coord,color);
          }else if(curChar === Board.KNIGHT){
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

  Board.prototype.isLegalMove = function(move){        
    var from = move.from;
    var to = move.to;    
    if(typeof this.boardMatrix[from.x][from.y] === "undefined" || typeof this.boardMatrix[from.x][from.y].piece === "undefined" ){
      return false;
    }  
    var movingPiece = move.piece;
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
    for(var i=0;i<coodrinatesOfCells.length;i++){
      var cell = coodrinatesOfCells[i];
      if(typeof this.boardMatrix[cell.x][cell.y].piece !== "undefined"){
        return false;
      }
    }
    if(movingPiece instanceof King && movingPiece.castle !== King.NO_CASTLE){
      return this.isCastleLegal(move);
    }
    return true;
  }

  Board.prototype.isCastleLegal = function(move){
    var king = move.piece;    
    if(king.castle === King.CASTLE_KING_SIDE && ( !this.canCastleKingSide[king.color] || !(this.boardMatrix[king.x][7].piece instanceof Rook) || this.boardMatrix[king.x][0].piece.color !== king.color ) ){
      return false;
    }
    if(king.castle === King.CASTLE_QUEEN_SIDE && ( !this.canCastleQueenSide[king.color] || !(this.boardMatrix[king.x][0].piece instanceof Rook) ||  this.boardMatrix[king.x][7].piece.color !== king.color ) ){
      return false;
    }
    this.togglePlayerToMoveColor();
    var kingUnderAttackNow = this.isKingUnderAttack(king.color);
    this.togglePlayerToMoveColor();
    var jumpingOver = undefined;
    if(king.castle === King.CASTLE_KING_SIDE){
      jumpingOver = {x:king.x,y:king.y+1};      
    }else if(king.castle === King.CASTLE_QUEEN_SIDE){
      jumpingOver = {x:king.x,y:king.y-1};      
    }
    var halfMove = new Move(move.from,jumpingOver,king);
    var jumpingOverFieldUnderAttack = this.isKingUnderAttackAfterMove(halfMove);
    if(kingUnderAttackNow || jumpingOverFieldUnderAttack){
      return false;
    }
    if(king.castle === King.CASTLE_QUEEN_SIDE){
      if(typeof this.boardMatrix[move.to.x][move.to.y-1].piece !== "undefined"){
        return false;
      }
    }
    return true;
  }

  Board.prototype.isKingUnderAttack = function(kingColor){
    var kingCoordinates = undefined;
    var attackingPieceColor = undefined;
    var pieces = this.getPiecesArray();
    for(var i=0;i<pieces.length;i++){      
      var piece = pieces[i];
      if(piece instanceof King && piece.color === kingColor){
        kingCoordinates = piece.getCoordinates();
        attackingPieceColor = piece.getOppositeColor();
      }
    }
    for(var i=0;i<pieces.length;i++){            
      var attackingPiece = pieces[i];
      if(attackingPiece.color === attackingPieceColor ){        
        var attackingMove = new Move(attackingPiece.getCoordinates(),kingCoordinates,attackingPiece);
        if(attackingPiece instanceof Pawn){
          if(attackingPiece.canTakeDirectly(kingCoordinates)){
            return  true;
          }
        }else if(this.isLegalMove(attackingMove)){
          return true;          
        }
      }
    }
    return false;     
  }

  Board.prototype.isKingUnderAttackAfterMove = function(move){
    var result = false;
    var from = move.from;
    var to = move.to;
    var moovingPiece = move.piece;        
    this.boardMatrix[from.x][from.y] = new Cell(from);    
    moovingPiece.move(to);
    var oldCellPiece = this.boardMatrix[to.x][to.y].piece;
    this.boardMatrix[to.x][to.y] = new Cell(to,moovingPiece);
    this.togglePlayerToMoveColor();    
    result = this.isKingUnderAttack(moovingPiece.color);    
    this.boardMatrix[to.x][to.y] = new Cell(to,oldCellPiece);    
    moovingPiece.move(from);
    this.boardMatrix[from.x][from.y] = new Cell(from,moovingPiece);
    this.togglePlayerToMoveColor();    
    return result;
  }

  Board.prototype.togglePlayerToMoveColor = function(){  
      this.playerToMoveColor *= -1; 
  }

  Board.prototype.move = function(piece,from,to){    
    this.removeCanBeTakenEnPassantProperty(piece.color);    
    this.boardMatrix[from.x][from.y] = new Cell(from);
    piece.move(to);
    this.boardMatrix[to.x][to.y] = new Cell(to,piece);
    this.togglePlayerToMoveColor();
    if(piece.intendToTakeEnPassant){
      this.removeEnPassantPiece(piece);      
    }    
    if(piece instanceof King && piece.castle !== King.NO_CASTLE){
      this.completeCastle(piece);
    }
    if(piece instanceof Rook || piece instanceof King){
      this.changeCastleStatus(piece);
    }
  }

  Board.prototype.changeCastleStatus = function(piece){
    if(piece instanceof King){
      this.canCastleQueenSide[piece.color] = false;
      this.canCastleKingSide[piece.color] = false;
    }else if(piece instanceof Rook){
      var x = undefined;
      if(piece.color === Piece.BLACK){
        x = 7;
      }else if(piece.color === Piece.WHITE){
        x = 0;
      }
      if( !(this.boardMatrix[x][0].piece instanceof Rook) ){
        this.canCastleQueenSide[piece.color] = false;
      }
      if( !(this.boardMatrix[x][7].piece instanceof Rook) ){
        this.canCastleKingSide[piece.color] = false;
      }
    }
  }

  Board.prototype.completeCastle = function(piece){    
    var oldRookCoord = undefined;
    var newRookCoord = undefined;
    if(piece.castle === King.CASTLE_KING_SIDE){
      oldRookCoord = {x:piece.x,y:7};      
      newRookCoord = {x:piece.x,y:5};
    }else if(piece.castle === King.CASTLE_QUEEN_SIDE){
      oldRookCoord = {x:piece.x,y:0};      
      newRookCoord = {x:piece.x,y:3};
    }    
    var movingRook = this.boardMatrix[oldRookCoord.x][oldRookCoord.y].piece;  
    this.boardMatrix[oldRookCoord.x][oldRookCoord.y] = new Cell(oldRookCoord);
    movingRook.move(newRookCoord);
    this.boardMatrix[newRookCoord.x][newRookCoord.y] = new Cell(newRookCoord,movingRook);    
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

  Board.prototype.getPiecesArray = function(){
    var result = [];
    for(var i = 0; i<this.boardMatrix.length;i++){
      for(var j=0;j<this.boardMatrix[i].length;j++){
        if(this.boardMatrix[i][j].piece){
          result.push(this.boardMatrix[i][j].piece);
        }
      }
    }
    return result;
  }

  Board.prototype.promotePawn = function(figureChar){
    var pieces = this.getPiecesArray();
    var pawnToPromote = undefined;
    var newPiece = undefined;
    for(var i=0;i<pieces.length;i++){
      if(pieces[i].promoteMe){
        pawnToPromote = pieces[i];
      }
    }
    var coord = {x:pawnToPromote.x,y:pawnToPromote.y};
    var color = pawnToPromote.color;
    if(figureChar === Board.BISHOP){
      newPiece = new Bishop(coord,color);
    }else if(figureChar === Board.ROOK){
      newPiece = new Rook(coord,color);
    }else if(figureChar === Board.KNIGHT){
      newPiece = new Knight(coord,color);
    }else if(figureChar === Board.QUEEN){
      newPiece = new Queen(coord,color);
    }
    this.boardMatrix[coord.x][coord.y] = new Cell(coord,newPiece);
  }

  return Board;
});
