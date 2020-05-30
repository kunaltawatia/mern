import { createReducer } from 'reduxsauce';
import { STATUS } from 'constants/index';
import { REHYDRATE } from 'redux-persist';
import { userActionTypes } from './user.actions';

/**
 * The initial values for the redux state.
 */
const INITIAL_STATE = {
	token: null,
	isAuthenticated: false,
	status: STATUS.IDLE,
	profiles: {},
};

export const loadUser = (state, { token, user }) => ({
	...state,
	info: user,
	token,
	isAuthenticated: true,
	status: STATUS.READY,
});

export const deleteUser = (state) => ({
	...state,
	info: {},
	token: null,
	isAuthenticated: false,
	status: STATUS.IDLE,
});

export const setProfile = (state, { id, profile }) => ({
	...state,
	profiles: {
		...(state.profiles || {}),
		[id]: profile,
	},
});

export const rehydrate = (state, { payload }) => ({
	...state,
	...(payload?.user ?? {}),
});

export const reducer = createReducer(INITIAL_STATE, {
	[userActionTypes.LOAD_USER]: loadUser,
	[userActionTypes.SET_PROFILE]: setProfile,
	[userActionTypes.DELETE_USER]: deleteUser,
	[REHYDRATE]: rehydrate,
});

export default {
	user: reducer,
};
