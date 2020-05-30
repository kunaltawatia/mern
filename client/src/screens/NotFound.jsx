import React from 'react';
import Transition from 'components/Transition';

const NotFound = () => (
	<div className="not-found">
		<Transition progressiveDelay={0.2} transition="slide-up">
			<h1>404</h1>
			<h2>page not found</h2>
		</Transition>
	</div>
);

export default NotFound;
