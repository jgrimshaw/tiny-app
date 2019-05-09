


const PORT = 8080;
const express = require('express');
const cookieSession = require('cookie-session');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['big#secret'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// ==================================================================

const urlDatabase = {};
const usersDatabase = {};

// redirect / to /urls
app.get('/', (req, res) => {
  res.redirect('/urls');
});

// INDEX -- show urls
app.get('/urls', (req, res) => {
  let templateVars = {
    'urls' : urlsForUser(req.session.user_id),
     username: usersDatabase[req.session.user_id]
     };
  res.render('urls_index', templateVars);
});

// NEW
app.get("/urls/new", (req, res) => {
   let templateVars = {
   'urls' : urlDatabase,
   username: usersDatabase[req.session.user_id]
  };
  res.render("urls_new", templateVars);
});

app.post('/urls', (req, res) => {
  let newURL = req.body.longURL;
  let userID = req.session.user_id;
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = {longURL: newURL, userID: userID};
  res.redirect(`/urls`);
});

// SHOW
app.get('/urls/:shortURL', (req, res) => {
  let currentUser = req.session.user_id;
  let urlCreator = urlDatabase[req.params.shortURL].userID;
  if (currentUser === urlCreator) {
    let templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      username: usersDatabase[req.session.user_id]
    };
    res.render('urls_show', templateVars);
  } else {
    res.send('Sorry, access is denied. My show route.');
  }
});


// send user to the long url: ex.lighthouselabs.ca by typing in the browser --  http://localhost:8080/u/b2xVn2
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


// REGISTER
app.get('/register' , (req, res) => {
  let templateVars = {
    'urls' : urlDatabase,
    username: usersDatabase[req.session.user_id]
   };
  res.render('urls_register', templateVars);
});

app.post('/register', (req, res) => {
  let newEmail = req.body.email;
  let newPassword = req.body.password;
  let newId = generateRandomString();
  if (newEmail && newPassword && !findUserEmail(newEmail)) {
    let hashedPassword = bcrypt.hashSync(newPassword, 10);
    usersDatabase[newId] = {
    id: newId,
    email: newEmail,
    password: hashedPassword
  };
    req.session.user_id = newId;
    res.redirect('/urls');
  } else {
  res.sendStatus(400);
  }
});

// LOGIN
app.get('/login', (req, res) => {
  let templateVars = {
    'urls' : urlDatabase,
    username: usersDatabase[req.session.user_id]
    };
  res.render('urls_login', templateVars);
});

app.post('/login', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let id = findUserEmail(email);

  if (id && bcrypt.compareSync(password, usersDatabase[id].password)) {
    req.session.user_id = id;
    res.redirect('/urls');
  } else {
    res.sendStatus(403);
  }
});

// LOGOUT
app.post('/logout', (req, res) => {
  req.session.user_id = null;
  res.redirect('/urls');
});

// EDIT
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.post('/urls/:shortURL', (req, res) => {
  let currentUser = req.session.user_id;
  let urlCreator = urlDatabase[req.params.shortURL].userID;
  if (currentUser === urlCreator) {
    let newURL = req.body.newlongURL;
    let shortURL = req.params.shortURL;
    urlDatabase[shortURL].longURL = newURL;
    res.redirect('/urls');
  } else {
    res.send('Access denied - sorry.');
  }
});


// DELETE
app.post('/urls/:shortURL/delete', (req, res) => {
  let currentUser = req.session.user_id;
  let urlCreator = urlDatabase[req.params.shortURL].userID;
  if (currentUser === urlCreator) {
    let deletingURL = req.params.shortURL;
    delete urlDatabase[deletingURL];
    res.redirect('/urls');
  } else {
      res.send('Sorry, not allowed here.');
  }
});

//=================================================================

// generate random short URL
function generateRandomString() {
 Math.floor(Math.random()*899999+100000);
  const result = Math.random().toString(36).slice(-6);
  return result;
}

// find user by email
function findUserEmail(email) {
  for (let user in usersDatabase) {
    if (usersDatabase[user].email === email) {
      return usersDatabase[user].id;
    }
  }
  return '';
}

// find urls that belong to user
function urlsForUser (id) {
  let userURLs = {};
  for (let url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      userURLs[url] = urlDatabase[url];
    }
  }
  return userURLs;
}

// =================================================================
app.listen( PORT, () => {
  console.log(`Server listening on port: ${PORT} !!!`);
});