var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var passport = require('passport');
var mongoose = require('mongoose');
var uuid = require('uuid/v4')
var session = require('express-session')
var FileStore = require('session-file-store')(session);
var flash = require('express-flash')
const cors = require('cors');

require('./authentication/aut')

var usersAPIRouter = require('./routes/api/users');
var adminAPIRouter = require('./routes/api/admin');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

var app = express();

// Base de dados
mongoose.connect('mongodb://127.0.0.1:27017/ibanda', {useNewUrlParser:true})
  .then(()=> {console.log('Mongo ready: ' + mongoose.connection.readyState)})
  .catch(error => console.log("Erro de conexão: " + error))

// Configuração da sessão
app.use(session({
  genid: () => {
    return uuid()},
  store: new FileStore(),
  secret: 'O meu segredo',
  resave: true,
  saveUninitialized: true
}))

// Custom flash middleware -- from Ethan Brown's book, 'Web Development with Node & Express'
app.use(function(req, res, next){
  // if there's a flash message in the session request, make it available in the response, then delete it
  res.locals.sessionFlash = req.session.sessionFlash;
  delete req.session.sessionFlash;
  next();
});

// Inicialização do passport
app.use(passport.initialize())
app.use(passport.session())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(flash())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use('/api/users', usersAPIRouter)
app.use('/api/admin', adminAPIRouter)
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter)


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
