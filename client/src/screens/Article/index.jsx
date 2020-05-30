import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';

import NotFound from 'screens/NotFound';

import RoutePrivate from 'components/RoutePrivate';

import Article from './ArticleList';
import DraftArticle from './DraftArticle';
import ArticleView from './ArticleView';

class ArticleIndex extends React.Component {
	static propTypes = {
		isAuthenticated: PropTypes.bool.isRequired,
	};

	render() {
		const { isAuthenticated } = this.props;
		const path = '/articles';

		return (
			<Switch>
				<Route path={path} exact component={Article} />
				<RoutePrivate
					isAuthenticated={isAuthenticated}
					path={`${path}/draft`}
					component={DraftArticle}
				/>
				<RoutePrivate
					isAuthenticated={isAuthenticated}
					path={`${path}/view`}
					component={ArticleView}
				/>
				<Route component={NotFound} />
			</Switch>
		);
	}
}

/* istanbul ignore next */
function mapStateToProps(state) {
	return {
		isAuthenticated: state.user.isAuthenticated,
	};
}

export default connect(mapStateToProps)(ArticleIndex);
