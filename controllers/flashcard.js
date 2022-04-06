const { DoesNotExistError } = require('../errors')
const Flashcard = require('../models/flashcard')

const getFlashcard = async (req, res) => {
    const { id } = req.params
    const flashcard = await Flashcard.findById(id)

    if (!flashcard) {
        throw new DoesNotExistError('Flashcard does not exist with provided id')
    }

    res.status(200).json(flashcard)
}

const createFlashcard = async (req, res) => {
    const flashcard = await Flashcard.create(req.body)
    res.status(201).json(flashcard)
}

module.exports = { getFlashcard, createFlashcard }