const express = require('express');
const { body, param, validationResult } = require('express-validator');
const genreController = require('./genre.controller');

const router = express.Router();

// POST /api/genres
router.post(
  '/',
  [
    body('nama').isString().notEmpty().withMessage('Nama is required and must be a string'),
    body('deskripsi').optional().isString().withMessage('Deskripsi must be a string'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    genreController.create(req, res, next);
  }
);

// GET /api/genres
router.get('/', genreController.findAll);

// GET /api/genres/:id
router.get(
  '/:id',
  [param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer')],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    genreController.findOne(req, res, next);
  }
);

// PUT /api/genres/:id
router.put(
  '/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
    body('nama').optional().isString().notEmpty().withMessage('Nama must be a non-empty string'),
    body('deskripsi').optional().isString().withMessage('Deskripsi must be a string'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    genreController.update(req, res, next);
  }
);

// DELETE /api/genres/:id
router.delete(
  '/:id',
  [param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer')],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    genreController.remove(req, res, next);
  }
);

module.exports = router;