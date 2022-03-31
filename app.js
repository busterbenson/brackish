var createError    = require('http-errors');
var express        = require('express');
var path           = require('path');
var cookieParser   = require('cookie-parser');
var logger         = require('morgan');

var indexRouter    = require('./routes/index');
var usersRouter    = require('./routes/users');
var readingRouter  = require('./routes/reading');
var cardRouter  = require('./routes/get-a-card');

var app            = express();

// view engine setup
// learn more: https://pugjs.org/api/reference.html
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "pug");

if (app.get('env') === 'production') {
  var enforce = require('express-sslify');
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// This will use the contents of 'bootstrap/dist/css' which is placed in your node_modules folder as if it is in your '/styles/css' directory.
app.use("/stylesheets", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))); 

// Routers
app.use(indexRouter);
app.use(readingRouter);
app.use(cardRouter);

// Catch 404 and forward to error handler
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
