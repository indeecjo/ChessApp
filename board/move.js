'use strict';
chessApp.factory('Move', function() {
  function Move(from, to, piece) {
    this.from = from;
    this.to = to;
    this.piece = piece;
  }
  return Move;
});