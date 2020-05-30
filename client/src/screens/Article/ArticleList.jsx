import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Mark from 'mark.js';
import clx from 'classnames';
import PropTypes from 'prop-types';
import {
	Search,
	Filter,
	Feather,
	ArrowLeft,
	ArrowRight,
	ThumbsUp,
	MessageSquare,
	Eye,
} from 'react-feather';
import { format } from 'date-fns';

import history, { push, goBack } from 'modules/history';

import { articlesActions } from 'store/actions';

import Image from 'components/Image';
import { STATUS } from 'constants/index';
import { hash } from 'modules/helpers';
import Transition from 'components/Transition';
import { ArrowUp } from '../../../node_modules/react-feather/dist/index';

const ArticleListItemLoading = () => {
	return (
		<div className="article-list-item-loading flex column spacing">
			<p className="article-title loading-bg" />
			<p className="article-desc loading-bg" />
			<div className="info-block flex row space-between center">
				<div className="article-profile-box loading-bg" />
				<div className="stats-block loading-bg" />
			</div>
		</div>
	);
};

const ArticleListItem = ({ article }) => {
	const {
		_id,
		title,
		desc,
		author,
		timeToRead,
		createdAt,
		likes,
		comments,
		views,
	} = article;
	const date = new Date(createdAt);

	return (
		<div
			key={_id}
			className="article-list-item flex column"
			onClick={() => {
				push(`/articles/view?id=${_id}`);
			}}
		>
			<p className="article-title kepler">{title}</p>
			<p className="article-desc mono font-light bold">{desc}</p>
			<div className="info-block flex row space-between center">
				<div className="article-profile-box flex row center spacing">
					<Image src={author.picture} circle clickable size="40px" />
					<div className="flex column">
						<p className="article-profile-box-name bold">{author.name}</p>
						<p className="article-profile-box-date">
							{format(date, 'MMM dd')} . {timeToRead} min read
						</p>
					</div>
				</div>
				<div className="stats-block flex row center spacing-1">
					<div className="flex row center spacing">
						<ThumbsUp />
						<p>{likes}</p>
					</div>
					<div className="flex row center spacing">
						<MessageSquare />
						<p>{comments}</p>
					</div>
					<div className="flex row center spacing">
						<Eye />
						<p>{views}</p>
					</div>
				</div>
			</div>
			<div className="dash" />
		</div>
	);
};

ArticleListItem.propTypes = {
	article: PropTypes.object,
};

const ArticleListPreviewFunc = ({
	articleLists,
	getArticles,
	status,
	query,
}) => {
	const { qstring, qhash } = hash(query);

	const [articles, setArticles] = useState([]);

	useEffect(() => {
		if (!articleLists[qhash]) getArticles(query);
	}, [1]);

	useEffect(() => {
		if (articleLists[qhash]) setArticles(articleLists[qhash]);
	}, [articleLists]);

	const renderList = () => {
		if (articles.length)
			return articles.slice(0, 3).map((article) => {
				return <ArticleListItem key={article._id} article={article} />;
			});

		if (status === STATUS.ERROR)
			return (
				<div className="flex center">
					<h3 className="mono bold font-light">No articles found.</h3>
				</div>
			);

		return <ArticleListItemLoading />;
	};

	return (
		<div className="article-list-preview flex column spacing-2">
			<h2 className="font-light">Articles</h2>
			<div className="underline" />
			{
				// ToDo: do {...} expression gives lint errors
				renderList()
			}
			<div
				className="flex row div-clickable"
				onClick={() => push(`/articles?${qstring}`)}
			>
				<p className="read-more font-light mono bold">read more ...</p>
			</div>
		</div>
	);
};

ArticleListPreviewFunc.propTypes = {
	articleLists: PropTypes.object,
	getArticles: PropTypes.func,
	query: PropTypes.object,
	status: PropTypes.string,
};

ArticleListPreviewFunc.defaultProps = {
	query: {
		page: 0,
	},
};

class ArticleList extends React.PureComponent {
	constructor(props) {
		super(props);

		const {
			page = 0,
			search = '',
			user = '',
			sortDirection = -1,
			fieldToSort = 'createdAt',
		} = history.location.query;

		const query = {
			page: parseInt(page, 10),
			search,
			user,
			sortDirection: parseInt(sortDirection, 10),
			fieldToSort,
		};
		const { qhash } = hash(query);

		this.state = {
			query,
			qhash,
			filterDropdownVisible: false,
		};
	}

	static propTypes = {
		articleLists: PropTypes.object,
		getArticles: PropTypes.func,
		status: PropTypes.string,
		user: PropTypes.object,
	};

	componentDidMount() {
		window.scrollTo(0, 0);
		this.loadArticles();
		this.highlight();
	}

