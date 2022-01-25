var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var advertisements = require('./routes/api/ads');
const { isAPIRequest } = require('./lib/utils');
const swaggerMiddleware = require('./lib/swaggerMiddleware');

var app = express();

require('./lib/connectMongoose');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api-docs', swaggerMiddleware);


/**
 * Rutas de mi API
 */
 app.use('/apiv1/ads', advertisements);

/**
 * Rutas de mi website
 */
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  
    res.status(err.status || 500);
      // si es un error en el API respondo JSON
    if (isAPIRequest(req)) {
      res.json({ error: err.message });
      return;
    }
    
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.render('error');
});

module.exports = app;
