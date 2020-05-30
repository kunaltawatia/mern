import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Image from 'components/Image';
import Loader from 'components/Loader';
import history from 'modules/history';
import { userActions } from 'store/actions';
import { ArticleListPreview } from './Article/ArticleList';

export class Props extends React.PureComponent {
	constructor(props) {
		super(props);
		const { id } = history.location.query;
		this.state = {
			id,
		};
	}

	static propTypes = {
		getProfile: PropTypes.func,
		profiles: PropTypes.object,
	};

	componentDidMount() {
		const { profiles, getProfile } = this.props;
		const { id } = this.state;

		window.scrollTo(0, 0);

		if (!profiles?.[id]) {
			getProfile?.(id);
		}
	}

	render() {
		const { profiles } = this.props;
		const { id } = this.state;

		const profile = profiles?.[id];

		if (!profile)
			return (
				<div className="profile flex center">
					<Loader />
				</div>
			);

		const { name, picture, email } = profile;

		const [nameString, roll] = name
			?.split?.('(')
			.map((str) => str.replace(')', '').trim());

		const image = picture?.replace?.(new RegExp('=s[1-9]{1,}-c', 'i'), '');

		return (
			<div className="profile flex column">
				<Image src={image} circle size="15rem" />
				<h1 className="profile-name">{nameString}</h1>
				<h3 className="profile-email mono font-light">{email}</h3>
				<h3 className="profile-email mono font-light">{roll}</h3>
				<ArticleListPreview
					query={{
						user: id,
					}}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	profiles: state.user.profiles,
});

const mapDispatchToProps = (dispatch) => ({
	getProfile: (id) => dispatch(userActions.loadProfile(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Props);
