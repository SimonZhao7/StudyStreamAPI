const { CustomError } = require('../errors')

const errorHandler = (err, req, res, next) => {
    let errors = []

    if (err instanceof CustomError) {
        const { fieldName, message } = err
        errors.push({
            field: fieldName,
            message,
        })
    } else if (err.name === 'ValidationError') {
        const { errors: raisedErrors } = err
        // Get only the message of each error and add to errors array to be returned
        Object.keys(raisedErrors).forEach((error) => {
            errors.push({ field: error, message: raisedErrors[error].message })
        })
    }
    return res.status(err.statusCode || 400).json(errors)
}

module.exports = errorHandler
