'use strict';
var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var mainRoute = require('./routes/routes');
var signin = require('./routes/signin');
var express = require('express');
var bodyParser = require('body-parser');
var gcm = require('node-gcm');
const config = require('./config');
var app = express();//,

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//To server static assests in root dir
//h5bp({ root: __dirname + '/public' })
app.use(express.static(__dirname));
//To allow cross origin request
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

//To server index.html page
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.use((req,res,next)=>{config;
  next();
});

app.use('/', mainRoute);
app.use('/admin', signin);
const login = require('./models/login.model');
const dashboard = require('./models/dashboard.model');
const contactUs = require('./models/contactUs.model');
const aboutUs = require('./models/aboutUs.model');
const aboutGroundingLog = require('./models/aboutGroundingLog.model');
const logout = require('./models/logout.model');
app.post('/API/eventLogCreate', function(req, res,next) {
  let data = req.body;
  data.DateTime = new Date().toLocaleString('en-US', {
    timeZone: 'Eastern Time (US & Canada)'
  });
  data.Active = 1;
  console.log(data);
  let localVar;
  if(data.Event == 'doLogin') {localVar = login;}
  else if(data.Event == 'dashboard') {localVar = dashboard;}
  else if(data.Event == 'contactUs') {localVar = contactUs;}
  else if(data.Event == 'aboutUs') {localVar = aboutUs;}
  else if(data.Event == 'aboutGroundingLog') {localVar = aboutGroundingLog;}
  else if(data.Event == 'logout') {localVar = logout;}
  else {
      res.status(200).json({
          'status': false,
          'message': 'Invalid event name',
          'result': localVar
      })
  }
  localVar = new localVar(data);
  localVar.save(function (err) {
      if (err) {
          return next(err);
      }
      res.status(200).json({
          'status': true,
          'message': 'Successfully created record',
          'result': localVar
      });
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
