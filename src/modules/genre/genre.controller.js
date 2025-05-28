const genreService = require('./genre.service');

const create = async (req, res, next) => {
  try {
    const genre = await genreService.create(req.body);
    res.status(201).json(genre);
  } catch (err) {
    next(err);
  }
};

const findAll = async (req, res, next) => {
  try {
    const genres = await genreService.findAll();
    res.json(genres);
  } catch (err) {
    next(err);
  }
};

const findOne = async (req, res, next) => {
  try {
    const genre = await genreService.findOne(parseInt(req.params.id, 10));
    res.json(genre);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const genre = await genreService.update(parseInt(req.params.id, 10), req.body);
    res.json(genre);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await genreService.remove(parseInt(req.params.id, 10));
    res.json({ message: 'Genre deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  create,
  findAll,
  findOne,
  update,
  remove,
};