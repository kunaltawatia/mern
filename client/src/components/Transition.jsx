import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { createClass } from 'modules/jss';

let classes = {};

const getClass = (transition, time, delay) => {
	const key = `${transition}_${time.toPrecision(1)}_${delay.toPrecision(1)}`;

	if (classes[key]) return classes[key];

	classes[key] = createClass(transition, time, delay);

	return classes[key];
};

const Transition = ({
	children,
	transition,
	time,
	delay,
	progressiveDelay,
	...rest
}) => {
	return (
		<TransitionGroup component={null}>
			{React.Children.map(children, (child, i) => (
				<CSSTransition
					classNames={`${getClass(
						transition,
						time,
						delay + progressiveDelay * i,
					)} ${transition}`}
					{...rest}
					timeout={{
						appear: (time + delay + progressiveDelay * i) * 1000,
						enter: (time + delay + progressiveDelay * i) * 1000,
						exit: time * 1000,
					}}
				>
					{child}
				</CSSTransition>
			))}
		</TransitionGroup>
	);
};

Transition.propTypes = {
	appear: PropTypes.bool,
	children: PropTypes.node,
	delay: PropTypes.number,
	enter: PropTypes.bool,
	exit: PropTypes.bool,
	progressiveDelay: PropTypes.number,
	time: PropTypes.number,
	transition: PropTypes.string,
};

Transition.defaultProps = {
	appear: true,
	enter: true,
	exit: true,
	delay: 0,
	progressiveDelay: 0,
	time: 0.5,
	transition: 'fade',
};

export default Transition;
