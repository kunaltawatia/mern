import React from 'react';
import { push } from 'modules/history';

const Logo = () => (
	<div className="logo div-clickable" onClick={() => push('/')}>
		<h1 className="logo-title">React Redux Saga Hot</h1>
		<h3 className="logo-subtitle mono">MERN Boilerplate</h3>
	</div>
);
export default Logo;
