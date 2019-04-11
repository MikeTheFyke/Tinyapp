var express = require("express");
const cookieParser = require('cookie-parser');
var app = express();
var PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use (cookieParser());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/urls", (req, res) => {
  let templateVars = {username: req.cookies["username"], urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls/new", (req, res) => {
  let templateVars = {username: req.cookies["username"]};
  res.render("urls_new", templateVars);
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
})

app.post("/login", (req, res) => {
  res.cookie ('username', req.body.username);
  res.redirect("/urls");
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {username: req.cookies["username"], shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  console.log(longURL);
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  var shortURLLoader = generateRandomString();
  urlDatabase[shortURLLoader] = req.body.longURL;
  res.redirect("/urls/" + shortURLLoader);
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.get("/urls/:id", (req, res) =>{
  res.render ("urls_show", {shortURL:req.params.id});
});

app.post("/urls/:id", (req, res) => {
  var editLink = req.body.longURL;
  urlDatabase[req.params.id] = editLink
  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  let short = req.params.shortURL;
  delete urlDatabase[short];
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

function generateRandomString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}