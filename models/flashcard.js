const mongoose = require('mongoose')
const StudySet = require('./studySet')

const flashcardSchema = mongoose.Schema({
    question: {
        type: String,
        trim: true,
        required: [true, 'No question provided'],
    },
    answer: {
        type: String,
        trim: true,
        required: [true, 'No answer provided'],
    },
    studySet: {
        type: mongoose.Types.ObjectId,
        ref: 'StudySet',
        required: [true, 'No StudySet reference provided'],
    }
})

flashcardSchema.post('save', async function() {
    const { studySet: setId } = this
    const studySet = await StudySet.findById(setId)
    await StudySet.findByIdAndUpdate(setId, { flashcards: [...studySet.flashcards, this._id] })
})

module.exports = mongoose.model('Flashcard', flashcardSchema)