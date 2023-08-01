var express = require('express');
var router = express.Router();

router.get('/', ensureLoggedIn('/auth/login'), (req, res, next) => {
  let data = {title: 'Home Page'};
  if (req.query.layout == 'false') data.layout = false;
  res.render('index', data);
});

module.exports = router;
