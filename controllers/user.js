const User = require('../models/user')
const { DoesNotExistError } = require('../errors')

const getUser = async (req, res) => {
    const { id } = req.params
    const user = await User.findById(id).select('-password')
    if (!user) {
        throw new DoesNotExistError('User does not exist with provided id')
    }
    res.status(200).json(user)
}

const getCurrentUser = async (req, res) => {
    const { userId } = req.user
    const user = await User.findById(userId)
        .select('-password')
        .populate('recentlyViewedSets')
    if (!user) {
        throw new DoesNotExistError('User does not exist with provided id')
    }
    res.status(200).json(user)
}

const updateUser = async (req, res) => {
    const { id } = req.params
    const { email, username, password, userImage, spotifyRefreshToken } = req.body

    const user = await User.findByIdAndUpdate(
        id,
        { email, username, password, userImage, spotifyRefreshToken },
        { runValidators: true, new: true }
    )
    res.status(200).json(user)
}

module.exports = { getUser, getCurrentUser, updateUser }