var express = require('express');
var router = express.Router();
let axios = require('axios')

/* GET home page. */
router.get('/:id', ensureLoggedIn('/auth/login'), async (req, res, next) => {
    let data = {};
    data.album = await axios.get('https://api.deezer.com/album/'+req.params.id+'');
    data.title = data.album.data.title
    data.othersAlbum = await axios.get('https://api.deezer.com/artist/'+data.album.data.artist.id+'/albums')
    data.cardTitle = 'More by ' + data.album.data.title
    if (req.query.layout == 'false') data.layout = false;
    res.render('v_album/v_detail', data)
})

module.exports = router;
