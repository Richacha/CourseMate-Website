const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
  sender: String,
  message: String
});


const FriendChatSchema = new mongoose.Schema({
  chatters: [String],
  history: [MessageSchema]
})

const FriendChat = mongoose.model('FriendChat', FriendChatSchema)

module.exports = { FriendChat }
