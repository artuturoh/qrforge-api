export function errorHandler(err, req, res, next) {
  // If headers already sent, delegate to Express default handler
  if (res.headersSent) {
    return next(err);
  }

  // Handle JSON body syntax errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message: 'Malformed JSON payload in request body'
      }
    });
  }

  // Handle custom validation errors
  if (err.name === 'ValidationError' || err.statusCode === 400) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message: err.message
      }
    });
  }

  // Unexpected server error
  const statusCode = err.statusCode || err.status || 500;
  return res.status(statusCode).json({
    success: false,
    error: {
      code: statusCode === 404 ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected internal error occurred'
    }
  });
}
