const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/:id', ensureLoggedIn('/auth/login'), (req, res, next) => {
    // https://api.deezer.com/playlist/1479458365
    let data = {};
    utils.hitDeezerAPI('/playlist/'+req.params.id, true, async (response) => {
        if (response.error) return res.redirect('/' + ((req.query.layout == 'false') ? '?layout=false' : '' ) );
        
        data.playlist = response[0]
        data.title = data.playlist.title
        if (req.query.layout == 'false') data.layout = false;
        res.render('v_playlist/v_detail', data)
    })
})

module.exports = router;
