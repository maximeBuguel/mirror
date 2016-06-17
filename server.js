var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var http = require('http');
var Withings = require('withings-lib');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var apiKeys = require('./client_secret');

var CONTACTS_COLLECTION = "contacts";

var app = express();
app.use(express.static(__dirname + "/app"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret: 'bigSecret'}));


// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://10.134.15.103:27017/mirror', (err, database) => {
  db = database;
  if(err){
    console.log(err);
  }
});


//Variable global

var currentUser = 0;


// Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });





//SOCKET IO

// Chargement de socket.io
var io = require('socket.io').listen(server);

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
    console.log('Un client est connecté !');
});



app.get('/login', function (req, res) {
  var url = "https://oauth.withings.com/account/request_token?oauth_callback=http%3A%2F%2Flocalhost%3A8080%2FloggedIn&oauth_consumer_key=91e3540631c0154bccf65548c91fff528fcdb43c63974b796240f5e535&oauth_nonce=6e5beed0f9d0fe3256f639c27647e52a&oauth_signature=dK2V3zjE5J2xRHxaY9rgRwievDw%3D&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1466065685&oauth_version=1.0";
    
},function(req, res){
    
});

app.get('/logedIn', function (req, res) {
  
  console.log('logedIn');  
},function(req, res){
    
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
  db.collection('users').find({"id":parseInt(currentUser)}).toArray(function(error, documents){
    res.send(documents);
  });
});

app.post('/user', function (req, res) {
  currentUser = req.body.user ; 
  io.emit('message', 'User changed');
  res.send('Got a POST request at /user');   
},function(req, res){
    
});