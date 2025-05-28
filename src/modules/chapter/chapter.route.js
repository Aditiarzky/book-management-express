const express = require('express');
const { query, body, param, validationResult } = require('express-validator');
const chapterController = require('./chapter.controller');

const router = express.Router();

// Validasi untuk query pagination dan sortBy
const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
  query('sortBy').optional().isIn(['asc', 'desc']).withMessage('sortBy must be either "asc" or "desc"'),
];

// POST /api/chapters
router.post(
  '/',
  [
    body('bookId').isInt({ min: 1 }).withMessage('Book ID must be a positive integer'),
    body('chapter').isInt({ min: 1 }).withMessage('Chapter must be a positive integer'),
    body('volume').optional().isInt({ min: 1 }).withMessage('Volume must be a positive integer'),
    body('nama').optional().isString().withMessage('Nama must be a string'),
    body('thumbnail').optional().isString().withMessage('Thumbnail must be a string'),
    body('isigambar').optional().isArray().withMessage('Isigambar must be an array'),
    body('isitext').optional().isString().withMessage('Isitext must be a string'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    chapterController.create(req, res, next);
  }
);

// GET /api/chapters
router.get('/', paginationValidation, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  chapterController.findAll(req, res, next);
});

// GET /api/chapters/:id
router.get(
  '/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('Chapter ID must be a positive integer'),
    query('bookId').isInt({ min: 1 }).withMessage('Book ID must be a positive integer'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    chapterController.findOne(req, res, next);
  }
);

// GET /api/chapters/book/:bookId
router.get(
  '/book/:bookId',
  [
    param('bookId').isInt({ min: 1 }).withMessage('Book ID must be a positive integer'),
    query('sortBy').optional().isIn(['asc', 'desc']).withMessage('sortBy must be either "asc" or "desc"'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    chapterController.findByBook(req, res, next);
  }
);

// PUT /api/chapters/:id
router.put(
  '/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('Chapter ID must be a positive integer'),
    query('bookId').isInt({ min: 1 }).withMessage('Book ID must be a positive integer'),
    body('bookId').optional().isInt({ min: 1 }).withMessage('Book ID must be a positive integer'),
    body('chapter').optional().isInt({ min: 1 }).withMessage('Chapter must be a positive integer'),
    body('volume').optional().isInt({ min: 1 }).withMessage('Volume must be a positive integer'),
    body('nama').optional().isString().withMessage('Nama must be a string'),
    body('thumbnail').optional().isString().withMessage('Thumbnail must be a string'),
    body('isigambar').optional().isArray().withMessage('Isigambar must be an array'),
    body('isitext').optional().isString().withMessage('Isitext must be a string'),
    body().custom((value, { req }) => {
      if (value.bookId && value.bookId !== parseInt(req.query.bookId, 10)) {
        throw new Error('Book ID in body must match Book ID in query');
      }
      return true;
    }),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    chapterController.update(req, res, next);
  }
);

// DELETE /api/chapters/:id
router.delete(
  '/:id',
  [param('id').isInt({ min: 1 }).withMessage('Chapter ID must be a positive integer')],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    chapterController.remove(req, res, next);
  }
);

module.exports = router;