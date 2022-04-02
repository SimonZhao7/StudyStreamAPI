const User = require('../models/user');
const { BadRequestError } = require('../errors');

const register = async (req, res) => {
    const { password, confirmPassword } = req.body

    if (!confirmPassword) {
        throw new BadRequestError('No password confirmation provided', 'confirmPassword')
    }
    if (password !== confirmPassword) {
        throw new BadRequestError('Paswords do not match', ['password', 'confirmPassword'])
    }

    const user = await User.create(req.body)
    const token = await user.getJWT()
    res.status(201).json(token)
}

const login = async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username })

    if (!user || ! await user.checkPassword(password)) {
        throw new BadRequestError('Incorrect username or password', ['username', 'password'])
    }
    const token = await user.getJWT()
    res.status(200).json(token)
}

module.exports = { register, login }