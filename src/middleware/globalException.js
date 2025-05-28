function globalException(err, req, res, next) {
  let status = err.status || 500;
  let message = err.message || 'Internal server error';
  let errorResponse = {};

  if (err.array && typeof err.array === 'function') {
    status = 400;
    message = 'Validation failed';
    errorResponse = { errors: err.array() };
  } else if (err.status) {
    errorResponse = { error: err.message };
  } else {
    console.error('Unhandled Error:', err);
  }

  res.status(status).json({
    success: false,
    message,
    data: null,
    ...(process.env.NODE_ENV === 'development' && { error: errorResponse }),
  });
}

module.exports = globalException;