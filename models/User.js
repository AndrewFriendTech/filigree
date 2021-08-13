const mongoose = require("mongoose");

const locationSchema = require("./LocationSchema");
const PrivateMessageSchema = require("./PrivateMessageSchema");

const userSchema = new mongoose.Schema({
	username:{
		type: String,
		required: true 
	},
	fullname:{
		type: String,
		required: true
	},
	email:{
		type: String,
		required: true
	},
	password:{
		type: String,
		required: true,
	},
	active:{
		type: String,
		enum:['active','idle','offline'],
		required: false
	},
	friends:{
		type: [String],
		required: false
	},
	messages:{
		type: [PrivateMessageSchema],
		required: false
	},
	newMessages:{
		type: Boolean,
		default: false
	},
	groups:{
		type:[String],
		required: false

	},
	location: {
		type:locationSchema,
		required:false
	},
	pictureURL:{
		type: String,
		required:true
	}
}, {timestamps: true});

const userModel = new mongoose.model("User",userSchema)

module.exports = userModel;