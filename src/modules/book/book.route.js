const express = require('express');
const { query, body, param, validationResult } = require('express-validator');
const bookController = require('./book.controller');

const router = express.Router();

const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
  query('sortBy').optional().isIn(['asc', 'desc']).withMessage('sortBy must be either "asc" or "desc"'),
];

const genreIdsValidation = query('genreIds')
  .optional()
  .custom((value) => {
    if (!value) return true;
    const ids = value.split(',');
    return ids.every((id) => !isNaN(parseInt(id, 10)));
  })
  .withMessage('genreIds must be a comma-separated list of integers');

router.post(
  '/',
  [
    body('judul').notEmpty().withMessage('Judul is required'),
    body('genreIds').isArray().withMessage('genreIds must be an array'),
    body('genreIds.*').isInt().withMessage('Each genreId must be an integer'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    bookController.create(req, res, next);
  }
);

router.get('/', paginationValidation, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  bookController.findAll(req, res, next);
});

router.get(
  '/search',
  [
    paginationValidation,
    genreIdsValidation,
    query('search').optional().isString().withMessage('Search must be a string'),
    query('creator').optional().isString().withMessage('Creator must be a string'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    bookController.searchByCombined(req, res, next);
  }
);

router.get(
  '/:id',
  [param('id').isInt().withMessage('ID must be an integer')],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    bookController.findOne(req, res, next);
  }
);

router.put(
  '/:id',
  [
    param('id').isInt().withMessage('ID must be an integer'),
    body('genreIds').optional().isArray().withMessage('genreIds must be an array'),
    body('genreIds.*').optional().isInt().withMessage('Each genreId must be an integer'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    bookController.update(req, res, next);
  }
);

router.delete(
  '/:id',
  [param('id').isInt().withMessage('ID must be an integer')],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    bookController.remove(req, res, next);
  }
);

module.exports = router;