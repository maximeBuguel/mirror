'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.mainView',
  'myApp.version',
  'ngAnimate',
  'ngMaterial'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/mainView'});
}]);

Leap.loop()
 .use('boneHand', {
   targetEl: document.body,
   arm: false
 });
