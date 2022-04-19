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

const updateFlashcard = async (req, res) => {
    const { userId } = req.user
    const { id } = req.params

    const flashcard = await Flashcard.findById(id)

    if (!flashcard || !flashcard.getStudySet(userId)) {
        throw new DoesNotExistError('Flashcard does not exist with provided id')
    }

    const updatedFlashcard = await Flashcard.findByIdAndUpdate(id, req.body, { runValidators: true, new: true })
    res.status(200).json(updatedFlashcard)
}

const deleteFlashcard = async (req, res) => {
    const { userId } = req.user
    const { id } = req.params
    const flashcard = await Flashcard.findById(id)

    // Make sure user owns this flashcard
    if (!flashcard || !await flashcard.getStudySet(userId)) {
        throw new DoesNotExistError('Flashcard does not exist with provided id')
    }

    await flashcard.removeFromSet(id)
    await Flashcard.deleteOne({ _id: id })
    res.status(200).json({ msg: 'Successfully deleted' })
}

module.exports = { getFlashcard, createFlashcard, deleteFlashcard, updateFlashcard }