const { Joi } = require('express-validation');

module.exports = {
	// POST /api/articles
	createArticle: {
		body: Joi.object({
			title: Joi.string().required(),
			desc: Joi.string().required(),
			body: Joi.string().required(),
		}),
	},

	// UPDATE /api/articles/:articleId
	updateArticle: {
		body: Joi.object({
			title: Joi.string().required(),
			desc: Joi.string().required(),
			body: Joi.string().required(),
		}),
		params: Joi.object({
			articleId: Joi.string().hex().required(),
		}),
	},

	// POST /api/articles/:articleId/comment
	createComment: {
		body: Joi.object({
			text: Joi.string().required(),
		}),
	},

	// UPDATE /api/articles/:articleId/comment/:commentId
	updateComment: {
		body: Joi.object({
			text: Joi.string().required(),
		}),
		params: Joi.object({
			articleId: Joi.string().hex().required(),
			commentId: Joi.string().hex().required(),
		}),
	},
};
