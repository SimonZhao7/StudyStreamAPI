const BadRequestError = require('./BadRequestError')
const DoesNotExist = require('./DoesNotExist')
const UnauthorizedError = require('./UnauthorizedError')
const CustomError = require('./CustomError')

module.exports = {
    BadRequestError,
    CustomError,
    DoesNotExist,
    UnauthorizedError,
}