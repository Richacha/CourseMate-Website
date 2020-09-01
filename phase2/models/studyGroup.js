const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
	content: String,
	// username
	sender: Object
})

const announcementSchema = new mongoose.Schema({
	title: String,
	content: String,
	// username
	sender: String
})

const StudyGroupSchema = new mongoose.Schema({
  groupName: {
  	type: String,
  	unique: true,
  	minlength: 1
  },
  courseCode: String,
  members: [{type: String, unique: true}],
  groupChat: [messageSchema], 
  announcement: [announcementSchema],
})

const StudyGroup = mongoose.model("StudyGroup", StudyGroupSchema)
module.exports = { StudyGroup }
