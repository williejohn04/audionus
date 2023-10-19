var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:id', ensureLoggedIn('/auth/login'), (req, res, next) => {
    let data = {};
    utils.hitDeezerAPI('/album/'+req.params.id, true, async (response) => {
        if (response.errors) res.redirect('/');
        
        data.album = response[0];
        data.title = data.album.title
        data.othersAlbum = await axios.get('https://api.deezer.com/artist/'+data.album.artist.id+'/albums')
        data.cardTitle = 'More by ' + data.album.artist.name
        if (req.query.layout == 'false') data.layout = false;
        res.render('v_album/v_detail', data)
    })
})

module.exports = router;
