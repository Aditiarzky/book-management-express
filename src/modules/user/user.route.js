const express = require('express');
const { body, validationResult } = require('express-validator');
const userController = require('./user.controller');
const authMiddleware = require('../../middleware/auth');

const router = express.Router();

// POST /api/users/register
router.post(
  '/register',
  [
    body('name').isString().notEmpty().withMessage('Name is required and must be a string'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    userController.register(req, res, next);
  }
);

// GET /api/users/me
router.get('/me', authMiddleware, userController.getProfile);

// PUT /api/users/me
router.put(
  '/me',
  authMiddleware,
  [
    body('name').optional().isString().notEmpty().withMessage('Name must be a non-empty string'),
    body('email').optional().isEmail().withMessage('Invalid email format'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    userController.updateProfile(req, res, next);
  }
);

// DELETE /api/users/me
router.delete('/me', authMiddleware, userController.deleteProfile);

module.exports = router;