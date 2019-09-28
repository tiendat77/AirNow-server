/* NPM  */
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');

/* User define */
const data = require('./data');


// invoke an instance of express application.
const app = express();

// set our application port
app.set('port', 8000);

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use( bodyParser.json());

// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

app.use(cors());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
  key: 'user_sid',
  secret: 'somerandonstuffs',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000
  }
}));

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie('user_sid');
  }
  next();
});


// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    res.redirect('/dashboard');
  } else {
    next();
  }
};

// route for Home-Page
app.get('/', sessionChecker, (req, res) => {
  res.redirect('/login');
});

// route for user Login
app.route('/login')
  .get(sessionChecker, (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
  })
  .post((req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    
    const user = data.USERS.find(user => user.username === username);

    if (!user) {
      res.status(200).send({ valid: 0, message: "Invalid Username" });
    } else if (user.password != password) {
      res.status(200).send({ valid: 0, message: "Wrong password" });
    } else {
      req.session.user = user.dataValues;
        res.redirect('/dashboard');
    }
  });

// route for user's dashboard
app.get('/dashboard', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.sendFile(__dirname + '/public/dashboard.html');
  } else {
    res.redirect('/login');
  }
});

// route for user logout
app.get('/logout', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.clearCookie('user_sid');
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});

app.get('/api/users', (request, response) => {
  response.status(200).send(data.USERS);
});

app.get('/api/heroes', (request, response) => {
  var id = parseInt(request.query.id);
  var name = request.query.name;
  if (id && !isNaN(id) && name) {
    response.status(200).send([{
      id: id,
      name: 'Dr Nice'
    }, {
      id: 13,
      name: name
    }]);
  } else {
    response.status(200).send(data.HEROES);
  }
});

app.get('/api/statistic', (request, response) => {
  console.log("Statistic request");
  response.status(200).send(data.STATISTIC);
});

// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
});

// start the express server
app.listen(app.get('port'), () => console.log(`Server started on port ${app.get('port')}`));
