angular.module('myApp')
    .directive('tab1', function () {
            return{
                restrict: 'E',
                templateUrl:'./mainView/tab1/tab1.html',
                controller: Tab1Ctrl,
                scope:{
                    currentUser:"="
                }
            };
    });