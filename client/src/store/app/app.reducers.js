import { createReducer } from 'reduxsauce';
import { appActionTypes } from './app.actions';

/**
 * The initial values for the redux state.
 */
const INITIAL_STATE = {
	alerts: [],
	statusStore: {},
};

export const showAlert = (state, alert) => ({
	...state,
	alerts: state.alerts.concat([alert]),
});

export const hideAlert = (state, { id }) => ({
	...state,
	alerts: state.alerts.filter((a) => a.id !== id),
});

export const showPrompt = (state, prompt) => ({
	...state,
	prompt,
});

export const closePrompt = (state) => ({
	...state,
	prompt: {},
});

export const setStatus = (state, { key, status }) => ({
	...state,
	statusStore: {
		...state.statusStore,
		[key]: status,
	},
});

export const reducer = createReducer(INITIAL_STATE, {
	[appActionTypes.SHOW_ALERT]: showAlert,
	[appActionTypes.HIDE_ALERT]: hideAlert,
	[appActionTypes.SHOW_PROMPT]: showPrompt,
	[appActionTypes.CLOSE_PROMPT]: closePrompt,
	[appActionTypes.SET_STATUS]: setStatus,
});

export default {
	app: reducer,
};
