const express = require('express');
const profileCtrl = require('./profile.controller');

const router = express.Router(); // eslint-disable-line new-cap

router
	.route('/:userId')
	/** GET /api/articles/:articleId - Get articles */
	.get(profileCtrl.get);

/** Load articles when API with articleId route parameter is hit */
router.param('userId', profileCtrl.load);

module.exports = router;
