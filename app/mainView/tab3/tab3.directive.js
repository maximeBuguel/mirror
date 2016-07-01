angular.module('myApp')
    .directive('tab3', function () {
            return{
                restrict: 'E',
                templateUrl:'./mainView/tab3/tab3.html',
                controller: Tab3Ctrl,
                scope:{
                    currentUser:"="
                }
            }
    });