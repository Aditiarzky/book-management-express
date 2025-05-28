const chapterService = require('./chapter.service');

const create = async (req, res, next) => {
  try {
    const chapter = await chapterService.create(req.body);
    res.status(201).json(chapter);
  } catch (err) {
    next(err);
  }
};

const findAll = async (req, res, next) => {
  try {
    const { page = '1', limit = '10', sortBy = 'desc' } = req.query;
    const result = await chapterService.findAll(
      parseInt(page, 10),
      parseInt(limit, 10),
      sortBy
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const findOne = async (req, res, next) => {
  try {
    const chapter = await chapterService.findOne(
      parseInt(req.params.id, 10),
      parseInt(req.query.bookId, 10)
    );
    res.json(chapter);
  } catch (err) {
    next(err);
  }
};

const findByBook = async (req, res, next) => {
  try {
    const chapters = await chapterService.findByBook(
      parseInt(req.params.bookId, 10),
      req.query.sortBy || 'desc'
    );
    res.json(chapters);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const chapter = await chapterService.update(parseInt(req.params.id, 10), req.body);
    res.json(chapter);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await chapterService.remove(parseInt(req.params.id, 10));
    res.json({ message: 'Chapter deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  create,
  findAll,
  findOne,
  findByBook,
  update,
  remove,
};