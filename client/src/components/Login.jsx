import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { connect } from 'react-redux';
import { Smile, LogOut, LogIn } from 'react-feather';
import { userActions, appActions } from 'store/actions';
import { STATUS } from 'constants/index';

import Transition from 'components/Transition';
import Image from 'components/Image';

const { REACT_APP_CLIENT_ID } = process.env;

const Login = ({ user, signIn, signOut, setStatus, status }) => {
	const mobile = Modernizr.mq('(max-width: 1000px)');
	const { isAuthenticated } = user;
	const loading = status === STATUS.RUNNING;

	const [visible, setVisible] = useState(false);

	useEffect(() => {
		setVisible(false);
	}, [isAuthenticated]);

	const onRequest = () => setStatus('USER', STATUS.RUNNING);

	if (isAuthenticated) {
		const { picture, _id } = user.info;
		return (
			<div
				className={classnames('login flex column', { center: mobile })}
				onMouseEnter={() => !mobile && setVisible(true)}
				onMouseLeave={() => !mobile && setVisible(false)}
			>
				<Image src={picture} circle size="60px" />
				{mobile ? (
					<div className="flex column">
						<Link
							to={`/profile?id=${_id}`}
							className="no-hover header-link kepler flex row space-between spacing"
						>
							Profile
						</Link>
						<GoogleLogout
							clientId={REACT_APP_CLIENT_ID}
							onRequest={onRequest}
							onLogoutSuccess={signOut}
							onFailure={signOut}
							render={({ onClick }) => {
								return (
									<a
										onClick={onClick}
										className="no-hover header-link kepler flex row space-between spacing"
									>
										Logout
									</a>
								);
							}}
						/>
					</div>
				) : (
					<Transition time={0.5} transition="profile-dropdown">
						{visible ? (
							<div className="dropdown flex column spacing shadow-dark">
								<Link
									to={`/profile?id=${_id}`}
									className="no-hover flex row space-between spacing"
								>
									<Smile size={18} />
									<p>Profile</p>
								</Link>
								<GoogleLogout
									clientId={REACT_APP_CLIENT_ID}
									onRequest={onRequest}
									onLogoutSuccess={signOut}
									onFailure={signOut}
									render={({ onClick }) => {
										return (
											<a
												onClick={onClick}
												className="no-hover flex row space-between spacing"
											>
												<LogOut size={18} />
												<p>Logout</p>
											</a>
										);
									}}
								/>
							</div>
						) : null}
					</Transition>
				)}
			</div>
		);
	}

	return (
		<GoogleLogin
			clientId={REACT_APP_CLIENT_ID}
			onRequest={onRequest}
			onFailure={signIn}
			onSuccess={signIn}
			cookiePolicy="single_host_origin"
			render={({ onClick, disabled }) => {
				return (
					<button
						className={classnames('btn login-button', {
							animate: loading,
						})}
						type="button"
						disabled={disabled || loading}
						onClick={onClick}
					>
						<div className="flex center">
							<LogIn />
						</div>
						Login
					</button>
				);
			}}
		/>
	);
};

Login.propTypes = {
	setStatus: PropTypes.func,
	signIn: PropTypes.func,
	signOut: PropTypes.func,
	status: PropTypes.string,
	user: PropTypes.object,
};

const mapStateToProps = (state) => ({
	user: state.user,
	status: state.app.statusStore.USER,
});

const mapDispatchToProps = (dispatch) => ({
	signIn: (response) => dispatch(userActions.signInUser(response)),
	signOut: () => dispatch(userActions.signOutUser()),
	setStatus: (key, status) => dispatch(appActions.setStatus(key, status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
