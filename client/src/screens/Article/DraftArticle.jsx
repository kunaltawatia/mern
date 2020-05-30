import React from 'react';
import { connect } from 'react-redux';
import clx from 'classnames';
import PropTypes from 'prop-types';
import { ArrowLeft, Feather } from 'react-feather';
import { format } from 'date-fns';

import history, { goBack } from 'modules/history';

import { articlesActions } from 'store/actions';
import { STATUS } from 'constants/index';
import Image from 'components/Image';
import { RefreshCcw } from '../../../node_modules/react-feather/dist/index';

class DraftArticle extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: '',
			desc: '',
			body: '',
			edit: history.location.query?.edit,
		};
	}

	static propTypes = {
		articles: PropTypes.object,
		draft: PropTypes.object,
		post: PropTypes.func,
		save: PropTypes.func,
		status: PropTypes.string,
		user: PropTypes.object,
	};

	componentDidMount() {
		const { draft = {}, articles, save } = this.props;
		const { edit } = this.state;

		if (edit) {
			const article = articles?.[edit] ?? {};
			save?.(article);
			this.setState({ ...article });
		} else {
			this.setState({ ...draft });
		}
	}

	saveDraft = () => {
		const article = this.state;
		const { save } = this.props;

		save?.(article);
	};

	clearDraft = () => {
		const { save } = this.props;
		const { edit } = this.state;

		this.setState({ title: '', desc: '', body: '' });
		save?.(edit ? { _id: edit } : {});
	};

	handleChange = (evt) => {
		this.setState(
			{
				[evt.target.name]: evt.target.value,
			},
			this.saveDraft,
		);
	};

	render() {
		const { user, post, status } = this.props;
		const { title, desc, body, edit } = this.state;

		return (
			<div className="draft-article flex column spacing-2">
				<div className="flex row space-between spacing">
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
					<h3 className="font-light">{edit ? 'Edit' : 'Write'} Article</h3>
				</div>

				<div className="draft-article-form flex column spacing-1">
					<input
						className="inp article-title kepler"
						name="title"
						placeholder="Title"
						autoComplete="off"
						autoCorrect="off"
						spellCheck="false"
						onChange={this.handleChange}
						value={title}
					/>
					<div className="article-profile-box flex row center spacing">
						<Image src={user.picture} circle clickable size="40px" />
						<div className="flex column">
							<p className="article-profile-box-name bold">{user.name}</p>
							<p className="article-profile-box-date">
								{format(Date.now(), 'MMM dd')} .{' '}
								{Math.floor(body.split(' ').length / 200) + 1} min read
							</p>
						</div>
					</div>
					<textarea
						className="inp article-desc mono"
						name="desc"
						placeholder="here goes a short description..."
						autoComplete="off"
						autoCorrect="off"
						spellCheck="false"
						onChange={this.handleChange}
						value={desc}
					/>
					<textarea
						className="inp article-body mono"
						name="body"
						placeholder="so tell me what is it?"
						autoComplete="off"
						autoCorrect="off"
						spellCheck="false"
						onChange={this.handleChange}
						value={body}
					/>
				</div>

				<div className="flex row space-between">
					<button
						type="button"
						disabled={status === STATUS.RUNNING}
						className={clx('btn', {
							animate: status === STATUS.RUNNING,
						})}
						onClick={() => (edit ? post('EDIT') : post('NEW'))}
					>
						<Feather /> Post
					</button>
					{edit ? null : (
						<button type="button" className="btn" onClick={this.clearDraft}>
							<div className="flex center">
								<RefreshCcw />
							</div>
							Clear
						</button>
					)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	articles: state.articles.articles,
	draft: state.articles.draft,
	status: state.app.statusStore.UPLOAD_ARTICLE,
	user: state.user.info,
});

const mapDispatchToProps = (dispatch) => ({
	save: (draft) => dispatch(articlesActions.setDraft(draft)),
	post: (action) => dispatch(articlesActions.uploadArticle(action)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DraftArticle);
