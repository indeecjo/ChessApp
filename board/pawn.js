chessApp.factory('Pawn', function(Piece){
  function Pawn(coord,color){
      Piece.apply(this,arguments);
      this.canBeTakenEnPassant = false;
  }

  Pawn.prototype = Object.create(Piece.prototype);
  Pawn.prototype.constructor = Pawn;
  
  Pawn.prototype.getUnicodeChar =  function(){
      if(this.color ==  Piece.WHITE){
        return '\u2659';
      }else if(this.color == Piece.BLACK){
        return '\u265F';
      }
  }

  Pawn.prototype.isLegalMove = function(newCoord,board){ 
    if(this.canMoveOnly(newCoord) && typeof board[newCoord.x][newCoord.y].piece === "undefined"){
      return true;
    }
    if(this.canTakeDirectly(newCoord)){
      if(typeof board[newCoord.x][newCoord.y].piece !== "undefined"){
        return true;
      }
    }
    if(this.canTakeEnPassant(newCoord,board)){
      this.intendToTakeEnPassant = true;
      return true;
    }
    return false;
  }  

  Pawn.prototype.canTakeDirectly = function(newCoord){
    if(newCoord.y === this.y+1 || newCoord.y === this.y-1){
      if(this.color == Piece.BLACK ){
        if(newCoord.x == this.x+1){          
          return true;
        }
      }
      if(this.color == Piece.WHITE ){
        if(newCoord.x == this.x-1){
          return true;
        }
      }
    }
  }

  Pawn.prototype.canMoveOnly = function(newCoord){
    var newX = newCoord.x;
    var newY = newCoord.y;    
    if(newY == this.y){      
      if(this.color == Piece.BLACK ){
        if(newX == this.x+1){
          return true;
        }
        if(newX == this.x+2 && this.x == 1){
          return true; 
        }
      }
      if(this.color == Piece.WHITE ){        
        if(newX == this.x-1){
          return true;
        }
        if(newX == this.x-2 && this.x == 6){
          return true; 
        }
      }
    }    
    return false;  
  }

  Pawn.prototype.canTakeEnPassant = function(newCoord,board){        
    var takenPiece;
    if(newCoord.y === this.y+1 || newCoord.y === this.y-1){      
      if(this.color == Piece.BLACK ){
        if(typeof board[newCoord.x-1] !== "undefined"){
          return this.canTakePieceEnPassant(board[newCoord.x-1][newCoord.y].piece);        
        }
      }
      if(this.color == Piece.WHITE ){     
        if(typeof board[newCoord.x+1] !== "undefined"){          
          return this.canTakePieceEnPassant(board[newCoord.x+1][newCoord.y].piece);        
        }
      }      
    }
    return false;
  }

  Pawn.prototype.canTakePieceEnPassant = function(takenPiece){
    if(typeof takenPiece !== "undefined"){          
      if(takenPiece.x === this.x){
        if(typeof takenPiece.canBeTakenEnPassant !== "undefined"){
          return takenPiece.canBeTakenEnPassant;
        }
      }
    } 
    return false;
  }



  Pawn.prototype.move = function(newCoord){                
      if(Math.abs(this.x - newCoord.x) > 1){        
        this.canBeTakenEnPassant = true;
      }else{
        this.canBeTakenEnPassant = false;
      }
      if((this.color === Piece.WHITE && newCoord.x === 0) || (this.color === Piece.BLACK && newCoord.x === 7)){
        this.promoteMe = true;
      }
      this.x = newCoord.x;
      this.y = newCoord.y;      
  }
  

  return Pawn;
});

