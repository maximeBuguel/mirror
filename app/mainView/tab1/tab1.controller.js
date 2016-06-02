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
    $scope.mapsApi.origins= new google.maps.LatLng(50.588542,3.072613);
    $scope.mapsApi.destinations= new google.maps.LatLng(50.647320, 3.198406);
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
    setInterval($scope.updateWeather, 3600000);
    setInterval($scope.getTimeToWork, 600000);
        
    
    
    //*****************************************************************************************//
    
    function activate(){
        $scope.updateWeather();
        $scope.getTimeToWork();
    }
    
    
    function updateClock() {
        moment.locale('fr');
        $scope.time = moment().format('HH:mm:ss');
        $scope.date = moment().format('ll');
        $scope.$apply();
    }

    
    function updateWeather(){
        $http.get("/weather").then(function sucess(response){
           $scope.weather = response.data;
        });
        
    }
    
    function getTimeToWork(){
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