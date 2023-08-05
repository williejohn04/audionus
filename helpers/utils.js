module.exports = utils = {
    hitDeezerAPI: function(paths, cb) {
        if (!Array.isArray(paths)) paths = [paths]
        Promise.all(paths.map((path) => axios.get('https://api.deezer.com'+path))).then( async (results) => {
            let cleanData = [];
            await results.forEach(result => {
                if (result.data.error) {
                    cleanData.push({
                        error: true,
                        message: result.data.error.message
                    })
                    cleanData.errors = true
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