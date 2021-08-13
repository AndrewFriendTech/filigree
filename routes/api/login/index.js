const express = require('express');
const jwt = require('jsonwebtoken')
const router = express.Router();

const User = require("../../../models/User");

//configuration for jwt
const jwtConfig = require("../../../config/jwt.json");

//login route to get JWT token
/*
username and password must be provided in a JSON
object posted with request in form of
{username: <username>, password: <password>} 
*/

router.post("/" ,(req,res) =>{
	if(!(req.body.username && req.body.password))
	{
		res.status(500).json({error:"no username or password in request"});
	}
	else
	{
		User.findOne({username:req.body.username},(err,result) =>
		{
			if(err)
			{
				res.status(400).json({error: err});
			}
			else
			{
				if(result){
					if(req.body.password == result.password)
					{
						//payload must be an object literal
						jwt.sign({username :result.username}, jwtConfig.secretkey , jwtConfig.options, (err, token) => {
							if(err)
							{
								console.log(err);
								res.status(500).json(err);
							}
							else
							{
								console.log(token);
								res.json({
									success:"user logged in",
									token:token,
									username: result.username
								});
							}
						});
					}
					else
					{
						res.status(403).json({error:"incorrect password"})
					}
				}
				else res.status(403).json({error:"user not found"});
			}
		})
	}	
})

module.exports = router;
