//express imports
const express = require('express');
const router = express.Router();

//mongoose schemas
const User = require("../../../models/User");
const Group = require("../../../models/Group");

//authencation middleware
const verifyToken = require("../../../lib/verifyToken");

//post new user to database
router.post("/",(req,res)=>
{
	let newUser = new User(req.body);
	User.exists({username:req.body.username},(err,exists)=>{
		if(err){
			res.status(400).json({error:err});
		}else{
			if(exists){
				res.status(400).json({error:"user already exists"});
			}
			else{
				newUser.save()
				.then((result)=> res.json({success:"user posted"}))
				.catch((err) => res.status(400).json({error:err}))
			}
		}
	})
	
})

/**********************
 * profile
 */

//find user profile by username
router.get("/:username/profile",verifyToken,(req,res)=>{
	//if the user paramter is "current", take the username from the verifcation token
	if(req.params.username == "current")
	{
		req.params.username = req.currentUser;
	}
	User.findOne({username: req.params.username}, (err,result)=>
	{
		if(err)
		{
			res.status(400).json({error: "Databse Error, see server logs"});
			console.log(JSON.stringify(err));
		}
		else
		{
			if (result){
				//include only information other users should be able to see
				res.json({
					username:result.username,
					fullname:result.fullname,
					active:result.active,
					friends:result.friends,
					groups:result.groups,
					location:result.location,
					createdAt:result.createdAt,
					pictureURL:result.pictureURL

				});
			} 
			else{
				res.status(404).json({error:"user not found"});
			}
		}
	});
})

router.get("/:username/breif_profile",verifyToken,(req,res)=>{
	//if the user paramter is "current", take the username from the verifcation token
	if(req.params.username == "current")
	{
		req.params.username = req.currentUser;
	}
	User.findOne({username: req.params.username}, (err,result)=>
	{
		if(err)
		{
			res.status(400).json({error: "Databse Error, see server logs"});
			console.log(JSON.stringify(err));
		}
		else
		{
			if (result){
				res.json({
						username: result.username,
						fullname: result.fullname,
						active: result.active
					}
				)
			} 
			else{
				res.status(404).json({error:"user not found"});
			}
		}
	});
})


/**********************
 * groups
 */

//add the user to a group
router.post("/current/groups/:id",verifyToken,(req,res)=>
{
	//first check if group wanted to add exists
	Group.exists({_id:req.params.id}, (err,exists)=>{
		if(err){
			res.status(400).json({error:"id is invalid or does not exist"})
		} else {
			if(exists){
				/*if it does, first add the current user to the members 
				array of the group object*/
				Group.findByIdAndUpdate(req.params.id, 
					{$addToSet:{members:req.currentUser}},
					(err,result) =>{
						if(err)
						{
							res.status(400).json({error:err})
						} else {
							//and then add the group to the groups array of the user
							User.updateOne({username:req.currentUser},
								{$addToSet:{groups:req.params.id}},
								(err,result)=>{
								if(err){
									res.status(400).json({error:err})
								} else{
									res.json({success:"group joined"});
									return;
								}
							})
						}

					})
			}
			else{
				res.status(400).json({error:"id does not exist"})
			}
		}
	});

})

//leave a group
router.delete("/current/groups/:id",verifyToken,(req,res)=>{
	//first delete from user member's array
	User.updateOne({username:req.currentUser},
		{$pull:{groups:req.params.id}},
		(err,result) => {
			if(err){
				res.status(500).json({error:err});
			}
			else{
				//then delete from group
				Group.findByIdAndUpdate(req.params.id,{$pull: {members:req.currentUser}},
					(err,result) => {
						if(err){
							res.status(400).json({error:"id is invalid or does not exist"});
						}
						else{
							res.json({success:"user has left group"});
						}
					});
				
		}
	})

});

//get all the groups a user is a member 
router.get("/current/groups",verifyToken,(req,res)=>{
	User.findOne({username:req.currentUser},(err,result)=>{
		if(err){
			res.status(500).json({error:err});
		} else {
			if(result){
				Group.find({_id:{$in:result.groups}},(err,result)=>{
					if(err){
						res.status(500).json({error:err});
					} else{
						if(result){
							res.json(result);
						}
						else{
							res.status(400).json({error:"user is not in any groups"})
						}
					}
				})
			}
		}
	})
});

/**********************
 * Friends
 */

//add a friend to the users friend array
router.post("/current/addFriend/:username",verifyToken,(req,res)=>{
	//check user exists
	User.exists({username:req.params.username}, (err,exists) => {
		if(exists){
			User.updateOne({username:req.currentUser},
				{$addToSet:{friends:req.params.username}},
				(err,result) => {
					if(err){
						res.status(500).json({error:err});
					}
					else
					{
						res.json({success:"user added to friends list"})
					}
		
				})
		}else{
			res.status(400).json({error:"user you want to add does not exist"})
		}
	});
});

//remove a friend from the users friend array

router.delete("/current/removeFriend/:username",verifyToken,(req,res)=>{
	User.updateOne({username:req.currentUser},{$pull:{friends:req.params.username}},(err,result) => {
		if(err){
			res.status(500).json({error:err});
		}
		else{
			res.json({success:"user has been deleted from friends list"});
		}
	})

});

/**********************
 * Messages
 */

 //get messages
router.get("/current/messages",verifyToken,(req,res)=>{
	filter = {username:req.currentUser}	
	User.findOne(filter)
	.select("messages")
	.exec((err,result)=>{
		if(err){
			res.status(400).json({error:err})
		}else{
			User.updateOne({username:req.currentUser},
				//once youve got the messages, update the db so you know its been checked 
				{$set:{newMessages:false}},
				(err)=>{
					if(err){
						res.status(500).json({error:err})
					} else{
						res.json(result.messages);
					}
				})
		}	
	})
})

//check to see if their has been any new messages

router.get("/current/newMessages",verifyToken,(req,res)=>{
	filter = {username:req.currentUser}	
	User.findOne(filter)
	.select("newMessages")
	.exec((err,result)=>{
		if(err){
			res.status(500).json({error:err})
		} else {
			res.json(result.newMessages);
		}
	})
});

router.post("/:username/messages",verifyToken,(req,res)=>{ 
	if(req.body === "" || typeof(req.body) === "undefined"){
		res.status(400).json({error:"message must have a body"});
		return;
	}

	let message = {title:req.body.title,body:req.body.body, postedBy: req.currentUser};

	User.exists({username:req.params.username}, (err,exists) => {
		if(err) res.status(500).json({error:err})
		if(exists){
			User.updateOne({username:req.params.username},
				{$push: {messages:message} },
				{ runValidators: true },
				(err,result)=>{
					if(err){
						res.status(400).json({error:err})
					}else{
						User.updateOne({username:req.params.username},
							{$set:{newMessages:true}},(err,result)=>{
								if(err){
									res.status(500).json({error:err})
								}else{
									res.json({success:"message sent"});
								}
							});
						
					}
				}
			);
		} else {
			res.status(400).json({error:"user does not exist"})
		}
	});
})

module.exports = router;

var exampleUser =
{
	username:"ElBarto88",
	password:"somePassword",
	fullname:"Bart Simpson",
	location:{
		type: "Point",
		coordinates:[100,20]
	}
}