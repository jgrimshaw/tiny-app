const PORT = 8080;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

//=====================================================

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

app.get('/', (req, res) => {
  res.redirect('/urls');
});

// INDEX -- show all urls
app.get('/urls', (req, res) => {
  let templateVars = {
    urls: urlDatabase
  };
  res.render('urls_index', templateVars);
});

// NEW
app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

app.post('/urls', (req, res) => {
  console.log(req.body);
  res.send('Ok')
})


// SHOW -- display only the url I click on, alone on the page
app.get('/urls/:shortURL', (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render('urls_show', templateVars)
  // console.log(req.params.shortURL)
  // console.log(urlDatabase[req.params.shortURL])
  });






//=== SERVER =========================================
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}!`)
});
