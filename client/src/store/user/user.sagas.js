/**
 * @module User/Sagas
 * @desc User
 */
import { setToken, deleteToken } from 'api';
import { getUser, getProfile } from 'api/user';

import { all, put, takeLatest, call, select } from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist/lib/constants';

import { userActions, appActions } from 'store/actions';
import { STATUS } from 'constants/index';

import { userActionTypes } from './user.actions';

/**
 * Login
 */
export function* signin({ response }) {
	try {
		const { tokenId } = response;
		if (tokenId) {
			//	initialise token in api to make a request
			yield call(setToken, tokenId);

			//	get user details as a health check
			const user = yield call(getUser);

			//	put user details in state
			yield put(userActions.loadUser(user, tokenId));

			//	show welcome message
			yield put(
				appActions.showAlert(`Good to have you ${user.name.split(' ')[0]}`, {
					variant: 'success',
				}),
			);
		} else {
			//	error code provided by google auth button
			const { error } = response;

			switch (error) {
				//	initialization of the Google Auth API failed
				//	this will occur if a client doesn't have
				//	third party cookies enabled
				case 'idpiframe_initialization_failed':
					throw new Error(
						'Google auth failed on this link: Enable third party cookies',
					);

				//	The user closed the popup before finishing the sign in flow.
				case 'popup_closed_by_user':
					throw new Error('The login popup was closed');

				//	The user denied the permission to the scopes required
				case 'access_denied':
					throw new Error('Permission was denied');

				//	No user could be automatically selected without prompting the consent flow.
				case 'immediate_failed':
					throw new Error(
						'No user could be selected, kindly login with google services (for example, gmail)',
					);

				default:
					throw new Error('Token undefined');
			}
		}
	} catch ({
		//	message forwarded by instanceof Error or api
		//	default value 'Something went wrong :('
		message = 'Something went wrong :(',
	}) {
		//	show fail alert
		yield put(appActions.showAlert(message, { variant: 'danger' }));

		//	clear token from api
		yield call(deleteToken);

		//	clear authorization from state
		yield put(userActions.deleteUser());
	} finally {
		//	finish the loading in status store
		yield put(appActions.setStatus('USER', STATUS.IDLE));
	}
}

/**
 * Logout
 */
export function* signout() {
	//	clear token from api
	yield call(deleteToken);

	//	clear authorization from state
	yield put(userActions.deleteUser());

	//	finish the loading in status store
	yield put(appActions.setStatus('USER', STATUS.IDLE));

	//	show good bye message
	yield put(
		appActions.showAlert('You have been logged out', { variant: 'success' }),
	);
}

/**
 * App startup
 */
export function* startUp() {
	const token = yield select((state) => state.user.token);
	if (token) {
		//	initialise token in api to make a request
		yield call(setToken, token);
	}
}

export function* loadProfile({ id }) {
	try {
		//	start loading
		yield put(appActions.setStatus('PROFILE_FETCH', STATUS.RUNNING));

		//	get profile for given id from server
		const profile = yield call(getProfile, id);

		//	put articles list in state
		yield put(userActions.setProfile(profile, id));

		//	complete loading
		yield put(
			appActions.setStatus(
				'PROFILE_FETCH',
				typeof profile !== 'object' || !profile._id !== id
					? STATUS.ERROR
					: STATUS.READY,
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
		yield put(appActions.setStatus('PROFILE_FETCH', STATUS.ERROR));
	}
}

/**
 * User Sagas
 */
export default function* root() {
	yield all([
		takeLatest(userActionTypes.SIGN_IN_USER, signin),
		takeLatest(userActionTypes.SIGN_OUT_USER, signout),
		takeLatest(userActionTypes.LOAD_PROFILE, loadProfile),
		takeLatest(REHYDRATE, startUp),
	]);
}
