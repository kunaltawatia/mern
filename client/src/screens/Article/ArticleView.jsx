import React from 'react';
import { connect } from 'react-redux';
import clx from 'classnames';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
	ArrowLeft,
	Feather,
	X,
	MessageSquare,
	ThumbsUp,
	Eye,
	Save,
} from 'react-feather';
import Modal from 'react-modal';

import history, { goBack, push } from 'modules/history';
import { articlesActions, appActions } from 'store/actions';
import Image from 'components/Image';
import { STATUS } from 'constants/index';
import Loader from 'components/Loader';

class ArticleView extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			newComment: '',
			editComment: '',
			editCommentId: '',
			userLikesModalIsOpen: false,
			id: history.location.query.id,
		};
	}

	static propTypes = {
		articles: PropTypes.object,
		commentUploadstatus: PropTypes.string,
		deleteArticle: PropTypes.func,
		deleteComment: PropTypes.func,
		editComment: PropTypes.func,
		getArticle: PropTypes.func,
		postComment: PropTypes.func,
		promptBeforeExecution: PropTypes.func,
		toggleArticleLike: PropTypes.func,
		user: PropTypes.object,
	};

	componentDidMount() {
		const { articles, getArticle } = this.props;
		const { id } = this.state;

		window.scrollTo(0, 0);

		if (!articles?.[id]) {
			getArticle?.(id);
		}
	}

	handleChange = (evt) => {
		this.setState({
			[evt.target.name]: evt.target.value,
		});
	};

	openUserLikesModal = () => {
		this.setState({ userLikesModalIsOpen: true });
	};

	closeUserLikesModal = () => {
		this.setState({ userLikesModalIsOpen: false });
	};

	postComment = () => {
		const { newComment: text, id } = this.state;
		const { postComment } = this.props;

		if (text) {
			postComment?.({ text }, id);
			this.setState({ newComment: '' });
		}
	};

	editComment = () => {
		const { editComment: text, editCommentId, id } = this.state;
		const { editComment } = this.props;

		if (text) {
			editComment?.({ text, _id: editCommentId }, id);
			this.setState({ editComment: '', editCommentId: '' });
		}
	};

	deleteComment = (commentId) => {
		const { id } = this.state;
		const { deleteComment, promptBeforeExecution } = this.props;

		promptBeforeExecution?.(
			'you sure want to delete this comment 😕 ?',
			deleteComment?.bind(this, { _id: commentId }, id),
		);
	};

	deleteArticle = () => {
		const { id } = this.state;
		const { deleteArticle, promptBeforeExecution } = this.props;

		promptBeforeExecution?.(
			'you sure want to delete this article 😕 ?',
			deleteArticle?.bind(this, id),
		);
	};

	renderComments = (comments) => {
		const { user, commentUploadstatus } = this.props;
		const { editComment, editCommentId } = this.state;

		return comments.map((comment) => {
			const { text, author, createdAt, _id } = comment;
			return (
				<div key={_id} className="comment flex column spacing">
					<div className="info-block flex row space-between center">
						<div
							onClick={() => {
								push(`/profile?id=${author._id}`);
							}}
							className="article-profile-box flex row center spacing div-clickable"
						>
							<Image src={author.picture} circle clickable size="46px" />
							<div className="flex column">
								<p className="article-profile-box-date bold">{author.name}</p>
								<p className="article-profile-box-date">
									{format(new Date(createdAt), 'MMM dd . hh:mm')}
								</p>
							</div>
						</div>
						{user.email === author.email && (
							<div className="edit-action-block flex row center spacing">
								{editCommentId === _id ? (
									<>
										<button
											type="button"
											onClick={() => {
												this.setState({ editComment: '', editCommentId: '' });
											}}
											className="btn"
										>
											<div className="flex center">
												<X />
											</div>
											cancel
										</button>
										<button
											type="button"
											disabled={
												!editComment || commentUploadstatus === STATUS.RUNNING
											}
											onClick={this.editComment}
											className={clx('btn', {
												animate: commentUploadstatus === STATUS.RUNNING,
											})}
										>
											<div className="flex center">
												<Save />
											</div>
											Save
										</button>
									</>
								) : (
									<>
										<button
											type="button"
											onClick={this.deleteComment.bind(this, _id)}
											disabled={commentUploadstatus === STATUS.RUNNING}
											className={clx('btn', {
												animate: commentUploadstatus === STATUS.RUNNING,
											})}
										>
											<div className="flex center">
												<X />
											</div>
											Delete
										</button>
										<button
											type="button"
											onClick={() => {
												this.setState({
													editComment: text,
													editCommentId: _id,
												});
											}}
											className="btn"
										>
											<Feather /> Edit
										</button>
									</>
								)}
							</div>
						)}
					</div>
					{editCommentId === _id ? (
						<textarea
							className="inp edit-comment mono"
							name="editComment"
							placeholder="Write a comment"
							autoComplete="off"
							autoCorrect="off"
							spellCheck="false"
							onChange={this.handleChange}
							value={editComment}
						/>
					) : (
						<p className="comment-text mono bold">{text}</p>
					)}
					<div className="dash" />
				</div>
			);
		});
	};

	render() {
		const {
			articles,
			user,
			commentUploadstatus,
			toggleArticleLike,
		} = this.props;
		const { newComment, id, userLikesModalIsOpen } = this.state;

		const article = articles[id];

		if (!article)
			return (
				<div className="article-view flex center">
					<Loader />
				</div>
			);

		const {
			title,
			desc,
			body,
			author,
			timeToRead,
			createdAt,
			comments,
			views,
			likes,
		} = article;

		return (
			<div className="article-view flex column spacing-1">
				<div className="flex row space-between">
					<button
						type="button"
						className="btn"
						onClick={() => {
							goBack();
						}}
					>
						<div className="flex center">
							<ArrowLeft />
						</div>
						Back
					</button>
					<div />
				</div>
				<p className="article-title kepler">{title}</p>
				<div className="info-block flex row space-between center">
					<div
						onClick={() => {
							push(`/profile?id=${author._id}`);
						}}
						className="article-profile-box flex row center spacing div-clickable"
					>
						<Image src={author.picture} circle clickable size="40px" />
						<div className="flex column">
							<p className="article-profile-box-name bold">{author.name}</p>
							<p className="article-profile-box-date">
								{format(new Date(createdAt), 'MMM dd')} . {timeToRead} min read
							</p>
						</div>
					</div>
					{user.email === author.email && (
						<div className="edit-action-block flex row center spacing">
							<button
								type="button"
								onClick={this.deleteArticle}
								className="btn"
							>
								<div className="flex center">
									<X />
								</div>
								Delete
							</button>
							<button
								type="button"
								onClick={() => push(`/articles/draft?edit=${id}`)}
								className="btn"
							>
								<Feather /> Edit
							</button>
						</div>
					)}
				</div>
				<p className="article-desc mono font-light bold">{desc}</p>
				<p className="article-body mono">{body}</p>
				<div className="stats-block flex row spacing">
					<div className="flex row center spacing">
						<button
							type="button"
							className={clx('btn fab shadow-dark like-button', {
								liked: likes.find(({ email }) => email === user.email),
							})}
							onClick={() => {
								toggleArticleLike(id);
							}}
						>
							<ThumbsUp />
						</button>
						<a onClick={this.openUserLikesModal}>{likes.length} Likes</a>
					</div>
					<div className="flex row center spacing">
						<Eye />
						<a onClick={this.openUserLikesModal}>{views.length} Views</a>
					</div>
					<div className="flex row center spacing">
						<MessageSquare />
						<p>{comments.length} Comments</p>
					</div>
				</div>
				{this.renderComments(comments)}
				<div className="new-comment-block flex column spacing">
					<textarea
						className="inp new-comment mono"
						name="newComment"
						placeholder="Write a comment"
						autoComplete="off"
						autoCorrect="off"
						spellCheck="false"
						onChange={this.handleChange}
						value={newComment}
					/>
					<button
						type="button"
						disabled={!newComment || commentUploadstatus === STATUS.RUNNING}
						className={clx('btn', {
							animate: commentUploadstatus === STATUS.RUNNING,
						})}
						onClick={this.postComment}
					>
						<div className="flex center">
							<MessageSquare />
						</div>
						Post
					</button>
				</div>
				<Modal
					isOpen={userLikesModalIsOpen}
					onRequestClose={this.closeUserLikesModal}
					contentLabel="User Likes Modal"
					className="prompt-modal user-likes-modal shadow-dark"
					overlayClassName="prompt-modal-overlay user-likes-modal-overlay"
				>
					<div className="header flex row space-between center">
						<div className="flex row center spacing">
							<div className="flex row center">
								<ThumbsUp />
								<p> {likes.length} Upvotes</p>
							</div>
							<div className="flex row center">
								<Eye />
								<p> {views.length} Views</p>
							</div>
						</div>
						<div
							onClick={this.closeUserLikesModal}
							className="flex center div-clickable"
						>
							<X />
						</div>
					</div>

					{likes.length ? <h5>Upvotes</h5> : null}
					{likes.map((upvotingUser) => {
						const { _id, name, email, picture } = upvotingUser;

						return (
							<div key={_id} className="profile-box flex row center spacing">
								<Image src={picture} circle clickable size="40px" />
								<div className="flex column">
									<p className="profile-box-name bold">{name}</p>
									<a
										className="profile-box-email font-light"
										href={`mailto:${email}`}
									>
										{email}
									</a>
								</div>
								<div className="icon-box flex row center spacing">
									<ThumbsUp />
									<Eye />
								</div>
							</div>
						);
					})}

					{views.length ? <h5>Views</h5> : null}
					{views.map((upvotingUser) => {
						const { _id, name, email, picture } = upvotingUser;

						return (
							<div key={_id} className="profile-box flex row center spacing">
								<Image src={picture} circle clickable size="40px" />
								<div className="flex column">
									<p className="profile-box-name bold">{name}</p>
									<a
										className="profile-box-email font-light"
										href={`mailto:${email}`}
									>
										{email}
									</a>
								</div>
								<div className="icon-box flex row center spacing">
									<Eye />
								</div>
							</div>
						);
					})}
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	articles: state.articles.articles,
	user: state.user.info,
	articleUploadstatus: state.app.statusStore.UPLOAD_ARTICLE,
	commentUploadstatus: state.app.statusStore.UPLOAD_COMMENT,
});

const mapDispatchToProps = (dispatch) => ({
	getArticle: (id) => dispatch(articlesActions.loadArticle(id)),
	toggleArticleLike: (id) => dispatch(articlesActions.toggleArticleLike(id)),
	postComment: (comment, id) =>
		dispatch(articlesActions.uploadComment('NEW', comment, id)),
	editComment: (comment, id) =>
		dispatch(articlesActions.uploadComment('EDIT', comment, id)),
	deleteComment: (comment, id) =>
		dispatch(articlesActions.uploadComment('DELETE', comment, id)),
	deleteArticle: (id) => dispatch(articlesActions.uploadArticle('DELETE', id)),
	promptBeforeExecution: (message, onConfirm) =>
		dispatch(appActions.showPrompt(message, onConfirm)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ArticleView);
