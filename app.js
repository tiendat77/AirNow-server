const express = require('express');
const http = require('http');
const bodyParser = require('body-parser')
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');

const app = express();

// Passport Config
require('./config/passport')(passport);


// Connect to MongoDB
const db = require('./config/keys').mongoURI;
mongoose
  .connect(db,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false
    }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Express session
app.use(
  session({
    secret: 'secret_thesis',
    resave: true,
    cookie: {
      maxAge: 1000 * 60 * 5
    },
    saveUninitialized: true
  })
);

app
  .use(express.static('public/airnow-dashboard'))
  .use(cors())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(passport.initialize())
  .use(passport.session())
  .use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


// Routes
app
  .use('/', require('./routes/user'))
  .use('/api', require('./routes/api'))
  .use('/esp32', require('./routes/esp32'))
  .use('/admin', require('./routes/admin'))

///////////////////////////////////////////////////
///////////////       RUN      ////////////////////
///////////////////////////////////////////////////

const port = process.env.PORT || 8000;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`
   _____ _   _ _____ ____ ___ ____  
  |_   _| | | | ____/ ___|_ _/ ___| 
    | | | |_| |  _| \\___ \\| |\\___ \\ 
    | | |  _  | |___ ___) | | ___) |
    |_| |_| |_|_____|____/___|____/ 
  `);
  console.log("Server is running in port:", port) ;
})
