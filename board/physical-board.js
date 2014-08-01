'use strict';
angular.module('chess')
.factory('PhysicalBoard', function(Pawn, Piece, Cell, Rook, King, Bishop, Queen, Knight) {
  function PhysicalBoard(strFEN) {
    this.boardMatrix = [];
    this.boardMatrix.get = function(coord) {
      return this[coord.x][coord.y];
    }
    this.initBoardMatrixFromFEN(strFEN);
  }
  
  PhysicalBoard.ROOK = 'R';
  PhysicalBoard.QUEEN = 'Q';
  PhysicalBoard.BISHOP = 'B';
  PhysicalBoard.PAWN = 'P';
  PhysicalBoard.KNIGHT = 'N';
  PhysicalBoard.KING = 'K';
  
  PhysicalBoard.prototype.initBoardMatrixFromFEN = function(strFEN) {
    var arrFen = strFEN.split('/');
    for(var lineIndex = 0; lineIndex < arrFen.length; lineIndex++) {
      var line = arrFen[lineIndex];
      this.boardMatrix[lineIndex] = [];
      var rowIndex = 0;
      for(var i = 0; i < line.length; i++) {
        var curChar = line[i];
        var color, coord, newPiece;
        coord = {
          x: lineIndex,
          y: rowIndex
        };
        if(!isNaN(curChar * 1)) { // if curChar is numeric
          for(var x = 0; x < (curChar * 1); x++) {
            coord = {
              x: lineIndex,
              y: rowIndex
            };
            this.boardMatrix[lineIndex][rowIndex] = new Cell(coord);
            rowIndex++;
          }
        } else {
          if(curChar === curChar.toUpperCase()) {
            color = Piece.WHITE;
          } else {
            color = Piece.BLACK;
          }
          curChar = curChar.toUpperCase();
          if(curChar === PhysicalBoard.PAWN) {
            newPiece = new Pawn(coord, color);
          } else if(curChar === PhysicalBoard.ROOK) {
            newPiece = new Rook(coord, color);
          } else if(curChar === PhysicalBoard.KING) {
            newPiece = new King(coord, color);
          } else if(curChar === PhysicalBoard.BISHOP) {
            newPiece = new Bishop(coord, color);
          } else if(curChar === PhysicalBoard.QUEEN) {
            newPiece = new Queen(coord, color);
          } else if(curChar === PhysicalBoard.KNIGHT) {
            newPiece = new Knight(coord, color);
          }
          this.boardMatrix[lineIndex][rowIndex] = new Cell(coord, newPiece);
          rowIndex++;
        }
      }
    }
  };
  
  PhysicalBoard.prototype.move = function(from, to) {
    this.getPiece(from);
  };
  
  PhysicalBoard.prototype.coordinatesPieceGoesOver = function(from, to) {
    var result = [];
    if(from.x === to.x) {
      for(var i = Math.min(from.y, to.y) + 1; i < Math.max(from.y, to.y); i++) {
        result.push({
          x: from.x,
          y: i
        });
      }
      return result;
    } else if(from.y === to.y) {
      for(i = Math.min(from.x, to.x) + 1; i < Math.max(from.x, to.x); i++) {
        result.push({
          x: i,
          y: from.y
        });
      }
      return result;
    } else if(Math.abs(from.x - to.x) !== Math.abs(from.y - to.y)) {
      return [];
    } else {
      i = from.x;
      var j = from.y;
      var xDirection = this.direction(from.x, to.x);
      var yDirection = this.direction(from.y, to.y);
      i += xDirection;
      j += yDirection;
      while(i != to.x && j != to.y) {
        result.push({
          x: i,
          y: j
        });
        i += xDirection;
        j += yDirection;
      }
      return result;
    }
  }
  PhysicalBoard.prototype.direction = function(a, b) {
    return((b - a) / Math.abs(b - a));
  }
  PhysicalBoard.prototype.promotePawn = function(figureChar) {
    var pieces = this.getPiecesArray();
    var pawnToPromote;
    var newPiece;
    for(var i = 0; i < pieces.length; i++) {
      if(pieces[i].promoteMe) {
        pawnToPromote = pieces[i];
      }
    }
    var coord = {
      x: pawnToPromote.x,
      y: pawnToPromote.y
    };
    var color = pawnToPromote.color;
    if(figureChar === PhysicalBoard.BISHOP) {
      newPiece = new Bishop(coord, color);
    } else if(figureChar === PhysicalBoard.ROOK) {
      newPiece = new Rook(coord, color);
    } else if(figureChar === PhysicalBoard.KNIGHT) {
      newPiece = new Knight(coord, color);
    } else if(figureChar === PhysicalBoard.QUEEN) {
      newPiece = new Queen(coord, color);
    }
    this.boardMatrix[coord.x][coord.y] = new Cell(coord, newPiece);
  };
  
  PhysicalBoard.prototype.removePiece = function(coord) {
    this.boardMatrix[coord.x][coord.y] = new Cell(coord);
  };
  
  PhysicalBoard.prototype.isEmpty = function(coord) {
    return this.boardMatrix.get(coord) === "undefined" || this.boardMatrix[coord.x][coord.y].isEmpty();
  };
  
  PhysicalBoard.prototype.getPiece = function(coord) {
    if(!this.boardMatrix[coord.x]){
      return false;
    }
    return this.boardMatrix[coord.x][coord.y].piece;
  };
  
  PhysicalBoard.prototype.setPiece = function(coord, piece) {
    this.boardMatrix[coord.x][coord.y] = new Cell(coord, piece);
  };
  
  PhysicalBoard.prototype.getMatrix = function() {
    return this.boardMatrix;
  };
  
  PhysicalBoard.prototype.getPiecesArray = function() {
    var result = [];
    for(var i = 0; i < this.boardMatrix.length; i++) {
      for(var j = 0; j < this.boardMatrix[i].length; j++) {
        if(this.boardMatrix[i][j].piece) {
          result.push(this.boardMatrix[i][j].piece);
        }
      }
    }
    return result;
  };
  
  return PhysicalBoard;
});