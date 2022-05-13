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
    } else if (err.name === 'CastError') {
        const modelName = err.message.split('\"')[5]
        err.statusCode = 404
        errors.push({
            field: '',
            message: `${modelName} does not exist with provided id`
        })
    } else if (err.code === 'ERR_BAD_REQUEST') {
        const { status, message } = err.response.data.error
        err.statusCode = status
        errors.push({
            field: '',
            message: message
        })
    }
    return res.status(err.statusCode || 400).json(errors)
}

module.exports = errorHandler
