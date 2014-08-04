/* global angular:false*/
(function () {
  'use strict';
  angular.module('chess').factory('Board', function (Pawn, Piece, Cell, Rook, King, Bishop, Queen, Knight, Move, PhysicalBoard) {
    

    function Board() {
      this.playerToMoveColor = Board.WHITE_TO_MOVE;
      this.canCastleKingSide = {};
      this.canCastleKingSide[Piece.Color.WHITE] = true;
      this.canCastleKingSide[Piece.Color.BLACK] = true;
      this.canCastleQueenSide = {};
      this.canCastleQueenSide[Piece.Color.WHITE] = true;
      this.canCastleQueenSide[Piece.Color.BLACK] = true;
      this.halfMovesSinceCaptureOrPawnAdvance = 0;
      this.moveNumber = 0;
      // TODO: Load table initial postition from external source
      this.physicalBoard = new PhysicalBoard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
      //this.physicalBoard = new PhysicalBoard('rnbqkbn1/pppppppP/8/8/8/8/PPPPPPPp/RNBQKBN1');    
      //this.physicalBoard = new PhysicalBoard('8/p7/P7/8/8/8/8/8');
    }
    Board.WHITE_TO_MOVE = Piece.Color.WHITE;
    Board.BLACK_TO_MOVE = Piece.Color.BLACK;
    
    /**
     *@param <String> strFEN String starting position in FEN format
     **/
    Board.prototype.initGameStateFromFEN = function initGameStateFromFEN(strFEN) {
      var splitedValues = strFEN.split(' ');
      this.initBoardMatrixFromFEN(splitedValues[0]);
      this.initPlayerToMoveFromFEN(splitedValues[1]);
      this.initCanCastleFromFEN(splitedValues[2]);
      this.initCanTakeEnPassant(splitedValues[3]);
      this.initNumberOfHalfMoves(splitedValues[4]);
      this.initMoveNumber(splitedValues[5]);
    };

    /**
     *@param <String> char w - white , b - black
     **/
    Board.prototype.initPlayerToMoveFromFEN = function initPlayerToMoveFromFEN(char) {
      if(char === 'w') {
        this.playerToMoveColor = Board.WHITE_TO_MOVE;
      } else if(char === 'b') {
        this.playerToMoveColor = Board.BLACK_TO_MOVE;
      }
    };

    /**
     *@param <String> canCastleStr k - king side q -queen side (uppder case White)
     **/
    Board.prototype.initCanCastleFromFEN = function initCanCastleFromFEN(canCastleStr) {
      this.canCastleKingSide[Piece.Color.WHITE] = canCastleStr.contains('K');
      this.canCastleKingSide[Piece.Color.BLACK] = canCastleStr.contains('k');
      this.canCastleQueenSide[Piece.Color.WHITE] = canCastleStr.contains('Q');
      this.canCastleQueenSide[Piece.Color.BLACK] = canCastleStr.contains('q');
    };

    /**
     * This parameter is used for determining draw after 40 moves without capture
     * or paen advance 
     * TODO : Add logic to class 
     *@param <Number> numOfMoves number of half moves since last capture or pawn advance
     **/
    Board.prototype.initNumberOfHalfMoves = function initNumberOfHalfMoves(numOfMoves) {
      this.halfMovesSinceCaptureOrPawnAdvance = parseInt(numOfMoves, 10);
    };

    /**
     *@param <Number> moveNumber  number of moves from start of game
     **/
    Board.prototype.initMoveNumber = function initMoveNumber(moveNumber) {
      this.moveNumber = parseInt(moveNumber, 10);
    };

    /**
     *@param <Move> move 
     *@return <Boolean> isLegalMove
     **/
    Board.prototype.isLegalMove = function isLegalMove(move) {
      var from = move.from;
      var to = move.to;
      if(this.physicalBoard.isEmpty(from)) {
        return false;
      }
      var movingPiece = move.piece;
      if((movingPiece.color === Piece.Color.WHITE && this.playerToMoveColor === Board.BLACK_TO_MOVE) || (movingPiece.color === Piece.Color.BLACK && this.playerToMoveColor === Board.WHITE_TO_MOVE)) {
        return false;
      }
      var takenPiece = this.physicalBoard.getPiece(to);
      if(takenPiece !== undefined) {
        if(takenPiece.color === movingPiece.color) {
          return false;
        }
      }
      var takenEnPassantPiece;
      if(movingPiece.color === Piece.Color.WHITE) {
        takenEnPassantPiece = this.physicalBoard.getPiece({
          x: to.x + 1,
          y: to.y
        });
      } else if(movingPiece.color === Piece.Color.BLACK) {
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
      if(movingPiece instanceof King && movingPiece.castle !== King.CastleStatus.NO_CASTLE) {
        return this.isCastleLegal(move);
      }
      return true;
    };

    /**
     * @param <Move> move 
     * @return <Boolean> isCastleLegal
     **/
    Board.prototype.isCastleLegal = function isCastleLegal(move) {
      var king = move.piece;
      var rook;
      if(typeof king === "undefined") {
        return false;
      }
      if(king.castle === King.CastleStatus.CASTLE_KING_SIDE && !this.canCastleKingSide[king.color]) {
        return false;
      }
      if(king.castle === King.CastleStatus.CASTLE_QUEEN_SIDE && !this.canCastleQueenSide[king.color]) {
        return false;
      }
      this.togglePlayerToMoveColor();
      var kingUnderAttackNow = this.isKingUnderAttack(king.color);
      this.togglePlayerToMoveColor();
      var jumpingOver;
      if(king.castle === King.CastleStatus.CASTLE_KING_SIDE) {
        jumpingOver = {
          x: king.x,
          y: king.y + 1
        };
      } else if(king.castle === King.CastleStatus.CASTLE_QUEEN_SIDE) {
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
      if(king.castle === King.CastleStatus.CASTLE_QUEEN_SIDE) {
        if(this.physicalBoard.isEmpty({
          x: move.to.x,
          y: move.to.y - 1
        })) {
          return false;
        }
      }
      return true;
    };


    /**
     * @param <String> kingColor 
     * @return <Boolean> isKingUnderAttack
     **/
    Board.prototype.isKingUnderAttack = function isKingUnderAttack(kingColor) {
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

    /**
     * @return <Boolean> isKingUnderAttack
     **/
    Board.prototype.isCheck = function isCheck() {
      var currentlyPlayingSideKing = this.playerToMoveColor;
      this.togglePlayerToMoveColor();
      var result = this.isKingUnderAttack(currentlyPlayingSideKing);
      this.togglePlayerToMoveColor();
      return result;
    };

     /**
      * @param <Move>
      * @return <Boolean> isKingUnderAttackAfterMove
      **/
    Board.prototype.isKingUnderAttackAfterMove = function isKingUnderAttackAfterMove(move) {
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

     /**
      * Changes playr to move color
      **/
    Board.prototype.togglePlayerToMoveColor = function togglePlayerToMoveColor() {
      if(this.playerToMoveColor == Board.WHITE_TO_MOVE) {
        this.playerToMoveColor = Board.BLACK_TO_MOVE;
      } else {
        this.playerToMoveColor = Board.WHITE_TO_MOVE;
      }
    };

     /**
      * Make a move
      * @param <Piece> piece
      * @param <Object> from
      * @param <Object> to
      **/
    Board.prototype.move = function move(piece, from, to) {
      this.removeCanBeTakenEnPassantProperty(piece.color);
      this.physicalBoard.removePiece(from);
      piece.move(to);
      this.physicalBoard.setPiece(to, piece);
      this.togglePlayerToMoveColor();
      if(piece.intendToTakeEnPassant) {
        this.removeEnPassantPiece(piece);
      }
      if(piece instanceof King && piece.castle !== King.CastleStatus.NO_CASTLE) {
        this.completeCastle(piece);
      }
      if(piece instanceof Rook || piece instanceof King) {
        this.changeCastleStatus(piece);
      }
    };

     /**
      * Change Castle Status if neccessary
      * @param <Piece> piece the piece which moved
      **/
    Board.prototype.changeCastleStatus = function changeCastleStatus(piece) {
      if(piece instanceof King) {
        this.canCastleQueenSide[piece.color] = false;
        this.canCastleKingSide[piece.color] = false;
      } else if(piece instanceof Rook) {
        var x;
        if(piece.color === Piece.Color.BLACK) {
          x = 0;
        } else if(piece.color === Piece.Color.WHITE) {
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

     /**
      * Change Castle Status if neccessary
      * @param <Piece> piece the piece which moved
      **/
    Board.prototype.completeCastle = function completeCastle(piece) {
      var oldRookCoord;
      var newRookCoord;
      if(piece.castle === King.CastleStatus.CASTLE_KING_SIDE) {
        oldRookCoord = {
          x: piece.x,
          y: 7
        };
        newRookCoord = {
          x: piece.x,
          y: 5
        };
      } else if(piece.castle === King.CastleStatus.CASTLE_QUEEN_SIDE) {
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

     /**
      * Remove Can Be Taken En Passant Property
      * @param <String> movingPieceColor 
      * TODO : make en paasant a property of cell
      **/
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

       /**
        * Remove Can Be Taken En Passant Property
        * @param <Piece> piece the piece which moved
        * TODO : make en paasant a property of cell
        **/
    Board.prototype.removeEnPassantPiece = function (movedPiece) {
      var newCoord;
      if(movedPiece.color === Piece.Color.WHITE) {
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