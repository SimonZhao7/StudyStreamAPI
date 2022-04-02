const express = require('express')
const router = express.Router()

const {
    createStudySet,
    getStudySets,
    updateStudySet,
    getStudySet,
    deleteStudySet,
} = require('../controllers/studySet')

router.route('/').post(createStudySet).get(getStudySets)

router.route('/:id').patch(updateStudySet).get(getStudySet).delete(deleteStudySet)

module.exports = router