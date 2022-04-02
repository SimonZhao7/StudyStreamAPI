const CustomError = require('./CustomError')

class DoesNotExist extends CustomError {
    constructor(msg, fieldName) {
        super(msg, fieldName || '', 404); // Usually not a input field related error
    }
}

module.exports = DoesNotExist