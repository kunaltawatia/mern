import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import history from 'modules/history';

import config from 'config';

import Home from 'screens/Home';
import Private from 'screens/Private';
import Article from 'screens/Article';
import NotFound from 'screens/NotFound';
import Profile from 'screens/Profile';

import Header from 'components/Header';
import SystemAlerts from 'components/SystemAlerts';
import Footer from 'components/Footer';

import './App.scss';

export class App extends React.Component {
	render() {
		return (
			<Router history={history}>
				<Helmet
					defer={false}
					encodeSpecialCharacters={true}
					defaultTitle={config.name}
					titleTemplate={`%s | ${config.name}`}
					titleAttributes={{ itemprop: 'name' }}
				/>
				<Header />
				<div className="main">
					<Switch>
						<Route path="/" exact component={Home} />
						<Route path="/articles" component={Article} />
						<Route path="/profile" component={Profile} />
						<Route path="/private" component={Private} />
						<Route component={NotFound} />
					</Switch>
				</div>
				<Footer />
				<SystemAlerts />
			</Router>
		);
	}
}

export default App;
