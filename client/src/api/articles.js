import api from './index';

/**
 * This function makes an API call
 * to request details of articles at
 * given page number
 */
export const getArticles = async (qstring) => {
	const { articles } = await api.get(`/articles?${qstring}`);
	return articles;
};

/**
 * This function makes an API call
 * to request details of a particular articles
 * with given id
 */
export const getArticle = async (id) => {
	const { article } = await api.get(`/articles/${id}`);
	return article;
};

/**
 * This function makes an API call
 * to request details of a particular articles
 * with given id
 */
export const likeArticle = async (id) => {
	const { likes, article } = await api.get(`/articles/${id}/like`);
	return { likes, article };
};

/**
 * This function makes an API call
 * to upload a article with title, short desc, body
 */
export const postArticle = async (article) => {
	const { article: articleInstance } = await api.post('/articles', article);
	return articleInstance;
};

/**
 * This function makes an API call
 * to edit a article with title, short desc, body and _id
 */
export const putArticle = async ({ _id, ...rest }) => {
	const { article: articleInstance } = await api.put(`/articles/${_id}`, rest);
	return articleInstance;
};

/**
 * This function makes an API call
 * to delete a article  by _id
 */
export const deleteArticle = async (id) => {
	const { article } = await api.delete(`/articles/${id}`);
	return article;
};

/**
 * This function makes an API call
 * to upload a comment with text
 */
export const postComment = async (articleId, comment) => {
	const { comment: commentInstance, article } = await api.post(
		`/articles/${articleId}/comments`,
		comment,
	);
	return { comment: commentInstance, article };
};

/**
 * This function makes an API call
 * to edit a comment with text and _id
 */
export const putComment = async (articleId, comment) => {
	const { text, _id } = comment;
	const {
		article,
		comment: commentInstance,
	} = await api.put(`/articles/${articleId}/comments/${_id}`, { text });
	return { comment: commentInstance, article };
};

/**
 * This function makes an API call
 * to delete a comment by _id
 */
export const deleteComment = async (articleId, id) => {
	const { article, comment: commentInstance } = await api.delete(
		`/articles/${articleId}/comments/${id}`,
	);
	return { comment: commentInstance, article };
};
