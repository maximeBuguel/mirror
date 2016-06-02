'use strict';

var mirror = angular.module('myApp');

mirror.controller('Tab2Ctrl', Tab2Ctrl);

Tab2Ctrl.$inject = ['$scope', '$http', '$timeout', '$location'];


function Tab2Ctrl($scope, $http, $timeout, $location, currentTab){
    
    
    
    $scope.widget = {};
    $scope.currentState = "paused";
    $scope.activate = activate;
    $scope.playPause = playPause,
    $scope.tapping = false;
    activate()
    
    function activate(){
        var iframeElement   = document.querySelector('iframe');
        $scope.widget         = SC.Widget(iframeElement);
        
        //*********************** Leap motion   *************************//
        var leapController = Leap.loop({enableGestures: true}, function(frame){
        if(frame.valid && frame.gestures.length > 0){
          var currentsGeastures = frame.gestures;
          if($scope.tapping == false && currentsGeastures[0].type == "keyTap"){
                console.log("taped");
                $scope.tapping = true;
                setTimeout(function(){
                    $scope.tapping = false
                }, 500);
                $scope.playPause();
          }
          }
        
    });
        
    }
    
    
    function playPause(){
        if($scope.currentState == "paused"){
            $scope.widget.play();
            $scope.currentState = "playing";
        }else{
            $scope.widget.pause();
            $scope.currentState = "paused";
        }
    }
    
    
};