const BadRequestError = require('./BadRequestError')
const DoesNotExistError = require('./DoesNotExistError')
const UnauthorizedError = require('./UnauthorizedError')
const CustomError = require('./CustomError')

module.exports = {
    BadRequestError,
    CustomError,
    DoesNotExistError,
    UnauthorizedError,
}