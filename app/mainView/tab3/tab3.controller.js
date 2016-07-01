'use strict';
var mirror = angular.module('myApp');
mirror.controller('Tab3Ctrl', Tab3Ctrl);

Tab3Ctrl.$inject = ['$scope', '$http', '$timeout', '$location'];


function Tab3Ctrl($scope, $http, $timeout, $location){
    var data = {};
    var option = {}; 
    $scope.weight = [];
    $scope.tmpLabels = [];
    $scope.labels = [];

    
    activate()
    
    function activate(){
        getWeight();    
    };
    
    function getWeight(){
        $http.get("/weight").then(function sucess(response){
            response.data.forEach(function(element, index){
                //$scope.weight.push(85);
                $scope.weight.push(element.measures[0].value / 1000);
                $scope.labels.push((new Date(element.date * 1000).toJSON().slice(0, 10)));
            }); 
            $scope.data = $scope.weight.reverse();
            $scope.labels = $scope.labels.reverse();
            
            
            data = {
            labels: $scope.labels,
            datasets: [
                {
                    label: "My First dataset",
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(75,192,192,1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(255,255,255,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: $scope.data,
                }
                ]
            }; 
            
            option = {
                scales:{
                    yAxis: [{
                        ticks:{
                            beginAtZero:true
                        }
                    }]
                }
            }
            drawChart()    
        });      
    };
    
    
    function drawChart(){
		clearCanvas();
		appendCanvas();
		
		var ctx = document.getElementById("chart").getContext("2d");
        debugger;
		var myNewChart = new Chart(ctx).Line(data, option);
    }

    function clearCanvas(){
        $('#chart').remove();
    }

    function appendCanvas(){
                $('#chart-container').append('<canvas id="chart"></canvas>');
                var ctx = document.getElementById("chart").getContext("2d");
                ctx.canvas.width = $('#chart-container').width(); // resize to parent width
                ctx.canvas.height = 450; // resize to parent height
    }
    
    
}; 

  