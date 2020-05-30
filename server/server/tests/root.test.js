const mongoose = require('mongoose');
const User = require('../profile/profile.model');

let dynamicExport = {
	dummyUsers: [
		{
			email: 'testing.1@iitj.ac.in',
			name: 'testing_user_a',
			picture: 'https://www.example.com/missing.jpg',
			token: 'token_a',
		},
		{
			email: 'testing.2@iitj.ac.in',
			name: 'testing_user_b',
			picture: 'https://www.example.com/missing.jpg',
			token: 'token_b',
		},
	],
};

/**
 * root level hooks
 */
before(() => {
	User.insertMany(dynamicExport.dummyUsers, (err, users) => {
		dynamicExport.dummyUsers = users;
	});
});

after((done) => {
	User.deleteMany(
		{
			email: /test/,
		},
		() => {
			// required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
			mongoose.models = {};
			mongoose.modelSchemas = {};
			mongoose.connection.close();
			done();
		},
	);
});

module.exports = dynamicExport;
