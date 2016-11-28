var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

// GET items < json list
var mongoose = require('mongoose');
var Item = mongoose.model('Item');
var Comment = mongoose.model('Comment');

router.get('/items', function(req, res, next) {
	Item.find(function(err, items) {
		if(err) { return next(err); }

		res.json(items);
	});
});

// POST items
router.post('/items', function(req, res, next) {
	var item = new Item(req.body);

	item.save(function(err, item) {
		if(err){ return next(err); }

		res.json(item);
	});
});

// Post comments on items
router.post('/items/:item/comments', function(req, res, next) {
	var comment = new Comment(req.body);
	comment.item = req.item;

	comment.save(function(err, comment) {
		if (err) { return next(err); }

		req.item.comments.push(comment);
		req.item.save(function(err, item) {
			if(err) { return next(err); }

			res.json(comment);
		});
	});
});

// retrieve items based on :item query
router.param('item', function(req, res, next, id) {
	var query = Item.findById(id);

	query.exec(function (err, item) {
		if (err) { return next(err); }
		if (!item) { return next(new Error('can\'t find item')); }

		req.item = item;
		return next();
	});
});

router.param('comment', function(req, res, next, id) {
	var query = Comment.findById(id);

	query.exec(function (err, comment) {
		if (err) { return next(err); }
		if (!comment) { return next(new Error('can\'t find item')); }

		req.comment = comment;
		return next();
	});
});

router.get('/items/:item', function(req, res) {
	res.json(req.item);
});

router.put('/items/:item/upvote', function(req, res, next) {
	req.item.upvote(function(err, item) {
		if (err) { return next(err); }

		res.json(item);
	});
});

router.put('/items/:item/downvote', function(req, res, next) {
	req.item.upvote(function(err, item) {
		if (err) { return next(err); }

		res.json(item);
	});
});

router.put('/items/:item/comments/:comment/upvote', function(req, res, next) {
	req.comment.upvote(function(err, comment) {
		if (err) { return next(err); }

		res.json(comment);
	});
});

router.put('/items/:item/comments/:comment/downvote', function(req, res, next) {
	req.comment.upvote(function(err, comment) {
		if (err) { return next(err); }

		res.json(comment);
	});
});

router.get('items/:item', function(req, res, next) {
	req.item.populate('comments', function( err, item) {
		if (err) {return next(err); }

		res.json(item);
	});
});

module.exports = router;






