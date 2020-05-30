import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export const FullScreenLoader = () => {
	return (
		<div className="full-loader">
			<div className="fly">
				<div className="base">
					<span />
					<div className="face" />
				</div>
			</div>
			<div className="longfazers">
				{[...Array(19).keys()].map((_, index) => {
					return <span key={index} />;
				})}
			</div>
		</div>
	);
};

const Loader = (props) => {
	const { type, color } = props;
	const className = classnames('loader', type);

	let divs = 0;
	let inlineDivStyle = {};
	let inlineContainerStyle = {};

	switch (type) {
		case 'dual-ring':
			divs = 0;
			inlineContainerStyle = {
				borderColor: `${color} transparent ${color} transparent`,
			};
			break;
		case 'ring':
			divs = 2;
			inlineDivStyle = {
				borderColor: `${color} transparent transparent transparent`,
			};
			break;
		case 'ellipsis':
			divs = 3;
			inlineDivStyle = {
				backgroundColor: color,
			};
			break;
		//	ripple
		default:
			divs = 4;
			inlineDivStyle = {
				borderColor: color,
			};
			break;
	}

	return (
		<div className={className} style={inlineContainerStyle}>
			{[...Array(divs).keys()].map((_, index) => {
				return <div key={index} style={inlineDivStyle} />;
			})}
		</div>
	);
};

Loader.propTypes = {
	color: PropTypes.string,
	type: PropTypes.oneOf(['ellipsis', 'ripple', 'ring', 'dual-ring']),
};

Loader.defaultProps = {
	color: 'rgba(0, 0, 0, 0.25)',
	type: 'ripple',
};

export default Loader;
