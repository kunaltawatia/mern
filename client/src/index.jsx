import React from 'react';
import ReactDOM from 'react-dom';

import Root from './Root';
import { register } from './serviceWorker';

ReactDOM.render(<Root />, document.getElementById('root'));

/* istanbul ignore next */
register({
	onUpdate: () => {
		/**
		 * Pass notification of website update
		 */
	},
});
