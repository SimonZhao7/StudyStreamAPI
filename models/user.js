const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, 'No email provided'],
        match: [
            /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
            'Not a valid email',
        ],
        unique: true,
    },
    username: {
        type: String,
        required: [true, 'No username provided'],
        minLength: [6, 'Username must be at least 6 characters long'],
        maxLength: [30, 'Username may not be longer than 30 characters'],
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'No password provided'],
        minLength: [8, 'Password must be at lease 8 characters long'],
        trim: true,
    },
    userImage: {
        type: String,
        default:
            'https://storage.googleapis.com/user-account-imgs/no-profile-img.png',
    },
    studySets: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'StudySet',
        },
    ],
    recentlyViewedSets: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'StudySet',
        },
    ],
    spotifyRefreshToken: {
        type: String
    }
})

userSchema.methods.getJWT = async function () {
    const { _id: userId } = this
    const payload = { userId }
    const token = await jwt.sign(payload, process.env.JWTOKEN, {
        expiresIn: '30d',
    })
    return token
}

userSchema.methods.checkPassword = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.password)
}

userSchema.methods.addViewedStudySet = async function (studySetId) {
    const recentViewedSets = this.recentlyViewedSets
    if (!recentViewedSets.includes(studySetId)) {
        if (recentViewedSets.length + 1 > 6) {
            recentViewedSets.shift()
            const studySet = await mongoose
                .model('StudySet')
                .findById(studySetId)
            await mongoose
                .model('StudySet')
                .findByIdAndUpdate(
                    studySetId,
                    {
                        recentlyViewedUsers:
                            studySet.recentlyViewedUsers.splice(this._id, 1),
                    },
                    { runValidators: true }
                )
        }

        await mongoose
            .model('User')
            .findByIdAndUpdate(
                this._id,
                { recentlyViewedSets: [...recentViewedSets, studySetId] },
                { runValidators: true }
            )
    }
}

userSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(15)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
})

module.exports = mongoose.model('User', userSchema)
