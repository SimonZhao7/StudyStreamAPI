const router = require('express').Router()
const { handleCallback, addNewPlaylist, getTracks, removeTrack } = require('../controllers/spotify')

router.route('/callback').post(handleCallback)

router.route('/playlists').post(addNewPlaylist).get(getTracks).delete(removeTrack)

module.exports = router