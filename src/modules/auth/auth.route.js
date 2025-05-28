const express = require('express');
const { body, validationResult } = require('express-validator');
const authController = require('./auth.controller');

const router = express.Router();

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    authController.login(req, res, next);
  }
);

// POST /api/auth/logout
router.post('/logout', authController.logout);

module.exports = router;