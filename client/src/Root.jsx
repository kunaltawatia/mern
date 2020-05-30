import React from 'react';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { HelmetProvider } from 'react-helmet-async';
import { hot } from 'react-hot-loader/root';

import { store, persistor } from 'store/index';

import { FullScreenLoader } from 'components/Loader';

import App from './App';

class Root extends React.Component {
	render() {
		return (
			<Provider store={store}>
				<PersistGate loading={<FullScreenLoader />} persistor={persistor}>
					<HelmetProvider>
						<App />
					</HelmetProvider>
				</PersistGate>
			</Provider>
		);
	}
}

export default hot(Root);
