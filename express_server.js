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
          userID: "user1RandomID"
        },
i3BoGr: { longURL: "https://www.google.ca",
          userID: "user2RandomID"
        }
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
// Helper Function, to find url________________
function urlsForUser(id){
 const userUrl = {};
 for(shortURL in urlDatabase){
   if(urlDatabase[shortURL].userID === id){
     userUrl[shortURL] = urlDatabase[shortURL];
   }
 }
 return userUrl;
}
// Helper Function, to generate a random string_______
function generateRandomString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
// Helper function, to match user data________________
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

function emailChecker (email) {
  for (id in users){
    if (email === users[id].email){
      return true;
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

// Home page, redirected to login if not logged in_______
app.get("/urls", (req, res) => {
  let user_id = req.session.user_id;
  if (req.session.user_id){
    let templateVars = {
      'user_id' : user_id,
      'urls' : urlsForUser(user_id),
      'email' : (users[user_id] ? users[user_id].email : users[user_id])
    }
    res.render("urls_index", templateVars);
  } else {
    res.redirect('/login');
  }
});
// POST - HomeURL__________________________________________
app.post("/urls", (req, res) => {
  let shortURLLoader = generateRandomString();
  urlDatabase[shortURLLoader] = {
          longURL: req.body.longURL,
          userID : req.session.user_id
  }
  res.redirect("/urls/");
  console.log("Updated URL dtatabase :  ", urlDatabase)
});
//__________________________________________________________
app.get("/urls/new", (req, res) => {
  let user_id = req.session.user_id
  if (!user_id) {
    res.redirect("/login");
  } else {
    let templateVars = {
      'user_id': user_id,
      'urls': urlsForUser(user_id),
      'email': (users[user_id] ? users[user_id].email : users[user_id])
    };
    res.render("urls_new", templateVars);
  };
});
// POST - Deletes a user created URL___________________________
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});
//GET - id ____________________________________________________
app.get("/urls/:id", (req, res) => {

  if (!req.session.user_id) {
    return res.status(401).send('Please login or register');
  }
  let shortURL = req.params.id;
  if (!urlDatabase[shortURL]) {
    return res.status(404).send('TinyURL does not exist');
  }
  if (req.session.user_id !== urlDatabase[shortURL].userID) {
    return res.status(403).send('This URL does not belong to you');
  }
  let templateVars = {
    user_id: req.session.user_id,
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    email: (users[req.session.user_id] ? users[req.session.user_id].email : users[req.session.user_id])
  };
  res.render("urls_show", templateVars);
});
// POST - id _________________________________________________
app.post("/urls/:id", (req, res) => {
  if (!req.session.user_id) {
    return res.status(401).send('Please login or register');
  }

  console.log("These are the req for UserID");
  if (req.session.user_id !== urlDatabase[shortURL].userID) {
    return res.status(403).send('This URL does not belong to you');
  }
  urlDatabase[shortURL].longURL = req.body.longURL;
  res.redirect('/urls');
});

// Logout_________________________________________________
app.post("/logout", (req, res) => {
   req.session = null;
   res.redirect("/urls");
});
// Login__________________________________________________
app.get("/login", (req, res) =>{
  let templateVars = {username: req.session.user_id};
  res.render("urls_login", templateVars);
});
// Login takes user back to main page_____________________
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
    } else if(user_id && bcrypt.compareSync(req.body.userpass, user_id.password)){
      req.session.user_id = user_id['id'];
      res.redirect('/urls');
    } else {
      res.status(403)
      .send('Your password does not match one on record.');
    }
})
//GET - Register_____________________________________________
app.get("/register", (req, res) =>{
 let templateVars = { username: req.session.user_id}
 //                       useremail: req.session["user_id"],
 //                       username: req.sesssion["username"]
 // }
  res.render("urls_register", templateVars);
});
//POST - Register____________________________________________
app.post("/register", (req, res) => {
  const password = req.body.userpass;
  const email = req.body.useremail;
 if(req.body.useremail == "" || req.body.userpass == "") {
   // HTTP status 400: NotFound
   res.status(400)
  .send('Not found');
 } else if (!emailChecker(req.body.useremail)) {
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
//GET -_____________________________________________
// app.get("/urls/:shortURL", (req, res) => {
//   const shortURL = req.params.shortURL;
//   // console.log("URLDATABASE ", urlDatabase);
//   console.log("ShortURL : ", shortURL)
//   let templateVars = {
//     user_id: req.session.user_id,
//     shortURL: req.params.id,
//     longURL: urlDatabase[req.params.id],
//     email: (users[req.session.user_id] ? users[req.session.user_id].email : users[req.session.user_id])
//   };
//   res.render("urls_show", templateVars);
// });

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

app.get ("urls/:shortURL/edit"), (req, res) => {
  urlDatabase[req.params.shortURL]["longURL"] = req.body.length;
  const cookieUserid = req.session["user_id"];
  res.redirect("/urls");
}

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
