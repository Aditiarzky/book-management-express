const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.cookies['authToken'];
  if (!token) {
    const error = new Error('No token provided');
    error.status = 401;
    return next(error);
  }

  try {
    const JWT_SECRET = process.env.SECRET_KEY;
    if (!JWT_SECRET) {
      throw new Error('SECRET_KEY environment variable is not set');
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.sub, email: decoded.email };
    next();
  } catch (err) {
    const error = new Error('Invalid or expired token');
    error.status = 401;
    next(error);
  }
};

module.exports = authMiddleware;