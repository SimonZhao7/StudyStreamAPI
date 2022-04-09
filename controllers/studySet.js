const StudySet = require('../models/studySet')
const { DoesNotExistError } = require('../errors')

const createStudySet = async (req, res) => {
    const studySet = await StudySet.create({
        ...req.body,
        creator: req.user.userId,
    })
    res.status(201).json(studySet)
}

const getStudySets = async (req, res) => {
    const studySets = await StudySet.find({})
    res.status(200).json(studySets)
}

const getStudySet = async (req, res) => {
    const { userId } = req.user
    const { id } = req.params

    const studySetById = await StudySet.findById(id).populate('flashcards')
    const studySet = await StudySet.findOne({
        _id: id,
        creator: userId,
    })

    if (!studySetById) {
        throw new DoesNotExistError('StudySet does not exist with provided id')
    }

    res.status(200).json({
        studySet: studySetById,
        editable: studySet !== null,
    })
}

const updateStudySet = async (req, res) => {
    const { id } = req.params
    const { userId } = req.user
    const studySet = await StudySet.findOneAndUpdate(
        { _id: id, creator: userId },
        req.body,
        { new: true, runValidators: true }
    )

    if (!studySet) {
        throw new DoesNotExistError('StudySet does not exist with provided id')
    }

    res.status(200).json(studySet)
}

const deleteStudySet = async (req, res) => {
    const { id } = req.params
    const { userId } = req.user
    const studySet = await StudySet.findOneAndDelete({
        _id: id,
        creator: userId,
    })

    if (!studySet) {
        throw new DoesNotExistError('StudySet does not exist with provided id')
    }
    res.status(200).json({ msg: 'Successfully Deleted' })
}

module.exports = {
    createStudySet,
    getStudySets,
    getStudySet,
    updateStudySet,
    deleteStudySet,
}