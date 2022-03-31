const CustomError = require('./CustomError')

class BadRequestError extends CustomError {
    constructor(msg, fieldName) {
        super(msg, fieldName, 400)
    }
}

module.exports = BadRequestError