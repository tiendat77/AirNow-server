const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 8000;

app
  .use(express.static('public/air-now-login'))
  .use(express.static('public/air-now'))
  .use(bodyParser.urlencoded({
    extended: true
  }))
  .use(bodyParser.json())
  .use(cors());


// Routes
app
  .use('/', require('./routes/index'))
  .use('/user', require('./routes/user'))
  .use('/api', require('./routes/api'))
  .use('/esp32', require('./routes/esp32'))

const server = http.createServer(app);

server.listen(port, () => { console.log("Server is running in port:", port) })