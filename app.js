var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authUser = require('./routes/authUser');
var authShop = require('./routes/authShop');
var upload = require('./routes/upload');
var customerOrder = require('./routes/customerOrder')

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database:'provi'
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to provi db !");
});

var app = express();

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api',express.static(path.join( './')));

app.use('/', indexRouter);
app.use('/authUser',authUser);
app.use('/authShop',authShop);
app.use('/upload',upload);
app.use('/users', usersRouter);
app.use('/customerOrder',customerOrder);
app.use('*',(req,res)=>{
  res.render('error',{message:'Sorry internal error occurred help us to improve by mailing problem to  festalfactory@gmail.com'});
})

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

