import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import clx from 'classnames';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

import Login from 'components/Login';
import Logo from 'components/Logo';

import history from 'modules/history';
import { Menu, X } from '../../node_modules/react-feather/dist/index';

const Header = ({ isAuthenticated }) => {
	const [path, setPath] = useState(history.location.pathname);
	const [modal, setModal] = useState(false);

	history.listen(({ pathname }) => {
		setModal(false);
		setPath(pathname);
	});

	useEffect(() => {
		setModal(false);
	}, [isAuthenticated]);

	const links = [
		{
			to: '/',
			text: 'Home',
			privateRoute: false,
		},
		{
			to: '/articles',
			text: 'Articles',
			privateRoute: false,
		},
	];
	const linksToDisplay = links.filter(
		({ privateRoute }) => !privateRoute || isAuthenticated,
	);

	const renderLinks = () => {
		return linksToDisplay.map((link, index) => {
			return (
				<Link
					key={index}
					to={link.to}
					className={clx('header-link', {
						bold: path === link.to,
						kepler: Modernizr.mq('(max-width:1000px)'),
					})}
				>
					{link.text}
				</Link>
			);
		});
	};

	return (
		<div className="navbar flex row spacing space-between">
			<Logo />
			<div
				className="flex center div-clickable mobile"
				onClick={() => setModal(!modal)}
			>
				<Menu />
			</div>
			<Modal
				isOpen={modal}
				onRequestClose={() => setModal(false)}
				contentLabel="Header Modal"
				ariaHideApp={false}
				className="prompt-modal header-modal shadow-dark"
				overlayClassName="prompt-modal-overlay"
			>
				<div
					onClick={() => setModal(false)}
					className="modal-close-button div-clickable"
				>
					<X />
				</div>
				<div className="flex column center">
					{renderLinks()}
					<div className="header-dash" />
					<Login />
				</div>
			</Modal>
			<div className="flex row center no-mobile">
				{renderLinks()}
				<Login />
			</div>
		</div>
	);
};

Header.propTypes = {
	isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.user.isAuthenticated,
});

export default connect(mapStateToProps)(Header);
