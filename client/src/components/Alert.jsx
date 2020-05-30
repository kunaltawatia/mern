import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { X, Check, AlertCircle, AlertTriangle, XOctagon } from 'react-feather';

const Alert = ({ message, handleClickClose, id, variant }) => {
	let icon = <></>;

	switch (variant) {
		case 'danger':
			icon = <XOctagon />;
			break;
		case 'info':
			icon = <AlertCircle />;
			break;
		case 'warning':
			icon = <AlertTriangle />;
			break;
		default:
			icon = <Check />;
	}

	return (
		<div
			className={classnames('alert flex row center', {
				[variant]: true,
			})}
		>
			<div className="icon-display flex center">{icon}</div>
			{message}
			<div
				data-id={id}
				className="close-button div-clickable"
				onClick={handleClickClose}
				type="button"
			>
				<X onClick={handleClickClose} />
			</div>
		</div>
	);
};

Alert.propTypes = {
	handleClickClose: PropTypes.func,
	id: PropTypes.string,
	message: PropTypes.string,
	variant: PropTypes.string,
};

Alert.defaultProps = {
	variant: 'info',
};

export default Alert;
