class AppError extends Error {
  constructor(message, statusCode) {
    super(message) // Pass the message to the parent Error class

    this.statusCode = statusCode
    // Set status based on the status code (fail for 4xx, error for 5xx)
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'

    // Capture the stack trace, excluding the constructor call from it
    Error.captureStackTrace(this, this.constructor)
  }
}

export default AppError