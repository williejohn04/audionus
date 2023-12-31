module.exports = utils = {
    hitDeezerAPI: function(paths, cache, cb) {
        if (!Array.isArray(paths)) paths = [paths]
        Promise.all(paths.map((path) => axios.get('https://api.deezer.com'+path, {cache: cache}))).then( async (results) => {
            let cleanData = [];
            await results.forEach(result => {
                if (result.data.error) {
                    cleanData.push({})
                } else {
                    cleanData.push(result.data)
                }
            });
            cb(cleanData)
        })
        .catch(error => {
            cb({error: true})
        })
    }
    

}