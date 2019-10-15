const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 8000;
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/air-now-login'));
});


//MOCK DATA
USERS = [
  {
    username: 'github',
    password: 'github'
  },
  {
    username: 'tiendat',
    password: 'tiendat'
  },
];

app.route('/login')
.get((request, response) => {
  response.sendFile(path.join(__dirname + '/public/air-now-login'));
})
.post((req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  
  const user = USERS.find(user => user.username === username);

  if (!user) {
    res.status(200).send({ valid: 0, message: "Invalid Username" });
  } else if (user.password != password) {
    res.status(200).send({ valid: 0, message: "Wrong password" });
  } else {
    //req.session.user = user.dataValues;
      res.redirect('/dashboard');
  }
});

app.route('/dashboard').get((req, res) => {
  res.status(200).sendFile(path.join(__dirname + '/public/air-now'));
})

const server = http.createServer(app);

server.listen(port, () => { console.log("Server is running in port:", port) })