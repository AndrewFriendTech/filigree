const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
	body: {
		type: String,
		required: true
	},
	postedBy:{
		type: String,
		required: true
	},
	fileURL:{
		type: String,
		required: false
	},
	pictureURL:{
		type: String,
		required: false 
	}


},{timestamps: true})

module.exports = MessageSchema;