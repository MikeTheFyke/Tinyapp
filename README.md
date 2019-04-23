Tiny App is and HTTP server that handles requests from a browser (client) and allows users to shorten long URLs mush like TinyURL .This web app was built using Node and Express.

Functional / Display Requirements

- Site Header
  -> if a user is logged in, the header shows...
    - the users email
      --- currently shows undefined ---
    - a logout button which makes a POST request to logout
  -> if a user is not logged in, the header shows...
    - a link to the login page (/login)
    - a link to the registration page (/register)
      --- currently page is not loading ---

- .GET /
  -> if user is logged in..
    - Minor redirect to /urls
  -> if user is not logged in...
    - Minor redirect to /login

- .GET/urls
  -> if user is logged in...
    - returns HTML with:
    - the site header
    - a list of URLs the user has created,
      each list item containing...
      - a short URL
      - the short URLs matching long URL
        --- currently not displaying ---
      - an edit button which makes a GET request to /urls/:id
      - a delete button which makes a POST request to /urls/:id/delete
    - a link to Create a New Short Link which makes a GET requewst to urls/new
  -> if user is not logged in...
    - redirects to the /login page

- .GET/urls/new
  -> if user is logged in...
    - returns HTML with:
    - a site header
    - a form which contains...
      - a text input field for the original (long) URL
      - a submit button which makes a POST requwest to /urls
  -> if user is not logged in...
    - redirects to the /login page

- .GET/urls/:id
  -> if user is logged in and owns the URL for the given ID:
    - returns HTML with:
    - the site header
    - the short URL
    - a form which contains:
      - the corresponding long URL
      - an update button which makes a post request to /urls/:id
  -> if url for the given ID does not exist...
    - returns HTML with a relevant error message
  -> if user is not logged in...
    - returns HTML with a relevant message
  -> if user is logged it but does not own the URL with the given ID..
    - returns HTML with a relavant message

- .GET/u/:id
  -> if URL for the given ID exists...
    - rewdirects to the corresponding long URL
  -> if URL for the given ID does exist...
    - returns HTML with a relevant message

-.POST/urls
  -> if user is logged in...
    - generates a short URL, saves it and associats it with the user.
    - redirects to /urls/:id where :id matches the ID of the newly saved
    URL.
  -> if user is not logged in...
    - returns HTML with a relevant error message

-.POST/ursl/:id
  -> if user is logged in and owns the url for the given ID...
    - updates the url
    - redirects to /urls
  -> if user os not logged in...
    - returns HTML with a relevant message
  -> if user is logged in but does not own the URL for the given ID...
    returns HTML with the relevant mesaage

-.POST/urls/:id/delete
  -> if user is logged in and owns the url of the given ID...
    - deletes the URL
    - redirects to /urls
  -> if user is not logged in ...
    - returns HTML with a relevant error message
  -> if user is logged in but does not own the URL for the given ID...
    -returns HTML with a relevant message

-.GET/login
  -> if user is logged in...
    - redirects to /urls
  -> if user is not logged in...
    - returns HTML with...
    - a form which contains:
      - input fields for email and password
      - submit button that makes a POST request to /login

-.GET/register
  -> if user is logged in...
    - redirects to /urls
  -> if user is not logged in...
    - returns HTML with:
    - a form which contains:
      - input fields for email and a password
      - a register button that makes a POST request to register

-.POST/login
  -> if email and passwords params match an existing user...
    - sets a cookie
    - redirects to /urls
  -> if email and password params dont match an existing user...
    - returns HTML with a relevant message

-.POST/register
  -> if email or password are empty...
    - returns HTML with a relevant error message
  -> if email already exists...
    - reuturns HTML with a relevant error message
  -> otherwise
    - creates a new user
    - encrypts the new users password with bcrrypt
    - sets a cookie
    - redirects to /urls

-.POST/logout
  -> deletes cookie
  -> redirects to /urls


Dependencies include

cookie-parser
body-parser
express
