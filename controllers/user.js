const User = require('../models/user')
const { DoesNotExistError, BadRequestError } = require('../errors')

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
    const {
        email,
        username,
        password,
        newPassword,
        confirmPassword,
        userImage,
        spotifyRefreshToken,
    } = req.body

    const user = await User.findOne({ _id: id })

    if (
        (email !== undefined ||
            username !== undefined ||
            newPassword !== undefined) &&
        !(await user.checkPassword(password || ''))
    ) {
        throw new BadRequestError('Incorrect Password', 'password')
    }

    if (newPassword) {
        if (newPassword === confirmPassword) {
            const testUser = await User.findOne({ _id: id })
            testUser.password = newPassword
            testUser.markModified('password')
            await testUser.save()
        } else {
            throw new BadRequestError('Passwords do not match', [
                'newPassword',
                'confirmPassword',
            ])
        }
    }

    const updatedUser = await User.findByIdAndUpdate(
        id,
        {
            email,
            username,
            userImage,
            spotifyRefreshToken,
        },
        { runValidators: true, new: true }
    )

    res.status(200).json(updatedUser)
}

module.exports = { getUser, getCurrentUser, updateUser }
