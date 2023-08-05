const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/:id', ensureLoggedIn('/auth/login'), async (req, res, next) => {
    let data = {};
    utils.hitDeezerAPI(['/artist/'+req.params.id, '/artist/'+req.params.id+'/top', '/artist/'+req.params.id+'/related?limit=14', '/artist/'+req.params.id+'/albums/','/artist/'+req.params.id+'/playlists/?limit=14'], true, results => {
        if (results.errors) res.redirect('/');
        data.artist = results[0];
        data.topTracks = results[1];
        data.similiarArtists = results[2];
        data.artistAlbums = results[3];
        data.artistPlaylists = results[4];
        data.title = data.artist.name

        if (req.query.layout == 'false') data.layout = false;
        res.render('v_artist/v_detail', data)
    })

});

module.exports = router;
