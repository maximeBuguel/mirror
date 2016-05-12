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
    $scope.weather = [];
    $scope.weatherApiToken = "6c743c9343a6890c919ab6e7df1b6603";
    $scope.weatherApiCityId = "6454414";
    $scope.weatherApiUnits = "metric";
    
    // Fonctions
    $scope.updateClock = updateClock;
    $scope.updateWeather = updateWeather;
    $scope.switchView = switchView;
    $scope.activate = activate;
    
    //**************************************************************************************//
    $scope.activate();
    $scope.updateWeather();
    setInterval($scope.updateClock, 1000);
    setInterval($scope.updateWeather, 3600000);
        
    
    
    
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
    
    
    
    function updateClock() {
        moment.locale('fr');
        $scope.time = moment().format('HH:mm:ss');
        $scope.date = moment().format('ll');
        $scope.$apply();
    }

    
    function updateWeather(){
        $http.get("http://api.openweathermap.org/data/2.5/forecast/city?id="+$scope.weatherApiCityId+"&APPID="+$scope.weatherApiToken+"&lang=FR&units="+$scope.weatherApiUnits).then(function sucess(response){
            console.log(response);
            var data = response.data;
            $scope.weather[0]= data.list[0];
            $scope.weather[1]= data.list[2];
            $scope.weather[2]= data.list[4];
            console.log($scope.weather);
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
    
    function switchView(code){
        if(code === 39) {
          console.log('right arrow');
          $location.path('/view2')
        }
        if(code === 37) {
          console.log('left arrow');
        }
    }
    

};