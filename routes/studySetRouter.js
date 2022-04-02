const express = require('express')
const router = express.Router()

const { createStudySet } = require('../controllers/studySet')

router.route('/').post(createStudySet)

module.exports = router