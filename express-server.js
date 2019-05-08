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
// console.log(urlDatabase);

app.get('/', (req, res) => {
  res.redirect('/urls');
});

// INDEX -- show all urls
app.get('/urls', (req, res) => {
  let templateVars = {urls: urlDatabase};
  res.render('urls_index', templateVars);
});

// NEW
app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  // console.log(longURL);
  // console.log(shortURL);
  // console.log(req.body);
  res.redirect(`/urls/${shortURL}`)
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

// send user to the long url ex.lighthouselabs.ca by typing in the browser --  http://localhost:8080/u/b2xVn2
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(`http://${longURL}`);
});

// EDIT
app.post('/urls/:id', (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.newURL;
  console.log(urlDatabase)
  res.redirect('/urls')
})

// DELETE
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});




// generate random 6 characters and numbers
function generateRandomString() {
 Math.floor(Math.random()*899999+100000);
  const result = Math.random().toString(36).slice(-6);
  return result;
}




//=== SERVER =========================================
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}!`)
});
