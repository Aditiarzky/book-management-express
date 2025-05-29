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
    body('volume')
      .optional({ nullable: true }) 
      .isInt({ min: 1 })
      .withMessage('Volume must be a positive integer'),
    body('nama')
      .optional({ nullable: true }) 
      .isString()
      .withMessage('Nama must be a string'),
    body('thumbnail')
      .optional({ nullable: true }) 
      .isString()
      .withMessage('Thumbnail must be a string'),
    body('isigambar')
      .optional({ nullable: true }) 
      .custom((value) => {
        if (value === null || value === undefined) return true;
        if (Array.isArray(value)) {
          return value.every((item) => typeof item === 'string');
        }
        if (typeof value === 'string') {
          try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) && parsed.every((item) => typeof item === 'string');
          } catch {
            throw new Error('Isigambar must be a valid JSON array of strings');
          }
        }
        throw new Error('Isigambar must be an array or a valid JSON array string');
      })
      .withMessage('Isigambar must be an array or a valid JSON array string'),
    body('isitext')
      .optional({ nullable: true }) 
      .isString()
      .withMessage('Isitext must be a string'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array()); 
      return res.status(400).json({ success: false, errors: errors.array() }); // Ensure consistent error response
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

router.put(
  '/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('Chapter ID must be a positive integer'),
    query('bookId').isInt({ min: 1 }).withMessage('Book ID must be a positive integer'),
    body('bookId')
      .optional({ nullable: true }) // Allow null
      .isInt({ min: 1 })
      .withMessage('Book ID must be a positive integer'),
    body('chapter')
      .optional({ nullable: true }) // Allow null
      .isInt({ min: 1 })
      .withMessage('Chapter must be a positive integer'),
    body('volume')
      .optional({ nullable: true }) // Allow null
      .isInt({ min: 1 })
      .withMessage('Volume must be a positive integer'),
    body('nama')
      .optional({ nullable: true }) // Allow null
      .isString()
      .withMessage('Nama must be a string'),
    body('thumbnail')
      .optional({ nullable: true }) // Allow null
      .isString()
      .withMessage('Thumbnail must be a string'),
    body('isigambar')
      .optional({ nullable: true }) // Allow null
      .custom((value) => {
        if (value === null || value === undefined) return true;
        if (Array.isArray(value)) {
          return value.every((item) => typeof item === 'string');
        }
        if (typeof value === 'string') {
          try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) && parsed.every((item) => typeof item === 'string');
          } catch {
            throw new Error('Isigambar must be a valid JSON array of strings');
          }
        }
        throw new Error('Isigambar must be an array or a valid JSON array string');
      })
      .withMessage('Isigambar must be an array or a valid JSON array string'),
    body('isitext')
      .optional({ nullable: true })
      .isString()
      .withMessage('Isitext must be a string'),
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
      console.log('Validation errors:', errors.array()); // Log errors for debugging
      return res.status(400).json({ success: false, errors: errors.array() });
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