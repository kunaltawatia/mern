const mongoose = require('mongoose');
const Article = require('./articles.model');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

/**
 * Load articles and append to req.
 */
function load(req, res, next, id) {
	Article.get(id)
		.then((article) => {
			req.article = article;
			return next();
		})
		.catch(
			/* istanbul ignore next : handled by param-validation or load*/
			(e) => next(e),
		);
}

/**
 * Authorize permission to perform action
 * on the loaded article by requesting user
 *
 * @param {object} req.article 	//	loaded article to perform operation
 * @param {object} req.user		//	requesting user
 */
function authorize(req, res, next) {
	if (req.article.author.email !== req.user.email) {
		return next(
			new APIError(
				'Not authorized to perform this action',
				httpStatus.UNAUTHORIZED,
				true,
			),
		);
	}
	next();
}

/**
 * Get article
 * @returns {Article}
 */
function get(req, res) {
	const article = req.article;

	//	find if user has already viewed the article
	const view = article.views.find(({ email }) => email === req.user.email);

	if (!view) {
		article.views.push(req.user);
	}

	article
		.save()
		.then((savedArticle) => res.json({ article: savedArticle }))
		.catch(
			/* istanbul ignore next : handled by param-validation or load*/
			(e) => next(e),
		);
}

/**
 * Create new article
 * @property {string} req.body.title - The title of article.
 * @property {string} req.body.desc - The short description of article.
 * @property {string} req.body.body - The body of article.
 * @property {object} req.user - The authenticated user posting.
 * @returns {Article}
 */
function create(req, res, next) {
	const { body } = req.body;
	const article = new Article({
		...req.body,
		author: req.user,
		timeToRead:
			body && body.length && Math.floor(body.split(' ').length / 200) + 1,
	});

	article
		.save()
		.then((savedArticle) => res.json({ article: savedArticle }))
		.catch(
			/* istanbul ignore next : handled by param-validation or load*/
			(e) => next(e),
		);
}

/**
 * Update existing article
 * @property {string} req.body.title - The title of article.
 * @property {string} req.body.desc - The short description of article.
 * @property {string} req.body.body - The body of article.
 * @returns {Article}
 */
function update(req, res, next) {
	const article = req.article;
	const { body } = req.body;

	article.title = req.body.title;
	article.desc = req.body.desc;
	article.body = req.body.body;
	article.timeToRead =
		body && body.length && Math.floor(body.split(' ').length / 200) + 1;

	article
		.save()
		.then((savedArticle) => res.json({ article: savedArticle }))
		.catch(
			/* istanbul ignore next : handled by param-validation or load*/
			(e) => next(e),
		);
}

/**
 * Get articles list.
 * @property {number} req.query - articles list query.
 * @returns {Article[]}
 */
function list(req, res, next) {
	const {
		page = 0,
		search = '',
		fieldToSort = 'createdAt',
		sortDirection = -1,
		user = '',
	} = req.query;

	const limit = 5;
	const skip = limit * page;

	const regex = new RegExp(
		`(${search
			//	seperate words
			.split(' ')
			//	filter out empty words
			.filter((word) => word.length > 0)
			//	sanitize regexp
			.map(
				/* istanbul ignore next : idk why it is not detecting :(*/
				(word) => word.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&'),
			)
			//	join regexp
			.join(')|(')})`,
		'i',
	);

	const matchSearch = {
		$or: ['title', 'desc', 'author.name'].map((field) => ({
			[field]: { $regex: regex },
		})),
	};

	Article.aggregate()
		.match({
			...(search.length ? matchSearch : {}),
			...(mongoose.Types.ObjectId.isValid(user)
				? {
						'author._id': mongoose.Types.ObjectId(user),
				  }
				: {}),
		})
		.project({
			body: 0,
			__v: 0,
		})
		.addFields({
			views: {
				$size: '$views',
			},
			likes: {
				$size: '$likes',
			},
			comments: {
				$size: '$comments',
			},
		})
		.sort({
			[fieldToSort]: parseInt(sortDirection, 10),
			...(fieldToSort !== 'createdAt' ? { createdAt: -1 } : {}),
		})
		.skip(+skip)
		.limit(+limit)
		.exec()
		.then((articles) => res.json({ articles }))
		.catch(
			/* istanbul ignore next : handled by param-validation or load*/
			(e) => next(e),
		);
}

