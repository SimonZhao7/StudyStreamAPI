const User = require('../models/user')
const { DoesNotExistError, BadRequestError } = require('../errors')
const storage = require('../config')

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
        spotifyRefreshToken,
    } = req.body

    const user = await User.findOne({ _id: id })
    let userImage = user.userImage

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

    if (req.files) {
        const { name, data } = req.files.userImage
        const bucketName = process.env.BUCKET_NAME
        await storage.bucket(bucketName).file(name).save(data)
        userImage = encodeURI(`https://storage.googleapis.com/${bucketName}/${name}`)
    }

    const result = await User.updateOne(
        { _id: id },
        {
            email,
            username,
            userImage,
            spotifyRefreshToken,
        },
        {
            runValidators: true,
        }
    )

    const updatedUser = await User.findById(id)
    res.status(200).json({ result, updatedUser })
}

module.exports = { getUser, getCurrentUser, updateUser }
