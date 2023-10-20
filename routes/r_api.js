const { ensureLoggedIn } = require('connect-ensure-login');
const express = require('express');
const router = express.Router();

/* GET home page. */
router.post('/get-splide-component', ensureLoggedIn('/auth/login'), (req, res, next) => {
  res.render('partials/card_slide', { cardTitle: req.body.title, idName: req.body.idName, cardTextFrom: req.body.cardTextFrom, items: JSON.parse(req.body.json), layout: false});
});

router.get('/search/:type', ensureLoggedIn('/auth/login'), (req, res, next) => {
  utils.hitDeezerAPI('/search/'+req.params.type+'?limit=16&q='+decodeURIComponent(req.query.q), true, async (results) => {
    res.statusCode = 200;
    res.end(JSON.stringify(results[0]));
  })
})

router.post('/get-cards-component', ensureLoggedIn('/auth/login'), (req, res, next) => {
  res.render('partials/card_basic', {circleImg: req.body.circleImg, cardTitle: req.body.title, items: JSON.parse(req.body.json), type: req.body.type, layout: false});
})

router.get('/api/temp', (req, res, next) => {
  const { dirname } = require('path');
  res.sendFile(__dirname+'/Capture.PNG')
})

router.get('/radio/top', ensureLoggedIn('/auth/login'), async (req, res, next) => {
    let radios = await axios.get('https://api.deezer.com/radio/top')
    // let newImgUrl = '';
    // for (let index = 0; index < radios.data.data.length; index++) {
    //     newImgUrl = `https://textoverimage.moesif.com/image?image_url=${radios.data.data[index].picture_medium}&x_align=center&y_align=middle&text_size=16&margin=2&text=${radios.data.data[index].title}`;
    //     radios.data.data[index].picture_medium = newImgUrl;
    //     if (index == radios.data.data.length - 1) res.end(JSON.stringify(radios.data.data))
    // }
    res.end(JSON.stringify(radios.data.data))
})

router.get('/editorial/:type', ensureLoggedIn('/auth/login'), async (req, res, next) => {
    let url = '';
    
    switch (req.params.type) {
        case 'charts':
            url = 'https://api.deezer.com/editorial/0/charts'
            break;
        case 'selection':
            url = 'https://api.deezer.com/editorial/0/selection'
            break;
    }
    const editorial = await axios.get(url);
    res.end(JSON.stringify(editorial.data))
})

router.get('/playback/getVideoId', async (req, res, next) => {
  const {Innertube, Utils, UniversalCache } = require('youtubei.js');
  const youtube = await Innertube.create({location: 'ID'})
  
  const searched = await youtube.search(`${req.query.title} ${req.query.artist}`)

  console.log(req.query.title, req.query.artist, searched.results[0].id)
  const info = await youtube.getBasicInfo(searched.results[0].id);
  const format = info.chooseFormat({ type: 'audio', quality: 'best' });
  const url = format?.decipher(youtube.session.player);
  res.json({url: url})
})

module.exports = router;
