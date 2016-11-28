var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
	body: String,
	author: String,
	upvotes: {type: Number, default: 0},
	item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' }
});

mongoose.model('Comment', CommentSchema);