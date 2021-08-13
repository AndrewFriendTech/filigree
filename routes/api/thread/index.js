const express = require('express');
const router = express.Router();
const Group = require("../../../models/Group");
const Thread = require("../../../models/Thread");
const verifyToken = require("../../../lib/verifyToken");

router.use(verifyToken);

router.get("/:thread_id/messages",(req,res)=>{
	Thread.findOne({_id:req.params.thread_id},"messages",(err,result)=>{
		if(err){
			res.status(500).json({error:err})
		}else if(result){
			res.json(result.messages);
		}else{
			res.status(400).json({error:"thread not found"});
		}
	})
});

router.post("/:thread_id/messages",(req,res)=>{
	let message = {
		body: req.body.body,
		postedBy: req.currentUser
	};
	if(req.body.fileURL) message.fileURL = req.body.fileURL;
	Thread.updateOne({_id:req.params.thread_id},
		{$push:{messages:message}},
		(err,result)=>{
			if(err){
				res.status(400).json({error:err});
			} else {
				if(result.nModified == 1){
					res.json({"success":"message posted to thread",result});
				}else{
					res.status(400).json({"error":"thread not found"})
				}
			}
		})							
});

module.exports = router;