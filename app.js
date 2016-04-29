var express = require('express'),
    passport = require('passport'),
   util = require('util'),
   _500pxStrategy = require('passport-500px').Strategy,
   logger = require('morgan'),
   session = require('express-session'),
   bodyParser = require('body-parser'),
   cookieParser = require('cookie-parser'),
   methodOverride = require('method-override');

var _5OOPX_CONSUMER_KEY = "REXioJRjptFYmYXb6vARjNiltlHks0Rbw2ZlwfXV"
  , _5OOPX_CONSUMER_SECRET = "GAjQHu31SkQo5h1lK5D8k5nkNLsbtSUTWjZlLSNR";


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Using the _500pxStrategy within Passport.

passport.use(new _500pxStrategy({
    consumerKey: _5OOPX_CONSUMER_KEY,
    consumerSecret: _5OOPX_CONSUMER_SECRET,
    callbackURL: 'http://localhost:3000/auth/500px/callback/'
  },
  function(token, tokenSecret, profile, done) {
  
    process.nextTick(function () {

     
      return done(null, profile);
    }); 
  }
));

var app = express();

// configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
//app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res){
  res.render('index', { user: req.user });
});




app.get('/auth/500px',passport.authenticate('500px'),
  function(req, res){
  
  });


app.get('/auth/500px/callback',
  passport.authenticate('500px', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/photos');
  });

app.get('/photos', ensureAuthenticated,function(req, res){
  res.render('photos', { user: req.user });
});


app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


app.listen(3000, function () {
  console.log('App running on port 3000!');
});


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}
