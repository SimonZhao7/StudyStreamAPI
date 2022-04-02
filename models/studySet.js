const mongoose = require('mongoose')

const studySetSchema = mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'No title provided'],
        minLength: [3, 'Title must be at lease 3 characters long'],
    },
    creator: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    recentlyViewedUsers: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
    flashcards: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Flashcard'
        }
    ]
}, { timestamp: true })

module.exports = mongoose.model('StudySet', studySetSchema)