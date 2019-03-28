'use strict';
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var bodyParser = require('body-parser')
const config = require('./public/config');
var mainRoute = require('./routes/routes');
var signin = require('./routes/signin');

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(morgan('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use( bodyParser.json({limit: "50mb"}));     // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

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
const pdf = require('./models/pdf.model');
const logout = require('./models/logout.model');
app.post('/API/eventLogCreate', function(req, res,next) {
  let data = req.body;
  data.DateTime = new Date();
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
      })
  })
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