	componentDidUpdate() {
		this.highlight();
	}

	highlight = () => {
		const {
			query: { search },
		} = this.state;

		const context = document.querySelectorAll(
			'.article-title, .article-desc, .article-profile-box-name',
		);

		const instance = new Mark(context);

		instance.unmark();

		instance.markRegExp(
			new RegExp(
				`(${search
					//	seperate words
					.split(' ')
					//	filter out empty words
					.filter((word) => word.length > 0)
					//	sanitize regexp
					.map((word) => word.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&'))
					//	join regexp
					.join(')|(')})`,
				'i',
			),
		);
	};

	loadArticles = () => {
		const { articleLists, getArticles } = this.props;
		const { query, qhash } = this.state;

		if (!articleLists?.[qhash]) {
			getArticles?.(query);
		}
	};

	handleQuery(field, value) {
		const { query } = this.state;

		const newQuery = {
			...query,
			[field]: value,
		};

		const { qhash } = hash(newQuery);

		this.setState(
			{
				query: newQuery,
				qhash,
			},
			this.loadArticles,
		);
	}

	renderList = () => {
		const { articleLists, status } = this.props;
		const { qhash } = this.state;

		const data = articleLists?.[qhash] ?? [];

		if (data.length)
			return data.map((article) => {
				return <ArticleListItem key={article._id} article={article} />;
			});

		if (status === STATUS.ERROR) {
			return (
				<div className="flex center">
					<h3 className="mono bold font-light">No articles found.</h3>
				</div>
			);
		}

		return <ArticleListItemLoading />;
	};

	render() {
		const {
			user: { isAuthenticated },
		} = this.props;
		const { query, filterDropdownVisible } = this.state;
		const { page, search, sortDirection, fieldToSort } = query;

		const hover = Modernizr.mq('(hover:hover)');

		return (
			<div className="article-list flex column spacing-2">
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
					<h3 className="font-light">Articles</h3>
					<button
						type="button"
						className="btn"
						disabled={!isAuthenticated}
						onClick={() => {
							push('/articles/draft');
						}}
					>
						<div className="flex center">
							<Feather />
						</div>
						Article
					</button>
				</div>

				<div className="flex row center spacing">
					<div className="search-input flex row center">
						<Search />
						<input
							className="inp"
							placeholder="Search, for eg. Title, Author's name"
							name="search"
							autoComplete="off"
							autoCorrect="off"
							spellCheck="false"
							value={search}
							onChange={(e) => this.handleQuery('search', e.target.value)}
						/>
					</div>
					<div
						className="filter"
						onMouseEnter={() =>
							hover && this.setState({ filterDropdownVisible: true })
						}
						onMouseLeave={() =>
							hover && this.setState({ filterDropdownVisible: false })
						}
					>
						<Filter
							className="filter-icon"
							onClick={() =>
								!hover &&
								this.setState({ filterDropdownVisible: !filterDropdownVisible })
							}
						/>
						<Transition time={0.5} transition="filter-dropdown">
							{filterDropdownVisible ? (
								<div className="dropdown flex row center spacing">
									<button
										type="button"
										className={clx('btn fab no-hover', {
											up: sortDirection === 1,
										})}
										onClick={() =>
											this.handleQuery(
												'sortDirection',
												sortDirection === -1 ? 1 : -1,
											)
										}
									>
										<ArrowUp />
									</button>
									<p className="font-light mono bold">
										{sortDirection === -1 ? 'Most' : 'Least'}
									</p>
									<select
										className="select mono"
										value={fieldToSort}
										onChange={(e) =>
											this.handleQuery('fieldToSort', e.target.value)
										}
									>
										<option value="createdAt">Recent</option>
										<option value="views">Viewed</option>
										<option value="comments">Disputed</option>
										<option value="likes">Liked</option>
									</select>
								</div>
							) : null}
						</Transition>
					</div>
				</div>

				{this.renderList()}

				<div className="page-number flex row spacing center">
					<button
						type="button"
						className="btn fab"
						disabled={page === 0}
						onClick={this.handleQuery.bind(this, 'page', page - 1)}
					>
						<ArrowLeft />
					</button>
					<h3 className="bold kepler font-light">{page + 1}</h3>
					<button
						type="button"
						className="btn fab"
						onClick={this.handleQuery.bind(this, 'page', page + 1)}
					>
						<ArrowRight />
					</button>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.user,
	articleLists: state.articles.articleLists,
	status: state.app.statusStore.ARTICLE_LIST,
});

const mapDispatchToProps = (dispatch) => ({
	getArticles: (page) => dispatch(articlesActions.loadArticles(page)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ArticleList);

export const ArticleListPreview = connect(
	mapStateToProps,
	mapDispatchToProps,
)(ArticleListPreviewFunc);
