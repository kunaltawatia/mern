/*eslint-disable no-console */
const chalk = require('chalk');
const Rsync = require('rsync');

const paths = require('../config/paths');

function publish() {
	console.log(chalk.blue('Publishing...'));
	const rsync = new Rsync()
		.shell('ssh')
		.exclude('.DS_Store')
		.flags('az')
		.set('rsync-path', 'sudo rsync')
		.source(`${paths.appBuild}/`)
		.destination('user@machine:/var/www/html');

	rsync.execute((error, code, cmd) => {
		if (error) {
			console.log(chalk.red('Something went wrong...', error, code, cmd));
			process.exit(1);
		}

		console.log(chalk.green('Published'));
	});
}

module.exports = publish;

if (!module.parent) {
	publish();
}
