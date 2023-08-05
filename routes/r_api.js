const express = require('express');
const router = express.Router();

/* GET home page. */
router.post('/get-cards-component', ensureLoggedIn('/auth/login'), (req, res, next) => {
  res.render('partials/card_slide', { cardTitle: req.body.title, idName: req.body.idName, cardTextFrom: req.body.cardTextFrom, items: JSON.parse(req.body.json), layout: false});
});

module.exports = router;
