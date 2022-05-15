const router = require('express').Router()
const { handleCallback, addNewPlaylist, getTracks } = require('../controllers/spotify')

router.route('/callback').post(handleCallback)

router.route('/playlists').post(addNewPlaylist).get(getTracks)

module.exports = router