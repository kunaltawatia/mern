import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
	{
		/* redux-saga actions */
		loadArticles: ['query'],
		loadArticle: ['id'],
		uploadArticle: ['action', 'articleId'],
		toggleArticleLike: ['articleId'],
		uploadComment: ['action', 'comment', 'articleId'],

		/* redux state actions */
		reset: null,
		setArticleList: ['articleList', 'hash'],
		setArticle: ['article', 'id'],
		setDraft: ['draft'],
	},
	{
		prefix: 'ARTICLES_',
	},
);

export const articlesActionTypes = Types;
export default Creators;
