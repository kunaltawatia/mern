import jss from 'jss';
import preset from 'jss-preset-default';

jss.setup(preset());

const spring = 'cubic-bezier(0.68, 0.01, 0.32, 1.01)';

export const createClass = (transition, time, delay) => {
	return jss
		.createStyleSheet({
			class: {
				[`&.${transition}-appear-active`]: {
					transition: `all ${time.toPrecision(
						1,
					)}s ${spring} ${delay.toPrecision(1)}s`,
				},
				[`&.${transition}-enter-active`]: {
					transition: `all ${time.toPrecision(
						1,
					)}s ${spring} ${delay.toPrecision(1)}s`,
				},
				[`&.${transition}-exit-active`]: {
					transition: `all ${time.toPrecision(1)}s ${spring}`,
				},
			},
		})
		.attach().classes.class;
};
