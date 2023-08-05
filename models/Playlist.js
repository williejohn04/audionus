const mongoose = require('mongoose');
const PlaylistSchema = new mongoose.Schema({}, {strict: false});
const Playlist = mongoose.model('Playlist', PlaylistSchema);
module.exports = Playlist;