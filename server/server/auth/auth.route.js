const express = require('express');
const authCtrl = require('./auth.controller');
const authenticate = require('../middlewares/authentication');

const router = express.Router(); // eslint-disable-line new-cap

/** GET /api/auth/user - Protected route,
 * require token for authentication, format: headers.Authorization: Bearer {token} */
router.route('/user').get(authenticate, authCtrl.getUser);

module.exports = router;
