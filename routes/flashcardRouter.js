const express = require('express')
const router = express.Router()

const { getFlashcard, createFlashcard } = require('../controllers/flashcard')

router.route('/').post(createFlashcard)

router.route('/:id').get(getFlashcard)

module.exports = router