export const errHandler = (err, req, res, next) => {
  // Set default status code and status if not already defined
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log the error for the developer in development mode
  if (process.env.NODE_ENV === 'development') {
    console.error('ERROR 💥', err);
  }

  // Send a structured JSON response to the client
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    // Optionally include the stack trace in development
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}