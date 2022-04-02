const CustomError = require('./CustomError')

class UnauthorizedError extends CustomError {
    constructor(msg, fieldName) {
        super(msg, fieldName || '', 401)
    }
}

module.exports = UnauthorizedError