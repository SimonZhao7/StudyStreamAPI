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
    },
})

flashcardSchema.post('save', async function () {
    const { studySet: setId } = this
    const studySet = await StudySet.findById(setId)
    await StudySet.findByIdAndUpdate(setId, {
        flashcards: [...studySet.flashcards, this._id],
    })
})

flashcardSchema.methods.removeFromSet = async function() {
    const { studySet: setId } = this
    const { flashcards } = await StudySet.findById(setId)
   
    await StudySet.findByIdAndUpdate(setId, {
        flashcards: flashcards.filter(f => String(f._id) !== String(this._id))
    })
}

flashcardSchema.methods.getStudySet = async function (userId) {
    return await StudySet.findOne({ id: this.studySet, creator: userId })
}

module.exports = mongoose.model('Flashcard', flashcardSchema)