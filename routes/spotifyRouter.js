const router = require('express').Router()
const { handleCallback, addNewPlaylist } = require('../controllers/spotify')

router.route('/callback').post(handleCallback)

router.route('/playlists').post(addNewPlaylist)

module.exports = router