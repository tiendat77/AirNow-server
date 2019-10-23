const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');

const app = express();
// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { 
      useUnifiedTopology: true,
      useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Express session
app.use(
  session({
    secret: 'secret_thesis',
    resave: true,
    cookie: {
    maxAge:1000*60*15
    },
    saveUninitialized: true
  })
);

app
  .use(express.static('public/air-now-login'))
  .use(express.static('public/air-now'))
  .use(bodyParser.urlencoded({extended: true}))
  .use(bodyParser.json())
  .use(passport.initialize())
  .use(passport.session()) 

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

const port = process.env.PORT || 8000;
// Routes
app
  .use('/users', require('./routes/user'))
  .use('/', require('./routes/index'))
  .use('/api', require('./routes/api'))
  .use('/esp32', require('./routes/esp32'))

const server = http.createServer(app);

server.listen(port, () => { console.log("Server is running in port:", port) })