/**
 * Delete article.
 * @returns {Article}
 */
function remove(req, res, next) {
	const article = req.article;
	article
		.remove()
		.then((deletedArticle) => res.json({ article: deletedArticle }))
		.catch(
			/* istanbul ignore next : handled by param-validation or load*/
			(e) => next(e),
		);
}

/**
 * Like/upvote a article
 * @property {object} req.article - The loaded article to perform this action upon.
 * @property {object} req.user - The authenticated user posting.
 * @returns {Article}
 */
function likeArticle(req, res, next) {
	const article = req.article;

	//	find if user has already upvoted the article
	const upvote = article.likes.find(({ email }) => email === req.user.email);

	if (upvote) {
		article.likes.id(upvote._id).remove();
	} else {
		article.likes.push(req.user);
	}

	article
		.save()
		.then((savedArticle) =>
			res.json({ likes: savedArticle.likes, article: savedArticle }),
		)
		.catch(
			/* istanbul ignore next : handled by param-validation or load*/
			(e) => next(e),
		);
}

/**
 * Load comment and append to req.
 * @param {object} req.article 	//	loaded article to perform operation
 */
function loadComment(req, res, next, id) {
	req.comment = req.article.comments.id(id);

	if (!req.comment) {
		return next(
			new APIError(
				'Comment not found to perform operation',
				httpStatus.BAD_REQUEST,
				true,
			),
		);
	}

	next();
}

/**
 * Authorize permission to perform action
 * on the loaded article by requesting user
 *
 * @param {object} req.article 	//	loaded article to perform operation
 * @param {string} req.params.commentId 	//	loaded article to perform operation
 * @param {object} req.user		//	requesting user
 */
function authorizeComment(req, res, next) {
	if (req.comment.author.email !== req.user.email) {
		return next(
			new APIError(
				'Not authorized to perform this action',
				httpStatus.UNAUTHORIZED,
				true,
			),
		);
	}
	next();
}

/**
 * Create new comment
 * @property {string} req.body.text - The body of comment.
 * @property {object} req.article - The loaded article to perform this action upon.
 * @property {object} req.user - The authenticated user posting.
 * @returns {Comment, Article}
 */
function createComment(req, res, next) {
	const article = req.article;

	//	add comment in the comments field
	article.comments.push({ text: req.body.text, author: req.user });

	//	get the latest added comment
	const comment = article.comments[article.comments.length - 1];

	article
		.save()
		.then((savedArticle) => res.json({ comment, article: savedArticle }))
		.catch(
			/* istanbul ignore next : handled by param-validation or load*/
			(e) => next(e),
		);
}

/**
 * Update existing comment
 * @property {string} req.body.text - The body of comment.
 * @property {hex} req.comment - The comment to be updated.
 * @property {object} req.article - The loaded article to perform this action upon.
 * @returns {Comment, Article}
 */
function updateComment(req, res, next) {
	const article = req.article;

	req.comment.text = req.body.text;

	article
		.save()
		.then((savedArticle) =>
			res.json({ comment: req.comment, article: savedArticle }),
		)
		.catch(
			/* istanbul ignore next : handled by param-validation or load*/
			(e) => next(e),
		);
}

/**
 * Delete a comment
 * @property {hex} req.params.commentId - The id of comment to be updated.
 * @property {object} req.article - The loaded article to perform this action upon.
 * @returns {Comment, Article}
 */
function removeComment(req, res, next) {
	const article = req.article;

	req.comment.remove();

	article
		.save()
		.then((savedArticle) =>
			res.json({ comment: req.comment, article: savedArticle }),
		)
		.catch(
			/* istanbul ignore next : handled by param-validation or load*/
			(e) => next(e),
		);
}

module.exports = {
	authorize,
	load,
	get,
	create,
	update,
	list,
	remove,
	likeArticle,
	loadComment,
	authorizeComment,
	createComment,
	updateComment,
	removeComment,
};
