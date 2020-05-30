import { all, fork } from 'redux-saga/effects';

import app from './app/app.sagas';
import user from './user/user.sagas';
import articles from './articles/articles.sagas';

/**
 * rootSaga
 */
export default function* root() {
	yield all([fork(app), fork(user), fork(articles)]);
}
