'use strict';

var mirror = angular.module('myApp');

mirror.controller('Tab1Ctrl', Tab1Ctrl);

Tab1Ctrl.$inject = ['$scope', '$http', '$timeout', '$location'];


function Tab1Ctrl($scope, $http, $timeout, $location){
    
    
    
    // Varialbes
    $scope.time = undefined;
    $scope.date = undefined;
    $scope.weather = {};
    $scope.curentTab = 0;
    $scope.nbTabs = 5;
    $scope.timeToWork= {};
    
    // API Configs
    
    $scope.mapsApi = {};
    $scope.mapsApi.Token = "AIzaSyAeqjV7o7CXxoeMFC0tfEOXY711ybe-ab0";
    $scope.mapsApi.origins= new google.maps.LatLng(50.6335127,3.0237142);
    $scope.mapsApi.destinations= new google.maps.LatLng(50.6340499,3.0483252);
    $scope.mapsApi.units = google.maps.UnitSystem.METRIC;
    $scope.mapsApi.mode = google.maps.TravelMode.DRIVING;
    
    // Fonctions
    $scope.updateClock = updateClock;
    $scope.updateWeather = updateWeather;
    /*$scope.switchView = switchView;*/
    $scope.activate = activate;
    $scope.getTimeToWork = getTimeToWork;
    
    //**************************************************************************************//
    $scope.activate();
    setInterval($scope.updateClock, 1000);
        
    $scope.socket =  io.connect('http://localhost:8080');
        
    $scope.socket.on('message', function(message) {
        setTimeout($scope.getTimeToWork, 500);
        setTimeout($scope.updateWeather, 500);
    })    
    
    //*****************************************************************************************//
    
    function activate(){
        console.log(this.currentUser);
        $scope.updateWeather();
        $scope.getTimeToWork();
    }
    
    
    function updateClock() {
        moment.locale('fr');
        $scope.time = moment().format('HH:mm');
        $scope.date = moment().format('ll');
        $scope.$apply();
    }

    
    function updateWeather(){
        $http.get("/weather").then(function sucess(response){
           $scope.weather = response.data;
        });
        
    }
    
    function getTimeToWork(){
        $scope.mapsApi.destinations= new google.maps.LatLng($scope.currentUser[0].work.lat, $scope.currentUser[0].work.lng);
        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
          {
            origins: [$scope.mapsApi.origins],
            destinations: [$scope.mapsApi.destinations],
            travelMode: $scope.mapsApi.mode,
            unitSystem: $scope.mapsApi.units
          }, callback);
        
    }
    
    function callback(response, status) {
      $scope.timeToWork = response;
    }

};