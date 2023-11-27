class ServerError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message)
        this.statusCode = statusCode
        this.isOperational = isOperational
        if (this.isOperational) {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

class InternalServerError extends ServerError {
    constructor(message = 'internal server error') {
        super(message, 500)
    }
}

module.exports = { InternalServerError }