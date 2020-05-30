import axios from 'axios';

const { REACT_APP_BASE_API_URL = '' } = process.env;

// create an axios instance
const service = axios.create({
	baseURL: `${REACT_APP_BASE_API_URL}/api`, // url = base url for backend server + request url
	withCredentials: true, // send cookies when cross-domain requests
	timeout: 5000, // request timeout
});

// request interceptor
service.interceptors.request.use(
	(config) => {
		// do something before request is sent
		return config;
	},
	(error) => {
		// do something with request error
		// eslint-disable-next-line no-console
		console.log(error); // for debug
		return Promise.reject(error);
	},
);

// response interceptor
service.interceptors.response.use(
	/**
	 * Determine the request status by custom code
	 * Here is just an example
	 * You can also judge the status by HTTP Status Code
	 */
	(response) => {
		const { status, data: res } = response;
		// if the status is 4xx or 5xx, it is judged as an error.
		// although any status not matching 2xx would be handled
		// by the (error) function below
		if (status > 399) {
			return Promise.reject(new Error(res.message || 'Error'));
		}
		return res;
	},
	(error) => {
		const { response } = error;
		if (response) {
			const { message } = response.data;
			return Promise.reject(new Error(message || error));
		}

		return Promise.reject(new Error(error));
	},
);

export const setToken = (token) => {
	service.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const deleteToken = () => {
	service.defaults.headers.common.Authorization = null;
};

export default service;
