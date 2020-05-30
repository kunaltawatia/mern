const express = require('express');
const { validate } = require('express-validation');
const paramValidation = require('../../config/param-validation');
const articlesCtrl = require('./articles.controller');
const authenticate = require('../middlewares/authentication');

const router = express.Router(); // eslint-disable-line new-cap

router
	.route('/')
	/** GET /api/articles - Get list of articles */
	.get(articlesCtrl.list)

	/** POST /api/articles - Create new articles */
	.post(
		authenticate,
		validate(paramValidation.createArticle, {}, {}),
		articlesCtrl.create,
	);

router
	.route('/:articleId')
	/** ALL of the following routes are protected */
	.all(authenticate)

	/** GET /api/articles/:articleId - Get articles */
	.get(articlesCtrl.get)

	/** PUT /api/articles/:articleId - Update articles */
	.put(
		validate(paramValidation.updateArticle, {}, {}),
		articlesCtrl.authorize,
		articlesCtrl.update,
	)

	/** DELETE /api/articles/:articleId - Delete articles */
	.delete(articlesCtrl.authorize, articlesCtrl.remove);

router
	.route('/:articleId/like')
	/** POST /api/articles/:articleId/like - upvote/downvote a article*/
	.get(authenticate, articlesCtrl.likeArticle);

router
	.route('/:articleId/comments')
	/** POST /api/articles/:articleId/comments - Create new comment */
	.post(
		authenticate,
		validate(paramValidation.createComment, {}, {}),
		articlesCtrl.createComment,
	);

router
	.route('/:articleId/comments/:commentId')
	/** ALL of the following routes are protected */
	.all(authenticate)

	/** PUT /api/articles/:articleId/comments/:commentId - Update comments */
	.put(
		validate(paramValidation.updateComment, {}, {}),
		articlesCtrl.authorizeComment,
		articlesCtrl.updateComment,
	)

	/** DELETE /api/articles/:articleId/comments/:commentId - Delete comments */
	.delete(articlesCtrl.authorizeComment, articlesCtrl.removeComment);

/** Load articles when API with articleId route parameter is hit */
router.param('articleId', articlesCtrl.load);

/** Load comment when API with commentId route parameter is hit */
router.param('commentId', articlesCtrl.loadComment);

module.exports = router;
