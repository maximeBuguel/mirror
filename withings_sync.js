var express = require('express')
var app = express()
var Withings = require('withings-lib');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var config = require('./client_secret');
var userID;
app.use(cookieParser());
app.use(session({secret: 'bigSecret'}));
app.listen(3000);


//Mongo
var db;
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://10.134.15.103:27017/withingsapi', (err, database) => {
  db = database;
  if(err){
    console.log(err);
  }
});



// OAuth flow
app.get('/', function (req, res) {
    // Create an API client and start authentication via OAuth
    var options = {
        consumerKey: config.apiKey,
        consumerSecret: config.apiSecret,
        callbackUrl: config.callBack_url
    };
    var client = new Withings(options);

    client.getRequestToken(function (err, token, tokenSecret) {
        if (err) {
            // Throw error
            return;
        }

        req.session.oauth = {
            requestToken: token,
            requestTokenSecret: tokenSecret
        };

        res.redirect(client.authorizeUrl(token, tokenSecret));
    });
});

// On return from the authorization
app.get('/oauth_callback', function (req, res) {
    var verifier = req.query.oauth_verifier
    var oauthSettings = req.session.oauth
    var options = {
        consumerKey: config.apiKey,
        consumerSecret: config.apiSecret,
        callbackUrl: config.callBack_url,
        userID: req.query.userid
    };
    userID =  req.query.userid;
    var client = new Withings(options);

    // Request an access token
    client.getAccessToken(oauthSettings.requestToken, oauthSettings.requestTokenSecret, verifier,
        function (err, token, secret) {
            if (err) {
                // Throw error
                return;
            }

            oauthSettings.accessToken = token;
            oauthSettings.accessTokenSecret = secret;

            res.redirect('/measure/weight');
        }
    );
});

// Display today's steps for a user
app.get('/activity/steps', function (req, res) {
    var options = {
        consumerKey: config.apiKey,
        consumerSecret: config.apiSecret,
        accessToken: req.session.oauth.accessToken,
        accessTokenSecret: req.session.oauth.accessTokenSecret,
        userID: userID
    };
    var client = new Withings(options);

    client.getDailySteps(new Date(), function(err, data) {
        if (err) {
            res.send(err);    
        }
        res.json(data);
    })
                         
});

app.get('/measure/weight', function (req, res) {
    var options = {
        consumerKey: config.apiKey,
        consumerSecret: config.apiSecret,
        accessToken: req.session.oauth.accessToken,
        accessTokenSecret: req.session.oauth.accessTokenSecret,
        userID: userID
    };
    var client = new Withings(options);
    var sync = function(){
        console.log("data updated");
        client.getWeightMeasures(null, null, function(err, data) {
            if (err) {
                res.send(err);    
            }
            db.collection('weightmeasure').drop(function(err, records) {
                if (err) throw err;
            });
            db.collection('weightmeasure').insert(data, function(err, records) {
                if (err) throw err;
            });

        })
    }
    sync();
    var twoHours = 72000000;
    setInterval(sync, 36000000);
    res.json("start putting data in DB every hour");                     
});