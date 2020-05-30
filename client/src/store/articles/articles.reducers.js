import { createReducer } from 'reduxsauce';
import { REHYDRATE } from 'redux-persist';
import { articlesActionTypes } from './articles.actions';

/**
 * The initial values for the redux state.
 */
const INITIAL_STATE = {
	articleLists: {},
	articles: {},
	draft: {},
};

export const setArticleList = (state, { hash, articleList }) => ({
	...state,
	articleLists: { ...state.articleLists, [hash]: articleList },
});

export const setArticle = (state, { id, article }) => ({
	...state,
	articles: { ...state.article, [id]: article },
});

export const setDraft = (state, { draft }) => ({
	...state,
	draft,
});

export const reset = (state) => ({
	...state,
	articleLists: {},
});

export const rehydrate = (state, { payload }) => ({
	...state,
	draft: payload?.articles?.draft ?? {},
});

export const reducer = createReducer(INITIAL_STATE, {
	[articlesActionTypes.SET_ARTICLE_LIST]: setArticleList,
	[articlesActionTypes.SET_ARTICLE]: setArticle,
	[articlesActionTypes.SET_DRAFT]: setDraft,
	[articlesActionTypes.RESET]: reset,
	[REHYDRATE]: rehydrate,
});

export default {
	articles: reducer,
};
