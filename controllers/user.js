const User = require('../models/user');
const { BadRequestError } = require('../errors');

const register = async (req, res) => {
    const { password, confirmPassword } = req.body

    if (!confirmPassword) {
        throw new BadRequestError('No password confirmation provided', 'confirmPassword')
    }
    if (password !== confirmPassword) {
        throw new BadRequestError('Paswords do not match', 'password')
    }

    const user = await User.create(req.body)
    const token = await user.getJWT()
    res.status(201).json({ token })
}

module.exports = { register }