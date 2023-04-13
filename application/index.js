var http = require('http'),
    path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    flash = require('connect-flash'),
    cookieParser = require("cookie-parser"),
    errorhandler = require('errorhandler');
const ConnectService = require('./services/connectService');
const result = require('dotenv').config({ path: path.join(__dirname, ".env") })

var isProduction = process.env.NODE_ENV === 'production';

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Normal express config defaults
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());


app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));
app.use(flash());
app.use(function(req, res, next){
  res.locals.messages = req.flash();
  res.locals.env = process.env
  next();
});

if (!isProduction) {
  app.use(errorhandler());
}

app.use((req, res, next) => {
  var language = req.cookies.language
  if(!language) {
    language = 'en'
    res.cookie('language', language, { maxAge: 900000 })
  } 
  res.locals.language = language
  next();
})


// require('./models/User');
// require('./models/Article');
// require('./models/Comment');
// require('./config/passport');

app.use(require('./routes'));

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use(function(err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({'errors': {
      message: err.message,
      error: err
    }});
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({'errors': {
    message: err.message,
    error: {}
  }});
});


if(process.env.CONTEXT=='microfabric'){
  console.log("Starting Biobank-App in local development mode")
  initServer()
}
else if(process.env.CONTEXT=='remote'){
  console.log("Starting Biobank-App in remote mode...")
  connectService = new ConnectService()
  connectService.updateConnectionProfile().then(() => {
    initServer()
  })
}

function initServer(){
  var server = app.listen( process.env.PORT || 3000, function(){
    console.log('Listening on port ' + server.address().port);
    console.log('Open http://127.0.0.1:3000 in your browser')
  });
}