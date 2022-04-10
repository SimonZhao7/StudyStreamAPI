const express = require('express')
const router = express.Router()

const { getFlashcard, createFlashcard, deleteFlashcard, updateFlashcard } = require('../controllers/flashcard')

router.route('/').post(createFlashcard)

router.route('/:id').get(getFlashcard).delete(deleteFlashcard).patch(updateFlashcard)

module.exports = router