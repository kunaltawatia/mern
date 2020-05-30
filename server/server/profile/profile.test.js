const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const chai = require('chai');
const expect = chai.expect;
const app = require('../../index');
const testVariables = require('../tests/root.test');

chai.config.includeStack = true;

describe('## Profile APIs', () => {
	describe('# GET /api/profile', () => {
		it('should give user details for user a', (done) => {
			request(app)
				.get(`/api/profile/${testVariables.dummyUsers[0]._id}`)
				.expect(httpStatus.OK)
				.then((res) => {
					expect(res.body.profile).to.be.an('object');
					expect(res.body.profile.email).to.equal('testing.1@iitj.ac.in');
					done();
				})
				.catch(done);
		});

		it('should give user details for user b', (done) => {
			request(app)
				.get(`/api/profile/${testVariables.dummyUsers[1]._id}`)
				.expect(httpStatus.OK)
				.then((res) => {
					expect(res.body.profile).to.be.an('object');
					expect(res.body.profile.email).to.equal('testing.2@iitj.ac.in');
					done();
				})
				.catch(done);
		});

		it('should give bad request', (done) => {
			request(app)
				.get('/api/profile/5ece7d2a81fc4873df8cf248')
				.expect(httpStatus.BAD_REQUEST)
				.then(() => {
					done();
				})
				.catch(done);
		});
	});
});
