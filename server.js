var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var http = require('http');
/*var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;*/

var CONTACTS_COLLECTION = "contacts";

var app = express();
app.use(express.static(__dirname + "/app"));
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;



//Variable global

var currentUser = undefined;



// Connect to the database before starting the application server.
/*mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }*/

  // Save database object from the callback for reuse.
  /*db = database;
  console.log("Database connection ready");*/

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });

// CONTACTS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

app.get("/weather", function(req, res) {
     // API Configs
    var weatherApi = {};
    weatherApi.Token = "6c743c9343a6890c919ab6e7df1b6603";
    weatherApi.CityId = "6454414";
    weatherApi.Units = "metric";
    
    var options = {
      host: 'api.openweathermap.org',
      path: '/data/2.5/forecast/daily?cnt=3&id='+weatherApi.CityId+'&APPID='+weatherApi.Token+'&lang=FR&units='+weatherApi.Units
    };
    
    http.get(options, function(resp){
        var body = "";
         resp.on('data', function(chunk){
            body += chunk;
          });
        resp.on('end', function() {
            res.send(JSON.parse(body));
        });
        resp.on("error", function(e){
           res.send("Got error: " + e.message);
        });
  });
});


app.get("/user", function(req, res) {
    res.send(currentUser);
});

app.post('/user', function (req, res) {
  currentUser = req.body.user ; 
  res.send('Got a POST request at /user');   
},function(req, res){
    
    
});
