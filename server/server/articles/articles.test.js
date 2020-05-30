const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const chai = require('chai');
const expect = chai.expect;
const app = require('../../index');
const testVariables = require('../tests/root.test');

chai.config.includeStack = true;

describe('## Article APIs', () => {
	let article = {
		title: 'title',
		desc: 'desc',
		body: 'body',
	};

	describe('# POST /api/articles', () => {
		it('should create a new article', (done) => {
			request(app)
				.post('/api/articles')
				.set('Authorization', `Bearer ${testVariables.dummyUsers[0].token}`)
				.send(article)
				.expect(httpStatus.OK)
				.then((res) => {
					expect(res.body.article).to.be.an('object');
					expect(res.body.article.title).to.equal(article.title);
					expect(res.body.article.desc).to.equal(article.desc);
					expect(res.body.article.body).to.equal(article.body);
					article = res.body.article;
					done();
				})
				.catch(done);
		});
	});

	describe('# GET /api/articles/:articleId', () => {
		it('should not get article details with unauthorised access', (done) => {
			request(app)
				.get(`/api/articles/${article._id}`)
				.expect(httpStatus.UNAUTHORIZED)
				.then(() => {
					done();
				})
				.catch(done);
		});

		it('should get article details with views increased', (done) => {
			request(app)
				.get(`/api/articles/${article._id}`)
				.set('Authorization', `Bearer ${testVariables.dummyUsers[1].token}`)
				.expect(httpStatus.OK)
				.then((res) => {
					expect(res.body.article).to.be.an('object');
					expect(res.body.article.title).to.equal(article.title);
					expect(res.body.article.desc).to.equal(article.desc);
					expect(res.body.article.body).to.equal(article.body);
					expect(res.body.article.views.length).to.equal(1);
					done();
				})
				.catch(done);
		});

		it('should get article details with views same', (done) => {
			request(app)
				.get(`/api/articles/${article._id}`)
				.set('Authorization', `Bearer ${testVariables.dummyUsers[1].token}`)
				.expect(httpStatus.OK)
				.then((res) => {
					expect(res.body.article).to.be.an('object');
					expect(res.body.article.title).to.equal(article.title);
					expect(res.body.article.desc).to.equal(article.desc);
					expect(res.body.article.body).to.equal(article.body);
					expect(res.body.article.views.length).to.equal(1);
					done();
				})
				.catch(done);
		});

		it('should get article details with views increased', (done) => {
			request(app)
				.get(`/api/articles/${article._id}`)
				.set('Authorization', `Bearer ${testVariables.dummyUsers[0].token}`)
				.expect(httpStatus.OK)
				.then((res) => {
					expect(res.body.article).to.be.an('object');
					expect(res.body.article.views.length).to.equal(2);
					done();
				})
				.catch(done);
		});

		it('should get article details with views same', (done) => {
			request(app)
				.get(`/api/articles/${article._id}`)
				.set('Authorization', `Bearer ${testVariables.dummyUsers[0].token}`)
				.expect(httpStatus.OK)
				.then((res) => {
					expect(res.body.article).to.be.an('object');
					expect(res.body.article.views.length).to.equal(2);
					done();
				})
				.catch(done);
		});

		it('should not get article details', (done) => {
			request(app)
				.get(`/api/articles/${article._id}`)
				.expect(httpStatus.UNAUTHORIZED)
				.then(() => {
					done();
				})
				.catch(done);
		});

		it('should report error with message - Not found, when article does not exists', (done) => {
			request(app)
				.get('/api/articles/56c787ccc67fc16ccc1a5e92')
				.expect(httpStatus.BAD_REQUEST)
				.then((res) => {
					expect(res.body.message).to.equal('No such article exists!');
					done();
				})
				.catch(done);
		});
	});

	describe('# PUT /api/articles/:articleId', () => {
		it('should unauthorize to update article details', (done) => {
			article.title = 'updated title';
			const { title, desc, body } = article;
			request(app)
				.put(`/api/articles/${article._id}`)
				.set('Authorization', `Bearer ${testVariables.dummyUsers[1].token}`)
				.send({ title, desc, body })
				.expect(httpStatus.UNAUTHORIZED)
				.then((res) => {
					expect(res.body.message).to.equal(
						'Not authorized to perform this action',
					);
					done();
				})
				.catch(done);
		});

		it('should update article details', (done) => {
			article.title = 'updated title';
			const { title, desc, body } = article;
			request(app)
				.put(`/api/articles/${article._id}`)
				.set('Authorization', `Bearer ${testVariables.dummyUsers[0].token}`)
				.send({ title, desc, body })
				.expect(httpStatus.OK)
				.then((res) => {
					expect(res.body.article).to.be.an('object');
					expect(res.body.article.title).to.equal('updated title');
					done();
				})
				.catch(done);
		});
	});

	describe('# GET /api/articles/', () => {
		it('should get all articles', (done) => {
			request(app)
				.get('/api/articles')
				.expect(httpStatus.OK)
				.then((res) => {
					expect(res.body.articles).to.be.an('array');
					expect(
						res.body.articles.find(({ _id }) => _id === article._id),
					).to.be.an('object');
					done();
				})
				.catch(done);
		});

		it('should get all articles (with page 1)', (done) => {
			request(app)
				.get('/api/articles')
				.query({ page: 1 })
				.expect(httpStatus.OK)
				.then((res) => {
					expect(res.body.articles).to.be.an('array');
					expect(
						res.body.articles.find(({ _id }) => _id === article._id),
					).to.equal(undefined);
					done();
				})
				.catch(done);
		});
	});

	describe('# GET /api/articles/:articleId/like', () => {
		it('should upvote the article from user b', (done) => {
			request(app)
				.get(`/api/articles/${article._id}/like`)
				.set('Authorization', `Bearer ${testVariables.dummyUsers[1].token}`)
				.expect(httpStatus.OK)
				.then((res) => {
					expect(res.body.likes).to.be.an('array');
					expect(res.body.likes.length).to.equal(1);
					done();
				})
				.catch(done);
		});

		it('should upvote the article from user a', (done) => {
			request(app)
				.get(`/api/articles/${article._id}/like`)
				.set('Authorization', `Bearer ${testVariables.dummyUsers[0].token}`)
				.expect(httpStatus.OK)
				.then((res) => {
					expect(res.body.likes).to.be.an('array');
					expect(res.body.likes.length).to.equal(2);
					done();
				})
				.catch(done);
		});

		it('should downvote the article from user b', (done) => {
			request(app)
				.get(`/api/articles/${article._id}/like`)
				.set('Authorization', `Bearer ${testVariables.dummyUsers[1].token}`)
				.expect(httpStatus.OK)
				.then((res) => {
					expect(res.body.likes).to.be.an('array');
					expect(res.body.likes.length).to.equal(1);
					done();
				})
				.catch(done);
		});

		it('should downvote the article from user a', (done) => {
			request(app)
				.get(`/api/articles/${article._id}/like`)
				.set('Authorization', `Bearer ${testVariables.dummyUsers[0].token}`)
				.expect(httpStatus.OK)
				.then((res) => {
					expect(res.body.likes).to.be.an('array');
					expect(res.body.likes.length).to.equal(0);
					done();
				})
				.catch(done);
		});
	});

	let comment = {
		text: 'comment',
	};

	describe('# POST /api/articles/:articleId/comments', () => {
		it('should create a new comment', (done) => {
			request(app)
				.post(`/api/articles/${article._id}/comments`)
				.set('Authorization', `Bearer ${testVariables.dummyUsers[1].token}`)
				.send(comment)
				.expect(httpStatus.OK)
				.then((res) => {
					expect(res.body.comment).to.be.an('object');
					expect(res.body.comment.text).to.equal(comment.text);

					comment = res.body.comment;

					expect(res.body.article.comments).to.be.an('array');
					expect(
						res.body.article.comments.find(({ _id }) => _id === comment._id),
					).to.be.an('object');

					article = res.body.article;
					done();
				})
				.catch(done);
		});
	});

	describe('# PUT /api/articles/:articleId/comments/:commentId', () => {
		it('should unauthorize while updating article details', (done) => {
			comment.text = 'updated comment';
			const { text } = comment;

			request(app)
				.put(`/api/articles/${article._id}/comments/56c787ccc67fc16ccc1a5e92}`)
				.set('Authorization', `Bearer ${testVariables.dummyUsers[1].token}`)
				.send({ text })
				.expect(httpStatus.BAD_REQUEST)
				.then((res) => {
					expect(res.body.message).to.equal(
						'Comment not found to perform operation',
					);
					done();
				})
				.catch(done);
		});

		it('should unauthorize while updating article details', (done) => {
			comment.text = 'updated comment';
			const { text } = comment;

			request(app)
				.put(`/api/articles/${article._id}/comments/${comment._id}`)
				.set('Authorization', `Bearer ${testVariables.dummyUsers[0].token}`)
				.send({ text })
				.expect(httpStatus.UNAUTHORIZED)
				.then((res) => {
					expect(res.body.message).to.equal(
						'Not authorized to perform this action',
					);
					done();
				})
				.catch(done);
		});

		it('should update article details', (done) => {
			comment.text = 'updated comment';
			const { text } = comment;

			request(app)
				.put(`/api/articles/${article._id}/comments/${comment._id}`)
				.set('Authorization', `Bearer ${testVariables.dummyUsers[1].token}`)
				.send({ text })
				.expect(httpStatus.OK)
				.then((res) => {
					expect(res.body.comment).to.be.an('object');
					expect(res.body.comment.text).to.equal('updated comment');

					comment = res.body.comment;

					expect(res.body.article.comments).to.be.an('array');
					expect(
						res.body.article.comments.find(({ _id }) => _id === comment._id),
					).to.be.an('object');
					expect(
						res.body.article.comments.find(({ _id }) => _id === comment._id)
							.text,
					).to.equal('updated comment');

					article = res.body.article;
					done();
				})
				.catch(done);
		});
	});

	describe('# DELETE /api/articles/:articleId/comments/:commentId', () => {
		it('should unauthorize while delete comment', (done) => {
			request(app)
				.delete(`/api/articles/${article._id}/comments/${comment._id}`)
				.set('Authorization', `Bearer ${testVariables.dummyUsers[0].token}`)
				.expect(httpStatus.UNAUTHORIZED)
				.then((res) => {
					expect(res.body.message).to.equal(
						'Not authorized to perform this action',
					);
					done();
				})
				.catch(done);
		});

		it('should delete comment', (done) => {
			request(app)
				.delete(`/api/articles/${article._id}/comments/${comment._id}`)
				.set('Authorization', `Bearer ${testVariables.dummyUsers[1].token}`)
				.expect(httpStatus.OK)
				.then((res) => {
					expect(res.body.comment).to.be.an('object');
					expect(res.body.comment.text).to.equal('updated comment');

					comment = res.body.comment;

					expect(res.body.article.comments).to.be.an('array');
					expect(
						res.body.article.comments.find(({ _id }) => _id === comment._id),
					).to.not.be.an('object');

					done();
				})
				.catch(done);
		});
	});

	describe('# DELETE /api/articles/', () => {
		it('should unauthorize while delete article', (done) => {
			request(app)
				.delete(`/api/articles/${article._id}`)
				.set('Authorization', `Bearer ${testVariables.dummyUsers[1].token}`)
				.expect(httpStatus.UNAUTHORIZED)
				.then((res) => {
					expect(res.body.message).to.equal(
						'Not authorized to perform this action',
					);
					done();
				})
				.catch(done);
		});

		it('should delete article', (done) => {
			request(app)
				.delete(`/api/articles/${article._id}`)
				.set('Authorization', `Bearer ${testVariables.dummyUsers[0].token}`)
				.expect(httpStatus.OK)
				.then((res) => {
					expect(res.body.article).to.be.an('object');
					expect(res.body.article.title).to.equal('updated title');
					expect(res.body.article.desc).to.equal(article.desc);
					expect(res.body.article.body).to.equal(article.body);
					done();
				})
				.catch(done);
		});
	});
});
