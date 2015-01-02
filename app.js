/**
 * Created by k33g_org on 02/01/15.
 */

var express = require('express')
  , http = require('http')
  , bodyParser = require('body-parser')
  , DataStore = require('nedb')
  , app = express()
  , http_port = 3000
  , myDataBase = new DataStore({ filename: 'mydatabase.nedb' })
  , session = require('express-session');

app.use(express.static(__dirname + '/public'));

// https://github.com/expressjs/body-parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// https://github.com/expressjs/session
app.use(session({secret: 'bob_morane', saveUninitialized: false, resave: true}));

app.post("/api/account/signin", function(req, res) {
  var user = req.body;
  console.log("user:", user);
  req.session.connectedUser = user;
  res.send(user);
});

app.get("/api/account/token", function(req, res) {
  res.send(req.session.connectedUser);
});


// all users
app.get("/api/users", function(req, res) {

  myDataBase.find({}, function (err, docs) {
    res.send(docs);
  });

});

// one user by id
app.get("/api/users/:id", function(req, res) {
  myDataBase.findOne({ _id: req.params.id }, function (err, doc) {
    res.send(doc)
  });
});

// delete a user by id
app.delete("/api/users/:id", function(req, res) {
  myDataBase.remove({ _id: req.params.id }, {}, function (err, numRemoved) {
    res.statusCode = 200;
    res.send({res:numRemoved});
  });
});

// add a user
app.post("/api/users", function(req, res) {
  var user = req.body;
  myDataBase.insert(user, function (err, newDoc) {
    res.statusCode = 301;
    res.header("location", "/users/"+newDoc._id).end();
  });

});

// update user by id
app.put("/api/users/:id", function(req, res) {
  myDataBase.update({_id:req.params.id}, req.body, {}, function (err, numReplaced) {
    res.statusCode = 200;
    res.send({res:numReplaced});
  })
});

// load database then run application
myDataBase.loadDatabase(function (err) {
  app.listen(http_port);
  console.log("Listening on " + http_port);
});
