import React from 'react';
import { connect } from 'react-redux';
import Image from 'components/Image';
import { ArticleListPreview } from './Article/ArticleList';

export class Home extends React.PureComponent {
	render() {
		return (
			<div className="home">
				<h1 className="logo-title">React Redux Saga Hot</h1>
				<h3 className="logo-subtitle mono font-light">MERN Boilerplate</h3>
				<Image
					src="/media/images/home-illustration.svg"
					height="20rem"
					width="100%"
				/>
				<ArticleListPreview />
			</div>
		);
	}
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(Home);
