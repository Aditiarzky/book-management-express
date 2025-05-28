const bookService = require('./book.service');

const create = async (req, res, next) => {
  try {
    const book = await bookService.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
};

const findAll = async (req, res, next) => {
  try {
    const { page = '1', limit = '10', sortBy = 'desc' } = req.query;
    const result = await bookService.findAll(
      parseInt(page, 10),
      parseInt(limit, 10),
      sortBy
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const searchByCombined = async (req, res, next) => {
  try {
    const { genreIds, search, creator, sortBy = 'desc', page = '1', limit = '10' } = req.query;
    const parsedGenreIds = genreIds ? genreIds.split(',').map(id => parseInt(id, 10)) : undefined;
    const result = await bookService.findBySearchCombination(
      parsedGenreIds,
      search,
      creator,
      sortBy,
      parseInt(page, 10),
      parseInt(limit, 10)
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const findOne = async (req, res, next) => {
  try {
    const book = await bookService.findOne(parseInt(req.params.id, 10));
    res.json(book);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const book = await bookService.update(parseInt(req.params.id, 10), req.body);
    res.json(book);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await bookService.remove(parseInt(req.params.id, 10));
    res.json({ message: 'Book deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  create,
  findAll,
  searchByCombined,
  findOne,
  update,
  remove,
};