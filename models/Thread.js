const mongoose = require("mongoose");
const ThreadMessageSchema = require("./ThreadMessageSchema");

const ThreadSchema = new mongoose.Schema({
	title:{
		type: String,
		required: true
	},
	group:{
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	openingPost:{
		type: String,
		required: true
	},
	postedBy:{
		type: String,
		required: true
	},
	messages:{
		type: [ThreadMessageSchema],
		required:false
	}

	
},{timestamps:true})

threadModel = new mongoose.model("Thread",ThreadSchema);

module.exports = threadModel;