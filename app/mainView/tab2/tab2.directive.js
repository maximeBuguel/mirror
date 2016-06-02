angular.module('myApp')
    .directive('tab2', function () {
            return{
                restrict: 'E',
                templateUrl:'./mainView/tab2/tab2.html',
                controller: Tab2Ctrl
            };
    });