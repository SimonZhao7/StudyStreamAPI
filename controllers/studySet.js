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
    const { user, sort, select, title, limit, page } = req.query

    const resultLimit = limit || 20

    const query = StudySet.find({})
    const countQuery = StudySet.find({})

    if (user) {
        query.find({ creator: user })
        countQuery.find({ creator: user })
    }

    if (title) {
        query.find({ $text: { $search: title } })
        countQuery.find({ $text: { $search: title } })
    }

    if (sort) {
        sortString = sort.split(',').join(' ')
        query.sort(sortString)
    }

    if (select) {
        selectString = select.split(',').join(' ')
        query.select(selectString)
    }

    if (page) {
        query.skip((page - 1) * resultLimit)
    }

    query.limit(resultLimit)

    const studySets = await query
    const totalStudySets = (await countQuery).length
    res.status(200).json({
        studySets,
        maxPages: Math.ceil(totalStudySets / resultLimit),
    })
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
