/* global angular:false*/
(function () {
  'use strict';
  angular.module('chess').factory('Board', function (Pawn, Piece, Cell, Rook, King, Bishop, Queen, Knight, Move, PhysicalBoard) {
    function Board() {
      this.playerToMoveColor = Board.WHITE_TO_MOVE;
      this.canCastleKingSide = {};
      this.canCastleKingSide[Piece.WHITE] = true;
      this.canCastleKingSide[Piece.BLACK] = true;
      this.canCastleQueenSide = {};
      this.canCastleQueenSide[Piece.WHITE] = true;
      this.canCastleQueenSide[Piece.BLACK] = true;
      this.halfMovesSinceCaptureOrPawnAdvance = 0;
      this.moveNumber = 0;
      this.physicalBoard = new PhysicalBoard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
      //this.physicalBoard = new PhysicalBoard('rnbqkbn1/pppppppP/8/8/8/8/PPPPPPPp/RNBQKBN1');    
      //this.physicalBoard = new PhysicalBoard('8/p7/P7/8/8/8/8/8');
    }
    Board.WHITE_TO_MOVE = Piece.WHITE;
    Board.BLACK_TO_MOVE = Piece.BLACK;
    Board.prototype.initGameStateFromFEN = function (strFEN) {
      var splitedValues = strFEN.split(' ');
      this.initBoardMatrixFromFEN(splitedValues[0]);
      this.initPlayerToMoveFromFEN(splitedValues[1]);
      this.initCanCastleFromFEN(splitedValues[2]);
      this.initCanTakeEnPassant(splitedValues[3]);
      this.initNumberOfHalfMoves(splitedValues[4]);
      this.initMoveNumber(splitedValues[5]);
    };
    Board.prototype.initPlayerToMoveFromFEN = function (char) {
      if(char === 'w') {
        this.playerToMoveColor = Board.WHITE_TO_MOVE;
      } else if(char === 'b') {
        this.playerToMoveColor = Board.BLACK_TO_MOVE;
      }
    };
    Board.prototype.initCanCastleFromFEN = function (canCastleStr) {
      this.canCastleKingSide[Piece.WHITE] = canCastleStr.contains('K');
      this.canCastleKingSide[Piece.BLACK] = canCastleStr.contains('k');
      this.canCastleQueenSide[Piece.WHITE] = canCastleStr.contains('Q');
      this.canCastleQueenSide[Piece.BLACK] = canCastleStr.contains('q');
    };
    Board.prototype.initNumberOfHalfMoves = function (numOfMoves) {
      this.halfMovesSinceCaptureOrPawnAdvance = parseInt(numOfMoves, 10);
    };
    Board.prototype.initMoveNumber = function (moveNumber) {
      this.moveNumber = parseInt(moveNumber, 10);
    };
    Board.prototype.isLegalMove = function (move) {
      var from = move.from;
      var to = move.to;
      if(this.physicalBoard.isEmpty(from)) {
        return false;
      }
      var movingPiece = move.piece;
      if((movingPiece.color === Piece.WHITE && this.playerToMoveColor === Board.BLACK_TO_MOVE) || (movingPiece.color === Piece.BLACK && this.playerToMoveColor === Board.WHITE_TO_MOVE)) {
        return false;
      }
      var takenPiece = this.physicalBoard.getPiece(to);
      if(takenPiece !== undefined) {
        if(takenPiece.color === movingPiece.color) {
          return false;
        }
      }
      var takenEnPassantPiece;
      if(movingPiece.color === Piece.WHITE) {
        takenEnPassantPiece = this.physicalBoard.getPiece({
          x: to.x + 1,
          y: to.y
        });
      } else if(movingPiece.color === Piece.BLACK) {
        takenEnPassantPiece = this.physicalBoard.getPiece({
          x: to.x - 1,
          y: to.y
        });
      }
      if(!movingPiece.isLegalMove(to, this.physicalBoard.isEmpty(to), takenEnPassantPiece)) {
        return false;
      }
      var coodrinatesOfCells = this.physicalBoard.coordinatesPieceGoesOver(from, to);
      for(var i = 0; i < coodrinatesOfCells.length; i++) {
        var coord = coodrinatesOfCells[i];
        if(!this.physicalBoard.isEmpty(coord)) {
          return false;
        }
      }
      if(movingPiece instanceof King && movingPiece.castle !== King.NO_CASTLE) {
        return this.isCastleLegal(move);
      }
      return true;
    };
    Board.prototype.isCastleLegal = function (move) {
      var king = move.piece;
      var rook;
      if(typeof king === "undefined") {
        return false;
      }
      if(king.castle === King.CASTLE_KING_SIDE && !this.canCastleKingSide[king.color]) {
        return false;
      }
      if(king.castle === King.CASTLE_QUEEN_SIDE && !this.canCastleQueenSide[king.color]) {
        return false;
      }
      this.togglePlayerToMoveColor();
      var kingUnderAttackNow = this.isKingUnderAttack(king.color);
      this.togglePlayerToMoveColor();
      var jumpingOver;
      if(king.castle === King.CASTLE_KING_SIDE) {
        jumpingOver = {
          x: king.x,
          y: king.y + 1
        };
      } else if(king.castle === King.CASTLE_QUEEN_SIDE) {
        jumpingOver = {
          x: king.x,
          y: king.y - 1
        };
      }
      var halfMove = new Move(move.from, jumpingOver, king);
      var jumpingOverFieldUnderAttack = this.isKingUnderAttackAfterMove(halfMove);
      if(kingUnderAttackNow || jumpingOverFieldUnderAttack) {
        return false;
      }
      if(king.castle === King.CASTLE_QUEEN_SIDE) {
        if(this.physicalBoard.isEmpty({
          x: move.to.x,
          y: move.to.y - 1
        })) {
          return false;
        }
      }
      return true;
    };
    Board.prototype.isKingUnderAttack = function (kingColor) {
      var kingCoordinates;
      var attackingPieceColor;
      var pieces = this.physicalBoard.getPiecesArray();
      var i;
      for(i = 0; i < pieces.length; i++) {
        var piece = pieces[i];
        if(piece instanceof King && piece.color === kingColor) {
          kingCoordinates = piece.getCoordinates();
          attackingPieceColor = piece.getOppositeColor();
        }
      }
      for(i = 0; i < pieces.length; i++) {
        var attackingPiece = pieces[i];
        if(attackingPiece.color === attackingPieceColor) {
          var attackingMove = new Move(attackingPiece.getCoordinates(), kingCoordinates, attackingPiece);
          if(attackingPiece instanceof Pawn) {
            if(attackingPiece.canTakeDirectly(kingCoordinates)) {
              return true;
            }
          } else if(this.isLegalMove(attackingMove)) {
            return true;
          }
        }
      }
      return false;
    };
    Board.prototype.isCheck = function () {
      var currentlyPlayingSideKing = this.playerToMoveColor;
      this.togglePlayerToMoveColor();
      var result = this.isKingUnderAttack(currentlyPlayingSideKing);
      this.togglePlayerToMoveColor();
      return result;
    };
    Board.prototype.isKingUnderAttackAfterMove = function (move) {
      var result = false;
      var from = move.from;
      var to = move.to;
      var moovingPiece = move.piece;
      this.physicalBoard.removePiece(from);
      moovingPiece.move(to);
      var oldCellPiece = this.physicalBoard.getPiece(to);
      this.physicalBoard.setPiece(to, moovingPiece);
      this.togglePlayerToMoveColor();
      result = this.isKingUnderAttack(moovingPiece.color);
      this.physicalBoard.setPiece(to, oldCellPiece);
      moovingPiece.move(from);
      this.physicalBoard.setPiece(from, moovingPiece);
      this.togglePlayerToMoveColor();
      return result;
    };
    Board.prototype.togglePlayerToMoveColor = function () {
      if(this.playerToMoveColor == Board.WHITE_TO_MOVE) {
        this.playerToMoveColor = Board.BLACK_TO_MOVE;
      } else {
        this.playerToMoveColor = Board.WHITE_TO_MOVE;
      }
    };
    Board.prototype.move = function (piece, from, to) {
      this.removeCanBeTakenEnPassantProperty(piece.color);
      this.physicalBoard.removePiece(from);
      piece.move(to);
      this.physicalBoard.setPiece(to, piece);
      this.togglePlayerToMoveColor();
      if(piece.intendToTakeEnPassant) {
        this.removeEnPassantPiece(piece);
      }
      if(piece instanceof King && piece.castle !== King.NO_CASTLE) {
        this.completeCastle(piece);
      }
      if(piece instanceof Rook || piece instanceof King) {
        this.changeCastleStatus(piece);
      }
    };
    Board.prototype.changeCastleStatus = function (piece) {
      if(piece instanceof King) {
        this.canCastleQueenSide[piece.color] = false;
        this.canCastleKingSide[piece.color] = false;
      } else if(piece instanceof Rook) {
        var x;
        if(piece.color === Piece.BLACK) {
          x = 0;
        } else if(piece.color === Piece.WHITE) {
          x = 7;
        }
        if(!(this.physicalBoard.getPiece({
          x: x,
          y: 0
        }) instanceof Rook)) {
          this.canCastleQueenSide[piece.color] = false;
        }
        if(!(this.physicalBoard.getPiece({
          x: x,
          y: 7
        }) instanceof Rook)) {
          this.canCastleKingSide[piece.color] = false;
        }
      }
    };
    Board.prototype.completeCastle = function (piece) {
      var oldRookCoord;
      var newRookCoord;
      if(piece.castle === King.CASTLE_KING_SIDE) {
        oldRookCoord = {
          x: piece.x,
          y: 7
        };
        newRookCoord = {
          x: piece.x,
          y: 5
        };
      } else if(piece.castle === King.CASTLE_QUEEN_SIDE) {
        oldRookCoord = {
          x: piece.x,
          y: 0
        };
        newRookCoord = {
          x: piece.x,
          y: 3
        };
      }
      var movingRook = this.physicalBoard.getPiece(oldRookCoord);
      this.physicalBoard.removePiece(oldRookCoord);
      movingRook.move(newRookCoord);
      this.physicalBoard.setPiece(newRookCoord, movingRook);
    };
    Board.prototype.removeCanBeTakenEnPassantProperty = function (movingPieceColor) {
      for(var i = 0; i < 8; i++) {
        for(var j = 0; j < 8; j++) {
          var piece = this.physicalBoard.getPiece({
            x: i,
            y: j
          });
          if(typeof piece !== "undefined") {
            if(piece.color !== movingPieceColor) {
              piece.canBeTakenEnPassant = false;
              piece.intendToTakeEnPassant = false;
            }
          }
        }
      }
    };
    Board.prototype.removeEnPassantPiece = function (movedPiece) {
      var newCoord;
      if(movedPiece.color === Piece.WHITE) {
        newCoord = {
          x: movedPiece.x + 1,
          y: movedPiece.y
        };
      } else {
        newCoord = {
          x: movedPiece.x - 1,
          y: movedPiece.y
        };
      }
      this.physicalBoard.removePiece(newCoord);
    };
    return Board;
  });
})();