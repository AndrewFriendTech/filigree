const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt.json");

function verifyToken(req, res, next) {
	// Get auth header value
	const bearerHeader = req.headers['authorization'];
	// Check if bearer is undefined
	if(typeof bearerHeader !== 'undefined') {
	  // Split at the space
	  const bearer = bearerHeader.split(' ');
	  // Get token from array
	  const bearerToken = bearer[1];
	  // Set the token
	  req.token = bearerToken;
	  //check token is valid
	  jwt.verify(bearerToken,jwtConfig.secretkey,(err,data) =>{
		  if(err)
		  {
			res.status(403);
			res.send({error: "invalid token"});
		  }
		  else
		  {
			  req.currentUser = data.username;
			  next();
		  }
	  })
	  // Next middleware
	  //next();
	} else {
	  // Forbidden
	  res.status(403);
	  res.send({error: "No token in header"});
	}
  
  }

  module.exports = verifyToken;