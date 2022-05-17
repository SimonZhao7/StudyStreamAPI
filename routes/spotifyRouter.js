const router = require('express').Router()
const { handleCallback, addNewPlaylist, getTracks, removeTrack, search } = require('../controllers/spotify')

router.route('/callback').post(handleCallback)

router.route('/playlists').post(addNewPlaylist).get(search)

router.route('/playlists/:studySetId').get(getTracks).delete(removeTrack)

module.exports = router