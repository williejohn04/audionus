const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');


router.get('/', ensureLoggedIn('/auth/login'), async (req, res, next) => {
  let data = {title: 'Home Page'};
  if (req.query.layout == 'false') data.layout = false;
  
  data.chartsPlaylists = await Playlist.aggregate([
    { $match: { type_playlist: 'charts' } },
    { $sample: { size: 10 } }
  ]);

  data.chartsPlaylists.unshift({id: 3155776842, title: 'Top Worldwide', picture_medium: 'https://e-cdns-images.dzcdn.net/images/playlist/f1ac18441ab1dabc94282e4d1d5f4955/250x250-000000-80-0-0.jpg', type: 'playlist'}, {id: 1116188761, title: 'Top Indonesia', picture_medium: 'https://e-cdns-images.dzcdn.net/images/playlist/8bfe963147a8dff86df9ded5b90189c0/250x250-000000-80-0-0.jpg', type: 'playlist'})

  res.render('index', data)
  
});

module.exports = router;
