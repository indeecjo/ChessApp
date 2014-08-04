  /*global angular:false*/
  
  (function(){
  angular.module('chess').directive('piece', function () {
    return {
      restrict: 'AE',
      link: function (scope, element, attr) {
        var piece = scope.cell.piece;
        if(typeof piece !== "undefined") {
          element.prop('pieceObj', piece);
          element.addClass(piece.color + '-' + piece.constructor.name.toLowerCase());
          element.draggable({
            containment: "#chess_board",
            revert: "invalid",
            cursor: "pointer"
          });
        }
      }
    };
  });
})();