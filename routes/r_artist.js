var express = require('express');
var router = express.Router();
let axios = require('axios')

/* GET home page. */
router.get('/:id', ensureLoggedIn('/auth/login'), async (req, res, next) => {
    let data = {};
    data.artist = await axios.get('https://api.deezer.com/artist/'+req.params.id);
    data.title = data.artist.data.name
    data.topTracks = await axios.get('https://api.deezer.com/artist/'+req.params.id+'/top');
    data.artistAlbums = await axios.get('https://api.deezer.com/artist/'+req.params.id+'/top');
    data.similiarArtists = await axios.get('https://api.deezer.com/artist/'+req.params.id+'/related?limit=14');
    data.artistAlbums = await axios.get('https://api.deezer.com/artist/'+req.params.id+'/albums/');
    data.artistPlaylists = await axios.get('https://api.deezer.com/artist/'+req.params.id+'/playlists/?limit=14');
    if (req.query.layout == 'false') data.layout = false;
    res.render('v_artist/v_detail', data)
});

module.exports = router;
