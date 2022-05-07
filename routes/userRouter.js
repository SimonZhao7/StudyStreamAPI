const express = require('express')
const router = express.Router()

const { getUser, getCurrentUser, updateUser } = require('../controllers/user')

router.route('/current').get(getCurrentUser)

router.route('/:id').get(getUser).patch(updateUser)

module.exports = router