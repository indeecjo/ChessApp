chessApp.controller('BoardCtrl',function($scope,Board,PhysicalBoard){  
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
          debugger;   
          var boardScope = angular.element('#board_ctrl').scope();
          boardScope.board.physicalBoard.promotePawn(PhysicalBoard.ROOK);          
          boardScope.$apply();
           $( this ).dialog( "close" );
        },
        Bishop:function(){
          var boardScope = angular.element('#board_ctrl').scope();
          boardScope.board.physicalBoard.promotePawn(PhysicalBoard.BISHOP);          
          boardScope.$apply();
           $( this ).dialog( "close" );
        },
        Knight:function(){
          var boardScope = angular.element('#board_ctrl').scope();
          boardScope.board.physicalBoard.promotePawn(PhysicalBoard.KNIGHT);          
          boardScope.$apply();           
           $( this ).dialog( "close" );
        },
        Queen:function(){
          var boardScope = angular.element('#board_ctrl').scope();
          boardScope.board.physicalBoard.promotePawn(PhysicalBoard.QUEEN);          
          boardScope.$apply();
           $( this ).dialog( "close" );
        }

      }

    });
})
