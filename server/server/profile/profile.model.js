const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
	token: {
		type: String,
		required: true,
		select: false,
	},
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		match: [
			/^((([a-z]{1,}\.[0-9]{1,})|([a-z]{1,}))@iitj\.ac\.in)$/,
			'The value of {PATH} {VALUE} is not a valid iitj email id.',
		],
	},
	picture: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
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
UserSchema.method({});

/**
 * Statics
 */
UserSchema.statics = {
	/**
	 * Get user
	 * @param {ObjectId} id - The objectId of user.
	 * @returns {Promise<User, APIError>}
	 */
	get(id) {
		return this.findById(id)
			.exec()
			.then((user) => {
				if (user) {
					return user;
				}
				const err = new APIError(
					'No such user exists!',
					httpStatus.BAD_REQUEST,
					true,
				);
				return Promise.reject(err);
			});
	},
};

/**
 * @typedef User
 */
module.exports = mongoose.model('User', UserSchema, 'users');

/**
 * Public schema for use of other models in depicting profile
 */
const ProfileSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	picture: {
		type: String,
		required: true,
	},
});

module.exports.ProfileSchema = ProfileSchema;
