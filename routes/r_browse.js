const express = require('express');
const router = express.Router();
const browseController = require('../controllers/c_browse')

/* GET home page. */
router.get('/search/:q', ensureLoggedIn('/auth/login'), browseController.search)

module.exports = router;
