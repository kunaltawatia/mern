import { createBrowserHistory } from 'history';
import qs from 'qs';

const history = createBrowserHistory();

history.location = {
	...history.location,
	query: qs.parse(history.location.search.substr(1)),
	state: {},
};

history.listen(() => {
	history.location = {
		...history.location,
		query: qs.parse(history.location.search.substr(1)),
		state: history.location.state || {},
	};
});

const push = (goTo, state) => {
	if (goTo === history.location.pathname) {
		history.replace(goTo, {
			...(state || {}),
			referrer: history.location.state.referrer,
		});
	} else {
		history.push(goTo, {
			...(state || {}),
			referrer: history.location,
		});
	}
};

const goBack = () => {
	const { referrer = {} } = history.location.state;
	if (referrer.pathname) {
		history.goBack();
	} else {
		const path = history.location.pathname.split('/');
		history.replace(`${path.slice(0, path.length - 1).join('/')}`);
	}
};

const { replace } = history;

export { goBack, push, replace };
export default history;
