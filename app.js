const fs = require('fs');

const httpsOptions = {
  cert: fs.readFileSync('./ssl/certificate.crt'),
  ca: fs.readFileSync('./ssl/ca_bundle.crt'),
  key: fs.readFileSync('./ssl/private.key')
};

const express = require('express');
const http = require('http');
const bodyParser = require('body-parser')
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');

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

app
  .use(express.static('public/airnow-dashboard'))
  .use(cors())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(
    session({
      secret: 'secret_thesis',
      resave: true,
      cookie: {
        maxAge: 1000 * 60 * 5
      },
      saveUninitialized: true
    })
  )
  .use(passport.initialize())
  .use(passport.session());

// Routes
app
  .use('/', require('./routes/user'))
  .use('/api', require('./routes/api'))
  .use('/esp32', require('./routes/esp32'))
  .use('/admin', require('./routes/admin'))
  .use('/device', require('./routes/device'))

///////////////////////////////////////////////////
///////////////       RUN      ////////////////////
///////////////////////////////////////////////////

const port = process.env.PORT || 443;
const hostname = 'airnowuit.xyz';

const server = http.createServer(httpsOptions, app);

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
