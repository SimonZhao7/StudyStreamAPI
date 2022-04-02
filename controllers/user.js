const User = require('../models/user')
const { DoesNotExist } = require('../errors')

const getUser = async (req, res) => {
    const { id } = req.params
    const user = await User.findById(id).select('-password')
    if (!user) {
        throw new DoesNotExist('User does not exist with provided id')
    }
    res.status(200).json({ user })
}

const getCurrentUser = async (req, res) => {
    res.status(200).json(req.user)
}

module.exports = { getUser, getCurrentUser }