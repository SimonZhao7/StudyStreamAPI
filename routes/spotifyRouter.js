const router = require('express').Router()
const { handleCallback, addNewPlaylist, getTracks, removeTrack } = require('../controllers/spotify')

router.route('/callback').post(handleCallback)

router.route('/playlists').post(addNewPlaylist)

router.route('/playlists/:studySetId').get(getTracks).delete(removeTrack)

module.exports = router