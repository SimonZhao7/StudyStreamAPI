const express = require('express')
const router = express.Router()

const { getFlashcard, createFlashcard, deleteFlashcard } = require('../controllers/flashcard')

router.route('/').post(createFlashcard)

router.route('/:id').get(getFlashcard).delete(deleteFlashcard)

module.exports = router