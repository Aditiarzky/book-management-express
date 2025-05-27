function errorHandler(err, req, res, next) {
  console.error('Error:', err.stack); // Log error untuk debugging
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
}

module.exports = errorHandler;