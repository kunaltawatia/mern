import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { appActions } from 'store/actions';

import Transition from 'components/Transition';
import Alert from 'components/Alert';
import Modal from 'react-modal';
import { Check, X } from '../../node_modules/react-feather/dist/index';

export class SystemAlerts extends React.PureComponent {
	constructor(props) {
		super(props);

		this.timeouts = {};
	}

	static propTypes = {
		app: PropTypes.object.isRequired,
		dispatch: PropTypes.func.isRequired,
	};

	componentDidUpdate() {
		const {
			app: { alerts },
			dispatch,
		} = this.props;

		/* istanbul ignore else */
		if (alerts.length) {
			alerts.forEach((d) => {
				if (d.timeout && !this.timeouts[d.id]) {
					this.timeouts[d.id] = setTimeout(() => {
						dispatch(appActions.hideAlert(d.id));
					}, d.timeout * 1000);
				}
			});
		}
	}

	componentWillUnmount() {
		Object.keys(this.timeouts).forEach((d) => {
			clearTimeout(this.timeouts[d]);
		});
	}

	handleClick = (e) => {
		e.preventDefault();
		const { dataset } = e.currentTarget;
		const { dispatch } = this.props;

		dispatch(appActions.hideAlert(dataset.id));
	};

	closeModal = () => {
		const { dispatch } = this.props;

		dispatch(appActions.closePrompt());
	};

	renderAlerts() {
		const { app } = this.props;
		const items = app.alerts;

		if (!items.length) {
			return null;
		}

		return items.map((d) => (
			<Alert key={d.id} handleClickClose={this.handleClick} {...d} />
		));
	}

	render() {
		const {
			app: { prompt = {} },
		} = this.props;

		const { id, message, onConfirm } = prompt;

		return (
			<div className="alert-wrapper">
				<Modal
					isOpen={id?.length > 0}
					onRequestClose={this.closeModal}
					contentLabel="Prompt Modal"
					ariaHideApp={false}
					className="prompt-modal shadow-dark"
					overlayClassName="prompt-modal-overlay"
				>
					<div
						onClick={this.closeModal}
						className="modal-close-button div-clickable"
					>
						<X />
					</div>
					<div className="flex column center spacing-2">
						<h5>{message}</h5>
						<div className="flex row center space-around spacing-1">
							<button type="button" className="btn" onClick={this.closeModal}>
								<div className="flex center">
									<X />
								</div>
								nope
							</button>
							<button
								type="button"
								className="btn"
								onClick={() => {
									onConfirm();
									this.closeModal();
								}}
							>
								<div className="flex center">
									<Check />
								</div>
								Yeah
							</button>
						</div>
					</div>
				</Modal>
				<Transition transition="slide-up">{this.renderAlerts()}</Transition>
			</div>
		);
	}
}

/* istanbul ignore next */
function mapStateToProps(state) {
	return { app: state.app };
}

export default connect(mapStateToProps)(SystemAlerts);
