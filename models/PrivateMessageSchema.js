const mongoose = require("mongoose");

const PrivateMessageSchema = new mongoose.Schema({
	title:{
		type:String,
		required: true
	},
	body: {
		type: String,
		required: true
	},
	postedBy:{
		type: String,
		required: true
	}
},{timestamps: true})

module.exports = PrivateMessageSchema;