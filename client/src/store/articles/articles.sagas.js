/**
 * @module User/Sagas
 * @desc User
 */
import {
	getArticles,
	likeArticle,
	putArticle,
	postArticle,
	deleteArticle,
	getArticle,
	putComment,
	postComment,
	deleteComment,
} from 'api/articles';

import { all, put, takeLatest, call, select } from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist/lib/constants';

import { articlesActions, appActions } from 'store/actions';
import { STATUS } from 'constants/index';
import { replace, goBack } from 'modules/history';
import { hash } from 'modules/helpers';

import { articlesActionTypes } from './articles.actions';

/**
 * Load article list for corresponding page no.
 */
export function* loadArticles({ query }) {
	try {
		const { qstring, qhash } = hash(query);

		//	start loading
		yield put(appActions.setStatus('ARTICLE_LIST', STATUS.RUNNING));

		//	get articles list at given page from server
		const articles = yield call(getArticles, qstring);

		//	put articles list in state
		yield put(articlesActions.setArticleList(articles, qhash));

		//	complete loading
		yield put(
			appActions.setStatus(
				'ARTICLE_LIST',
				!articles?.length ? STATUS.ERROR : STATUS.READY,
			),
		);
	} catch ({
		//	message forwarded by instanceof Error or api
		//	default value 'Something went wrong :('
		message = 'Something went wrong :(',
	}) {
		//	show fail alert
		yield put(appActions.showAlert(message, { variant: 'danger' }));

		//	finish the loading in status store with error
		yield put(appActions.setStatus('ARTICLE_LIST', STATUS.ERROR));
	}
}

/**
 * Load article list for corresponding article id.
 */
export function* loadArticle({ id }) {
	try {
		//	start loading
		yield put(appActions.setStatus('ARTICLE_VIEW', STATUS.RUNNING));

		//	get article with given id from server
		const article = yield call(getArticle, id);

		//	put article in state
		yield put(articlesActions.setArticle(article, id));

		//	start loading
		yield put(appActions.setStatus('ARTICLE_VIEW', STATUS.READY));
	} catch ({
		//	message forwarded by instanceof Error or api
		//	default value 'Something went wrong :('
		message = 'Something went wrong :(',
	}) {
		//	show fail alert
		yield put(appActions.showAlert(message, { variant: 'danger' }));

		//	finish the loading in status store with error
		yield put(appActions.setStatus('ARTICLE_VIEW', STATUS.ERROR));

		goBack();
	}
}

/**
 * Upload a article
 * @param {string} action one of 'NEW', 'EDIT', 'DELETE'
 */
export function* uploadArticle({ action, articleId }) {
	try {
		//	start loading
		yield put(appActions.setStatus('UPLOAD_ARTICLE', STATUS.RUNNING));

		//	get draft article from state to be uploaded
		const { title, desc, body, _id } = yield select(
			(state) => state.articles.draft,
		);

		let returnedArticle = {};
		let successMesssage = 'Your article was successfully ';

		if (action === 'NEW') {
			successMesssage += 'posted.';
			returnedArticle = yield call(postArticle, { title, desc, body });
		} else if (action === 'EDIT') {
			successMesssage += 'edited.';
			returnedArticle = yield call(putArticle, { title, desc, body, _id });
		} else if (action === 'DELETE') {
			successMesssage += 'deleted.';
			returnedArticle = yield call(deleteArticle, articleId);
		}

		//	complete loading
		yield put(appActions.setStatus('UPLOAD_ARTICLE', STATUS.IDLE));
		//	show success alert
		yield put(appActions.showAlert(successMesssage, { variant: 'success' }));
		//	reset article lists
		yield put(articlesActions.reset());

		if (action !== 'DELETE') {
			//	set the draft empty
			yield put(articlesActions.setDraft({}));
			//	set the updated article
			yield put(articlesActions.setArticle(returnedArticle, articleId));
		}

		const { _id: id } = returnedArticle;

		if (action === 'NEW') {
			replace(`/articles/view?id=${id}`);
		} else {
			goBack();
		}
	} catch ({
		//	message forwarded by instanceof Error or api
		//	default value 'Something went wrong :('
		message = 'Something went wrong :(',
	}) {
		//	show fail alert
		yield put(appActions.showAlert(message, { variant: 'danger' }));

		//	finish the loading in status store with error
		yield put(appActions.setStatus('UPLOAD_ARTICLE', STATUS.ERROR));
	}
}

/**
 * upvote or downvote the article
 */
export function* toggleArticleLike({ articleId }) {
	try {
		const { article: returnedArticle } = yield call(likeArticle, articleId);

		//	set the updated article
		yield put(articlesActions.setArticle(returnedArticle, articleId));
		//	reset article lists
		yield put(articlesActions.reset());
	} catch ({
		//	message forwarded by instanceof Error or api
		//	default value 'Something went wrong :('
		message = 'Something went wrong :(',
	}) {
		//	show fail alert
		yield put(appActions.showAlert(message, { variant: 'danger' }));

		//	finish the loading in status store with error
		yield put(appActions.setStatus('UPLOAD_ARTICLE', STATUS.ERROR));
	}
}

/**
 * Upload a comment
 * @param {string} action one of 'NEW', 'EDIT', 'DELETE'
 */
export function* uploadComment({ action, comment, articleId }) {
	try {
		//	start loading
		yield put(appActions.setStatus('UPLOAD_COMMENT', STATUS.RUNNING));

		let returnedArticle = {};
		let successMesssage = 'Your comment was successfully ';

		if (action === 'NEW') {
			successMesssage += 'posted';
			const response = yield call(postComment, articleId, comment);
			returnedArticle = response.article;
		} else if (action === 'EDIT') {
			successMesssage += 'edited.';
			const response = yield call(putComment, articleId, comment);
			returnedArticle = response.article;
		} else if (action === 'DELETE') {
			successMesssage += 'deleted.';
			const response = yield call(deleteComment, articleId, comment._id);
			returnedArticle = response.article;
		}

		//	complete loading
		yield put(appActions.setStatus('UPLOAD_COMMENT', STATUS.IDLE));
		//	show success alert
		yield put(appActions.showAlert(successMesssage, { variant: 'success' }));
		//	set the updated article
		yield put(articlesActions.setArticle(returnedArticle, articleId));
		//	reset article lists
		yield put(articlesActions.reset());
	} catch ({
		//	message forwarded by instanceof Error or api
		//	default value 'Something went wrong :('
		message = 'Something went wrong :(',
	}) {
		//	show fail alert
		yield put(appActions.showAlert(message, { variant: 'danger' }));

		//	finish the loading in status store with error
		yield put(appActions.setStatus('UPLOAD_COMMENT', STATUS.ERROR));
	}
}

/**
 * ToDo: App startup
 */
export function* startUp() {
	yield 1;
}

/**
 * User Sagas
 */
export default function* root() {
	yield all([
		takeLatest(articlesActionTypes.LOAD_ARTICLES, loadArticles),
		takeLatest(articlesActionTypes.LOAD_ARTICLE, loadArticle),
		takeLatest(articlesActionTypes.UPLOAD_ARTICLE, uploadArticle),
		takeLatest(articlesActionTypes.TOGGLE_ARTICLE_LIKE, toggleArticleLike),
		takeLatest(articlesActionTypes.UPLOAD_COMMENT, uploadComment),
		takeLatest(REHYDRATE, startUp),
	]);
}
