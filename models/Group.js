const mongoose = require("mongoose");
const LocationSchema = require("./LocationSchema");
const MeetupSchema = require("./MeetupSchema");

const groupSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	location: {
		type: LocationSchema,
		required: true
	},
	description:{
		type: String,
		required: true
	},
	threads:{
		type: [mongoose.Schema.Types.ObjectId],
		required: false
	},
	pictureURL:{
		type: String,
		required:true
	},
	members:{
		type: [String],
		required: false
	},
	meetups:{
		type: [MeetupSchema],
		required:false
	}
},{timestamps: true})

const groupModel = new mongoose.model("Group",groupSchema)

module.exports = groupModel;