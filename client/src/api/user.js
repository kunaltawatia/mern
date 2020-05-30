import api from './index';

/**
 * This function makes an API call, then
 * extracts and checks for the user data
 * enclosed in the response from the server
 */
export const getUser = async () => {
	const { user } = await api.get('/auth/user');
	return user;
};

/**
 * This makes an API call to fetch user profile
 */
export const getProfile = async (id) => {
	const { profile } = await api.get(`/profile/${id}`);
	return profile;
};
