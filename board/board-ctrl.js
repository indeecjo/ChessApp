/* global angular:false*/
;(function () {
  'use strict';
  angular.module('chess').controller('BoardCtrl', function ($scope, Board, PhysicalBoard) {
    //FIXME: used for debugging
    window.MY_SCOPE = $scope;
    $scope.board = new Board();
    $scope.isCheck = false;
    $scope.$on('CHECK', function (event, isCheck) {
      $scope.isCheck = isCheck;
    });
    $scope.$on('PROMOTE', function (event, piece) {
      $scope.$apply(function () {
        $scope.board.physicalBoard.promotePawn(piece);
        $scope.isCheck = $scope.board.isCheck();
      });
    });
    $('#promoteDialog').dialog({
      draggable: false,
      resizable: false,
      closeOnEscape: false,
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
      buttons: {
        Rook: function () {
          angular.element('#board_ctrl').scope().$emit('PROMOTE', PhysicalBoard.ROOK);
          $(this).dialog("close");
        },
        Bishop: function () {
          angular.element('#board_ctrl').scope().$emit('PROMOTE', PhysicalBoard.BISHOP);
          $(this).dialog("close");
        },
        Knight: function () {
          angular.element('#board_ctrl').scope().$emit('PROMOTE', PhysicalBoard.KNIGHT);
          $(this).dialog("close");
        },
        Queen: function () {
          angular.element('#board_ctrl').scope().$emit('PROMOTE', PhysicalBoard.QUEEN);
          $(this).dialog("close");
        }
      }
    });
  });
})();
