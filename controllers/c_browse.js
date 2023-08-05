exports.search = (req, res, next) => {
    let data = {};
    data.searchQuery = req.params.q;
    data.title = 'Search Result for: ' + req.params.q;
    utils.hitDeezerAPI('/search?q='+decodeURIComponent(req.params.q), false, async (results) => {
        if (results.errors) res.redirect('/');
        data.searchedTracks = results[0]
        if (req.query.layout == 'false') data.layout = false;
        res.render('v_browse/v_search', data)  
    })
}