const viewSetup = {
    main: {
        title: 'Audionus | Music for Everyone',
        view: 'index',
        script: `$(window).on('load', function() {
            getRequest('https://api.deezer.com/radio/top?output=jsonp', 'jsonp', data => {
                appendSplideComponent("Playlist You'll Like", data.data, 'recommendation-playlists-cards','#recommendation-playlists-wrapper')
            })
        
            getRequest('https://api.deezer.com/editorial/0/charts?output=jsonp', 'jsonp', charts => {
                appendSplideComponent("Top Playlists", charts.playlists.data, 'top-playlists-cards','#top-playlists-wrapper')
                appendSplideComponent("Top Artists", charts.artists.data, 'top-artists-cards','#top-artists-wrapper', 'name')
            })
            
            getRequest('https://api.deezer.com/editorial/0/selection?output=jsonp', 'jsonp', albums => {
                appendSplideComponent("Top Albums", albums.data, 'top-albums-cards','#top-albums-wrapper')
            })
        })`
    },
    artistDetail: {
        title: 'Artist Detail',
        view: 'v_artist/v_detail',
        script: ''
    }
}

const prepareView = function (key, req, res) {
    let setup = viewSetup[key]
    if (req.query.layout == 'false') {
        setup.layout = false
        res.render(setup.view, setup, (err, html) => {
            res.end(JSON.stringify({
                html: html,
                script: setup.script                
            }))
            return;
        })
    } else {
        res.render(setup.view, setup)
    }
}

module.exports = prepareView;
