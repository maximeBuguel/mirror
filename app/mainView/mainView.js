'use strict';

var mirror = angular.module('myApp.mainView', ['ngRoute']);

mirror.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/mainView', {
    templateUrl: 'mainView/mainView.html',
    controller: 'MainViewCtrl'
  });
}])


mirror.controller('MainViewCtrl', MainViewCtrl);

MainViewCtrl.$inject = ['$scope', '$http', '$timeout', '$location'];


function MainViewCtrl($scope, $http, $timeout, $location){
    
    
    // Varialbes
    $scope.curentTab = 0;
    $scope.nbTabs = 5;
    $scope.currentHandValue = 0;
    $scope.previousHandValue = 0;
    $scope.nbFingers = 0;
    $scope.previousFingerNumber = 0;
    $scope.swipping = false;
    $scope.currentUser = undefined;
    $scope.activate = activate;
    $scope.switchTab = switchTab;
    $scope.getUser = getUser;
    //**************************************************************************************//
    $scope.activate();
    setInterval($scope.getUser, 5000);
        
    
    
    //*****************************************************************************************//
    
    function activate(){
        $scope.getUser();
        //*********************** Leap motion   *************************//
        var leapController = Leap.loop({enableGestures: true}, function(frame){
        if(frame.valid && frame.gestures.length > 0){
            var currentsGeastures = frame.gestures;
            if($scope.swipping == false && currentsGeastures[0].type == "swipe"){
                $scope.swipping = true;
                setTimeout(function(){
                    $scope.swipping = false
                }, 500);
                if(currentsGeastures[0].direction[0] > 0){
                    $scope.switchTab(-1);
                } else {
                    $scope.switchTab(1);
                }
            }
      }
            
    });
    }

    
    function getUser(){
         $http.get("/user").then(function sucess(response){
           $scope.currentUser = response.data;
        });
        
    }
    
    
    function getAuthToken(){
        var oauth_cosumer_key = "c331c571585e7c518c78656f41582e96fc1c2b926cf77648223dd76424b52b" ;
        var oauth_nonce = "f71972b1fa93b8935ccaf34ee02d7657";
        var oauth_nonce = "";
        var oauth_timestamp = "";
        $http.get("https://oauth.withings.com/account/request_token?oauth_consumer_key="+oauth_cosumer_key+"&oauth_nonce="+
                oauth_nonce+"&oauth_signature="+oauth_once+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+oauth_timestamp+"&oauth_version=1.0").then(function sucess(response){
            console.log(response);
        });
        
        
    }
    
    
    function switchTab(int){
        $scope.curentTab = (($scope.curentTab +int)+$scope.nbTabs)% $scope.nbTabs;
    }
};