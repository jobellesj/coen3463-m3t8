var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');

var app = express();

var options = {
  server: {
    socketOptions: {
      keepAlive: 300000, connectTimeoutMS: 30000
    }
  },
  replset: {
    socketOptions: {
      keepAlive: 300000, connectTimeoutMS : 30000
    }
  }
};

var usersCollection = require('./models/users');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var tedtalksCollection = require('./models/tedtalks');
var mongoose = require('mongoose');
var mdbUrl ="mongodb://admin:Alexandra09@ds161018.mlab.com:61018/coen3463-t8";
mongoose.Promise = global.Promise;
mongoose.connect(mdbUrl, options);
passport.use(new LocalStrategy(usersCollection.authenticate()));
passport.serializeUser(usersCollection.serializeUser());
passport.deserializeUser(usersCollection.deserializeUser());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: false
}));

// passport configuration
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
  
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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