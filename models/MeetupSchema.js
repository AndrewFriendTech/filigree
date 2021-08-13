const mongoose = require("mongoose");
const LocationSchema = require("./LocationSchema")

const MeetupSchema = new mongoose.Schema({
    location:{
        type:LocationSchema,
        required:true
    },
    date:{
        type:Date,
        required:true
      }
},{timestamps: true})

module.exports = MeetupSchema;