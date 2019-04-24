var express = require("express");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');

var app = express();
var PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use (cookieSession({
  name : 'session',
  keys : ["id", "user_id"]
}))

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
b6UTxQ: { longURL: "https://www.tsn.ca",
     userID: "user1RandomID" },
i3BoGr: { longURL: "https://www.google.ca",
     userID: "user2RandomID" }
};

const users = {
  "userRandomID": {
    id: "user1RandomID",
    email: "user@example.com",
    password: bcrypt.hashSync('heh', 10)
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync('232', 10)
  }
}

function urlsForUser(id){
 const userUrl = {};
 for(shortURL in urlDatabase){
   if(urlDatabase[shortURL].userID === id){
     userUrl[shortURL] = urlDatabase[shortURL];
   }
 }
 return userUrl;
}

function generateRandomString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function inputMatch (email, password){
  for (let k in users){
    if (users[id].email === email){
      if (bcrypt.compareSync(password, users[id].password)){
        return users[id];
      }
    }
  }
  return false;
}

app.get("/", (req, res) => {
  res.redirect('/urls');
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let templateVars = {username: req.session.user_id,
                      urls: urlsForUser(req.session.user_id) };

  if (req.session.user_id){
  res.render("urls_index", templateVars);
  } else {
  res.redirect('/login');
  }
});

app.post("/urls", (req, res) => {
  let shortURLLoader = generateRandomString();
  let object = {};
  object['longURL'] = req.body.longURL
  object['userID'] = req.session.user_id;
  urlDatabase[shortURLLoader] = object;
  res.redirect("/urls/");
  console.log("Updated URL dtatabase :  ", urlDatabase)
});

app.get("/urls/new", (req, res) => {
  let templateVars = {username: req.session.user_id};
  res.render("urls_new", templateVars);

});

app.post("/logout", (req, res) => {
   req.session = null;
   res.redirect("/urls");
});

app.get("/login", (req, res) =>{
  let templateVars = {username: req.session.user_id};
  res.render("urls_login", templateVars);
});

// app.post("/login", (req, res) => {
//   req.session('username', req.body.useremail);
//   email = req.body.email;
//   password = req.body.password;
//   let cookie_id = req.session("Cookies ", req.session).userID;
//   let user = userMatch(email.password)
//   if (user) {
//     let userID
//   }
//   ///console.log(req.body.username);
//   res.redirect("/urls");
// });
app.post('/login', function (req, res) {
let user_id = undefined;
 for(let i = 0; i < Object.keys(users).length; i++){
  if((req.body.useremail == users[Object.keys(users)[i]]['email'])){
   user_id = users[Object.keys(users)[i]];
  }
 }
 if(!user_id){
   res.status(403)
   .send('This email does not exist in our records.')
 }else if(user_id && bcrypt.compareSync(req.body.userpass, user_id.password)){
   req.session.user_id = user_id['id'];
   res.redirect('/urls');
 }else{
   res.status(403)
   .send('Your password does not match one on record.');
 }
})

app.get("/register", (req, res) =>{
 let templateVars = { username: req.session.user_id}
 //                       useremail: req.session["user_id"],
 //                       username: req.sesssion["username"]
 // }
  res.render("urls_register", templateVars);
});

// app.post("/register", (req, res) =>{
//   const useremail = req.body.useremail;
//   const userpass = req.body.userpass;
//   let newKey = generateRandomString();
//   users[newKey] = {};
//     if (!useremail || !userpass) {
//       res.status (400);
//       res.send ("Please can you fill in a valid email or password.");
//     } else if (emailChecker(useremail)) {
//       res.status(400);
//       res.send ("This email address already exists.");
//     } else {
//       users[newKey]["id"] = newkey;
//       users[newKey]["email"] = useremail;
//       bcrypt.hashSync(userpass, 10);

//     }
//     let cookie_id = req.session("Cookies ", req.session).user_id;
//     //res.cookie ("user_id", users[newKey]["id"]);
//     res.redirect ("/urls");
// });

app.post("/register", (req, res) => {
 const password = req.body.userpass;
 const email = req.body.useremail;

 if(req.body.useremail == "" || req.body.userpass == ""){
   // HTTP status 400: NotFound
   res.status(400)
  .send('Not found');
 }
 else if (!emailChecker(req.body.useremail)){
   let register = generateRandomString();
   req.session.user_id = register;
   users[register] = {
     id : register,
     email: email,
     password: bcrypt.hashSync(password, 10)};
   res.redirect("/urls");
 } else {
   //Handle Registration Errors
   res.status(400).send("Email already exists");;
 }
})


app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  // console.log("URLDATABASE ", urlDatabase);
  console.log("ShortURL : ", shortURL)
  let templateVars = {username: req.session.user_id,
                      shortURL: req.params.shortURL,
                      longURL: urlDatabase[shortURL].longURL };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[req.params.shortURL];
  ///console.log(longURL);
  if (longURL){
  res.redirect(longURL);
  } else {
    res.send(shortURL, " is not valid.")
  }
});

//app.get("/urls/:id", (req, res) =>{
//   res.render ("urls_show", {shortURL:req.params.id});
//});

app.post("/urls/:id", (req, res) => {
  if (req.session.user_id === undefined){
    res.redirect("/urls");
  } else {
  // var editLink = req.body.longURL;
  urlDatabase[req.params.id].longURL = req.body.longURL;
  res.redirect("/urls");
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  let short = req.params.shortURL;
  delete urlDatabase[short];
  res.redirect("/urls");
});

app.get ("urls/:shortURL/edit"), (req, res) => {
  urlDatabase[req.params.shortURL]["longURL"] = req.body.length;
  const cookieUserid = req.session["user_id"];
  res.redirect("/urls");
}

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

function emailChecker (email) {
  for (id in users){
    if (email === users[id].email){
      return true;
    }
  }
  return false;
}