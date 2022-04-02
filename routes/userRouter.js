const express = require('express')
const router = express.Router()

const { getUser, getCurrentUser } = require('../controllers/user')

router.route('/current').get(getCurrentUser)

router.route('/:id').get(getUser)

module.exports = router