import React from 'react';
import { goBack } from 'modules/history';
import { ArrowLeft } from 'react-feather';

const Private = () => (
	<div className="home flex column center spacing-1">
		<button
			type="button"
			className="btn"
			onClick={() => {
				goBack();
			}}
		>
			<div className="flex center">
				<ArrowLeft />
			</div>
			Back
		</button>
		<h3 className="font-light mono font-center">
			This is a protected route, kindly login :)
		</h3>
		<h5>
			<i>To login click the header above</i>
		</h5>
	</div>
);

export default Private;
