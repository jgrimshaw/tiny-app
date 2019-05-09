
const PORT = 8080;
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set('view engine', 'ejs');

//=================================================

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

const users = {
  'userRandomID': {
    id: 'userRandomID',
    email: 'user@example.com',
    password: 'purple-monkey-dinosaur'
  },
 'user2RandomID': {
    id: 'user2RandomID',
    email: 'user2@example.com',
    password: 'dishwasher-funk'
  }
}

//==================================================

app.get('/', (req, res) => {
  res.redirect('/urls');
});


// INDEX -- show all urls
app.get('/urls', (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies['username']
  };
  res.render('urls_index', templateVars);
});

// NEW
app.get('/urls/new', (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies['username']
  };
  res.render("urls_new", templateVars);
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  res.redirect('urls');
});



//SHOW -- display only the url I click on, alone on the page
app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    shortURL: req.params.shortURL,
    longURL:  urlDatabase[req.params.shortURL],
    username: req.cookies['username']
  };
  res.render('urls_show', templateVars);
});

app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.newURL;
  res.redirect(`/urls/${shortURL}`);
});

// send user to the long url: ex.lighthouselabs.ca by typing in the browser --  http://localhost:8080/u/b2xVn2
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


// REGISTER
app.get('/register', (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    users: users,
    user_id: req.cookies['username']
  };
  res.render('urls_register', templateVars);
});

app.post('/register', (req, res) => {
  // add new user object to the global object

  const email = req.body.email;
  const password = req.body.password;

  const id = generateRandomString();
  users[id] = {
     'id': id,
     'email': email,
     'password': password
    };
    res.cookie('user_id', id);
    res.redirect('/urls');
});



//LOGIN
app.get("/login", (req, res) => {
  // res.cookie('user_id', req.body.id);
  res.render("urls_login");
});

app.post('/login', (req, res) => {
  res.cookie('username', req.body.username);
  res.render('/urls_login');
});

// LOGOUT
app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});


// EDIT
app.post('/edit/:shortURL', (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.newURL;
  console.log(urlDatabase);
  res.redirect('/urls');
});


// DELETE
app.post('/urls/:shortURL/delete', (req, res) => {
  console.log(req.params.shortURL);
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});


// generate random short URL
function generateRandomString() {
 Math.floor(Math.random()*899999+100000);
  const result = Math.random().toString(36).slice(-6);
  return result;
};



//=====================================================
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});








