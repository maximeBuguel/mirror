'use strict';


var mirror = angular.module('myApp.view2', ['ngRoute']);

mirror.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
 });
}])


mirror.controller('View2Ctrl', View2Ctrl);

View2Ctrl.$inject = ['$scope', '$http', '$timeout', '$location'];


function View2Ctrl($scope, $http, $timeout, $location){

     
    
    // Varialbes

    // Fonctions

    $scope.switchView = switchView;
    $scope.activate = activate;
    
    //**************************************************************************************//
    $scope.activate();

    
    
    
    function activate(){
    var handler = function(e){
        $scope.switchView(e.keyCode);      
    };

    var $doc = angular.element(document);

    $doc.on('keydown', handler);
    $scope.$on('$destroy',function(){
      $doc.off('keydown', handler);
    })
        
        
        
    }

    
    function switchView(code){
        console.log(code);
        if(code === 39) {
          console.log('right arrow');
          $location.path('/view1');
        }
        if(code === 37) {
          console.log('left arrow');
          $location.path('/view1');
        }
    }
    
    
};