class CustomError extends Error {
    constructor(msg, fieldName, statusCode) {
        super(msg)
        this.fieldName = fieldName
        this.statusCode = statusCode
    }
}

module.exports = CustomError