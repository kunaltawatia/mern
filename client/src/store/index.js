import { applyMiddleware, createStore, compose } from 'redux';
import { persistStore } from 'redux-persist';

import rootSaga from './sagas';
import rootReducer from './reducers';

import middleware, { sagaMiddleware } from './middleware';

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

/* istanbul ignore next */
const configStore = (initialState = {}) => {
	const store = createStore(
		rootReducer,
		initialState,
		process.env.NODE_ENV === 'development'
			? composeEnhancer(applyMiddleware(...middleware))
			: applyMiddleware(...middleware),
	);

	let sagaTask = sagaMiddleware.run(rootSaga);

	if (module.hot) {
		module.hot.accept('./reducers', () => {
			store.replaceReducer(require('./reducers').default);
		});
		module.hot.accept('./sagas', () => {
			sagaTask.cancel();
			sagaTask.toPromise().then(() => {
				sagaTask = sagaMiddleware.run(require('./sagas').default);
			});
		});
	}

	return {
		persistor: persistStore(store),
		store,
	};
};

const { store, persistor } = configStore();

global.store = store;

export { store, persistor };
