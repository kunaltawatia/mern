import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
	{
		/* redux-saga actions */
		signInUser: ['response'], // Action after google sign in response
		signOutUser: null, // Action after google sign out response
		loadProfile: ['id'],

		/* redux state actions */
		loadUser: ['user', 'token'], // put user details after sign in success
		setProfile: ['profile', 'id'],
		deleteUser: null, // remove user after signout success
	},
	{
		prefix: 'USER_',
	},
);

export const userActionTypes = Types;
export default Creators;
