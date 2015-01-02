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

var usersRoutes = require('./features/users/usersRoutes.js')(app, myDataBase)


// load database then run application
myDataBase.loadDatabase(function (err) {
  app.listen(http_port);
  console.log("Listening on " + http_port);
});
