const StudySet = require('../models/studySet')

const createStudySet = async (req, res) => {
    const studySet = await StudySet.create({ ...req.body, creator: req.user.userId })
    res.status(201).json(studySet)
}

const getStudySets = async (req, res) => {
    const studySets = await StudySet.find({})
    res.status(200).json(studySets)
}

const getStudySet = async (req, res) => {
    const { userId } = req.user
    const { id } = req.params
    const studySet = await StudySet.find({ _id: id, creator: userId })
    res.status(200).json(studySet)
}

const updateStudySet = async (req, res) => {
    const { id } = req.params
    const studySet = await StudySet.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    res.status(200).json(studySet)
}

const deleteStudySet = async (req, res) => {
    const { id } = req.params
    await StudySet.findByIdAndDelete(id)
    res.status(200).json({ msg: 'Successfully Removed' })
}

module.exports = { createStudySet, getStudySets, getStudySet, updateStudySet, deleteStudySet }