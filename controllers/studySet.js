const StudySet = require('../models/studySet')

const createStudySet = async (req, res) => {
    const studySet = await StudySet.create({ ...req.body, creator: req.user.userId })
    res.status(201).json({ studySet })
}

module.exports = { createStudySet }