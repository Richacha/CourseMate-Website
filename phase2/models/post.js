const mongoose = require('mongoose')

const ReplySchema = new mongoose.Schema({
	creator: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},

	content: {
		type: String,
		required: true,
		minlength: 1
	}
});

const PostSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		minlength: 1
	}, 
	content: {
		type: String,
		required: true,
		minlength: 1
	},
	creator: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	replies: [ReplySchema]
});

const Post = mongoose.model('Post', PostSchema);

module.exports = { Post };
