const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

const { ProfileSchema } = require('../profile/profile.model');

/**
 * Comment Schema
 */
const CommentSchema = new mongoose.Schema({
	text: {
		type: String,
		required: true,
		trim: true,
	},
	author: ProfileSchema,
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

/**
 * Article Schema
 */
const ArticleSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		trim: true,
	},
	desc: {
		type: String,
		required: true,
		trim: true,
	},
	body: {
		type: String,
		required: true,
		trim: true,
	},
	author: ProfileSchema,
	comments: [CommentSchema],
	likes: [ProfileSchema],
	views: [ProfileSchema],
	createdAt: {
		type: Date,
		default: Date.now,
	},
	timeToRead: {
		type: Number,
		default: 0,
	},
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
ArticleSchema.method({});

/**
 * Statics
 */
ArticleSchema.statics = {
	/**
	 * Get article
	 * @param {ObjectId} id - The objectId of article.
	 * @returns {Promise<article, APIError>}
	 */
	get(id) {
		return this.findById(id)
			.exec()
			.then((article) => {
				if (article) {
					return article;
				}
				const err = new APIError(
					'No such article exists!',
					httpStatus.BAD_REQUEST,
					true,
				);
				return Promise.reject(err);
			});
	},
};

/**
 * @typedef article
 */
module.exports = mongoose.model('Article', ArticleSchema, 'articles');
