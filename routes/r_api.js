const { ensureLoggedIn } = require('connect-ensure-login');
const express = require('express');
const router = express.Router();

/* GET home page. */
router.post('/get-splide-component', ensureLoggedIn('/auth/login'), (req, res, next) => {
  res.render('partials/card_slide', { cardTitle: req.body.title, idName: req.body.idName, cardTextFrom: req.body.cardTextFrom, items: JSON.parse(req.body.json), layout: false});
});

router.get('/search/:type', ensureLoggedIn('/auth/login'), (req, res, next) => {
  utils.hitDeezerAPI('/search/'+req.params.type+'?limit=15&q='+decodeURIComponent(req.query.q), true, async (results) => {
    res.statusCode = 200;
    res.end(JSON.stringify(results[0]));
  })
})

router.post('/get-cards-component', ensureLoggedIn('/auth/login'), (req, res, next) => {
  console.log(req.body.circleImg);
  res.render('partials/card_basic', {circleImg: req.body.circleImg, cardTitle: req.body.title, items: JSON.parse(req.body.json), type: req.body.type, layout: false});
})

module.exports = router;
