const { UnauthorizedError } = require('../errors')
const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    const auth = req.headers.authorization

    if (!auth || !auth.startsWith('Bearer')) {
        throw new UnauthorizedError('Not authorized')
    }

    try {
        const token = auth.split(' ')[1]
        const payload = jwt.verify(token, process.env.JWTOKEN)
        req.user = payload
        next()
    } catch (error) {
        throw new UnauthorizedError('Not authorized')
    }
}

module.exports = authMiddleware