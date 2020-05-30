import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import Private from 'screens/Private';

const RoutePrivate = ({ component: Component, isAuthenticated, ...rest }) => (
	<Route
		{...rest}
		render={(props) =>
			isAuthenticated ? <Component {...props} /> : <Private />
		}
	/>
);

RoutePrivate.propTypes = {
	component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
	isAuthenticated: PropTypes.bool.isRequired,
	location: PropTypes.object,
};

export default RoutePrivate;
