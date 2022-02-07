const conn = require('./database');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('./config');

function login(req, res) {
  //looks into req and assigns username and password
  const username = req.body.username;
  const password = req.body.password;
  console.log(password, 'password')

  const user = conn.getUserByUsername(username);
  console.log(user, 'user')
  //checking if user exists in the database
  if (user) {
    //if user exists, compare hashed passsword
    const validPassword = bcrypt.compareSync(password, user.Password);
    console.log(validPassword, 'VALIDPASSWORD');
    //if password does not match return invalid credentials
    if (!validPassword) {
      res.status(401).json({
        status: 'failure',
        message: "Invalid credentials"
      });
      //if password match assign JWT
    } else {
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });
      res.status(200).send({ success: true, token: token });
    }
    //if user doen not exist, return invalid credentials - no user provided
  } else {
    res.status(401).json({
      status: 'failure',
      message: "Invalid credentials"
    });
  }
}

//RESTApi is stateless so we send header and check user is logged in

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, config.secret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};




/*  //making sure call comes from legitimate user
function getLoginStatus(request, response) {
 const token = request.header('Authorization').replace('Bearer ', '');
 
 let result = { loggedIn: false };
 
 if (token) {
   const tokenVerified = jwt.verify(token, config.secret);
 
   console.log('JWT Verify:', tokenVerified);
 
   //if token is not verified, user is not logged in yet,
   //otherwise React can proceed
   if (tokenVerified) {
     result.loggedIn = true;
   }
 }
 
 response.json(result);
} */

exports.login = login;
exports.authenticateJWT = authenticateJWT;

  //exports.getLoginStatus = getLoginStatus;
