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
    $scope.time = undefined;
    $scope.date = undefined;
    $scope.weather = {};
    $scope.curentTab = 0;
    $scope.nbTabs = 3;
    $scope.timeToWork= {};
    $scope.currentHandValue = 0;
    $scope.previousHandValue = 0;
    $scope.nbFingers = 0;
    
    // API Configs
    $scope.weatherApi = {};
    $scope.weatherApi.Token = "6c743c9343a6890c919ab6e7df1b6603";
    $scope.weatherApi.CityId = "6454414";
    $scope.weatherApi.Units = "metric";
    
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
    $scope.switchTab = switchTab;
    $scope.getTimeToWork = getTimeToWork;
    $scope.countFingers = countFingers;
    
    //**************************************************************************************//
    $scope.activate();
    setInterval($scope.updateClock, 1000);
    setInterval($scope.updateWeather, 3600000);
    setInterval($scope.getTimeToWork, 600000);
    
    
    function activate(){
        $scope.updateWeather();
        $scope.getTimeToWork();
        Leap.loop(function(frame){
          $scope.hands = frame.hands;
          $scope.currentHandValue = frame.hands.length;
          if($scope.previousHandValue == 0 && $scope.currentHandValue == 1 ){
              $scope.countFingers();
              //$scope.switchTab();
              $scope.curentTab = $scope.nbFingers -1;
              console.log($scope.hands);
          };
          $scope.previousHandValue = $scope.currentHandValue;
        });
    }
    
    
    function countFingers(){
        $scope.nbFingers = 0;
        $scope.hands[0].fingers.forEach(function(finger){
            if(finger.extended == true){
                $scope.nbFingers +=1;
            }
        });
        console.log($scope.nbFingers);
        
    }
    
    function updateClock() {
        moment.locale('fr');
        $scope.time = moment().format('HH:mm:ss');
        $scope.date = moment().format('ll');
        $scope.$apply();
    }

    
    function updateWeather(){
        $http.get("http://api.openweathermap.org/data/2.5/forecast/daily?cnt=3&id="+$scope.weatherApi.CityId+"&APPID="+$scope.weatherApi.Token+"&lang=FR&units="+$scope.weatherApi.Units).then(function sucess(response){
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
      console.log($scope.timeToWork);
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
    
   /* function switchView(code){
        if(code === 39) {
          console.log('right arrow');
          $location.path('/view2')
        }
        if(code === 37) {
          console.log('left arrow');
        }
    }*/
    
    function switchTab(){
        $scope.curentTab = ($scope.curentTab +1)% $scope.nbTabs;
    }
};