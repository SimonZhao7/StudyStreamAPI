const router = require('express').Router()
const {
    handleCallback,
    addNewPlaylist,
    getTracks,
    removeTrack,
    search,
    addTrack,
    getRecommendations,
} = require('../controllers/spotify')

router.route('/callback').post(handleCallback)

router.route('/playlists').post(addNewPlaylist).get(search)

router.route('/tracks').get(getRecommendations)

router
    .route('/playlists/:studySetId')
    .get(getTracks)
    .delete(removeTrack)
    .post(addTrack)

module.exports = router
