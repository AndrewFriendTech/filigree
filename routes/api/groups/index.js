const express = require('express');
const router = express.Router();
const Group = require("../../../models/Group");
const Thread = require("../../../models/Thread");
const verifyToken = require("../../../lib/verifyToken");

router.use(verifyToken);

/*

if an operation is successful, send the user a response like:
res.json({success:"user posted"})

if an error send the user an object like
res.status(400).json{error:"group with name already exists"}


if its a mongodb error send it as 

res.status(400).json{error:err}

*/
//get all groups
router.get("/",(req,res) => {
	Group.find({},"name location description pictureURL", (err,results)=>{
		if(err){
			res.status(500).json({error:err});
		}else{
			res.json(results);
		}
	});
});


/******
 *  adding and deleting
 */

//add a group to the server
router.post("/",(req,res) => {
	let newGroup = new Group(req.body);
	newGroup.save()
	.then((result)=> res.json({succes:"group added to database",result}))
	.catch((err) =>{
		if(err.code == 11000){
			res.status(400).json({error:"group with name already exists"})
		}else{
			res.status(500).json({error:err});
		}
	});
});

//delete group from server
router.delete("/:id",(req,res)=>{
	//New by Arek
	//Check if group exists and if so delete it.
	Group.exists({_id:req.params.id}, (err,exists)=>{
		if(err){
			res.status(400).json({error:"id is invalid or does not exist"})
		}else {
			Group.deleteOne({_id:req.params.id},(err,result)=>{
				if(err){
					res.status(404).json({error:err})
				} else{
					res.json({success:"group has been deleted from group list"});
					return;
				}
			})
		}
	})
});


/******
 *  threads
 */

//get all the threads in a group.
//use Group.findByID to find by id
// :group_id is a placeholder where you can accsess what is placed
//there with req.params.group_id
router.get('/:group_id/threads', (req,res)=>{
	Thread.find({group:req.params.group_id},(err,result)=>{
		if(err){
			res.status(400).json({error:err})
		}else{
			res.json(result);
		}		
	})
});

//start a thread on a group
/*
user sends object of form
	
{
	title:<string>,
	openingPost:<string>
}

you need to add postedBy field. 
current user is stored at req.currentUser


*/



router.post('/:group_id/threads', (req,res)=>{	
	Group.exists({_id:req.params.group_id},(err,exists)=>{
		if(err){
			res.status(400).json({error:err});
			return
		}
		if(exists){
			//first create a new thread object
			let newThread = new Thread({
				title: req.body.title,
				openingPost: req.body.openingPost,
				postedBy:req.currentUser,
				group:req.params.group_id		
			});
			//save it in db
			newThread.save()
			.then((result)=> {
				let threadResponse = result;
				//then push threadId into group object threads array
				Group.updateMany({_id:req.params.group_id},{$push:{threads:result._id}},
					(err,result)=>{
						console.log("this callback");
						if(err){
							res.status(500).json({error:err})
						}else{
							if(result){
								res.json({success:"thread created",
											thread: threadResponse,
											result})
							}else{
								res.status(500).json({error:"thread object saved but can't push to group"})
							}
						}
					})
			})
			.catch((promiseErr) =>{
				console.log("other callaback")
				//error code for unique field error ( i think)
				if(promiseErr.code == 11000){
					res.status(400).json({error:"thread with title already exists"})
				}else{
					res.status(400).json({error:promiseErr});
				}
			});
		}else{
			res.status(400).json({error:"group id does not exist"});
		}
	})
	
});

// push a meetup to a group

router.post("/:group_id/meetups", (req,res)=> {
	Group.updateOne({_id:req.params.group_id}
		,{$push:{meetups:req.body}}
		,{ runValidators: true }
		,(err,result)=>{
			if(err) res.status(500).json({error:err});
			else{
				if(result.nModified===1)
					res.json({success:"meetup set"})
				else
					res.status(400).json({error:"group with id can not be found"});	
			}
		});
});

module.exports = router;